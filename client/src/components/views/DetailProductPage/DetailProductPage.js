import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductImage from './Sectoins/ProductImage';
import ProductInfo from './Sectoins/ProductInfo';
import { Row, Col, Button } from 'antd';

function DetailProductPage(props) {
  
  const productId = props.match.params.productId

  const [Product, setProduct] = useState({})
  const [Writer, setWriter] = useState({})

  useEffect(() => {
    axios.get(`/api/product/product_by_id?id=${ productId }&type=single`)
      .then(response => {
        if(response.data.success) {
          setProduct(response.data.product[0]);
          setWriter(response.data.product[0].writer);
        } else {
          alert('상세정보 가져오기 실패')
        }
      })
    }, [])

  const deleteProduct = (event) => {
    event.preventDefault();

    axios.delete(`/api/product/${productId}`)
      .then(response => {
        if(response.data.success) {
          alert('게시물이 삭제되었습니다.')
          props.history.push('/')
        } else {
          alert('게시물 삭제에 실패했습니다.')
        }
      })
  }

  const soldProduct = (event) => {
    event.preventDefault();

    let body = {
      productId : productId
    }

    axios.patch('/api/product/sold', body)
      .then(response => {
        if(response.data.success) {
          
          console.log(response.data.product[0].sold)
          alert('판매완료 처리 되었습니다 :)')
          // props.history.push('/')
        } else {
          alert('판매완료 처리 실패했습니다 :(')
        }
      })
      
  }

  return (
    <div style = {{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{Product.title}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'end'}}>
        <a href={`/product/edit/${Product._id}`}>
          <Button size='large' shape='round' >
            Edit
          </Button>
        </a>
        &nbsp;&nbsp;
        <Button size='large' shape='round' onClick={soldProduct}>
            Sold
        </Button>
        &nbsp;&nbsp;
        <Button size='large' shape='round' type='danger' onClick={deleteProduct}>
            Remove
        </Button>
      </div>
      <br /><br />

      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          <ProductImage detail={Product}/>
        </Col>
        <Col lg={12} sm={24}>
          <ProductInfo detail={Product} writer={Writer}/>
        </Col>
      </Row>
      

    </div>
  )
}

export default DetailProductPage