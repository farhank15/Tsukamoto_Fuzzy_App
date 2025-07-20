package inferensi

import (
	"math"
	"tsukamoto/internal/modules/fuzzifikasi"
)

// TsukamotoResult represents the result from Tsukamoto inference
type TsukamotoResult struct {
	WeightedSum float64
	TotalWeight float64
	CrispOutput float64
	RuleOutputs []RuleOutput
}

// RuleOutput represents individual rule calculation
type RuleOutput struct {
	RuleIndex      int
	FiringStrength float64
	CrispValue     float64
	WeightedValue  float64
	Performance    string
}

// Performance value mapping for Tsukamoto (crisp values)
var performanceValues = map[string]float64{
	"Poor":              20.0, // 0-40
	"Needs Improvement": 50.0, // 30-60
	"Satisfactory":      70.0, // 60-80
	"Good":              85.0, // 75-95
	"Excellent":         95.0, // 90-100
}

func TsukamotoInference(gpa, cca, attendance, midterm, finalExam float64) TsukamotoResult {
	// Fuzzify inputs
	gpaLow, gpaMedium, gpaHigh := fuzzifikasi.FuzzifyGPA(gpa)
	ccaLow, ccaMedium, ccaHigh := fuzzifikasi.FuzzifyCCA(cca)
	attLow, attMedium, attHigh := fuzzifikasi.FuzzifyAttendance(attendance)
	midLow, midMedium, midHigh := fuzzifikasi.FuzzifyMES(midterm)
	finLow, finMedium, finHigh := fuzzifikasi.FuzzifyFinalExam(finalExam)

	var weightedSum float64 = 0.0
	var totalWeight float64 = 0.0
	var ruleOutputs []RuleOutput

	// Get rules
	rules := Rules()

	// Apply each rule using Tsukamoto method
	for i, rule := range rules {
		// Get membership values for inputs based on rule conditions
		var gpaMem, ccaMem, attMem, midMem, finMem float64

		switch rule.GPA {
		case "Low":
			gpaMem = gpaLow
		case "Medium":
			gpaMem = gpaMedium
		case "High":
			gpaMem = gpaHigh
		}

		switch rule.CCA {
		case "Low":
			ccaMem = ccaLow
		case "Medium":
			ccaMem = ccaMedium
		case "High":
			ccaMem = ccaHigh
		}

		switch rule.Attendance {
		case "Low":
			attMem = attLow
		case "Medium":
			attMem = attMedium
		case "High":
			attMem = attHigh
		}

		switch rule.MidtermExam {
		case "Low":
			midMem = midLow
		case "Medium":
			midMem = midMedium
		case "High":
			midMem = midHigh
		}

		switch rule.FinalExam {
		case "Low":
			finMem = finLow
		case "Medium":
			finMem = finMedium
		case "High":
			finMem = finHigh
		}

		// Calculate rule firing strength using minimum (AND operation)
		firingStrength := math.Min(math.Min(math.Min(math.Min(gpaMem, ccaMem), attMem), midMem), finMem)

		// Skip rule if firing strength is 0
		if firingStrength <= 0 {
			continue
		}

		// Get crisp output value for this rule's consequence
		crispValue := performanceValues[rule.Performance]

		// Calculate weighted value
		weightedValue := firingStrength * crispValue

		// Accumulate for final calculation
		weightedSum += weightedValue
		totalWeight += firingStrength

		// Store rule output for debugging
		ruleOutputs = append(ruleOutputs, RuleOutput{
			RuleIndex:      i,
			FiringStrength: firingStrength,
			CrispValue:     crispValue,
			WeightedValue:  weightedValue,
			Performance:    rule.Performance,
		})
	}

	// Calculate final crisp output using weighted average
	var crispOutput float64
	if totalWeight > 0 {
		crispOutput = weightedSum / totalWeight
	}

	return TsukamotoResult{
		WeightedSum: weightedSum,
		TotalWeight: totalWeight,
		CrispOutput: crispOutput,
		RuleOutputs: ruleOutputs,
	}
}

// Legacy function for backward compatibility (converts to old format)
func Inference(gpa, cca, attendance, midterm, finalExam float64) map[string]float64 {
	result := TsukamotoInference(gpa, cca, attendance, midterm, finalExam)

	// Convert crisp output back to categorical representation for compatibility
	output := map[string]float64{
		"Poor":              0.0,
		"Needs Improvement": 0.0,
		"Satisfactory":      0.0,
		"Good":              0.0,
		"Excellent":         0.0,
	}

	// Determine category based on crisp output value
	crispValue := result.CrispOutput

	if crispValue <= 40 {
		output["Poor"] = 1.0
	} else if crispValue <= 60 {
		output["Needs Improvement"] = 1.0
	} else if crispValue <= 80 {
		output["Satisfactory"] = 1.0
	} else if crispValue <= 95 {
		output["Good"] = 1.0
	} else {
		output["Excellent"] = 1.0
	}

	return output
}
