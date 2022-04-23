
import stylesPaper from '../styles/Paper.module.scss'
import Updates from './Updates'
import Contact from './Contact'

const Notice = () => {
  return (
    <div className={ stylesPaper.Flex }>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>NOTICE</h1>
          
          <p>지금은 공사중이라 🏗️</p>
          <p>이름 같은 건 자주 바뀝니다.</p>
          <p>그리고 주민 여러분들의 소중한 기록을</p>
          <p><b className="accent">제가 날릴 가능성도 조금 있습니다.</b></p>
        </div>
      </div>
      <Contact />

      <Updates />
    </div>
  )
}

export default Notice