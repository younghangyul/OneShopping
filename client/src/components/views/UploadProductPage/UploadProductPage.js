import React, { useState } from 'react'
import { Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios'

const { TextArea } = Input;

const Regoin = [
  {key:1, value: "신촌"},
  {key:2, value: "모시래"},
  {key:3, value: "단월"},
  {key:4, value: "기숙사: 모시래"},
  {key:5, value: "기숙사: 해오름"}
]


function UploadProductPage(props) {

  const [Title, setTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Price, setPrice] = useState(0)
  const [Region, setRegion] = useState(1)
  const [Images, setImages] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }
  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }
  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }
  const regionChangeHandler = (event) => {
    setRegion(event.currentTarget.value)
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if(!Title || !Description || !Price || !Region || !Images) {
      return alert('모든 값을 넣어야 합니다.')
    }

    // 서버에 채운 값을 request로 보낸다.
    const body = {
      writer: props.user.userData._id, // 로그인 된 사람의 ID
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      region: Region
    }
    
    Axios.post('/api/product', body)
      .then(response => {
        if(response.data.success) {
          alert('상품 업로드에 성공했습니다.')
          props.history.push('/')
        } else {
          alert('상품 업로드에 실패했습니다.')
        }
      })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto '}}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>상품 업로드</h2>
      </div>
      
      <Form onSubmitCapture={submitHandler}>
        {/* DropZone */}

        <FileUpload refreshFunction={updateImages} />

        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title}/>
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>가격(원)</label>
        <Input type="number" onChange={priceChangeHandler} value={Price}/>
        <br />
        <br />
        <select onChange={regionChangeHandler} value={Region}>
          {Regoin.map(item => (
            <option key={item.key} value={item.key}>{item.value}</option>
          ))}
        </select>
        <br />
        <br />
        <Button htmlType='submit'>
          Upload
        </Button>

      </Form>
    </div>
  )
}

export default UploadProductPage