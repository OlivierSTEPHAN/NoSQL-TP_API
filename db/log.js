// Log Postgres

import pg from 'pg'
const { Client } = pg
const client = new Client({
  user: 'olivierstephan',
  host: 'localhost',
  database: 'olivierstephan',
  password: '',
  port: '5432',
})

// Log Neo4j

import nj from 'neo4j-driver'
const driver = nj.driver("bolt://localhost:7687", nj.auth.basic("neo4j", "rq2n0qbg908"))

export {client, driver}