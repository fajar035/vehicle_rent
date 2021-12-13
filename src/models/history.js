const db = require("../configs/db")
const mysql = require("mysql")
const moment = require("moment")

// get all history
const getAllHistory = (keyword, query) => {
  return new Promise((resolve, reject) => {
    let sql =
    "SELECT h.id, u.name AS 'user', v.name AS 'vehicle', v.category, v.price, v.photo AS 'photo', h.booking_date, h.return_date, h.rating from history h join users u ON h.user_id = u.id join vehicles v ON h.vehicles_id = v.id"
    const statement = []
    const order = query.order
    let orderBy = ""
    if (query.by && query.by.toLowerCase() == "id") orderBy = "id"
      if (query.by && query.by.toLowerCase() == "user") orderBy = "user"
        if (query.by && query.by.toLowerCase() == "vehicle") orderBy = "vehicle"
          if (keyword.length !== 2) {
            sql += " WHERE u.name LIKE ?"
            statement.push(mysql.raw(keyword))
          }
          if (order && orderBy) {
            sql += " ORDER BY ? ?"
            statement.push(mysql.raw(orderBy), mysql.raw(order))
          }
          console.log(orderBy)
    // ambil total data
    const countQuery = `select count(*) as "count" from history`;
    // let count
    db.query(countQuery, (err, result) => {
      if (err) return reject({ status: 500, err });

      const page = parseInt(query.page);
      const limit = parseInt(query.limit);
      const count = result[0].count;
      if (query.page && query.limit) {
        sql += " LIMIT ? OFFSET ?";
        const offset = (page - 1) * limit;
        statement.push(limit, offset);
      }

      const meta = {
        next:
        page == Math.ceil(count / limit)
        ? null
        : `/history?by=id&order=asc&page=${page + 1}&limit=${limit}`,
        prev:
        page == 1
        ? null
        : `/history?by=id&order=asc&page=${page - 1}&limit=${limit}`,
        count,
      };
      db.query(sql, statement, (err, history) => {
        if (err) return reject({ status: 500, err })
          if (history.length == 0) return resolve({ status: 400, result:{data:"Data not found", history} })
            resolve({ status: 200, result: {data: meta, history} })
        })
    });
  })
}


// new history
const newHistory = (body) => {
  return new Promise((resolve, reject) => {
    const { user_id, vehicles_id, return_date, rating } = body
    const sql = "INSERT INTO history VALUES(null, ?,?,?,?,?)"

    const date = new Date()
    const tgl = date.getDate()
    const bln = date.getMonth()
    const thn = date.getFullYear()
    const booking_date = `${tgl}-${bln}-${thn}`


    const dateBookingQuery = booking_date
    const dateReturnQuery = return_date

    const formatDate = (date) => {
      const dateStr = date.split("-")
      return dateStr[2] + "-" + dateStr[1] + "-" + dateStr[0]
    }

    if (
        typeof dateReturnQuery == "undefined")
      return reject({ status: 500, message: "Data cannot be empty!" })

    const dataCheck = moment(dateBookingQuery ||
                             dateReturnQuery,
                             "DD-MM-YYYY",
                             true
                             ).isValid()

    if (dataCheck == false)
      return reject({ status: 500, message: "Wrong input date" })

    const dateInputBooking = formatDate(dateBookingQuery)
    const dateInputReturn = formatDate(dateReturnQuery)

    const statement = [
    user_id,
    vehicles_id,
    dateInputBooking,
    dateInputReturn,
    rating
    ]

    db.query(sql, statement, (err, result) => {
      if (err) return reject({ status: 500, err })

        resolve({
          status: 201,
          result: {
            id: result.insertId,
            message: "Successful Car Rental",
            user_id,
            vehicles_id,
            booking_date,
            return_date,
            rating
          }
        })
    })
  })
}

// delete history
const deleteHistory = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM history WHERE id = ?"
    db.query(sql, [id], (err, result) => {
      const { affectedRows } = result
      if (err) return reject({ status: 500, err })
        if (affectedRows == 0) return resolve({ status: 404, result })
          resolve({ status: 200 }, result)
      })
  })
}

// popular vehicles by rating
const popular = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT h.id, v.name as 'vehicle', v.category, v.price, v.photo as 'photo' from history h
    join users u on h.user_id = u.id
    join vehicles v on h.vehicles_id = v.id
    where h.rating = 5 order by h.rating`

    db.query(sql, (err, result) => {
      // console.log(err, result)
      if (err) return reject({ status: 500, err })
        return resolve({ status: 200, result })
    })
  })
}

module.exports = {
  getAllHistory,
  newHistory,
  deleteHistory,
  popular
}
