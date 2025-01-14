package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/ihajar/gofiber-react-blog/database"
	"github.com/ihajar/gofiber-react-blog/router"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error in loading .env file!")
	}

	database.ConnectDB()
}

func main() {
	psqlDb, err := database.DBConn.DB()

	if err != nil {
		panic("Error in psql connexion!")
	}

	defer psqlDb.Close()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Use(logger.New())

	router.SetupRoutes(app)

	app.Listen(":8000")
}
