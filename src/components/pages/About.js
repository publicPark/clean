
import stylesPaper from '../styles/Paper.module.scss'
import { useState } from 'react';
import imgA from './asdf.png';
import Icons from './Icons';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

const About = () => {
  return (
    <>
      <div className={ stylesPaper.Flex }>
        <div className={`${stylesPaper.Wrapper}`}>
          <div className={stylesPaper.Content}>
            <h1>ABOUT 즐청</h1>
            {/* <h2>즐청</h2> */}
            <p>
              청소 당번이 누구고,<br />
              언제까지 청소해야하는지<br />
              알려주는 곳입니다.
            </p>
            <p>
              여럿이 같이 사는 공간에서<br />
              즐겁게 청소하기는 쉬운 일이 아니죠.<br />
              그래서 우린 청소 규칙을 정했어요.<br />
              청소 당번은 제한 기간 안에 청소를 해야하고,<br />
              기간이 지나면 지난 만큼 하루당<br />
              만원씩 벌금을 내기로 했어요.<br /><br />
              그걸 관리하도록 만든 곳이에요 여긴.
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

        <Icons />
      </div>

      <div className={stylesPaper.bottomFixed}>
        <Box sx={{ width: '100%', mt: 2, bottom: 0}}>
          <Stack spacing={2}>
            <Paper sx={{ p: 1, fontSize: 'small' }}>
              <span className="blur">청소당번 바톤터치, 평화로운 청소마을 그리고 심판의 날, 즐거운 청소, 즐청, 킨클린, KINclean</span>
            </Paper>
          </Stack>
        </Box>
      </div>
    </>
  )
}

export default About