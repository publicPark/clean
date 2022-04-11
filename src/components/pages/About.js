
import stylesPaper from '../styles/Paper.module.scss'

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Contact from './Contact';
import imgA from './asdf.png';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const list = [
  {
    title: '계획이란걸',
    content: '각 구역마다 사건 목록, 사건 수정, 사건 삭제, 구역 나가기, 초대 기능, 프로필 수정, 심판하기'
  },
  {
    title: '11, April, 2022',
    content: '디에스이레가 몇일 남았는지 알려주기, 다음 차례 누구인지 알려주기, '
  },
  {
    title: '10, April, 2022',
    content: '본격 개발 시작'
  }
]

const About = () => {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>ABOUT</h1>
          <h2>사이좋게 즐겁게 청소하자고!</h2>
          <p>같이 사는 공간에서 <br />
            즐겁게 청소하기는 쉽지 않지. <br />
            우리는 규칙을 만들었다. <br />
            일정기간 안에 청소를 해야하고, <br />
            기간이 지나면 <br />
            하루 당 1만원씩 벌금을 내기로 했다. <br />
            그걸 관리하도록 만든 곳이다 여긴.
          </p>
          <img className={stylesPaper.Image} src={imgA} alt="" />
          <p>이걸..</p>
          <h3>since April, 2022</h3>
        </div>
      </div>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <div>
            {list.map((l, i) => {
              return <Accordion key={i}
                expanded={expanded === 'panel'+(i+1)} onChange={handleChange('panel'+(i+1))}
              >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>{l.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {l.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            })}
          </div>
        </div>
      </div>

      <Contact />
    </>
  )
}

export default About