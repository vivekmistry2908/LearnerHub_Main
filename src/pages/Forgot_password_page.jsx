import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Preloader from './Preloader'
import { domain, ipaddress } from '../App'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';
import axios from 'axios'


const Forgot_password_page = () => {

  const { pattern } = useParams()
  let [auth, setauth] = useState()
  const [newpassword, setNewpassword] = useState("")
  const [retypepassword, setRetypepassword] = useState("")
  const [loading, setloading] = useState()
  // alert(pattern)
  let checkValidity = () => {
    axios.get(`${ipaddress}/CheckPasswordResetToken/${pattern}/`).then((response) => {
      console.log(response.data.message);
      setauth(response.data.message)
    }).catch((error) => {
      console.log(error);
    })
  }
  useEffect(() => {
    if (pattern) {
      checkValidity()
    }
  }, [pattern])
  const resetPassword = () => {
    setloading(true)
    const formdata = new FormData()
    formdata.append('token', pattern)
    formdata.append('password', newpassword)
    // console.log(pattern)
    if (newpassword === retypepassword) {
      axiosInstance.post(`${ipaddress}/PasswordReset/`, formdata)
        .then((r) => {
          // console.log("Successfully Rested",r.data)
          setloading(false)
          setNewpassword("")
          setRetypepassword("")
          const toastLiveExample = document.getElementById('liveToast2')
          document.getElementById('toastbody2').style.color = "green"
          document.getElementById('toastbody2').textContent = "Password Updated Successfully !!!"
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
          toastBootstrap.show()
        })

    }
  }
  return (
    <div>
      {loading ? (<Preloader />) : (
        <div className='bg-light d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
          {
            auth ? <>


              <div className='w-50 py-5 px-2 px-lg-5'>
                <div className='bg-white shadow rounded p-5'>
                  <h5 className='text-center pb-4'>Reset Your Password</h5>
                  <div className="mb-3">
                    <label for="formGroupExampleInput" className="form-label">New Password</label>
                    <input type="password" className="form-control py-3 bg-light" onChange={(e) => {
                      setNewpassword(e.target.value)
                    }} value={newpassword} />
                  </div>
                  <div className="mb-3">
                    <label for="formGroupExampleInput2" className="form-label">Retype New Password</label>
                    <input type="password" className="form-control py-3 bg-light" onChange={(e) => {
                      setRetypepassword(e.target.value)
                    }} value={retypepassword} />
                  </div>
                  <div className='mt-4 text-center'>
                    <button className='btn btn-primary text-white w-75 py-2 mt-3' onClick={resetPassword}>Reset Password</button>
                  </div>
                </div>
              </div>

              {/* TOAST MESSAGE */}
              <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

                  <div className="toast-body d-flex justify-content-between">
                    <span id='toastbody'></span>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                  </div>
                </div>
              </div>
            </> : <>
            <div className=' shadow p-3 text-center rounded '>
              Invalid URL
              <section>
                Go to login page : <a href={domain}>click here</a>
              </section>
            </div>

            </>
          }
        </div>
      )}

      {/* ---------------------------------------------TOAST------------------------------------------------------- */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

          <div className="toast-body d-flex justify-content-between px-4 py-2">
            <span id='toastbody2'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgot_password_page