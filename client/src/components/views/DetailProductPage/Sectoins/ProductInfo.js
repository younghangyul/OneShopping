import React, {useEffect, useState} from 'react'
import { Descriptions } from 'antd';

function ProductInfo(props) {
  
  return (
    <div>
      <Descriptions title="Info" bordered>
        <Descriptions.Item label="판매자">{props.writer.name}</Descriptions.Item>
        <Descriptions.Item label="Price">{props.detail.directPrice}</Descriptions.Item>
        <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
        <Descriptions.Item label="BiddingPrice">{props.detail.bidPrice}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default ProductInfo