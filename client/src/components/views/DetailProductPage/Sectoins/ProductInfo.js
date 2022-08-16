import React from 'react'
import { Descriptions } from 'antd';

function ProductInfo(props) {

  // const clickHandler = () => {

  // }

  return (
    <div>
      <Descriptions title="Info" bordered>
      <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
      <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      
      {/* <div style={{ display: 'flex', justifyContent: 'center'}}>
        <Button size='large' shape='round' onClick={clickHandler}>
            Edit
        </Button>
      </div> */}
    </div>
  )
}

export default ProductInfo