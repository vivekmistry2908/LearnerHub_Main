import React, { useState } from 'react'
import Landing_page_navbar from './Landing_page_navbar'

const Sales_team = () => {
  const[value,setvalue]=useState('select')
  const[value2,setvalue2]=useState('select')

  return (
    <div className='animate__animated animate__fadeIn'>
        <div>
            <Landing_page_navbar/>

            <div className='d-flex align-items-center justify-content-center mt-3' style={{backgroundColor:'#F3F0FF',height:'200px'}}>
                <p className='error-text2'>Talk to a member of our Sales team</p>
            </div>

            <div className='row m-0 pb-5 px-3 px-md-0' style={{backgroundColor:'#F9F9FB'}}>
              <div className='col-lg-5 col-md-8 mx-auto mt-4'>

                <div>
                  <div>
                  <label className='support-text2 mb-2' htmlFor="">Company Name* <span style={{color:'red'}}>*</span></label>
                  <input type="text" className='form-control' />
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Contact Person* <span style={{color:'red'}}>*</span></label>
                  <input type="text" className='form-control' />
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Email Id* <span style={{color:'red'}}>*</span></label>
                  <input type="email" className='form-control' />
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Phone No* <span style={{color:'red'}}>*</span></label>
                  <input type="tel" maxLength={10} className='form-control' />
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Industry <span style={{color:'red'}}>*</span></label>
                  <select name="" id="" className='form-select' onChange={(e)=>{
                    setvalue(e.target.value)
                  }}>
                    <option value="Select">Select Industry</option>
                    <option value="education_technology">Education Technology</option>
                    <option value="publishing">Publishing</option>
                    <option value="software_development">Software Development</option>
                    <option value="others">Others</option>
                  </select>

                  <textarea type="text" className={`form-control mt-4 ${value==='others' ? '':'d-none'}`}  placeholder='Enter the Industry type'/>
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Inquiry Type<span style={{color:'red'}}>*</span></label>
                  <select name="" id="" className='form-select' onChange={(e)=>{
                    setvalue2(e.target.value)
                  }}>
                    <option value="Select">Select Inquiry</option>
                    <option value="technical_support">Technical Support</option>
                    <option value="payment_issue">Payment Issue</option>
                    <option value="profile_issue">Profile Issue</option>
                    <option value="others">Others</option>
                  </select>

                  <textarea type="text" className={`form-control mt-4 ${value2==='others' ? '':'d-none'}`}  placeholder='Specify Your Issue'/>
                  </div>
                  <div className='mt-3'>
                  <label className='support-text2 mb-2' htmlFor="">Message <span style={{color:'red'}}>*</span></label>
                  <textarea className='form-control' rows={4}></textarea>
                  </div>
                  <div className='mt-4 d-flex align-items-center justify-content-center pt-2 rounded bg-secondary-subtle' style={{border:'0.6px dashed #5d5fe3'}}>
                  <label className='support-text2 mb-2' htmlFor="file" style={{color:'#5d5fe3',cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M21.6816 19.4231C21.6816 21.3165 21.0293 22.9276 19.7247 24.2566C18.4203 25.5855 16.825 26.25 14.9388 26.25C13.0525 26.25 11.4531 25.5855 10.1406 24.2566C8.82813 22.9276 8.17188 21.3165 8.17188 19.4231V8.50969C8.17188 7.1876 8.62656 6.06375 9.53594 5.13812C10.4455 4.21271 11.5614 3.75 12.8834 3.75C14.2055 3.75 15.3212 4.21271 16.2306 5.13812C17.1402 6.06375 17.595 7.1876 17.595 8.50969V18.8462C17.595 19.5802 17.3389 20.2124 16.8266 20.7428C16.3145 21.2732 15.6903 21.5384 14.9541 21.5384C14.2178 21.5384 13.5845 21.2774 13.0541 20.7553C12.5236 20.2332 12.2584 19.5969 12.2584 18.8462V8.46156H13.5084V18.8462C13.5084 19.2452 13.645 19.5853 13.9181 19.8666C14.1915 20.1478 14.5276 20.2884 14.9266 20.2884C15.3257 20.2884 15.6619 20.1478 15.935 19.8666C16.2083 19.5853 16.345 19.2452 16.345 18.8462V8.48562C16.3402 7.51437 16.0063 6.69063 15.3431 6.01438C14.6802 5.33813 13.8603 5 12.8834 5C11.9141 5 11.0948 5.34219 10.4256 6.02656C9.75646 6.71073 9.42188 7.53844 9.42188 8.50969V19.4231C9.41708 20.9665 9.95156 22.2818 11.0253 23.3691C12.0989 24.4564 13.4062 25 14.9475 25C16.4667 25 17.758 24.4564 18.8216 23.3691C19.8851 22.2818 20.4218 20.9665 20.4316 19.4231V8.46156H21.6816V19.4231Z" fill="#5D5FE3"/>
</svg> Attach if there is any document</label>
                  <input type="file" id='file'/>
                  </div>
                  <div className='d-flex mt-3'>
                    <input type="checkbox" id='check'/>
                    <label htmlFor="check" className='ms-2'> Consent message goes here</label>
                  </div>
                  <div className='mt-4 text-center'>
                    <button className='btn py-2 px-4 text-white' style={{backgroundColor:'#5d5fe3'}}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Sales_team