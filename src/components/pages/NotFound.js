
import stylesPaper from '../styles/Paper.module.scss'

const getMessage = (status) => {
  if (status === 'auth') {
    return '로그인 하면 보여주지'
  } else {
    return '404 Not Found'
  }
}
const NotFound = ({ status }) => {
  return (
    <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
      <div className={stylesPaper.Content}>
        {getMessage(status)}
      </div>
    </div>
  )
}

export default NotFound