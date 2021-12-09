const mysql = require("mysql")
const db = require("../configs/db")

// get all Profile, by order id & name
const getAllProfile = (query) => {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT iduser, name, gender, phoneNumber, email, dateOfbirth, address, photo FROM users"
    const statement = []
    const order = query.order
    let orderBy = ""
    if (query.by && query.by.toLowerCase() == "id") orderBy = "iduser"
    if (query.by && query.by.toLowerCase() == "name") orderBy = "name"
    if (order && orderBy) {
      sql += " ORDER BY ? ?"
      statement.push(mysql.raw(orderBy), mysql.raw(order))
    }
    db.query(sql, statement, (err, result) => {
      if (err) return reject({ status: 500, err })
      if (result.length == 0) return resolve({ status: 400, result })
      resolve({ status: 200, result })
    })
  })
}

// get profile by id
const getProfileById = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT iduser, name, gender, phoneNumber, email, dateOfBirth, address, photo FROM users WHERE iduser = ?"
    db.query(sql, [id], (err, result) => {
      if (err) return reject({ status: 500, err })
      if (result.length == 0) return resolve({ status: 404, result })
      resolve({ status: 200, result })
    })
  })
}

// add new profile
const addProfile = (body) => {
  return new Promise((resolve, reject) => {
    const { name, gender, phoneNumber, email, dateOfBirth, address, photo } =
      body
    const dateQuery = dateOfBirth

    const formatDate = (date) => {
      const dateStr = date.split("-")
      return dateStr[2] + "-" + dateStr[1] + "-" + dateStr[0]
    }

    const dateInput = formatDate(dateQuery)
    const sql =
      "INSERT INTO users VALUES(null, ? , ? , ? , ? , ? , ? , ?, null)"
    const statement = [
      name,
      gender,
      phoneNumber,
      email,
      dateInput,
      address,
      photo
    ]

    db.query(sql, statement, (err, result) => {
      if (err) return reject({ status: 500, err })
      resolve({
        status: 201,
        result: {
          name,
          gender,
          phoneNumber,
          email,
          dateInput,
          address,
          photo
        }
      })
    })
  })
}

// edit profile
const editProfile = (id, body) => {
  return new Promise((resolve, reject) => {
    const { name, gender, phoneNumber, email, dateOfBirth, address, photo } =
      body

    const dateQuery = dateOfBirth

    const formatDate = (date) => {
      const dateStr = date.split("-")
      return dateStr[2] + "-" + dateStr[1] + "-" + dateStr[0]
    }
    if (typeof dateQuery == "undefined") {
      return reject({ status: 500, message: "Data cannot be empty!" })
    }

    const dateInput = formatDate(dateQuery)
    const statement = [
      name,
      gender,
      phoneNumber,
      email,
      dateInput,
      address,
      photo,
      id
    ]

    const sql =
      "UPDATE users SET name = ?, gender = ?, phoneNumber = ?, email = ?, dateOfBirth = ?, address = ?, photo = ? WHERE idUser = ?"

    db.query(sql, statement, (err, result) => {
      if (
        typeof name == "undefined" ||
        name.length == 0 ||
        typeof gender == "undefined" ||
        gender.length == 0 ||
        typeof phoneNumber == "undefined" ||
        phoneNumber.length == 0 ||
        typeof email == "undefined" ||
        email.length == 0 ||
        typeof dateOfBirth == "undefined" ||
        dateOfBirth.length == 0 ||
        typeof address == "undefined" ||
        address.length == 0 ||
        typeof photo == "undefined" ||
        photo.length == 0
      )
        if (err == null)
          return reject({ status: 500, message: "Data cannot be empty!" })

      resolve({ status: 200, result })
    })
  })
}

// delete profile
const deleteProfile = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users WHERE iduser = ?"
    db.query(sql, [id], (err, result) => {
      const { affectedRows } = result

      if (err) return reject({ status: 500, err })

      if (affectedRows == 0) return resolve({ status: 404, result })
      resolve({ status: 200 }, result)
    })
  })
}

module.exports = {
  getAllProfile,
  getProfileById,
  addProfile,
  editProfile,
  deleteProfile
}
