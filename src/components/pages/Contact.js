import stylesPaper from "../styles/Paper.module.scss";

const Contact = () => {
  return (
    <>
      <div className={`${stylesPaper.Wrapper} ${stylesPaper.WrapperWide}`}>
        <div className={stylesPaper.Content}>
          <h1>CONTACT</h1>
          <p>궁금한 것이 있다면</p>
          <p>건의할 것이 있다면</p>
          <p>오류를 발견했다면</p>
          <p>신뢰를 회복하려면</p>
          <h4>
            <a href="mailto:public.park.ji@gmail.com">
              public.park.ji@gmail.com
            </a>
          </h4>
        </div>
      </div>
    </>
  );
};

export default Contact;
