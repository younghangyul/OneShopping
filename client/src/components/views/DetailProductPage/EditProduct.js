import React, { useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios'

const { TextArea } = Input;

const Categorys = [
  {key:1, value: "남성의류"},
  {key:2, value: "여성의류"},
  {key:3, value: "도서"},
  {key:4, value: "디지털/가전"},
  {key:5, value: "스포츠/레저"},
  {key:6, value: "생활용품"},
  {key:7, value: "식료품"},
  {key:8, value: "뷰티/미용"},
  {key:9, value: "문구류"},
  {key:10, value: "액세서리"},
  {key:11, value: "티켓"},
  {key:12, value: "기타"}
]

function EditProduct(props) {
  
  const productId = props.match.params.productId

  useEffect(() => {
    Axios.get(`/api/product/product_by_id?id=${ productId }&type=single`)
      .then(response => {
        if(response.data.success) {
          setTitle(response.data.product[0].title)
          setDescription(response.data.product[0].description)
          setDirectPrice(response.data.product[0].directPrice)
          setBidPrice(response.data.product[0].bidPrice)
          setCategory(response.data.product[0].categoty)
        } else {
          alert('상세정보 가져오기 실패')
        }
      })
   }, [])
  
  const [Title, setTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [DirectPrice, setDirectPrice] = useState(0)
  const [BidPrice, setBidPrice] = useState(0)
  const [Category, setCategory] = useState(1)
  const [Images, setImages] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }
  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }
  const directPriceChangeHandler = (event) => {
    setDirectPrice(event.currentTarget.value)
  }
  const bidPriceChangeHandler = (event) => {
    setBidPrice(event.currentTarget.value)
  }
  const categoryChangeHandler = (event) => {
    setCategory(event.currentTarget.value)
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  const submitHandler = (event) => {
    event.preventDefault();

    // 서버에 채운 값을 request로 보낸다.
    const body = {
      writer: props.user.userData._id, // 로그인 된 사람의 ID
      title: Title,
      description: Description,
      directPrice: DirectPrice,
      bidPrice: BidPrice,
      images: Images,
      category: Category
    }
    
    Axios.patch(`/api/product/edit/${productId}`, body)
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
        <select onChange={categoryChangeHandler} value={Category}>
          {Categorys.map(item => (
            <option key={item.key} value={item.key}>{item.value}</option>
          ))}
        </select>
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value={Description} />
        <br />
        <br />
        <label>즉시 입찰가</label>
        <Input type="number" onChange={directPriceChangeHandler} value={DirectPrice} />
        <br />
        <br />
        <label>입찰 시작가</label>
        <Input type="number" onChange={bidPriceChangeHandler} value={BidPrice} />
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