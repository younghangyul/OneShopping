import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/imageSlider';
import CheckBox from '../LandingPage/Sections/CheckBox';
import RadioBox from '../LandingPage/Sections/RadioBox';
import Sold from './Sections/Sold';
import SearchFeature from './Sections/SearchFeature';
import { category, price, sold } from './Sections/Datas'
import { Link } from 'react-router-dom';

function LandingPage() {
  
  const [Products, setProducts] = useState([])
  const [Skip, setSkip] = useState(0)
  const [Limit, setLimit] = useState(20)
  const [PostSize, setPostSize] = useState(0)
  const [Filters, setFilters] = useState({
    category: [],
    price: [],
    sold: []
  })
  const [SearchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    let body ={
      skip: Skip,
      limit: Limit
    }
  getProducts(body)
  }, [])
  
  const getProducts = (body) => {
    axios.post('/api/product/products', body)
    .then(response => {
      if(response.data.success) {
        if(body.loadMore) {
          setProducts([...Products, ...response.data.productInfo])
        } else {
          setProducts(response.data.productInfo)
        }
        setPostSize(response.data.postSize)
      } else {
        alert(' 상품들을 가져오는 데 실패했습니다.')
      }
    })
  }
  
  const loadMoreHandler = () => {
    let skip = Skip + Limit
    
    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true
    }
    
    getProducts(body)
    setSkip(skip)
  }

  let test, test2 = null;

  const renderCards = Products.map((product, index) => {
    
    if(product.sold === 1) test = '판매완료'; 
    else test = `즉시 구매가  ${product.price}원`
    
    if(product.sold === 1) test2 = '😄';
    else test2 = `현재 입찰가  ${product.bidPrice}원`
    
    return <Col lg={6} md={8} xs={24} key={index}>
      <Card
        cover={ <Link to={`/product/${ product._id }` }><ImageSlider images={ product.images } /></Link> }
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
  
  
  const showFilteredResults = (filters) => {
   
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters
    }
    
    getProducts(body)
    setSkip(0)
  }


  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for(let key in data) {
      if(data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  }
  
  const handleSold = (value) => {
    const data = sold;
    let confirm = [];

    for(let key in data) {
      if(data[key]._id === parseInt(value, 10)) {
        confirm = data[key].sold;
      }
    }
    return confirm;
  }

  const handleFilters = (filters, category) => {
    const newFilters = {...Filters}
    newFilters[category] = filters
    if(category === 'price') {
      let priceValues = handlePrice(filters)
      newFilters[category] = priceValues
    }
    if(category === 'sold') {
      let soldValues = handleSold(filters)
      newFilters[category] = soldValues
    }
    showFilteredResults(newFilters)
    setFilters(newFilters)
  }

  const updateSearchTerm = (newSearchTerm) => {
    setSearchTerm(newSearchTerm)

    let body = {
      skip: 0,
      limigt: Limit,
      filters: Filters,
      serachTerm: newSearchTerm
    }
    setSkip(0)
    setSearchTerm(newSearchTerm)
    getProducts(body)
  }

  return (
    <div style={{width: '75%', margin: '3rem auto'}}>
      <div style={{textAlign: 'center'}}>
        <h2>Shopping! <Icon type="shop"/> </h2>
      </div>
      {/* Filter */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <CheckBox list={category} handleFilters={filters => handleFilters(filters, 'category')} />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <RadioBox list={price} handleFilters={filters => handleFilters(filters, 'price')} />
        </Col>
      </Row>
      <Row>
        <Sold list={sold} handleFilters={filters => handleFilters(filters, 'sold')} />
      </Row>
      {/* Search */}
      <div style ={{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
        <SearchFeature 
          refreshFunction={updateSearchTerm}
        />
      </div>
      {/* Cards  */}
      <Row gutter={[16, 16]}>
        {renderCards}
      </Row>
      <br />
      {PostSize > Limit &&
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      }
    </div>
  )
}

export default LandingPage