const express = require("express")
const historyController = require("../controllers/history")
const historyRouter = express.Router()

// get all data
historyRouter.get("/", historyController.getAllHistory)

// get data by id
// historyRouter.get("/:id", historyController.getHistoryById)

// new data history
historyRouter.post("/", historyController.newHistory)

// delete data by id
historyRouter.delete("/:id", historyController.deleteHistory)

module.exports = historyRouter
