import React, {useEffect, useState} from 'react'
import { Descriptions } from 'antd';

function ProductInfo(props) {
  
  const [bidPrice, setbidPrice] = useState(props.detail.bidPrice)

  useEffect(() => {
    setbidPrice(props.detail.bidPrice)
  }, [props.detail.bidPrice])
  
  return (
    <div>
      <Descriptions title="Info" bordered>
        <Descriptions.Item label="판매자"><a href={`/users/${props.writer._id}`}>{props.writer.name}</a></Descriptions.Item>
        <Descriptions.Item label="가격">{props.detail.price}</Descriptions.Item>
        <Descriptions.Item label="상세설명">{props.detail.description}</Descriptions.Item>
        <Descriptions.Item label="현재 입찰 가격">{bidPrice}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default ProductInfo