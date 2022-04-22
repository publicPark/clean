
import stylesPaper from '../styles/Paper.module.scss'
import Updates from './Updates'
import Contact from './Contact'

const Notice = () => {
  return (
    <div className={ stylesPaper.Flex }>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>NOTICE</h1>
          
          <p>아직 공사중이라</p>
          <p>주민 여러분들의 <b className="accent">소중한 기록을</b></p>
          <p><b className="accent">제가 날릴 수도 있습니다.</b></p>
          <p>최대한 안 날려보도록 노력은 하겠음</p>
          <h2>😜</h2>
        </div>
      </div>
      <Contact />

      <Updates />
    </div>
  )
}

export default Notice