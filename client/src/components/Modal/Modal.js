import React, { useState } from 'react';
import './modal.css';
import { Button, Input } from 'antd';

function Modal(props) {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;
  const existingBidPrice = props.existingBidPrice;

  const [BidPrice, setBidPrice] = useState()

  const sendPriceHandler = () => {
    if(existingBidPrice < BidPrice) {
      props.Function(BidPrice)
    } else {
      alert('임찰 금액이 현재 입찰 가격보다 작습니다 :(')
      window.location.reload();
    }
  }
  
  const BidPriceChangeHandler = (event) => {
    setBidPrice(event.currentTarget.value)
  }

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? 
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>
            현재 입찰 가격: {existingBidPrice}
            <Input type="number" onChange={BidPriceChangeHandler} value={BidPrice} />
            {props.children}
          </main>
          <footer>
            <Button className="send" onClick={sendPriceHandler}> 입찰 </Button>
            &nbsp;
            <Button className="close" onClick={close}> 취소 </Button>
          </footer>
        </section>
       : null}
    </div>
  );  
}

export default Modal
