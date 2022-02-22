import express from 'express'
import {postgre, neo4j} from './db/index.js'
import cors from "cors"

const app = express()
const port = 3000
app.use(cors());


app.get('/getUserById', async (req, res) => {
  res.send(await neo4j.getUserById(req.query.id))
})

app.get('/getFriends', async (req, res) => {
  res.send(await neo4j.getFriends(req.query.id))
})
app.get('/getProductsBought', async (req, res) => {
  res.send(await neo4j.getProductsBought(req.query.id))
})
app.get('/getProducts', async (req, res) => {
  res.send(await neo4j.getProducts())
})
app.get('/getUsers', async (req, res) => {
  res.send(await neo4j.getUsers())
})
app.get('/getProductsByLevelN', async (req, res) => {
  res.send(await neo4j.getProductsByLevelN(req.query.id, req.query.level))
})
app.get('/getSpecificProductByLevelN', async (req, res) => {
  res.send(await neo4j.getSpecificProductByLevelN(req.query.id, req.query.level, req.query.productId))
})
app.get('/getUsersByNonFriend', async (req, res) => {
  res.send(await neo4j.getUsersByNonFriend(req.query.id))
})
app.get('/follow', async (req, res) => {
  res.send(await neo4j.follow(req.query.id, req.query.id2))
})
app.get('/unfollow', async (req, res) => {
  res.send(await neo4j.unfollow(req.query.id,req.query.id2))
})
app.get('/buy', async (req, res) => {
  res.send(await neo4j.buy(req.query.id, req.query.productid))
})
app.get('/unbuy', async (req, res) => {
  res.send(await neo4j.unbuy(req.query.id, req.query.productid))
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })