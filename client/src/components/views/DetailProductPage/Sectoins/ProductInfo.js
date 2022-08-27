import React from 'react'
import { Descriptions } from 'antd';

function ProductInfo(props) {

  return (
    <div>
      <Descriptions title="Info" bordered>
      {/* <Descriptions.Item label="판매자">{props.detail.writer.name}</Descriptions.Item> */}
      <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
      <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      
    </div>
  )
}

export default ProductInfo