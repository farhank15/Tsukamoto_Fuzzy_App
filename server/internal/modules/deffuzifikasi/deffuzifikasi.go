package deffuzifikasi

import (
	"errors"
	"fmt"
	"tsukamoto/internal/modules/inferensi"
)

// TsukamotoDefuzzify performs defuzzification using Tsukamoto method
func TsukamotoDefuzzify(gpa, cca, attendance, midterm, finalExam float64) (string, float64, error) {
	result := inferensi.TsukamotoInference(gpa, cca, attendance, midterm, finalExam)

	if result.TotalWeight == 0 {
		return "", 0, errors.New("no rule activated: all firing strengths are zero")
	}

	crispOutput := result.CrispOutput

	var category string
	if crispOutput <= 40 {
		category = "Poor"
	} else if crispOutput <= 60 {
		category = "Needs Improvement"
	} else if crispOutput <= 80 {
		category = "Satisfactory"
	} else if crispOutput <= 95 {
		category = "Good"
	} else {
		category = "Excellent"
	}

	return category, crispOutput, nil
}

// Backward compatibility with old Defuzzify function
func Defuzzify(output map[string]float64) (string, error) {
	// Check if no rule was activated
	hasNonZero := false
	for _, membership := range output {
		if membership > 0 {
			hasNonZero = true
			break
		}
	}

	if !hasNonZero {
		return "", errors.New("no rule activated: all membership values are zero")
	}

	// Find category with maximum membership (for backward compatibility)
	var maxMembership float64
	var result string
	for performance, membership := range output {
		if membership > maxMembership {
			maxMembership = membership
			result = performance
		}
	}

	return result, nil
}

// DefuzzifyStrict - alternative strict defuzzification
func DefuzzifyStrict(output map[string]float64) (string, error) {
	hasNonZero := false
	for _, membership := range output {
		if membership > 0 {
			hasNonZero = true
			break
		}
	}

	if !hasNonZero {
		return "", errors.New("no rule activated: all membership values are zero")
	}

	// Using threshold for each category
	thresholds := map[string]float64{
		"Poor":              0.3,
		"Needs Improvement": 0.2, // Lower threshold, easier to trigger
		"Satisfactory":      0.4, // Higher threshold, harder to achieve
		"Good":              0.5,
		"Excellent":         0.7,
	}

	// Priority order (lower number = higher priority when tied)
	priorities := map[string]int{
		"Poor":              1,
		"Needs Improvement": 2,
		"Satisfactory":      3,
		"Good":              4,
		"Excellent":         5,
	}

	var candidates []string
	maxMembership := 0.0

	// Find all categories that meet their threshold
	for performance, membership := range output {
		if membership > 0 && membership >= thresholds[performance] {
			if membership > maxMembership {
				maxMembership = membership
				candidates = []string{performance}
			} else if membership == maxMembership {
				candidates = append(candidates, performance)
			}
		}
	}

	// If no category meets threshold, fall back to regular max membership
	if len(candidates) == 0 {
		return Defuzzify(output)
	}

	// If multiple candidates, choose based on priority
	if len(candidates) == 1 {
		return candidates[0], nil
	}

	// Choose the one with lowest priority number (most conservative)
	result := candidates[0]
	minPriority := priorities[result]
	for _, candidate := range candidates[1:] {
		if priorities[candidate] < minPriority {
			result = candidate
			minPriority = priorities[candidate]
		}
	}

	return result, nil
}

// DebugOutput displays inference output for debugging
func DebugOutput(output map[string]float64) {
	fmt.Println("=== INFERENCE OUTPUT DEBUG ===")
	for performance, membership := range output {
		if membership > 0 {
			fmt.Printf("%s: %.6f\n", performance, membership)
		}
	}
	fmt.Println("===============================")
}

// DebugTsukamotoOutput displays Tsukamoto inference results for debugging
func DebugTsukamotoOutput(gpa, cca, attendance, midterm, finalExam float64) {
	result := inferensi.TsukamotoInference(gpa, cca, attendance, midterm, finalExam)

	fmt.Println("=== TSUKAMOTO INFERENCE DEBUG ===")
	fmt.Printf("Total Weight: %.6f\n", result.TotalWeight)
	fmt.Printf("Weighted Sum: %.6f\n", result.WeightedSum)
	fmt.Printf("Crisp Output: %.6f\n", result.CrispOutput)
	fmt.Println("\nActive Rules:")

	for _, ruleOutput := range result.RuleOutputs {
		fmt.Printf("Rule %d: %s\n", ruleOutput.RuleIndex, ruleOutput.Performance)
		fmt.Printf("  Firing Strength: %.6f\n", ruleOutput.FiringStrength)
		fmt.Printf("  Crisp Value: %.6f\n", ruleOutput.CrispValue)
		fmt.Printf("  Weighted Value: %.6f\n", ruleOutput.WeightedValue)
		fmt.Println()
	}

	category, crispValue, err := TsukamotoDefuzzify(gpa, cca, attendance, midterm, finalExam)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Final Result: %s (%.2f)\n", category, crispValue)
	}
	fmt.Println("==================================")
}
