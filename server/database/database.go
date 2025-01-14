package database

import (
	"log"
	"os"

	"github.com/ihajar/gofiber-react-blog/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBConn *gorm.DB

func ConnectDB() {
	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	name := os.Getenv("db_name")

	// DEbug logs for environment variables
	// log.Println("DB User:", user)
	// log.Println("DB Password:", password)
	// log.Println("DB Name:", name)

	dsn := "host=127.0.0.1 user=" + user + " password=" + password + " dbname=" + name + " port=5432 sslmode=disable TimeZone=Africa/Algiers"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Database connection failed!")
	}

	log.Println("Connextion to Database successful")

	err = db.AutoMigrate(new(model.Blog))

	if err != nil {
		log.Fatalf("AutoMIgrate failed: %v", err)
	}

	DBConn = db
}
