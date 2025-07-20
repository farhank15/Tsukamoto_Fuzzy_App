package fuzzifikasi

func FuzzifyCCA(cca float64) (low, medium, high float64) {
	if cca <= 50 {
		low = 1.0
	} else if cca <= 55 {
		low = (55 - cca) / (55 - 50)
	}

	if cca >= 50 && cca <= 65 {
		medium = (cca - 50) / (65 - 50)
	} else if cca > 65 && cca <= 75 {
		medium = (75 - cca) / (75 - 65)
	}

	if cca >= 80 {
		high = 1.0
	} else if cca >= 70 {
		high = (cca - 70) / (80 - 70)
	}

	return low, medium, high
}
