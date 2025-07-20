package inferensi

type Rule struct {
	GPA         string
	CCA         string
	Attendance  string
	MidtermExam string
	FinalExam   string
	Performance string
}

func Rules() []Rule {
	return []Rule{
		{GPA: "Low", CCA: "Low", Attendance: "Low", MidtermExam: "Low", FinalExam: "Low", Performance: "Poor"},
		{GPA: "Low", CCA: "Low", Attendance: "Low", MidtermExam: "Low", FinalExam: "Medium", Performance: "Poor"},
		{GPA: "Low", CCA: "Low", Attendance: "Low", MidtermExam: "Medium", FinalExam: "Low", Performance: "Poor"},
		{GPA: "Low", CCA: "Low", Attendance: "Medium", MidtermExam: "Low", FinalExam: "Low", Performance: "Poor"},
		{GPA: "Low", CCA: "Medium", Attendance: "Low", MidtermExam: "Low", FinalExam: "Low", Performance: "Poor"},
		{GPA: "Medium", CCA: "Low", Attendance: "Low", MidtermExam: "Low", FinalExam: "Low", Performance: "Poor"},

		
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Low", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Low", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Low", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Low", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},

		{GPA: "Low", CCA: "Low", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Low", CCA: "Medium", Attendance: "Low", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Low", CCA: "Medium", Attendance: "Medium", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Low", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Low", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Low", Attendance: "Low", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Low", Attendance: "Medium", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Low", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Low", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Low", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Low", MidtermExam: "Medium", FinalExam: "Low", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "Low", FinalExam: "Low", Performance: "Needs Improvement"},

		{GPA: "Low", CCA: "Low", Attendance: "High", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Low", CCA: "Medium", Attendance: "Low", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},
		{GPA: "Medium", CCA: "Low", Attendance: "Low", MidtermExam: "Low", FinalExam: "Medium", Performance: "Needs Improvement"},

		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},

		{GPA: "High", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "High", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "High", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "High", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "High", Performance: "Satisfactory"},

		{GPA: "High", CCA: "High", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "High", CCA: "Medium", Attendance: "High", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "High", CCA: "Medium", Attendance: "Medium", MidtermExam: "High", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "High", CCA: "Medium", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "High", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "High", Attendance: "High", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "High", Attendance: "Medium", MidtermExam: "High", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "High", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "High", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "High", MidtermExam: "High", FinalExam: "Medium", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "High", MidtermExam: "Medium", FinalExam: "High", Performance: "Satisfactory"},
		{GPA: "Medium", CCA: "Medium", Attendance: "Medium", MidtermExam: "High", FinalExam: "High", Performance: "Satisfactory"},

		{GPA: "High", CCA: "High", Attendance: "High", MidtermExam: "Medium", FinalExam: "Medium", Performance: "Good"},
		{GPA: "High", CCA: "High", Attendance: "Medium", MidtermExam: "High", FinalExam: "Medium", Performance: "Good"},
		{GPA: "High", CCA: "High", Attendance: "Medium", MidtermExam: "Medium", FinalExam: "High", Performance: "Good"},
		{GPA: "High", CCA: "Medium", Attendance: "High", MidtermExam: "High", FinalExam: "Medium", Performance: "Good"},
		{GPA: "High", CCA: "Medium", Attendance: "High", MidtermExam: "Medium", FinalExam: "High", Performance: "Good"},
		{GPA: "High", CCA: "Medium", Attendance: "Medium", MidtermExam: "High", FinalExam: "High", Performance: "Good"},
		{GPA: "Medium", CCA: "High", Attendance: "High", MidtermExam: "High", FinalExam: "Medium", Performance: "Good"},
		{GPA: "Medium", CCA: "High", Attendance: "High", MidtermExam: "Medium", FinalExam: "High", Performance: "Good"},
		{GPA: "Medium", CCA: "High", Attendance: "Medium", MidtermExam: "High", FinalExam: "High", Performance: "Good"},
		{GPA: "Medium", CCA: "Medium", Attendance: "High", MidtermExam: "High", FinalExam: "High", Performance: "Good"},

		{GPA: "High", CCA: "High", Attendance: "High", MidtermExam: "High", FinalExam: "Medium", Performance: "Good"},
		{GPA: "High", CCA: "High", Attendance: "High", MidtermExam: "Medium", FinalExam: "High", Performance: "Good"},
		{GPA: "High", CCA: "High", Attendance: "Medium", MidtermExam: "High", FinalExam: "High", Performance: "Good"},
		{GPA: "High", CCA: "Medium", Attendance: "High", MidtermExam: "High", FinalExam: "High", Performance: "Good"},
		{GPA: "Medium", CCA: "High", Attendance: "High", MidtermExam: "High", FinalExam: "High", Performance: "Good"},

		{GPA: "High", CCA: "High", Attendance: "High", MidtermExam: "High", FinalExam: "High", Performance: "Excellent"},
		{GPA: "High", CCA: "Medium", Attendance: "High", MidtermExam: "High", FinalExam: "High", Performance: "Excellent"},
		{GPA: "High", CCA: "High", Attendance: "Medium", MidtermExam: "High", FinalExam: "High", Performance: "Excellent"},
	}
}
