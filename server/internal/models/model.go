package models

func GetModelsToMigrate() []interface{} {
	return []interface{}{
		&User{},
		&Academic{},
		&University{},
	}
}
