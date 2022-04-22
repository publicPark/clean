
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
          <p>이 곳의 데이터는 그리 보호되지 않습니다.</p>
          <p>주민 여러분들의 <b className="accent">소중한 데이터가</b></p>
          <p><b className="accent">갑자기 날아갈 수도 있습니다.</b></p>
          <p>최대한 안 날려보도록 노력은 하겠어요.</p>
          <h2>😜</h2>
        </div>
      </div>
      <Contact />

      <Updates />
    </div>
  )
}

export default Notice