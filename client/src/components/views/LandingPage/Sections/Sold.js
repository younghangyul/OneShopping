import React, {useState} from 'react';
import {Collapse, Radio} from 'antd';


const {Panel} = Collapse;

function Sold(props) {

  const [Value, setValue] = useState(0)

  const renderSold = () => (
    props.list && props.list.map(value => (
      <Radio key={value._id} value={value._id}> {value.name} </Radio>
    ))
  )

  const handleChange = (event) => {
    setValue(event.target.value)
    props.handleFilters(event.target.value)
  }

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Sold" key="1">
          
          <Radio.Group onChange={handleChange} value={Value}>
            {renderSold()}
          </Radio.Group>

        </Panel>
      </Collapse>  
    </div>
  )
}

export default Sold