package utils

import (
	"os"

	"github.com/sirupsen/logrus"
)

// ConfigureLogger sets up logrus to write logs to a file and console.
func ConfigureLogger(logFilePath string) error {
	// Open the log file
	logFile, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return err
	}

	// Set logrus output to both file and console
	logrus.SetOutput(logFile)

	// Set log format to text (you can change to JSON if needed)
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})

	// Set log level (you can change to logrus.DebugLevel for more detailed logs)
	logrus.SetLevel(logrus.InfoLevel)

	return nil
}
