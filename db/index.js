//////////////////////////
/////////  PG  ///////////
//////////////////////////

import pg from 'pg'
const { Client } = pg
const client = new Client({
  user: 'olivierstephan',
  host: 'localhost',
  database: 'olivierstephan',
  password: '',
  port: '5432',
})
client.connect()


class Postgre{
  getAll = async () => {
    try {
      const res = await client.query(`SELECT $1 FROM $2`,['*','*'])
      console.log(res.rows[0])
      return res.rows[0]
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }
  
}


//////////////////////////
///////  neo4j  //////////
//////////////////////////


import nj from 'neo4j-driver'

const driver = nj.driver("bolt://localhost:7687", nj.auth.basic("neo4j", "rq2n0qbg908"))
const session = driver.session()

class Neo4j{
    getAll = () => {
        session.run(
            'match (n) return n'
          ).then(value => {
            console.log(value)
            const records = value.records
        
            console.log(records.toString())
            return records.toString()
          })
    }
}
const neo4j = new Neo4j()
const postgre = new Postgre()
export  {postgre, neo4j}


  
