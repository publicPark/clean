import stylesPaper from "../styles/Paper.module.scss";
import Updates from "./Updates";
import Contact from "./Contact";

const Notice = () => {
  return (
    <div className={stylesPaper.Flex}>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>NOTICE</h1>

          <p>언어 작업 중입니다.</p>
          <p>그리고 주민 여러분들의 기록은</p>
          <p>
            <b className="accent">언제 삭제될지 모릅니다.</b>
          </p>
        </div>
      </div>
      <Contact />

      <Updates />
    </div>
  );
};

export default Notice;
