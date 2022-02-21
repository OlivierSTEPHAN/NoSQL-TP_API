//////////////////////////
/////////  PG  ///////////
//////////////////////////

import client from './log.js'
client.connect()

class Postgre{
  articleByFriendOne = async () => {
    try {
      const res = await client.query(`SELECT p.nomProduit, COUNT(p.idProduit) as Quantite
      FROM Utilisateur amis 
      JOIN Achat a ON amis.idUtilisateur = a.idUtilisateur
      JOIN Produit p ON a.idProduit = p.idProduit
      WHERE amis.idUtilisateur IN
        (SELECT suivi.idUtilisateur FROM utilisateur u
        JOIN suit suivi ON u.idUtilisateur = suivi.idUtilisateur
        WHERE u.idUtilisateur = $1)
      GROUP BY p.idProduit;
      `,['1'])
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }
  
}


//////////////////////////
///////  neo4j  //////////
//////////////////////////


import driver from './log.js'
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


  
