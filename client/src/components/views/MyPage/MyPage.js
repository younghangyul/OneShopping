import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {Avatar, Button, Form, Input, Icon, Col, Card, Row, Carousel} from 'antd';

function MyPage(props) {
  const [UserInfo, setUserInfo] = useState("")
  const [Image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
  const [update, setUpdate] = useState(true);
  const [Name, setName] = useState("")
  
  useEffect(() => {
    axios.post('/api/users/user', {
        userId: localStorage.userId
    })
      .then(response => {
        if (response.data.success) {
          setUserInfo(response.data.userInfo)
          response.data.userInfo.images && response.data.userInfo.images.length > 0 ?
          setImage(response.data.userInfo.images[0]) : setImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
          setName(response.data.userInfo.name)
        } else {
          alert("유저 정보 가져오기 실패")
        }
      })
  }, [])
  
  // const [Products, setProducts] = useState([])

  // const getProducts = (body) => {
  //   axios.post('/api/product/products', body)
  //   .then(response => {
  //     if(response.data.success) {
  //       if(body.loadMore) {
  //         setProducts([...Products, ...response.data.productInfo])
  //       } else {
  //         setProducts(response.data.productInfo)
  //       }
  //       setPostSize(response.data.postSize)
  //     } else {
  //       alert(' 상품들을 가져오는 데 실패했습니다.')
  //     }
  //   })
  // }

  const fileInput = useRef(null)
  const onChange = (e) => {
    if(e.target.files[0]) {
    //화면에 프로필 사진 표시
      const reader = new FileReader();
      reader.onload = () => {
        if(reader.readyState === 2){
          setImage(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const submitHandler = (event) => {
    event.preventDefault();
    // 서버에 채운 값을 request로 보낸다.
    const body = {
      userId: UserInfo._id,
      images: Image,
      name: Name
    }
    axios.patch('/api/users/profile', body)
      .then(response => {
        if(response.data.success) {
          alert('내 정보가 수정됐습니다 :)')
          props.history.push('/users/myPage')
        } else {
          alert('내 정보 수정에 실패했습니다 :(')
        }
      })
  }
  const onClickDelete = (event) => {
    event.preventDefault();
    // 서버에 채운 값을 request로 보낸다.
    const body = {
      userId: UserInfo._id,
      images: setImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
    }
    axios.patch('/api/users/profile', body)
      .then(response => {
        if(response.data.success) {
          alert('기본 프로필 이미지로 변경되었습니다 :)')
          props.history.push('/users/myPage')
        } else {
          alert('내 정보 수정에 실패했습니다 :(')
        }
      })
  }

  let updateButton, cancleButton, deleteButton, editName = null;
  const onClickUpdate = () => {
    setUpdate(!update);
  }
  const onClickCancle = () => {
    props.history.go(1);
    setUpdate(!update);
  }
  const nameChangeHandler = (event) => {
    setName(event.currentTarget.value)
  }
  if(update) {
    updateButton = <Button onClick={onClickUpdate}>수정</Button>
    deleteButton = <Button onClick={onClickDelete}>삭제</Button>
    
  } else {
    updateButton = <Button onClick={submitHandler}>저장</Button>
    cancleButton = <Button onClick={onClickCancle}>취소</Button>
    editName = <Input onChange={nameChangeHandler} value={Name}/>
  }

  // const renderCards = Products.map((product, index) => {
  //   return <Col lg={6} md={8} xs={24} key={index}>
  //     <Card
  //       cover={ <Link to={`/product/${ product._id }` }><ImageSlider images={ product.images } /></Link> }
  //     >
  //       <Meta 
  //         title={product.title}
  //         description={`${product.price}원`}
  //       />
  //     </Card>
  //   </Col>
  // })

  return (
    <div style = {{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style = {{ textAlign: 'center', marginBottom: '2rem' }}>
        <Form>
          <h2>내 정보</h2>
          <Avatar
            src={Image}
            style={{margin:'20px'}}
            size={200}
            onClick={()=>{fileInput.current.click()}}/>
          <input
            type='file'
            style={{display:'none'}}
            accept='image/jpg,image/png,image/jpeg'
            name='profile_img'
            onChange={onChange}
            ref={fileInput}/>
          {updateButton}
          {deleteButton}
          {cancleButton}
          {editName}

          {/* <Row gutter={[16, 16]}>
          {renderCards}
        </Row> */}
        </Form>
      </div>
    </div>
  )
}
export default MyPage