
import stylesPaper from '../styles/Paper.module.scss'
import { useState } from 'react';
import imgA from './asdf.png';
import Terms from './Terms';
import Divider from '@mui/material/Divider';

const About = () => {

  return (
    <div className={ stylesPaper.Flex }>
      <div className={`${stylesPaper.Wrapper}`}>
        <div className={stylesPaper.Content}>
          <h1>ABOUT</h1>
          <p>
            같이 사는 공간에서<br />
            즐겁게 청소하기는 쉽지 않지.<br />
            그래서 우리는 규칙을 만들었다.<br />
            제한 기간 안에 청소를 해야하고,<br />
            기간이 지나면?<br />
            하루에 만원씩 벌금을 내기로 했다.<br />
            그걸 관리하도록 만든 곳이다 여긴.
          </p>
          <h3 className="blur">since April, 2022</h3>
          {/* <img className={stylesPaper.Image} src={imgA} alt="" /> */}
          {/* <p>이걸..</p> */}
          <Divider sx={{ mt: 5, mb: 5 }} />
          <h1>
            <span className="accent3">평화로운 청소마을</span><br />
            <small className="accent">그리고 심판의 날</small>
          </h1>
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
        </div>
      </div>

      <Terms />
    </div>
  )
}

export default About