
import emailjs from '@emailjs/browser';

const useEmail = () => {
  const sendEmail = async (templateParams, type) => {
    if(!templateParams) templateParams = {
      place_name: '',
      place_id: '',
      to_email: '',
      to_name: '',
      from_email: '',
      from_name: '',
    };

    let template_id = 'template_ge2bvfi'
    if (type === 'clean') {
      template_id = "template_ge2bvfi"
    } else if(type === 'objection') {
      template_id = "template_3e9h6u6"
    }
    
    console.log("process.env", process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_PUBLIC_KEY)
    try {
      const res = await emailjs.send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        template_id, // 청소메일
        templateParams,
        process.env.REACT_APP_EMAIL_PUBLIC_KEY
      )
      console.log(res.text);
    } catch (err) {
      console.log(err);
    }
  }

  return {sendEmail}
}

export default useEmail