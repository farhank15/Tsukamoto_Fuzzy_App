package fuzzifikasi

func FuzzifyMES(midterm float64) (low, medium, high float64) {
	if midterm <= 55 {
		low = 1.0
	} else if midterm <= 60 {
		low = (60 - midterm) / (60 - 55)
	}

	if midterm >= 55 && midterm <= 65 {
		medium = (midterm - 55) / (65 - 55)
	} else if midterm > 65 && midterm <= 75 {
		medium = (75 - midterm) / (75 - 65)
	}

	if midterm >= 80 {
		high = 1.0
	} else if midterm >= 70 {
		high = (midterm - 70) / (80 - 70)
	}

	return low, medium, high
}
