const getBrowserName = () => {
  let userAgent = navigator.userAgent;
  let browserName;
  
  if(userAgent.match(/chrome|chromium|crios/i)){
    browserName = "chrome";
  }else if(userAgent.match(/firefox|fxios/i)){
    browserName = "firefox";
  }  else if(userAgent.match(/safari/i)){
    browserName = "safari";
  }else if(userAgent.match(/opr\//i)){
    browserName = "opera";
  } else if(userAgent.match(/edg/i)){
    browserName = "edge";
  } else if(userAgent.match(/KAKAOTALK/i)){
    browserName = "kakao";
  }
  else{
    browserName = userAgent
  }
  return browserName;
}
export default getBrowserName;