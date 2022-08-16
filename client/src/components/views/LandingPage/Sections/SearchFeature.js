import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input

function SearchFeature(props) {

  const [SearchTerm, setSearchTerm] = useState("")

  const searchHandler = (event) => {
    console.log(event.currentTarget.value)
    setSearchTerm(event.currentTarget.value) //타이핑 할 때마다 SearchTerm 값 변경
    props.refreshFunction(event.currentTarget.value)
  } 

  return (
    <div>
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{ width: 200 }}
        value={SearchTerm}
        />
    </div>
  )
}

export default SearchFeature