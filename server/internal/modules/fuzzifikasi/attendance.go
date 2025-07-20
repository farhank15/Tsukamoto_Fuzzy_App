package fuzzifikasi

func FuzzifyAttendance(attendance float64) (low, medium, high float64) {
	if attendance <= 0.60 {
		low = 1.0
	} else if attendance <= 0.65 {
		low = (0.65 - attendance) / (0.65 - 0.60)
	}

	if attendance >= 0.60 && attendance <= 0.75 {
		medium = (attendance - 0.60) / (0.75 - 0.60)
	} else if attendance > 0.75 && attendance <= 0.85 {
		medium = (0.85 - attendance) / (0.85 - 0.75)
	}

	if attendance >= 0.90 {
		high = 1.0
	} else if attendance >= 0.80 {
		high = (attendance - 0.80) / (0.90 - 0.80)
	}

	return low, medium, high
}
