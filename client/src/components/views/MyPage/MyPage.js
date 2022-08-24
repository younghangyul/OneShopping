import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {Avatar, Button, Form} from 'antd';

function MyPage(props) {
  
  const [UserInfo, setUserInfo] = useState("")
 
  useEffect(() => {
    axios.post('/api/users/user', {
        userId: localStorage.userId
    })
      .then(response => {
        if (response.data.success) {
          setUserInfo(response.data.userInfo)
        } else {
          alert("유저 정보 가져오기 실패")
        }
      })
  }, [])


  
  const [Image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')
  const fileInput = useRef(null)
  
  const confirmImage = UserInfo.images && UserInfo.images.length > 0 ?  UserInfo.images[0] : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  
  // const onClickSave = () => {
  //   setImage(confirmImage)
  // }
  
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
      images: Image
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

  // const [update, setUpdate] = useState(true);
  // let updateButton, cancleButton = null;

  // const onClickUpdate = () => {
  //   setUpdate(!update);
  // }

  // const onClickSave = () => {

  // }

  // const onClickCancle = () => {
  //   props.history.go(1);
  //   setUpdate(!update);
  // }

  // if(update) {
  //   updateButton = <Button htmlType='submit' onClick={onClickUpdate}>수정</Button>
  // } else {
  //   updateButton = <Button htmlType='submit' onClick={submitHandler}>저장</Button>
  //   cancleButton = <Button htmlType='submit' onClick={onClickCancle}>취소</Button>
  // }

  return (
    <div style = {{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style = {{ textAlign: 'center', marginBottom: '2rem' }}>
        <Form onSubmitCapture={submitHandler}>
          <h2>내 정보</h2>
          <Avatar 
            src={Image}
            style={{margin:'20px'}}
            size={200}
            onClick={()=>{fileInput.current.click()}}/>
          <input 
 	          type='file' 
    	      style={{display:'none'}}
            accept='image/jpg,impge/png,image/jpeg' 
            name='profile_img'
            onChange={onChange}
            ref={fileInput}/>
          {UserInfo.name}
          <Button htmlType='submit'>
              저장
          </Button>
          {/* {updateButton}
          {cancleButton} */}
        </Form>
      </div>
    </div>
  )
}

export default MyPage




