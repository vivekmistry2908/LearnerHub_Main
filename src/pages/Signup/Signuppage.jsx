import React from "react";
import "animate.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Adddetails from "../Adddetails";
import { ipaddress } from "../../App";
import { Context } from "../../context/Context_provider";
import First_navabr from "../../components/First_navabr";
import { toast } from "react-toastify";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useRef } from "react";
import * as bootstrap from 'bootstrap';
import './Signuppage.css'

const Signuppage = () => {
  const navigate = useNavigate();

  const { translate_value } = useContext(Context)

  const [loading, setloading] = useState()

  const [otpvalidationform, setotpvalidationform] = useState(false)
  const [isChecked, setisChecked] = useState(false)
  const [validatedform, setvalidatedform] = useState(false)
  const [passwordtype, setPasswordtype] = useState(true)
  const [passwordtype2, setPasswordtype2] = useState(true)

  const [formData, setFormData] = useState({
    phone_number: "",
    phone_number_extension: "",
    email: "",
    password: "",
    nickname: "",
    title: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, [e.target.name]: e.target.value };


      if (updatedData.phone_number_extension.length != 10) {
        document.getElementById('alternate_phone').style.color = "red"
        document.getElementById('alternate_phone').textContent = "*Phone Number Must be 10 Characters Only";
      } else {
        document.getElementById('alternate_phone').textContent = "";
      }
      if (updatedData.phone_number.length != 10) {
        document.getElementById('phone').style.color = "red"
        document.getElementById('phone').textContent = "*Phone Number Must be 10 Characters Only";
      } else {
        document.getElementById('phone').textContent = "";
      }
      if (updatedData.nickname.length > 6) {
        document.getElementById('nick').textContent = "*Nickname should not be more than 6 characters";
      } else {
        document.getElementById('nick').textContent = "";
      }
      if (updatedData.password.length > 8) {
        document.getElementById('pass').style.color = "green"
        document.getElementById('pass').innerHTML = '<i className="fa-solid fa-circle-check"></i> Good'
      }
      else {
        document.getElementById('pass').style.color = "red"
        document.getElementById('pass').innerHTML = '<i className="fa-solid fa-circle-xmark"></i> Provide Strong Password'
      }

      // console.log(updatedData.password.length + 1);

      return updatedData; // Return the updated state
    });
  };

  const initialFormData = {
    phone_number: "",
    phone_number_extension: "",
    email: "",
    password: "",
    nickname: "",
    title: "",
    first_name: "",
    last_name: "",
  };
  const [backendotp, setBackendotp] = useState({})
  const handleSubmit = async (e) => {
    e.preventDefault();
    let emaildata = { "email": formData.email }
    try {
      const response = await axios.post(`${ipaddress}/userverification/`, emaildata); // console.log("OTP",response.data)
      if (response.data === 'This email is already registered with other account') {
        const toastLiveExample = document.getElementById('liveToast2')
        document.getElementById('toastbody2').style.color = "red"
        document.getElementById('toastbody2').textContent = "This email is already registered !!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
      } else { setBackendotp(response.data) }
    } catch (error) {
      console.error("Error generating OTP");
    }
  };

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [showcity, setShowcity] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filteredcities, setFilteredcities] = useState([])
  const [domains, setdomains] = useState([])

  useEffect(() => { // console.log("otp fetched : ",backendotp)
    axios.get(`${ipaddress}/DisplayCityAndCountry/`)
      .then((r) => { // console.log("Countries and Cities",r.data)
        setCountries(r.data.countries)
        setCities(r.data.cities)
      }).catch((err) => { console.log("Error", err); });
  }, [backendotp]);

  const search_domain = (value) => { // To get the university email id domains
    // ----------------------------------------------To check the condition for @ and then it will call API------------------------
    const atIndex = value.indexOf('@');
    if (atIndex !== -1 && atIndex < value.length - 1 && value.length > 0) {
      const inputAfterAt = value.substring(atIndex + 1);
      axios.get(`${ipaddress}/SendDomains/${inputAfterAt}/`)
        .then((r) => {
          setdomains(r.data); //  console.log("Domains",r.data)
        }).catch((err) => { console.log("Error", err); });
    } else { setdomains([]) }
  }
  //  -----------------------------------------SEARCH COUNTRY------------------------------------------------------
  const searchCountries = (value) => {
    setShowOptions(true)
    setcountry(value)
    const filteredData = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()))
    setFilteredCountries(filteredData)
  }

  // ----------------------------------------------NEW VALIDATIONS------------------------------------------------------
  const [university, setUniversity] = useState("")
  // const universityData=(e)=>{ setUniversity(e.target.value)}
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");
  // -----------------------------------------------OTP TIMER FUNCTIONALITY---------------------------------------------------
  const [timer, setTimer] = useState(30)
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpValid, setOTPValid] = useState(true);
  const inputRefs = useRef([]);
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    const otpArray = pasteData.split('');
    setOtp(otpArray);
    otpArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleotpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  useEffect(() => {
    let interval;
    if (otpValid && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOTPValid(false);
      setBackendotp({})
      setOtp(new Array(6).fill(""));

      // setOtp1("")
      // setOtp2("")
      // setOtp3("")
      // setOtp4("")
      // setOtp5("")
      // setOtp6("")

    }

    // To Clear interval when timer expires
    return () => clearInterval(interval);
  }, [timer]);

  const [otpmessage, setotpmessage] = useState("")
  const sendOtp = (e) => {
    e.preventDefault();
    // const otp=otp1+otp2+otp3+otp4+otp5+otp6
    const enteredOtp = otp.join('');
    // console.log(otp)
    if (enteredOtp === backendotp.otp) {
      // console.log("Hi")
      setotpmessage("Successfull")
      setotpvalidationform(false)
      setvalidatedform(true)
    }
    else {
      setotpmessage("Failed")
      setOtp(new Array(6).fill(""));

      //  setOtp1("")
      //  setOtp2("")
      //  setOtp3("")
      //  setOtp4("")
      //  setOtp5("")
      //  setOtp6("")
    }
  };

  const [message, setmessage] = useState("");
  const fetchOTP = async () => {
    if (!university) { // Check for empty fields
      toast.error('Email is required', { autoClose: 3000, theme: 'colored' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate email format
    if (!emailRegex.test(university)) {
      toast.error('Invalid email format', { autoClose: 3000, theme: 'colored' });
      return;
    }
    setloading(true); // Start loading
    setOtp(new Array(6).fill("")); // Reset OTP array
    setTimer(120); // Set timer to 120 seconds
    setOTPValid(true); // Reset OTP validity
    const universityMail = new FormData();
    universityMail.append('email', university);
    try {
      const response = await axios.post(`${ipaddress}/userverification/`, universityMail);
      if (response.data === 'This email is already registered with other account') {
        toast.warn('This Email is already registered', { autoClose: 3000 });
      } else if (response.data.message) {
        setmessage(response.data.message);
        setotpvalidationform(true);
        setBackendotp(response.data);
      } else {
        toast.success('OTP sent successfully!', { autoClose: 3000, theme: 'colored' });
      }
    } catch (error) {
      if (error.response) { // Errors from the server
        toast.error(`Server error: ${error.response.data.message || 'Unexpected error'}`, { autoClose: 3000, theme: 'colored' });
      } else if (error.request) { // No response received
        toast.error('Network error: No response from server', { autoClose: 3000, theme: 'colored' });
      } else {  // Other errors
        console.log("Error in request setup", error.message);
        toast.error(`Unexpected error: ${error.message}`, { autoClose: 3000, theme: 'colored' });
      }
    } finally {
      setloading(false); // Stop loading
    }
  };

  const [password, setPassword] = useState("");
  const [retypepassword, setretypePassword] = useState("");
  // --------------------------------------------SEND EMAIL AND PASSWORD----------------------------------------------
  const [city, setCity] = useState("");
  const [country, setcountry] = useState("");
  const [country_id, setcountry_id] = useState();
  const [UserUniversity, setUserUniversity] = useState("");
  const [UserUniversityid, setUserUniversityid] = useState("");
  const [universitystatus, setuniversitystatus] = useState();
  const [fetched_university_details, setfetched_university_details] = useState([])
  const fetch_country = (value) => {
    if (value.length > 0) {
      axios.get(`${ipaddress}/CountryListView/${value}/`)
        .then((r) => {
          setFilteredCountries(r.data); // console.log("Countries",r.data)
        }).catch((err) => { console.log("Error", err); });
    }
  }

  // -----------------------------------------SEARCH CITY-----------------------------------------------------------
  const searchCities = (value) => {
    if (value.length > 0) {
      axios.get(`${ipaddress}/CityListView/${country_id}/${value}/`)
        .then((r) => {
          setCities(r.data); // console.log("Filtered cities",r.data)
        }).catch((err) => { console.log("Error", err); });
    }
  }

  const [load1, setload1] = useState()
  const senddata = (e) => {
    e.preventDefault()
    setload1(true)
    if (password.length > 6) {
      const formdata = new FormData()
      formdata.append('email', university)
      formdata.append('password', password)

      const universitydata = new FormData()
      universitydata.append('email', university)
      if (password === retypepassword) {
        axios.post(`${ipaddress}/UserRegistrationAPIView/`, formdata)
          .then((r) => {
            // console.log("Email registration",r.data)

            document.getElementById('signupform2').style.display = "none"
            document.getElementById('signupform3').style.display = "block"
          })
          .catch((err) => {
            console.log("Error", err)
          })
        axios.post(`${ipaddress}/UserUniversityAddition/`, universitydata)
          .then((r) => {
            // console.log("Email successfullllll",r.data)
            if (r.data === "university is not present") {
              setuniversitystatus(true)
              setCity("")
              setcountry("")
              setUserUniversity("")
              setUserUniversityid(0)
              setload1(false)
            }
            else {
              setuniversitystatus(false)
              setfetched_university_details(r.data)
              setcountry(r.data[0].country)
              setCity(r.data[0].city)
              // setcountry("Germany")
              setUserUniversity(r.data[0].university_name)
              setUserUniversityid(r.data[0].university_id)
              setload1(false)
            }
          })
          .catch(() => {
            // console.log("Email Error")
          })
      }
      else {
        toast.error('Enter the Matching password', {
          autoClose: 3000,
        })
      }
    }
    else {
      toast.error('Password must be more than 6 characters', {
        autoClose: 3000,
      })
    }
  }
  // ---------------------------------- Fetch the university based on the selected city-------------------------------------
  const fetchMatcheduniversity = (city_name) => {
    fetched_university_details.map((x) => {
      if (x.city === city_name) {
        setUserUniversity(x.university_name)
        setUserUniversityid(x.university_id)
      }
    })
  }

  // ---------------------------------------------SEND UNIVERSITY DATA AND ID----------------------------------------------
  const [value, setvalue] = useState(false)
  const senduniversitydata = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('email', university)
    formdata.append('university_id', UserUniversityid)

    axios.put(`${ipaddress}/UserUniversityAddition/`, formdata)
      .then((r) => {
        // console.log("University ID sent successfully",r.data)
        document.getElementById('signup').style.display = 'none'
        setvalue(true)
      })
  }

  // ------------------------------------------------ADD UNIVERSITY------------------------------------------------------
  const [universityname, setuniversityname] = useState("")
  const [state, setstate] = useState(false)
  const [showTerms, setShowTerms] = React.useState(false);

  const adduniversity = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('email', university)
    formdata.append('university_name', universityname)
    formdata.append('country', country)
    formdata.append('city', city)

    axios.put(`${ipaddress}/UserUniversityAddition/`, formdata)
      .then((r) => {
        setstate(true)
      })
  }

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }} className="bg-light pb-4">
      <div id="signup" className="signup">
        <div className="container">
          <First_navabr />
          <div className="row mt-2">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-5 p-0">
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
                <div className="col-lg-7 p-0 forms-div">
                  {/* --------------------------------------FORM 1-------------------------------------------- */}
                  <div id="signupform1" className="bg-white shadow rounded pt-4 pb-2 px-4 h-100 position-relative signupform1">
                    <h3 className="page6-month mb-3 text-center" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                    <div className="mb-3">
                      <label htmlFor="formGroupExampleInput" className="form-label signup-labels d-flex align-items-center" style={{ fontSize: '16px', color: '#6c757d' }}>
                        <span className="me-2">{translate_value.signup_page.university} {translate_value.login_page.email}</span>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 250 }}
                          overlay={renderTooltip("Only University Emails are allowed")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF845D" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                          </svg>
                        </OverlayTrigger>
                      </label>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 250 }}
                        overlay={renderTooltip("Only University Emails are allowed")}
                      >
                        <input type="text" className="form-control bg-light py-2 shadow" style={{ borderColor: '#3c147d', borderWidth: '2px', borderStyle: 'solid', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }} placeholder="Enter your University Email Id" value={university} aria-label="Username" name="university_mailid" onChange={(e) => {
                          setUniversity(e.target.value)
                          search_domain(e.target.value)
                        }} aria-describedby="basic-addon1" />
                      </OverlayTrigger>
                    </div>
                    <div className={`${domains.length > 0 ? '' : 'd-none'} bg-light border border-top-0 px-2 py-2 shadow-sm rounded`} style={{ maxHeight: '160px', overflowY: 'scroll' }}>
                      {domains && (
                        domains.map((x) => {
                          return (
                            <p key={x.domain} className="m-0 mb-1" style={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => {
                              const atIndex = university.indexOf('@');
                              if (atIndex !== -1) {
                                const partBeforeAt = university.substring(0, atIndex + 1);
                                setUniversity(partBeforeAt + x.domain);
                              }
                              setdomains([]);
                            }}>{x.domain}</p>
                          )
                        })
                      )}
                    </div>
                    <div className="d-flex">
                      <input type="checkbox" onClick={() => { setisChecked(!isChecked) }} checked={isChecked} />
                      <p className="m-0 ms-2 text-secondary" style={{ fontSize: '13px' }}>By signing up you &nbsp;
                        <span className="text-decoration-underline fw-medium text-dark" style={{ cursor: 'pointer' }} onClick={() => { setShowTerms(!showTerms); }}>
                          {translate_value.signup_page.agree}
                        </span>
                        <span className="required">*</span>
                      </p>
                    </div>
                    {showTerms && (
                      <div className="terms-conditions mt-2" style={{ width: '100%' }}>
                        <ul className="list-unstyled list-terms">
                          <ul className="terms-container ps-4 text-muted mt-2">
                            <h className="fw-bold">Terms and Conditions: </h>
                            <li className="fw-bold">Personal Information: <span className="fw-normal">Provide accurate personal details for your profile.</span></li>
                            <li className="fw-bold">Verification: <span className="fw-normal">Verify your email to complete the sign-up process.</span></li>
                            <li className="fw-bold">Privacy Policy: <span className="fw-normal">Review and accept our privacy policy.</span></li>
                            <li className="fw-bold">Data Protection: <span className="fw-normal">Your data is protected and used in accordance with our privacy policy.</span></li>
                            {/* Add more terms as needed */}
                          </ul>
                          {/* Add more points as needed */}
                        </ul>
                      </div>
                    )}
                    <div className="text-center mt-4">
                      <button onClick={(e) => { fetchOTP() }} className="btn btn-md py-2 px-2 px-md-5 fw-bold btn-otp" disabled={(isChecked) ? false : true} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                        {loading ? 'Fetching OTP...' : `${translate_value.signup_page.get_otp}`}
                      </button>
                    </div>
                    <div className="assistance">
                      <p className='' onClick={() => navigate('/contact_us')}>Need Assistance?</p>
                    </div>

                  </div>
                  {/* --------------------------------------FORM 2-------------------------------------------- */}
                  <div id="signupform2" style={{ display: 'none' }} className="bg-white shadow rounded pt-4 pb-2 h-100 position-relative signupform2">
                    <h3 className="page6-month mb-3 text-center" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                    <form action="" className="p-2 px-4">
                      <div className="row">
                        <div className="col-12">
                          <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.password1}</label>
                          <div className="input-group mb-3 bg-light rounded border py-2">
                            <input type={passwordtype ? 'password' : 'text'} className="form-control border-0 bg-transparent country-input" onChange={(e) => {
                              setPassword(e.target.value)
                            }} placeholder="must be atleast 6 characters" aria-label="Username" aria-describedby="basic-addon1" />
                            <span style={{ cursor: 'pointer' }} onClick={() => {
                              setPasswordtype(!passwordtype)
                            }} className="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8E9696" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                              </svg></span>
                          </div>

                        </div>
                        <div className="col-12">
                          <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.password2}</label>
                          <div className="input-group mb-3 bg-light rounded border py-2">
                            <input type={passwordtype2 ? 'password' : 'text'} className="form-control border-0 bg-transparent country-input" onChange={(e) => {
                              setretypePassword(e.target.value)
                            }} aria-label="Username" placeholder={translate_value.signup_page.password_placeholder2} aria-describedby="basic-addon1" />
                            <span style={{ cursor: 'pointer' }} onClick={() => {
                              setPasswordtype2(!passwordtype2)
                            }} className="input-group-text border-0 bg-transparent" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8E9696" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                              </svg></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <button
                          className="btn signup-btn btn-md py-2 px-2 px-md-5 text-white fw-medium"
                          type="submit" onClick={senddata}
                        >
                          <span class={`spinner-border spinner-border-sm ${load1 ? '' : 'd-none'}`} aria-hidden="true"></span>
                          <span class={`${load1 ? 'ms-2' : 'd-none'}`} role="status">Loading...</span>
                          <span class={`${load1 ? 'd-none' : ''}`}>{translate_value.signup_page.next}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  {/* ----------------------------------------FORM 3---------------------------------------------- */}
                  <div id="signupform3" style={{ display: 'none' }} className="bg-white shadow rounded pt-4 pb-2 h-100 position-relative signupform3" onClick={() => { setShowOptions(false); setShowcity(false) }}>
                    <h3 className="page6-month mb-3 text-center" style={{ fontSize: '35px', color: '#5D5FE3' }}>{translate_value.signup_page.signup}</h3>
                    <p className="fw-bold text-center" style={{ color: '#5d5fe3' }}>Kindly Add your University</p>
                    <form action="" className="p-2 px-4">
                      <div className="row">
                        <div className="col-12">
                          <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.country}</label>
                          <div className="input-group bg-light border py-2">
                            <input type="text" value={country} disabled={message === "University is not present" ? false : true} onChange={(e) => {
                              setcountry(e.target.value)
                              fetch_country(e.target.value)
                            }} className="form-control border-0 bg-transparent country-input" placeholder="Select the City" aria-label="Username" aria-describedby="basic-addon1" />
                          </div>
                          {/* --------------------------------SEARCH BAR FOR COUNTRY----------------------------------- */}
                          <div className={`px-3 py-2 bg-light border border-top-0 ${country.length > 0 && filteredCountries.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            {filteredCountries.map((x) => {
                              return (
                                <>
                                  <p onClick={() => {
                                    setcountry(x.name)
                                    setFilteredCountries([])
                                    setcountry_id(x.id)
                                  }} className="m-0" style={{ cursor: 'pointer' }}>{x.name}</p>
                                </>
                              )
                            })}
                          </div>

                        </div>
                        <div className="col-12 mt-3">
                          <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.city}</label>
                          <div className="input-group bg-light border py-2">
                            <input type="text" value={city} onChange={(e) => {
                              setCity(e.target.value)
                              searchCities(e.target.value)
                            }} className="form-control border-0 bg-transparent country-input" disabled={message === "University is not present" ? false : true} placeholder={translate_value.signup_page.city_placeholder} aria-label="Username" aria-describedby="basic-addon1" />
                          </div>
                          {/* --------------------------------SEARCH BAR FOR CITY----------------------------------- */}
                          <div className={`px-3 py-2 bg-light border border-top-0 ${message === "University is not present" && city.length > 0 && cities.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                            {cities.map((x) => {
                              return (
                                <>
                                  <p onClick={() => {
                                    fetchMatcheduniversity(x.name)
                                    setCity(x.name)
                                    setCities([])
                                  }} className="m-0" style={{ cursor: 'pointer' }}>{x.name}</p>
                                </>
                              )
                            })}
                          </div>
                        </div>
                        <div className={`col-12 mt-3 ${message === "University is not present" ? 'd-none' : ''}`}>
                          <label for="formGroupExampleInput" className="form-label signup-labels">{translate_value.signup_page.university}</label>
                          <div className="input-group mb-3 bg-light rounded border py-2">
                            <input type="text" value={UserUniversity} disabled={message === "University is not present" ? false : true} className="form-control border-0 bg-transparent country-input" placeholder={translate_value.signup_page.university_placeholder} aria-label="Username" aria-describedby="basic-addon1" />
                          </div>
                        </div>

                        <div className={`text-center ${message === "University is not present" ? 'mt-4' : 'd-none'}`}>
                          <a href="" className='btn text-decoration-none fw-medium text-white py-2 px-2 px-md-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-toggle="modal" data-bs-target="#adduniversitymodal">Add your University</a>
                        </div>
                      </div>
                      <div className={`text-center ${message === "University is not present" ? '' : 'mt-3'}`}>
                        <button disabled={message === "University is not present" ? true : false} className="btn signup-btn btn-md py-2 px-2 px-md-5 text-white fw-medium" type="submit" onClick={senduniversitydata}>
                          {translate_value.signup_page.signup}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className='row m-0 mt-5 mt-lg-0' style={{ position: 'relative' }}>

                <div className='main-login ' style={{ position: 'relative', padding: '20px' }}>
                  <p style={{ letterSpacing: '3px' }}>The Student Community </p>
                  <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>Improve</h1>
                  <h1 className='fw-bold login-header' style={{ color: '#2A3941' }}>comprehension</h1>
                  <h1 className='fw-bold login-header' style={{ color: '#FF845D' }}>together</h1>
                  <svg className='login-img3 d-none d-lg-block' style={{ position: 'absolute', animation: 'spin 6s linear infinite', width: '60px', height: '60px' }} xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
                    <path d="M28.43 77.66L0 49.23L0.0700073 48.96L10.4 10.4L10.67 10.33L49.23 0L77.66 28.43L77.59 28.7L67.26 67.26L66.99 67.33L28.43 77.66ZM1.08002 48.95L28.72 76.59L66.48 66.47L76.6 28.71L48.96 1.06998L11.2 11.19L1.08002 48.95Z" fill="#5D5FE3" />
                  </svg>
                  <img className='login-img1 align-items-center d-lg-block' style={{ position: 'absolute', animation: 'moveAnimation 6s linear infinite', width: '115px', height: '127px' }} src={require('../../img//images_icons/Group-removebg-preview.png')} alt="" />
                <img className='login-img2 align-items-center  d-lg-block' style={{ position: 'absolute', height: '135px', width: '31px' }} src={require('../../img/images_icons/login-image.png')} alt="" />
                <p className='mt-3 align-items-center already-have-account' style={{ color: '#2A3941', fontSize: '32px' }}>{translate_value.signup_page.already_have_account}</p>
                  
                  <Link to='/loginpage' className='btn p-3 px-5 fw-bold signup-btn' style={{ color: '#5D5FE3', border: '2px solid #5D5FE3' }}> {translate_value.signup_page.please_login_here}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------Enter and verify OTP Form--------------------------------------------- */}

        <div className={`${otpvalidationform ? 'd-flex align-items-center' : 'd-none'}`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', width: '100%', top: 0, left: 0, position: 'absolute', zIndex: 6, height: '100%' }}>
          <div className="otp-form mx-auto">
            <div className="bg-white rounded shadow p-3 mx-auto">
              <div className="text-center">
                <h3 className="mb-5 fw-bold otp-verification-title">{translate_value.signup_page.otp_verification}</h3>
                <p className="otp-verification-message">Please enter the 6 digit OTP <br />
                  that has been sent to your registered Email Id</p>
              </div>
              <div className="px-4">
                <div className="row">
                  <div className="col-sm-12 d-flex justify-content-evenly pb-1">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        className="form-control otp-input"
                        ref={el => inputRefs.current[index] = el}
                        value={data}
                        onChange={(e) => handleotpChange(e, index)}
                        onPaste={index === 0 ? handlePaste : null}
                      />
                    ))}
                  </div>
                  <p className={`text-danger m-0 mt-1 ps-4 ${otpmessage === 'Failed' ? '' : 'd-none'}`} style={{ fontSize: '14px' }}>* Enter valid OTP</p>
                </div>
                <div className="text-center mt-4">
                  <button className="btn verify-otp-btn" type="submit" onClick={sendOtp}>
                    {translate_value.signup_page.verify_otp}
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p style={{ fontSize: '14px' }}>OTP will valid only for <span style={{ color: 'red' }}>{timer} Seconds</span></p>
                </div>
                <div className="otp-action-button">
                  <button className="btn" disabled={otpValid} href="" style={{ color: '#5D5FE3',border:'2px solid rgb(93, 95, 227)' }} onClick={(e) => { e.preventDefault(); fetchOTP() }}>{translate_value.signup_page.resend_otp}</button>
                  <button className="btn" style={{ color: '#5D5FE3',border:'2px solid rgb(93, 95, 227)' }} onClick={() => {
                    setOtp1("")
                    setOtp2("")
                    setOtp3("")
                    setOtp4("")
                    setOtp5("")
                    setOtp6("")
                    setotpvalidationform(false)
                  }}>{translate_value.signup_page.change_email}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------OTP Successfull Message layout----------------------------------------------- */}

        <div className={`${validatedform ? 'd-flex align-items-center' : 'd-none'}`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', width: '100%', top: 0, left: 0, position: 'absolute', zIndex: 6, height: '100%' }}>
          <div className="otp-form mx-auto">
            <div className="bg-white rounded shadow mx-auto pb-5">
              <div className="text-end px-2 pt-2">

                <button onClick={() => {
                  if (message === "University is not present") {
                    document.getElementById('signupform1').style.display = 'none'
                    document.getElementById('signupform3').style.display = 'block'
                    // document.querySelector('.modal-backdrop').remove();
                    setvalidatedform(false)
                  }
                  else {
                    document.getElementById('signupform1').style.display = 'none'
                    document.getElementById('signupform2').style.display = 'block'
                    // document.querySelector('.modal-backdrop').remove();
                    setvalidatedform(false)
                  }
                }} className={`border-0 ms-auto btn btn-sm mt-2 text-decoration-underline`} style={{ color: '#FF845D' }}>Close</button>
              </div>
              <div className='d-flex flex-column pb-2 align-items-center justify-content-center mt-3' style={{ height: '200px' }}>
                <img src={require('../../img/images_icons/tick.png')} className=" animate__animated animate__bounceIn" width={70} alt="" />
                <p className='m-0 mt-3 fs-2 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '32px', lineHeight: 'normal', fontWeight: 450, letterSpacing: '0.64px' }}>OTP Verification</p>
                <p className='m-0 fs-3 animate__animated animate__bounceIn' style={{ color: '#34a853', fontSize: '32px', lineHeight: 'normal', fontWeight: 450, letterSpacing: '0.64px' }}>Successfull</p>
              </div>
            </div>
          </div>
        </div>

        {/* TOAST MESSAGE */}
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

            <div className="toast-body d-flex justify-content-between">
              <span id='toastbody'></span>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>

        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast2" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

            <div className="toast-body d-flex justify-content-between align-items-center">
              <span id='toastbody2'></span>
              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------ADD UNIVERSITY--------------------------------------------------------- */}
      <div className="modal fade" id="adduniversitymodal" tabindex="-1" aria-labelledby="addcoursemodalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body px-2  px-lg-5 py-5 mb-4 mt-2">
              <div className='d-flex flex-column align-items-center'>
                <h3 className='pb-4'>Add University Name</h3>
                <input type="text" name="" id="" className='form-control py-2' onChange={(e) => { setuniversityname(e.target.value) }} />
              </div>
              <div className='mt-4'>
                <button className='btn text-white w-100 px-3' data-bs-dismiss="modal" style={{ backgroundColor: '#5D5FE3' }} onClick={adduniversity}>Submit for Admin Approval</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Adddetails value={value} email={university} university_name={UserUniversity} password={password} />

      <div className={state ? '' : 'd-none'}>
        <div className="admin-request-success">
          <div className="bg-white rounded p-3 gap-3 justify-content-center d-flex align-items-center flex-column">
            <img src={require('../../img/check__2_-removebg-preview.png')} width={50} alt="" className='me-2' />
            <p className='mb-0 fw-medium fs-5 text-center'>Request successfully sent to the Admin</p>
            <p className='mb-0 text-center'>Wait for Admin approval</p>
            <div className='text-end'>
              <button className='btn btn-sm text-white px-3 fw-bold' style={{ backgroundColor: '#5d5fe3' }} onClick={() => { setstate(false); navigate('/loginpage') }}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signuppage;