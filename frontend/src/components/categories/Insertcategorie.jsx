import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'

const Insertcategorie = () => {
  return (
    <div>
       <Form>
        <Row>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Référence</Form.Label>
        <Form.Control type="text" placeholder="Référence" />
      </Form.Group>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Désignation</Form.Label>
        <Form.Control type="text" placeholder="Désignation" />
      </Form.Group>
      </Row>
    <Row>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Marque</Form.Label>
        <Form.Control type="text" placeholder="Marque" />
      </Form.Group>
      <Form.Group as={Col} mb="6">
        <Form.Label>Stock</Form.Label>
        <Form.Control type="text" placeholder="Stock" />
      </Form.Group>
      </Row>
      <Row>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Prix</Form.Label>
        <Form.Control type="text" placeholder="Prix" />
      </Form.Group>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Image</Form.Label>
        <Form.Control type="text" placeholder="Image" />
      </Form.Group>
      </Row>
      <Row>
      <Form.Group as={Col} mb="6" >
        <Form.Label>Sous Catégorie</Form.Label>
        <Form.Control type="text" placeholder="Sous Catégorie" />
      </Form.Group>
      </Row>
      
    </Form>
    </div>
  )
}

export default Insertcategorie
