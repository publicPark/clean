import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import stylesPaper from '../styles/Paper.module.scss'
import News from "./News";
import Places from "./Places";
import format from 'date-fns/format'
import useNow from "../../apis/useNow";

const Dashboard = ({ currentUser }) => {
  const { now } = useNow()
  
  return (
    <div className={ stylesPaper.Flex }>
      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <h2>즐거운 청소!</h2>
          <h3 className={ stylesPaper.Blur }>{format(now, "yyyy-MM-dd")}</h3>
          <h2 className={ stylesPaper.ColorAccent2 }>{format(now, 'HH:mm:ss')}</h2>
          {currentUser ?
            <>
              <p>{currentUser.displayName} 하이.</p>
            </>
            :
            <>
              <p>로그인을 하면, 청소할 수 있지!</p>
            </>
          }
        </div>
      </div>

      
      <Places currentUser={currentUser} now={ now }/>

      <div className={stylesPaper.Wrapper}>
        <div className={stylesPaper.Content}>
          <News currentUser={ currentUser } />
        </div>
      </div>
    </div>
  )
}
export default Dashboard