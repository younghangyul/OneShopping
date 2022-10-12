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
        <Descriptions.Item label="Price">{props.detail.directPrice}</Descriptions.Item>
        <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
        <Descriptions.Item label="BiddingPrice">{bidPrice}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default ProductInfo