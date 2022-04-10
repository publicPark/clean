
import stylesPaper from '../styles/Paper.module.scss'

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

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
    title: '계획',
    content: '이벤트 삭제, 이벤트 수정, 방 나가기, 초대 기능, 다음 차례 누구인지 알려주기, 몇일 남았는지'
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
          <h2>사이좋게 청소하자고!</h2>
          <h3>since April, 2022</h3>
          <h4>by <a href="mailto:public.park.ji.@gmail.com">public park ji</a>, ...</h4>
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
    </>
  )
}

export default About