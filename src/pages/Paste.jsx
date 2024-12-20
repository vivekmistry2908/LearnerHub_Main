import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'

const OTPValidationForm = ({ otpvalidationform, translate_value, university, ipaddress, setotpvalidationform, setvalidatedform }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [otpValid, setOTPValid] = useState(true);
  const [otpmessage, setotpmessage] = useState("");
  const [message, setmessage] = useState("");
  const [backendotp, setBackendotp] = useState({});
  const [loading, setloading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (otpValid && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOTPValid(false);
      setBackendotp({});
      setOtp(new Array(6).fill(""));
    }

    return () => clearInterval(interval);
  }, [timer]);

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

  const handleChange = (e, index) => {
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

  const sendOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    console.log(enteredOtp)
    // if (enteredOtp === backendotp.otp) {
    //   setotpmessage("Successful");
    //   setotpvalidationform(false);
    //   setvalidatedform(true);
    // } else {
    //   setotpmessage("Failed");
    //   setOtp(new Array(6).fill(""));
    // }
  };

  const fetchOTP = () => {
    setloading(true);
    setOtp(new Array(6).fill(""));

    setTimer(120);
    setOTPValid(true);
    const universitymail = new FormData();
    universitymail.append('email', university);
    axios.post(`${ipaddress}/userverification/`, universitymail)
      .then((r) => {
        if (r.data === 'This email is already registered with other account') {
          toast.warn('This Email is already registered', {
            autoClose: 3000,
          });
          setloading(false);
        } else {
          setBackendotp(r.data);
          if (r.data.message !== undefined) {
            setmessage(r.data.message);
          }
          setotpvalidationform(true);
          setloading(false);
        }
      })
      .catch(() => {
        setloading(false);
      });
  };

  return (
    <div className={`d-flex align-items-center`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', width: '100%', top: 0, left: 0, position: 'absolute', zIndex: 6, height: '100%' }}>
      <div className="otp-form p-5 mx-auto">
        <div className="bg-white rounded shadow w-75 px-2 mx-auto pb-5 animate__animated animate__fadeIn">
          <div className="text-center pt-4">
            <p>Please enter the 6 digit OTP <br />
              that has been sent to your registered Email Id</p>
          </div>
          <div className="p-2 px-4">
            <div className="row">
              <div className="col-sm-12 d-flex justify-content-evenly pb-1">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control otp-input"
                    ref={el => inputRefs.current[index] = el}
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onPaste={index === 0 ? handlePaste : null}
                  />
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn signup-btn btn-md py-2 w-100 text-white fw-medium" type="submit" onClick={sendOtp}>
                {/* {translate_value.signup_page.verify_otp} */}
                OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPValidationForm;
