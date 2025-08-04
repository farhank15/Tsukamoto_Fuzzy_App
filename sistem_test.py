import pandas as pd
import requests
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import time

def load_csv_data(filename):
    """Load dan bersihkan data CSV"""
    try:
        df = pd.read_csv(filename)
        print(f"Data berhasil dimuat: {len(df)} records")
        print(f"Kolom yang tersedia: {list(df.columns)}")
        return df
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None

def get_api_prediction(student_id, base_url="http://localhost:8080/fuzzy"):
    """Ambil prediksi dari API sistem fuzzy"""
    try:
        url = f"{base_url}/{student_id}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            
            # Debug: print struktur response untuk troubleshooting
            # print(f"Response for ID {student_id}: {result}")
            
            # Berdasarkan struktur response yang Anda berikan
            if 'data' in result and 'category' in result['data']:
                return result['data']['category']
            
            # Fallback untuk struktur lama
            elif 'performance' in result:
                return result['performance']
            elif 'prediction' in result:
                return result['prediction'] 
            elif 'result' in result:
                return result['result']
            elif 'category' in result:
                return result['category']
            else:
                # Jika struktur berbeda, print untuk debug
                print(f"Unknown response structure for ID {student_id}: {result}")
                return None
        else:
            print(f"API Error for ID {student_id}: Status {response.status_code}")
            if response.status_code == 404:
                print(f"  Student ID {student_id} not found")
            return None
            
    except requests.exceptions.Timeout:
        print(f"Timeout for ID {student_id}")
        return None
    except requests.exceptions.ConnectionError:
        print(f"Connection Error for ID {student_id} - Pastikan server berjalan di {base_url}")
        return None
    except Exception as e:
        print(f"Error for ID {student_id}: {e}")
        return None

def normalize_performance_labels(label):
    """Normalisasi label performance untuk konsistensi"""
    if isinstance(label, str):
        label = label.strip()
        # Tidak perlu lowercase karena API mengembalikan proper case
        if label in ['Poor', 'poor', 'kurang']:
            return 'Poor'
        elif label in ['Needs Improvement', 'needs improvement', 'needs_improvement', 'perlu perbaikan']:
            return 'Needs Improvement'
        elif label in ['Satisfactory', 'satisfactory', 'memuaskan']:
            return 'Satisfactory'
        elif label in ['Good', 'good', 'baik']:
            return 'Good'
        elif label in ['Excellent', 'excellent', 'sangat baik']:
            return 'Excellent'
    return label

