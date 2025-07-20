package fuzzifikasi

func FuzzifyFinalExam(finalExam float64) (low, medium, high float64) {
	if finalExam <= 52 {
		low = 1.0
	} else if finalExam <= 54 {
		low = (54 - finalExam) / (54 - 52)
	}

	if finalExam >= 52 && finalExam <= 70 {
		medium = (finalExam - 52) / (70 - 52)
	} else if finalExam > 70 && finalExam <= 82 {
		medium = (82 - finalExam) / (82 - 70)
	}

	if finalExam >= 82 {
		high = 1.0
	} else if finalExam >= 78 {
		high = (finalExam - 78) / (82 - 78)
	}

	return low, medium, high
}
