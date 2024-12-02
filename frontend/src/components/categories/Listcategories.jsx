import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Listcategories = () => {
  const[categories,setCategories]=useState([])
  const fetchcategories=async()=>{
    await axios.get("/api/categories")
    .then(res=>{
      setCategories(res.data)
      console.log(res)
    })
    .catch(error=>{
      console.log(error)
    })
  }
  useEffect(()=>{
    fetchcategories()
  })
  const handleDelete=async(id)=>{
    await axios.delete(`/api/categories/${id}`)
    .then(res=>{
      setCategories(categories.filter(c=>c._id!=id))
    })
    try {
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
       
        <Link to="/categories/add">
        <Button variant="success" style={{ backgroundColor: 'green' }}>
        <i class="fa-solid fa-square-plus"  style={{color: "#fcfcfd"}}></i>
        Nouveau
        </Button>
        </Link>
      
     
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Nom categorie</th>
            <th>Image catégorie</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
      <tbody>
        {
          categories.map((cat,index)=>
          <tr key={index}>
            <td>{cat.nomcategorie}</td>
            <td><img src={cat.imagecategorie} width={100} height={100}/></td>
            <td><button className='btn btn-warning btn-sm'>Update</button></td>
            <td><button className='btn btn-danger btn-sm' onClick={()=>handleDelete(cat._id)}>Delete</button></td>
          </tr>
          
          )
        }
      </tbody>
      </table>
      <h1>Liste des categories</h1>
    </div>
  )
}

export default Listcategories
