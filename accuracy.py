import pandas as pd
import requests
import json
import time
from typing import Dict, List, Tuple
import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

class AccuracyTester:
    def __init__(self, csv_file_path: str, api_base_url: str = "http://localhost:8080/fuzzy"):
        """
        Initialize the accuracy tester
        
        Args:
            csv_file_path: Path to CSV file containing test data
            api_base_url: Base API endpoint URL (will append ID)
        """
        self.csv_file_path = csv_file_path
        self.api_base_url = api_base_url
        self.results = []
        
    def load_data(self) -> pd.DataFrame:
        """Load data from CSV file"""
        try:
            df = pd.read_csv(self.csv_file_path)
            print(f"Data loaded successfully: {len(df)} rows")
            return df
        except Exception as e:
            print(f"Error loading data: {e}")
            return None
    
    def prepare_api_payload(self, row: pd.Series) -> Tuple[str, int]:
        """
        Prepare API URL and get CSV row index for mapping
        
        Args:
            row: DataFrame row containing student data
            
        Returns:
            Tuple of (API URL, CSV row number for mapping)
        """
        # CSV row number starts from 1, but we need to map to student ID starting from 2
        csv_row_number = row.name + 1  # row.name is 0-indexed, so +1 gives us 1, 2, 3...
        student_id = csv_row_number + 1  # Map CSV row 1 to student ID 2, row 2 to ID 3, etc.
        
        api_url = f"{self.api_base_url}/{student_id}"
        return api_url, csv_row_number
    
    def call_api(self, api_url: str) -> Dict:
        """
        Make API request and return response
        
        Args:
            api_url: Full API URL to call
            
        Returns:
            API response dictionary
        """
        try:
            response = requests.get(api_url)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"API Error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"Request error: {e}")
            return None
    
    def extract_prediction(self, api_response: Dict) -> str:
        """
        Extract category prediction from API response
        
        Args:
            api_response: Full API response
            
        Returns:
            Predicted category string
        """
        if api_response and 'data' in api_response:
            return api_response['data'].get('category', 'Unknown')
        return 'Unknown'
    
    def test_accuracy(self, sample_size: int = None, delay: float = 0.1) -> Dict:
        """
        Test accuracy by comparing API predictions with actual labels
        
        Args:
            sample_size: Number of samples to test (None for all data)
            delay: Delay between API calls in seconds
            
        Returns:
            Dictionary containing accuracy metrics
        """
        # Load data
        df = self.load_data()
        if df is None:
            return None
        
        # Limit sample size if specified
        if sample_size:
            df = df.head(sample_size)
            
        print(f"Testing {len(df)} samples...")
        
        actual_labels = []
        predicted_labels = []
        failed_requests = 0
        
        # Process each row
        for index, row in df.iterrows():
            print(f"Processing sample {index + 1}/{len(df)}", end='\r')
            
            # Prepare API URL and get mapping info
            api_url, csv_row_number = self.prepare_api_payload(row)
            
            print(f"Testing CSV row {csv_row_number} -> API ID {api_url.split('/')[-1]}")
            
            # Make API request
            api_response = self.call_api(api_url)
            
            if api_response:
                # Extract prediction
                prediction = self.extract_prediction(api_response)
                actual = row['Performance']
                
                # Store results
                actual_labels.append(actual)
                predicted_labels.append(prediction)
                
                # Store detailed results
                self.results.append({
                    'csv_row': csv_row_number,
                    'student_id': int(api_url.split('/')[-1]),
                    'actual': actual,
                    'predicted': prediction,
                    'correct': actual == prediction,
                    'gpa': row['GPA'],
                    'attendance': row['Attendance Rate'],
                    'api_response': api_response
                })
                
                print(f"CSV Row {csv_row_number} -> Student ID {api_url.split('/')[-1]}: {actual} vs {prediction} {'✓' if actual == prediction else '✗'}")
                
            else:
                failed_requests += 1
                print(f"\nFailed request for CSV row {csv_row_number} (Student ID: {api_url.split('/')[-1]})")
            
            # Add delay to avoid overwhelming the API
            time.sleep(delay)
        
        print(f"\nCompleted testing. Failed requests: {failed_requests}")
        
        # Calculate accuracy metrics
        if actual_labels and predicted_labels:
            accuracy = accuracy_score(actual_labels, predicted_labels)
            
            # Create detailed report
            report = {
                'total_samples': len(df),
                'successful_predictions': len(actual_labels),
                'failed_requests': failed_requests,
                'accuracy': accuracy,
                'accuracy_percentage': accuracy * 100,
                'classification_report': classification_report(actual_labels, predicted_labels),
                'confusion_matrix': confusion_matrix(actual_labels, predicted_labels),
                'actual_labels': actual_labels,
                'predicted_labels': predicted_labels
            }
            
            return report
        else:
            print("No successful predictions to calculate accuracy")
            return None
    
    def print_results(self, report: Dict):
        """Print detailed accuracy results"""
        if not report:
            print("No results to display")
            return
        
        print("\n" + "="*60)
        print("ACCURACY TEST RESULTS")
        print("="*60)
        print(f"Total samples: {report['total_samples']}")
        print(f"Successful predictions: {report['successful_predictions']}")
        print(f"Failed requests: {report['failed_requests']}")
        print(f"Accuracy: {report['accuracy']:.4f} ({report['accuracy_percentage']:.2f}%)")
        print("\nClassification Report:")
        print(report['classification_report'])
        
        # Show some examples of correct and incorrect predictions
        print("\nSample Results:")
        print("-" * 60)
        print(f"{'CSV Row':<8} {'Student ID':<10} {'Actual':<15} {'Predicted':<15} {'Status'}")
        print("-" * 60)
        for i, result in enumerate(self.results[:10]):  # Show first 10 results
            status = "✓ Correct" if result['correct'] else "✗ Wrong"
            print(f"{result['csv_row']:<8} {result['student_id']:<10} {result['actual']:<15} {result['predicted']:<15} {status}")
    
    def plot_confusion_matrix(self, report: Dict):
        """Plot confusion matrix"""
        if not report:
            return
        
        # Get unique labels
        labels = sorted(list(set(report['actual_labels'] + report['predicted_labels'])))
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(report['confusion_matrix'], 
                   annot=True, 
                   fmt='d', 
                   cmap='Blues',
                   xticklabels=labels,
                   yticklabels=labels)
        plt.title('Confusion Matrix')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.tight_layout()
        plt.show()
    
    def save_results(self, report: Dict, filename: str = 'accuracy_results.json'):
        """Save results to JSON file"""
        if not report:
            return
        
        # Convert numpy arrays to lists for JSON serialization
        report_copy = report.copy()
        report_copy['confusion_matrix'] = report_copy['confusion_matrix'].tolist()
        
        with open(filename, 'w') as f:
            json.dump(report_copy, f, indent=2)
        
        print(f"Results saved to {filename}")
    
    def analyze_errors(self) -> Dict:
        """Analyze incorrect predictions to find patterns"""
        if not self.results:
            return None
        
        errors = [r for r in self.results if not r['correct']]
        
        if not errors:
            print("No errors to analyze - perfect accuracy!")
            return None
        
        print(f"\nError Analysis ({len(errors)} errors out of {len(self.results)} predictions):")
        print("-" * 50)
        
        # Group errors by actual vs predicted
        error_patterns = {}
        for error in errors:
            pattern = f"{error['actual']} → {error['predicted']}"
            if pattern not in error_patterns:
                error_patterns[pattern] = []
            error_patterns[pattern].append(error)
        
        # Show error patterns
        for pattern, cases in error_patterns.items():
            print(f"{pattern}: {len(cases)} cases")
            
            # Show average characteristics for this error type
            avg_gpa = np.mean([case['gpa'] for case in cases])
            avg_attendance = np.mean([case['attendance'] for case in cases])
            print(f"  Average GPA: {avg_gpa:.2f}")
            print(f"  Average Attendance: {avg_attendance:.2f}")
            print()
        
        return error_patterns

# Example usage
if __name__ == "__main__":
    # Initialize tester
    tester = AccuracyTester('G:/users/Mydownloads/skripsi/re name judul/tsukamoto_beta3_v.0.0.3/tsukamoto_beta3/server/docs/datatest_beta_2_modified_strict.csv')
    
    # Test accuracy with 1000 samples
    print("Starting accuracy test with 1000 data...")
    print("Mapping: CSV Row 1 -> Student ID 2, CSV Row 2 -> Student ID 3, etc.")
    print("-" * 60)
    
    report = tester.test_accuracy(sample_size=1000, delay=0.1)
    
    if report:
        # Print results
        tester.print_results(report)
        
        # Plot confusion matrix
        tester.plot_confusion_matrix(report)
        
        # Save results
        tester.save_results(report)
        
        # Analyze errors
        tester.analyze_errors()
    
    print("\nAccuracy test completed!")