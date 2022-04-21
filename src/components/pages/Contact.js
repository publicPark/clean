
import stylesPaper from '../styles/Paper.module.scss'
import Updates from './Updates'

const Contact = () => {
  return (
    <>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>CONTACT</h1>
          
          <h4>이메일은 <a href="mailto:public.park.ji.@gmail.com">public park ji</a></h4>
          {/* <h4>전화 연속 두번 > 문자 = 전화 > 카톡 = 이메일 순으로 답장이 빠릅니다.</h4> */}
        </div>
      </div>

      <Updates />
    </>
  )
}

export default Contact