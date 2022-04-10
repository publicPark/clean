
import stylesPaper from '../styles/Paper.module.scss'
const NotFound = () => {
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      <div className={stylesPaper.Content}>
        404 Not Found
      </div>
    </div>
  )
}

export default NotFound