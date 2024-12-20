import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'

const Signupform3 = ({value,email}) => {
    useEffect(()=>{
        console.log(email)
        const formdata=new FormData()
        formdata.append('email',email)
        if(value==true){
        axios.post('http://192.168.0.103:9000/UserUniversityAddition/',formdata)
        .then((r)=>{
          console.log("Email successfull",r.data)
        })
        .catch(()=>{
          console.log("Email Error")
        })
    }
    },[value])
  return (
    <div>
        <div id="signupform3" className={`col-lg-6 pb-3 ${value ? 'd-inline' : 'd-none'}`}>
    <div className="d-flex justify-content-center flex-column align-items-center">
    <div className='bg-white shadow rounded pt-5 pb-3 px-3 signup-form d-flex flex-column align-items-center justify-content-center'>
      <h3 className='text-center mb-4 fw-bold'>Sign Up</h3>
      <form action="" className="p-2 px-4">
                <div className="row">
                  <div className="col-12">
  <label for="formGroupExampleInput" class="form-label signup-labels">Country</label>
  <div class="input-group mb-3 bg-light rounded border py-2">
  <span class="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
  <input type="text" class="form-control border-0 bg-transparent country-input" placeholder="Search & select your country" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
                  </div>
                  <div className="col-12">
  <label for="formGroupExampleInput" class="form-label signup-labels">City</label>
  <div class="input-group mb-3 bg-light rounded border py-2">
  <span class="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
  <input type="text" class="form-control border-0 bg-transparent country-input" placeholder="Search & select your city" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
                  </div>
                  <div className="col-12">
  <label for="formGroupExampleInput" class="form-label signup-labels">University</label>
  <div class="input-group mb-3 bg-light rounded border py-2">
  <span class="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
  <input type="text" class="form-control border-0 bg-transparent country-input" placeholder="Search & select your university" aria-label="Username" aria-describedby="basic-addon1"/>
</div>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button
                    className="btn signup-btn btn-md py-2 px-2 px-md-5 text-white fw-medium"
                    type="submit" onClick={(e)=>{
                      e.preventDefault()
                      document.getElementById('signupform2').style.display="none"
                      document.getElementById('signupform3').style.display="block"
                    }}
                  >
                    Next
                  </button>
                </div>
              </form>
              <div class="p-2 px-4 text-center mt-2">
                <p className="login_here">
                  Already have an Account &nbsp;
                  <a
                    className="ms-1 fw-medium text-decoration-none"
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login" style={{color:'#5C60E3'}}
                  >
                    Please Login
                  </a>
                </p>
              </div>
    </div>
    <div className="d-flex mt-3">
      <input type="checkbox" />
      <p className="m-0 ms-2 text-secondary">By Signing Up you agree to our <span className="text-decoration-underline fw-medium text-dark">terms & conditions</span></p>
    </div>
    </div>
  </div>
    </div>
  )
}

export default Signupform3