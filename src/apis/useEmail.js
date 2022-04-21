
import emailjs from '@emailjs/browser';

const useEmail = () => {
  const sendCleanNews = async (templateParams) => {
    if(!templateParams) templateParams = {
      place_name: '',
      place_id: '',
      to_email: '',
      to_name: '',
      from_email: '',
      from_name: '',
    };
    
    console.log("process.env", process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_PUBLIC_KEY)
    try {
      const res = await emailjs.send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        'template_ge2bvfi', // 청소메일
        templateParams,
        process.env.REACT_APP_EMAIL_PUBLIC_KEY
      )
      console.log(res.text);
    } catch (err) {
      console.log(err);
    }


  }

  return {sendCleanNews}
}

export default useEmail