import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ipaddress, ipaddress2 } from '../App';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import data from '../pages/translate';
import * as bootstrap from 'bootstrap';
import { Context } from '../context/Context_provider';
import Small_Preloader from '../pages/Small_loader';
import axiosInstance from '../pages/axiosInstance';
import { toast } from 'react-toastify';
const toastConfig = { autoClose: 3000, theme: 'colored', position: 'top-center' };// Centralized toast configuration
const toastConfigRight = { autoClose: 3000, theme: 'colored', position: 'top-right' };
const Mainsidebar = ({ count, activevalue }) => {
  let { translate_value, course_visible, setcourse_visible, group_visible, setgroup_visible, studylist_visible, setstudylist_visible } = useContext(Context)
  const [active, setActive] = useState("");
  //const [isOpen, setIsOpen] = useState(false);
  //const toggle = () => setIsOpen(!isOpen);
  const [visibile4, setVisible4] = useState(false);
  const [studylists, setStudylists] = useState([]);
  const [loading, setloading] = useState();
  let navigate = useNavigate();
  const [userDetails, setUserdetails] = useState({});
  //const [user, setUserdata] = useState({});
  const [count1, setCount1] = useState(0)

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r) => {
        setUserdetails(r.data); // console.log("User Details fetched Successfully", r.data)
      }).catch(() => { console.log("User Details Fetching Error") });
    setActive(activevalue)
  }, [count, count1])

  // -----------------------------------------To fetch the Joined Subjects---------------------------------------------------
  const fetchJoinedsubjects = () => {
    setloading(true)
    axiosInstance.get(`${ipaddress}/CoursesView/${user.user_id}/`)
      .then((r) => {
        console.log("Joines", r.data)
        // const joinedcourseswith_notificationcount=r.data.joined_courses.filter(x=>x.notification_count>0)
        // To sort the objects based on notification_count value order
        r.data.joined_courses.sort((a, b) => b.notification_count - a.notification_count);
        setJoinedCourses1(r.data.joined_courses);
        setloading(false)
        console.log("courses:", r.data)
      })
      .catch(() => { console.log("Joined courses fetching error in Offcanvas") });
  }

  // -----------------------------------------To fetch all the joined groups--------------------------------------------------
  const fetchJoinedgroups = () => {
    setloading(true)
    axiosInstance.get(`${ipaddress}/ParticularUserGroup/${user.user_id}/`)
      .then((r) => {
        // console.log("Group Details Suceessfully Fetched",r.data)
        // To sort order of joined private groups
        r.data.user_joined_groups.sort((a, b) => b.unseen_messages_count - a.unseen_messages_count);
        r.data.user_joined_public_groups.sort((a, b) => b.unseen_count - a.unseen_count);
        setJoinedGroups(r.data.user_joined_groups);
        setUnseenMessages(r.data.unseen_messages);
        setJoinedpublicgroups(r.data.user_joined_public_groups)
        setloading(false)
      }).catch((err) => { console.log("joned Groups fetching error", err) });
  }

  // To fetch all the document based study lists
  const getStudylist = () => {
    setloading(true)
    axiosInstance.get(`${ipaddress}/GetStudyListCategories/${user.user_id}/`)
      .then((r) => {
        // console.log("Study Lists Fetched",r.data)
        setStudylists(r.data)
        setloading(false)
      }).catch((err) => { console.log("GetStudyListCategories fetching error", err) });
  }

  // To fetch all the flashcard based study lists
  const [flashcardstudylists, setflashcardStudylists] = useState([]);
  const getFlashcardStudylist = () => {
    setloading(true)
    axiosInstance.get(`${ipaddress2}/FlashcardStudylistSection/${user.user_id}/`)
      .then((r) => { // console.log("Flashcard Study Lists Fetched",r.data)
        setflashcardStudylists(r.data.data)
        setloading(false)
      }).catch((err) => { console.log("FlashcardStudylistSection API error", err) });
  }

  // ----------------------------------TOOLTIP FOR BUTTONS-------------------------------------------------------------
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // Cleanup function to destroy tooltips when the component unmounts
    return () => { tooltipList.forEach((tooltip) => { tooltip.dispose() }) };
  }, []);

  const [joinedCourses1, setJoinedCourses1] = useState([]);
  const [joinedCourses2, setJoinedCourses2] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [joinedpublicgroups, setJoinedpublicgroups] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [messagelength, setMessagelength] = useState(0);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [groups, setGroups] = useState("opengroups");

  // -------------------------------------------To remove unseen messages count for subjects---------------------------------------
  const removeunseenmessages = (course_id, course_name) => {
    joinedCourses1.map((x) => {
      if (x.course_id === course_id) { // console.log("Course ID is ",x.course_id)
        axiosInstance.post(`${ipaddress}/CourseMessagesSeenView/${user.user_id}/${course_id}/`, x.discussion_ids)
          .then((r) => { // console.log("Successfully seen",r.data) // console.log(x.discussion_ids)
            setCount1(count1 + 1)
            navigate(`/subjects/${course_id}/${course_name}`)
            setcourse_visible(false)
          }).catch((err) => {
            console.log("Course Messages Seen View Error", err)
          });
        // navigate(`/subjects/${course_id}/${course_name}`) //setVisible(false)
      }
    })
  }

  // ------------------------------------------To remove unseen messages count for private groups-------------------------------------------
  const removeprivategroupunseenmessages = (group_id, group_name) => {
    joinedGroups.map((x) => {
      if (x.group_id === group_id) { // console.log("Group ID is ",x.group_id)
        axiosInstance.post(`${ipaddress}/SeenMessageView/${user.user_id}/${group_id}/`, x.unseen_messages_ids)
          .then((r) => {  // console.log("Private group messages Successfully seen",r.data)
            fetchJoinedgroups();
            navigate(`/groupchat/privategroup/${group_id}`);
            setgroup_visible(false);
          }).catch((err) => { console.log("catch Error", err) });
      }
    })
  }

  // ------------------------------------------To remove unseen messages count for public groups-------------------------------------------
  const removepublicgroupunseenmessages = (group_id, group_name) => {
    joinedpublicgroups.map((x) => {
      if (x.group_id === group_id) {
        axiosInstance.post(`${ipaddress}/SeenMessageView/${user.user_id}/${group_id}/`, x.unseen_messages_ids)
          .then((r) => { // console.log("Public Group Messages Successfully seen",r.data) 
            setCount1(count1 + 1)
            navigate(`/groupchat/opengroup/${group_id}`)
            setgroup_visible(false)
          }).catch((err) => { console.log(" Public Group Messages seen error", err) });
      }
    })
  }
  // --------------------------------------------Flashcard Studylist functionalities-----------------------------------------
  const [studylisttype, setStudylisttype] = useState("document");
  const [flashsets_studylist, setFlashsets_studylist] = useState([]);
  // --------------------------------------------Function to create new Studylists----------------------------------------------
  const [allstudylists, setallstudylists] = useState([]);
  const [status, setStatus] = useState(false)
  const getallStudylist = () => {
    axiosInstance.get(`${ipaddress}/GetStudyListCategories/${user.user_id}/`)
      .then((r) => { // console.log("Study Lists",r.data)
        setallstudylists(r.data)
      }).catch((err) => { console.log("Get StudyList Categories error", err) });
  }

  const [studylistname, setStudylistname] = useState("")
  const createStudylist = async () => {
    if (!studylistname) {
      toast.error('Study List Name is required', toastConfig);
      return;
    }
    try {
      const formdata = new FormData()
      formdata.append('study_list_name', studylistname)
      const response = await axiosInstance.post(`${ipaddress}/GetStudyListCategories/${user.user_id}/`, formdata) // Make the API call
      if (response.status === 200) { toast.success(response.data, toastConfigRight) }
      else { toast.error(response.data, toastConfigRight) }
      getallStudylist();
      getStudylist();
      setStatus(false);
      setStudylistname("");
    } catch (error) {
      console.error('Error occurred:', error);
      const errorMessage = error?.response?.data ? (typeof error.response.data === 'string' ? error.response.data
        : 'Something went wrong. Please try again.') : 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage, toastConfig);
    }
  }

  return (
    <div className=" border-end d-none d-lg-block sidebar1 bg-light" style={{ zIndex: 5, position: 'sticky', height: '100vh', top: 0 }}>
      <div className='d-flex bg-light' style={{ position: 'relative' }}>
        <div className="sidebar">
          <div className='d-flex justify-content-center'><img src={require('../img/landing_page/logo2.png')} alt="Landing Page" /></div>
          <ul className="nav d-flex justify-content-center mt-5">
            <li data-bs-toggle="tooltip" data-bs-placement="right" style={{ height: '83px' }} data-bs-custom-class="custom-tooltip"
              data-bs-title="Dashboard" className={`nav-item py-3 d-flex justify-content-center w-100 ${active === "home" ? 'active-style' : ''}`} >
              <Link to='/dashboard/page' onClick={() => {
                setcourse_visible(false)
                setgroup_visible(false)
                setstudylist_visible(false)
                setActive('home')
              }} className="nav-link d-flex justify-content-center" href="#">
                <svg className={`${active === "home" ? 'd-none' : ''}`} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path d="M3.18901 24.1663C2.51781 24.1663 1.95738 23.9415 1.50773 23.4919C1.05808 23.0422 0.833252 22.4818 0.833252 21.8106V3.18876C0.833252 2.51756 1.05808 1.95714 1.50773 1.50749C1.95738 1.05783 2.51781 0.833008 3.18901 0.833008H21.8108C22.482 0.833008 23.0425 1.05783 23.4921 1.50749C23.9418 1.95714 24.1666 2.51756 24.1666 3.18876V21.8106C24.1666 22.4818 23.9418 23.0422 23.4921 23.4919C23.0425 23.9415 22.482 24.1663 21.8108 24.1663H3.18901ZM3.18901 22.708H11.7708V2.29134H3.18901C2.96467 2.29134 2.75901 2.38482 2.57202 2.57178C2.38506 2.75876 2.29159 2.96442 2.29159 3.18876V21.8106C2.29159 22.0349 2.38506 22.2406 2.57202 22.4276C2.75901 22.6145 2.96467 22.708 3.18901 22.708ZM13.2291 22.708H21.8108C22.0352 22.708 22.2408 22.6145 22.4278 22.4276C22.6148 22.2406 22.7083 22.0349 22.7083 21.8106V12.4997H13.2291V22.708ZM13.2291 11.0413H22.7083V3.18876C22.7083 2.96442 22.6148 2.75876 22.4278 2.57178C22.2408 2.38482 22.0352 2.29134 21.8108 2.29134H13.2291V11.0413Z"
                    fill='#8E9696' />
                </svg>
                <svg className={`${active === "home" ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M8.18901 29.1667C7.51781 29.1667 6.95738 28.9419 6.50773 28.4922C6.05808 28.0426 5.83325 27.4822 5.83325 26.811V8.18913C5.83325 7.51793 6.05808 6.95751 6.50773 6.50785C6.95738 6.0582 7.51781 5.83337 8.18901 5.83337H16.7708V29.1667H8.18901ZM18.2291 29.1667V17.5H29.1666V26.811C29.1666 27.4822 28.9418 28.0426 28.4921 28.4922C28.0425 28.9419 27.482 29.1667 26.8108 29.1667H18.2291ZM18.2291 16.0417V5.83337H26.8108C27.482 5.83337 28.0425 6.0582 28.4921 6.50785C28.9418 6.95751 29.1666 7.51793 29.1666 8.18913V16.0417H18.2291Z"
                    fill="#5D5FE3" />
                </svg>
              </Link>
            </li>
            <li data-bs-toggle="tooltip" data-bs-placement="right" style={{ height: '83px' }} data-bs-custom-class="custom-tooltip"
              data-bs-title="Subjects" className={`nav-item py-3 d-flex justify-content-center w-100 ${active === "course" ? 'active-style' : ''}`} >
              <a to='/courses' id='navLink2' onClick={() => {
                fetchJoinedsubjects()
                setcourse_visible(!course_visible)
                setgroup_visible(false)
                setstudylist_visible(false)
                setActive('course')
              }} className="nav-link d-flex align-items-center" type="button" >
                <svg className={`${active === "course" ? 'd-none' : ''}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M17.4999 27.2596L8.74991 22.5031V15.4358L4.48706 13.1249L17.4999 6.05762L30.5128 13.1249V22.4358H29.0544V13.9438L26.2499 15.4358V22.5031L17.4999 27.2596ZM17.4999 18.5208L27.4615 13.1249L17.4999 7.72909L7.53837 13.1249L17.4999 18.5208ZM17.4999 25.5965L24.7916 21.659V16.2379L17.4999 20.187L10.2082 16.2379V21.659L17.4999 25.5965Z"
                    fill='#8E9696' />
                </svg>
                <svg className={`${active === "course" ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="27" height="22" viewBox="0 0 27 22" fill="none">
                  <path d="M25.0545 16.4358V7.94385L13.5 14.1922L0.487183 7.12492L13.5 0.0576172L26.5129 7.12492V16.4358H25.0545ZM13.5 21.2596L4.75004 16.5031V10.5576L13.5 15.314L22.25 10.5576V16.5031L13.5 21.2596Z" fill="#5D5FE3" />
                </svg>
              </a>
            </li>
            <li data-bs-toggle="tooltip" data-bs-placement="right" style={{ height: '83px' }} data-bs-custom-class="custom-tooltip"
              data-bs-title="Groups" className={`nav-item py-3 d-flex justify-content-center w-100 ${active === "groups" ? 'active-style' : ''}`} >
              <Link id='navLink3' onClick={() => {
                fetchJoinedgroups()
                setActive("groups")
                setcourse_visible(false)
                setgroup_visible(!group_visible)
                setstudylist_visible(false)
              }} className="nav-link d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M3.78613 27.1475V24.7468C3.78613 24.07 3.96141 23.488 4.31197 23.001C4.66253 22.514 5.13363 22.1247 5.72528 21.8333C6.99021 21.231 8.2462 20.7509 9.49325 20.3928C10.7403 20.0348 12.2407 19.8558 13.9945 19.8558C15.7482 19.8558 17.2486 20.0348 18.4957 20.3928C19.7427 20.7509 20.9987 21.231 22.2637 21.8333C22.8553 22.1247 23.3264 22.514 23.677 23.001C24.0275 23.488 24.2028 24.07 24.2028 24.7468V27.1475H3.78613ZM27.1195 27.1475V24.6795C27.1195 23.8344 26.9484 23.0367 26.6063 22.2864C26.2642 21.536 25.779 20.8922 25.1507 20.3549C25.8668 20.5008 26.5567 20.7032 27.2204 20.9621C27.8842 21.2211 28.5404 21.5123 29.1892 21.8357C29.8211 22.1536 30.3166 22.5603 30.6756 23.056C31.0345 23.5516 31.214 24.0928 31.214 24.6795V27.1475H27.1195ZM13.9945 16.6026C12.7913 16.6026 11.7614 16.1742 10.9046 15.3174C10.0479 14.4606 9.61947 13.4307 9.61947 12.2276C9.61947 11.0244 10.0479 9.99447 10.9046 9.1377C11.7614 8.28092 12.7913 7.85254 13.9945 7.85254C15.1976 7.85254 16.2275 8.28092 17.0843 9.1377C17.9411 9.99447 18.3695 11.0244 18.3695 12.2276C18.3695 13.4307 17.9411 14.4606 17.0843 15.3174C16.2275 16.1742 15.1976 16.6026 13.9945 16.6026ZM24.5955 12.2276C24.5955 13.4307 24.1671 14.4606 23.3103 15.3174C22.4535 16.1742 21.4236 16.6026 20.2205 16.6026C20.1587 16.6026 20.0802 16.5956 19.9849 16.5815C19.8895 16.5675 19.811 16.5521 19.7493 16.5353C20.2433 15.9302 20.6229 15.2589 20.8882 14.5215C21.1535 13.7841 21.2861 13.0183 21.2861 12.2241C21.2861 11.4299 21.1473 10.6711 20.8697 9.94751C20.592 9.22396 20.2186 8.54807 19.7493 7.91984C19.8278 7.89182 19.9063 7.87359 19.9849 7.86515C20.0634 7.85674 20.1419 7.85254 20.2205 7.85254C21.4236 7.85254 22.4535 8.28092 23.3103 9.1377C24.1671 9.99447 24.5955 11.0244 24.5955 12.2276Z"
                    fill={active === "groups" ? '#5D5FE3' : '#8E9696'} />
                </svg>
              </Link>
            </li>
            <li data-bs-toggle="tooltip" data-bs-placement="right" style={{ height: '83px' }} data-bs-custom-class="custom-tooltip"
              data-bs-title="Study List" className={`nav-item py-3 d-flex justify-content-center w-100 ${active === "studylist" ? 'active-style' : ''}`} >
              <Link id='navLink6' onClick={() => {
                getStudylist()
                setActive("studylist")
                setstudylist_visible(!studylist_visible)
                setcourse_visible(false)
                setgroup_visible(false)
              }} className="nav-link d-flex align-items-center" href="#" >
                <svg className={`${active === "studylist" ? 'd-none' : ''}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M20.2485 13.9886V12.6312C21.0319 12.2348 21.8709 11.9376 22.7655 11.7394C23.6601 11.5412 24.5786 11.4421 25.5209 11.4421C26.0594 11.4421 26.5763 11.4767 27.0718 11.5459C27.5673 11.615 28.0786 11.7132 28.6058 11.8403V13.1641C28.0973 13.0014 27.6014 12.8888 27.1181 12.8261C26.6348 12.7635 26.1024 12.7322 25.5209 12.7322C24.5786 12.7322 23.6587 12.8383 22.7613 13.0505C21.8639 13.2627 21.0263 13.5754 20.2485 13.9886ZM20.2485 21.9533V20.5399C20.9945 20.1435 21.8288 19.8462 22.7515 19.648C23.6742 19.4498 24.5973 19.3507 25.5209 19.3507C26.0594 19.3507 26.5763 19.3853 27.0718 19.4545C27.5673 19.5237 28.0786 19.6218 28.6058 19.749V21.0727C28.0973 20.9101 27.6014 20.7974 27.1181 20.7348C26.6348 20.6721 26.1024 20.6408 25.5209 20.6408C24.5786 20.6408 23.6587 20.7549 22.7613 20.983C21.8639 21.2111 21.0263 21.5345 20.2485 21.9533ZM20.2485 17.999V16.5855C21.0319 16.1892 21.8709 15.8919 22.7655 15.6937C23.6601 15.4955 24.5786 15.3964 25.5209 15.3964C26.0594 15.3964 26.5763 15.431 27.0718 15.5002C27.5673 15.5694 28.0786 15.6675 28.6058 15.7947V17.1184C28.0973 16.9557 27.6014 16.8431 27.1181 16.7804C26.6348 16.7178 26.1024 16.6865 25.5209 16.6865C24.5786 16.6865 23.6587 16.8019 22.7613 17.0328C21.8639 17.2637 21.0263 17.5858 20.2485 17.999ZM9.47925 23.3892C10.7525 23.3892 11.9907 23.5355 13.1938 23.8281C14.3969 24.1207 15.5893 24.597 16.7709 25.257V10.9485C15.7183 10.1969 14.5582 9.63322 13.2905 9.2574C12.0229 8.88161 10.7525 8.69372 9.47925 8.69372C8.60425 8.69372 7.83815 8.74606 7.18095 8.85075C6.52378 8.95546 5.79415 9.1499 4.99207 9.43408C4.7677 9.50887 4.60878 9.61637 4.5153 9.75659C4.42182 9.89683 4.37508 10.0511 4.37508 10.2194V23.3668C4.37508 23.6285 4.46856 23.8202 4.65552 23.9417C4.8425 24.0632 5.04816 24.0772 5.2725 23.9838C5.80535 23.8043 6.42094 23.6603 7.11926 23.5519C7.81759 23.4434 8.60425 23.3892 9.47925 23.3892ZM18.2292 25.257C19.4109 24.597 20.6032 24.1207 21.8064 23.8281C23.0095 23.5355 24.2477 23.3892 25.5209 23.3892C26.3959 23.3892 27.1826 23.4434 27.8809 23.5519C28.5792 23.6603 29.1948 23.8043 29.7277 23.9838C29.952 24.0772 30.1577 24.0632 30.3446 23.9417C30.5316 23.8202 30.6251 23.6285 30.6251 23.3668V10.2194C30.6251 10.0511 30.5783 9.90151 30.4849 9.77063C30.3914 9.63974 30.2325 9.52756 30.0081 9.43408C29.206 9.1499 28.4764 8.95546 27.8192 8.85075C27.162 8.74606 26.3959 8.69372 25.5209 8.69372C24.2477 8.69372 22.9772 8.88161 21.7096 9.2574C20.442 9.63322 19.2819 10.1969 18.2292 10.9485V25.257ZM17.5001 27.3716C16.3147 26.5602 15.0415 25.9366 13.6804 25.501C12.3193 25.0654 10.9189 24.8476 9.47925 24.8476C8.72016 24.8476 7.97464 24.9111 7.24268 25.0383C6.51069 25.1654 5.79788 25.3692 5.10425 25.6497C4.57514 25.8609 4.07827 25.7973 3.61365 25.4589C3.14905 25.1205 2.91675 24.6531 2.91675 24.0567V9.96134C2.91675 9.60048 3.01162 9.2658 3.20138 8.95732C3.39116 8.64883 3.65712 8.43382 3.99927 8.31229C4.85558 7.93461 5.74647 7.6607 6.67196 7.49056C7.59744 7.32042 8.5332 7.23535 9.47925 7.23535C10.9077 7.23535 12.301 7.44101 13.6593 7.85233C15.0176 8.26366 16.2979 8.86195 17.5001 9.64722C18.7023 8.86195 19.9825 8.26366 21.3408 7.85233C22.6991 7.44101 24.0925 7.23535 25.5209 7.23535C26.467 7.23535 27.4027 7.32042 28.3282 7.49056C29.2537 7.6607 30.1446 7.93461 31.0009 8.31229C31.343 8.43382 31.609 8.64883 31.7988 8.95732C31.9885 9.2658 32.0834 9.60048 32.0834 9.96134V24.0567C32.0834 24.6531 31.8324 25.1112 31.3304 25.4309C30.8284 25.7506 30.2942 25.8048 29.7277 25.5935C29.0527 25.3318 28.3633 25.142 27.6593 25.0242C26.9554 24.9065 26.2426 24.8476 25.5209 24.8476C24.0813 24.8476 22.6809 25.0654 21.3198 25.501C19.9587 25.9366 18.6854 26.5602 17.5001 27.3716Z"
                    fill='#8E9696' />
                </svg>
                <svg className={`${active === "studylist" ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="31" height="21" viewBox="0 0 31 21" fill="none">
                  <path d="M18.2484 6.98857V5.63118C19.0318 5.23483 19.8708 4.93756 20.7654 4.73938C21.6601 4.54119 22.5785 4.4421 23.5208 4.4421C24.0593 4.4421 24.5763 4.47668 25.0717 4.54586C25.5672 4.61503 26.0785 4.71319 26.6058 4.84033V6.16406C26.0972 6.00141 25.6013 5.88876 25.118 5.82613C24.6347 5.76349 24.1023 5.73217 23.5208 5.73217C22.5785 5.73217 21.6587 5.83828 20.7612 6.05049C19.8638 6.26268 19.0262 6.57537 18.2484 6.98857ZM18.2484 14.9533V13.5399C18.9944 13.1435 19.8287 12.8462 20.7514 12.648C21.6741 12.4498 22.5972 12.3507 23.5208 12.3507C24.0593 12.3507 24.5763 12.3853 25.0717 12.4545C25.5672 12.5237 26.0785 12.6218 26.6058 12.749V14.0727C26.0972 13.9101 25.6013 13.7974 25.118 13.7348C24.6347 13.6721 24.1023 13.6408 23.5208 13.6408C22.5785 13.6408 21.6587 13.7549 20.7612 13.983C19.8638 14.2111 19.0262 14.5345 18.2484 14.9533ZM18.2484 10.999V9.58553C19.0318 9.18915 19.8708 8.89187 20.7654 8.69368C21.6601 8.49552 22.5785 8.39644 23.5208 8.39644C24.0593 8.39644 24.5763 8.43103 25.0717 8.5002C25.5672 8.56937 26.0785 8.66753 26.6058 8.79467V10.1184C26.0972 9.95573 25.6013 9.84307 25.118 9.78043C24.6347 9.7178 24.1023 9.68648 23.5208 9.68648C22.5785 9.68648 21.6587 9.80193 20.7612 10.0328C19.8638 10.2637 19.0262 10.5858 18.2484 10.999ZM16.2292 18.257C17.4108 17.597 18.6031 17.1207 19.8063 16.8281C21.0094 16.5355 22.2476 16.3892 23.5208 16.3892C24.3958 16.3892 25.1825 16.4434 25.8808 16.5519C26.5791 16.6603 27.1947 16.8043 27.7276 16.9838C27.9519 17.0772 28.1576 17.0632 28.3446 16.9417C28.5315 16.8202 28.625 16.6285 28.625 16.3668V3.21936C28.625 3.05109 28.5783 2.90151 28.4848 2.77063C28.3913 2.63974 28.2324 2.52756 28.008 2.43408C27.2059 2.1499 26.4763 1.95546 25.8191 1.85075C25.1619 1.74606 24.3958 1.69372 23.5208 1.69372C22.2476 1.69372 20.9772 1.88161 19.7095 2.2574C18.4419 2.63322 17.2818 3.19692 16.2292 3.94852V18.257ZM15.5 20.3716C14.3146 19.5602 13.0414 18.9366 11.6803 18.501C10.3192 18.0654 8.91881 17.8476 7.47916 17.8476C6.72008 17.8476 5.97455 17.9111 5.24259 18.0383C4.51061 18.1654 3.7978 18.3692 3.10416 18.6497C2.57506 18.8609 2.07819 18.7973 1.61357 18.4589C1.14896 18.1205 0.916664 17.6531 0.916664 17.0567V2.96134C0.916664 2.60048 1.01154 2.2658 1.20129 1.95732C1.39107 1.64883 1.65704 1.43382 1.99918 1.31229C2.86111 0.940225 3.7534 0.667724 4.67607 0.49479C5.59875 0.321832 6.53312 0.235352 7.47916 0.235352C8.90758 0.235352 10.3009 0.441012 11.6593 0.852335C13.0175 1.26366 14.2978 1.86195 15.5 2.64722C16.7022 1.86195 17.9824 1.26366 19.3407 0.852335C20.6991 0.441012 22.0924 0.235352 23.5208 0.235352C24.4669 0.235352 25.4012 0.321832 26.3239 0.49479C27.2466 0.667724 28.1389 0.940225 29.0008 1.31229C29.343 1.43382 29.6089 1.64883 29.7987 1.95732C29.9885 2.2658 30.0833 2.60048 30.0833 2.96134V17.0567C30.0833 17.6531 29.8323 18.1112 29.3303 18.4309C28.8283 18.7506 28.2941 18.8048 27.7276 18.5935C27.0526 18.3318 26.3632 18.142 25.6593 18.0242C24.9553 17.9065 24.2425 17.8476 23.5208 17.8476C22.0812 17.8476 20.6808 18.0654 19.3197 18.501C17.9586 18.9366 16.6854 19.5602 15.5 20.3716Z" fill="#5D5FE3" />
                </svg>
              </Link>
            </li>

            {/**<li data-bs-toggle="tooltip" data-bs-placement="right" style={{height:'70px'}} data-bs-custom-class="custom-tooltip"
                     data-bs-title="Work Flow" className={`nav-item py-3 d-flex justify-content-center w-100`} >
                    <Link id='navLink6' to='/work_flow' onClick={()=>{
                      setstudylist_visible(false)
                      setcourse_visible(false)
                      setgroup_visible(false)
                    }} className="nav-link d-flex align-items-center" href="#" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8E9696" class="bi bi-person-workspace" viewBox="0 0 16 16">
                      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
                    </svg>
                    </Link>
                  </li>**/}

            <li data-bs-toggle="tooltip" data-bs-placement="right" style={{ height: '70px' }} data-bs-custom-class="custom-tooltip"
              data-bs-title="Need Help" className={`nav-item py-3 d-flex justify-content-center w-100`} >
              <Link id='navLink6' data-bs-toggle="modal" data-bs-target="#need_help_modal" onClick={() => {
                setstudylist_visible(false)
                setcourse_visible(false)
                setgroup_visible(false)
              }} className="nav-link d-flex align-items-center" href="#" >
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 35 35" fill="none">
                  <path d="M5.39584 16.4592L10.6795 11.1756C10.9637 10.8914 11.2899 10.6904 11.6582 10.5726C12.0266 10.4549 12.4071 10.4352 12.7997 10.5137L14.8638 10.9428C13.7756 12.274 12.8875 13.4781 12.1995 14.555C11.5115 15.6319 10.8244 16.9388 10.1382 18.4757L5.39584 16.4592ZM11.4115 18.8235C12.0453 17.3539 12.8048 15.9488 13.6901 14.6083C14.5754 13.2677 15.5864 12.0291 16.7231 10.8924C18.5442 9.07131 20.5242 7.70693 22.6631 6.79921C24.802 5.89147 27.1091 5.50398 29.5846 5.63674C29.7173 8.11216 29.3312 10.4193 28.4263 12.5582C27.5214 14.6971 26.1584 16.6771 24.3374 18.4981C23.2062 19.6293 21.9676 20.6356 20.6214 21.5171C19.2753 22.3987 17.8674 23.1564 16.3978 23.7902L11.4115 18.8235ZM20.4082 14.785C20.8364 15.2131 21.3548 15.4272 21.9633 15.4272C22.5719 15.4272 23.0903 15.2131 23.5184 14.785C23.9466 14.3568 24.1607 13.8431 24.1607 13.2439C24.1607 12.6447 23.9466 12.131 23.5184 11.7029C23.0903 11.2747 22.5719 11.0606 21.9633 11.0606C21.3548 11.0606 20.8364 11.2747 20.4082 11.7029C19.9801 12.131 19.766 12.6447 19.766 13.2439C19.766 13.8431 19.9801 14.3568 20.4082 14.785ZM18.7144 29.8255L16.6895 25.0831C18.2264 24.3969 19.5347 23.7051 20.6144 23.0077C21.6941 22.3104 22.8996 21.4176 24.2308 20.3295L24.6515 22.3936C24.73 22.7862 24.715 23.1681 24.6066 23.5392C24.4981 23.9103 24.3018 24.238 24.0177 24.5222L18.7144 29.8255ZM7.5048 23.5462C8.07504 22.976 8.76681 22.6941 9.58012 22.7007C10.3934 22.7072 11.0852 22.9956 11.6554 23.5659C12.2257 24.1361 12.5108 24.8279 12.5108 25.6412C12.5108 26.4545 12.2257 27.1462 11.6554 27.7165C11.16 28.212 10.3649 28.6364 9.27023 28.9897C8.17555 29.3431 6.90933 29.5871 5.47156 29.7217C5.60616 28.2839 5.85482 27.0191 6.21753 25.9272C6.58025 24.8353 7.00934 24.0417 7.5048 23.5462Z" fill="#ff845d" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
        {/* -------------------------------------Course page layout---------------------------------------------- */}
        {/* ---------------------------start----------Actual from Bteam---------------------------------------------- *
           <div className={course_visible ? 'd-block bg-white border-start animate__animated animate__fadeIn border-end' : 'd-none'} style=         {{width:'440px',height:'100vh',position:'absolute',left:'94px',zIndex:6}}>
              <div className='d-flex justify-content-between bg-light py-3 align-items-center px-3'>
                <p className='m-0' style={{fontSize:'16px',fontWeight:500,letterSpacing:'0.32px',lineHeight:'normal'}}>{translate_value.common_words.subjects}</p>
                <button onClick={()=>{ navigate('/courses');setcourse_visible(false)}} 
                className='btn border border-primary-subtle px-3 py-2 text-decoration-none ms-auto d-flex align-items-center' style={{height:'44px',color:'#8587EA',fontSize:'14px'}}><i className="fa-solid fa-plus me-2"></i>Add {translate_value.common_words.subjects}</button>
              </div>
          <div>
        {/* ---------------------------End----------Actual from Bteam---------------------------------------------- */}
        <div className={course_visible ? 'd-block bg-white border-start animate__animated animate__fadeIn border-end' : 'd-none'} style={{ width: '440px', height: '100vh', position: 'absolute', left: '94px', zIndex: 6 }}>
          <div className='d-flex justify-content-between bg-light py-3 align-items-center px-3'>
            <p className='m-0' style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '0.32px', lineHeight: 'normal' }}>{translate_value.common_words.subjects} </p>
            <button className='btn-expand d-flex align-items-center justify-content-center ms-auto' onClick={() => { navigate('/courses'); setcourse_visible(false); }}
              style={{
                height: '44px',
                color: '#8587EA',
                fontSize: '14px',
                border: '1px solid #8587EA',
                fontWeight: 450,
                letterSpacing: '0.32px',
                lineHeight: '22px',
                padding: '10px 20px', // Initial smaller size
                borderRadius: '10px', // Curved corners
                transition: 'all 0.3s ease', // Smooth transition
                backgroundColor: 'transparent', // Initial background
                textDecoration: 'none' // Remove underline
              }} onMouseEnter={(e) => {
                e.currentTarget.style.padding = '10px 40px'; // Expand on hover
                e.currentTarget.style.background = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'; // Change background color on hover
                e.currentTarget.style.color = 'white'; // Change text color on hover
              }} onMouseLeave={(e) => {
                e.currentTarget.style.padding = '10px 20px'; // Reset size on mouse leave
                e.currentTarget.style.background = 'transparent'; // Reset background color
                e.currentTarget.style.color = '#8587EA'; // Reset text color
              }}>
              <i className="fas fa-search me-2"></i>
              {translate_value.common_words.discover}
            </button>
          </div>

          <div>
            {loading ? (<Small_Preloader />) : (
              <ul className='p-0 px-2' style={{ listStyleType: 'none', height: '90%', overflowY: joinedCourses1.length > 6 ? 'scroll' : 'none' }}>
                {joinedCourses1 && (
                  joinedCourses1.map((x, index) => {
                    return (
                      <li key={index} className='mt-2 py-3 border-bottom px-2 px-lg-3'>
                        <span onClick={() => {
                          removeunseenmessages(x.course_id, x.course_name)
                        }} className='text-decoration-none text-dark' style={{ fontSize: '16px', cursor: 'pointer', fontWeight: 450, lineHeight: '22px', letterSpacing: '0.32px' }}>{x.course_name}
                          <span className={`text-white ms-1 ${x.notification_count > 0 ? '' : 'd-none'}`} style={{ backgroundColor: '#FF845D', fontSize: '13px', paddingTop: '3px', paddingBottom: '3px', paddingLeft: '6px', paddingRight: '6px', borderRadius: '50%' }}>{x.notification_count}</span>
                        </span>
                        <div className='mt-1'>
                          <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.16357 15.513V14.1412C2.16357 13.7544 2.26373 13.4219 2.46405 13.1436C2.66437 12.8653 2.93357 12.6428 3.27166 12.4763C3.99448 12.1322 4.71219 11.8578 5.42478 11.6532C6.13739 11.4486 6.99477 11.3463 7.99691 11.3463C8.99905 11.3463 9.85642 11.4486 10.569 11.6532C11.2816 11.8578 11.9993 12.1322 12.7222 12.4763C13.0602 12.6428 13.3294 12.8653 13.5298 13.1436C13.7301 13.4219 13.8302 13.7544 13.8302 14.1412V15.513H2.16357ZM15.4969 15.513V14.1027C15.4969 13.6198 15.3992 13.164 15.2037 12.7352C15.0082 12.3064 14.7309 11.9385 14.3719 11.6315C14.7811 11.7149 15.1753 11.8305 15.5546 11.9785C15.9339 12.1265 16.3089 12.2929 16.6796 12.4777C17.0407 12.6593 17.3238 12.8918 17.529 13.175C17.7341 13.4582 17.8367 13.7675 17.8367 14.1027V15.513H15.4969ZM7.99691 9.48733C7.30941 9.48733 6.72087 9.24253 6.23128 8.75295C5.7417 8.26337 5.49691 7.67483 5.49691 6.98733C5.49691 6.29981 5.7417 5.71126 6.23128 5.22168C6.72087 4.7321 7.30941 4.4873 7.99691 4.4873C8.68441 4.4873 9.27295 4.7321 9.76253 5.22168C10.2521 5.71126 10.4969 6.29981 10.4969 6.98733C10.4969 7.67483 10.2521 8.26337 9.76253 8.75295C9.27295 9.24253 8.68441 9.48733 7.99691 9.48733ZM14.0546 6.98733C14.0546 7.67483 13.8098 8.26337 13.3202 8.75295C12.8307 9.24253 12.2421 9.48733 11.5546 9.48733C11.5194 9.48733 11.4745 9.48332 11.42 9.47531C11.3655 9.46729 11.3206 9.45848 11.2854 9.44887C11.5677 9.1031 11.7846 8.71953 11.9362 8.29814C12.0878 7.87675 12.1636 7.43915 12.1636 6.98533C12.1636 6.53152 12.0842 6.09789 11.9256 5.68443C11.7669 5.27097 11.5535 4.88475 11.2854 4.52576C11.3302 4.50975 11.3751 4.49933 11.42 4.49451C11.4649 4.48971 11.5097 4.4873 11.5546 4.4873C12.2421 4.4873 12.8307 4.7321 13.3202 5.22168C13.8098 5.71126 14.0546 6.29981 14.0546 6.98733ZM2.99691 14.6796H12.9969V14.1412C12.9969 13.9456 12.948 13.7747 12.8503 13.6283C12.7525 13.482 12.577 13.342 12.3238 13.2085C11.702 12.8762 11.0466 12.6217 10.3575 12.4448C9.66838 12.268 8.88152 12.1796 7.99691 12.1796C7.1123 12.1796 6.32543 12.268 5.63632 12.4448C4.94723 12.6217 4.29178 12.8762 3.66999 13.2085C3.41678 13.342 3.2413 13.482 3.14353 13.6283C3.04578 13.7747 2.99691 13.9456 2.99691 14.1412V14.6796ZM7.99691 8.65399C8.45524 8.65399 8.8476 8.4908 9.17399 8.16441C9.50038 7.83802 9.66357 7.44566 9.66357 6.98733C9.66357 6.52899 9.50038 6.13663 9.17399 5.81024C8.8476 5.48385 8.45524 5.32066 7.99691 5.32066C7.53857 5.32066 7.14621 5.48385 6.81982 5.81024C6.49343 6.13663 6.33024 6.52899 6.33024 6.98733C6.33024 7.44566 6.49343 7.83802 6.81982 8.16441C7.14621 8.4908 7.53857 8.65399 7.99691 8.65399Z"
                              fill="#ff845d" />
                          </svg> <span className='ms-1 text-decoration-underline' style={{ fontSize: '12px', color: '#37454D' }}>{x.students_count} Students</span></span>

                          <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.08341 14.5833H12.9167V13.75H7.08341V14.5833ZM7.08341 11.25H12.9167V10.4167H7.08341V11.25ZM5.51289 17.5C5.12935 17.5 4.80911 17.3715 4.55216 17.1146C4.29522 16.8576 4.16675 16.5374 4.16675 16.1539V3.84615C4.16675 3.4626 4.29522 3.14236 4.55216 2.88542C4.80911 2.62847 5.12935 2.5 5.51289 2.5H12.0834L15.8334 6.25V16.1539C15.8334 16.5374 15.7049 16.8576 15.448 17.1146C15.1911 17.3715 14.8708 17.5 14.4873 17.5H5.51289ZM11.6667 6.66667V3.33333H5.51289C5.3847 3.33333 5.26718 3.38675 5.16033 3.49358C5.0535 3.60043 5.00008 3.71795 5.00008 3.84615V16.1539C5.00008 16.282 5.0535 16.3996 5.16033 16.5064C5.26718 16.6132 5.3847 16.6667 5.51289 16.6667H14.4873C14.6155 16.6667 14.733 16.6132 14.8398 16.5064C14.9467 16.3996 15.0001 16.282 15.0001 16.1539V6.66667H11.6667Z" fill="#ff845d" />
                          </svg><span className='ms-1 text-decoration-underline' style={{ fontSize: '12px', color: '#37454D' }}>{x.documents_count} Documents</span></span>
                          <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#ff845d" />
                          </svg> <span className='ms- text-decoration-underline' style={{ fontSize: '12px', color: '#37454D' }}>
                              {x.public_flashsets_count} Flashsets</span></span>
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
            )}
          </div>
        </div>

        {/* -------------------------------------Groups page layout----------------------------------------------- */}
        <div className={group_visible ? 'd-block bg-white border-start animate__animated animate__fadeIn border-end' : 'd-none'} style={{ width: '440px', height: '100vh', position: 'absolute', left: '94px', zIndex: 6 }}>
          <div className='d-flex justify-content-between bg-light py-3 align-items-center px-2 px-md-3'>
            <h6 className='w-50 d-flex justify-content-center py-2' onClick={() => {
              setGroups("opengroups")
            }} style={{ cursor: 'pointer', color: groups === 'opengroups' ? '#fff' : '', borderRadius: '5px 0px 0px 5px', backgroundColor: groups === 'opengroups' ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }}>{translate_value.group.open_groups}</h6>
            <h6 className='w-50 d-flex justify-content-center py-2' onClick={() => {
              setGroups("privategroups")
            }} style={{ cursor: 'pointer', color: groups === 'privategroups' ? '#fff' : '', borderRadius: '0px 5px 5px 0px', backgroundColor: groups === 'privategroups' ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }}>{translate_value.group.private_group}</h6>
            {/* <button className='btn border border-primary-subtle px-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{height:'44px',color:'#8587EA',fontSize:'19px'}}>Join</button> */}
          </div>

          {/* ----------------------------Start-- Public Search more button in Menubar changed by VA-------------------------------------------------- */}
          <div className={groups === "opengroups" ? 'd-block' : 'd-none'} style={{ height: '90%', overflowY: joinedpublicgroups.length > 6 ? 'scroll' : 'none' }}>
            {/* ----------------------------Start-- Public Search more button in Menubar Actual from Bteam------------------------------------------ 
            <div className='px-3 px-lg-5 mt-3'>
              <Link className='btn px-5 py-2 w-100 d-flex align-items-center justify-content-center' to='/groups/opengroup' onClick={() => {setgroup_visible(false)}} 
                style={{color:'#2A3941', border:'1px solid #2A3941', fontWeight: 450, letterSpacing: '0.32px', lineHeight: '22px'}}>
                <i className="fas fa-search me-2"></i>{translate_value.group.join_group}
              </Link>
            </div>
            ----------------------------Start-- Public Search more button in Menubar changed by VA------------------------------------------- */}
            {/* ------------------------------------Button option 1-------Start------------------------------------ 
              <div className='px-3 px-lg-5 mt-3'>
                <Link className='btn px-5 py-2 w-100 d-flex align-items-center justify-content-center' to='/groups/opengroup' onClick={() => {
                  setgroup_visible(false);
                }} style={{
                  background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 500,
                  letterSpacing: '0.32px',
                  lineHeight: '22px',
                  borderRadius: '15px', // Adjusted for a more rectangular, curved look
                  transition: 'background-color 0.3s, transform 0.3s', // Adding transition for hover effect
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E2A30';
                  e.currentTarget.style.transform = 'scale(1.05)'; // Slightly scale up on hover
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)';
                  e.currentTarget.style.transform = 'scale(1)'; // Reset scaling on mouse leave
                }}>
                  <i className="fas fa-search me-2"></i>
                  {translate_value.group.join_group}
                </Link>
              </div>
            {/* ------------------------------------Button option 1-------------End------------------------------ */}
            {/* -------------------------------Start-----Button option 2------------------------------------------- */}
            <div className='d-flex justify-content-center mt-3'>
              <Link className='btn-expand d-flex align-items-center justify-content-center' to='/groups/opengroup' onClick={() => { setgroup_visible(false) }}
                style={{
                  color: '#2A3941',
                  border: '1px solid #2A3941',
                  fontWeight: 450,
                  letterSpacing: '0.32px',
                  lineHeight: '22px',
                  padding: '10px 20px', // Initial smaller size
                  borderRadius: '10px', // Curved corners
                  transition: 'all 0.3s ease', // Smooth transition
                  backgroundColor: 'transparent', // Initial background
                  textDecoration: 'none' // Remove underline
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.padding = '10px 40px'; // Expand on hover
                  e.currentTarget.style.background = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'; // Change background color on hover
                  e.currentTarget.style.color = 'white'; // Change text color on hover
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.padding = '10px 20px'; // Reset size on mouse leave
                  e.currentTarget.style.background = 'transparent'; // Reset background color
                  e.currentTarget.style.color = '#2A3941'; // Reset text color
                }}>
                <i className="fas fa-search me-2"></i>{translate_value.group.join_group}
              </Link>
            </div>

            <div>
              {/* ------------------------------------End--Public Search more button in Menubar changed by VA------------------------------------------- */}
              {loading ? (<Small_Preloader />) : (
                <ul className='p-0 mt-3 px-2' style={{ listStyleType: 'none' }}>
                  {joinedpublicgroups && (
                    joinedpublicgroups.map((x, index) => {
                      return (
                        <li key={index} style={{ cursor: 'pointer' }} className='mt-1 py-3 border-bottom px-2 px-lg-3'>
                          <span onClick={() => {
                            removepublicgroupunseenmessages(x.group_id, x.group_name)
                          }} className='text-decoration-none text-dark' style={{ fontSize: '16px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.32px' }}>{x.group_name} <span className={`text-white rounded-circle px-1 ${x.unseen_count > 0 ? '' : 'd-none'}`} style={{ backgroundColor: '#FF845D', height: '20px', width: '20px', fontSize: '13px' }}>{x.unseen_count}</span></span>
                          <div className='mt-1 d-flex align-items-center'>
                            <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M2.16345 15.513V14.1412C2.16345 13.7544 2.26361 13.4219 2.46393 13.1436C2.66425 12.8653 2.93345 12.6428 3.27154 12.4763C3.99435 12.1322 4.71206 11.8578 5.42466 11.6532C6.13727 11.4486 6.99465 11.3463 7.99679 11.3463C8.99892 11.3463 9.8563 11.4486 10.5689 11.6532C11.2815 11.8578 11.9992 12.1322 12.722 12.4763C13.0601 12.6428 13.3293 12.8653 13.5296 13.1436C13.73 13.4219 13.8301 13.7544 13.8301 14.1412V15.513H2.16345ZM15.4968 15.513V14.1027C15.4968 13.6198 15.399 13.164 15.2036 12.7352C15.0081 12.3064 14.7308 11.9385 14.3718 11.6315C14.781 11.7149 15.1752 11.8305 15.5545 11.9785C15.9337 12.1265 16.3088 12.2929 16.6795 12.4777C17.0406 12.6593 17.3237 12.8918 17.5288 13.175C17.734 13.4582 17.8365 13.7675 17.8365 14.1027V15.513H15.4968ZM7.99679 9.48733C7.30929 9.48733 6.72074 9.24253 6.23116 8.75295C5.74158 8.26337 5.49679 7.67483 5.49679 6.98733C5.49679 6.29981 5.74158 5.71126 6.23116 5.22168C6.72074 4.7321 7.30929 4.4873 7.99679 4.4873C8.68429 4.4873 9.27283 4.7321 9.76241 5.22168C10.252 5.71126 10.4968 6.29981 10.4968 6.98733C10.4968 7.67483 10.252 8.26337 9.76241 8.75295C9.27283 9.24253 8.68429 9.48733 7.99679 9.48733ZM14.0545 6.98733C14.0545 7.67483 13.8097 8.26337 13.3201 8.75295C12.8305 9.24253 12.242 9.48733 11.5545 9.48733C11.5192 9.48733 11.4744 9.48332 11.4199 9.47531C11.3654 9.46729 11.3205 9.45848 11.2852 9.44887C11.5675 9.1031 11.7845 8.71953 11.9361 8.29814C12.0877 7.87675 12.1635 7.43915 12.1635 6.98533C12.1635 6.53152 12.0841 6.09789 11.9255 5.68443C11.7668 5.27097 11.5534 4.88475 11.2852 4.52576C11.3301 4.50975 11.375 4.49933 11.4199 4.49451C11.4647 4.48971 11.5096 4.4873 11.5545 4.4873C12.242 4.4873 12.8305 4.7321 13.3201 5.22168C13.8097 5.71126 14.0545 6.29981 14.0545 6.98733ZM2.99679 14.6796H12.9968V14.1412C12.9968 13.9456 12.9479 13.7747 12.8502 13.6283C12.7524 13.482 12.5769 13.342 12.3237 13.2085C11.7019 12.8762 11.0465 12.6217 10.3574 12.4448C9.66826 12.268 8.8814 12.1796 7.99679 12.1796C7.11217 12.1796 6.32531 12.268 5.6362 12.4448C4.9471 12.6217 4.29166 12.8762 3.66987 13.2085C3.41666 13.342 3.24117 13.482 3.14341 13.6283C3.04566 13.7747 2.99679 13.9456 2.99679 14.1412V14.6796ZM7.99679 8.65399C8.45512 8.65399 8.84748 8.4908 9.17387 8.16441C9.50026 7.83802 9.66345 7.44566 9.66345 6.98733C9.66345 6.52899 9.50026 6.13663 9.17387 5.81024C8.84748 5.48385 8.45512 5.32066 7.99679 5.32066C7.53845 5.32066 7.14609 5.48385 6.8197 5.81024C6.49331 6.13663 6.33012 6.52899 6.33012 6.98733C6.33012 7.44566 6.49331 7.83802 6.8197 8.16441C7.14609 8.4908 7.53845 8.65399 7.99679 8.65399Z" fill="#FF845D" />
                            </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.member_count} Members</span></span>
                            <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF845D" className="bi bi-geo-alt" viewBox="0 0 16 16">
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg><span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.city}</span></span>

                            <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff845d" className="bi bi-tags" viewBox="0 0 16 16">
                              <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                              <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                            </svg><span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.category}</span></span>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* -------------------------------------PRIVATE GROUPS--------------------------------------------------- */}
          <div className={groups === "privategroups" ? 'd-block' : 'd-none'} style={{ height: '90%', overflowY: joinedGroups.length > 6 ? 'scroll' : 'none' }}>
            {/* ------------------------------------Start--Search more button Actual code by Bteam-------------------------------------------------- *
              <div className='d-flex justify-content-between px-2 px-lg-5 mt-3'>
                <Link to='/groups/privategroup' onClick={()=>{setgroup_visible(false)}} 
                  className='btn px-5 py-2 w-100' style={{color:'#2A3941',border:'1px solid #2A3941'}}>{translate_value.group.create_group}</Link>
              </div>
            {/* ------------------------------------End--Search more button Actual code by Bteam-------------------------------------------------- */}
            {/* ------------------------------------Start--Search more button changed by VA-------------------------------------------------- */}
            {/* --------------------------------Start----Option 1-------------------------------------------------- 
              <div className='px-3 px-lg-5 mt-3'>
                    <Link className='btn px-5 py-2 w-100' to='/groups/privategroup' onClick={() => {setgroup_visible(false)}} 
                    style={{color:'#2A3941',border:'1px solid #2A3941',fontWeight:450,letterSpacing:'0.32px',lineHeight:'22px'}}>
                      <i className="fas fa-search me-2"></i>{translate_value.group.create_group}
                    </Link>
                </div>
            {/* ---------------------------------End---Option 1-------------------------------------------------- */}
            {/* ------------------------------------End--Search more button changed by VA-------------------------------------------------- */}
            <div className='d-flex justify-content-center mt-3'>
              <Link className='btn-expand d-flex align-items-center justify-content-center' to='/groups/privategroup' onClick={() => { setgroup_visible(false) }}
                style={{
                  color: '#2A3941',
                  border: '1px solid #2A3941',
                  fontWeight: 450,
                  letterSpacing: '0.32px',
                  lineHeight: '22px',
                  padding: '10px 20px', // Initial smaller size
                  borderRadius: '10px', // Curved corners
                  transition: 'all 0.3s ease', // Smooth transition
                  backgroundColor: 'transparent', // Initial background
                  textDecoration: 'none' // Remove underline
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.padding = '10px 40px'; // Expand on hover
                  e.currentTarget.style.background = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'; // Change background color on hover
                  e.currentTarget.style.color = 'white'; // Change text color on hover
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.padding = '10px 20px'; // Reset size on mouse leave
                  e.currentTarget.style.background = 'transparent'; // Reset background color
                  e.currentTarget.style.color = '#2A3941'; // Reset text color
                }}>
                <i className="fas fa-search me-2"></i>{translate_value.group.create_group}
              </Link>
            </div>
            {/* -------------------------------------PRIVATE GROUPS--------------------------------------------------- */}
            <div>
              <ul className='p-0 mt-3 px-2' style={{ listStyleType: 'none' }}>
                {joinedGroups && (
                  joinedGroups.map((x, index) => {
                    return (
                      <li style={{ cursor: 'pointer' }} key={index} className='mt-1 py-3 border-bottom px-2 px-lg-3'>
                        <span onClick={() => { removeprivategroupunseenmessages(x.group_id, x.group_name) }}
                          className='text-decoration-none text-dark'>{x.group_name} <span className={`text-white rounded-circle px-1 ${x.unseen_messages_count > 0 ? '' : 'd-none'}`} style={{ backgroundColor: '#FF845D', height: '20px', width: '20px', fontSize: '13px' }}>{x.unseen_messages_count}</span></span>
                        <div className='mt-1 d-flex'>
                          <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.16345 15.513V14.1412C2.16345 13.7544 2.26361 13.4219 2.46393 13.1436C2.66425 12.8653 2.93345 12.6428 3.27154 12.4763C3.99435 12.1322 4.71206 11.8578 5.42466 11.6532C6.13727 11.4486 6.99465 11.3463 7.99679 11.3463C8.99892 11.3463 9.8563 11.4486 10.5689 11.6532C11.2815 11.8578 11.9992 12.1322 12.722 12.4763C13.0601 12.6428 13.3293 12.8653 13.5296 13.1436C13.73 13.4219 13.8301 13.7544 13.8301 14.1412V15.513H2.16345ZM15.4968 15.513V14.1027C15.4968 13.6198 15.399 13.164 15.2036 12.7352C15.0081 12.3064 14.7308 11.9385 14.3718 11.6315C14.781 11.7149 15.1752 11.8305 15.5545 11.9785C15.9337 12.1265 16.3088 12.2929 16.6795 12.4777C17.0406 12.6593 17.3237 12.8918 17.5288 13.175C17.734 13.4582 17.8365 13.7675 17.8365 14.1027V15.513H15.4968ZM7.99679 9.48733C7.30929 9.48733 6.72074 9.24253 6.23116 8.75295C5.74158 8.26337 5.49679 7.67483 5.49679 6.98733C5.49679 6.29981 5.74158 5.71126 6.23116 5.22168C6.72074 4.7321 7.30929 4.4873 7.99679 4.4873C8.68429 4.4873 9.27283 4.7321 9.76241 5.22168C10.252 5.71126 10.4968 6.29981 10.4968 6.98733C10.4968 7.67483 10.252 8.26337 9.76241 8.75295C9.27283 9.24253 8.68429 9.48733 7.99679 9.48733ZM14.0545 6.98733C14.0545 7.67483 13.8097 8.26337 13.3201 8.75295C12.8305 9.24253 12.242 9.48733 11.5545 9.48733C11.5192 9.48733 11.4744 9.48332 11.4199 9.47531C11.3654 9.46729 11.3205 9.45848 11.2852 9.44887C11.5675 9.1031 11.7845 8.71953 11.9361 8.29814C12.0877 7.87675 12.1635 7.43915 12.1635 6.98533C12.1635 6.53152 12.0841 6.09789 11.9255 5.68443C11.7668 5.27097 11.5534 4.88475 11.2852 4.52576C11.3301 4.50975 11.375 4.49933 11.4199 4.49451C11.4647 4.48971 11.5096 4.4873 11.5545 4.4873C12.242 4.4873 12.8305 4.7321 13.3201 5.22168C13.8097 5.71126 14.0545 6.29981 14.0545 6.98733ZM2.99679 14.6796H12.9968V14.1412C12.9968 13.9456 12.9479 13.7747 12.8502 13.6283C12.7524 13.482 12.5769 13.342 12.3237 13.2085C11.7019 12.8762 11.0465 12.6217 10.3574 12.4448C9.66826 12.268 8.8814 12.1796 7.99679 12.1796C7.11217 12.1796 6.32531 12.268 5.6362 12.4448C4.9471 12.6217 4.29166 12.8762 3.66987 13.2085C3.41666 13.342 3.24117 13.482 3.14341 13.6283C3.04566 13.7747 2.99679 13.9456 2.99679 14.1412V14.6796ZM7.99679 8.65399C8.45512 8.65399 8.84748 8.4908 9.17387 8.16441C9.50026 7.83802 9.66345 7.44566 9.66345 6.98733C9.66345 6.52899 9.50026 6.13663 9.17387 5.81024C8.84748 5.48385 8.45512 5.32066 7.99679 5.32066C7.53845 5.32066 7.14609 5.48385 6.8197 5.81024C6.49331 6.13663 6.33012 6.52899 6.33012 6.98733C6.33012 7.44566 6.49331 7.83802 6.8197 8.16441C7.14609 8.4908 7.53845 8.65399 7.99679 8.65399Z" fill="#FF8A65" />
                          </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.member_count} Students</span></span>
                          <span className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.08335 14.5833H12.9167V13.75H7.08335V14.5833ZM7.08335 11.25H12.9167V10.4167H7.08335V11.25ZM5.51283 17.5C5.12929 17.5 4.80905 17.3715 4.5521 17.1146C4.29516 16.8576 4.16669 16.5374 4.16669 16.1539V3.84615C4.16669 3.4626 4.29516 3.14236 4.5521 2.88542C4.80905 2.62847 5.12929 2.5 5.51283 2.5H12.0834L15.8334 6.25V16.1539C15.8334 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51283ZM11.6667 6.66667V3.33333H5.51283C5.38464 3.33333 5.26712 3.38675 5.16027 3.49358C5.05344 3.60043 5.00002 3.71795 5.00002 3.84615V16.1539C5.00002 16.282 5.05344 16.3996 5.16027 16.5064C5.26712 16.6132 5.38464 16.6667 5.51283 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65" />
                          </svg><span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.document_count} Documents</span></span>
                          <span className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#FF8A65" />
                          </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.flashset_count} Flashcards</span></span>
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* -------------------------------------Study List Layout------------------------------------------------ */}
        <div className={studylist_visible ? 'd-block bg-white border-start animate__animated animate__fadeIn border-end' : 'd-none'} style={{ width: '440px', height: '100vh', position: 'absolute', left: '94px', zIndex: 6 }}>
          {/* ------------------------------Start- Button-Actual Bteam----------------------------------------------- *
            <div className='bg-light py-3 px-3 d-flex justify-content-between align-items-center border-bottom'>
                <h6 className='m-0' style={{fontSize:'16px',fontWeight:500,lineHeight:'normal',letterSpacing:'0.32px'}}>Study List</h6>
                <button onClick={()=>{setVisible4(true)}} 
                  className='bg-transparent btn btn-sm d-flex align-items-center py-2' style={{border:'1px solid #5d5fe3',color:'#5d5fe3',fontSize:'16px',fontWeight:500,lineHeight:'normal',letterSpacing:'0.32px'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                  </svg><span className='ms-1' style={{fontSize:'14px',fontWeight:450,lineHeight:'normal',letterSpacing:'0.28px'}}>Create Studylist</span>
                </button>
            </div>
          {/* ------------------------------End- Button-Actual Bteam----------------------------------------------- */}
          {/* ------------------------------Start- create Study list Button-VA----------------------------------------------- */}
          <div className='bg-light py-3 px-3 d-flex justify-content-between align-items-center border-bottom'>
            <h6 className='m-0' style={{ fontSize: '16px', fontWeight: 500, lineHeight: 'normal', letterSpacing: '0.32px' }}>Study List</h6>
            <button className='btn-expand d-flex align-items-center py-2' onClick={() => { setVisible4(true) }}
              style={{
                border: '1px solid #5d5fe3',
                color: '#5d5fe3',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '0.32px',
                lineHeight: 'normal',
                padding: '10px 20px', // Initial smaller size
                borderRadius: '10px', // Curved corners
                transition: 'all 0.3s ease', // Smooth transition
                backgroundColor: 'transparent', // Initial background
                textDecoration: 'none' // Remove underline
              }} onMouseEnter={(e) => {
                e.currentTarget.style.padding = '10px 40px'; // Expand on hover
                e.currentTarget.style.background = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'; // Change background color on hover
                e.currentTarget.style.color = 'white'; // Change text color on hover
              }} onMouseLeave={(e) => {
                e.currentTarget.style.padding = '10px 20px'; // Reset size on mouse leave
                e.currentTarget.style.background = 'transparent'; // Reset background color
                e.currentTarget.style.color = '#5d5fe3'; // Reset text color
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
              </svg>
              <span className='ms-1' style={{ fontSize: '14px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.28px' }}>Create Studylist</span>
            </button>
          </div>
          {/* ------------------------------End- Button-VA----------------------------------------------- */}
          <div className='d-flex bg-light py-2 align-items-center px-3' >
            <h6 className='w-50 d-flex justify-content-center py-2' onClick={() => { setStudylisttype("document") }} style={{ cursor: 'pointer', color: studylisttype === "document" ? '#fff' : '', borderRadius: '5px 0px 0px 5px', backgroundColor: studylisttype === "document" ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }}
            >Document</h6>
            <h6 style={{ cursor: 'pointer', color: studylisttype === "flashcard" ? '#fff' : '', borderRadius: '0px 5px 5px 0px', backgroundColor: studylisttype === "flashcard" ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }} onClick={() => {
              getFlashcardStudylist()
              setStudylisttype("flashcard")
            }} className='w-50 d-flex justify-content-center py-2'>Flashcard</h6>
            {/* <Link className='btn px-3 py-2 text-decoration-none ms-auto d-flex align-items-center' to='/courses' style={{color:'#8587EA',fontSize:'15px',border:'1px solid #8587EA'}}>Create Study List</Link> */}
          </div>
          {/* ----------------------------------------------Document Studylist Section--------------------------------------------- */}
          <div style={{ height: studylisttype === "document" ? '85%' : 'auto', overflowY: studylisttype === "document" ? studylists.length > 5 ? 'scroll' : 'none' : 'visible' }}>
            {loading ? (<Small_Preloader />) : (
              <ul className={`p-0 px-2 ${studylisttype === "document" ? '' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                {studylists && (
                  studylists.map((x) => {
                    return (
                      <>
                        <li className='mb-2 py-3 border-bottom px-2 px-lg-3'>
                          <Link className='text-decoration-none text-dark' to={`/studylist/${x.id}`} onClick={() => { setstudylist_visible(false) }}
                            style={{ fontSize: '16px', cursor: 'pointer', letterSpacing: '0.32px', lineHeight: 'normal', fontWeight: 450 }}>{x.study_list_name}
                          </Link>
                          <div className='mt-1'>
                            <span className=''><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M7.08333 14.5833H12.9167V13.75H7.08333V14.5833ZM7.08333 11.25H12.9167V10.4167H7.08333V11.25ZM5.51281 17.5C5.12927 17.5 4.80903 17.3715 4.55208 17.1146C4.29514 16.8576 4.16667 16.5374 4.16667 16.1539V3.84615C4.16667 3.4626 4.29514 3.14236 4.55208 2.88542C4.80903 2.62847 5.12927 2.5 5.51281 2.5H12.0833L15.8333 6.25V16.1539C15.8333 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51281ZM11.6667 6.66667V3.33333H5.51281C5.38462 3.33333 5.2671 3.38675 5.16025 3.49358C5.05342 3.60043 5 3.71795 5 3.84615V16.1539C5 16.282 5.05342 16.3996 5.16025 16.5064C5.2671 16.6132 5.38462 16.6667 5.51281 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65" />
                            </svg><span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.document_count} Documents</span></span>
                          </div>
                        </li>
                      </>
                    )
                  })
                )}
              </ul>
            )}
          </div>
          {/* ----------------------------------------------Flashcards Studylist Section------------------------------------------- */}
          <div style={{ height: studylisttype === "flashcard" ? '85%' : 'auto', overflowY: studylisttype === "flashcard" ? flashcardstudylists.length > 5 ? 'scroll' : 'none' : 'visible' }}>
            {/* {loading ? (<Small_Preloader/>):( */}
            <ul className={`p-0 px-2 ${studylisttype === "flashcard" ? '' : 'd-none'}`} style={{ listStyleType: 'none' }}>
              {flashcardstudylists && (
                flashcardstudylists.map((x) => {
                  return (
                    <>
                      <li className='mb-2 py-3 border-bottom px-2 px-lg-3'>
                        <Link className='text-decoration-none text-dark' to={`/flashcard_studylist/${x.id}`} onClick={() => { setstudylist_visible(false) }}
                          style={{ fontSize: '17px', cursor: 'pointer' }}>{x.study_list_name}
                        </Link>
                        <div className='mt-1'>
                          <span className=''><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#FF8A65" />
                          </svg><span className='ms-1 text-secondary text-decoration-underline' style={{ fontSize: '13px' }}>{x.flashset_count} Flashsets</span></span>
                        </div>
                      </li>
                    </>
                  )
                })
              )}
            </ul>
            {/* )} */}
          </div>
        </div>

        {/* ------------------------------Start---------Create New Studylist section layout--Acutal by Bteam------------------------------ */}
        <div className={visibile4 ? 'd-block bg-white border-start animate__animated animate__fadeIn border-end' : 'd-none'} style={{ width: '440px', height: '100vh', position: 'absolute', left: '94px', zIndex: 6 }}>
          <div className="py-3 px-4" style={{ height: '95%', overflowY: 'scroll' }}>
            <h6 className='d-flex align-items-center'><span style={{ cursor: 'pointer' }} onClick={() => { setVisible4(false); setstudylist_visible(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
              </svg></span><span className='ms-2'>Save to Study List</span>
            </h6>
            <hr />
            <div className='mt-1' >
              <div className={`d-flex mt-3 ${status ? 'd-block' : 'd-none'}`}>
                <input type="text" className='form-control' placeholder='Enter Study List Name' value={studylistname} onChange={(e) => { setStudylistname(e.target.value) }} />
                <button className='btn btn-sm text-white fw-medium ms-2 px-3' style={{ backgroundColor: '#5D5FE3' }} onClick={createStudylist}>Create</button>
                <button className='btn btn-sm fw-medium ms-2 px-3' style={{ border: '1px solid #606060', color: '#606060' }} onClick={() => { setStatus(false) }}>Cancel</button>
              </div>
              {/* -----------------------------Start----Create New Studylist section layout--Acutal by Bteam------------------------ *
                <div className={`${status ? 'd-none':''} d-flex justify-content-between`}>
                  <button className={`btn btn-sm mt-3`} style={{border:'1px solid #8587EA',color:'#8587EA'}} onClick={()=>{setStatus(true)}}>Create New Reading List</button>
                </div>
              {/* -----------------------------End----Create New Studylist section layout--Acutal by Bteam---------------------------- */}
              {/* -----------------------------Start----Create New Studylist section layout--VA------------------------ */}
              <div className={`${status ? 'd-none' : ''} d-flex justify-content-center`}>
                <hr />
                <button className='btn-expand btn btn-sm mt-1' style={{
                  border: '1px solid #8587EA',
                  color: '#8587EA',
                  fontWeight: 450,
                  width: '80%',
                  letterSpacing: '0.32px',
                  lineHeight: 'normal',
                  padding: '10px 20px', // Initial smaller size
                  borderRadius: '10px', // Curved corners
                  transition: 'all 0.3s ease', // Smooth transition
                  backgroundColor: 'transparent', // Initial background
                  textDecoration: 'none' // Remove underline
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.width = '100%'; // Expand on hover
                  e.currentTarget.style.background = 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)'; // Change background color on hover
                  e.currentTarget.style.color = 'white'; // Change text color on hover
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.width = '80%'; // Reset size on mouse leave
                  e.currentTarget.style.background = 'transparent'; // Reset background color
                  e.currentTarget.style.color = '#8587EA'; // Reset text color
                }} onClick={() => { setStatus(true); }}>
                  Create New Reading List
                </button>
              </div>
              <hr />
              {/* -----------------------------End----Create New Studylist section layout--VA----------------------- */}
              {studylists && (
                studylists.map((x) => {
                  return (
                    <div className='py-2 px-3 rounded my-2' style={{ backgroundColor: '#F9F9FB' }}>
                      <input type="checkbox" value={x.id} />
                      <span className='ms-2'>{x.study_list_name}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        {/* -----------------------------End----Create New Studylist section layout--Acutal by Bteam------------------------------ */}
        {/* -----------------------------Start---Create New Studylist section layout--by VA----------------------------- */}
        {/* -----------------------------End---Create New Studylist section layout--by VA----------------------------- */}
      </div>
    </div >
  );
};

export default Mainsidebar;