export interface FuzzyResponse {
  data: {
    user_id: number;
    category: string;
    inputs: {
      gpa: number;
      cca: number;
      attendance: number;
      midterm: number;
      final_exam: number;
    };
    fuzzy_membership: {
      gpa: {
        low: number;
        medium: number;
        high: number;
      };
      cca: {
        low: number;
        medium: number;
        high: number;
      };
      attendance: {
        low: number;
        medium: number;
        high: number;
      };
      midterm: {
        low: number;
        medium: number;
        high: number;
      };
      final_exam: {
        low: number;
        medium: number;
        high: number;
      };
    };
    inference_output: {
      Excellent: number;
      Good: number;
      "Needs Improvement": number;
      Poor: number;
      Satisfactory: number;
    };
  };
}
