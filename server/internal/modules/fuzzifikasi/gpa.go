package fuzzifikasi

func FuzzifyGPA(gpa float64) (low, medium, high float64) {
	if gpa <= 1.8 {
		low = 1.0
	} else if gpa <= 2.2 {
		low = (2.2 - gpa) / (2.2 - 1.8)
	}

	if gpa >= 1.8 && gpa <= 2.5 {
		medium = (gpa - 1.8) / (2.5 - 1.8)
	} else if gpa > 2.5 && gpa <= 3.2 {
		medium = (3.2 - gpa) / (3.2 - 2.5)
	}

	if gpa >= 3.2 {
		high = 1.0
	} else if gpa >= 2.8 {
		high = (gpa - 2.8) / (3.2 - 2.8)
	}

	return low, medium, high
}
