
import stylesPaper from '../styles/Paper.module.scss'
import { useState } from 'react';
import imgA from './asdf.png';
import Questions from './Questions';

const About = () => {

  return (
    <>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>ABOUT</h1>
          <h3 className="accent2">CLEAN RELAY: 청소당번 바톤터치!</h3>
          <p>같이 사는 공간에서 <br />
            즐겁게 청소하기는 쉽지 않지. <br />
            그래서 우리는 규칙을 만들었다. <br /><br />
            제한 기간 안에 청소를 해야하고, <br />
            기간이 지나면? <br />
            하루 당 1만원씩 벌금을 내기로 했다. <br /><br />
            그걸 관리하도록 만든 곳이다 여긴.
          </p>
          {/* <img className={stylesPaper.Image} src={imgA} alt="" />
          <p>이걸..</p> */}
          <h3 className="accent">since April, 2022</h3>
        </div>
      </div>

      <Questions />
    </>
  )
}

export default About