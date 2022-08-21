import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd';
import axios from 'axios';

function ProfileUpload() {

  const [Images, setImages] = useState("")



  const dropHandler = (files) => {

    let formData = new FormData();
    const config = {
      header: {'content-type': 'multipart/form-data'}
    }
    formData.append("file", files[0])

    axios.post('/api/users/image', formData, config)
      .then(response => {
        if(response.data.success) {
          setImages([Images])
        } else {
          alert("파일 저장 실패")
        }
      })
  }

  return (
    <div>
      <Dropzone onDrop={dropHandler}>
        {({getRootProps, getInputProps}) => (
          <div
            style={{
              width: 50, height: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            {...getRootProps()}>
            <input {...getInputProps()} />
            <Icon type='github' />
          </div>
        )}
      </Dropzone>

      <div style={{display:'flex'}}>
            
      </div>

    </div>
  )
}

export default ProfileUpload