def test_system_accuracy(csv_file, max_records=1000, start_id=2, api_base_url="http://localhost:8080/fuzzy"):
    """Test akurasi sistem dengan confusion matrix"""
    
    print("=== TESTING CONFUSION MATRIX SISTEM FUZZY ===\n")
    
    # Load data CSV
    df = load_csv_data(csv_file)
    if df is None:
        return
    
    # Batasi jumlah data yang akan ditest
    test_records = min(len(df), max_records)
    print(f"Testing {test_records} records...\n")
    
    # Lists untuk menyimpan hasil
    actual_labels = []
    predicted_labels = []
    failed_predictions = []
    
    # Progress tracking
    success_count = 0
    
    print("Mulai testing...")
    print("Testing koneksi API...")
    
    # Test koneksi pertama
    test_prediction = get_api_prediction(start_id, base_url=api_base_url)
    if test_prediction is None:
        print("❌ Tidak dapat terhubung ke API. Pastikan:")
        print("   1. Server berjalan di", api_base_url)
        print("   2. Ada data dengan ID", start_id)
        return None
    else:
        print(f"✅ Koneksi API berhasil. Test prediction: {test_prediction}")
    
    print("\nMemulai testing batch...")
    for i in range(test_records):
        csv_row = df.iloc[i]
        system_id = start_id + i  # ID di sistem mulai dari start_id
        
        # Ambil label aktual dari CSV
        # Cek berbagai kemungkinan nama kolom performance
        actual_label = None
        possible_columns = ['Performance', 'performance', 'Category', 'category', 'Label', 'label']
        for col in possible_columns:
            if col in csv_row:
                actual_label = csv_row[col]
                break
        
        if actual_label is None:
            print(f"❌ Kolom performance tidak ditemukan. Available columns: {list(csv_row.index)}")
            return None
            
        actual_label = normalize_performance_labels(actual_label)
        
        # Ambil prediksi dari API
        predicted_label = get_api_prediction(system_id, base_url=api_base_url)
        predicted_label = normalize_performance_labels(predicted_label)
        
        if predicted_label is not None:
            actual_labels.append(actual_label)
            predicted_labels.append(predicted_label)
            success_count += 1
            
            # Show sample predictions for first few records
            if i < 5:
                print(f"Sample {i+1}: Actual='{actual_label}' vs Predicted='{predicted_label}' {'✅' if actual_label == predicted_label else '❌'}")
            
            if (i + 1) % 100 == 0:  # Progress update setiap 100 records
                current_accuracy = accuracy_score(actual_labels, predicted_labels)
                print(f"Progress: {i + 1}/{test_records} - Success: {success_count} - Current Accuracy: {current_accuracy:.4f} ({current_accuracy*100:.2f}%)")
        else:
            failed_predictions.append({
                'csv_id': i + 1,
                'system_id': system_id,
                'actual': actual_label
            })
        
        # Delay kecil untuk menghindari overload server
        time.sleep(0.05)  # Reduced delay
    
    print(f"\n🎯 TESTING SELESAI!")
    print(f"✅ Successful predictions: {success_count}/{test_records}")
    print(f"❌ Failed predictions: {len(failed_predictions)}")
    
    if success_count == 0:
        print("\n❌ Tidak ada prediksi yang berhasil!")
        print("Periksa:")
        print("1. Koneksi API dan format response")
        print("2. Range ID yang ada di sistem")
        print("3. Format response API")
        return None
    
    # Hitung akurasi
    accuracy = accuracy_score(actual_labels, predicted_labels)
    print(f"\n🎯 HASIL AKURASI FINAL: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification Report
    print("\n=== CLASSIFICATION REPORT ===")
    report = classification_report(actual_labels, predicted_labels)
    print(report)
    
    # Confusion Matrix
    labels = sorted(list(set(actual_labels + predicted_labels)))
    cm = confusion_matrix(actual_labels, predicted_labels, labels=labels)
    
    print("\n=== CONFUSION MATRIX ===")
    print("Labels:", labels)
    print(cm)
    
    # Plot Confusion Matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=labels, yticklabels=labels)
    plt.title(f'Confusion Matrix\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    plt.show()
    
    # Analisis per kelas
    print("\n=== ANALISIS PER KELAS ===")
    for i, label in enumerate(labels):
        true_positive = cm[i, i]
        total_actual = sum(cm[i, :])
        total_predicted = sum(cm[:, i])
        
        precision = true_positive / total_predicted if total_predicted > 0 else 0
        recall = true_positive / total_actual if total_actual > 0 else 0
        f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        
        print(f"📊 {label}:")
        print(f"   True Positive: {true_positive}")
        print(f"   Total Actual: {total_actual}")
        print(f"   Total Predicted: {total_predicted}")
        print(f"   Precision: {precision:.4f} ({precision*100:.2f}%)")
        print(f"   Recall: {recall:.4f} ({recall*100:.2f}%)")
        print(f"   F1-Score: {f1_score:.4f}")
        print()
    
    # Tampilkan prediksi yang salah
    print("\n=== ANALISIS PREDIKSI YANG SALAH ===")
    wrong_predictions = []
    for i, (actual, predicted) in enumerate(zip(actual_labels, predicted_labels)):
        if actual != predicted:
            wrong_predictions.append({
                'index': i+1,
                'actual': actual,
                'predicted': predicted
            })
    
    if wrong_predictions:
        print(f"Total prediksi salah: {len(wrong_predictions)}")
        print("Sample prediksi yang salah (10 pertama):")
        for wrong in wrong_predictions[:10]:
            print(f"  Record {wrong['index']}: Actual='{wrong['actual']}' → Predicted='{wrong['predicted']}'")
    else:
        print("🎉 Semua prediksi benar!")
    
    # Tampilkan beberapa failed API calls
    if failed_predictions:
        print(f"\n=== SAMPLE FAILED API CALLS ===")
        print("API calls yang gagal (10 pertama):")
        for fail in failed_predictions[:10]:
            print(f"  CSV ID: {fail['csv_id']}, System ID: {fail['system_id']}, Actual: '{fail['actual']}'")
    
    # Summary statistics
    total_tested = len(actual_labels)
    correct_predictions = sum(1 for a, p in zip(actual_labels, predicted_labels) if a == p)
    
    print(f"\n=== SUMMARY STATISTICS ===")
    print(f"📈 Total Records Tested: {total_tested}")
    print(f"✅ Correct Predictions: {correct_predictions}")
    print(f"❌ Wrong Predictions: {total_tested - correct_predictions}")
    print(f"🎯 Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"📊 Success Rate: {success_count}/{test_records} ({success_count/test_records*100:.2f}%)")
    
    return {
        'accuracy': accuracy,
        'accuracy_percentage': accuracy * 100,
        'confusion_matrix': cm,
        'labels': labels,
        'successful_predictions': success_count,
        'failed_predictions': len(failed_predictions),
        'total_tested': total_tested,
        'correct_predictions': correct_predictions,
        'wrong_predictions': total_tested - correct_predictions,
        'classification_report': classification_report(actual_labels, predicted_labels, output_dict=True),
        'wrong_predictions_detail': wrong_predictions
    }

def custom_test():
    """Fungsi untuk testing dengan parameter custom"""
    
    # Parameter yang bisa disesuaikan
    CSV_FILE = "./server/docs/datatest_beta_2.csv"  # Path ke file CSV
    MAX_RECORDS = 1000               # Maksimal records untuk ditest
    START_ID = 2                     # ID awal di sistem (karena ID 1 mungkin admin)
    API_BASE_URL = "http://localhost:8080/fuzzy"  # Base URL API
    
    print(f"📁 CSV File: {CSV_FILE}")
    print(f"📊 Max Records: {MAX_RECORDS}")
    print(f"🆔 Start ID: {START_ID}")
    print(f"🌐 API URL: {API_BASE_URL}")
    print()
    
    # Jalankan testing
    results = test_system_accuracy(
        csv_file=CSV_FILE,
        max_records=MAX_RECORDS,
        start_id=START_ID,
        api_base_url=API_BASE_URL
    )
    
    return results

if __name__ == "__main__":
    print("🚀 MEMULAI TESTING SISTEM FUZZY")
    print("=" * 50)
    print("Pastikan:")
    print("✅ Server API berjalan di http://localhost:8080")
    print("✅ File datatest_beta_2.csv tersedia")
    print("✅ Data student tersedia mulai dari ID 2")
    print("=" * 50)
    print()
    
    results = custom_test()
    
    if results:
        print("\n" + "="*50)
        print("🎯 FINAL RESULTS")
        print("="*50)
        print(f"🎯 AKURASI FINAL: {results['accuracy_percentage']:.2f}%")
        print(f"✅ Prediksi Benar: {results['correct_predictions']}")
        print(f"❌ Prediksi Salah: {results['wrong_predictions']}")
        print(f"📊 Total Tested: {results['total_tested']}")
        print(f"🔗 API Success Rate: {results['successful_predictions']}/{results['successful_predictions'] + results['failed_predictions']}")
        print("="*50)
        print("🎉 TESTING SELESAI!")
    else:
        print("\n❌ Testing gagal. Periksa koneksi API dan konfigurasi.")