import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd';
import axios from 'axios';

function ImageUpload(props) {
  
  const [Images, setImages] = useState([])

  const dropHandler = (files) => {
    
    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    axios.post('/api/users/image', formData, config)
      .then(response=> {
        if(response.data.success) {
          setImages([...Images, response.data.filePath])
          props.refreshFunction([...Images, response.data.filePath])
        } else {
          alert('파일 저장 실패')
        }
      })
  }

  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image)
    let newImages = [...Images]
    newImages.splice(currentIndex, 1)
    setImages(newImages)
    props.refreshFunction(newImages)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
      <Dropzone onDrop={dropHandler}>
        {({getRootProps, getInputProps}) => (
          <div
            style={{
              width: 300, height: 240, border: '1px solid lightgray',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            {...getRootProps()}>
            <input {...getInputProps()} />
            <Icon type='plus' style={{foneSize: '3rem'}} />
          </div>
        )}
      </Dropzone>

      <div style={{dispaly: 'flex', width: '320px', height: '285px', overflowX: 'scroll'}}>
        {Images.map((image, index) => (
          <div onClick={()=> deleteHandler(image)} key={index}>
            <img style={{ minWidth: '300px', width: '300px', height: '240px' }} 
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUpload