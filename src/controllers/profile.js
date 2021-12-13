const profileModel = require("../models/profile")

// get all profile
const getAllProfile = (req, res) => {
  const { query } = req
  let keyword = `%%`

  if (query.cari) keyword = `'%${query.cari}%'`
  profileModel
    .getAllProfile(keyword, query)
    .then(({ status, result }) => {
      return res.status(status).json({ result })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

// get profile by id
const getProfileById = (req, res) => {
  const { params } = req
  const id = params.id
  profileModel
    .getProfileById(id)
    .then(({ status, result }) => {
      if (status === 404)
        return res.status(status).json({ message: "User not found", result })
      return res.status(status).json({ result })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

// add new profile
const addProfile = (req, res) => {
  const { body } = req
  profileModel
    .addProfile(body)
    .then(({ status, result }) => {
      if (status == 404)
        return res
          .status(status)
          .json({ message: "data cannot be empty", result })

      res.status(status).json({
        message: "Add new profile successfuly",
        result
      })
      // const {name, gender, phoneNumber, dateOfBirth, address, photo} = result
      // cek data jika tidak ada
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

// edit profile
const editProfile = (req, res) => {
  const { body, params } = req
  const id = params.id
  profileModel
    .editProfile(id, body)
    .then(({ status, result }) => {
      if (status === 404)
        return res.status(status).json({
          id: id,
          status: status,
          message: "User not found"
        })
      return res
        .status(status)
        .json({ id: id, message: "Data updated successfully" })
    })
    .catch(({ status, err, message }) => {
      res
        .status(status)
        .json({ status, message, example_date: "DD-MM-YYYY", err })
    })
}

// delete profile
const deleteProfile = (req, res) => {
  const { params } = req
  const id = params.id
  profileModel
    .deleteProfile(id)
    .then(({ status, result }) => {
      if (status === 404)
        return res.status(status).json({ id: id, message: "User not found" })
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

// upload photo
const uploadPhoto = (req, res) => {
  // res.status(200).json({message: "Upload Berhasil", url: req.file})
  const { body } = req
  const { id } = body
  const { file } = req

  const fileName = file.filename
  profileModel
    .uploadPhoto(id, fileName)
    .then(({ status, result }) => {
      res.status(200).json({ message: "Upload Berhasil", result: result })
    })
    .catch(({ status, err }) => {
      res
        .status(status)
        .json({ message: "An error occurred on the server", err })
    })
}

module.exports = {
  getAllProfile,
  getProfileById,
  addProfile,
  editProfile,
  deleteProfile,
  uploadPhoto
}
