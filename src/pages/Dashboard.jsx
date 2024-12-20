import React from "react";
import Mainsidebar from "../components/Mainsidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Document, Page } from 'react-pdf';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Position } from "@react-pdf-viewer/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackToTopButton from "./Backtotop";
import Addsubjects from "./Addsubjects";
import University_discussion_offcanvases from "./University_discussion_offcanvases";
import Preloader from "./Preloader";
import { ipaddress } from "../App";
import data from "./translate";
import { Context } from "../context/Context_provider";
import University_pinnedcomments from "./University_pinnedcomments";
import Slick_button_right from "./Slick_button_right";
import Slick_button_left from "./Slick_button_left";
import Slick2_button_right from "./Slick2_right_btn";
import Slick2_button_left from "./Slick2_left_btn";
import Navpath from "./Navpath";
import Report_post from "./Report_post";
import University_search_comments from "./University_search_comments";
import { toast } from "react-toastify";
import axiosInstance from './axiosInstance'
import { getAccessToken } from "./authService";
import Login_message from "./Login_message";
import * as bootstrap from 'bootstrap';

// import axiosInstance from "./axiosInstance";


const Dashboard = ({ language }) => {
  let { translate_value, count4, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );


  const navigate = useNavigate()
  let { data1 } = useParams()
  const [dropdownstate, setDropdownstate] = useState(false)
  const [index1, setindex1] = useState(-1)
  const [status, setStatus] = useState()
  const [recentDocs, setRecentDocs] = useState([])
  const [joinedcourses, setjoinedcourses] = useState([])
  const [visiblity, setVisibility] = useState(0)
  const user = JSON.parse(sessionStorage.getItem('user'))
  const [datacount, setDatacount] = useState({})
  const [loading, setloading] = useState(true)
  const [tablist, settablist] = useState(true)
  const [pincomment_status, setpincomment_status] = useState(false)
  const [usercomments_status, setusercomments_status] = useState(false)


  // -------------------------------------------------Functionality for Path direction flow--------------------------------
  sessionStorage.setItem("name", JSON.stringify('dashboard'))
  sessionStorage.setItem("path", JSON.stringify('/dashboard/page'))

  const [alljoined_courses, setall_joined_courses] = useState([])

  useEffect(() => {
    if (data1 === 'mainpage') {
      setStatus(true)
    }
    axiosInstance.get(`${ipaddress}/docAndLikesCount/${user.user_id}/`)
      .then((r) => {
        // console.log("Documents and likes count",r.data)
        setDatacount(r.data)
      })


    axiosInstance.get(`${ipaddress}/CoursesView/${user.user_id}/`)
      .then((r) => {
        // console.log("Coursessss",r.data)
        setall_joined_courses(r.data.joined_courses.reverse());
        const courses = r.data.joined_courses.filter(x => x.documents_count > 0)
        setjoinedcourses(courses)
        if (courses.length > 0) {
          setVisibility(courses[0].course_id)
          getDocs(courses[0].course_id)
        }
        setloading(false)
      })
      .catch((err) => {
        // console.log("Joined courses fetching error in Offcanvas",err);
      });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };

  }, [addsubjects_layout, count4])

  // ---------------------------------------------------GET DOCUMENTS----------------------------------------------------------
  const getDocs = (course_id) => {
    axiosInstance.get(`${ipaddress}/courseDocuments/${course_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Course Documents Fetched Successfully :",r.data)
        setRecentDocs(r.data)
      })
      .catch((err) => {
        // console.log("Course Documents fetching Error",err)
      })
  }

  var settings = {
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <Slick2_button_right />,
    prevArrow: <Slick2_button_left />,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  var settings1 = {
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <Slick_button_right />,
    prevArrow: <Slick_button_left />,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const userdata = JSON.parse(sessionStorage.getItem("user"))
  let [count, setCount] = useState(0)
  let [count1, setCount1] = useState(0)

  const [userdetails, setUserdetails] = useState({})

  const [state, setstate] = useState(false)

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    setstate(user.first_login)
    // To fetch user details
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r) => {
        //  console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
      })
      .catch(() => {
        //  console.log("User Details Fetching Error")
      })

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Cleanup function to destroy tooltips when the component unmounts
    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };

  }, [count])

  // -------------------------------------------------LOAD MORE FUNCTIONALITY-----------------------------------------------
  const [visibleDiscussions, setVisibleDiscussions] = useState(5);
  const discussionsPerPage = 5;

  const loadMoreDiscussions = () => {
    setVisibleDiscussions((prevVisibleDiscussions) => prevVisibleDiscussions + discussionsPerPage);
  };
  // -------------------------------------------------------LOAD MORE END----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  let [post, setComment] = useState()
  const [question, setQuestion] = useState("")
  const questionData = (e) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    setQuestion(e.target.value)
  }
  const [replies, setReplies] = useState("")
  const [isLoading1, setIsLoading1] = useState(false);

  const repliesData = (e) => {
    setReplies(e.target.value)
  }

  // --------------------------------------Functionality for posting the comments under the discussion-------------------------------------------------------
  const [selectedImages, setSelectedImages] = useState([]);
  const [load, setload] = useState()

  const handleImageChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setSelectedImages(Array.from(files));
    } else {
      setSelectedImages([]);
    }
  };

  const removemainimage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postQuestion = async (e) => {
    setload(true)
    const user = JSON.parse(sessionStorage.getItem('user'));
    const formData = new FormData();

    for (const file of selectedImages) {
      formData.append('file', file);
    }

    // To encode the data
    const encoded_question = encodeURIComponent(question)

    if (question.length > 0) {
      try {
        const token = getAccessToken()
        const response = await fetch(`${ipaddress}/UniversityDiscussionView/${user.user_id}/${user.university_id}/""/?post=${encoded_question}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('University discussion posted successfully',response);
          setCount(count + 1);
          toast.success('Comment posted successfully', {
            autoClose: 2000,
          })
          setSelectedImages([])
          setQuestion("");
          setload(false)
        } else {
          // console.error('Failed to post comment');
        }
      } catch (error) {
        setload(false)
        // console.error('Error uploading files:', error);
      }
    }
  };

  // ------------------------Functionality for posting replies under particular comment discussion--------------------------------------------------

  const [repliesImage1, setRepliesImage1] = useState([]);
  const [load2, setload2] = useState()
  const clearInput = (index) => {
    const inputElement = document.getElementsByClassName('original-reply-input');
    if (inputElement) {
      inputElement[index].value = '';
    }
  };

  const handleReplyImage1 = (event) => {
    const files = event.target.files
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setRepliesImage1(Array.from(files));
    } else {
      setRepliesImage1([]);
    }
  };

  const removeImage = (index) => {
    setRepliesImage1((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postReplies = async (dis_id, index) => {
    setload2(true)
    const user = JSON.parse(sessionStorage.getItem('user'))
    const formData = new FormData();
    for (const file of repliesImage1) {
      formData.append('images_attached', file);
    }

    const encoded_reply = encodeURIComponent(replies)

    if (replies.length > 0) {
      try {
        const token = getAccessToken()
        const response = await fetch(`${ipaddress}/UniversityDiscussionReplyView/${user.user_id}/${user.university_id}/${dis_id}/""/?post=${encoded_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('University Reply Sent successfully',formData);
          setCount(count + 1)
          clearInput(index)
          getreplies(dis_id)
          setReplies("")
          setRepliesImage1([])
          setload2(false)
        } else {
          // console.error('University Reply sending error');
        }
      } catch (error) {
        setload2(false)
        console.error('Error reply uploading files:', error);
      }
    }
  }

  // --------------------Functionality to post replies under a reply---------------------------------------------------------
  const [reply_id, setreply_id] = useState(0)
  const [discuss_id, setdiscuss_id] = useState(0)
  const [reply_index, setreply_index] = useState(0)

  const [replies_reply_Image, setReplies_reply_image] = useState([]);
  const [reply_for_reply, setReply_for_reply] = useState("")
  const clearInput2 = (index) => {
    const inputElement = document.getElementsByClassName('reply-input2');
    if (inputElement) {
      inputElement[index].value = '';
    }
  };

  const handleReply_reply_Image = (event) => {
    const files = event.target.files
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setReplies_reply_image(Array.from(files));
    } else {
      setReplies_reply_image([]);
    }
  };

  const removeImage3 = (index) => {
    setReplies_reply_image((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postreply_for_replies = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const formData = new FormData();
    for (const file of replies_reply_Image) {
      formData.append('images_attached', file);
    }
    const encoded_reply_reply = encodeURIComponent(reply_for_reply)

    if (reply_for_reply.length > 0) {
      try {
        const token = getAccessToken()

        const response = await fetch(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${reply_id}/""/?post=${encoded_reply_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('University Reply for reply Sent successfully',response.data);
          setReply_for_reply("")
          getreplies(discuss_id)
          setreplies_for_reply_status(false)
          setReplies_reply_image([])
        } else {
          // console.error('University Reply under reply sending error',reply_id);
        }
      } catch (error) {
        // console.error('Error reply uploading files:', error);
      }
    }
  }

  // -----------------------------------Function to get all the university discussions-------------------------------------------------

  const [discussions, setDiscussions] = useState([])
  const getdiscussion = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.get(`${ipaddress}/UniversityDiscussionDisplayView/${user.university_id}/${user.user_id}/`)
      .then((r) => {
        console.log("University Discussion data successfully fetched :", r.data)
        setDiscussions(r.data.reverse())
      })
      .catch(() => {
        // console.log("University Discussion data fetching Error")
      })

  }
  useEffect(() => {
    getdiscussion()
  }, [count])

  // ------------------------------------------------To Unlike the discussion post-------------------------------------------------------
  function handleLike1(discussion_id) {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionLikesView/${discussion_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("User Unliked the Post",r.data)
        getdiscussion()
        setCount(count + 1)
      })
      .catch(() => {
        // console.log("User Unlike error")
      })
  }

  // ------------------------------------------------To Like the discussion post-------------------------------------------------------

  function handleLike(discussion_id) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionLikesView/${discussion_id}/${user.user_id}/`)
      .then((r) => {
        //  console.log("User liked the Post",r.data)
        getdiscussion()
      })
      .catch(() => {
        //  console.log("User like error")
      })
  }

  // ---------------------------------------------To Dislike the discussion post-------------------------------------------------------
  function handledislike1(discussion_id) {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionDisLikesView/${discussion_id}/${user.user_id}/`)
      .then((r) => {
        //  console.log("User Removed the dislike",r.data)
        getdiscussion()
      })
      .catch(() => {
        //  console.log("User Removed the dislike error")
      })
  }
  function handledislike(discussion_id) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionDisLikesView/${discussion_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("University Disliked the Post",r.data)
        getdiscussion()
      })
      .catch(() => {
        // console.log("University dislike error")
      })
  }

  // ---------------------------------------------To Dislike the discussion replies-------------------------------------------------------
  function handlereplydislike1(discussion_id, discid, index) {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionReplyDisLikesView/${user.user_id}/${discussion_id}/`)
      .then((r) => {
        //  console.log("University reply Removed the dislike",r.data)
        getreplies(discid)
      })
      .catch(() => {
        //  console.log("User Removed the dislike error")
      })
  }
  function handlereplydislike(discussion_id, discid, index) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionReplyDisLikesView/${user.user_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("University Reply disliked",r.data)
        getreplies(discid)
      })
      .catch(() => {
        // console.log("University reply dislike error")
      })
  }

  //  ----------------------Functionality to like the reply under particular comment in the discussion---------------------------------------------------------

  function handleReplyLike1(discussion_id, discid, index) {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionReplyLikesView/${user.user_id}/${discussion_id}/`)
      .then((r) => {
        //  console.log("User Unliked the Reply",r.data)
        getreplies(discid)
      })
      .catch(() => {
        //  console.log("User Reply Unlike error")
      })
  }

  //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------

  function handleReplies_reply_like(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionRepliesReplyLike/${user.user_id}/${replies_reply_id}/`)
      .then((r) => {
        //  console.log("User liked the Replies reply",r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch((err) => {
        console.log("User Replies reply like error", err)
      })
  }

  //  -----------------------------Functionality to dislike the reply uneder particular reply----------------------------------
  function handlereplies_replydislike(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionRepliesReplyDisLike/${user.user_id}/${replies_reply_id}/`)
      .then((r) => {
        //  console.log("University Replies reply disliked",r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch(() => {
        console.log("University replies reply dislike error")
      })
  }

  //  ----------------------Functionality to like the reply under particular comment in the discussion---------------------------------------------------------

  function handleReplyLike(discussion_id, discid, index) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionReplyLikesView/${user.user_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("User liked the Reply",r.data)
        getreplies(discid)
      })
      .catch(() => {
        // console.log("User Reply like error")
      })
  }

  // -----------------------------This function is used to edit the post under university discussion--------------------------------------------------------

  const [editedpost, setEditedpost] = useState("")
  const [discussionId, setdiscussionId] = useState(0)

  const editpostfunctionData = (value) => {
    setEditedpost(value)
  }

  const editPosts = (discid) => {
    setdiscussionId(discid)
    const foundDiscussion = discussions.find((x) => discid === x.id);

    if (foundDiscussion) {
      setEditedpost(foundDiscussion.discussion);
    }
  }

  const sendEditedData = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const formData = new FormData();
    formData.append('discussion', editedpost);

    axiosInstance.put(`${ipaddress}/UniversityDiscussionDelete/${user.user_id}/${discussionId}/`, formData)
      .then((r) => {
        // console.log("Post Edited Successfully",r.data)
        setCount(count + 1)
        toast.success('Post updated successfully', {
          autoClose: 2000,
        })
        setindex1(-1)
      })
      .catch(() => {
        // console.log("Post Editing Error")
      })

  }

  // ----------------------------------Function to get the replies for the particular post----------------------------------------------------------------
  const [fetchedreplies, setFetchedreplies] = useState([])
  const [replies_status, setreply_status] = useState(false)

  const getreplies = (discussion_id) => {
    axiosInstance.get(`${ipaddress}/UniversityDiscussionReply/${user.user_id}/${user.university_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("University Replies fetched successfully",r.data)
        setFetchedreplies(r.data.reverse())
        setCount(count + 1)
      })
  }

  // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
  const [fetchedreplies_for_reply, setFetchedreplies_for_reply] = useState([])
  const [replies_for_reply_status, setreplies_for_reply_status] = useState(false)

  const getreplies_for_reply = (particular_reply_id) => {
    axiosInstance.get(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${particular_reply_id}/`)
      .then((r) => {
        // console.log("University Replies under reply fetched successfully",r.data)
        setFetchedreplies_for_reply(r.data.reverse())
        // setCount(count+1)
      })
  }

  // ----------------------------------------To Delete the post under discussion--------------------------------------------------------
  const deletePost = (discussion_id) => {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionDelete/${user.user_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("Post Successfully Deleted")
        setCount(count + 1)
        toast.success('Post successfully deleted', {
          autoClose: 2000,
        })
        setindex1(-1)
      })
      .catch(() => {
        // console.log("Post Delete Error")
      })
  }

  // -------------------------------To Delete the reply under specific post in the discussion--------------------------------------------------------

  const deleteReply = (disc_reply_id, discid) => {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionReply/${user.user_id}/${discid}/${disc_reply_id}/`)
      .then((r) => {
        // console.log("University Reply Successfully Deleted",r.data)
        setCount(count + 1)
        getdiscussion()
        toast.success('Reply successfully deleted', {
          autoClose: 2000,
        })
        getreplies(discid)
      })
      .catch(() => {
        // console.log("Reply Delete Error")
      })
  }

  // -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------

  const deleteReply_for_reply = (reply_reply_id, disc_reply_id, discid) => {
    axiosInstance.delete(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${reply_reply_id}/`)
      .then((r) => {
        // console.log("Replies reply deleted successfully",r.data)
        toast.success('Reply successfully deleted', {
          autoClose: 2000,
        })
        getreplies(discid)
        getreplies_for_reply(disc_reply_id)
      })
      .catch((err) => {
        console.log("Replies reply Delete Error", err)
      })
  }


  // -------------------------------------------PINNING COMMENTS------------------------------------------------------------
  const pincomment = (discId) => {
    axiosInstance.post(`${ipaddress}/UniversityPinnedCommentsView/${user.user_id}/${discId}/${user.university_id}/`)
      .then((r) => {
        // console.log("Pinned Successfully",r.data)
        if (r.data.message === 'Message already pinned') {
          toast.success('Comment already followed', {
            autoClose: 2000,
          })
          setindex1(-1)
        }
        else {
          setCount(count + 1)
          setDropdownstate(false)
          toast.success('Comment followed successfully', {
            autoClose: 2000,
          })
          setindex1(-1)
        }
      })
  }

  // ----------------------------------------To report the discussion comment----------------------------------------------
  const [report_status, setreport_status] = useState(false)
  const [report_id, setreport_id] = useState()


  // ----------------------------------------Search Discussion under university-------------------------------------------------------
  const [searchedComments, setSearchedComments] = useState([]);
  const [searchcomment, setSearchcomment] = useState("");

  // ---------------------------------------------------UNPIN COMMENT-------------------------------------------------------
  const unpin = (discid) => {
    axiosInstance.delete(`${ipaddress}/UniversityPinnedCommentsView/${user.user_id}/${discid}/${user.university_id}/`)
      .then((r) => {
        // console.log("UnPinned Successfully",r.data)
        toast.success('Comment unfollowed successfully', {
          autoClose: 2000,
        })
        getdiscussion()
        setCount(count + 1)
      })
      .catch(() => {
        console.log("Unpinning error")
      })
  }


  return (
    <div>
      {loading ? (<Preloader />) : (
        <div className="d-flex " style={{ position: 'relative' }}>
          <Mainsidebar activevalue={"home"} count={count1}></Mainsidebar>
          <div onClick={() => {
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className=" w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0 ">
            <Navbar setindex1={setindex1} setCount={setCount} count={count1}></Navbar>
            <div onClick={() => {
              setnavbar_dropdown_visible(false)
            }} className="container mb-3 row m-0 mt-1 shadow-sm py-4 bg-white align-items-center rounded  animate__animated animate__fadeIn">
              <div className="col-lg-3 col-md-3 d-flex align-items-center">
                <img src={userdetails.profile_pic} width={50} className={userdetails.profile_pic == null ? 'd-none' : 'd-inline rounded'} alt="" />
                {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-inine bg-success text-white p-3 rounded-circle my-auto' : 'd-none'}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                <div className="ms-2">
                  <span className="fw-bold" style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => {
                    navigate(`/profile/${user.user_id}`)
                  }}>{userdetails.nickname}</span><br />
                  <span style={{ fontSize: '14px' }}>{userdetails.program_name}</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-4 d-flex align-items-center border-end justify-content-center mt-4 mt-md-0" style={{ letterSpacing: '2px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M20.2482 13.9886V12.6312C21.0316 12.2348 21.8706 11.9376 22.7653 11.7394C23.6599 11.5412 24.5784 11.4421 25.5207 11.4421C26.0591 11.4421 26.5761 11.4767 27.0716 11.5459C27.567 11.615 28.0784 11.7132 28.6056 11.8403V13.1641C28.097 13.0014 27.6011 12.8888 27.1178 12.8261C26.6345 12.7635 26.1021 12.7322 25.5207 12.7322C24.5784 12.7322 23.6585 12.8383 22.7611 13.0505C21.8636 13.2627 21.026 13.5754 20.2482 13.9886ZM20.2482 21.9533V20.5399C20.9942 20.1435 21.8286 19.8462 22.7512 19.648C23.6739 19.4498 24.5971 19.3507 25.5207 19.3507C26.0591 19.3507 26.5761 19.3853 27.0716 19.4545C27.567 19.5237 28.0784 19.6218 28.6056 19.749V21.0727C28.097 20.9101 27.6011 20.7974 27.1178 20.7348C26.6345 20.6721 26.1021 20.6408 25.5207 20.6408C24.5784 20.6408 23.6585 20.7549 22.7611 20.983C21.8636 21.2111 21.026 21.5345 20.2482 21.9533ZM20.2482 17.999V16.5855C21.0316 16.1892 21.8706 15.8919 22.7653 15.6937C23.6599 15.4955 24.5784 15.3964 25.5207 15.3964C26.0591 15.3964 26.5761 15.431 27.0716 15.5002C27.567 15.5694 28.0784 15.6675 28.6056 15.7947V17.1184C28.097 16.9557 27.6011 16.8431 27.1178 16.7804C26.6345 16.7178 26.1021 16.6865 25.5207 16.6865C24.5784 16.6865 23.6585 16.8019 22.7611 17.0328C21.8636 17.2637 21.026 17.5858 20.2482 17.999ZM9.479 23.3892C10.7523 23.3892 11.9904 23.5355 13.1936 23.8281C14.3967 24.1207 15.5891 24.597 16.7707 25.257V10.9485C15.718 10.1969 14.5579 9.63322 13.2903 9.2574C12.0227 8.88161 10.7523 8.69372 9.479 8.69372C8.604 8.69372 7.8379 8.74606 7.18071 8.85075C6.52353 8.95546 5.79391 9.1499 4.99182 9.43408C4.76746 9.50887 4.60854 9.61637 4.51506 9.75659C4.42158 9.89683 4.37484 10.0511 4.37484 10.2194V23.3668C4.37484 23.6285 4.46832 23.8202 4.65527 23.9417C4.84226 24.0632 5.04792 24.0772 5.27226 23.9838C5.80511 23.8043 6.4207 23.6603 7.11902 23.5519C7.81734 23.4434 8.604 23.3892 9.479 23.3892ZM18.229 25.257C19.4106 24.597 20.603 24.1207 21.8061 23.8281C23.0092 23.5355 24.2474 23.3892 25.5207 23.3892C26.3957 23.3892 27.1823 23.4434 27.8807 23.5519C28.579 23.6603 29.1946 23.8043 29.7274 23.9838C29.9518 24.0772 30.1574 24.0632 30.3444 23.9417C30.5314 23.8202 30.6248 23.6285 30.6248 23.3668V10.2194C30.6248 10.0511 30.5781 9.90151 30.4846 9.77063C30.3911 9.63974 30.2322 9.52756 30.0079 9.43408C29.2058 9.1499 28.4761 8.95546 27.819 8.85075C27.1618 8.74606 26.3957 8.69372 25.5207 8.69372C24.2474 8.69372 22.977 8.88161 21.7094 9.2574C20.4418 9.63322 19.2816 10.1969 18.229 10.9485V25.257ZM17.4998 27.3716C16.3145 26.5602 15.0412 25.9366 13.6801 25.501C12.319 25.0654 10.9186 24.8476 9.479 24.8476C8.71992 24.8476 7.97439 24.9111 7.24243 25.0383C6.51045 25.1654 5.79764 25.3692 5.104 25.6497C4.5749 25.8609 4.07803 25.7973 3.6134 25.4589C3.1488 25.1205 2.9165 24.6531 2.9165 24.0567V9.96134C2.9165 9.60048 3.01138 9.2658 3.20113 8.95732C3.39091 8.64883 3.65688 8.43382 3.99902 8.31229C4.85533 7.93461 5.74623 7.6607 6.67171 7.49056C7.59719 7.32042 8.53296 7.23535 9.479 7.23535C10.9074 7.23535 12.3008 7.44101 13.6591 7.85233C15.0174 8.26366 16.2976 8.86195 17.4998 9.64722C18.702 8.86195 19.9823 8.26366 21.3406 7.85233C22.6989 7.44101 24.0923 7.23535 25.5207 7.23535C26.4667 7.23535 27.4025 7.32042 28.328 7.49056C29.2534 7.6607 30.1443 7.93461 31.0006 8.31229C31.3428 8.43382 31.6088 8.64883 31.7985 8.95732C31.9883 9.2658 32.0832 9.60048 32.0832 9.96134V24.0567C32.0832 24.6531 31.8322 25.1112 31.3302 25.4309C30.8282 25.7506 30.2939 25.8048 29.7274 25.5935C29.0525 25.3318 28.363 25.142 27.6591 25.0242C26.9552 24.9065 26.2423 24.8476 25.5207 24.8476C24.081 24.8476 22.6807 25.0654 21.3195 25.501C19.9584 25.9366 18.6852 26.5602 17.4998 27.3716Z" fill="#FF845D" />
                </svg>

                <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px', cursor: 'pointer' }}>
                  <span className="d-none d-md-inline" onClick={() => navigate('/courses')}>
                    {translate_value.dashboard.courses} : {alljoined_courses.length}
                  </span>
                </span>
              </div>

              <div className="col-lg-3 col-md-3 col-4 d-flex align-items-center border-end justify-content-center mt-4 mt-md-0" style={{ letterSpacing: '2px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M16.7709 25.9135H18.2292V19.0677L21.2917 22.1302L22.3237 21.0898L17.5 16.266L12.6763 21.0898L13.7168 22.1218L16.7709 19.0677V25.9135ZM9.64744 30.625C8.97624 30.625 8.41582 30.4002 7.96617 29.9505C7.51651 29.5009 7.29169 28.9404 7.29169 28.2692V6.73075C7.29169 6.05956 7.51651 5.49913 7.96617 5.04948C8.41582 4.59983 8.97624 4.375 9.64744 4.375H21.1459L27.7084 10.9375V28.2692C27.7084 28.9404 27.4835 29.5009 27.0339 29.9505C26.5842 30.4002 26.0238 30.625 25.3526 30.625H9.64744ZM20.4167 11.6667V5.83333H9.64744C9.4231 5.83333 9.21744 5.92681 9.03046 6.11377C8.8435 6.30075 8.75002 6.50641 8.75002 6.73075V28.2692C8.75002 28.4936 8.8435 28.6992 9.03046 28.8862C9.21744 29.0732 9.4231 29.1667 9.64744 29.1667H25.3526C25.5769 29.1667 25.7826 29.0732 25.9696 28.8862C26.1565 28.6992 26.25 28.4936 26.25 28.2692V11.6667H20.4167Z" fill="#FF845D" />
                </svg>

                {/*uplaod document */}
                <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}>
                  <span className="d-none d-md-inline">
                    {translate_value.dashboard.uploads}
                  </span> : {datacount.documents_count}
                </span>
                {/*uplaod document */}
                {/*uplaod document need to check *
<span className="ms-2" style={{fontSize: '14px', letterSpacing: '3.5px'}}>
      <span 
        className="d-none d-md-inline" 
        onClick={() => navigate(`/userfiles/${user_id}/uploaded_documents`)} // Updated navigation path
      >
        {translate_value.dashboard.uploads}
      </span> : {datacount.documents_count}
    </span>
{/*uplaod document */}
              </div>
              <div className="col-lg-3 col-md-3 col-4 d-flex align-items-center border-end justify-content-center mt-4 mt-md-0" style={{ letterSpacing: '2px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                  <path d="M25.4648 29.1666H10.8253V13.125L19.9679 4.09448L20.613 4.73954C20.7457 4.87227 20.8574 5.04241 20.9481 5.24996C21.0388 5.45748 21.0841 5.64818 21.0841 5.82206V6.05204L19.5922 13.125H29.7276C30.3371 13.125 30.8821 13.3652 31.3626 13.8457C31.8431 14.3262 32.0833 14.8712 32.0833 15.4807V17.2756C32.0833 17.4083 32.0684 17.5532 32.0385 17.7103C32.0086 17.8673 31.9693 18.0122 31.9207 18.145L27.9383 27.5849C27.7383 28.0336 27.4017 28.4094 26.9287 28.7123C26.4557 29.0152 25.9677 29.1666 25.4648 29.1666ZM12.2837 27.7083H25.4648C25.6704 27.7083 25.8807 27.6522 26.0957 27.54C26.3108 27.4278 26.4744 27.2409 26.5865 26.9791L30.625 17.5V15.4807C30.625 15.219 30.5409 15.004 30.3726 14.8357C30.2043 14.6674 29.9893 14.5833 29.7276 14.5833H17.7804L19.4688 6.61853L12.2837 13.7476V27.7083ZM10.8253 13.125V14.5833H5.83333V27.7083H10.8253V29.1666H4.375V13.125H10.8253Z" fill="#FF845D" />
                </svg>
                <span className="ms-2" style={{ fontSize: '14px', letterSpacing: '3.5px' }}><span className="d-none d-md-inline">{translate_value.dashboard.upvotes}</span> : {datacount.total_documents_likes}</span></div>

            </div>

            {/* ----------------------------------Documents under Joined Courses in Carousel------------------------------------- */}

            <p onClick={() => {
              setnavbar_dropdown_visible(false)
            }} className={`container mt-4 mb-3 m-0`} style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '0.4px' }}>{translate_value.dashboard.recommended_documents}</p>
            <div onClick={() => {
              setnavbar_dropdown_visible(false)
            }} className={`container bg-white shadow rounded mb-5`}>
              <div className="d-flex gap-2 gap-lg-4 pt-3 px-1">



                <Slider {...settings1} className={`${joinedcourses.length > 0 ? 'd-block w-100 ps-1 ps-md-4' : 'd-none'}`}>
                  {joinedcourses.map((x) => {
                    return (
                      /* older version ****************
                                          
                                            <div className="">
                                               <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 250, hide: 250 }}
                                                overlay={renderTooltip(x.course_name)}>
                                              <span className={visiblity===x.course_id ? 'text-decoration-underline' : ''} style={{fontWeight:500,letterSpacing:'0.36px',lineHeight:'normal',cursor:'pointer',fontSize:'18px', overflowX:'auto',color:visiblity===x.course_id ? 'black' : 'gray'}} 
                                              onClick={()=>{
                                                getDocs(x.course_id)
                                                setVisibility(x.course_id)
                                              }}>vvv{x.course_name.slice(0,10)} (<span className=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M2.59619 18.6154V16.9693C2.59619 16.5052 2.71638 16.1061 2.95677 15.7722C3.19715 15.4382 3.52019 15.1713 3.92589 14.9714C4.79327 14.5585 5.65452 14.2292 6.50964 13.9837C7.36477 13.7382 8.39362 13.6154 9.59619 13.6154C10.7988 13.6154 11.8276 13.7382 12.6827 13.9837C13.5379 14.2292 14.3991 14.5585 15.2665 14.9714C15.6722 15.1713 15.9952 15.4382 16.2356 15.7722C16.476 16.1061 16.5962 16.5052 16.5962 16.9693V18.6154H2.59619ZM18.5962 18.6154V16.9231C18.5962 16.3436 18.4789 15.7966 18.2443 15.2821C18.0098 14.7676 17.677 14.3261 17.2462 13.9577C17.7372 14.0577 18.2103 14.1965 18.6654 14.3741C19.1206 14.5516 19.5706 14.7513 20.0154 14.9731C20.4488 15.1911 20.7885 15.47 21.0347 15.8098C21.2808 16.1497 21.4039 16.5208 21.4039 16.9231V18.6154H18.5962ZM9.59619 11.3847C8.77119 11.3847 8.06494 11.0909 7.47744 10.5034C6.88994 9.91592 6.59619 9.20967 6.59619 8.38467C6.59619 7.55965 6.88994 6.85339 7.47744 6.26589C8.06494 5.67839 8.77119 5.38464 9.59619 5.38464C10.4212 5.38464 11.1274 5.67839 11.7149 6.26589C12.3024 6.85339 12.5962 7.55965 12.5962 8.38467C12.5962 9.20967 12.3024 9.91592 11.7149 10.5034C11.1274 11.0909 10.4212 11.3847 9.59619 11.3847ZM16.8654 8.38467C16.8654 9.20967 16.5717 9.91592 15.9842 10.5034C15.3967 11.0909 14.6904 11.3847 13.8654 11.3847C13.8231 11.3847 13.7693 11.3799 13.7039 11.3702C13.6385 11.3606 13.5847 11.3501 13.5423 11.3385C13.8811 10.9236 14.1414 10.4633 14.3233 9.95764C14.5052 9.45198 14.5962 8.92685 14.5962 8.38227C14.5962 7.8377 14.501 7.31734 14.3106 6.82119C14.1202 6.32504 13.8641 5.86158 13.5423 5.43079C13.5962 5.41158 13.65 5.39908 13.7039 5.39329C13.7577 5.38753 13.8116 5.38464 13.8654 5.38464C14.6904 5.38464 15.3967 5.67839 15.9842 6.26589C16.5717 6.85339 16.8654 7.55965 16.8654 8.38467ZM3.59619 17.6154H15.5962V16.9693C15.5962 16.7347 15.5375 16.5295 15.4202 16.3539C15.3029 16.1782 15.0923 16.0103 14.7885 15.85C14.0423 15.4513 13.2558 15.1459 12.4289 14.9337C11.602 14.7215 10.6577 14.6154 9.59619 14.6154C8.53466 14.6154 7.59042 14.7215 6.76349 14.9337C5.93657 15.1459 5.15004 15.4513 4.40389 15.85C4.10004 16.0103 3.88946 16.1782 3.77214 16.3539C3.65484 16.5295 3.59619 16.7347 3.59619 16.9693V17.6154ZM9.59619 10.3847C10.1462 10.3847 10.617 10.1888 11.0087 9.79717C11.4004 9.4055 11.5962 8.93467 11.5962 8.38467C11.5962 7.83467 11.4004 7.36384 11.0087 6.97217C10.617 6.5805 10.1462 6.38467 9.59619 6.38467C9.04619 6.38467 8.57536 6.5805 8.18369 6.97217C7.79202 7.36384 7.59619 7.83467 7.59619 8.38467C7.59619 8.93467 7.79202 9.4055 8.18369 9.79717C8.57536 10.1888 9.04619 10.3847 9.59619 10.3847Z" fill="currentColor"/>
                                              </svg> {x.students_count}</span>)</span>
                                              </OverlayTrigger>
                                            </div>
                        /* older version */
                      /* Start Newer version *******************/
                      <div className="">
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 250 }}
                          overlay={renderTooltip(x.course_name)}
                        >
                          <button
                            className={`course-button ${visiblity === x.course_id ? 'selected' : ''}`}
                            style={{
                              backgroundColor: visiblity === x.course_id ? '#6200EE' : '#EDE7F6', // Dark purple when selected, light purple when not
                              color: visiblity === x.course_id ? 'white' : '#6200EE', // White text when selected, purple text otherwise
                              border: 'none',
                              borderRadius: '9px',
                              padding: '10px 20px',
                              margin: '10px 0',
                              cursor: 'pointer',
                              fontWeight: '500',
                              fontSize: '16px',
                              letterSpacing: '0.36px',
                              display: 'block',
                              textAlign: 'center',
                              boxShadow: visiblity === x.course_id ? '0px 16px 16px rgba(98, 0, 238, 0.2)' : 'none', // Enhance shadow for a more pronounced effect
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease', // Smooth transition for transform and color
                              transform: visiblity === x.course_id ? 'scale(1.05)' : 'scale(1)' // Slightly scale up the selected button
                            }}
                            onClick={() => {
                              getDocs(x.course_id);
                              setVisibility(x.course_id);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Scale up on hover
                            onMouseLeave={(e) => e.currentTarget.style.transform = visiblity === x.course_id ? 'scale(1.05)' : 'scale(1)'} // Reset scale on mouse leave
                          >
                            {x.course_name.slice(0, 7)}...
                            <i className='fas fa-users' style={{
                              marginRight: '10px',
                              fontSize: '1rem',  // Reduced from 1.5rem to 1rem
                              color: visiblity === x.course_id ? 'white' : '#e88b67'
                            }}></i>
                            ({x.students_count})
                          </button>
                        </OverlayTrigger>
                      </div>




                      /* ***********************End newer version */




                    )
                  })}
                </Slider>

              </div>
              <div className={`slider-container w-100 m-0`}>
                <h6 className={`${recentDocs.length > 0 ? 'd-none' : ''} text-center`}>No Documents Available !!!</h6>
                <Slider {...settings} className={`${recentDocs.length > 0 ? 'd-block w-100 ps-1 ps-md-4' : 'd-none'}`}>
                  {recentDocs && recentDocs.length > 0 && recentDocs.map((x) => (
                    <div className="card p-1 border-0" style={{ height: '300px', cursor: 'pointer' }} onClick={() => {
                      navigate(`/showpdf/${x.document_id}`)
                    }}>
                      <div className="card-body p-0">
                        <div className="d-flex justify-content-center align-items-center border" style={{ height: '250px', overflow: 'hidden', width: '100%', position: 'relative', cursor: 'pointer' }}> {/* Set a fixed height for the document container */}
                          <Document file={x.file.document}
                          // onLoadSuccess={() => 
                          //   console.log('Document loaded successfully.')
                          //   }
                          >
                            <Page pageNumber={1} scale={0.5} width={350} />
                          </Document>
                        </div>
                        <div className="dashboard-cards" style={{ height: '250px', width: '100%', position: 'absolute', top: 0, left: 0 }}> {/* Set a fixed height for the document container */}
                          <div className="h-100 d-flex justify-content-between align-items-end px-2">
                            <span className="text-white d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                              <path d="M18.1891 20.8334H7.73237V9.37502L14.2628 2.92468L14.7236 3.38544C14.8184 3.48025 14.8982 3.60177 14.9629 3.75002C15.0277 3.89825 15.0601 4.03447 15.0601 4.15867V4.32294L13.9944 9.37502H21.234C21.6693 9.37502 22.0586 9.54663 22.4018 9.88984C22.7451 10.2331 22.9167 10.6223 22.9167 11.0577V12.3398C22.9167 12.4346 22.906 12.5381 22.8846 12.6503C22.8633 12.7624 22.8352 12.8659 22.8005 12.9608L19.9559 19.7036C19.813 20.0241 19.5727 20.2925 19.2348 20.5089C18.8969 20.7252 18.5483 20.8334 18.1891 20.8334ZM8.77404 19.7917H18.1891C18.336 19.7917 18.4862 19.7516 18.6398 19.6715C18.7934 19.5914 18.9103 19.4578 18.9904 19.2709L21.875 12.5V11.0577C21.875 10.8707 21.8149 10.7172 21.6947 10.597C21.5745 10.4768 21.4209 10.4167 21.234 10.4167H12.7003L13.9062 4.72757L8.77404 9.81974V19.7917ZM7.73237 9.37502V10.4167H4.16667V19.7917H7.73237V20.8334H3.125V9.37502H7.73237Z" fill="white" />
                            </svg> <span className="fw-medium ms-1">{x.followers_count}</span></span>

                            <span className="text-white d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                              <path d="M10.4167 14.0625H14.0425V13.0208H10.4167V14.0625ZM10.4167 10.9375H17.6683V9.89583H10.4167V10.9375ZM10.4167 7.8125H17.6683V6.77083H10.4167V7.8125ZM8.45351 17.7083C7.97408 17.7083 7.57378 17.5477 7.2526 17.2266C6.93142 16.9054 6.77083 16.5051 6.77083 16.0257V4.80768C6.77083 4.32826 6.93142 3.92795 7.2526 3.60677C7.57378 3.28559 7.97408 3.125 8.45351 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3542 4.32826 21.3542 4.80768V16.0257C21.3542 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.45351ZM8.45351 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.45351C8.29327 4.16667 8.14637 4.23344 8.01281 4.36698C7.87927 4.50054 7.8125 4.64744 7.8125 4.80768V16.0257C7.8125 16.1859 7.87927 16.3328 8.01281 16.4664C8.14637 16.5999 8.29327 16.6667 8.45351 16.6667ZM5.32851 20.8333C4.84908 20.8333 4.44878 20.6727 4.1276 20.3516C3.80642 20.0304 3.64583 19.6301 3.64583 19.1507V6.89102H4.68749V19.1507C4.68749 19.3109 4.75427 19.4578 4.88781 19.5914C5.02135 19.7249 5.16825 19.7917 5.32851 19.7917H17.5881V20.8333H5.32851Z" fill="white" />
                            </svg><span className="fw-medium ms-1">{x.file.pages}</span></span>
                          </div>
                        </div>
                        <div className="text-center py-2">
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 250 }}
                            overlay={renderTooltip(x.file.title)}
                          >
                            <Link to={`/showpdf/${x.document_id}`} className="card-text fw-medium text-decoration-none text-dark" style={{ fontSize: '16px', lineHeight: '22px', letterSpacing: '0.32px' }}>{x.file.title.slice(0, 14)} <span className={`${x.file.title.length > 14 ? '' : 'd-none'}`}>...</span></Link>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>


            {/* ----------------------------------------------University Discussion------------------------------------------------ */}

            <div onClick={() => {
              setnavbar_dropdown_visible(false)
            }} className="m-0 mt-3 p-0 mb-5 row dashboard-discussion">
              <div className="d-flex justify-content-between align-items-center pb-3 ps-0" onClick={() => {
                setindex1(-1)
              }}>
                <div>
                  <h6 onClick={() => {
                    settablist(true)
                  }} className="d-none d-md-inline p-1 px-3" style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 500, letterSpacing: '0.4px', lineHeight: 'normal', backgroundColor: tablist ? '#5D5FE3' : '#fff', border: '1px solid #5D5FE3', color: tablist ? '#fff' : '#5D5FE3', borderRadius: '5px 0px 0px 5px' }}>{translate_value.dashboard.news_feed}</h6>
                  <h6 onClick={() => {
                    setpincomment_status(true)
                    settablist(false)
                  }} className="d-none d-md-inline p-1 px-3" style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 500, letterSpacing: '0.4px', lineHeight: 'normal', backgroundColor: tablist ? '#fff' : '#5D5FE3', border: '1px solid #5D5FE3', color: tablist ? '#5D5FE3' : '#fff', borderRadius: '0px 5px 5px 0px' }}>{translate_value.dashboard.followed}</h6>
                </div>
                <div className="d-flex">
                  <div className={`input-group bg-light rounded border`}>
                    <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M20.297 20.9936L13.7745 14.4712C13.2537 14.9145 12.6547 15.2577 11.9776 15.5008C11.3005 15.7439 10.6201 15.8654 9.93635 15.8654C8.26795 15.8654 6.85593 15.2879 5.70029 14.1329C4.54463 12.9778 3.9668 11.5666 3.9668 9.89908C3.9668 8.23158 4.54431 6.81924 5.69932 5.66205C6.85434 4.50486 8.2656 3.92627 9.9331 3.92627C11.6006 3.92627 13.013 4.50409 14.1701 5.65973C15.3273 6.81538 15.9059 8.22741 15.9059 9.89583C15.9059 10.6196 15.7777 11.3201 15.5213 11.9972C15.2649 12.6743 14.9284 13.2532 14.5117 13.734L21.0341 20.2564L20.297 20.9936ZM9.93635 14.8237C11.3186 14.8237 12.4854 14.348 13.437 13.3964C14.3885 12.4449 14.8642 11.278 14.8642 9.89583C14.8642 8.51362 14.3885 7.34676 13.437 6.39523C12.4854 5.4437 11.3186 4.96794 9.93635 4.96794C8.55415 4.96794 7.38728 5.4437 6.43576 6.39523C5.48424 7.34676 5.00849 8.51362 5.00849 9.89583C5.00849 11.278 5.48424 12.4449 6.43576 13.3964C7.38728 14.348 8.55415 14.8237 9.93635 14.8237Z" fill="black" />
                    </svg></span>
                    <input type="text" disabled={!tablist} className={`form-control bg-transparent border-0 ps-0 sub-search`} placeholder={translate_value.common_words.search_discussion} value={searchcomment}
                      onChange={(e) => {
                        setSearchcomment(e.target.value)
                      }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" className='ms-3 d-flex align-items-center'
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="My comments">
                    <span data-bs-toggle="modal" data-bs-target="#usercommentsmodal" onClick={() => {
                      setusercomments_status(true)
                    }} className="ms-2 ms-md-4 p-2 rounded px-2 px-md-3 d-flex align-items-center justify-content-center" style={{ border: '1px solid #2A3941', color: '#5D5FE3', cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 25 25" fill="none">
                        <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#2A3941" />
                      </svg></span>
                  </span>
                </div>
              </div>
              <div className="col-lg-9 pe-0 pe-md-3 ps-0">
                <div className="bg-light" >
                  <div className='w-100'>
                    <div className="modal fade" id="postmodal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

                      {/* -----------------------To post the comments modal-------------------------------- */}
                      <div className="modal-dialog  modal-dialog-centered modal-lg">
                        <div className="modal-content">
                          <div className="modal-body">
                            <div className='col-12 bg-white px-3 pt-2 pb-3'>
                              <h6 className='pb-2 ps-1 fs-5'>{translate_value.dashboard.create_a_post}</h6>
                              <div className='d-flex gap-3 align-items-center'>
                                <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                <div className="input-group bg-light border rounded pe-3">
                                  <input
                                    type="text"
                                    name="question"
                                    value={question}
                                    onChange={questionData}
                                    className="form-control py-3 ps-3 bg-light border-0 shadow-none post-input" placeholder="Post your Comment....."
                                    style={{ position: 'relative' }} />
                                  <div className='d-flex align-items-center bg-light'>
                                    <input
                                      id="fileInput"
                                      type='file'
                                      name='file'
                                      accept="image/*"
                                      multiple
                                      onChange={handleImageChange}
                                      className="bg-light text-center p-3 btn"
                                    />
                                    <label data-bs-toggle="tooltip" data-bs-placement="top"
                                      data-bs-custom-class="custom-tooltip"
                                      data-bs-title="Attach Image"
                                      htmlFor="fileInput"
                                      className="custom-file-input bg-transparent border-0 px-4 py-2">
                                      <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
                                    </label>
                                    <button disabled={question.length > 0 ? false : true} data-bs-dismiss="modal" onClick={postQuestion} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' >
                                      <div className={`spinner-border spinner-border-sm ${load ? '' : 'd-none'}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                      </div>
                                      <svg data-bs-toggle="tooltip" data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" className={`${load ? 'd-none' : ''}`} width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/* margin-top: 8px;
                              margin-left: 50px; */}
                              <p className="mt-1 ms-5" style={{ color: '#ff845d', fontSize: '13px', fontStyle: 'italic' }}>*You can edit your post within 24 hours after posting</p>
                              <div className='d-flex gap-3 mt-3'>
                                {selectedImages.length > 0 &&
                                  selectedImages.map((image, index) => (
                                    <div key={index} className="image-preview bg-light p-2" style={{ position: 'relative' }}>
                                      <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
                                      <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removemainimage(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                      </svg></button>
                                    </div>
                                  ))
                                }
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <University_search_comments setCount={setCount} searchvalue={searchcomment} />
                  {/* ------------------------------- Layout section to display Pinned comments---------------------------------- */}
                  <div className={`${tablist ? 'd-none' : ''}`}>
                    <University_pinnedcomments setCount={setCount} count={count} pincomment_status={pincomment_status} />
                  </div>

                  {/* ------------------------------- Layout section to display Particular user comments---------------------------------- */}
                  <University_discussion_offcanvases usercomments_status={usercomments_status} count={count} setCount={setCount} />

                  {/* --- Universitity discussion map function starts here under this comments and replies will come-- */}
                  <div className={`${tablist && searchcomment.length <= 0 ? '' : 'd-none '}`}>
                    <h6 className={`text-center py-3 ${discussions.length > 0 ? 'd-none' : ''}`} style={{ color: '#5d5fe3', fontSize: '14px' }}> Post your comments ...💬</h6>
                    {discussions.slice(0, visibleDiscussions).map((x, index) => {
                      return (
                        <div key={index} style={{ zIndex: 4 }}>
                          <div className='col-12 px-1 px-md-3 bg-white pe-md-4 pt-2 pb-3 rounded shadow-sm border mb-3'>
                            <div className="row border-bottom py-3 m-0 align-items-center">
                              <div className="col-2 col-md-1 px-1 px-lg-0 d-flex justify-content-center">
                                <img src={x.user_id.profile_pic} className={x.user_id.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                <p className={x.user_id.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{x.user_id.nickname.slice(0, 1)}</span><span>{x.user_id.nickname.slice(-1)}</span></p>

                              </div>
                              <div className={`col-7 p-0 ${x.pinned_status ? 'col-md-8' : 'col-md-9'}`} onClick={() => {
                                setindex1(-1)
                              }} >
                                <h6 className='ms-sm-0 my-0 discussion_name'>
                                  <Link to={`/profile/${x.user_id.user_id}`} className="text-decoration-none text-dark">{x.user_id.nickname}</Link>
                                  <span className='fw-normal ms-2 text-secondary' style={{ fontSize: '13px' }}>{x.created_at}</span>
                                </h6>
                                <p className='ms-sm-0 my-0 d-flex align-items-center' style={{ fontSize: '12px', color: '#8587EA' }}>{user.university_name}  <span className={`ms-2 edit ${x.edited ? '' : 'd-none'}`}>Edited</span></p>
                              </div>
                              <div className={`${x.pinned_status ? 'col-3 justify-content-between' : 'col-2 justify-content-end'} d-flex align-items-center p-0`} style={{ position: 'relative' }}>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 250 }}
                                  overlay={renderTooltip("Unfollow")}
                                >
                                  <button data-bs-toggle="tooltip" data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title="Unfollow" onClick={() => {
                                      unpin(x.id)
                                    }} className={`p-1 btn btn-sm border px-2 ${x.pinned_status ? 'd-none d-md-inline' : 'd-none'}`} style={{ cursor: 'pointer' }}><span className=''>Followed</span></button>
                                </OverlayTrigger>


                                <span className="border-0" type="button" style={{ cursor: 'pointer' }} onClick={() => {
                                  if (index1 == index)
                                    setindex1(-1)
                                  else
                                    setindex1(index)
                                }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                    <path d="M17.5 27.0354C17.099 27.0354 16.7557 26.8926 16.4701 26.607C16.1845 26.3214 16.0417 25.9781 16.0417 25.5771C16.0417 25.176 16.1845 24.8327 16.4701 24.5471C16.7557 24.2615 17.099 24.1187 17.5 24.1187C17.9011 24.1187 18.2444 24.2615 18.53 24.5471C18.8156 24.8327 18.9584 25.176 18.9584 25.5771C18.9584 25.9781 18.8156 26.3214 18.53 26.607C18.2444 26.8926 17.9011 27.0354 17.5 27.0354ZM17.5 18.9585C17.099 18.9585 16.7557 18.8157 16.4701 18.5301C16.1845 18.2445 16.0417 17.9012 16.0417 17.5001C16.0417 17.0991 16.1845 16.7558 16.4701 16.4702C16.7557 16.1846 17.099 16.0418 17.5 16.0418C17.9011 16.0418 18.2444 16.1846 18.53 16.4702C18.8156 16.7558 18.9584 17.0991 18.9584 17.5001C18.9584 17.9012 18.8156 18.2445 18.53 18.5301C18.2444 18.8157 17.9011 18.9585 17.5 18.9585ZM17.5 10.8815C17.099 10.8815 16.7557 10.7388 16.4701 10.4532C16.1845 10.1676 16.0417 9.82424 16.0417 9.42318C16.0417 9.02214 16.1845 8.67882 16.4701 8.39323C16.7557 8.10764 17.099 7.96484 17.5 7.96484C17.9011 7.96484 18.2444 8.10764 18.53 8.39323C18.8156 8.67882 18.9584 9.02214 18.9584 9.42318C18.9584 9.82424 18.8156 10.1676 18.53 10.4532C18.2444 10.7388 17.9011 10.8815 17.5 10.8815Z" fill="#2A3941" />
                                  </svg>
                                </span>
                                <ul className={`bg-white shadow-sm border rounded mt-0 p-0 px-3 ${index1 == index ? '' : 'd-none'}`} style={{ width: '160px', position: 'absolute', right: '26px', top: '0px' }}>
                                  <button className={x.user_id.user_id != user.user_id || x.created_at.includes("day") || x.created_at.includes("week") || x.created_at.includes("year") ? 'd-none' : 'bg-transparent border-0 my-2 d-flex align-items-center'} data-bs-toggle="modal" data-bs-target="#editModal3" onClick={() => {
                                    editPosts(x.id)
                                  }} style={{ height: '20px' }}><span className="dropdownmenu"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none">
                                    <path d="M1.25 18.75H2.62259L15.9952 5.37741L14.6226 4.00481L1.25 17.3774V18.75ZM0 20V16.851L16.476 0.358156C16.604 0.243969 16.7454 0.155729 16.9001 0.0934372C17.0549 0.0311455 17.2162 0 17.3841 0C17.552 0 17.7146 0.0264383 17.8721 0.0793133C18.0295 0.132209 18.1747 0.227563 18.3077 0.365376L19.6418 1.70672C19.7797 1.83974 19.8738 1.98566 19.9243 2.14447C19.9748 2.30328 20 2.46209 20 2.62091C20 2.7903 19.9714 2.95236 19.9143 3.10709C19.8573 3.26182 19.7664 3.40321 19.6418 3.53125L3.14903 20H0ZM15.2968 4.70316L14.6226 4.00481L15.9952 5.37741L15.2968 4.70316Z" fill="black" />
                                  </svg></span><span className="ms-2">{translate_value.common_words.edit}</span></button>

                                  <button className={`bg-transparent border-0 my-2 ${x.pinned_status ? 'd-none' : 'd-flex align-items-center'}`} onClick={() => {
                                    pincomment(x.id)
                                  }} style={{ height: '20px' }}><span className="dropdownmenu"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin" viewBox="0 0 16 16">
                                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                  </svg></span> <span className="ms-2">Follow</span></button>

                                  {/* ----------------------------------------------------Report button--------------------------------------------------- */}
                                  <button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-none' : 'd-flex align-items-center'}`}
                                    onClick={() => {
                                      setreport_id(x.id)
                                      setreport_status(true)
                                    }} style={{ height: '20px' }}><span className="dropdownmenu"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                      <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#000" />
                                    </svg></span> <span className="ms-2">Report</span></button>

                                  <button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-flex align-items-center' : 'd-none'}`} style={{ height: '20px', color: '#FF845D' }}><span className="dropdownmenu"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                    <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D" />
                                  </svg></span> <span className="ms-2">Reported</span></button>

                                  <button className={`bg-transparent border-0 my-2 ${user.user_id === x.user_id.user_id ? 'd-flex align-items-center' : 'd-none'}`} onClick={() => {
                                    deletePost(x.id)
                                  }} style={{ height: '20px' }}><span className="dropdownmenu"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                                    <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black" />
                                  </svg></span><span className="ms-2">{translate_value.common_words.delete}</span></button>
                                </ul>

                                {/* ---------------------------------------Edit post section (Edit the Post for 24 hours)--------------------------------------------- */}

                                <div className="modal fade" id="editModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                  <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                      <div className="modal-body">
                                        <div className=' bg-white px-3 pt-2 pb-3 rounded'>
                                          <h6 className='pb-2 ps-1'>Edit the Post</h6>
                                          <div className='d-flex gap-3'>
                                            <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                            {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                            <div className="input-group bg-light rounded border pe-3">
                                              <input
                                                type="text"
                                                name="question"
                                                onChange={(e) => editpostfunctionData(
                                                  e.target.value
                                                )}
                                                value={editedpost}
                                                className="form-control bg-transparent py-3 ps-3 shadow-none border-0" placeholder="Ask a question....."
                                                style={{ position: 'relative' }} />
                                              <button data-bs-dismiss="modal" disabled={editedpost.length > 0 ? false : true} onClick={() => {
                                                sendEditedData(x.id)
                                              }} className='text-secondary bg-transparent border-0'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                  <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696" />
                                                </svg></button>
                                            </div>

                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* END OF EDIT POST */}
                              </div>
                            </div>

                            {/* -----------------------------------------Comment images section------------------------------------------ */}
                            <div onClick={() => {
                              setindex1(-1)
                            }} className='py-2 ms-1 pt-3'>
                              <p className='m-0 discussion_post' id={x.id}>{x.discussion}</p>
                              {x.images_attached && (
                                x.images_attached.map((z) => {
                                  return (
                                    <div className='d-flex justify-content-center'>
                                      <img src={z.image} width={300} alt="" className='mt-3' />
                                    </div>
                                  )
                                })
                              )}

                            </div>
                            <div onClick={() => {
                              setindex1(-1)
                            }} className='d-flex justify-content-between border-bottom pt-3 pb-4 ps-2'>
                              <div className="d-flex align-items-center">
                                <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: x.status ? "#ff845d" : "gray" }} onClick={() => {
                                  if (x.status == true) {
                                    handleLike1(x.id)
                                  }
                                  else {
                                    handleLike(x.id)
                                  }
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor" />
                                  </svg> <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: '22px' }} className="ms-1">{x.likes}</span></button>

                                <button className='bg-transparent border-0 ms-4 d-flex align-items-center' style={{ height: '20px', color: x.dis_status ? "#ff845d" : "gray" }} onClick={() => {
                                  if (x.dis_status == true) {
                                    handledislike1(x.id)
                                  }
                                  else {
                                    handledislike(x.id)
                                  }
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                    <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor" />
                                  </svg></button>
                              </div>
                              {x.replies_count > 0
                                && (
                                  <div className="w-75 d-flex justify-content-end">
                                    <div className="d-flex" style={{ width: '50%' }}>
                                      <button className='ms-4 bg-transparent border-0 fw-bold' style={{ color: '#5D5FE3', fontSize: '14px' }} onClick={(e) => {
                                        setreply_status(!replies_status)
                                        getreplies(x.id)
                                      }}>{translate_value.dashboard.view_all} {x.replies_count} {translate_value.dashboard.replies}</button>
                                      <div className="ms-2 comment-section-img" style={{ position: 'relative' }}>
                                        {x.replies.slice(0, 5).map((a, index) => {
                                          return (
                                            <>
                                              {a.user_id && a.user_id.profile_pic != undefined ? (<img className="rounded-circle" src={a.user_id.profile_pic} width={24} style={{ left: `${index * 20}px`, position: "absolute", top: '-2px', height: '30px', width: '30px' }} alt="" />) : (<></>)}
                                            </>
                                          )
                                        })}
                                        {/* <span className="bg-secondary p-1 rounded-circle px-2" style={{position:'absolute',left:'94px'}}>{x.replies}</span> */}
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            </div>

                            {/* --------------------------------Replies section for the particular comment-------------------------------------- */}

                            {fetchedreplies && fetchedreplies.length > 0 && (
                              <div className={fetchedreplies[0].udisid == x.id && replies_status ? 'd-block' : 'd-none'}>
                                {fetchedreplies.map((y, index2) => {

                                  return (
                                    <div key={index2} className='ps-0 ps-md-3 py-2 mt-3 bg-white' onClick={() => {
                                      setindex1(-1)
                                    }} >
                                      <div className="row w-100 align-items-center">
                                        <div className="col-2 col-md-1 d-flex justify-content-center">
                                          <img src={y.user_id.profile_pic} className={y.user_id.profile_pic == null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
                                          <p className={y.user_id.profile_pic == null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{ fontSize: '14px', height: '30px', width: '30px' }}><span>{y.user_id.nickname.slice(0, 1)}</span><span>{y.user_id.nickname.slice(-1)}</span></p>
                                        </div>
                                        <div className="col-6 col-lg-8 ps-0 p-0">
                                          <h6 className='ms-sm-0 my-0' style={{ fontSize: '12px' }}>
                                            <Link to={`/profile/${y.user_id.user_id}`} className="text-decoration-none text-dark">{y.user_id.nickname}</Link>
                                          </h6>
                                          <p className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                        </div>
                                        <div className="col-4 col-lg-3 px-0 px-md-3 p-0 d-flex justify-content-between align-items-center">
                                          <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: y.status ? "#ff845d" : "gray" }} onClick={() => {
                                            if (y.status == true) {
                                              handleReplyLike1(y.id, x.id, index)
                                            }
                                            else {
                                              handleReplyLike(y.id, x.id, index)
                                            }
                                          }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                              <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor" />
                                            </svg> <span className="ms-1">{y.likes_count}</span></button>
                                          <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: y.dis_like_status ? "#ff845d" : "gray" }} onClick={() => {
                                            if (y.dis_like_status == true) {
                                              handlereplydislike1(y.id, x.id, index)
                                            }
                                            else {
                                              handlereplydislike(y.id, x.id, index)
                                            }
                                          }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                              <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor" />
                                            </svg></button>
                                          <button className={user.first_name === y.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'} onClick={() => {
                                            deleteReply(y.id, x.id)
                                          }} style={{ height: '20px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                              <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#8E9696" />
                                            </svg></button>
                                        </div>
                                      </div>
                                      <div className='ps-2 ps-md-0 ps-lg-5 mt-2 m-0'>
                                        <p className='m-0' style={{ fontSize: '14px', color: '#8e9696' }}>{y.post}</p>
                                        {y.images_attached.map((a) => {
                                          return (
                                            <div className='d-flex justify-content-center'>
                                              <img src={a.university_discussion_reply_images} width={300} alt="" className='mt-3' />
                                            </div>
                                          )
                                        })}

                                        {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
                                        <div className="mt-2 ps-0">
                                          <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal7" onClick={() => {
                                            setdiscuss_id(x.id)
                                            setreply_id(y.id)
                                          }} style={{ cursor: 'pointer' }} className="reply_for_reply fw-bold d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <path d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z" fill="#2A3941" />
                                            </svg> <span className="ms-1">reply</span></span>

                                          <p style={{ cursor: 'pointer' }} className={`view_reply_for_reply mt-2 ${y.replies_count > 0 ? '' : 'd-none'}`} onClick={() => {
                                            setreplies_for_reply_status(!replies_for_reply_status)
                                            getreplies_for_reply(y.id)
                                          }}>---View {y.replies_count} replies</p>

                                          {fetchedreplies_for_reply && fetchedreplies_for_reply.length > 0 && (
                                            <div className={fetchedreplies_for_reply[0].reply == y.id && replies_for_reply_status ? 'd-block' : 'd-none'}>
                                              {fetchedreplies_for_reply.map((z) => {

                                                return (
                                                  <div className='ps-0 ps-md-3 py-2 mt-3 bg-white' onClick={() => {
                                                    setindex1(-1)
                                                  }} >
                                                    <div className="row w-100 align-items-center">
                                                      <div className="col-2 col-md-1 d-flex justify-content-center">
                                                        <img src={z.user_id.profile_pic} className={z.user_id.profile_pic == null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
                                                        <p className={z.user_id.profile_pic == null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{ fontSize: '14px', height: '30px', width: '30px' }}><span>{z.user_id.nickname.slice(0, 1)}</span><span>{z.user_id.nickname.slice(-1)}</span></p>
                                                      </div>
                                                      <div className="col-6 col-lg-8 ps-0 p-0">
                                                        <h6 className='ms-sm-0 my-0' style={{ fontSize: '12px' }}>
                                                          <Link to={`/profile/${z.user_id.user_id}`} className="text-decoration-none text-dark">{z.user_id.nickname}</Link>
                                                        </h6>
                                                        <p className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                                      </div>
                                                      <div className="col-4 col-lg-3 px-0 px-md-3 p-0 d-flex justify-content-between align-items-center">
                                                        <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: z.liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                          handleReplies_reply_like(z.id, y.id)
                                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                                                            <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor" />
                                                          </svg> <span className="ms-1" style={{ fontSize: '14px' }}>{z.likes}</span></button>
                                                        <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: z.dis_liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                          handlereplies_replydislike(z.id, y.id)
                                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                                                            <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor" />
                                                          </svg></button>
                                                        <button className={user.first_name === z.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'} onClick={() => {
                                                          deleteReply_for_reply(z.id, y.id, x.id)
                                                        }} style={{ height: '20px' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 18 20" fill="none">
                                                            <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#8E9696" />
                                                          </svg></button>
                                                      </div>
                                                    </div>
                                                    <div className='ps-0 ps-lg-5 mt-2 m-0'>
                                                      <p className='m-0' style={{ fontSize: '14px', color: '#8e9696' }}>{z.post}</p>
                                                      {z.images_attached.map((b) => {
                                                        return (
                                                          <div className='d-flex justify-content-center'>
                                                            <img src={b.university_discussion_reply_reply_images} width={300} alt="" className='mt-3' />
                                                          </div>
                                                        )
                                                      })}
                                                    </div>
                                                  </div>
                                                )
                                              })}

                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}

                              </div>
                            )}

                            {/* ------------------------------------To post the reply for the comments along with images-------------------------- */}

                            <div onClick={() => {
                              setindex1(-1)
                            }} className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center'>
                              <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                              {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                              <div className="input-group border rounded pe-3 bg-light">
                                <input key={index}
                                  type="text"
                                  name={post}
                                  onChange={repliesData}
                                  className="form-control py-3 ps-3 shadow-none border-0 bg-light original-reply-input" placeholder={translate_value.dashboard.reply_here}
                                  style={{ position: 'relative' }} />
                                <div className='d-flex align-items-center bg-light'>
                                  <input
                                    id="file1"
                                    type='file'
                                    name='file'
                                    accept="image/*"
                                    multiple
                                    onChange={handleReplyImage1}
                                    className="bg-light text-center p-3 btn"
                                  />
                                  <label data-bs-toggle="tooltip" data-bs-placement="top"
                                    data-bs-custom-class="custom-tooltip"
                                    data-bs-title="Attach Image"
                                    htmlFor="file1"
                                    className="custom-file-input bg-transparent border-0 px-4 py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                      <path d="M21.6827 19.4231C21.6827 21.3164 21.0304 22.9276 19.7259 24.2565C18.4214 25.5855 16.8261 26.25 14.9399 26.25C13.0536 26.25 11.4543 25.5855 10.1418 24.2565C8.82928 22.9276 8.17303 21.3164 8.17303 19.4231V8.50962C8.17303 7.1875 8.62776 6.0637 9.53722 5.13822C10.4467 4.21274 11.5625 3.75 12.8846 3.75C14.2067 3.75 15.3225 4.21274 16.2319 5.13822C17.1414 6.0637 17.5961 7.1875 17.5961 8.50962V18.8462C17.5961 19.5801 17.34 20.2123 16.8279 20.7428C16.3157 21.2732 15.6915 21.5385 14.9553 21.5385C14.2191 21.5385 13.5857 21.2774 13.0553 20.7552C12.5248 20.2331 12.2596 19.5967 12.2596 18.8462V8.46153H13.5096V18.8462C13.5096 19.2452 13.6462 19.5853 13.9194 19.8666C14.1927 20.1478 14.5288 20.2885 14.9278 20.2885C15.3269 20.2885 15.663 20.1478 15.9363 19.8666C16.2095 19.5853 16.3461 19.2452 16.3461 18.8462V8.48556C16.3413 7.51442 16.0074 6.69071 15.3445 6.01444C14.6815 5.33815 13.8616 5 12.8846 5C11.9154 5 11.0961 5.34215 10.4269 6.02644C9.75765 6.71073 9.42303 7.53846 9.42303 8.50962V19.4231C9.41824 20.9663 9.9527 22.2816 11.0264 23.369C12.1001 24.4563 13.4075 25 14.9486 25C16.4679 25 17.7594 24.4563 18.8229 23.369C19.8865 22.2816 20.4231 20.9663 20.4327 19.4231V8.46153H21.6827V19.4231Z" fill="#8E9696" />
                                    </svg>
                                  </label>
                                  <button
                                    onClick={() => {
                                      postReplies(x.id, index);
                                    }}
                                    disabled={replies.length > 0 ? false : true}
                                    className='h-100 bg-transparent border-0 ms-2'
                                  >
                                    <div className={`spinner-border spinner-border-sm ${load2 ? '' : 'd-none'}`} role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <svg data-bs-toggle="tooltip" data-bs-placement="top"
                                      data-bs-custom-class="custom-tooltip"
                                      data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" className={`${load2 ? 'd-none' : ''}`} width="30" height="30" viewBox="0 0 30 30" fill="none">
                                      <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                            </div>

                            {/* ------------------------------To display the selected images before posting reply--------------------------------------- */}

                            <div className='d-flex gap-3 mt-3'>
                              {repliesImage1.length > 0 &&
                                repliesImage1.map((image, index) => (
                                  <div key={index} className="image-preview bg-light p-2" style={{ position: 'relative' }}>
                                    <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
                                    <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removeImage(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                    </svg></button>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {visibleDiscussions < discussions.length && (
                      <div className="mt-3 col-sm-12 text-center">
                        <button onClick={loadMoreDiscussions} className="btn fw-medium text-decoration-underline outline-0" style={{ color: '#5D5FE3' }}>
                          Load More ...
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
              <div onClick={() => {
                setindex1(-1)
              }} className="col-lg-3 p-0">
                <div className="w-100 pt-2 px-2 bg-white shadow-sm rounded d-flex flex-column align-items-center" style={{ height: '400px' }}>
                  <img src={require('../img/images_icons/send-img1.png')} style={{ height: '60px', width: '60px' }} alt="" />
                  <img src={require('../img/images_icons/mascot1.png')} style={{ height: '250px', width: '118px' }} alt="" />
                  <button className='btn w-100 fw-medium mt-3' style={{ border: '1px solid #5D5FE3', color: '#5D5FE3', fontSize: '16px', fontWeight: 500, letterSpacing: '0.32px', lineHeight: '22px' }} data-bs-toggle="modal"
                    data-bs-target="#postmodal">{translate_value.dashboard.create_a_post}</button>
                </div>
              </div>
            </div>
          </div>


          {/* -----------------------------------------------To post the reply for reply modal------------------------------------------ */}
          <div className="modal fade" id="replyforreply_modal7" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

            <div className="modal-dialog  modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-body">
                  <div className='col-12 bg-white px-3 pt-2 pb-3'>
                    <h6 className='pb-2 ps-1'>Post a Reply for Reply</h6>
                    <div className='d-flex gap-3 align-items-center'>
                      <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                      {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                      <div className="input-group bg-light border rounded pe-3">
                        <input
                          type="text"
                          name="question"
                          value={reply_for_reply}
                          onChange={(e) => {
                            setReply_for_reply(e.target.value)
                          }}
                          className="form-control py-3 ps-3 bg-light border-0 shadow-none post-input" placeholder="Post your reply....."
                          style={{ position: 'relative' }} />
                        <div className='d-flex align-items-center bg-light'>
                          <input
                            id="fileInput2"
                            type='file'
                            name='file'
                            accept="image/*"
                            multiple
                            onChange={handleReply_reply_Image}
                            className="bg-light text-center p-3 btn"
                          />
                          <label data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-custom-class="custom-tooltip"
                            data-bs-title="Attach Image"
                            htmlFor="fileInput2"
                            className="custom-file-input bg-transparent border-0 px-4 py-2">
                            <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
                          </label>
                          <button disabled={reply_for_reply.length > 0 ? false : true} data-bs-dismiss="modal" onClick={postreply_for_replies} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' >
                            <svg data-bs-toggle="tooltip" data-bs-placement="top"
                              data-bs-custom-class="custom-tooltip"
                              data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                              <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                    <div className='d-flex gap-3 mt-3'>
                      {replies_reply_Image.length > 0 &&
                        replies_reply_Image.map((image, index) => (
                          <div key={index} className="image-preview bg-light p-2" style={{ position: 'relative' }}>
                            <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
                            <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removeImage3(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg></button>
                          </div>
                        ))
                      }
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <BackToTopButton />

          {/* --------------------------------------------ADD SUBJECTS PAGE----------------------------------------------------- */}

          <Addsubjects status={status} setCount1={setCount1} setStatus={setStatus} />

          <Report_post disc_type={"university"} setCount={setCount} setindex1={setindex1} report_status={report_status} setreport_status={setreport_status} discussion_id={report_id} />


          {/* First login message */}
          <Login_message state={state} setstate={setstate} />
        </div>
      )}

      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

          <div className="toast-body d-flex justify-content-between">
            <span id='toastbody'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
      <div className="d-none">
        <Navpath />
      </div>
    </div>
  );
};

export default Dashboard
