import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Mainsidebar from '../components/Mainsidebar';
import { Link } from 'react-router-dom';
import Navpath from './Navpath';
import Preloader from './Preloader';
import { ipaddress } from '../App';
import data from './translate';
import { Context } from '../context/Context_provider';
import Backtotop from './Backtotop';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { ModalFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';
const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-right' };
const Courses = () => {
  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context);

  const university = JSON.parse(sessionStorage.getItem('user'));
  const [loading, setLoading] = useState(true);
  const [isSubject, setSubject] = useState(false);
  const [open, isOpen] = useState(true);
  function open1() {
    isOpen(!open);
    if (open == true) {
      document.getElementById('acc-apan2').textContent = "-";
    } else {
      document.getElementById('acc-apan2').textContent = "+";
    }
  }

  const [courses, setCourses] = useState([]);
  const [joinedcourses, setJoinedCourses] = useState([]);
  let [count, setCount] = useState(0);

  useEffect(() => {
    axiosInstance.get(`${ipaddress}/CoursesView/${university.user_id}/`)
      .then((r) => {
        setCourses(r.data.courses.reverse());
        setJoinedCourses(r.data.joined_courses.reverse());
        setLoading(false);
      })
      .catch(() => {
        // console.log("All Courses fetching error")
      });
  }, [count]);

  const [userData, setUserdata] = useState({});

  useEffect(() => {
    setUserdata(JSON.parse(sessionStorage.getItem('user')));
    // console.log(userData)
  }, []);

  const joinCourse = (course_id) => {
    axiosInstance.post(`${ipaddress}/join-course/${userData.user_id}/${course_id}/`)
      .then((r) => {
        setCount(count + 1);
        // window.location.reload()
        toast.success('Successfully Joined', {
          autoClose: 2000,
        });
        setSearchedSubjects([]);
        setSearchvalue("");
      })
      .catch(() => {
        // console.log("Course Joining error")
      });
  }

  // -------------------------------------Search and take the subjects------------------------------------------------
  const [SearchedSubjects, setSearchedSubjects] = useState([]);
  const [searchvalue, setSearchvalue] = useState("");

  const searchSubject = (value) => {
    setSearchvalue(value);
    if (value.length > 0) {
      axiosInstance.get(`${ipaddress}/CoursesSearch/${university.user_id}/${value}/`)
        .then((r) => {
          // console.log("Searched Subjects Found", r.data)
          setSearchedSubjects(r.data);
        });
    } else {
      setSearchedSubjects([]);
    }
  }

  // ----------------------------------------------Create the New Subject functionality------------------------------------------
  const [subjectName, setSubjectName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsVisible, setTermsVisible] = useState(false);

  const createSubject = () => {
    if (!subjectName) {
      toast.error('Subject Name is required', toastConfig);
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed.', toastConfig);
      return;
    }
    axiosInstance.post(`${ipaddress}/RequestingForCourseAddition/${university.user_id}/`, { 'course_name': subjectName })
      .then((r) => {
        // console.log("Subject successfully created", r.data)
        setCount(count + 1);
        setSubjectName("");
        setTermsAccepted(false);
        setSubject(false);
        toast.success("Request Successfully Sent to Admin For Adding Module", toastConfig);
      });

  }
  return (
    <div>
      {loading ? (<Preloader />) : (
        <div>
          <div className="d-flex animate__animated animate__fadeIn animate__delay">
            <Mainsidebar count={count} activevalue={"course"}></Mainsidebar>
            <div className='ps-0 ps-lg-4 w-100 pt-5 mt-5 bg-light' onClick={() => {
              setcourse_visible(false);
              setgroup_visible(false);
              setstudylist_visible(false);
            }}>
              <Navbar count={count}></Navbar>
              <div onClick={() => {
                setnavbar_dropdown_visible(false);
              }}>
                <div className='container mt-2 px-3 px-lg-5 pb-2'>
                  <div className='d-flex justify-content-between'>

                    <p className='page6-head m-o'>Search<span className='page6-month'> & Join {translate_value.common_words.subjects}</span></p>

                    {/* ******************************Start************---courses page add button  by Bteam  *****
                    <button className='btn btn-sm border border-primary-subtle px-3 py-2 text-decoration-none ms-auto d-flex align-items-center' data-bs-toggle="modal" data-bs-target="#AddsubjectModal" style={{ height: '44px', color: '#8587EA', fontSize: '14px' }}>
                      <span className='fa-solid fa-plus me-2 page6-month' style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#7A57D1', marginLeft: '8px' }}>Create  {translate_value.common_words.subjects}</span>
                    </button>
   {/* ******************************End****************---courses page add button  by Bteam  */}

                    {/* ******************************Start************---courses page add button by VA ***************************/}


                    <button
                      className='btn btn-sm border border-primary-subtle text-decoration-none ms-auto d-flex align-items-center'
                      //data-bs-toggle="modal"
                      // data-bs-target="#AddsubjectModal"
                      onClick={() => setSubject(true)}
                      style={{
                        padding: '0.5vw 1vw', // Dynamic padding based on viewport width
                        color: '#8587EA',
                        height: '64px',
                        fontSize: 'calc(10px + 0.5vw)', // Responsive font size
                        backgroundColor: '#FFFFFF',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: 'none',
                        transform: 'scale(1)',
                        width: 'auto', // Allows the button to adjust its width based on content and padding
                        maxWidth: '100%', // Ensures button doesn't overflow its container
                        display: 'block', // Use block to fill the width of the parent container
                        margin: '0px', // Center the button horizontally
                        textAlign: 'center', // Center the text inside the button
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.backgroundColor = '#EAEAFF';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span
                        className='fa-solid fa-plus me-2 page6-month'
                        style={{
                          fontSize: 'calc(12px + 1vw)', // Larger, responsive font size for icon
                          verticalAlign: 'middle',
                          color: '#7A57D1',
                          marginLeft: '8px'
                        }}
                      >
                        Create  {translate_value.common_words.subjects}
                      </span>
                    </button>




                    {/* ******************************End************---courses page add button by VA ***************************/}




                  </div>
                  <div className='mt-3'>
                    <div className='d-flex flex-wrap' style={{ gap: '10px' }}>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-users' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Search Suitable Subject Groups</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-clone' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Share and Discover Study Gem</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-file-alt' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Share Documents and Flashcards</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-comments' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Engage in Online Discussions</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-user-friends' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Connect with Study Buddies</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className='fas fa-bell' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Stay Updated with Group Activities</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-question-circle" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Ask Anything, Learn Everything</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-handshake" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Participate in Conversations</span>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-search" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                        <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Search suitable Groups</span>
                      </div>
                    </div>
                  </div>

                  <style jsx>{`
                    .card-option:hover {
                      background-color: #e2e6ea;
                    }

                    .gradient-text {
                      background: linear-gradient(to right, #6f42c1, #b362f9);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
                    }
                  `}</style>
                  {/* ------------------------------------------------Older info- not needed anymore ------------------------------------------- *
                  <span className='' style={{ fontSize: '16px', letterSpacing: '0.32px', lineHeight: '22px', fontWeight: 450 }}>Here are the popular subjects from your university.</span><br />
                  <span className='' style={{ fontSize: '16px', letterSpacing: '0.32px', lineHeight: '22px', fontWeight: 450 }}>Join & Stay Updated to receive recommendations and alerts for new documents.</span>
               
               {/* ------------------------------------------------Older info-------------------------------------------- */}
                </div>
                <div className="container px-lg-5 mt-4">
                  <div className="input-group mb-1 bg-white py-2 rounded shadow-sm" style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9771 15.5008C11.3001 15.7439 10.6196 15.8654 9.93586 15.8654C8.26746 15.8654 6.85544 15.2879 5.6998 14.1329C4.54414 12.9778 3.96631 11.5666 3.96631 9.89908C3.96631 8.23158 4.54382 6.81924 5.69883 5.66205C6.85385 4.50486 8.26511 3.92627 9.93261 3.92627C11.6001 3.92627 13.0125 4.50409 14.1696 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0336 20.2564L20.2965 20.9936ZM9.93586 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93586 4.96794C8.55366 4.96794 7.38679 5.4437 6.43527 6.39523C5.48376 7.34676 5.008 8.51362 5.008 9.89583C5.008 11.278 5.48376 12.4449 6.43527 13.3964C7.38679 14.348 8.55366 14.8237 9.93586 14.8237Z" fill="#8E9696" />
                      </svg>
                    </span>
                    <input type="text" onChange={(e) => {
                      searchSubject(e.target.value);
                    }} className="form-control border-0 bg-transparent ps-1" value={searchvalue} placeholder="Search subject" aria-label="Username" aria-describedby="basic-addon1" />
                  </div>
                </div>
                <div className="container px-2 px-lg-5 mt-5">
                  <ul className={`view-doc ps-0 mt-5 pb-3 ${SearchedSubjects.length > 0 ? 'd-block' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                    {SearchedSubjects.map((x, index) => {
                      return (
                        <li className='mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white' key={index}>
                          <div className='d-flex flex-column'>
                            <a href='#' className='d-flex align-items-center text-decoration-none text-dark'>{x.course_name}</a>
                            <div className='mt-2'>
                              <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "15px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bank2" viewBox="0 0 16 16">
                                  <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" />
                                </svg>
                                <span className='ms-2'>{x.university_name.university_name}</span>
                              </span>
                            </div>
                          </div>
                          <button onClick={() => {
                            joinCourse(x.course_id);
                          }} className='btn border border-primary-subtle px-3 px-lg-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center join-btn' style={{ height: '44px', color: '#8587EA' }}>{translate_value.common_words.join}</button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* --------------------------------------------------List of joined subjects section----------------------------------- */}
                  <ul className={`view-doc ps-0 ${joinedcourses.length > 0 ? 'd-block' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                    {/* <p className='page6-head m-o' style={{ fontSize: '20px', fontWeight: 500, lineHeight: 'normal', letterSpacing: '0.4px' }}>{translate_value.common_words.joined_courses}</p>*/}
                    <h5 className='page6-head m-0'><span className='page6-month'>{translate_value.common_words.joined_courses}</span></h5>
                    {joinedcourses.map((x, index) => {
                      return (
                        <li className='mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white' key={index}>
                          <div className='d-flex flex-column'>
                            <Link to={`/subjects/${x.course_id}/${x.course_name}`} className='d-flex align-items-center text-decoration-none text-dark' style={{ fontSize: '16px', fontWeight: 450 }}>{x.course_name}</Link>
                            <div className='mt-2 d-flex align-items-center'>
                              <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M2.70435 19.391V17.6762C2.70435 17.1928 2.82955 16.7771 3.07994 16.4292C3.33034 16.0813 3.66685 15.8033 4.08945 15.5951C4.99297 15.1649 5.89011 14.822 6.78086 14.5662C7.67162 14.3105 8.74334 14.1826 9.99601 14.1826C11.2487 14.1826 12.3204 14.3105 13.2112 14.5662C14.1019 14.822 14.9991 15.1649 15.9026 15.5951C16.3252 15.8033 16.6617 16.0813 16.9121 16.4292C17.1625 16.7771 17.2877 17.1928 17.2877 17.6762V19.391H2.70435ZM19.371 19.391V17.6281C19.371 17.0245 19.2488 16.4547 19.0045 15.9188C18.7601 15.3828 18.4136 14.9229 17.9648 14.5392C18.4763 14.6433 18.969 14.7879 19.4431 14.9729C19.9172 15.1578 20.386 15.3658 20.8494 15.5969C21.3008 15.8239 21.6547 16.1144 21.9111 16.4685C22.1675 16.8225 22.2957 17.2091 22.2957 17.6281V19.391H19.371ZM9.99601 11.8589C9.13664 11.8589 8.40096 11.5529 7.78898 10.9409C7.177 10.329 6.87101 9.59329 6.87101 8.73391C6.87101 7.87452 7.177 7.13883 7.78898 6.52686C8.40096 5.91488 9.13664 5.60889 9.99601 5.60889C10.8554 5.60889 11.5911 5.91488 12.203 6.52686C12.815 7.13883 13.121 7.87452 13.121 8.73391C13.121 9.59329 12.815 10.329 12.203 10.9409C11.5911 11.5529 10.8554 11.8589 9.99601 11.8589ZM17.5681 8.73391C17.5681 9.59329 17.2622 10.329 16.6502 10.9409C16.0382 11.5529 15.3025 11.8589 14.4431 11.8589C14.3991 11.8589 14.343 11.8539 14.2749 11.8439C14.2068 11.8339 14.1507 11.8229 14.1066 11.8108C14.4594 11.3786 14.7306 10.8992 14.9201 10.3724C15.1096 9.84569 15.2043 9.29869 15.2043 8.73141C15.2043 8.16416 15.1052 7.62212 14.9069 7.10529C14.7086 6.58847 14.4418 6.10569 14.1066 5.65696C14.1627 5.63694 14.2188 5.62392 14.2749 5.6179C14.331 5.61189 14.3871 5.60889 14.4431 5.60889C15.3025 5.60889 16.0382 5.91488 16.6502 6.52686C17.2622 7.13883 17.5681 7.87452 17.5681 8.73391ZM3.74601 18.3493H16.246V17.6762C16.246 17.4318 16.1849 17.2181 16.0627 17.0352C15.9405 16.8522 15.7212 16.6773 15.4047 16.5103C14.6274 16.095 13.8081 15.7768 12.9467 15.5558C12.0854 15.3348 11.1018 15.2243 9.99601 15.2243C8.89025 15.2243 7.90667 15.3348 7.04528 15.5558C6.18391 15.7768 5.36461 16.095 4.58737 16.5103C4.27086 16.6773 4.0515 16.8522 3.92929 17.0352C3.80711 17.2181 3.74601 17.4318 3.74601 17.6762V18.3493ZM9.99601 10.8172C10.5689 10.8172 11.0594 10.6133 11.4674 10.2053C11.8754 9.79728 12.0793 9.30683 12.0793 8.73391C12.0793 8.161 11.8754 7.67055 11.4674 7.26256C11.0594 6.85457 10.5689 6.65058 9.99601 6.65058C9.4231 6.65058 8.93264 6.85457 8.52466 7.26256C8.11667 7.67055 7.91268 8.161 7.91268 8.73391C7.91268 9.30683 8.11667 9.79728 8.52466 10.2053C8.93264 10.6133 9.4231 10.8172 9.99601 10.8172Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'>{x.students_count}</span>
                                <span className='d-none d-lg-inline ms-1'> Students</span>
                              </span>
                              <span className='mt-1 text-secondary ms-2 ms-lg-4 d-flex align-items-center' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M8.85421 18.2292H16.1459V17.1875H8.85421V18.2292ZM8.85421 14.0625H16.1459V13.0208H8.85421V14.0625ZM6.89106 21.875C6.41163 21.875 6.01133 21.7144 5.69014 21.3932C5.36896 21.072 5.20837 20.6717 5.20837 20.1923V4.80768C5.20837 4.32825 5.36896 3.92795 5.69014 3.60677C6.01133 3.28559 6.41163 3.125 6.89106 3.125H15.1042L19.7917 7.8125V20.1923C19.7917 20.6717 19.6311 21.072 19.3099 21.3932C18.9888 21.7144 18.5885 21.875 18.109 21.875H6.89106ZM14.5834 8.33333V4.16667H6.89106C6.73081 4.16667 6.58391 4.23344 6.45035 4.36698C6.31681 4.50054 6.25004 4.64744 6.25004 4.80768V20.1923C6.25004 20.3526 6.31681 20.4995 6.45035 20.633C6.58391 20.7666 6.73081 20.8333 6.89106 20.8333H18.109C18.2693 20.8333 18.4162 20.7666 18.5497 20.633C18.6833 20.4995 18.75 20.3526 18.75 20.1923V8.33333H14.5834Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'>{x.documents_count} <span className='d-none d-lg-inline'>Documents</span></span>
                              </span>
                              <span className='mt-1 text-secondary ms-2 ms-lg-4 d-flex align-items-center' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M8.3333 20.1923V10.01C8.3333 9.54389 8.49823 9.14793 8.82809 8.82208C9.15795 8.49623 9.55592 8.3333 10.022 8.3333H20.1923C20.6584 8.3333 21.0553 8.49722 21.3832 8.82507C21.711 9.15294 21.875 9.54991 21.875 10.016V17.2676L17.2676 21.875H10.016C9.54991 21.875 9.15294 21.711 8.82507 21.3832C8.49722 21.0553 8.3333 20.6584 8.3333 20.1923ZM3.15101 6.87096C3.06019 6.40488 3.14966 5.98521 3.41942 5.61195C3.6892 5.23868 4.05712 5.00664 4.5232 4.91583L14.5432 3.15101C15.0093 3.06019 15.429 3.14966 15.8023 3.41942C16.1755 3.6892 16.4076 4.05712 16.4984 4.5232L16.7187 5.84932H15.665L15.4427 4.60734C15.416 4.46043 15.3358 4.34358 15.2023 4.25679C15.0687 4.16998 14.9218 4.13993 14.7616 4.16663L4.70749 5.9515C4.52053 5.97821 4.38031 6.065 4.28682 6.2119C4.19334 6.3588 4.15996 6.52574 4.18666 6.7127L5.84932 16.1037V18.121C5.61161 18.0048 5.40962 17.8398 5.24335 17.6262C5.07709 17.4125 4.96791 17.1675 4.91583 16.891L3.15101 6.87096ZM9.37497 10.016V20.1923C9.37497 20.3792 9.43506 20.5328 9.55525 20.653C9.67545 20.7732 9.82902 20.8333 10.016 20.8333H16.6666V16.6666H20.8333V10.016C20.8333 9.82902 20.7732 9.67544 20.653 9.55525C20.5328 9.43506 20.3792 9.37497 20.1923 9.37497H10.016C9.82902 9.37497 9.67545 9.43506 9.55525 9.55525C9.43506 9.67544 9.37497 9.82902 9.37497 10.016Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'> {x.flashsets_count} <span className='d-none d-lg-inline'>Flashcards</span></span>
                              </span>
                            </div>
                          </div>
                          <button disabled className='btn px-2 px-md-4 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{ height: '44px', color: '#fff', backgroundColor: '#5D5FE3', fontSize: '18px', border: '1px solid #5D5FE3' }}>{translate_value.common_words.joined}</button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* ---------------------------------------------List of available subjects section------------------------------------- */}
                  <ul className={`view-doc ps-0 mt-5 ${courses.length > 0 ? 'd-block' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                    <h5 className='page6-head m-0'><span className='page6-month'>{translate_value.common_words.recommended_courses}</span></h5>
                    {courses.map((x, index) => {
                      return (
                        <li className='mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white' key={index}>
                          <div className='d-flex flex-column'>
                            <a href='#' className='d-flex align-items-center text-decoration-none text-dark' style={{ fontWeight: 450 }}>{x.course_name}</a>
                            <div className='mt-2 d-flex'>
                              <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M2.70435 19.391V17.6762C2.70435 17.1928 2.82955 16.7771 3.07994 16.4292C3.33034 16.0813 3.66685 15.8033 4.08945 15.5951C4.99297 15.1649 5.89011 14.822 6.78086 14.5662C7.67162 14.3105 8.74334 14.1826 9.99601 14.1826C11.2487 14.1826 12.3204 14.3105 13.2112 14.5662C14.1019 14.822 14.9991 15.1649 15.9026 15.5951C16.3252 15.8033 16.6617 16.0813 16.9121 16.4292C17.1625 16.7771 17.2877 17.1928 17.2877 17.6762V19.391H2.70435ZM19.371 19.391V17.6281C19.371 17.0245 19.2488 16.4547 19.0045 15.9188C18.7601 15.3828 18.4136 14.9229 17.9648 14.5392C18.4763 14.6433 18.969 14.7879 19.4431 14.9729C19.9172 15.1578 20.386 15.3658 20.8494 15.5969C21.3008 15.8239 21.6547 16.1144 21.9111 16.4685C22.1675 16.8225 22.2957 17.2091 22.2957 17.6281V19.391H19.371ZM9.99601 11.8589C9.13664 11.8589 8.40096 11.5529 7.78898 10.9409C7.177 10.329 6.87101 9.59329 6.87101 8.73391C6.87101 7.87452 7.177 7.13883 7.78898 6.52686C8.40096 5.91488 9.13664 5.60889 9.99601 5.60889C10.8554 5.60889 11.5911 5.91488 12.203 6.52686C12.815 7.13883 13.121 7.87452 13.121 8.73391C13.121 9.59329 12.815 10.329 12.203 10.9409C11.5911 11.5529 10.8554 11.8589 9.99601 11.8589ZM17.5681 8.73391C17.5681 9.59329 17.2622 10.329 16.6502 10.9409C16.0382 11.5529 15.3025 11.8589 14.4431 11.8589C14.3991 11.8589 14.343 11.8539 14.2749 11.8439C14.2068 11.8339 14.1507 11.8229 14.1066 11.8108C14.4594 11.3786 14.7306 10.8992 14.9201 10.3724C15.1096 9.84569 15.2043 9.29869 15.2043 8.73141C15.2043 8.16416 15.1052 7.62212 14.9069 7.10529C14.7086 6.58847 14.4418 6.10569 14.1066 5.65696C14.1627 5.63694 14.2188 5.62392 14.2749 5.6179C14.331 5.61189 14.3871 5.60889 14.4431 5.60889C15.3025 5.60889 16.0382 5.91488 16.6502 6.52686C17.2622 7.13883 17.5681 7.87452 17.5681 8.73391ZM3.74601 18.3493H16.246V17.6762C16.246 17.4318 16.1849 17.2181 16.0627 17.0352C15.9405 16.8522 15.7212 16.6773 15.4047 16.5103C14.6274 16.095 13.8081 15.7768 12.9467 15.5558C12.0854 15.3348 11.1018 15.2243 9.99601 15.2243C8.89025 15.2243 7.90667 15.3348 7.04528 15.5558C6.18391 15.7768 5.36461 16.095 4.58737 16.5103C4.27086 16.6773 4.0515 16.8522 3.92929 17.0352C3.80711 17.2181 3.74601 17.4318 3.74601 17.6762V18.3493ZM9.99601 10.8172C10.5689 10.8172 11.0594 10.6133 11.4674 10.2053C11.8754 9.79728 12.0793 9.30683 12.0793 8.73391C12.0793 8.161 11.8754 7.67055 11.4674 7.26256C11.0594 6.85457 10.5689 6.65058 9.99601 6.65058C9.4231 6.65058 8.93264 6.85457 8.52466 7.26256C8.11667 7.67055 7.91268 8.161 7.91268 8.73391C7.91268 9.30683 8.11667 9.79728 8.52466 10.2053C8.93264 10.6133 9.4231 10.8172 9.99601 10.8172Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'>{x.students_count}</span>
                                <span className='d-none d-lg-inline'>Students</span>
                              </span>
                              <span className='mt-1 text-secondary ms-2 ms-lg-4' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M8.85421 18.2292H16.1459V17.1875H8.85421V18.2292ZM8.85421 14.0625H16.1459V13.0208H8.85421V14.0625ZM6.89106 21.875C6.41163 21.875 6.01133 21.7144 5.69014 21.3932C5.36896 21.072 5.20837 20.6717 5.20837 20.1923V4.80768C5.20837 4.32825 5.36896 3.92795 5.69014 3.60677C6.01133 3.28559 6.41163 3.125 6.89106 3.125H15.1042L19.7917 7.8125V20.1923C19.7917 20.6717 19.6311 21.072 19.3099 21.3932C18.9888 21.7144 18.5885 21.875 18.109 21.875H6.89106ZM14.5834 8.33333V4.16667H6.89106C6.73081 4.16667 6.58391 4.23344 6.45035 4.36698C6.31681 4.50054 6.25004 4.64744 6.25004 4.80768V20.1923C6.25004 20.3526 6.31681 20.4995 6.45035 20.633C6.58391 20.7666 6.73081 20.8333 6.89106 20.8333H18.109C18.2693 20.8333 18.4162 20.7666 18.5497 20.633C18.6833 20.4995 18.75 20.3526 18.75 20.1923V8.33333H14.5834Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'>{x.documents_count} <span className='d-none d-lg-inline'>Documents</span></span>
                              </span>
                              <span className='mt-1 text-secondary ms-2 ms-lg-4' style={{ fontSize: "14px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M8.3333 20.1923V10.01C8.3333 9.54389 8.49823 9.14793 8.82809 8.82208C9.15795 8.49623 9.55592 8.3333 10.022 8.3333H20.1923C20.6584 8.3333 21.0553 8.49722 21.3832 8.82507C21.711 9.15294 21.875 9.54991 21.875 10.016V17.2676L17.2676 21.875H10.016C9.54991 21.875 9.15294 21.711 8.82507 21.3832C8.49722 21.0553 8.3333 20.6584 8.3333 20.1923ZM3.15101 6.87096C3.06019 6.40488 3.14966 5.98521 3.41942 5.61195C3.6892 5.23868 4.05712 5.00664 4.5232 4.91583L14.5432 3.15101C15.0093 3.06019 15.429 3.14966 15.8023 3.41942C16.1755 3.6892 16.4076 4.05712 16.4984 4.5232L16.7187 5.84932H15.665L15.4427 4.60734C15.416 4.46043 15.3358 4.34358 15.2023 4.25679C15.0687 4.16998 14.9218 4.13993 14.7616 4.16663L4.70749 5.9515C4.52053 5.97821 4.38031 6.065 4.28682 6.2119C4.19334 6.3588 4.15996 6.52574 4.18666 6.7127L5.84932 16.1037V18.121C5.61161 18.0048 5.40962 17.8398 5.24335 17.6262C5.07709 17.4125 4.96791 17.1675 4.91583 16.891L3.15101 6.87096ZM9.37497 10.016V20.1923C9.37497 20.3792 9.43506 20.5328 9.55525 20.653C9.67545 20.7732 9.82902 20.8333 10.016 20.8333H16.6666V16.6666H20.8333V10.016C20.8333 9.82902 20.7732 9.67544 20.653 9.55525C20.5328 9.43506 20.3792 9.37497 20.1923 9.37497H10.016C9.82902 9.37497 9.67545 9.43506 9.55525 9.55525C9.43506 9.67544 9.37497 9.82902 9.37497 10.016Z" fill="#8E9696" />
                                </svg>
                                <span className='ms-1'>{x.flashsets_count} <span className='d-none d-lg-inline'>Flashcards</span></span>
                              </span>
                            </div>
                          </div>
                          <button onClick={() => {
                            joinCourse(x.course_id);
                          }} className='btn border border-primary-subtle px-3 px-lg-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center join_btn' style={{ height: '44px', color: '#8587EA' }}>{translate_value.common_words.join}</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* TOAST MESSAGE */}
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-animation="true" data-bs-autohide="true" data-bs-delay="3000">
              <div className="toast-body d-flex justify-content-between py-3 px-3">
                <p className='m-0 d-flex align-items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00ae13" className={`bi bi-check-circle-fill`} viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  <span id="toastbody" className='fw-medium ms-4'></span>
                </p>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------Create New Subject Modal--------------------------------------------- */}
      {/* <div className="modal fade" id="AddsubjectModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-center" style={{ backgroundColor: '#5c5fe3', color: '#ffffff' }}>
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Add a new Subject</h1>
            </div>
            <div className="modal-body">
              <div className="row px-2">
                <div className="mb-3">
                  <label htmlFor="subjectNameInput" className="form-label">Enter Subject Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    id="subjectNameInput"
                    placeholder="e.g. Mathematics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I accept the <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setTermsVisible(!isTermsVisible);
                    }}>terms and conditions</a>
                  </label>
                  {isTermsVisible && (
                    <div className={`terms-conditions mt-3 ${isTermsVisible ? 'animate__animated animate__fadeIn' : 'animate__animated animate__fadeOut'}`} style={{
                      transition: 'all 0.5s',
                      opacity: isTermsVisible ? 1 : 0,
                      padding: '10px',
                      borderRadius: '5px'
                    }}>
                      <ul className="terms-container ps-4 text-muted mt-2">
                        <p className="fw-bold">Here are the terms and conditions:</p>
                        <li className="fw-bold">Subject Name Adjustments: <span className="fw-normal">By agreeing, you allow us to make necessary adjustments to the subject name for clarity.</span></li>
                        <li className="fw-bold">Moderator Approval: <span className="fw-normal">You understand that the addition of this subject is subject to moderator approval.</span></li>
                        <li className="fw-bold">Content Responsibility: <span className="fw-normal">You agree to ensure all uploaded content is appropriate and follows our community guidelines.</span></li>
                        <li className="fw-bold">Data Usage: <span className="fw-normal">You accept that your data may be used in accordance with our privacy policy, including but not limited to improving the platform, facilitating collaboration, and sharing with other users.</span></li>
                        {/* Add more terms as needed *
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='text-center' style={{ marginBottom: '15px' }}>
              <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn' data-bs-dismiss="modal"
                onClick={() => { createSubject() }}>{translate_value.group.create}</button>
              <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn ms-3' data-bs-dismiss="modal" onClick={() => {
                setSubjectName("");
                setTermsAccepted(false);
              }}>{translate_value.group.exit}</button>
            </div>
          </div>
        </div>
      </div> */}
      {/* ----------------------------------Reactstrap--------------Create New Subject Modal--------------------------------------------- */}
      <Modal isOpen={isSubject} size={"md"} backdrop={true}>
        <ModalHeader className='text-center' style={{ backgroundColor: '#5c5fe3', color: '#ffffff' }} toggle={() => setSubject(false)}>
          Add a new Subject
        </ModalHeader>
        <ModalBody>
          <div className="row px-2">
            <div className="mb-3">
              <label htmlFor="subjectNameInput" className="form-label">Enter Subject Name</label>
              <input
                type="text"
                className="form-control bg-light"
                id="subjectNameInput"
                placeholder="e.g. Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div className="form-check mb-3" style={{ paddingLeft: "35px" }}>
              <input
                type="checkbox"
                className="form-check-input"
                id="termsCheck"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="termsCheck">
                I accept the <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setTermsVisible(!isTermsVisible);
                }}>terms and conditions</a>
              </label>
              {isTermsVisible && (
                <div className={`terms-conditions mt-3 ${isTermsVisible ? 'animate__animated animate__fadeIn' : 'animate__animated animate__fadeOut'}`} style={{
                  transition: 'all 0.5s',
                  opacity: isTermsVisible ? 1 : 0,
                  padding: '10px',
                  borderRadius: '5px'
                }}>
                  <ul className="terms-container ps-4 text-muted mt-2">
                    <p className="fw-bold">Here are the terms and conditions:</p>
                    <li className="fw-bold">Subject Name Adjustments: <span className="fw-normal">By agreeing, you allow us to make necessary adjustments to the subject name for clarity.</span></li>
                    <li className="fw-bold">Moderator Approval: <span className="fw-normal">You understand that the addition of this subject is subject to moderator approval.</span></li>
                    <li className="fw-bold">Content Responsibility: <span className="fw-normal">You agree to ensure all uploaded content is appropriate and follows our community guidelines.</span></li>
                    <li className="fw-bold">Data Usage: <span className="fw-normal">You accept that your data may be used in accordance with our privacy policy, including but not limited to improving the platform, facilitating collaboration, and sharing with other users.</span></li>
                    {/* Add more terms as needed */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <div className='text-center' style={{ marginBottom: '15px' }}>
          <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn' data-bs-dismiss="modal"
            onClick={() => { createSubject() }}>{translate_value.group.create}</button>
          <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn ms-3' data-bs-dismiss="modal" onClick={() => {
            setSubjectName("");
            setTermsAccepted(false);
            setSubject(false);
          }}>{translate_value.group.exit}</button>
        </div>
      </Modal>
      <Backtotop />
    </div>
  );
}

export default Courses;