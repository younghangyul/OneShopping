import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {Avatar, Button, Form, Input, Icon, Col, Card, Row, Carousel} from 'antd';
import { Link } from 'react-router-dom';
import ImageSlider from '../../utils/imageSlider';
import Meta from 'antd/lib/card/Meta';

function MyPage(props) {
  const [UserInfo, setUserInfo] = useState("")
  const [Image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
  const [update, setUpdate] = useState(true);
  const [Name, setName] = useState("")
  const [Products, setProducts] = useState([])
  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(4)
  const [PostSize, setPostSize] = useState(0)

  
  const fileInput = useRef(null)

  // props.match.params.userId = 작성자 id
  const id = (localStorage.userId === props.match.params.userId) ? localStorage.userId : props.match.params.userId
  
  useEffect(() => {
    axios.post('/api/users/user', {
      userId: id
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
  
  useEffect(() => {
    axios.post('/api/product/sellingProduct', {
      userId: id
    })
    .then(response => {
      if (response.data.success) {
        setProducts(response.data.productInfo)
      } else {
        alert('상품을 가져오지 못했습니다 :(')
      }
    })
  }, [])
  
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
          window.location.reload();
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
    axios.patch('/api/users/delete', body)
      .then(response => {
        if(response.data.success) {
          alert('기본 프로필 이미지로 변경되었습니다 :)')
          window.location.reload();
        } else {
          alert('프로필 이미지 삭제에 실패했습니다 :(')
        }
      })
  }

  let chatButton, updateButton, cancleButton, deleteButton, editName, nickName = null;
  const onClickUpdate = () => {
    setUpdate(!update);
  }
  const onClickCancle = () => {
    setUpdate(!update);
  }
  const onClickChat = () => {
    props.history.push('/chat');
  }
  const nameChangeHandler = (event) => {
    setName(event.currentTarget.value)
  }
  
  if(UserInfo.userId === localStorage._id) {
    if(update) {
      chatButton = <Button onClick={onClickChat}>채팅</Button>
      updateButton = <Button onClick={onClickUpdate}>수정</Button>
      deleteButton = <Button onClick={onClickDelete}>삭제</Button>
      nickName = UserInfo.name
      
    } else {
      updateButton = <Button onClick={submitHandler}>저장</Button>
      cancleButton = <Button onClick={onClickCancle}>취소</Button>
      editName = <Input style = {{ maxWidth: '400px'}} onChange={nameChangeHandler} value={Name}/>
    }
  }
  

  let test, test2 = null;
  
  const renderCards = Products.map((product, index) => {

    if(product.sold === 1) test = '판매완료'; 
    else test = `즉시 입찰가  ${product.price}원`
    if(product.sold === 1) test2 = '😄';
    else test2 = `현재 입찰가  ${product.bidPrice}원`

    return <Col lg={6} md={8} xs={24} key={index}>
      <Card
        cover={<Link to={`/product/${ product._id }` }><ImageSlider images={ product.images } /></Link> }
      >
        <Meta 
          title={product.title}
          description={[
            <div key={index}>
              <p>{test}</p>
              <p>{test2}</p>
            </div>
          ]}
        />
      </Card>
    </Col>
  })


  
  return (
    <div style = {{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style = {{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>내 정보</h2>
        <Avatar
          src={Image}
          style={{margin:'20px'}}
          size={200}
          onClick={()=>{fileInput.current.click()}}
        />
        <input
          type='file'
          style={{display:'none'}}
          accept='image/jpg,image/png,image/jpeg'
          name='profile_img'
          onChange={onChange}
          ref={fileInput}
        />
        <div style={{ marginBottom: '10px' }}>
          {chatButton}
        </div>
        <div style = {{ textAlign: 'center', marginBottom: '2rem' }}>
          {nickName}
          {editName}
        </div>
        <div>
          {updateButton}
          {deleteButton}
          {cancleButton}
        </div>

        <br /><br /><br />
        <h2>판매중인 상품</h2>
        <Row gutter={[16, 16]}>
          {renderCards}
        </Row>
        {PostSize >= Limit &&
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button >더보기</Button>
          </div>
        }
      </div>
    </div>
  )
}
export default MyPage