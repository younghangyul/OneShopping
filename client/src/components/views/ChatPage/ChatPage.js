import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import moment from 'moment';
import { getChats, afterPostMessage } from '../../../_actions/chat_actions';
import ChatCard from './Sections/ChatCard';
import Dropzone from 'react-dropzone';
import axios from 'axios';

export class ChatPage extends Component {
    state = {
        chatMessage: "",

    }

    componentDidMount() {
        let server = "http://localhost:5000";

        this.props.dispatch(getChats());

        this.socket = io(server);

        this.socket.on('Output Chat Message', messageFromBackEnd => {
            this.props.dispatch(afterPostMessage(messageFromBackEnd));
        })
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({behavior: 'smooth'});
    }

    handleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }

    renderCards = () => 
        this.props.chats.chats &&
            this.props.chats.chats.map((chat) => (
                <ChatCard
                    key={chat._id}
                    {...chat}
                 />
            ))

    onDrop = (files) => {
        console.log('files', files);
        let formData = new FormData;

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append('file', files[0])

        axios.post('api/chat/uploadfiles', formData, config)
            .then(res => {
                if(res.data.success) {
                    let chatMessage = res.data.url;
                    let userId = this.props.user.userData._id;
                    let userName = this.props.user.userData.name;
                    let nowTime = moment().format('YYYYMMDD HH:mm');
                    let type = 'VideoOrImage';

                    this.socket.emit('Input Chat Message', {
                        chatMessage,
                        userId,
                        userName,
                        nowTime,
                        type
                    });
                }
            })
    }

    submitChatMessage = (e) => {
        e.preventDefault();

        let chatMessage = this.state.chatMessage;
        let userId = this.props.user.userData._id;
        let userName = this.props.user.userData.name;
        let nowTime = moment().format('YYYYMMDD HH:mm');
        let type = 'Text';

        this.socket.emit('Input Chat Message', {
            chatMessage,
            userId,
            userName,
            nowTime,
            type
        });
        this.setState({ chatMessage: "" })
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>쪽지</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className='infinite-container' style={{ height: '500px', overflowY: 'scroll'}}>
                        {this.props.chats && (
                            <div>{this.renderCards()}</div>
                        )}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{ float: 'left', clear: 'both' }}
                        />
                    </div>

                    <Row>
                        <Form layout='inline' onSubmit={this.submitChatMessage}>
                            <Col span={18}>
                                <Input
                                    id="message"
                                    prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="메세지를 입력해주세요."
                                    type='text'
                                    value={this.state.chatMessage}
                                    onChange={this.handleSearchChange}
                                />
                            </Col>
                                
                            <Col span={2}>
                                <Dropzone onDrop={this.onDrop}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Button>
                                                <Icon type='upload' />
                                            </Button>
                                        </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Col>

                            <Col span={4}>
                                <Button type='primary' style={{ width: '100%' }} onClick={this.submitChatMessage} htmlType='submit'>
                                    <Icon type='enter' />
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}

export default connect(mapStateToProps)(ChatPage);