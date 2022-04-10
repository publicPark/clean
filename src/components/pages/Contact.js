
import stylesPaper from '../styles/Paper.module.scss'

const Contact = () => {
  return (
    <>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>CONTACT</h1>
          
          <h4><a href="mailto:public.park.ji.@gmail.com">public park ji</a>, ...</h4>
        </div>
      </div>
    </>
  )
}

export default Contact