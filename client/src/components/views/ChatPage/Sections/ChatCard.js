import React from 'react'
import moment from 'moment'
import { Comment, Tooltip, Avatar } from 'antd';
import './ChatCard.css'

const ChatCard = (props) => {
  const userId = localStorage.userId;

  return (
    <div style={{ width: '100%' }}>
        
        <Comment
            author={
                props.sender._id === userId ?
                null
            :
                props.sender.name
            }
            avatar={
                props.sender._id === userId ?
                null
                :
                <Avatar
                    src={props.sender.image} alt={props.sender.name}
                />
            }
            content={
                props.sender._id === userId ?
                props.message.substring(0, 7) === 'uploads' ?
                    props.message.substring(props.message.length - 3, props.message.length) === 'mp4' ?
                        <p align='right'>
                        <video
                            style={{ maxWidth: '200px' }}
                            src={`http://localhost:5000/${props.message}`}
                            alt="video"
                            type="video/mp4" controls />
                        </p>
                        :
                        <p align='right'>
                        <img 
                            style={{ maxWidth: '200px' }}
                            src={`http://localhost:5000/${props.message}`}
                            alt="img" />
                        </p>
                :
                <div className='myballoon'>
                    {props.message}
                </div>
                :
                props.message.substring(0, 7) === 'uploads' ?
                    props.message.substring(props.message.length - 3, props.message.length) === 'mp4' ?
                        <video
                            style={{ maxWidth: '200px' }}
                            src={`http://localhost:5000/${props.message}`}
                            alt="video"
                            type="video/mp4" controls />
                        :
                        <img 
                            style={{ maxWidth: '200px' }}
                            src={`http://localhost:5000/${props.message}`}
                            alt="img" />
                :
                <div className='otherballoon'>
                    {props.message}
                </div>
            }
            datetime={
                props.sender._id === userId ?
                null
                :
                <span>{props.createdAt.substring(0,10)}</span>
            }
        />
    </div>
  )
}

export default ChatCard