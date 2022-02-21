import express from 'express'
import {postgre, neo4j} from './db/index.js'
const app = express()
const port = 3000

app.get('/getAllNeo4j', (req, res) => {
    res.send(neo4j.getAll())
  })
  app.get('/test', (req, res) => {
    res.send(postgre.articleByFriendOne())
  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })