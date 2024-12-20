import React, { useState } from 'react'
import { ipaddress } from '../App'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'

const Need_help = () => {

  const user=JSON.parse(sessionStorage.getItem('user'))

  const[query,setQuery]=useState("")
  const[message,setmessage]=useState("")

  const sendQuery=()=>{
    axiosInstance.post(`${ipaddress}/HelpView/${user.user_id}/`,{
      'message':query
    })
    .then((r)=>{
      console.log("Query successfully sent")
      setQuery("")
      toast.success('Message successfully sent',{
        autoClose:2000,
      })
    })
  }

  return (
    <div>
        <div className="modal fade" id="need_help_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-body">
        <div className='text-end'>
        <button className='btn p-0' type="button" data-bs-dismiss="modal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg></button>
        </div>
        <div>
            <div className='text-center'>
            <p style={{color:'#5d5fe3',fontWeight:500,letterSpacing:'0.32px',lineHeight:'normal',fontSize:'17px'}}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 35 35" fill="none">
  <path d="M5.39584 16.4592L10.6795 11.1756C10.9637 10.8914 11.2899 10.6904 11.6582 10.5726C12.0266 10.4549 12.4071 10.4352 12.7997 10.5137L14.8638 10.9428C13.7756 12.274 12.8875 13.4781 12.1995 14.555C11.5115 15.6319 10.8244 16.9388 10.1382 18.4757L5.39584 16.4592ZM11.4115 18.8235C12.0453 17.3539 12.8048 15.9488 13.6901 14.6083C14.5754 13.2677 15.5864 12.0291 16.7231 10.8924C18.5442 9.07131 20.5242 7.70693 22.6631 6.79921C24.802 5.89147 27.1091 5.50398 29.5846 5.63674C29.7173 8.11216 29.3312 10.4193 28.4263 12.5582C27.5214 14.6971 26.1584 16.6771 24.3374 18.4981C23.2062 19.6293 21.9676 20.6356 20.6214 21.5171C19.2753 22.3987 17.8674 23.1564 16.3978 23.7902L11.4115 18.8235ZM20.4082 14.785C20.8364 15.2131 21.3548 15.4272 21.9633 15.4272C22.5719 15.4272 23.0903 15.2131 23.5184 14.785C23.9466 14.3568 24.1607 13.8431 24.1607 13.2439C24.1607 12.6447 23.9466 12.131 23.5184 11.7029C23.0903 11.2747 22.5719 11.0606 21.9633 11.0606C21.3548 11.0606 20.8364 11.2747 20.4082 11.7029C19.9801 12.131 19.766 12.6447 19.766 13.2439C19.766 13.8431 19.9801 14.3568 20.4082 14.785ZM18.7144 29.8255L16.6895 25.0831C18.2264 24.3969 19.5347 23.7051 20.6144 23.0077C21.6941 22.3104 22.8996 21.4176 24.2308 20.3295L24.6515 22.3936C24.73 22.7862 24.715 23.1681 24.6066 23.5392C24.4981 23.9103 24.3018 24.238 24.0177 24.5222L18.7144 29.8255ZM7.5048 23.5462C8.07504 22.976 8.76681 22.6941 9.58012 22.7007C10.3934 22.7072 11.0852 22.9956 11.6554 23.5659C12.2257 24.1361 12.5108 24.8279 12.5108 25.6412C12.5108 26.4545 12.2257 27.1462 11.6554 27.7165C11.16 28.212 10.3649 28.6364 9.27023 28.9897C8.17555 29.3431 6.90933 29.5871 5.47156 29.7217C5.60616 28.2839 5.85482 27.0191 6.21753 25.9272C6.58025 24.8353 7.00934 24.0417 7.5048 23.5462Z" fill="#FF845D"/>
</svg> <span className='ms-1'>Need some help?</span></p>
            <span>Tell us what kind of support you need</span>
            </div>
            <div className='mt-3 px-1 px-md-4'>
                <textarea onChange={(e)=>{
                  setQuery(e.target.value)
                }} value={query} style={{fontSize:'15px'}} name="" className='form-control py-2 bg-light'></textarea>
            </div>
            <div className='mt-3 px-1 px-md-4 pb-2 d-flex justify-content-end'>
            <button disabled={query.length>0 ? false:true} className='btn btn-sm text-white fw-medium' data-bs-dismiss="modal" style={{backgroundColor:'#5d5fe3'}} onClick={sendQuery}>Send</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* TOAST MESSAGE */}
<div className="toast-container position-fixed bottom-0 end-0 p-3">
<div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
  
  <div className="toast-body d-flex justify-content-between align-items-center">
    <span id='toastbody' className='fw-medium p-2'></span> 
    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>
</div>
    </div>
  )
}

export default Need_help