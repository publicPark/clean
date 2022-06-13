
import stylesPaper from '../styles/Paper.module.scss'
import News from "../Dashboard/News";
import Voices from "../List/Voices";

const World = () => { return (
  <div className={ stylesPaper.Flex }>
    <div className={stylesPaper.Wrapper}>
      <div className={stylesPaper.Content}>
        <News />
      </div>
    </div>
    <div className={stylesPaper.Wrapper}>
      <Voices />
    </div>

  </div>
)}

export default World