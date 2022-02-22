//////////////////////////
/////////  PG  ///////////
//////////////////////////

import {client} from './log.js'
client.connect()

class Postgre{

  getUserById = async (userId) => {
    try{
      const res = await client.query(`SELECT *
      FROM utilisateur
      WHERE idUtilisateur = $1;`,[userId])
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getFriends = async (userId) => {
    try{
      const res = await client.query(`SELECT * 
        FROM utilisateur u
        JOIN suit s ON u.idUtilisateur = s.idUtilisateur
        WHERE s.idUtilisateurSuivi = u.${userId};`)
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getProductsBought = async (userId) => {
    try{
      const res = await client.query(`SELECT * FROM produit p
      JOIN achat a ON a.idProduit = p.idProduit
      WHERE p.idUtilisateur = ${userId};`)
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getProductsNonBought = async (userId) => {
    try{
      const res = await client.query(`SELECT * FROM produit
      MINUS
      SELECT * FROM produit p
      JOIN achat a ON a.idProduit = p.idProduit
      WHERE p.idUtilisateur = ${userId};`)
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getProductsByLevelN = async (userId, level) => {
    try{
      const res = await client.query(`WITH RECURSIVE utilisateurs_inclus(idUtilisateur, nomUtilisateur, profondeur) AS (
        SELECT idUtilisateur, nomUtilisateur, 0
          FROM Utilisateur WHERE idUtilisateur = ${userId}
        UNION ALL
        SELECT u.idUtilisateur, u.nomUtilisateur, inclus.profondeur + 1
          FROM utilisateurs_inclus AS inclus,Utilisateur AS u 
          JOIN suit suivi ON u.idUtilisateur = suivi.idUtilisateur
          WHERE inclus.idUtilisateur = suivi.idUtilisateurSuivi AND inclus.profondeur < ${level}
      )
      SELECT p.nomProduit, COUNT(p.idProduit) as Quantite
      FROM Utilisateur amis 
      JOIN Achat a ON amis.idUtilisateur = a.idUtilisateur
      JOIN Produit p ON a.idProduit = p.idProduit
      WHERE amis.idUtilisateur IN
        (SELECT idUtilisateur FROM utilisateurs_inclus)
      GROUP BY p.idProduit;
      ;`)
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getSpecificProductByLevelN = async (userId, productId, level) => {
    try{
      const res = await client.query(`WITH RECURSIVE utilisateurs_inclus(idUtilisateur, nomUtilisateur, profondeur) AS (
        SELECT idUtilisateur, nomUtilisateur, 0
          FROM Utilisateur WHERE idUtilisateur = ${userId}
        UNION ALL
        SELECT u.idUtilisateur, u.nomUtilisateur, inclus.profondeur + 1
          FROM utilisateurs_inclus AS inclus,Utilisateur AS u 
          JOIN suit suivi ON u.idUtilisateur = suivi.idUtilisateur
          WHERE inclus.idUtilisateur = suivi.idUtilisateurSuivi AND inclus.profondeur < ${level}
      )
      SELECT inclus.profondeur, COUNT(p.idProduit) as Quantite
      FROM Utilisateur amis 
      JOIN Achat a ON amis.idUtilisateur = a.idUtilisateur
      JOIN Produit p ON a.idProduit = p.idProduit
      JOIN utilisateurs_inclus inclus ON inclus.idUtilisateur = amis.idUtilisateur
      WHERE p.idProduit = ${productId}
      GROUP BY inclus.profondeur;
      `)
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  getUsersByNonFriend = async (id) => {
    try{
      const res = await client.query(`SELECT * 
      FROM utilisateur u
      JOIN suit s ON u.idUtilisateur = s.idUtilisateur
      WHERE s.idUtilisateurSuivi != $id;`,[id])
      console.log(res.rows)
      return res.rows
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  follow = async (idUser, idFollower) => {
    try{
      const res = await client.query(`INSERT INTO suit VALUES ($idUser, $idFollower);`,[idUser, idFollower])
      console.log(res)
      return res
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  unfollow = async (idUser, idFollower) => {
    try{
      const res = await client.query(`DELETE FROM suit WHERE idUtilisateur = $idUser AND idUtilisateurSuivi = $idFollower;`,[idUser, idFollower])
      console.log(res)
      return res
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  buy = async (idUser, idArticle) => {
    try{
      const res = await client.query(`INSERT INTO achat VALUES (${idUser}, ${idArticle}, ‘11/11/2011’);`)
      console.log(res)
      return res
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }

  unbuy = async (idUser, idArticle) => {
    try{
      const res = await client.query(`DELETE FROM achat WHERE idUtilisateur = ${idUser} AND idProduit = ${idArticle};`)
      console.log(res)
      return res
    } catch (err) {
      console.log(err.stack)
      return err.stack
    }
  }
}


//////////////////////////
///////  neo4j  //////////
//////////////////////////


import {driver} from './log.js'
const session = driver.session()

class Neo4j{
    getAll = async () => {
        return session.run(
            'match (n) return n'
          ).then(value => {
            const records = value.records
        
            console.log(records)
            return records
          })
    }

    getFriends = async (userId) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
      -[r:suit]->(u2:Utilisateur) RETURN u2`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }

    getUserById = async (userId) => {
          return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
          RETURN u`
          ).then(value => {
            const records = value.records
        
            console.log(records)
            return records
          })
        }

    getProductsBought = async (userId) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
      -[r:achete]->(produit:Produit) RETURN produit`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    
    getProductsNonBought = async (userId) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
      -[r:suit]->(u2:Utilisateur) RETURN u2 LIMIT 25`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    getProductsByLevelN = async (userId, level) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
      -[r:suit]->(u2:Utilisateur) RETURN u2 LIMIT 25`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    getSpecificProductByLevelN = async (userId, level, productId) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})
      -[r:suit]->(u2:Utilisateur) RETURN u2 LIMIT 25`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    getUsersByNonFriend = async (userId) => {
      return session.run(`MATCH (u:Utilisateur {idUtilisateur: '${userId}'})-[]->(u2:Utilisateur)
      WHERE NOT (u)-[:suit]->()
      RETURN u2`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    follow = async (userId, userId2) => {
      return session.run(`MATCH
      (a:Utilisateur),
      (b:Utilisateur)
    WHERE a.idUtilisateur = '${userId}' AND b.idUtilisateur = '${userId2}'
    CREATE (a)-[r:suit]->(b)
    RETURN type(r)`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    unfollow = async (userId, userId2) => {
      return session.run(`MATCH (n {idUtilisateur: '${userId}'})-[r:suit]->(n2 {idUtilisateur: '${userId2}'})
      DELETE r`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    buy = async (userId, productId) => {
      return session.run(`MATCH
      (a:Utilisateur),
      (b:Produit)
    WHERE a.idUtilisateur = '${userId}' AND b.idProduit = '${productId}'
    CREATE (a)-[r:achete]->(b)
    RETURN type(r)`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
    unbuy = async (userId, productId) => {
      return session.run(`MATCH (n {idUtilisateur: '${userId}'})-[r:achete]->(n2 {idProduit: '${productId}'})
      DELETE r`
      ).then(value => {
        const records = value.records
    
        console.log(records)
        return records
      })
    }
}
const neo4j = new Neo4j()
const postgre = new Postgre()
export  {postgre, neo4j}


  
