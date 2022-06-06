import React, { useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios'

const { TextArea } = Input;

const Continents = [
  {key:1, value: "신촌"},
  {key:2, value: "모시래"},
  {key:3, value: "단월"},
  {key:4, value: "기숙사: 모시래"},
  {key:5, value: "기숙사: 해오름"}
]

function EditProduct(props) {
  
  const productId = props.match.params.productId

  // const [Product, setProduct] = useState({})

  useEffect(() => {
    Axios.get(`/api/product/product_by_id?id=${ productId }&type=single`)
      .then(response => {
        if(response.data.success) {
          setTitle(response.data.product[0].title)
          setDescription(response.data.product[0].description)
          setPrice(response.data.product[0].price)
          setContinent(response.data.product[0].continent)
        } else {
          alert('상세정보 가져오기 실패')
        }
      })
   }, [])
  
  const [Title, setTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Price, setPrice] = useState(0)
  const [Continent, setContinent] = useState(1)
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
  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value)
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if(!Title || !Description || !Price || !Continent || !Images) {
      return alert('모든 값을 넣어야 합니다.')
    }

    // 서버에 채운 값을 request로 보낸다.
    const body = {
      writer: props.user.userData._id, // 로그인 된 사람의 ID
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      continent: Continent
    }
    
    Axios.put('/api/product', body)
      .then(response => {
        if(response.data.success) {
          alert('게시물 수정에 성공했습니다 :)')
          props.history.push(`/product/${ productId }`)
        } else {
          alert('게시물 수정에 실패했습니다 :(')
        }
      })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto '}}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>게시물 수정</h2>
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
        <Input type="number" onChange={priceChangeHandler} value={Price} />
        <br />
        <br />
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map(item => (
            <option key={item.key} value={item.key}>{item.value}</option>
          ))}
        </select>
        <br />
        <br />
        <Button htmlType='submit'>
          Edit
        </Button>
      </Form>
    </div>
  )
}

export default EditProduct