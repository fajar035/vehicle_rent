const vehicleModel = require("../models/vehicle")

// get all vehicle
const getAllVehicle = (req, res) => {
  const { query } = req
  let keyword = `%%`

  if (query.cari) keyword = `'%${query.cari}%'`
  vehicleModel
    .getAllVehicle(keyword, query)
    .then(({ status, result }) => {
      return res.status(status).json({result})
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "Am error occurred on the server", err })
    })
}

// get vehicle by id
const getVehicleById = (req, res) => {
  const { params } = req
  const id = params.id
  vehicleModel
    .getVehicleById(id)
    .then(({ status, result }) => {
      if (status === 404)
        return res.status(status).json({ message: "Vehicle not found", result })
      return res.status(status).json({ result })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occured on the server", err })
    })
}

// add new vehicle
const addVehicle = (req, res) => {
  const { body } = req

  vehicleModel
    .addVehicle(body)
    .then(({ status, result }) => {
      res
        .status(status)
        .json({ message: "Add new vehicle successfuly", result })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

// edit vehicle
const editVehicle = (req, res) => {
  const { body, params } = req
  const id = params.id

  vehicleModel
    .editVehicle(id, body)
    .then(({ status, result, message }) => {
      res.status(status).json({
        message,
        result
      })
    })
    .catch(({ status, message }) => {
      res.status(status).json({ status, message })
    })
}

// delete vehicle
const deleteVehicle = (req, res) => {
  const { params } = req
  const id = params.id
  vehicleModel
    .deleteVehicle(id)
    .then(({ status, result }) => {
      if (status === 404)
        return res
          .status(status)
          .json({ id: id, message: "Data Vehicle not found" })
      return res
        .status(status)
        .json({ id: id, message: "Data deleted successfully" })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

module.exports = {
  getAllVehicle,
  getVehicleById,
  addVehicle,
  editVehicle,
  deleteVehicle
}
