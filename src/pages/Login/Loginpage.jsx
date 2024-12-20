import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FirstNavbar from '../../components/First_navabr';
import { Context } from '../../context/Context_provider';
import { Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { setAccessToken } from '../authService';
import axiosInstance from '../axiosInstance';
import { ModalFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { ipaddress } from '../../App';
import "./Loginpage.css"
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is a required field."),
  password: Yup.string().required("Password is a required field.")
});
const initialValues = { email: "", password: "" }; // Initial form values
const validationForgotSchema = Yup.object().shape({ email: Yup.string().email("Invalid email format").required("Email is a required field.") });
const initialForgotValues = { email: "" }; // Initial form values
const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-center' };// Centralized toast configuration

const Loginpage = ({ setemailvalidation }) => {
  const { translate_value } = useContext(Context);
  const [userid, setUserid] = useState("");
  const [password_type, setPassword_type] = useState(false);
  const [isForget, setForget] = useState(false);
  const [isForgetSuccess, setForgetSuccess] = useState(false);
  let navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post(`${ipaddress}/CheckEmailForThreeMonths/${values.email}/`);
      const { message } = response.data;
      if (message === "You can access this view.") {
        verifiedlogin(values); setUserid("");
      } else if (message === "Please re-verify your email.") {
        setemailvalidation(true);
      }
    } catch (error) { toast.error("Email not verified", { autoClose: 3000 }); }
  };
  const [loading, setloading] = useState();
  const generate_token = async (values) => {
    try {
      const response = await axios.post(`${ipaddress}/api/token/`, values);
      setAccessToken(response.data.access, response.data.refresh);
      handleSubmit(values);
    } catch (err) {
      console.log("Token error", err);
      toast.error('Invalid Email and Password', toastConfig);
    }
  };

  const verifiedlogin = async (values) => {
    const { email, password } = values;
    const payload = { userid: email, password };
    const toastOptions = { autoClose: 3000 };
    try {
      setloading(true); // Start loading
      const response = await axiosInstance.post(`${ipaddress}/UserLogin/`, payload);
      sessionStorage.setItem("user", JSON.stringify(response.data));// Save user data in session storage
      navigate('/dashboard/page');
    } catch (error) {  // Handle login error
      const errorMessage = error.response?.data?.message || 'Invalid Email and Password';
      toast.error(errorMessage, toastOptions);
    } finally {
      setloading(false); // Stop loading
    }
  };

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const verifyemaildata = (e) => { setEmail(e.target.value) };
  const verifyEmail = (e) => {
    e.preventDefault();
    axiosInstance.post(`${ipaddress}/userverification/`).then((r) => { setOtp(r.data.otp) });
  };

  const [newotp, setNewotp] = useState("");
  const otpdata = (e) => { setNewotp(e.target.value) };
  const submitOtp = (e) => {
    e.preventDefault();
    if (newotp === otp) { axiosInstance.put(`${ipaddress}/CheckEmailForThreeMonths/${email}/`).then((r) => { setNewotp("") }) }
    // Else Part not Manage if Cases Open
  };

  const forgotpassword = async (values) => {
    try {
      const formdata = new FormData();
      formdata.append('email', values.email);
      formdata.append('url', 'https://lernen-hub.de/forgot_password/');
      const response = await axiosInstance.post(`${ipaddress}/ForgetPassword/`, formdata); // Make the API call
      if (response.status === 200) { // Handle success
        toast.success('Password reset email sent successfully!', { autoClose: 3000, theme: 'colored', position: 'top-right' });
        setForget(false);
        setForgetSuccess(true);
      } else if (response.status === 404) {
        toast.success(response, toastConfig);
      } else {
        toast.error('Failed to send password reset email.', toastConfig);
      }
    } catch (error) {
      console.log('Error occurred:', error);
      const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
        : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage, toastConfig);
    }
  };

  return (
    <div className='bg-light pb-4 loginpage' style={{ minHeight: '100vh' }}>
      <div className="container">
        <FirstNavbar />
        <div className="row mt-2">
          <div className="col-lg-6">
            <div className='row'>
              <div className='col-lg-5 p-0'>
                <div className="text-white d-flex flex-column shadow rounded justify-content-center align-items-start p-4 d-none d-lg-flex" style={{ flex: '0 0 40%', background: 'linear-gradient(25deg, #f2f0ff, #f2f0ff)' }}>
                  <h3 className="page6-month mb-3" style={{ fontSize: '30px', color: '#FFFFFF' }}>Highlights</h3>
                  <ul className="list-unstyled" style={{ fontSize: '20px', color: '#FFFFFF' }}>
                    <li className="page6-month mb-3">
                      <i className="fas fa-check-circle me-2" style={{ color: '#FFFFFF' }}></i>
                      All Document Access
                    </li>
                    <li className="page6-month mb-3">
                      <i className="fas fa-check-circle me-2" style={{ color: '#FFFFFF' }}></i>
                      Ad-Free Learning
                    </li>
                    <li className="page6-month mb-3">
                      <i className="fas fa-check-circle me-2" style={{ color: '#FFFFFF' }}></i>
                      Anonymous Posting
                    </li>
                    <li className="page6-month mb-3">
                      <i className="fas fa-check-circle me-2" style={{ color: '#FFFFFF' }}></i>
                      Private Study Groups
                    </li>
                    <li className="page6-month mb-3">
                      <i className="fas fa-check-circle me-2" style={{ color: '#FFFFFF' }}></i>
                      And much more!
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-lg-7 p-0 forms-div'>
                <div className='bg-white loginpageform1 shadow rounded pt-4 h-100 pb-2 px-4 d-flex flex-column align-items-center position-relative'>
                  <h3 className='page6-month mb-3' style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.login_page.login}</h3>
                  <div className="w-100">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={generate_token}>
                      {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form className='p-2 px-2'>
                          <div className="mb-4">
                            <label htmlFor="floatingInput" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.email}</label>
                            <input type="email" id="email" name="email" className="form-control shadow-none bg-light"
                              style={{ height: '50px' }} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                            <ErrorMessage className="validation-error" name='email' component='div' />
                          </div>
                          <div className="mb-2">
                            <label htmlFor="floatingPassword" style={{ color: '#8E9696' }} className='mb-2'>{translate_value.login_page.password}</label>
                            <div className="input-group mb-3 bg-light border rounded">
                              <input type={password_type ? "text" : "password"} name='password' className="form-control shadow-none border-0 bg-transparent"
                                style={{ height: '50px' }} id="floatingPassword" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                              <span onClick={() => { setPassword_type(!password_type) }} style={{ cursor: 'pointer' }} className="input-group-text border-0 bg-transparent text-secondary" id="basic-addon2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                </svg>
                              </span>
                            </div>
                            <ErrorMessage className="validation-error" name='password' component='div' />
                          </div>
                          <div className='text-end mb-4'>
                            <button type="button" className='forgot-btn' onClick={() => setForget(true)} >{translate_value.login_page.forgot_password}</button>
                          </div>
                          <div className="text-center">
                            <button type='submit' className='btn Login-btn btn-md py-2 px-5 text-white fw-medium' >
                              {loading ? 'Loading...' : `${translate_value.login_page.submit}`}
                            </button>
                          </div>
                          <div className="assistance">
                            <p className='m-0 text-secondary'>Facing problem signing in...</p>
                            <p className='link' onClick={() => navigate('/contact_us')}>Need Assistance?</p>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className='row m-0 mt-5 mt-lg-0' style={{ position: 'relative' }}>
              <div className='main-login ' style={{ position: 'relative', padding: '20px' }}>
                <p style={{ letterSpacing: '3px' }}>The Student Community</p>
                <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>Improve</h1>
                <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>comprehension</h1>
                <h1 className='fw-bold login-header' style={{ color: '#FF845D' }}>together</h1>
                <svg className='login-img3 d-none d-lg-block' style={{ position: 'absolute', animation: 'spin 6s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
                  <path d="M28.43 77.66L0 49.23L0.0700073 48.96L10.4 10.4L10.67 10.33L49.23 0L77.66 28.43L77.59 28.7L67.26 67.26L66.99 67.33L28.43 77.66ZM1.08002 48.95L28.72 76.59L66.48 66.47L76.6 28.71L48.96 1.06998L11.2 11.19L1.08002 48.95Z" fill="#5D5FE3" />
                </svg>
                <img className='login-img1 align-items-center d-lg-block' style={{ position: 'absolute', animation: 'moveAnimation 6s linear infinite', width: '115px', height: '127px' }} src={require('../../img//images_icons/Group-removebg-preview.png')} alt="" />
                <img className='login-img2 align-items-center  d-lg-block' style={{ position: 'absolute', height: '135px', width: '31px' }} src={require('../../img/images_icons/login-image.png')} alt="" />
                <p className='mt-3 align-items-center already-have-account' style={{ color: '#2A3941', fontSize: '32px' }}>{translate_value.login_page.dont_have_account}</p>
                <Link to='/signuppage' className='btn p-3 px-5 fw-bold signup-btn' style={{ color: '#5D5FE3', border: '1px solid #5D5FE3' }}> {translate_value.login_page.get_started}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade modal-md" id="verifyemail" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="d-flex p-2">
              <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div>
              <h3 className=" fw-bold text-center fs-2 text-primary" id="staticBackdropLabel">Enter Your Email</h3>
            </div>
            <div className="modal-body">
              <form action="" className='p-2 px-4' onSubmit={verifyEmail}>
                <div className="form-floating mb-4">
                  <input type="text" name='userid' className="form-control shadow-none" id="floatingInput1" placeholder="name@example.com" onChange={verifyemaildata} value={email} />
                  <label htmlFor="floatingInput1" className='fw-normal'>Email</label>
                </div>
                <div className="text-center">
                  <button type='submit' className='btn Login-btn btn-md py-3 w-100 text-white fw-medium' data-bs-toggle="modal" data-bs-target="#otpmodal">Verify Email</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="otpmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h1 className="modal-title fs-5 mx-auto" id="exampleModalToggleLabel2">Enter the OTP</h1>
            </div>
            <div className="modal-body">
              <form action="" className="p-2 px-4" onSubmit={submitOtp}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-floating mb-4">
                      <input onChange={otpdata} value={newotp} type="text" className="form-control shadow-none" id="floatingInput2" placeholder="name@example.com"
                        name="first_name" />
                      <label htmlFor="floatingInput2" className="fw-normal" >Enter Your OTP</label>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    className="btn signup-btn btn-md py-3 w-100 text-white fw-medium"
                    type="submit" data-bs-target="#login" data-bs-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isForget} size={"md"} backdrop="static">
        <ModalHeader className='text-center' toggle={() => setForget(false)} ></ModalHeader>
        <ModalBody>
          <div className='py-3'><h6 className=" fw-bold text-center fs-3 text-dark" id="staticBackdropLabel">Forgot Password</h6></div>
          <Formik initialValues={initialForgotValues} validationSchema={validationForgotSchema} onSubmit={forgotpassword}>
            {({ values, handleChange, handleBlur, setFieldValue }) => (
              <Form action="" className='p-2 mt-3 px-4 mb-5' >
                <p className='text-center'>Please enter your registered email ID</p>
                <div className="form-floating mb-4">
                  <input type="email" id="floatingInput3" name="email" value={values.email} placeholder="name@example.com" style={{ height: '50px' }}
                    className="form-control shadow-none" onChange={handleChange} onBlur={handleBlur} />
                  <label htmlFor="floatingInput3" className='fw-normal'>Email</label>
                  <ErrorMessage className="validation-error" name='email' component='div' />
                </div>
                <div className="text-center mt-5">
                  <button type='submit' className='btn Login-btn btn-md py-2 w-100 text-white fw-medium'>Submit</button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <div className='modal-f-footer'>
        </div>
      </Modal>
      <Modal isOpen={isForgetSuccess} centered size={"md"} backdrop="static">
        {/* <ModalHeader className='text-center' toggle={() => setForgetSuccess(false)} ></ModalHeader> */}
        <ModalBody>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
            <img src={require('../../img/check__2_-removebg-preview.png')} width={70} alt="" />
            <p className="m-0 mt-3" style={{ color: '#34a853', fontSize: '16px' }}> We've Sent the link to reset the password</p>
            <p className="m-0" style={{ color: '#34a853', fontSize: '16px' }}>in your registered Email ID </p>
            <span style={{ color: '#34a853', fontSize: '16px' }}>Please check your Inbox</span>
          </div>
        </ModalBody>
        <ModalFooter className='justify-content-end'>
          <button className="btn btn-outline-secondary" onClick={() => setForgetSuccess(false)}>Close </button>
        </ModalFooter>
      </Modal>

      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex justify-content-between px-4 py-2">
            <span id='toastbody2'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Loginpage;