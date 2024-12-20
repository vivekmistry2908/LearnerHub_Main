import React, { useState, useContext } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Mainsidebar from '../components/Mainsidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Preloader from './Preloader';
import { ipaddress } from '../App';
import { Context } from '../context/Context_provider';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import axios from 'axios';

const Profile = () => {

  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const userData = JSON.parse(sessionStorage.getItem('user'))
  const { user_id } = useParams()

  const [open, isOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  function open1() {
    isOpen(!open)
    if (open == true) {
      document.getElementById('acc-apan2').textContent = "-"
    }
    else {
      document.getElementById('acc-apan2').textContent = "+"
    }
  }
  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);
  const [additionalDetails, setAdditionalDetails] = useState({})

  const [formData, setFormData] = useState({
    user_id: "",
    university: "",
    program: "",
    semester: "",
  });

  const handleChange = (e) => {
    setFormData(prevData => {
      const updatedData = { ...prevData, [e.target.name]: e.target.value };
      return updatedData; // Return the updated state
    });
  };

  const [count, setCount] = useState(0)

  const [joinedUniversity, setJoinedUniversity] = useState([])
  const [universitydata, setUniversitydata] = useState([])
  const [semesterdata, setSemesterdata] = useState([])
  const [favouriteDocs, setFavouriteDocs] = useState([])
  const [joinedcourses, setjoinedcourses] = useState([])
  const [userdetails, setUserdetails] = useState({})

  const [isUniversityNamesVisible, setUniversityNamesVisible] = useState(false);
  const [datacount, setDatacount] = useState({})

  useEffect(() => {
    axiosInstance.get(`${ipaddress}/docAndLikesCount/${userData.user_id}/`)
      .then((r) => {
        // console.log("Documents and likes count",r.data)
        setDatacount(r.data)
        setLoading(false)
      })

    axiosInstance.get(`${ipaddress}/UserStudyInfo/${user_id}/`)
      .then((r) => {
        // console.log("User Data Fetched Successfully",r.data)
        setJoinedUniversity(r.data)
        setLoading(false)
      })
      .catch(() => {
        console.log("User Data Fetching Error")
      })
    axiosInstance.get(`${ipaddress}/FavouriteDocuments/${user_id}`)
      .then((p) => {
        setFavouriteDocs(p.data)
        // console.log("Favourite Documents Fetched Successfully :",p.data)
      })

    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user_id}/`)
      .then((r) => {
        // console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
        setLoading(false)
      })
      .catch(() => {
        console.log("User Details Fetching Error")
      })

    axiosInstance.get(`${ipaddress}/CoursesView/${userData.user_id}/`)
      .then((r) => {
        setjoinedcourses(r.data.joined_courses)
        setLoading(false)
      })
      .catch(() => {
        // console.log("Joined courses fetching error in Offcanvas");
      });
  }, [count, user_id])

  // ---------------------------------------------FETCH ALL UNIVERSITIES AND SEMESTERS FOR FORM-------------------------

  const fetchAllUniversities = () => {
    axiosInstance.get(`${ipaddress}/universities/`)
      .then((r) => {
        setUniversitydata(r.data)
        // console.log("University data : ",r.data)
      })
    axiosInstance.get(`${ipaddress}/Semesters/`)
      .then((p) => {
        setSemesterdata(p.data)
        // console.log("Semester data :",p.data)
      })
  }

  const resetForm = () => {
    setFormData({
      // user_id: userData.user_id,
      university: "",
      program: "",
      semester: "",
    });
    setSelectedUniversityName("")
  };
  // const[additionalDeatils,setAdditionalDetails]=useState({})
  const handleSubmit = (event) => {
    event.preventDefault()
    axiosInstance.post(`${ipaddress}/UserStudyInfo/${user_id}/`, formData)
      .then((r) => {
        // console.log("User Data Sent Successfully",r.data)
        setCount(count + 1)
        resetForm();
        // sessionStorage.setItem("additionaldetails",JSON.stringify(r.data))
      })
      .catch(() => {
        console.log("Data sent Error")
      })
  }

  // -----------------------------------------------EDIT DETAILS PART-----------------------------------------------------
  const [detailstoEdit, setDetailstoEdit] = useState({})
  const fetchEditdata = () => {
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user_id}/`)
      .then((r) => {
        // console.log("Edit Details Fetched",r.data)
        setEditedNickname(r.data.nickname)

      })
      .catch(() => {
        console.log("Edit Details Fetching Error")
      })
  }

  const [editedName, setEditedName] = useState("")
  const [editedLname, setEditedLname] = useState("")
  const [editedNickname, setEditedNickname] = useState("")

  const editedNameData = (value) => {
    setEditedName(value)
  }
  const editedLnameData = (value) => {
    setEditedLname(value)
  }
  const editedNicknameData = (value) => {
    setEditedNickname(value)
  }
  const [editImage, setEditImage] = useState(null)
  const updateProfileImage = (value) => {
    setEditImage(value)
  }

  const sendEditedDetails = (event) => {
    event.preventDefault()
    const editedDetails = new FormData()
    editedDetails.append('nickname', editedNickname)

    if (editImage) {
      editedDetails.append('profile_pic', editImage);
    }


    axios.patch(`${ipaddress}/UserUpdateDetails/${user_id}/`, editedDetails)
      .then((r) => {
        // console.log("Edit Details Sent",r.data)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("Edit Details Sending Error")
      })
  }

  // ----------------------------------------------------------ADD UNIVERSITY NAMES----------------------------------------
  const [selectedUniversityName, setSelectedUniversityName] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState(0);
  const [programs, setPrograms] = useState([])
  const adduniversityname = (universityName, event, universityId) => {
    event.preventDefault()
    // console.log("university selected nameeeeeeeee",universityName,universityId)
    setSelectedUniversityName(universityName);
    setSelectedUniversityId(universityId)

    setFormData((prevData) => ({
      ...prevData,
      user_id: userData.user_id,
      university: universityId,
    }));

    axiosInstance.get(`${ipaddress}/Programs/${universityId}`)
      .then((r) => {
        // console.log("Programs Successfullyyyyyy Fetched",r.data)
        setPrograms(r.data)
      })

    setUniversityNamesVisible(false)
  }

  // -----------------------------------------FETCH PROGRAMS BASED ON UNIVERSITY--------------------------------------------


  // --------------------------------------SEARCH UNIVERSITY NAME-----------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (value) => {
    setSelectedUniversityName(value);

    const results = universitydata.filter(item => item.university_name.toLowerCase().includes(value.toLowerCase()));
    setSearchResults(results);
  };

  // ------------------------------------------DELETE USER ACCOUNT-----------------------------------------------------------
  let navigate = useNavigate()
  const deleteAccount = () => {
    axiosInstance.delete(`${ipaddress}/DeleteAccount/${user_id}`)
      .then((r) => {
        sessionStorage.removeItem("user")
        navigate('/')
      })
  }

  // --------------------------------------------SELECTED TIME---------------------------------------------------------------
  const [selectedTime, setSelectedTime] = useState("")
  const [timecount, setTimecount] = useState(0)
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
  }

  const refresh_token = sessionStorage.getItem('refreshToken')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    const currenttime = new Date()

    const currentHours = currenttime.getHours()
    const currentMinutes = currenttime.getMinutes()
    const time = `${currentHours}:${currentMinutes}`
    // console.log(selectedTime, time)
    const difference = calculateTimeDifference(selectedTime, time);

    setTimeout(() => {
      axiosInstance.post(`${ipaddress}/User_Logout/${user_id}/`, {
        refresh_token: refresh_token
      })
        .then((r) => {
          sessionStorage.removeItem("user")
          // sessionStorage.removeItem("additionaldetails")
          console.log("Logout successfully : ", r.data)
          navigate('/')
        })
    }, difference)
  }

  function calculateTimeDifference(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const date1 = new Date(1970, 0, 1, hours1, minutes1);
    const date2 = new Date(1970, 0, 1, hours2, minutes2);

    const timeDifference = Math.abs(date2 - date1);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    return minutesDifference * 60 * 1000;
  }

  const [report, setreport] = useState("")
  const [image, setimage] = useState(null)

  const changeimage = (value) => {
    setimage(value)
  }

  const reportuser = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('attached_image', image)

    axiosInstance.post(`${ipaddress}/ReportUserView/${userData.user_id}/${user_id}/${report}/`, formdata)
      .then((r) => {
        console.log("User Reported Successfully")
        setreport("")
        toast.warn('Reported Successfully', {
          autoClose: 2000
        })
        console.log({
          'attached_image': image
        })
      })
      .catch((err) => {
        console.log("User Reported Error", err)
        console.log(image)
      })
  }



  return (
    <div>
      {loading ? (<Preloader />) : (
        <div className=''>
          <div className="d-flex">
            <Mainsidebar count={count}></Mainsidebar>
            <div onClick={() => {
              setcourse_visible(false)
              setgroup_visible(false)
              setstudylist_visible(false)
            }} className="w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
              <Navbar count={count}></Navbar>
              <div onClick={() => {
                setnavbar_dropdown_visible(false)
              }} className="container-fluid p-0">

                <div className={joinedUniversity.length > 0 ? "d-block row m-0 mx-auto" : "d-none"}>
                  <div className="profile1 row m-0 px-lg-5 pb-4 align-items-center rounded" style={{ backgroundColor: '#F3F0FF', height: '200px' }}>
                    <div className={`d-flex justify-content-end ${user_id === userData.user_id ? 'd-none' : ''}`}>
                      <span data-bs-toggle="modal" data-bs-target="#report_user" style={{ cursor: 'pointer', fontSize: '14px' }} className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                        <path d="M24.7908 26.5745L21.4855 23.2692H6.24995V21.2115C6.24995 20.6955 6.40019 20.2127 6.70067 19.7632C7.00114 19.3136 7.40539 18.9647 7.91342 18.7163C9.01117 18.189 10.1085 17.7876 11.2055 17.512C12.3024 17.2363 13.399 17.0817 14.4951 17.048H14.8918C15.028 17.048 15.1602 17.056 15.2884 17.0721L3.42542 5.20907L4.31726 4.31726L25.6826 25.6826L24.7908 26.5745ZM7.49995 22.0192H20.2355L16.6057 18.3894C16.3237 18.3573 16.056 18.3293 15.8028 18.3052C15.5496 18.2812 15.282 18.2692 14.9999 18.2692C13.8814 18.2692 12.7772 18.4018 11.6874 18.667C10.5977 18.9322 9.53841 19.3141 8.50957 19.8125C8.19386 19.9807 7.94667 20.1866 7.76798 20.4302C7.58929 20.6738 7.49995 20.9343 7.49995 21.2115V22.0192ZM22.6153 18.9807C22.7548 19.048 22.8653 19.1502 22.9471 19.2872C23.0288 19.4242 23.0721 19.5721 23.0769 19.7307L22.1105 18.7644C22.1971 18.798 22.2824 18.8317 22.3665 18.8653C22.4507 18.899 22.5336 18.9374 22.6153 18.9807ZM17.1009 13.5865L16.1947 12.6802C16.5937 12.4607 16.911 12.1534 17.1466 11.7584C17.3822 11.3633 17.4999 10.9375 17.4999 10.4807C17.4999 9.79323 17.2552 9.20469 16.7656 8.71511C16.276 8.22552 15.6874 7.98073 14.9999 7.98073C14.5432 7.98073 14.1173 8.09851 13.7223 8.33407C13.3273 8.56966 13.02 8.88697 12.8004 9.28601L11.8942 8.37976C12.2451 7.8477 12.693 7.43984 13.2379 7.1562C13.7828 6.87253 14.3701 6.7307 14.9999 6.7307C16.0384 6.7307 16.923 7.09608 17.6538 7.82686C18.3846 8.55763 18.7499 9.44225 18.7499 10.4807C18.7499 11.1105 18.6081 11.6979 18.3245 12.2427C18.0408 12.7876 17.633 13.2355 17.1009 13.5865Z" fill="#2A3941" />
                      </svg><span className='ms-1 text-decoration-underline'>Report User</span></span>
                    </div>

                    {userdetails && (
                      <div className="col-lg-3 d-flex align-items-center" style={{ height: '100px' }}>
                        <img src={userdetails.profile_pic} width={100} height={100} className={`rounded ${userdetails.profile_pic != null ? '' : 'd-none'}`} alt="" />
                        {userdetails.nickname != undefined ? (<span className={`${userdetails.profile_pic != null ? 'd-none' : ''} fs-1 bg-info text-white py-4 px-4 rounded`}>{userdetails.nickname.slice(0, 1)}{userdetails.nickname.slice(-1)}</span>) : (<></>)}
                        <div className="ms-2" style={{ height: '100%' }}>
                          <span className="fw-bold" style={{ fontSize: '18px' }}>{userdetails.nickname}</span><br />
                          {joinedUniversity.map((x) => {
                            return (
                              <div>
                                <span style={{ fontSize: '13px' }}>{x.university_id.university_name}</span>
                              </div>
                            )
                          })}
                          <span style={{ fontSize: '13px' }}>{userData.program_name}</span>

                          <a className={`mt-2 ${user_id === userData.user_id ? 'd-block ' : 'd-none'}`} style={{ fontSize: '14px', color: '#5D5FE3', cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#editModal" onClick={fetchEditdata}>Edit Profile</a>
                        </div>
                      </div>
                    )}
                    <div className="col-lg-3 col-sx-6 d-flex align-items-center border-end justify-content-center" style={{ letterSpacing: '2px', height: '40px' }}><svg xmlns="http://www.w3.org/2000/svg" width="29" height="26" viewBox="0 0 29 26" fill="none">
                      <path d="M21.4648 25.1669H6.82532V9.1252L15.9679 0.0947266L16.613 0.739784C16.7457 0.872516 16.8574 1.04266 16.9481 1.2502C17.0388 1.45772 17.0841 1.64842 17.0841 1.82231V2.05228L15.5922 9.1252H25.7276C26.3371 9.1252 26.8821 9.36545 27.3626 9.84595C27.8431 10.3264 28.0833 10.8714 28.0833 11.481V13.2758C28.0833 13.4086 28.0684 13.5535 28.0385 13.7105C28.0086 13.8676 27.9693 14.0125 27.9207 14.1452L23.9383 23.5852C23.7383 24.0339 23.4017 24.4097 22.9287 24.7126C22.4557 25.0154 21.9677 25.1669 21.4648 25.1669ZM8.28365 23.7085H21.4648C21.6704 23.7085 21.8807 23.6525 22.0957 23.5403C22.3108 23.4281 22.4744 23.2411 22.5865 22.9794L26.625 13.5002V11.481C26.625 11.2192 26.5409 11.0042 26.3726 10.8359C26.2043 10.6677 25.9893 10.5835 25.7276 10.5835H13.7804L15.4688 2.61877L8.28365 9.7478V23.7085ZM6.82532 9.1252V10.5835H1.83333V23.7085H6.82532V25.1669H0.375V9.1252H6.82532Z" fill="#FF845D" />
                    </svg>
                      <span className='m-2' style={{ fontSize: '14px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '3.5px' }}>{translate_value.dashboard.upvotes} : {datacount.total_documents_likes}</span>
                    </div>
                    <div className="col-lg-3 col-sx-6 d-flex align-items-center border-end justify-content-center" style={{ letterSpacing: '2px', height: '40px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#FF845D" className="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
                        <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                      </svg> <span className="ms-3" style={{ fontSize: '14px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '3.5px' }}>{translate_value.dashboard.uploads} : {datacount.documents_count}</span></div>
                    <div className="col-lg-3 d-flex align-items-center  justify-content-center" style={{ letterSpacing: '2px', height: '40px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                        <path d="M20.2482 13.9886V12.6312C21.0316 12.2348 21.8706 11.9376 22.7653 11.7394C23.6599 11.5412 24.5784 11.4421 25.5207 11.4421C26.0591 11.4421 26.5761 11.4767 27.0716 11.5459C27.567 11.615 28.0784 11.7132 28.6056 11.8403V13.1641C28.097 13.0014 27.6011 12.8888 27.1178 12.8261C26.6345 12.7635 26.1021 12.7322 25.5207 12.7322C24.5784 12.7322 23.6585 12.8383 22.7611 13.0505C21.8636 13.2627 21.026 13.5754 20.2482 13.9886ZM20.2482 21.9533V20.5399C20.9942 20.1435 21.8286 19.8462 22.7512 19.648C23.6739 19.4498 24.5971 19.3507 25.5207 19.3507C26.0591 19.3507 26.5761 19.3853 27.0716 19.4545C27.567 19.5237 28.0784 19.6218 28.6056 19.749V21.0727C28.097 20.9101 27.6011 20.7974 27.1178 20.7348C26.6345 20.6721 26.1021 20.6408 25.5207 20.6408C24.5784 20.6408 23.6585 20.7549 22.7611 20.983C21.8636 21.2111 21.026 21.5345 20.2482 21.9533ZM20.2482 17.999V16.5855C21.0316 16.1892 21.8706 15.8919 22.7653 15.6937C23.6599 15.4955 24.5784 15.3964 25.5207 15.3964C26.0591 15.3964 26.5761 15.431 27.0716 15.5002C27.567 15.5694 28.0784 15.6675 28.6056 15.7947V17.1184C28.097 16.9557 27.6011 16.8431 27.1178 16.7804C26.6345 16.7178 26.1021 16.6865 25.5207 16.6865C24.5784 16.6865 23.6585 16.8019 22.7611 17.0328C21.8636 17.2637 21.026 17.5858 20.2482 17.999ZM9.479 23.3892C10.7523 23.3892 11.9904 23.5355 13.1936 23.8281C14.3967 24.1207 15.5891 24.597 16.7707 25.257V10.9485C15.718 10.1969 14.5579 9.63322 13.2903 9.2574C12.0227 8.88161 10.7523 8.69372 9.479 8.69372C8.604 8.69372 7.8379 8.74606 7.18071 8.85075C6.52353 8.95546 5.79391 9.1499 4.99182 9.43408C4.76746 9.50887 4.60854 9.61637 4.51506 9.75659C4.42158 9.89683 4.37484 10.0511 4.37484 10.2194V23.3668C4.37484 23.6285 4.46832 23.8202 4.65527 23.9417C4.84226 24.0632 5.04792 24.0772 5.27226 23.9838C5.80511 23.8043 6.4207 23.6603 7.11902 23.5519C7.81734 23.4434 8.604 23.3892 9.479 23.3892ZM18.229 25.257C19.4106 24.597 20.603 24.1207 21.8061 23.8281C23.0092 23.5355 24.2474 23.3892 25.5207 23.3892C26.3957 23.3892 27.1823 23.4434 27.8807 23.5519C28.579 23.6603 29.1946 23.8043 29.7274 23.9838C29.9518 24.0772 30.1574 24.0632 30.3444 23.9417C30.5314 23.8202 30.6248 23.6285 30.6248 23.3668V10.2194C30.6248 10.0511 30.5781 9.90151 30.4846 9.77063C30.3911 9.63974 30.2322 9.52756 30.0079 9.43408C29.2058 9.1499 28.4761 8.95546 27.819 8.85075C27.1618 8.74606 26.3957 8.69372 25.5207 8.69372C24.2474 8.69372 22.977 8.88161 21.7094 9.2574C20.4418 9.63322 19.2816 10.1969 18.229 10.9485V25.257ZM17.4998 27.3716C16.3145 26.5602 15.0412 25.9366 13.6801 25.501C12.319 25.0654 10.9186 24.8476 9.479 24.8476C8.71992 24.8476 7.97439 24.9111 7.24243 25.0383C6.51045 25.1654 5.79764 25.3692 5.104 25.6497C4.5749 25.8609 4.07803 25.7973 3.6134 25.4589C3.1488 25.1205 2.9165 24.6531 2.9165 24.0567V9.96134C2.9165 9.60048 3.01138 9.2658 3.20113 8.95732C3.39091 8.64883 3.65688 8.43382 3.99902 8.31229C4.85533 7.93461 5.74623 7.6607 6.67171 7.49056C7.59719 7.32042 8.53296 7.23535 9.479 7.23535C10.9074 7.23535 12.3008 7.44101 13.6591 7.85233C15.0174 8.26366 16.2976 8.86195 17.4998 9.64722C18.702 8.86195 19.9823 8.26366 21.3406 7.85233C22.6989 7.44101 24.0923 7.23535 25.5207 7.23535C26.4667 7.23535 27.4025 7.32042 28.328 7.49056C29.2534 7.6607 30.1443 7.93461 31.0006 8.31229C31.3428 8.43382 31.6088 8.64883 31.7985 8.95732C31.9883 9.2658 32.0832 9.60048 32.0832 9.96134V24.0567C32.0832 24.6531 31.8322 25.1112 31.3302 25.4309C30.8282 25.7506 30.2939 25.8048 29.7274 25.5935C29.0525 25.3318 28.363 25.142 27.6591 25.0242C26.9552 24.9065 26.2423 24.8476 25.5207 24.8476C24.081 24.8476 22.6807 25.0654 21.3195 25.501C19.9584 25.9366 18.6852 26.5602 17.4998 27.3716Z" fill="#FF845D" />
                      </svg>
                      <span className='ms-2' style={{ fontSize: '14px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '3.5px' }}>{translate_value.dashboard.courses} : {joinedcourses.length}</span></div>

                  </div>
                </div>
                {/* ------------------------------------------profile card-------------------------------------------------------- */}

                <div className={joinedUniversity.length > 0 ? "d-block row m-0 pt-3 mx-auto" : "d-none"}>
                  <div className="col-12 col-md-10 mb-3 mb-sm-0 mx-auto d-lg-none">
                    <div className="card shadow profile-card">
                      <div className="card-body">
                        <div className="row m-0">
                          <div className="col-lg-5 col-md-12 text-center pt-3">
                            <img src={userdetails.profile_pic} width={100} height={100} className={`rounded ${userdetails.profile_pic != null ? '' : 'd-none'}`} alt="" />
                            {userdetails.nickname != undefined ? (<span className={`${userdetails.profile_pic != null ? 'd-none' : ''} fs-1 bg-info text-white py-4 px-4 rounded`}>{userdetails.nickname.slice(0, 1)}{userdetails.nickname.slice(-1)}</span>) : (<></>)}
                          </div>
                          <div className="col-lg-7 col-md-12 px-4 mt-3">
                            <h5 className="card-title mt-3 mt-sm-0">{userdetails.first_name} <span>{userdetails.last_name}</span></h5>
                            {joinedUniversity.map((x) => {
                              return (
                                <div className="row">
                                  <div className="col-12">
                                    <span className=''><i className="fa-solid fa-building-columns  me-2"></i>{x.university_id.university_name}</span>
                                  </div>
                                  <div className="col-12 mt-3"><span className=''>
                                    <i className="fa-solid fa-envelope me-2"></i>{userdetails.email}</span></div>
                                </div>
                              )
                            })}
                            <div className="mt-3 d-flex justify-content-between">
                              <div className={`d-flex justify-content-end ${user_id === userData.user_id ? 'd-none' : ''}`}>
                                <span data-bs-toggle="modal" data-bs-target="#report_user" style={{ cursor: 'pointer', fontSize: '14px', color: '#5d5fe3' }} className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                                  <path d="M24.7908 26.5745L21.4855 23.2692H6.24995V21.2115C6.24995 20.6955 6.40019 20.2127 6.70067 19.7632C7.00114 19.3136 7.40539 18.9647 7.91342 18.7163C9.01117 18.189 10.1085 17.7876 11.2055 17.512C12.3024 17.2363 13.399 17.0817 14.4951 17.048H14.8918C15.028 17.048 15.1602 17.056 15.2884 17.0721L3.42542 5.20907L4.31726 4.31726L25.6826 25.6826L24.7908 26.5745ZM7.49995 22.0192H20.2355L16.6057 18.3894C16.3237 18.3573 16.056 18.3293 15.8028 18.3052C15.5496 18.2812 15.282 18.2692 14.9999 18.2692C13.8814 18.2692 12.7772 18.4018 11.6874 18.667C10.5977 18.9322 9.53841 19.3141 8.50957 19.8125C8.19386 19.9807 7.94667 20.1866 7.76798 20.4302C7.58929 20.6738 7.49995 20.9343 7.49995 21.2115V22.0192ZM22.6153 18.9807C22.7548 19.048 22.8653 19.1502 22.9471 19.2872C23.0288 19.4242 23.0721 19.5721 23.0769 19.7307L22.1105 18.7644C22.1971 18.798 22.2824 18.8317 22.3665 18.8653C22.4507 18.899 22.5336 18.9374 22.6153 18.9807ZM17.1009 13.5865L16.1947 12.6802C16.5937 12.4607 16.911 12.1534 17.1466 11.7584C17.3822 11.3633 17.4999 10.9375 17.4999 10.4807C17.4999 9.79323 17.2552 9.20469 16.7656 8.71511C16.276 8.22552 15.6874 7.98073 14.9999 7.98073C14.5432 7.98073 14.1173 8.09851 13.7223 8.33407C13.3273 8.56966 13.02 8.88697 12.8004 9.28601L11.8942 8.37976C12.2451 7.8477 12.693 7.43984 13.2379 7.1562C13.7828 6.87253 14.3701 6.7307 14.9999 6.7307C16.0384 6.7307 16.923 7.09608 17.6538 7.82686C18.3846 8.55763 18.7499 9.44225 18.7499 10.4807C18.7499 11.1105 18.6081 11.6979 18.3245 12.2427C18.0408 12.7876 17.633 13.2355 17.1009 13.5865Z" fill="#2A3941" />
                                </svg><span className='ms-1 text-decoration-underline'>Report User</span></span>
                              </div>
                              <div>
                                <a className='ms-3' style={{ color: '#5D5FE3' }} data-bs-toggle="modal" data-bs-target="#editModal" onClick={fetchEditdata}>Edit Profile</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row m-0 bg-light justify-content-evenly mt-2 mt-md-3">
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex flex-column align-items-center bg-white py-3 rounded shadow-sm">
                    <img src={require('../img/images_icons/profile-img1.png')} width={64} alt="" />
                    <Link to={`/userfiles/${user_id}/${'uploaded_documents'}`} className='mt-3' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.uploaded_doc} ({userdetails.documents_count})</Link>
                  </div>
                  <div className={`col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs ${user_id === userData.user_id ? 'd-flex flex-column align-items-center' : 'd-none'} bg-white py-3 rounded shadow-sm`}>
                    <img src={require('../img/images_icons/profile-img2.png')} width={64} alt="" />
                    <Link to={`/userfiles/${user_id}/${'followed_documents'}`} className='mt-3' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.followed_doc}</Link>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex flex-column align-items-center bg-white py-3 rounded shadow-sm">
                    <img src={require('../img/images_icons/profile-img3.png')} width={64} alt="" />
                    <Link to={`/userfiles/${user_id}/${'uploaded_flashcards'}`} className='mt-3' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.upload_flashcard} ({userdetails.flashset_count})</Link>
                  </div>
                  <div className={`col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs ${user_id === userData.user_id ? 'd-flex flex-column align-items-center' : 'd-none'} bg-white py-3 rounded shadow-sm`}>
                    <img src={require('../img/images_icons/profile-img4.png')} width={64} alt="" />
                    <Link to={`/userfiles/${user_id}/${'followed_flashcards'}`} className='mt-3' style={{ color: '#5D5FE3', fontSize: '18px', letterSpacing: '0.36px', fontWeight: 450, lineHeight: 'normal' }}>{translate_value.profile.followed_flashcard}</Link>
                  </div>
                </div>

                <div className={`row m-0 bg-light justify-content-evenly mt-2 mt-md-3 ${user_id === userData.user_id ? '' : 'd-none'}`}>
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                      <path d="M14.4423 29.106L15.6923 20.5002H10.3798L19.7308 7.01465H20.3077L19.0817 16.7502H25.3317L15.0192 29.106H14.4423Z" fill="white" />
                    </svg>
                    <p className='my-auto ms-3 text-secondary' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                      <path d="M14.4423 29.106L15.6923 20.5002H10.3798L19.7308 7.01465H20.3077L19.0817 16.7502H25.3317L15.0192 29.106H14.4423Z" fill="white" />
                    </svg>
                    <p className='my-auto ms-3 text-secondary' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                      <path d="M14.4423 29.106L15.6923 20.5002H10.3798L19.7308 7.01465H20.3077L19.0817 16.7502H25.3317L15.0192 29.106H14.4423Z" fill="white" />
                    </svg>
                    <p className='my-auto ms-3 text-secondary' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                  </div>
                  <div className="col-lg-2 col-md-6 mb-2 mb-lg-0 profile-divs d-flex align-items-center justify-content-center bg-white py-2 rounded shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                      <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5" />
                      <path d="M14.4423 29.106L15.6923 20.5002H10.3798L19.7308 7.01465H20.3077L19.0817 16.7502H25.3317L15.0192 29.106H14.4423Z" fill="white" />
                    </svg>
                    <p className='my-auto ms-3 text-secondary' style={{ fontSize: '15px' }}>0 {translate_value.profile.super_coins}</p>
                  </div>
                </div>



              </div>
            </div>
          </div>

          {/* UNIVERSITY MODAL FORM */}
          <div
            className="modal fade"
            id="add_details"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-4 pt-3'>
                  <h5
                    className=" fw-bold text-center text-primary"
                    id="staticBackdropLabel"
                  >
                    Add Your Details
                  </h5>
                  <button data-bs-dismiss="modal" onClick={() => {
                    setUniversityNamesVisible(false)
                  }} className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5"></i></button>

                </div>
                <div className="modal-body">
                  <form action="" onSubmit={handleSubmit} className="p-2 px-4">
                    <div>
                      <input
                        type="text"
                        className='form-control py-3 mb-0'
                        id='universitynamefield'
                        placeholder='Select the University'
                        onClick={() => setUniversityNamesVisible(true)}
                        // onFocus={() => setUniversityNamesVisible(true)}
                        // onBlur={() => setUniversityNamesVisible(false)}
                        onChange={(e) => {
                          handleSearch(e.target.value)
                        }}
                        value={selectedUniversityName}
                      />
                      {/* ------------------------------------------------SEARCH UNIVERSITY-------------------------------------------------- */}
                      <div id='universitynames' className={`mt-0 border bg-light ${isUniversityNamesVisible ? 'd-block' : 'd-none'}`} style={{ overflowY: 'scroll' }}>
                        <div className='px-2 m-0 bg-info-subtle' style={{ listStyleType: 'none' }}>
                          {searchResults && (
                            searchResults.map((university, index) => (
                              <li key={index}><a href='' className='text-decoration-none text-dark ' style={{ fontSize: '14px' }} onClick={(event) => {
                                adduniversityname(university.university_name, event, university.university_id)
                              }}>{university.university_name}</a></li>
                            ))
                          )}
                        </div>

                        <ul className='px-2 m-0' style={{ listStyleType: 'none' }}>
                          {universitydata.map((x, index) => {
                            const isMatch = searchResults.some(y => y.university_name === x.university_name);
                            return (
                              !isMatch && (
                                <li key={index}>
                                  <a href='' className='text-decoration-none text-dark ' style={{ fontSize: '14px' }} onClick={(event) => {
                                    adduniversityname(x.university_name, event, x.university_id)
                                  }}>{x.university_name}</a>
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div>

                    </div>
                    <div className="row mt-3" id='programs'>
                      <div className="col-12">
                        <select
                          name="program"
                          className="form-select form-select-md px-2 py-3 mb-3 shadow-none"
                          aria-label="Large select example"
                          onChange={handleChange}
                          value={formData.program}
                        >
                          <option selected>Select the Program</option>
                          {programs.map((x, index) => {
                            return (
                              <option key={index} value={x.pid}>{x.program_name}</option>
                            )
                          })}
                        </select>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-4">
                          <select
                            name="semester"
                            className="form-select form-select-md px-2 py-3 mb-3 shadow-none"
                            aria-label="Large select example"
                            onChange={handleChange}
                            value={formData.semester}
                          >
                            <option selected>Select Semester</option>
                            {semesterdata.map((x, index) => {
                              return (
                                <option key={index} value={x.semester_id}>{x.sem_name}</option>
                              )
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <button
                        className="btn signup-btn btn-md py-2 w-100 text-white fw-medium"
                        type="submit" data-bs-dismiss="modal"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT USER DETAILS MODAL FORM */}
          <div
            className="modal fade"
            id="editModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="d-flex p-2 justify-content-between align-items-center px-1 px-md-3">
                  <h6
                    className=" fw-bold text-center m-0" style={{ color: '#5d5fe3' }}
                    id="staticBackdropLabel"
                  >
                    Edit Your Details
                  </h6>
                  <button
                    type="button"
                    className="ms-auto btn btn-sm border-0 d-flex align-items-center"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg></button>
                </div>

                <div className="modal-body">
                  <form action="" encType="multipart/form-data" onSubmit={sendEditedDetails} className="p-2 px-4">
                    <div className="row">
                      <div className="col-12 mt-3">
                        <label htmlFor="">Nickname</label>
                        <input type="text" className='form-control mt-2 shadow-none border-secondary-subtle' maxLength={6} value={editedNickname} onChange={(e) => {
                          setEditedNickname(e.target.value)
                        }} />
                      </div>
                      <div className="col-12 mt-3 text-center">
                        <input type="file" accept="image/*" name='file' id='file' className='form-control' onChange={(e) => {
                          var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
                          if (fileSize > 0.5) {
                            alert("File size must be less than 500 KB.");
                          } else {
                            updateProfileImage(e.target.files[0])
                          }
                        }} />
                        <label htmlFor="file" className='bg-info text-white py-1 px-4 rounded-pill '><i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload Profile Image</label>
                        <span className='d-block text-success mt-1'>{editImage && editImage.name}</span>
                      </div>

                    </div>
                    <div className="text-center mt-3">
                      <button
                        className="btn signup-btn btn-md py-2 w-100 text-white fw-medium"
                        type="submit" data-bs-dismiss="modal"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* SET BED TIME MODAL */}
          <div
            className="modal fade"
            id="set_bed_time"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-3 pt-3'>
                  <h5
                    className=" fw-bold text-center text-primary"
                    id="staticBackdropLabel"
                  >
                    Set Your Bed Time
                  </h5>
                  <button data-bs-dismiss="modal" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5"></i></button>

                </div>
                <div className="modal-body">
                  <form onSubmit={handleFormSubmit} className=''>
                    {/* <label className=''>
         Select Time:
       </label> */}
                    <input type="time" className='form-control' value={selectedTime} onChange={handleTimeChange} />
                    <div className='text-end mt-3'>
                      <button type="submit" className='btn btn-sm btn-danger'>Set Time</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* REPORT USER MODAL */}
          <div
            className="modal fade"
            id="report_user"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className='d-flex justify-content-between px-3 pt-3'>
                  <h6
                    className=" fw-medium text-center text-primary"
                    id="staticBackdropLabel"
                  >
                    Report the User
                  </h6>
                  <button data-bs-dismiss="modal" className='bg-transparent border-0'><i className="fa-solid fa-circle-xmark fs-5"></i></button>

                </div>
                <div className="modal-body">
                  <form onSubmit={reportuser} className=''>
                    {/* <label className=''>
         Select Time:
       </label> */}
                    <textarea type="text" className='form-control' value={report} onChange={(e) => {
                      setreport(e.target.value)
                    }} />

                    <div className='text-center mt-4'>
                      <label htmlFor="file3" className='text-white rounded-pill py-1 px-3' style={{ backgroundColor: '#5d5fe3' }}>Upload the  Report Screenshot</label>
                      <input type="file" onChange={(e) => {
                        var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
                        if (fileSize > 0.5) {
                          alert("File size must be less than 500 KB.");
                        } else {
                          changeimage(e.target.files[0])
                        }
                      }} id='file3' accept="image/*" name='file1' />

                      <p className='mt-1'>{image != null && image.name}</p>
                    </div>
                    <div className='text-end mt-3'>
                      <button data-bs-dismiss="modal" type="submit" className='btn btn-sm btn-danger px-3 rounded-pill'>Send</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile