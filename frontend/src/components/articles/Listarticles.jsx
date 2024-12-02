import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Listarticles = () => {
  const[articles,setArticles]=useState([])

  const loadarticles=async()=>{
    try {
      const res=await axios.get("/api/articles") ;
      setArticles(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    loadarticles()
  },[])
  const handleDelete=async(id)=>{
    if(window.confirm("êtes vous sure de vouloir supprimer")){
    try {
      await axios.delete(`/api/articles/${id}`)
      .then(res=>{
        loadarticles()
      })

    } catch (error) {
      console.log(error)
    }
  }
  }
  return (
    <div>
      <h1>Liste des articles</h1>
    <Link to="/articles/add">  <button className='btn btn-success btn-sm'><i class="fa-solid fa-circle-plus"></i> Ajouter</button></Link>
      <table className='table table-striped'>
        <thead>
          <tr>
          <th>Référence</th>
          <th>Désignation</th>
          <th>Marque</th>
          <th>Stock</th>
          <th>Prix</th>
          <th>Image</th>
          <th>Sous Catégorie</th>
          <th>Update</th>
          <th>Delete</th>
          </tr>
        </thead>
      <tbody>
        {
          articles.map((art,index)=>
          <tr key={index}>
              <td>{art.reference}</td>
              <td>{art.designation}</td>
              <td>{art.marque}</td>
              <td>{art.qtestock}</td>
              <td>{art.prix}</td>
              <td><img src={art.imageart} width={80} height={80}/></td>
              <td></td>
              <td><Link to={`/articles/edit/${art._id}`}> <button className='btn btn-warning btn-sm'><i class="fa-solid fa-pen"></i> Update</button></Link></td>
              <td><button className='btn btn-danger' onClick={()=>handleDelete(art._id)}><i class="fa-solid fa-trash"></i> Delete</button></td>
          </tr>
          
          )
        }
      </tbody>
      </table>
    </div>
  )
}

export default Listarticles

