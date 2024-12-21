
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Globalsearch from "../pages/Globalsearch";
import { ipaddress } from "../App";
import Offcanvases from "./Offcanvases";
import data from "../pages/translate";
import { Context } from "../context/Context_provider";
import Need_help from "../pages/Need_help";
import { toast } from "react-toastify";
import axiosInstance from "../pages/axiosInstance";
import axios from 'axios';

const Navbar = ({ setLanguage, count2, count, setindex1, setCount }) => {
  let navigate = useNavigate()
  let { translate_value, settranslate_value, lang, setLang, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)


  const translate = (x) => {
    if (x === "ge") {
      settranslate_value(data.ge);
      setLang("ge");
      // console.log(x)
      // console.log(translate_value.navbar.search)
    } else {
      settranslate_value(data.en);
      setLang("en");
      // console.log(x)
      // console.log(translate_value.navbar.search)
    }
  };

  const userdata = JSON.parse(sessionStorage.getItem('user'))
  const refresh_token = sessionStorage.getItem('refreshToken')

  const handleLogout = () => {
    axiosInstance.post(`${ipaddress}/User_Logout/${userdata.user_id}/`, {
      refresh_token: refresh_token
    })
      .then((r) => {
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")

        // sessionStorage.removeItem("additionaldetails")
        // console.log("Logout successfully : ",r.data)
        navigate('/')
      })
  }

  const [count1, setCount1] = useState(0)
  const [dropdownstate, setdropdownstate] = useState(false)
  const [creditCount, setCreditCount] = useState({})
  const [notification1, setNotification1] = useState([])
  const [notification2, setNotification2] = useState([])
  const [pushNotification, setPushNotification] = useState([])
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});

  const user = JSON.parse(sessionStorage.getItem('user'))

  // -----------------------------------Function for Push notification control------------------------------------------------

  const [buttonstatus, setButtonstatus] = useState(true)
  const [btnvalue, setbtnvalue] = useState("On")

  const pushnotificationcontrol = () => {
    axiosInstance.get(`${ipaddress}/PushNotificationsControl/${user.user_id}/`)
      .then((r) => {

        // console.log("Push notification control status",r.data)
      })


  }

  const [userdetails, setUserdetails] = useState({})
  useEffect(() => {

    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r) => {
        // console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
      })
      .catch(() => {
        console.log("User Details Fetching Error")
      })


    axiosInstance.get(`${ipaddress}/user_total_credits/${user.user_id}/`)
      .then((r) => {
        // console.log("Credit count Fetched ",r.data)
        setCreditCount(r.data)
      })
      .catch(() =>
        console.log("Credit fetch error"))

    // To get group related notifications

    axiosInstance.get(`${ipaddress}/displaynotifications/${user.user_id}/`)
      .then((r) => {
        // console.log("Notification Fetched Successfully",r.data)
        setNotification1(r.data.group_requests)
        setNotification2(r.data.notifications)
      })
      .catch(() =>
        console.log("Notification Fetching Error"))

    if (buttonstatus == true) {
      axiosInstance.get(`${ipaddress}/PushNotifications/${user.user_id}/`)
        .then((r) => {
          // console.log("Push Notification Fetched Successfully",r.data)
          setPushNotification(r.data)
        })
        .catch(() =>
          console.log("Push Notification Fetching Error"))
    }

    // To get the Joined courses of user
    axiosInstance.get(`${ipaddress}/CoursesView/${user.user_id}/`)
      .then((r) => {
        setJoinedCourses(r.data.joined_courses);
      })
      .catch(() => {
        // console.log("Joined courses fetching error in Offcanvas");
      });

    axiosInstance.get(`${ipaddress}/ParticularUserGroup/${user.user_id}/`)
      .then((r) => {
        // console.log("Group Details Suceessfully Fetched",r.data)
        setJoinedGroups(r.data.user_joined_groups);
        setUnseenMessages(r.data.unseen_messages);
      })
      .catch(() => {
        console.log("Group details fetching error");
      });
  }, [count2, count1, buttonstatus, count])

  // --------------------------------------------------ACCEPT REQUEST-------------------------------------------------------
  const acceptRequest = (user_id, group_id) => {
    axios.put(`${ipaddress}/groupadminacceptance/${user_id}/${group_id}/`)
      .then((r) => {
        // console.log("Admin accepted request",r.data)
        setCount1(count + 1)
        toast.success('Request accepted', {
          autoClose: 2000,
        })
      })
      .catch(() => {
        console.log("Admin accept request error")
      })
  }

  // -----------------------------------------DELETE NOTIFICATION-----------------------------------------------------------
  const deleteNotification = (id) => {
    axiosInstance.delete(`${ipaddress}/deletenotification/${id}/`)
      .then((r) => {
        setCount1(count1 + 1)
      })
      .catch(() => {
        console.log("Notification Delete Error")
      })
  }

  const deletepushNotification = (id) => {
    axiosInstance.delete(`${ipaddress}/PushNotificationsDelete/${id}/`)
      .then((r) => {
        setCount1(count1 + 1)
      })
      .catch(() => {
        console.log("Notification Delete Error")
      })
  }


  // -----------------------------------------REJECT REQUEST-------------------------------------------------------------
  const rejectRequest = (user_id, id) => {
    axiosInstance.delete(`${ipaddress}/groupadminacceptance/${user_id}/${id}/`)
      .then((r) => {
        setCount1(count1 + 1)
      })
      .catch(() => {
        console.log("Request Reject Error Error")
      })
  }

  // -------------------------------------------Language Translation for website---------------------------------------------
  const trasnslateGerman = () => {
    setLanguage("ge")
  }
  const trasnslateEnglish = () => {
    setLanguage("en")
  }

  const [groups, setGroups] = useState("opengroups")

  // Clear All Notifications

  const clearall = () => {
    const formdata = new FormData()
    axiosInstance.post(`${ipaddress}/ClearAll/`, {
      'user_id': user.user_id
    })
      .then((r) => {
        // console.log("Successfully cleared",r.data)
        setCount1(count1 + 1)
      })
      .catch((err) => {
        console.log("Clear all error", err)
      })
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-expand-md bg-light py-3 fixed-top d-none d-lg-block  animate__animated animate__fadeIn" style={{ zIndex: 3 }}>

        <div className="container-fluid">
          <div className="d-flex w-100 ps-lg-5">
            <div className="ps-5 d-flex navbardiv ms-5 align-items-center">
              <div className="input-group navbar-input" style={{ cursor: 'pointer', height: '45px' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#searchoffcanvas" aria-controls="searchoffcanvas">
                <span className="input-group-text bg-white border-end-0" style={{ color: '#AAB0B0' }} id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9772 15.5008C11.3001 15.7439 10.6197 15.8654 9.93589 15.8654C8.26749 15.8654 6.85546 15.2879 5.69982 14.1329C4.54416 12.9778 3.96633 11.5666 3.96633 9.89908C3.96633 8.23158 4.54384 6.81924 5.69886 5.66205C6.85387 4.50486 8.26513 3.92627 9.93263 3.92627C11.6001 3.92627 13.0125 4.50409 14.1697 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0337 20.2564L20.2965 20.9936ZM9.93589 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93589 4.96794C8.55368 4.96794 7.38682 5.4437 6.43529 6.39523C5.48378 7.34676 5.00802 8.51362 5.00802 9.89583C5.00802 11.278 5.48378 12.4449 6.43529 13.3964C7.38682 14.348 8.55368 14.8237 9.93589 14.8237Z" fill="#8E9696" />
                </svg></span>
                <input type="text" style={{ cursor: 'pointer' }} className="form-control nav-input ps-0 border-start-0" placeholder={translate_value.navbar.search} aria-label="Username" aria-describedby="basic-addon1" />
              </div>
              <button onClick={() => {navigate(`/uploadpage/0/""`)}} className="btn ms-3 text-white navbar-btn" style={{ backgroundColor: '#5D5FE3', width: '150px', height: '45px' }}><i className="fa-solid fa-plus me-2"></i>{translate_value.navbar.add}</button>
            </div>

            <ul className="navbar-nav gap-4 d-flex align-items-center justify-content-end" style={{ width: '40%' }}>
              <li className="nav-item">
                <span className={`${lang === "en" ? 'text-decoration-underline fw-bold' : ''}`} style={{ color: lang === "en" ? '#2C2C2C' : '#B6BBBC', cursor: 'pointer', fontSize: '14px' }} onClick={() => {
                  translate("en")
                }}>EN</span>
                <span className={`${lang === "ge" ? 'text-decoration-underline fw-bold' : ''} ms-3`} style={{ color: lang === "ge" ? '#2C2C2C' : '#B6BBBC', cursor: 'pointer', fontSize: '14px' }} onClick={() => {
                  translate("ge")
                }}>DE</span>
              </li>

              {/* -----------------------------------------------------Rewards icon-------------------------------------------------- */}
              <li className="nav-item d-flex align-items-center">
                <Link to='/rewards' className="nav-link d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                    <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                    <path d="M14.4423 29.1058L15.6923 20.5H10.3798L19.7308 7.0144H20.3077L19.0817 16.75H25.3317L15.0192 29.1058H14.4423Z" fill="white" />
                  </svg>

                  <span className="fw-medium ms-2" style={{ fontSize: '16px', color: "#8e9696" }}>{creditCount.credits} <span className="fw-normal">{translate_value.common_words.super_coins}</span></span>
                </Link>
              </li>

              {/* --------------------------------------------------Notification Icon------------------------------------------------ */}
              <li className="nav-item" style={{ position: 'relative' }}>
                <a className="nav-link d-flex align-items-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#notification" aria-controls="notification">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                    <path d="M7.29163 27.3718V25.9135H9.64738V14.359C9.64738 12.4538 10.2504 10.7781 11.4563 9.33195C12.6622 7.88574 14.1907 6.98503 16.0416 6.6298V5.83333C16.0416 5.42823 16.1831 5.0839 16.466 4.80032C16.7489 4.51677 17.0925 4.375 17.4967 4.375C17.9009 4.375 18.2455 4.51677 18.5306 4.80032C18.8157 5.0839 18.9583 5.42823 18.9583 5.83333V6.6298C20.8093 6.98503 22.3377 7.88574 23.5436 9.33195C24.7496 10.7781 25.3525 12.4538 25.3525 14.359V25.9135H27.7083V27.3718H7.29163ZM17.495 31.1859C16.8458 31.1859 16.2917 30.9552 15.8327 30.4939C15.3737 30.0326 15.1442 29.478 15.1442 28.8301H19.8557C19.8557 29.4826 19.6246 30.0384 19.1623 30.4974C18.7 30.9564 18.1442 31.1859 17.495 31.1859ZM11.1057 25.9135H23.8942V14.359C23.8942 12.5865 23.2716 11.0777 22.0264 9.83252C20.7812 8.58735 19.2724 7.96476 17.5 7.96476C15.7275 7.96476 14.2187 8.58735 12.9735 9.83252C11.7283 11.0777 11.1057 12.5865 11.1057 14.359V25.9135Z" fill="#8E9696" />
                  </svg>
                  <svg style={{ position: 'absolute', top: '10px', right: '26px' }} className={notification1.length > 0 || notification2.length > 0 || pushNotification.length > 0 ? "d-block" : "d-none"} xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#FF845D" />
                  </svg>
                  <span className={notification1.length > 0 || notification2.length > 0 || pushNotification.length > 0 ? "d-block ms-1" : "d-none"}>{notification1.length + notification2.length + pushNotification.length}</span>
                </a>
              </li>


              <li className="nav-item d-flex align-items-center" onClick={() => {
                // setdropdownstate(!dropdownstate)
                setnavbar_dropdown_visible(!navbar_dropdown_visible)
                // console.log(navbar_dropdown_visible)
              }} style={{ position: 'relative', cursor: 'pointer' }}>
                <a className="nav-link p-0 py-1">
                  <img src={userdetails.profile_pic} width={50} className={userdetails.profile_pic == null ? 'd-none' : 'd-inline rounded-circle'} style={{ height: '45px', width: '45px' }} alt="" />
                  {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex bg-success text-white rounded-circle my-auto justify-content-center align-items-center' : 'd-none'} style={{ fontSize: '16px', width: '40px', height: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                </a>
                <ul className={`border-0 shadow px-2 bg-white p-3 px-4 rounded ${navbar_dropdown_visible ? '' : 'd-none'}`} style={{ position: 'absolute', top: '60px', listStyleType: 'none', left: '-220px' }}>
                  <li className="ps-1"><Link className="dropdown-item mb-3" to={`/profile/${user.user_id}`} style={{ fontFamily: " 'DM Sans', sans-serif", fontSize: '16px', lineHeight: '28px', color: '#2A3941' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 8.23075C7.96875 8.23075 7.08594 7.86356 6.35156 7.12918C5.61719 6.39481 5.25 5.512 5.25 4.48075C5.25 3.44947 5.61719 2.56665 6.35156 1.83228C7.08594 1.0979 7.96875 0.730713 9 0.730713C10.0312 0.730713 10.9141 1.0979 11.6484 1.83228C12.3828 2.56665 12.75 3.44947 12.75 4.48075C12.75 5.512 12.3828 6.39481 11.6484 7.12918C10.9141 7.86356 10.0312 8.23075 9 8.23075ZM0.25 17.2692V15.2115C0.25 14.6955 0.40024 14.2127 0.700719 13.7632C1.0012 13.3137 1.40545 12.9647 1.91347 12.7163C3.09295 12.1506 4.27323 11.7263 5.45431 11.4435C6.63542 11.1606 7.81731 11.0192 9 11.0192C10.1827 11.0192 11.3646 11.1606 12.5457 11.4435C13.7268 11.7263 14.9071 12.1506 16.0865 12.7163C16.5946 12.9647 16.9988 13.3137 17.2993 13.7632C17.5998 14.2127 17.75 14.6955 17.75 15.2115V17.2692H0.25ZM1.5 16.0192H16.5V15.2115C16.5 14.9343 16.4107 14.6738 16.232 14.4302C16.0533 14.1867 15.8061 13.9807 15.4904 13.8125C14.4615 13.3141 13.4008 12.9323 12.308 12.667C11.2153 12.4018 10.1126 12.2692 9 12.2692C7.8874 12.2692 6.78473 12.4018 5.692 12.667C4.59925 12.9323 3.53846 13.3141 2.50963 13.8125C2.19392 13.9807 1.94672 14.1867 1.76803 14.4302C1.58934 14.6738 1.5 14.9343 1.5 15.2115V16.0192ZM9 6.98075C9.6875 6.98075 10.276 6.73595 10.7656 6.24637C11.2552 5.75679 11.5 5.16825 11.5 4.48075C11.5 3.79325 11.2552 3.2047 10.7656 2.71512C10.276 2.22554 9.6875 1.98075 9 1.98075C8.3125 1.98075 7.72396 2.22554 7.23438 2.71512C6.74479 3.2047 6.5 3.79325 6.5 4.48075C6.5 5.16825 6.74479 5.75679 7.23438 6.24637C7.72396 6.73595 8.3125 6.98075 9 6.98075Z" fill="#2A3941" />
                  </svg> <span className="ms-4">Profile</span></Link></li>
                  <li className=""><Link className="dropdown-item mb-3" style={{ fontFamily: " 'DM Sans', sans-serif", fontSize: '16px', lineHeight: '28px', color: '#2A3941' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M12.5 14.2307C11.4688 14.2307 10.5859 13.8636 9.85156 13.1292C9.11719 12.3948 8.75 11.512 8.75 10.4807C8.75 9.44947 9.11719 8.56665 9.85156 7.83228C10.5859 7.0979 11.4688 6.73071 12.5 6.73071C13.5312 6.73071 14.4141 7.0979 15.1484 7.83228C15.8828 8.56665 16.25 9.44947 16.25 10.4807C16.25 11.512 15.8828 12.3948 15.1484 13.1292C14.4141 13.8636 13.5312 14.2307 12.5 14.2307ZM3.75 23.2692V21.2115C3.75 20.6362 3.89503 20.1386 4.18509 19.7187C4.47516 19.2988 4.88461 18.9647 5.41347 18.7163C6.42789 18.2227 7.47355 17.8165 8.55047 17.4976C9.62741 17.1786 10.9439 17.0192 12.5 17.0192H12.7933C12.8702 17.0192 12.9631 17.024 13.0721 17.0336C12.9856 17.2484 12.9171 17.4587 12.8666 17.6646C12.8161 17.8706 12.7676 18.0721 12.7212 18.2692H12.5C11.101 18.2692 9.88101 18.4126 8.84016 18.6995C7.79928 18.9863 6.85577 19.3573 6.00962 19.8125C5.62981 20.0128 5.36658 20.2227 5.21994 20.4423C5.07331 20.6618 5 20.9182 5 21.2115V22.0192H12.875C12.9359 22.2163 13.0104 22.4283 13.0986 22.655C13.1867 22.8818 13.2837 23.0865 13.3894 23.2692H3.75ZM20.2644 23.8702L20.0817 22.4279C19.7356 22.3557 19.4091 22.2343 19.1022 22.0637C18.7953 21.893 18.5192 21.6763 18.274 21.4134L16.9183 21.9519L16.3894 21.0529L17.5385 20.1875C17.4006 19.8317 17.3317 19.4647 17.3317 19.0865C17.3317 18.7083 17.4006 18.3413 17.5385 17.9856L16.4135 17.0721L16.9423 16.173L18.274 16.7355C18.5032 16.4727 18.7752 16.26 19.0902 16.0973C19.4051 15.9347 19.7356 15.8173 20.0817 15.7452L20.2644 14.3028H21.3221L21.4808 15.7452C21.8269 15.8173 22.1575 15.9359 22.4724 16.1009C22.7873 16.266 23.0593 16.4823 23.2885 16.75L24.6202 16.173L25.1491 17.0865L24.0241 18C24.1619 18.3512 24.2308 18.717 24.2308 19.0975C24.2308 19.478 24.1619 19.8413 24.0241 20.1875L25.1731 21.0529L24.6443 21.9519L23.2885 21.4134C23.0433 21.6763 22.7672 21.893 22.4603 22.0637C22.1534 22.2343 21.8269 22.3557 21.4808 22.4279L21.3221 23.8702H20.2644ZM20.7714 21.3461C21.3934 21.3461 21.9251 21.1247 22.3666 20.6817C22.8081 20.2388 23.0288 19.7063 23.0288 19.0844C23.0288 18.4624 22.8074 17.9307 22.3645 17.4892C21.9215 17.0477 21.3891 16.8269 20.7671 16.8269C20.1451 16.8269 19.6134 17.0484 19.1719 17.4913C18.7304 17.9342 18.5096 18.4666 18.5096 19.0886C18.5096 19.7106 18.7311 20.2424 19.174 20.6839C19.6169 21.1254 20.1494 21.3461 20.7714 21.3461ZM12.5 12.9807C13.1875 12.9807 13.776 12.736 14.2656 12.2464C14.7552 11.7568 15 11.1682 15 10.4807C15 9.79325 14.7552 9.2047 14.2656 8.71512C13.776 8.22554 13.1875 7.98075 12.5 7.98075C11.8125 7.98075 11.224 8.22554 10.7344 8.71512C10.2448 9.2047 10 9.79325 10 10.4807C10 11.1682 10.2448 11.7568 10.7344 12.2464C11.224 12.736 11.8125 12.9807 12.5 12.9807Z" fill="#2A3941" />
                  </svg> <span className="ms-3">Settings</span></Link></li>
                  {/* <li className=""><Link data-bs-toggle="modal" data-bs-target="#need_help_modal" className="dropdown-item mb-3"  style={{fontFamily:" 'DM Sans', sans-serif",fontSize:'16px',lineHeight:'28px',color:'#2A3941'}}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 35 35" fill="none">
  <path d="M5.39584 16.4592L10.6795 11.1756C10.9637 10.8914 11.2899 10.6904 11.6582 10.5726C12.0266 10.4549 12.4071 10.4352 12.7997 10.5137L14.8638 10.9428C13.7756 12.274 12.8875 13.4781 12.1995 14.555C11.5115 15.6319 10.8244 16.9388 10.1382 18.4757L5.39584 16.4592ZM11.4115 18.8235C12.0453 17.3539 12.8048 15.9488 13.6901 14.6083C14.5754 13.2677 15.5864 12.0291 16.7231 10.8924C18.5442 9.07131 20.5242 7.70693 22.6631 6.79921C24.802 5.89147 27.1091 5.50398 29.5846 5.63674C29.7173 8.11216 29.3312 10.4193 28.4263 12.5582C27.5214 14.6971 26.1584 16.6771 24.3374 18.4981C23.2062 19.6293 21.9676 20.6356 20.6214 21.5171C19.2753 22.3987 17.8674 23.1564 16.3978 23.7902L11.4115 18.8235ZM20.4082 14.785C20.8364 15.2131 21.3548 15.4272 21.9633 15.4272C22.5719 15.4272 23.0903 15.2131 23.5184 14.785C23.9466 14.3568 24.1607 13.8431 24.1607 13.2439C24.1607 12.6447 23.9466 12.131 23.5184 11.7029C23.0903 11.2747 22.5719 11.0606 21.9633 11.0606C21.3548 11.0606 20.8364 11.2747 20.4082 11.7029C19.9801 12.131 19.766 12.6447 19.766 13.2439C19.766 13.8431 19.9801 14.3568 20.4082 14.785ZM18.7144 29.8255L16.6895 25.0831C18.2264 24.3969 19.5347 23.7051 20.6144 23.0077C21.6941 22.3104 22.8996 21.4176 24.2308 20.3295L24.6515 22.3936C24.73 22.7862 24.715 23.1681 24.6066 23.5392C24.4981 23.9103 24.3018 24.238 24.0177 24.5222L18.7144 29.8255ZM7.5048 23.5462C8.07504 22.976 8.76681 22.6941 9.58012 22.7007C10.3934 22.7072 11.0852 22.9956 11.6554 23.5659C12.2257 24.1361 12.5108 24.8279 12.5108 25.6412C12.5108 26.4545 12.2257 27.1462 11.6554 27.7165C11.16 28.212 10.3649 28.6364 9.27023 28.9897C8.17555 29.3431 6.90933 29.5871 5.47156 29.7217C5.60616 28.2839 5.85482 27.0191 6.21753 25.9272C6.58025 24.8353 7.00934 24.0417 7.5048 23.5462Z" fill="#2A3941"/>
</svg> <span className="ms-3">Need Help</span></Link></li> */}
                  <li className=""><Link className="dropdown-item mb-3" style={{ fontFamily: " 'DM Sans', sans-serif", fontSize: '16px', lineHeight: '28px', color: '#2A3941' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M15 15.1442L5 8.60578V21.7308C5 21.9551 5.07211 22.1394 5.21634 22.2837C5.36057 22.4279 5.54487 22.5 5.76922 22.5H16.875V23.75H5.76922C5.19391 23.75 4.71354 23.5573 4.32813 23.1719C3.94271 22.7865 3.75 22.3061 3.75 21.7308V8.26922C3.75 7.69391 3.94271 7.21354 4.32813 6.82812C4.71354 6.44271 5.19391 6.25 5.76922 6.25H24.2308C24.8061 6.25 25.2865 6.44271 25.6719 6.82812C26.0573 7.21354 26.25 7.69391 26.25 8.26922V16.875H25V8.60578L15 15.1442ZM15 13.75L24.6154 7.5H5.38463L15 13.75ZM23.2692 27.2356L22.4087 26.375L24.9783 23.75H18.8942V22.5H25.0024L22.3774 19.875L23.2692 19.0144L27.3798 23.125L23.2692 27.2356ZM5 8.60578V23.3413V16.875V17.0889V7.5V8.60578Z" fill="#2A3941" />
                  </svg> <span className="ms-3">Invite Friends (+50 Coins)</span></Link></li>
                  <li className=""><a onClick={handleLogout} className="dropdown-item" style={{ fontFamily: " 'DM Sans', sans-serif", fontSize: '16px', lineHeight: '28px', color: '#2A3941' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M7.01922 25C6.44391 25 5.96354 24.8073 5.57812 24.4219C5.19271 24.0365 5 23.5561 5 22.9808V7.01922C5 6.44391 5.19271 5.96354 5.57812 5.57812C5.96354 5.19271 6.44391 5 7.01922 5H15.024V6.25H7.01922C6.82693 6.25 6.65065 6.33013 6.49038 6.49038C6.33013 6.65065 6.25 6.82693 6.25 7.01922V22.9808C6.25 23.1731 6.33013 23.3494 6.49038 23.5096C6.65065 23.6699 6.82693 23.75 7.01922 23.75H15.024V25H7.01922ZM20.5769 19.4231L19.6995 18.524L22.5986 15.625H11.4904V14.375H22.5986L19.6995 11.476L20.5769 10.5769L25 15L20.5769 19.4231Z" fill="#2A3941" />
                  </svg> <span className="ms-3">Log Out</span></a></li>
                </ul>
              </li>

            </ul>
            {/* </div> */}
          </div>
        </div>
      </nav>

      {/* navbar for Small screens */}

      <nav className="navbar navbar2 navbar-expand bg-white py-2 fixed-top border-bottom d-block d-lg-none">
        <div className="container-fluid">
          <button
            className="border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#website_offcanvas"
            aria-controls="website_offcanvas"
          >
            <img src={require('../img/menus.png')} className="bg-white" alt="" height={30} />
          </button>
          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center">
              <Link to='/rewards' className="nav-link mx-2 text-uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 35 35" fill="none">
                  <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                  <path d="M14.4423 29.1058L15.6923 20.5H10.3798L19.7308 7.0144H20.3077L19.0817 16.75H25.3317L15.0192 29.1058H14.4423Z" fill="white" />
                </svg>
                <span className="fw-bold ms-1 text-warning" style={{ fontSize: '13px' }}>{creditCount.credits}</span>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link mx-2 d-flex align-items-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#notification" aria-controls="notification">
                <img src={require(notification1.length <= 0 && notification2.length <= 0 && pushNotification.length <= 0 ? '../img/landing_page/Vector.png' : '../img/landing_page/Group 6.png')} width={20} alt="Bell Icon" />
                <span className={notification1.length > 0 || notification2.length > 0 || pushNotification.length > 0 ? "d-block ms-1" : "d-none"}> {notification1.length + notification2.length + pushNotification.length}</span>

              </a>
              <ul className={notification1 <= 0 && notification2 <= 0 && pushNotification.length <= 0 ? "d-none" : "dropdown-menu fade-up dropdown-menu-end"} style={{ width: 'max-content' }} aria-labelledby="notificationDropdown">
                {notification1 && (
                  notification1.map((x) => {
                    return (
                      <li className="d-flex justify-content-between align-items-center px-2 mb-2" key="{x}">
                        <a className="text-secondary" style={{ textDecoration: 'none', fontSize: '13px' }}>{x ? `${x.user_data.profile_pic.nickname} from ${x.university_name} requested for group ${x.group_name}` : "No Notifications"}</a>
                        <div className="d-flex gap-2 align-items-center ms-2">
                          <button className="btn btn-success btn-sm text-white" onClick={() => {
                            acceptRequest(x.user_data.user_id, x.group_id)
                          }}><i className="fa-solid fa-check"></i></button>
                          <button className="btn btn-danger btn-sm text-white" onClick={() => {
                            rejectRequest(x.user_data.user_id, x.group_id)
                          }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                      </li>
                    )
                  })
                )}


                {notification2 && (
                  notification2.map((x) => {
                    return (
                      <li className="d-flex justify-content-between align-items-center px-2 py-2">
                        <Link className="text-secondary text-decoration-none" style={{ textDecoration: 'none', fontSize: '13px' }}>{x.message}</Link>
                        <button className="btn btn-sm btn-transparent ms-2" onClick={() => {
                          deleteNotification(x.id)
                        }}><i className="fa-solid fa-xmark"></i></button>
                      </li>
                    )
                  })
                )}

                {pushNotification && (
                  pushNotification.map((z) => {
                    return (
                      <li className="d-flex justify-content-between align-items-center px-2 py-2">
                        <a className="text-secondary" style={{ textDecoration: 'none', fontSize: '13px' }}><span>{z.notification}</span></a>
                        <button className="btn btn-sm btn-transparent ms-2" onClick={() => {
                          deletepushNotification(z.id)
                        }}><i className="fa-solid fa-xmark"></i></button>
                      </li>
                    )
                  })
                )}
              </ul>
            </li>

          </ul>
        </div>
      </nav>

      {/* Mobile screen Offcanvas */}
      <div
        className="offcanvas offcanvas-start d-sm-block d-lg-none d-xl-none"
        data-bs-backdrop="static" tabindex="-1"
        id="website_offcanvas"
        aria-labelledby="website_offcanvasLabel"
      >
        <div className="offcanvas-header d-flex justify-content-between align-items-center">
          <img src={require('../img/landing_page/Group 385.png')} width={120} alt="" />
          <svg data-bs-dismiss="offcanvas" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
          </svg>
        </div>
        <div className="offcanvas-body">
          <div className="pb-5">
            <ul className="nav flex-column gap-3 text-start ps-0 pb-4">
              <li data-bs-dismiss="offcanvas" className="nav-item">
                <Link to='/dashboard/page' className="nav-link"><span className="nav-icon ms-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 25" fill="none">
                  <path d="M3.18909 24.1668C2.51789 24.1668 1.95747 23.942 1.50782 23.4924C1.05816 23.0427 0.833336 22.4823 0.833336 21.8111V3.18925C0.833336 2.51805 1.05816 1.95763 1.50782 1.50798C1.95747 1.05832 2.51789 0.833496 3.18909 0.833496H21.8109C22.4821 0.833496 23.0425 1.05832 23.4922 1.50798C23.9418 1.95763 24.1667 2.51805 24.1667 3.18925V21.8111C24.1667 22.4823 23.9418 23.0427 23.4922 23.4924C23.0425 23.942 22.4821 24.1668 21.8109 24.1668H3.18909ZM3.18909 22.7085H11.7708V2.29183H3.18909C2.96475 2.29183 2.75909 2.38531 2.57211 2.57227C2.38515 2.75925 2.29167 2.96491 2.29167 3.18925V21.8111C2.29167 22.0354 2.38515 22.2411 2.57211 22.4281C2.75909 22.615 2.96475 22.7085 3.18909 22.7085ZM13.2292 22.7085H21.8109C22.0353 22.7085 22.2409 22.615 22.4279 22.4281C22.6149 22.2411 22.7083 22.0354 22.7083 21.8111V12.5002H13.2292V22.7085ZM13.2292 11.0418H22.7083V3.18925C22.7083 2.96491 22.6149 2.75925 22.4279 2.57227C22.2409 2.38531 22.0353 2.29183 21.8109 2.29183H13.2292V11.0418Z" fill="#8E9696" />
                </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Dashboard</span></Link>
              </li>
              <li className="nav-item">
                <a data-bs-toggle="offcanvas"
                  data-bs-target="#courseOffcanvas"
                  aria-controls="courseOffcanvas" className="nav-link" type="button"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 35 35" fill="none">
                    <path d="M17.5 27.2596L8.75 22.5031V15.4358L4.48714 13.1249L17.5 6.05762L30.5129 13.1249V22.4358H29.0545V13.9438L26.25 15.4358V22.5031L17.5 27.2596ZM17.5 18.5208L27.4615 13.1249L17.5 7.72909L7.53845 13.1249L17.5 18.5208ZM17.5 25.5965L24.7917 21.659V16.2379L17.5 20.187L10.2083 16.2379V21.659L17.5 25.5965Z" fill="#8E9696" />
                  </svg></span>
                  <span className="ms-4 fw-medium text-secondary">Course</span></a>
              </li>
              <li className="nav-item">
                <Link data-bs-toggle="offcanvas"
                  data-bs-target="#groupOffcanvas"
                  aria-controls="groupOffcanvas" className="nav-link" type="button"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 35 35" fill="none">
                    <path d="M3.78605 27.1475V24.7468C3.78605 24.07 3.96133 23.488 4.31189 23.001C4.66245 22.514 5.13355 22.1247 5.72519 21.8333C6.99013 21.231 8.24612 20.7509 9.49316 20.3928C10.7402 20.0348 12.2406 19.8558 13.9944 19.8558C15.7481 19.8558 17.2485 20.0348 18.4956 20.3928C19.7426 20.7509 20.9986 21.231 22.2636 21.8333C22.8552 22.1247 23.3263 22.514 23.6769 23.001C24.0274 23.488 24.2027 24.07 24.2027 24.7468V27.1475H3.78605ZM27.1194 27.1475V24.6795C27.1194 23.8344 26.9483 23.0367 26.6063 22.2864C26.2642 21.536 25.779 20.8922 25.1506 20.3549C25.8667 20.5008 26.5566 20.7032 27.2203 20.9621C27.8841 21.2211 28.5403 21.5123 29.1891 21.8357C29.8211 22.1536 30.3165 22.5603 30.6755 23.056C31.0345 23.5516 31.2139 24.0928 31.2139 24.6795V27.1475H27.1194ZM13.9944 16.6026C12.7913 16.6026 11.7613 16.1742 10.9045 15.3174C10.0478 14.4606 9.61938 13.4307 9.61938 12.2276C9.61938 11.0244 10.0478 9.99447 10.9045 9.1377C11.7613 8.28092 12.7913 7.85254 13.9944 7.85254C15.1975 7.85254 16.2275 8.28092 17.0842 9.1377C17.941 9.99447 18.3694 11.0244 18.3694 12.2276C18.3694 13.4307 17.941 14.4606 17.0842 15.3174C16.2275 16.1742 15.1975 16.6026 13.9944 16.6026ZM24.5954 12.2276C24.5954 13.4307 24.167 14.4606 23.3102 15.3174C22.4534 16.1742 21.4235 16.6026 20.2204 16.6026C20.1587 16.6026 20.0801 16.5956 19.9848 16.5815C19.8894 16.5675 19.8109 16.5521 19.7492 16.5353C20.2432 15.9302 20.6228 15.2589 20.8881 14.5215C21.1534 13.7841 21.286 13.0183 21.286 12.2241C21.286 11.4299 21.1472 10.6711 20.8696 9.94751C20.5919 9.22396 20.2185 8.54807 19.7492 7.91984C19.8277 7.89182 19.9062 7.87359 19.9848 7.86515C20.0633 7.85674 20.1418 7.85254 20.2204 7.85254C21.4235 7.85254 22.4534 8.28092 23.3102 9.1377C24.167 9.99447 24.5954 11.0244 24.5954 12.2276ZM5.24438 25.6891H22.7444V24.7468C22.7444 24.4046 22.6588 24.1055 22.4878 23.8494C22.3167 23.5932 22.0096 23.3483 21.5665 23.1146C20.4784 22.5331 19.3313 22.0877 18.1254 21.7782C16.9195 21.4688 15.5425 21.3141 13.9944 21.3141C12.4463 21.3141 11.0693 21.4688 9.86336 21.7782C8.65744 22.0877 7.51041 22.5331 6.42228 23.1146C5.97916 23.3483 5.67206 23.5932 5.50098 23.8494C5.32991 24.1055 5.24438 24.4046 5.24438 24.7468V25.6891ZM13.9944 15.1442C14.7965 15.1442 15.4831 14.8587 16.0543 14.2875C16.6255 13.7163 16.911 13.0297 16.911 12.2276C16.911 11.4255 16.6255 10.7389 16.0543 10.1677C15.4831 9.5965 14.7965 9.31091 13.9944 9.31091C13.1923 9.31091 12.5057 9.5965 11.9345 10.1677C11.3633 10.7389 11.0777 11.4255 11.0777 12.2276C11.0777 13.0297 11.3633 13.7163 11.9345 14.2875C12.5057 14.8587 13.1923 15.1442 13.9944 15.1442Z" fill="#8E9696" />
                  </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Group</span></Link>
              </li>
              <li className="nav-item">
                <Link data-bs-toggle="offcanvas"
                  data-bs-target="#studylistcanvas"
                  aria-controls="studylistcanvas" className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 35 35" fill="none">
                    <path d="M20.2484 13.9886V12.6312C21.0318 12.2348 21.8708 11.9376 22.7654 11.7394C23.6601 11.5412 24.5785 11.4421 25.5208 11.4421C26.0593 11.4421 26.5763 11.4767 27.0717 11.5459C27.5672 11.615 28.0785 11.7132 28.6058 11.8403V13.1641C28.0972 13.0014 27.6013 12.8888 27.118 12.8261C26.6347 12.7635 26.1023 12.7322 25.5208 12.7322C24.5785 12.7322 23.6587 12.8383 22.7612 13.0505C21.8638 13.2627 21.0262 13.5754 20.2484 13.9886ZM20.2484 21.9533V20.5399C20.9944 20.1435 21.8287 19.8462 22.7514 19.648C23.6741 19.4498 24.5972 19.3507 25.5208 19.3507C26.0593 19.3507 26.5763 19.3853 27.0717 19.4545C27.5672 19.5237 28.0785 19.6218 28.6058 19.749V21.0727C28.0972 20.9101 27.6013 20.7974 27.118 20.7348C26.6347 20.6721 26.1023 20.6408 25.5208 20.6408C24.5785 20.6408 23.6587 20.7549 22.7612 20.983C21.8638 21.2111 21.0262 21.5345 20.2484 21.9533ZM20.2484 17.999V16.5855C21.0318 16.1892 21.8708 15.8919 22.7654 15.6937C23.6601 15.4955 24.5785 15.3964 25.5208 15.3964C26.0593 15.3964 26.5763 15.431 27.0717 15.5002C27.5672 15.5694 28.0785 15.6675 28.6058 15.7947V17.1184C28.0972 16.9557 27.6013 16.8431 27.118 16.7804C26.6347 16.7178 26.1023 16.6865 25.5208 16.6865C24.5785 16.6865 23.6587 16.8019 22.7612 17.0328C21.8638 17.2637 21.0262 17.5858 20.2484 17.999ZM9.47916 23.3892C10.7524 23.3892 11.9906 23.5355 13.1937 23.8281C14.3968 24.1207 15.5892 24.597 16.7708 25.257V10.9485C15.7182 10.1969 14.5581 9.63322 13.2904 9.2574C12.0228 8.88161 10.7524 8.69372 9.47916 8.69372C8.60416 8.69372 7.83807 8.74606 7.18087 8.85075C6.52369 8.95546 5.79407 9.1499 4.99198 9.43408C4.76762 9.50887 4.6087 9.61637 4.51522 9.75659C4.42174 9.89683 4.375 10.0511 4.375 10.2194V23.3668C4.375 23.6285 4.46848 23.8202 4.65543 23.9417C4.84242 24.0632 5.04808 24.0772 5.27242 23.9838C5.80527 23.8043 6.42086 23.6603 7.11918 23.5519C7.8175 23.4434 8.60416 23.3892 9.47916 23.3892ZM18.2292 25.257C19.4108 24.597 20.6031 24.1207 21.8063 23.8281C23.0094 23.5355 24.2476 23.3892 25.5208 23.3892C26.3958 23.3892 27.1825 23.4434 27.8808 23.5519C28.5791 23.6603 29.1947 23.8043 29.7276 23.9838C29.9519 24.0772 30.1576 24.0632 30.3446 23.9417C30.5315 23.8202 30.625 23.6285 30.625 23.3668V10.2194C30.625 10.0511 30.5783 9.90151 30.4848 9.77063C30.3913 9.63974 30.2324 9.52756 30.008 9.43408C29.2059 9.1499 28.4763 8.95546 27.8191 8.85075C27.1619 8.74606 26.3958 8.69372 25.5208 8.69372C24.2476 8.69372 22.9772 8.88161 21.7095 9.2574C20.4419 9.63322 19.2818 10.1969 18.2292 10.9485V25.257ZM17.5 27.3716C16.3146 26.5602 15.0414 25.9366 13.6803 25.501C12.3192 25.0654 10.9188 24.8476 9.47916 24.8476C8.72008 24.8476 7.97455 24.9111 7.24259 25.0383C6.51061 25.1654 5.7978 25.3692 5.10416 25.6497C4.57506 25.8609 4.07819 25.7973 3.61357 25.4589C3.14896 25.1205 2.91666 24.6531 2.91666 24.0567V9.96134C2.91666 9.60048 3.01154 9.2658 3.20129 8.95732C3.39107 8.64883 3.65704 8.43382 3.99918 8.31229C4.85549 7.93461 5.74639 7.6607 6.67187 7.49056C7.59735 7.32042 8.53312 7.23535 9.47916 7.23535C10.9076 7.23535 12.3009 7.44101 13.6593 7.85233C15.0175 8.26366 16.2978 8.86195 17.5 9.64722C18.7022 8.86195 19.9824 8.26366 21.3407 7.85233C22.6991 7.44101 24.0924 7.23535 25.5208 7.23535C26.4669 7.23535 27.4026 7.32042 28.3281 7.49056C29.2536 7.6607 30.1445 7.93461 31.0008 8.31229C31.343 8.43382 31.6089 8.64883 31.7987 8.95732C31.9885 9.2658 32.0833 9.60048 32.0833 9.96134V24.0567C32.0833 24.6531 31.8323 25.1112 31.3303 25.4309C30.8283 25.7506 30.2941 25.8048 29.7276 25.5935C29.0526 25.3318 28.3632 25.142 27.6593 25.0242C26.9553 24.9065 26.2425 24.8476 25.5208 24.8476C24.0812 24.8476 22.6808 25.0654 21.3197 25.501C19.9586 25.9366 18.6854 26.5602 17.5 27.3716Z" fill="#8E9696" />
                  </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Study List</span></Link>
              </li>
              {/**<li className="nav-item">
    <Link to='/work_flow' className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#8E9696" class="bi bi-person-workspace" viewBox="0 0 16 16">
  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
</svg></span>
    <span className="ms-4  fw-medium text-secondary">Work Flow</span></Link>
  </li>*/}

              <li data-bs-dismiss="offcanvas" className="nav-item">
                <Link data-bs-toggle="modal" data-bs-target="#need_help_modal" className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 35 35" fill="none">
                  <path d="M5.39584 16.4592L10.6795 11.1756C10.9637 10.8914 11.2899 10.6904 11.6582 10.5726C12.0266 10.4549 12.4071 10.4352 12.7997 10.5137L14.8638 10.9428C13.7756 12.274 12.8875 13.4781 12.1995 14.555C11.5115 15.6319 10.8244 16.9388 10.1382 18.4757L5.39584 16.4592ZM11.4115 18.8235C12.0453 17.3539 12.8048 15.9488 13.6901 14.6083C14.5754 13.2677 15.5864 12.0291 16.7231 10.8924C18.5442 9.07131 20.5242 7.70693 22.6631 6.79921C24.802 5.89147 27.1091 5.50398 29.5846 5.63674C29.7173 8.11216 29.3312 10.4193 28.4263 12.5582C27.5214 14.6971 26.1584 16.6771 24.3374 18.4981C23.2062 19.6293 21.9676 20.6356 20.6214 21.5171C19.2753 22.3987 17.8674 23.1564 16.3978 23.7902L11.4115 18.8235ZM20.4082 14.785C20.8364 15.2131 21.3548 15.4272 21.9633 15.4272C22.5719 15.4272 23.0903 15.2131 23.5184 14.785C23.9466 14.3568 24.1607 13.8431 24.1607 13.2439C24.1607 12.6447 23.9466 12.131 23.5184 11.7029C23.0903 11.2747 22.5719 11.0606 21.9633 11.0606C21.3548 11.0606 20.8364 11.2747 20.4082 11.7029C19.9801 12.131 19.766 12.6447 19.766 13.2439C19.766 13.8431 19.9801 14.3568 20.4082 14.785ZM18.7144 29.8255L16.6895 25.0831C18.2264 24.3969 19.5347 23.7051 20.6144 23.0077C21.6941 22.3104 22.8996 21.4176 24.2308 20.3295L24.6515 22.3936C24.73 22.7862 24.715 23.1681 24.6066 23.5392C24.4981 23.9103 24.3018 24.238 24.0177 24.5222L18.7144 29.8255ZM7.5048 23.5462C8.07504 22.976 8.76681 22.6941 9.58012 22.7007C10.3934 22.7072 11.0852 22.9956 11.6554 23.5659C12.2257 24.1361 12.5108 24.8279 12.5108 25.6412C12.5108 26.4545 12.2257 27.1462 11.6554 27.7165C11.16 28.212 10.3649 28.6364 9.27023 28.9897C8.17555 29.3431 6.90933 29.5871 5.47156 29.7217C5.60616 28.2839 5.85482 27.0191 6.21753 25.9272C6.58025 24.8353 7.00934 24.0417 7.5048 23.5462Z" fill="#ff845d" />
                </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Need Help</span></Link>
              </li>

            </ul>

            <ul className="border-top pt-4 nav flex-column gap-3 text-start ps-0" style={{ listStyleType: 'none' }}>
              <li data-bs-dismiss="offcanvas" className="nav-item">
                <Link to={`/profile/${user.user_id}`} className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                  <path d="M15 14.2307C13.9688 14.2307 13.0859 13.8636 12.3516 13.1292C11.6172 12.3948 11.25 11.512 11.25 10.4807C11.25 9.44947 11.6172 8.56665 12.3516 7.83228C13.0859 7.0979 13.9688 6.73071 15 6.73071C16.0312 6.73071 16.9141 7.0979 17.6484 7.83228C18.3828 8.56665 18.75 9.44947 18.75 10.4807C18.75 11.512 18.3828 12.3948 17.6484 13.1292C16.9141 13.8636 16.0312 14.2307 15 14.2307ZM6.25 23.2692V21.2115C6.25 20.6955 6.40024 20.2127 6.70072 19.7632C7.0012 19.3137 7.40545 18.9647 7.91347 18.7163C9.09295 18.1506 10.2732 17.7263 11.4543 17.4435C12.6354 17.1606 13.8173 17.0192 15 17.0192C16.1827 17.0192 17.3646 17.1606 18.5457 17.4435C19.7268 17.7263 20.9071 18.1506 22.0865 18.7163C22.5946 18.9647 22.9988 19.3137 23.2993 19.7632C23.5998 20.2127 23.75 20.6955 23.75 21.2115V23.2692H6.25ZM7.5 22.0192H22.5V21.2115C22.5 20.9343 22.4107 20.6738 22.232 20.4302C22.0533 20.1867 21.8061 19.9807 21.4904 19.8125C20.4615 19.3141 19.4008 18.9323 18.308 18.667C17.2153 18.4018 16.1126 18.2692 15 18.2692C13.8874 18.2692 12.7847 18.4018 11.692 18.667C10.5993 18.9323 9.53846 19.3141 8.50963 19.8125C8.19392 19.9807 7.94672 20.1867 7.76803 20.4302C7.58934 20.6738 7.5 20.9343 7.5 21.2115V22.0192ZM15 12.9807C15.6875 12.9807 16.276 12.736 16.7656 12.2464C17.2552 11.7568 17.5 11.1682 17.5 10.4807C17.5 9.79325 17.2552 9.2047 16.7656 8.71512C16.276 8.22554 15.6875 7.98075 15 7.98075C14.3125 7.98075 13.724 8.22554 13.2344 8.71512C12.7448 9.2047 12.5 9.79325 12.5 10.4807C12.5 11.1682 12.7448 11.7568 13.2344 12.2464C13.724 12.736 14.3125 12.9807 15 12.9807Z" fill="#2A3941" />
                </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Profile</span></Link>
              </li>
              <li data-bs-dismiss="offcanvas" className="nav-item">
                <p onClick={() => {
                  handleLogout()
                }} style={{ cursor: 'pointer' }} className="nav-link"><span className="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                  <path d="M7.01922 25C6.44391 25 5.96354 24.8073 5.57812 24.4219C5.19271 24.0365 5 23.5561 5 22.9808V7.01922C5 6.44391 5.19271 5.96354 5.57812 5.57812C5.96354 5.19271 6.44391 5 7.01922 5H15.024V6.25H7.01922C6.82693 6.25 6.65065 6.33013 6.49038 6.49038C6.33013 6.65065 6.25 6.82693 6.25 7.01922V22.9808C6.25 23.1731 6.33013 23.3494 6.49038 23.5096C6.65065 23.6699 6.82693 23.75 7.01922 23.75H15.024V25H7.01922ZM20.5769 19.4231L19.6995 18.524L22.5986 15.625H11.4904V14.375H22.5986L19.6995 11.476L20.5769 10.5769L25 15L20.5769 19.4231Z" fill="#2A3941" />
                </svg></span>
                  <span className="ms-4  fw-medium text-secondary">Logout</span></p>
              </li>
            </ul>
          </div>

        </div>
      </div>


      {/* -----------------------------------------------Big Screen Notification Layout---------------------------------------------- */}
      <div className="offcanvas offcanvas-end border-0 shadow" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="notification" aria-labelledby="notificationLabel" style={{ marginTop: '74px' }}>
        <div className="offcanvas-header py-4" style={{ backgroundColor: '#F3F0FF' }}>
          <h5 className="offcanvas-title d-flex align-items-center" id="offcanvasScrollingLabel" style={{ fontSize: '16px' }}>Notifications<span className={notification1.length > 0 || notification2.length > 0 || pushNotification.length > 0 ? "d-block ms-1 rounded-circle p-1 px-2 text-white" : "d-none"} style={{ fontSize: '11px', backgroundColor: '#FF845D' }}> {notification1.length + notification2.length + pushNotification.length}</span></h5>
          <button data-bs-dismiss="offcanvas" aria-label="Close" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5 text-secondary"></i></button>
        </div>
        <div className="offcanvas-body p-0 px-2">

          <div className={notification1 <= 0 && notification2 <= 0 && pushNotification.length <= 0 ? "d-none" : "d-block text-end mt-1"}>
            <span onClick={() => {
              clearall()
            }} style={{ color: '#5d5fe3', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer' }}>Clear All</span>
          </div>
          <div className={notification1 <= 0 && notification2 <= 0 && pushNotification.length <= 0 ? "d-block text-center mt-4" : "d-none"}>
            <p className="fw-medium text-secondary">No Notifications !!!!!</p>
          </div>
          <ul className={notification1 <= 0 && notification2 <= 0 && pushNotification.length <= 0 ? "d-none" : "p-0"} style={{ listStyleType: 'none' }} aria-labelledby="notificationDropdown">

            {notification1 && (
              notification1.map((x) => {
                return (
                  <li className="d-flex justify-content-between align-items-center px-1 py-3 border-bottom">
                    <div className="d-flex">
                      <p style={{ fontSize: '13px', height: '30px', width: '30px' }} className={x.user_data.profile_pic.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-primary text-white p-1 rounded-circle' : 'd-none'}><span>{x.user_data.profile_pic.nickname.slice(0, 1)}</span><span>{x.user_data.profile_pic.nickname.slice(-1)}</span></p>
                      <img src={x.user_data.profile_pic.profile_pic} width={28} height={28} className={x.user_data.profile_pic.profile_pic == null ? 'd-none' : 'd-inline rounded-circle'} alt="" />
                      <div className="ms-2 d-flex">
                        <a className="text-secondary" style={{ textDecoration: 'none', fontSize: '13px' }}>{x ? `${x.user_data.profile_pic.nickname} from ${x.university_name} requested for group ${x.group_name}` : "No Notifications"}</a>
                        <div className="d-flex gap-2 align-items-center ms-3">
                          <button className="btn btn-success btn-sm text-white" onClick={() => {
                            acceptRequest(x.user_data.user_id, x.group_id)
                          }}><i className="fa-solid fa-check"></i></button>
                          <button className="btn btn-danger btn-sm text-white" onClick={() => {
                            rejectRequest(x.user_data.user_id, x.group_id)
                          }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                      </div>
                    </div>

                  </li>
                )
              })
            )}

            <li className=""></li>
            {notification2 && (
              notification2.map((x) => {
                return (
                  <li className="d-flex justify-content-between align-items-center px-1 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <p style={{ fontSize: '13px', height: '30px', width: '30px' }} className={x.profile_pic.profile_pic == null ? 'd-flex justify-content-center align-items-center my-auto bg-primary text-white p-1 rounded-circle' : 'd-none'}><span>{x.profile_pic.nickname.slice(0, 1)}</span><span>{x.profile_pic.nickname.slice(-1)}</span></p>
                      <img src={x.profile_pic.profile_pic} width={28} height={28} className={x.profile_pic.profile_pic == null ? 'd-none' : 'd-inline rounded-circle'} alt="" />
                      <div className="ms-2 d-flex">
                        <Link to={`/groupchat/privategroup/${x.group_id}`} className="text-secondary my-auto" style={{ textDecoration: 'none', fontSize: '13px' }}>{x.message}</Link>
                        <div className="d-flex gap-2 align-items-center ms-3">
                          <button className="btn btn-sm btn-transparent ms-2" onClick={() => {
                            deleteNotification(x.id)
                          }}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                      </div>
                    </div>

                  </li>
                )
              })
            )}
            {pushNotification && (
              pushNotification.map((z) => {
                return (
                  <li className="d-flex justify-content-between align-items-center px-1 py-3 border-bottom">
                    <div className="d-flex">
                      <p style={{ fontSize: '13px', height: '30px', width: '30px' }} className={z.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-primary text-white rounded-circle' : 'd-none'}><span>{z.user.nickname.slice(0, 1)}</span><span>{z.user.nickname.slice(-1)}</span></p>

                      <img src={z.profile_pic} width={28} height={28} className={z.profile_pic == null ? 'd-none' : 'd-inline rounded-circle'} alt="" />
                      <div className="ms-2">
                        <a className="" style={{ textDecoration: 'none', fontSize: '14px', color: '#37454D' }}>{z.notification}</a>
                        <p className="m-0" style={{ fontSize: '13px', color: '#AAB0B0' }}>{z.created_at}</p>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-transparent ms-2" onClick={() => {
                      deletepushNotification(z.id)
                    }}><i className="fa-solid fa-xmark"></i></button>
                  </li>
                )
              })
            )}

          </ul>
        </div>
      </div>

      {/* ----------------------------------------------Global Search-------------------------------------------------------- */}
      <Globalsearch />

      {/* -----------------------------------------------Offcanvases--------------------------------------------------------- */}
      <Offcanvases count={count} />

      {/* -----------------------------------------------Need help----------------------------------------------------------- */}
      <Need_help />
    </div>
  );
};

export default Navbar;
