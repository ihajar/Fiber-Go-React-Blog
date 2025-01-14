package controller

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/ihajar/gofiber-react-blog/database"
	"github.com/ihajar/gofiber-react-blog/model"
)

// List all blogs
func BlogList(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Blog list",
	}

	db := database.DBConn

	var records []model.Blog

	db.Find(&records)

	context["blog_records"] = records

	c.Status(200)
	return c.JSON(context)
}

// Get a blog details
func BlogDetail(c *fiber.Ctx) error {
	c.Status(400)
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}

	recordId := c.Params("id")

	var record model.Blog

	database.DBConn.First(&record, recordId)

	if record.ID == 0 {
		log.Println("Record not found!")
		context["msg"] = "Record not found!"
		c.Status(404)
		return c.JSON(context)
	}

	context["record"] = record
	context["statusText"] = "Ok"
	context["msg"] = "Blog Details"
	c.Status(200)
	return c.JSON(context)
}

// Add a blog into Database
func BlogCreate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Add a blog",
	}

	record := new(model.Blog)

	if err := c.BodyParser(&record); err != nil {
		log.Println("Error in parsing request")
		context["statusText"] = ""
		context["msg"] = "Something went wrong in creating new blog!ß"
	}

	result := database.DBConn.Create(record)

	if result.Error != nil {
		log.Println("Error in saving new blog to database!")
	}

	context["msg"] = "blog is created successfuly"
	context["data"] = record

	c.Status(201)
	return c.JSON(context)
}

// Update a blog
func BlogUpdate(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Update a blog by Id",
	}

	recordId := c.Params("id")

	var record model.Blog

	database.DBConn.First(&record, recordId)

	if record.ID == 0 {
		log.Println("Blog not found!")
		context["msg"] = "Blog not found!"
		context["statusText"] = ""
		c.Status(400)
		return c.JSON(context)
	}

	if err := c.BodyParser(&record); err != nil {
		log.Println("Error in parsing request.")
	}

	result := database.DBConn.Save(record)

	if result.Error != nil {
		log.Println("Error in updating data.")
	}

	context["msg"] = "Blog updating successfuly."
	context["data"] = record

	c.Status(200)
	return c.JSON(context)
}

// Delete a blog
func BlogDelete(c *fiber.Ctx) error {
	c.Status(400)

	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}

	recordId := c.Params("id")

	var record model.Blog

	database.DBConn.First(&record, recordId)

	if record.ID == 0 {
		log.Println("Blog not found!")
		context["msg"] = "Blog not found!"
		return c.JSON(context)
	}

	result := database.DBConn.Delete(record)

	if result.Error != nil {
		log.Println("Something went wrong")
		return c.JSON(context)
	}

	context["statusText"] = "Ok"
	context["msg"] = "Blog deleted successfuly."
	c.Status(200)
	return c.JSON(context)
}
