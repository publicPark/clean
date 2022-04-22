
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
    title: '☄️ Dies irae',
    content: '디에스 이레\n최후의 심판\n이 날까지 청소를 안하면 심판이 내려진다.',
    iframe: [
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/FGqoU9NIjZw?start=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/up0t2ZDfX7E?start=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,   
      ]
  },
  {
    title: '👏 박수쳐',
    content: '즐겁게 청소하고 깨끗하고 행복하다면\n박수를 쳐줘라!',
    iframe: [
      `<iframe width="560" height="315" src="https://www.youtube.com/embed/gyds04mi_Z0?start=76" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    ]
  },
  {
    title: '⌛ 최대 청소 주기(제한 기간)',
    content: '내 차례가 되면 이 기간 안에 청소하면 된다.\n여유를 부려도 좋으나 시간은 흐른다. \n째깍째깍\n',
    // iframe: <iframe width="560" height="315" src="https://www.youtube.com/embed/O2IuJPh6h_A?start=57" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    iframe: [
      `<iframe iframe width="560" height="315" src="https://www.youtube.com/embed/K28H04Y2IdE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    ]
  },
]

const Terms = () => {
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={`${stylesPaper.Wrapper}`}>
      <div className={stylesPaper.Content}>
        <h1>
          ☄️ 👏 ⌛
        </h1>
        {/* <h3 class="blur">: DJ DROP THE BEAT</h3> */}
      </div>
      <div>
        {list.map((l, i) => {
          return <Accordion key={i}
            expanded={expanded === 'panel'+(i+1)} onChange={handleChange('panel'+(i+1))}
          >
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography>{l.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="line-space" sx={{p:1}}>
                {l.content}
              </Typography>
              {l.iframe && l.iframe.map(((f, i) =>
                <div className="video_wrapper" key={i}>
                  <div sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: f }}></div>
                </div>))
              }
            </AccordionDetails>
          </Accordion>
        })}
      </div>
    </div>
  )
}

export default Terms