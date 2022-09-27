import React, { useState } from 'react';
import './modal.css';
import { Button, Input } from 'antd';

function Modal(props) {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;
  const existingBidPrice = props.bidPrice;

  const [BidPrice, setBidPrice] = useState()

  const sendPriceHandler = () => {
    props.Function(BidPrice)
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
            <Button className="send" onClick={sendPriceHandler}> Bid </Button>
            &nbsp;
            <Button className="close" onClick={close}> Close </Button>
          </footer>
        </section>
       : null}
    </div>
  );  
}

export default Modal
