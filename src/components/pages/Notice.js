
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
          <p>이름 같은 것이 자주 바뀝니다.</p>
          <p>그리고 주민 여러분들의 기록을</p>
          <p><b className="accent">그다지 보호하고 있지 않습니다</b></p>
        </div>
      </div>
      <Contact />

      <Updates />
    </div>
  )
}

export default Notice