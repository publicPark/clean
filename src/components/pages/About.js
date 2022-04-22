
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
          <h2>
            <span className="accent3">평화로운 청소마을</span><br />
            <small className="accent">그리고 심판의 날</small>
          </h2>
          <p>
            평화로운 청소마을<br />
            사이좋게 청소를 하며 살아가던 주민들 사이에<br />
            청소를 게을리 하는 자가 등장하자 혼란이 일어난다.<br />
            <br />
            우리는 평화를 위해 심판의 날을 만들었다.<br />
            <br />
            청소를 잘 하면 박수를 받으라!<br />
            청소를 늦게 하면 심판을 받으라!
          </p>
          {/* <h3 className="accent2">CLEAN RELAY: 청소당번 바톤터치!</h3>
          <p>같이 사는 공간에서 <br />
            즐겁게 청소하기는 쉽지 않지. <br />
            그래서 우리는 규칙을 만들었다. <br /><br />
            제한 기간 안에 청소를 해야하고, <br />
            기간이 지나면? <br />
            하루 당 1만원씩 벌금을 내기로 했다. <br /><br />
            그걸 관리하도록 만든 곳이다 여긴.
          </p> */}
          {/* <img className={stylesPaper.Image} src={imgA} alt="" />
          <p>이걸..</p> */}
          <h3 className="blur">since April, 2022</h3>
        </div>
      </div>

      <Questions />
    </>
  )
}

export default About