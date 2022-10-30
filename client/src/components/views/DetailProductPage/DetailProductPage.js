import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductImage from './Sectoins/ProductImage';
import ProductInfo from './Sectoins/ProductInfo';
import { Row, Col, Button, Input } from 'antd';
import Modal from '../../Modal/Modal';

function DetailProductPage(props) {
  
  const productId = props.match.params.productId

  const [Product, setProduct] = useState({})
  const [Writer, setWriter] = useState({})
  const [ModalOpen, setModalOpen] = useState(false)
  const [BidPrice, setBidPrice] = useState()

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

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

    const body = {
      productId : productId
    }

    axios.patch('/api/product/sold', body)
      .then(response => {
        if(response.data.success) {
          alert('판매완료 처리 되었습니다 :)')
          props.history.push('/')
        } else {
          alert('판매완료 처리 실패했습니다 :(')
        }
      })
  }

  const directBuy = (event) => {
    event.preventDefault();

    const confirmDirectBuy = window.confirm(`즉시구매가는 ${Product.price}원 입니다.\n채팅창으로 이동하시겠습니까?`)
    if(confirmDirectBuy) {
      props.history.push('/chat');
    } else {    
    }
  }

  const setBidding = (newPrice) => {
    
    if(Product.price > newPrice) {
    const body = {
      productId: productId,
      bidPrice: newPrice
    }
    axios.patch('/api/product/bidding', body)
       .then(response => {
         if(response.data.success) {
           alert('입찰 되었습니다 :)')
           window.location.reload()
         } else {
           alert('입찰에 실패했습니다 :(')
         }
        })
    } else {
      alert(`즉시구매가인 ${Product.price}원보다 낮아야 합니다.`)
    }
  }

  const chatting = () => {
    props.history.push('/chat');
  }

  let chatButton, editButton, soldButton, removeButton, directButton, biddingButton, modalButton = null
  
  if( Writer._id === localStorage.userId ) {
    editButton = <Button size='large' shape='round'> 수정 </Button>
    soldButton = <Button size='large' shape='round' onClick = {soldProduct}> 판매완료 </Button>
    removeButton = <Button size='large' shape='round'type = 'danger' onClick = {deleteProduct}> 삭제 </Button>
  } else {
    directButton = <Button size='large' shape='round' onClick = {directBuy}> 즉시구매 </Button>
    biddingButton = <Button size='large' shape='round' onClick = {openModal}> 입찰 </Button>
    modalButton = <Modal 
                    open={ModalOpen}
                    close={closeModal}
                    header="Bidding!"
                    existingBidPrice = {Product.bidPrice}
                    Function = {setBidding}
                  >
                  </Modal> 
  }
  
  return (
    <div style = {{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{Product.title}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'end'}}>
        <a href={`/product/edit/${Product._id}`}>
        {editButton}
        </a>
        &nbsp;&nbsp;
        {soldButton}
        &nbsp;&nbsp;
        {removeButton}
        {chatButton}
        &nbsp;&nbsp;
        {directButton}
        &nbsp;&nbsp;
        {biddingButton}{modalButton}
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