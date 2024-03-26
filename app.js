const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'goodreads.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Get players API
app.get('/players/', async (request, response) => {
  const getPlayerQuery = `SELECT
      *
    FROM
      cricket_team
    ORDER BY
       playerId;`
  const playerArray = await db.all(getPlayerQuery)
  response.send(playerArray)
})

//Get  players API
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT
      *
    FROM
      cricket_team
    WHERE
       playerId = ${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

//Post players API
app.post('/players/', async (request, response) => {
  const bookDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addplayerQuery = `INSERT INTO
      cricket_team (playerName,jerseyNumber,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
        );`

  const dbResponse = await db.run(addplayerQuery)
  const playerId = dbResponse.lastID
  response.send({playerId: playerId})
})

//Put players API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `UPDATE
     cricket_team
    SET
      "playerName":'${playerName}',
      "jerseyNumber":'${jerseyNumber}',
      "role":'${role}',
      
    WHERE
     playerId = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//Delete  players API
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `DELETE FROM 
      cricket_team 
    WHERE
      playerId = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})
module.exports = app
