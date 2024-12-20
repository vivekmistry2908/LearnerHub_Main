import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import { ipaddress } from '../App'
import { ipaddress2 } from '../App'
import Create_flashcard_study_list from './Create_Flashcard_study_list'
import Preloader from './Preloader'
import { Context } from '../context/Context_provider'
import Small_Preloader from './Small_loader'
import Backtotop from './Backtotop'
import Navpath from './Navpath'
import Create_study_list from './Create_study_list'
import Report_post from './Report_post'
import Subject_discussion from './Subject_discussion'
import Subject_user_comments from './Subject_user_comments'
import Subject_search_comments from './Subjects_search_comments'
import { toast } from 'react-toastify'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axiosInstance from './axiosInstance'
import { getAccessToken } from './authService'
import * as bootstrap from 'bootstrap';


const Subjects = () => {

  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );

  const { course_id } = useParams()
  const { course_name } = useParams()
  const userdata = JSON.parse(sessionStorage.getItem("user"))

  const [loading, setloading] = useState(true)
  const [subloading, setsubloading] = useState()
  const [replies_layout, setreplies_layout] = useState(false)
  const [pinnedcomment_status, setpinnedcomment_status] = useState(false)
  const [usercomment_status, setusercomment_status] = useState(false)
  let [count, setCount] = useState(0)
  let [count1, setCount1] = useState(0)
  const [flashsetid, setflashsetid] = useState("")
  const [document_id, setdocument_id] = useState()
  const [index1, setindex1] = useState(-1)
  const [courseDetails, setCourseDetails] = useState({})
  const [courseDocuments, setCourseDocuments] = useState([])
  const [userComments, setuserComments] = useState([])
  const [pinnedComments, setpinnedComments] = useState([])
  const [flashsets, setflashsets] = useState([])
  const [userdetails, setUserdetails] = useState({})
  const [original_status, setoriginal_status] = useState(true)


  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    // To fetch user details
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r) => {
        console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
      })
      .catch(() => {
        console.log("User Details Fetching Error")
      })

    fetchcoursedetails()
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Cleanup function to destroy tooltips when the component unmounts
    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };

  }, [course_name, count])

  // -------------------------------------------------Functionality for Path direction flow--------------------------------

  const [count3, setCount3] = useState(0)
  sessionStorage.setItem("name2", JSON.stringify(`${course_name}`))
  sessionStorage.setItem("path2", JSON.stringify(`/subjects/${course_id}/${course_name}`))
  sessionStorage.removeItem('name3')
  sessionStorage.removeItem('path3')


  // -----------------------------------To fetch all the documents under the particular subject--------------------------------
  const fetchdocuments = () => {
    setsubloading(true)
    axiosInstance.get(`${ipaddress}/courseDocuments/${course_id}/${userdata.user_id}/`)
      .then((r) => {
        console.log("Course Documents Fetched Successfully :", r.data)
        const docs = r.data.reverse()
        setCourseDocuments(docs)
        setsubloading(false)
      })
      .catch((err) => {
        console.log("Course Documents fetching Error", err)
      })
  }

  // -----------------------------------To fetch the particular course details----------------------------------------------

  const fetchcoursedetails = () => {
    axiosInstance.get(`${ipaddress}/CourseDetailsView/${course_id}/${userdata.user_id}/`)
      .then((r) => {
        console.log("Course Details Fetched Successfully :", r.data)
        setCourseDetails(r.data)
        setloading(false)
      })
      .catch(() => {
        console.log("Course Details fetching Error")
      })
  }

  // ------------------------------------FLASHCARDS FUNCTIONALITIES-----------------------------------------------------

  const [flashsetstatus, setflashsetstatus] = useState("public")


  // -----------------------------To get all the flashsets under the particular module---------------------------------------

  const getallflashsetsundersubject = () => {
    setsubloading(true)
    axiosInstance.get(`${ipaddress2}/flashcardsetsRetrive/${course_id}/${userdata.user_id}/`)
      .then((r) => {
        console.log("Course Flashsets Fetched Successfully :", r.data)
        setflashsets(r.data)
        setSearchedFlashsets([])
        setsubloading(false)
        setsearchflashsetname("")
      })
      .catch((err) => {
        console.log("Course Flashsets fetching Error", err)
      })
  }

  // ----------------------------To get the particular user's Flashsets-----------------------------------------

  const getparticularusersflashsets = () => {
    setsubloading(true)
    axiosInstance.get(`${ipaddress2}/myflashset/${userdata.user_id}/${course_id}/`)
      .then((r) => {
        console.log("Particular user's Flashsets Fetched Successfully :", r.data)
        setflashsets(r.data)
        setSearchedFlashsets([])
        setsubloading(false)
        setsearchflashsetname("")
      })
      .catch(() => {
        console.log("Particular user's Flashsets fetching Error")
      })
  }

  // -------------------------------------------------LOAD MORE FUNCTIONALITY-----------------------------------------------
  const [visibleDiscussions, setVisibleDiscussions] = useState(5); // Set an initial number of discussions to display
  const discussionsPerPage = 5; // Set the number of discussions to load on each "Load More" click

  const loadMoreDiscussions = () => {
    // Increase the number of visible discussions by the discussionsPerPage value
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

  // ----------------------------------------POST IMAGE UPLOAD--------------------------------------------------------
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = event.target.files;

    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setSelectedImages(Array.from(files));
    } else {
      setSelectedImages([]);
    }
  };

  const removemainImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postQuestion = async (e) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const formData = new FormData();

    for (const file of selectedImages) {
      formData.append('file', file);
    }
    const encoded_question = encodeURIComponent(question)

    if (question.length > 0) {
      try {
        const token = getAccessToken()

        const response = await fetch(`${ipaddress}/CourseDiscussion/${user.user_id}/${course_id}/""/?post=${encoded_question}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('Files uploaded successfully', formData);
          setCount(count + 1);

          toast.success('Comment posted successfully', {
            autoClose: 2000,
          })
          setSelectedImages([])

          // Set the question to an empty string after a successful post
          setQuestion("");
        } else {
          console.error('Failed to upload files');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };



  // -----------------------------------------------REPLIES IMAGE UPLOAD--------------------------------------------------
  const [repliesImage, setRepliesImage] = useState([]);
  const [load, setload] = useState()

  const clearInput = (index) => {
    const inputElement = document.getElementsByClassName('reply-input');
    if (inputElement) {
      inputElement[index].value = '';
    }
  };

  const handleReplyImage = (event) => {
    const files = event.target.files
    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setRepliesImage(Array.from(files));
    } else {
      setRepliesImage([]);
    }
  };

  const removeImage = (index) => {
    setRepliesImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postReplies = async (dis_id, index) => {
    setload(true)
    const user = JSON.parse(sessionStorage.getItem('user'))
    const formData = new FormData();
    for (const file of repliesImage) {
      formData.append('file', file);
    }
    const encoded_reply = encodeURIComponent(replies)

    if (replies.length > 0) {
      try {
        const token = getAccessToken()

        const response = await fetch(`${ipaddress}/CourseDiscussionReply/${user.user_id}/${dis_id}/""/?post=${encoded_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('Reply Sent successfully',formData);
          toast.success('Replied successfully', {
            autoClose: 2000,
          })
          setCount(count + 1)
          clearInput(index)
          setRepliesImage([])
          setreplies_layout(false)
          setReplies("")
          getdiscussion()
          setload(false)
        } else {
          setload(false)
          console.error('Reply sending error');
        }
      } catch (error) {
        console.error('Error reply uploading files:', error);
      }
    }
  }

  // --------------------Functionality to post replies under a reply---------------------------------------------------------
  const [reply_id, setreply_id] = useState(0)
  const [discuss_id, setdiscuss_id] = useState(0)
  const [reply_index, setreply_index] = useState(0)
  const [replies_for_reply_status, setreplies_for_reply_status] = useState(false)
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

  const removereply_Image = (index) => {
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

        const response = await fetch(`${ipaddress}/CourseDiscussionRepliesReply/${user.user_id}/${reply_id}/""/?post=${encoded_reply_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log('Subject Reply for reply Sent successfully', response.data);
          setReply_for_reply("")
          getreplies(discuss_id)
          setreplies_for_reply_status(false)
          setReplies_reply_image([])
        } else {
          console.error('University Reply under reply sending error');
        }
      } catch (error) {
        console.error('Error reply uploading files:', error);
      }
    }
  }

  // ----------------------------------------------------GET DISCUSSION-------------------------------------------------
  const [discussions, setDiscussions] = useState([])
  // const[likesCount,setLikesCount]=useState(0)

  const getdiscussion = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.get(`${ipaddress}/ocoursediscussion/${user.user_id}/${course_id}/`)
      .then((r) => {
        console.log("Course Discussion data successfully fetched :", r.data)
        setDiscussions(r.data.reverse())
        // setLikesCount(r.data.likes)
        setloading(false)
      })
      .catch(() => {
        console.log("Course Discussion data fetching Error")
      })
  }


  useEffect(() => {
    setSearchcomment("")
    getdiscussion()
  }, [course_name, count])


  // ---------------------------------Functionality to exit from the group------------------------------------------------------

  const [exitgroup_reason, setexitgroup_reason] = useState("")
  const navigate = useNavigate()
  const leaveCourse = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.post(`${ipaddress}/ExitGroup/${user.user_id}/${course_id}/`, {
      'reason': exitgroup_reason
    })
      .then((r) => {
        navigate('/dashboard/page')
      })
  }

  // ------------------------------------------Like and Unlike the post in discussion-------------------------------------------------------

  function handleLike1(discussion_id) {
    axiosInstance.delete(`${ipaddress}/DiscussionLikes/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("User Unliked the Post",r.data)
        getdiscussion()
        setCount(count + 1)
      })
      .catch(() => {
        console.log("User Unlike error")
      })
  }
  function handleLike(discussion_id) {
    axiosInstance.post(`${ipaddress}/DiscussionLikes/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        //  console.log("User liked the Post",r.data)
        getdiscussion()
      })
      .catch(() => {
        console.log("User like error")
      })
  }

  //-----------------------------To like and unlike the replies under particular comment in the discussion-----------------

  function handleReplyLike1(discussion_id, discid, index) {
    axiosInstance.delete(`${ipaddress}/DiscussionRepliesLikes/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        console.log("User Unliked the Reply", r.data)
        //  getdiscussion()
        //  setCount(count+1)
        getreplies(discid, index)
      })
      .catch(() => {
        console.log("User Reply Unlike error")
      })
  }
  function handleReplyLike(discussion_id, discid, index) {
    axiosInstance.post(`${ipaddress}/DiscussionRepliesLikes/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        console.log("User liked the Reply", r.data)
        getreplies(discid, index)
      })
      .catch((err) => {
        console.log("User Reply like error", err)
      })
  }

  // ------------------------------------------------To dislike the post in discussion-------------------------------------------------------

  function handledislike(discussion_id) {
    axiosInstance.post(`${ipaddress}/CourseDiscussionDisLike/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        console.log("User Disliked the Post", r.data)
        getdiscussion()
      })
      .catch(() => {
        console.log("User like error")
      })
  }

  // ------------------------------------------------To dislike the repliy in discussion-------------------------------------------------------

  function handlereplydislike(discussion_id, discid, index) {
    axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesDisLikes/${userdata.user_id}/${discussion_id}/`)
      .then((r) => {
        console.log("User Disliked the Post", r.data)
        getreplies(discid, index)
      })
      .catch(() => {
        console.log("User like error")
      })
  }

  //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------

  function handleReplies_reply_like(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesReplyLikes/${userdata.user_id}/${replies_reply_id}/`)
      .then((r) => {
        console.log("User liked the Replies reply", r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch((err) => {
        console.log("User Replies reply like error", err)
      })
  }

  //  -----------------------------Functionality to dislike the reply uneder particular reply----------------------------------
  function handlereplies_replydislike(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesReplyDislike/${userdata.user_id}/${replies_reply_id}/`)
      .then((r) => {
        console.log("University Replies reply disliked", r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch(() => {
        console.log("University replies reply dislike error")
      })
  }



  // -----------------------------------------------------To Edit the post in subject discussion--------------------------------------------------------
  const [editedpost, setEditedpost] = useState("")
  const [discussionId, setdiscussionId] = useState(0)

  const editpostfunctionData = (value) => {
    setEditedpost(value)
  }

  const editPosts = (discid) => {
    setdiscussionId(discid)
    const foundDiscussion = discussions.find((x) => discid === x.discid);

    if (foundDiscussion) {
      setEditedpost(foundDiscussion.post);
    }
  }

  const sendEditedData = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const formData = new FormData();
    formData.append('post', editedpost);

    axiosInstance.put(`${ipaddress}/CourseDiscussionEdit/${userdata.user_id}/${course_id}/${discussionId}/`, formData)
      .then((r) => {
        setCount(count + 1)
        toast.success('Post updated successfully', {
          autoClose: 2000,
        })
        setindex1(-1)
      })
      .catch(() => {
        console.log("Post Editing Error")
      })

  };

  // ------------To fetch all the replies corresponding to the particular post when we click on view all comments----------------------------------------------------------------

  const [fetchedreplies, setFetchedreplies] = useState([])
  const getreplies = (discussion_id, index) => {
    axiosInstance.get(`${ipaddress}/coursecommentsreplies/${discussion_id}/${userdata.user_id}/`)
      .then((r) => {
        console.log("Replies", r.data)
        setFetchedreplies(r.data.reverse())
        setCount(count + 1)
      })
  }

  // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
  const [fetchedreplies_for_reply, setFetchedreplies_for_reply] = useState([])

  const getreplies_for_reply = (particular_reply_id) => {
    axiosInstance.get(`${ipaddress}/CourseDiscussionRepliesReply/${userdata.user_id}/${particular_reply_id}/`)
      .then((r) => {
        console.log("Course Replies under reply fetched successfully", r.data)
        setFetchedreplies_for_reply(r.data.reverse())
        // setCount(count+1)
      })
  }


  // ---------------------------------To Delete the  particular post from the discussion--------------------------------------------------------

  const deletePost = (discussion_id) => {
    axiosInstance.delete(`${ipaddress}/CDDI/${discussion_id}/`)
      .then((r) => {
        setCount(count + 1)
        toast.success('Post successfully deleted', {
          autoClose: 2000,
        })
        setindex1(-1)
      })
      .catch((err) => {
        console.log("Post Delete Error", err)
      })
  }

  // -------------------------To Delete the particular reply under the specific post in the discussion--------------------------------------------------------

  const deleteReply = (disc_reply_id, discid) => {
    axiosInstance.delete(`${ipaddress}/CourseDiscussionReplydelete/${disc_reply_id}/`)
      .then((r) => {
        setCount(count + 1)
        toast.success('Reply successfully deleted', {
          autoClose: 2000,
        })
        getreplies(discid)
      })
      .catch(() => {
        console.log("Reply Delete Error")
      })
  }

  // -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------

  const deleteReply_for_reply = (reply_reply_id, disc_reply_id, discid) => {
    axiosInstance.delete(`${ipaddress}/CourseDiscussionRepliesReply/${userdata.user_id}/${reply_reply_id}/`)
      .then((r) => {
        toast.success('Successfully deleted', {
          autoClose: 2000,
        })
        getreplies(discid)
        getreplies_for_reply(disc_reply_id)
      })
      .catch((err) => {
        console.log("Replies reply Delete Error", err)
      })
  }


  // -------------------------------------------------SEARCH COMMENTS-------------------------------------------------------
  const [searchcomment, setSearchcomment] = useState("");

  // ------------------------------------------------FILTER DOCUMENTS-------------------------------------------------------
  const [filtereddocuments, setFiltereddocuments] = useState([])
  const [filteredratingdocs, setFilteredratingdocs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("select_filter1")

  const filterdocs = (e) => {
    const value = e.target.value
    if (e.target.value === "likes") {
      filterfunction(`${ipaddress}/filterdocumentscourse/${course_id}/${userdata.user_id}/`)
    }
    if (e.target.value === "rating") {
      filterfunction(`${ipaddress}/FilterCourseDocumentsByRating/${course_id}/${userdata.user_id}/`)
    }
    if (e.target.value === "select_filter") {
      original()
    }
    if (e.target.value === "date") {
      filterfunction(`${ipaddress}/filterdocumentscoursebydate/${course_id}/${userdata.user_id}/`)
    }
    if (e.target.value === "exam_paper") {
      filterfunction2(e.target.value)
    }
    if (e.target.value === "notes") {
      filterfunction2(e.target.value)
    }
    if (e.target.value === "chapter") {
      filterfunction2(e.target.value)
    }

  }
  const original = () => {
    document.getElementById('original').style.display = 'block'
    document.getElementById('filterlike').style.display = 'none'
  }

  const filterfunction = (value) => {
    if (value === "select_filter") {
      original()
    }
    else {
      axiosInstance.get(value)
        .then((r) => {
          console.log("Filtered Successfuly", r.data)
          setFiltereddocuments(r.data)
          document.getElementById('original').style.display = 'none'
          document.getElementById('filterlike').style.display = 'block'
        })
    }
  }

  const filterfunction2 = (category, value) => {
    axiosInstance.post(`${ipaddress}/DocumentsBasedOnCategory/${userdata.user_id}/${category}/${course_id}/`, {
      'sort_by': value
    })
      .then((r) => {
        console.log("Documents filtered based on Category", r.data.documents)
        setFiltereddocuments(r.data.documents)
        document.getElementById('original').style.display = 'none'
        document.getElementById('filterlike').style.display = 'block'
      })
  }

  // ------------------------------------------------Filter Flashsets under course-------------------------------------------------------
  const [filteredflashsets, setFilteredflashsets] = useState([])
  const [flashsetfilterstatus, setflashsetfilterstatus] = useState("all")

  const filterflashsets = (value) => {
    if (value === "likes") {
      axiosInstance.post(`${ipaddress2}/FlashsetsFilters/${userdata.user_id}/${course_id}/`, {
        'like': true,
        'datetime': false
      })
        .then((r) => {
          console.log("Liked")
          console.log("date")
          console.log("Flashsets Filtered Successfuly", r.data)
          setSearchedFlashsets(r.data)
          document.getElementById('flashsetoriginal').style.display = 'none'
        })
    }
    if (value === "date") {
      axiosInstance.post(`${ipaddress2}/FlashsetsFilters/${userdata.user_id}/${course_id}/`, {
        'like': false,
        'datetime': true
      })
        .then((r) => {
          console.log("Like")
          console.log("dated")
          console.log("Flashsets Filtered Successfuly", r.data)
          setSearchedFlashsets(r.data)
          document.getElementById('flashsetoriginal').style.display = 'none'
        })
    }

    if (value === "select_filter") {
      setSearchedFlashsets([])
      console.log("original")
      document.getElementById('flashsetoriginal').style.display = 'block'
    }
  }

  // ------------------------------------Filter public flashsets under subject-------------------------------------------------
  // ------------------------------------------------Filter Flashsets under course-------------------------------------------------------
  const [publicflashsetfilterstatus, setpublicflashsetfilterstatus] = useState("all")

  const filterpublicflashsets = (value) => {
    if (value === "likes") {
      axiosInstance.post(`${ipaddress2}/PublicFlashsetsFilters/${userdata.user_id}/${course_id}/`, {
        'like': true,
        'datetime': false
      })
        .then((r) => {
          console.log("Liked")
          console.log("date")
          console.log("Public Flashsets Filtered Successfuly", r.data)
          setSearchedFlashsets(r.data)
          document.getElementById('flashsetoriginal').style.display = 'none'
        })
    }
    if (value === "date") {
      axiosInstance.post(`${ipaddress2}/PublicFlashsetsFilters/${userdata.user_id}/${course_id}/`, {
        'like': false,
        'datetime': true
      })
        .then((r) => {
          console.log("Like")
          console.log("dated")
          console.log("Public Flashsets Filtered Successfuly", r.data)
          setSearchedFlashsets(r.data)
          document.getElementById('flashsetoriginal').style.display = 'none'
        })
    }

    if (value === "select_filter") {
      setSearchedFlashsets([])
      console.log("original")
      document.getElementById('flashsetoriginal').style.display = 'block'
    }
  }
  // -------------------------------Search and Take Documents under particular subject---------------------------------------
  const [searchedDocs, setSearchedDocs] = useState()
  const searchDocuments = (value) => {
    if (value.length > 0) {
      axiosInstance.post(`${ipaddress}/SearchCourseFlashcardsAndDocumentsUnderCourse/${userdata.user_id}/${course_id}/${value}/`)
        .then((r) => {
          console.log("Search documents under course found", r.data)
          setFiltereddocuments(r.data.documents)
          if (r.data.documents.length > 0) {
            document.getElementById('original').style.display = 'none'
            document.getElementById('filterlike').style.display = 'block'
          }
        })
    }
    else {
      setFiltereddocuments([])
      document.getElementById('original').style.display = 'block'
      document.getElementById('filterlike').style.display = 'none'
    }
  }

  // ------------------------------------------Search and take Flashset functionality------------------------------------------

  const [searchedFlashsets, setSearchedFlashsets] = useState([])
  const [searchflashsetname, setsearchflashsetname] = useState("")

  const searchFlashset = (value) => {
    if (value.length > 0) {
      axiosInstance.get(`${ipaddress2}/SearchFlashsetsCourse/${userdata.user_id}/${course_id}/${value}/`)
        .then((r) => {
          console.log("Search Flashsets under course found", r.data)
          setSearchedFlashsets(r.data)
          if (r.data.length > 0) {
            document.getElementById('flashsetoriginal').style.display = 'none'
          }
        })
        .catch(() => {
          console.log("Search flashset error")
        })
    }
    else {
      setSearchedFlashsets([])
      document.getElementById('flashsetoriginal').style.display = 'block'
    }
  }

  // -----------------------------------------Search public flashsets--------------------------------------------------------
  const searchpublicFlashset = (value) => {
    if (value.length > 0) {
      axiosInstance.get(`${ipaddress2}/SearchPublicFlashsets/${userdata.user_id}/${course_id}/${value}/`)
        .then((r) => {
          console.log("Search public Flashsets under course found", r.data)
          setSearchedFlashsets(r.data)
          if (r.data.length > 0) {
            document.getElementById('flashsetoriginal').style.display = 'none'
          }
        })
        .catch(() => {
          console.log("Search flashset error")
        })
    }
    else {
      setSearchedFlashsets([])
      document.getElementById('flashsetoriginal').style.display = 'block'
    }
  }

  // -------------------------------------------PINNING COMMENTS------------------------------------------------------------
  const pincomment = (discId) => {
    const formdata = new FormData()
    formdata.append('discid', discId)
    axiosInstance.post(`${ipaddress}/coursediscussionpinningview/${userdata.user_id}/${course_id}/`, formdata)
      .then((r) => {
        console.log("Pinned Successfully", r.data)
        if (r.data.message === 'Message already pinned') {
          toast.success('Comment Alraedy Followed', {
            autoClose: 1000
          })
          setindex1(-1)
        }
        else {
          setCount(count + 1)
          toast.success('Comment followed successfully', {
            autoClose: 2000,
          })
          setindex1(-1)
        }
      })
  }

  // -------------------------------------------Tablist Javascript------------------------------------------------------------
  const [tablist, setTablist] = useState("discussion")

  // -------------------------------------------To Report the Subject---------------------------------------------------------

  const [reportdropdownstate, setreportdropdownstate] = useState(false)
  const [reportvalue, setReportvalue] = useState("")
  const reportCourse = () => {
    const report = new FormData()
    report.append('reason', reportvalue)
    axiosInstance.post(`${ipaddress}/CourseReport/${userdata.user_id}/${course_id}/`, report)
      .then((r) => {
        console.log("Reported Successfully", r.data)
        if (r.data === "Already reported") {
          toast.success('You already reported', {
            autoClose: 2000,
          })
          setreportdropdownstate(false)
        }
        toast.success('Successfully reported', {
          autoClose: 2000,
        })
        setreportdropdownstate(false)
        fetchcoursedetails()

      })
  }

  // ----------------------------------------To report the discussion comment----------------------------------------------
  const [report_status, setreport_status] = useState(false)
  const [report_id, setreport_id] = useState()

  // ----------------------------------------------Functionality to Unsave the document--------------------------------------
  const unsave = (doc_id) => {
    axiosInstance.delete(`${ipaddress}/UserStudyListView/${userdata.user_id}/${doc_id}/`)
      .then((r) => {
        console.log("Document successfully unsaved", r.data)
        fetchdocuments()
      })
  }

  // ----------------------------------------------Functionality to Unsave the Flashset--------------------------------------
  const unsave_flashset = (flashset_id) => {
    axiosInstance.put(`${ipaddress2}/Unsave_flashcard_studylist/${userdata.user_id}/${flashset_id}/`)
      .then((r) => {
        console.log("Flashset successfully unsaved", r.data)
        if (flashsetstatus === "public") {
          setSearchedFlashsets([])
          getallflashsetsundersubject()
        }
        if (flashsetstatus === "myflashcards") {
          setSearchedFlashsets([])
          getparticularusersflashsets()
        }
      })
      .catch((err) => {
        console.log("Unsave error", err)
      })
  }

  const dummyfunc = () => {
    if (flashsetstatus === "public" && searchflashsetname.length <= 0) {
      setSearchedFlashsets([])
      getallflashsetsundersubject()
    }
    if (flashsetstatus === "public" && searchflashsetname.length > 0) {
      searchpublicFlashset(searchflashsetname)
    }

    if (flashsetstatus === "myflashcards" && searchflashsetname.length <= 0) {
      setSearchedFlashsets([])
      getparticularusersflashsets()
    }
    if (flashsetstatus === "myflashcards" && searchflashsetname.length > 0) {
      searchFlashset(searchflashsetname)
    }
  }

  // ---------------------------------------------------UNPIN COMMENT-------------------------------------------------------
  const unpin = (discid) => {
    const formdata1 = new FormData()
    formdata1.append('discid', discid)
    axiosInstance.delete(`${ipaddress}/Unpiningcoursecomments/${userdata.user_id}/${course_id}/${discid}/`)
      .then((r) => {
        console.log("UnPinned Successfully", r.data)
        getdiscussion()
        // setCount((prev)=>prev+1)
        toast.success('Comment unfollowed successfully', {
          autoClose: 2000,
        })
      })
      .catch(() => {
        console.log("discussion id")
      })
  }


  return (
    <div>
      {loading ? (<Preloader />) : (
        <div>
          <div className="d-flex bg-light">
            <Mainsidebar activevalue={"course"} count={count1}></Mainsidebar>
            <div onClick={() => {
              setcourse_visible(false)
              setgroup_visible(false)
              setstudylist_visible(false)
            }} className='container-fluid px-1 px-lg-5 pt-5 mt-5 bg-light main-division'>
              <Navbar count2={count} count={count1}></Navbar>

              <div onClick={() => {
                setnavbar_dropdown_visible(false)
              }}>
                <div onClick={() => {
                  setindex1(-1)
                }} className=" pt-4 px-1 ps-md-3 ps-lg-5 pe-2 pe-lg-4 mt-1 d-flex pb-3 flex-column" id='subject-div' style={{ backgroundColor: '#F3F0FF' }}>
                  {/* <div className=''> */}
                  <div className='d-flex justify-content-between mb-3'>

                    {/* --------------------------------------------Path Direction flow--------------------------------------------------- */}
                    <Navpath count3={count3} course_id={course_id} />
                    <div>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 250 }}
                        overlay={renderTooltip("Exit the Subject")}
                      >
                        <button className='p-1 border-0 bg-transparent' data-bs-toggle="modal" data-bs-target="#leavecourse"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#5D60E1" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                        </svg></button>
                      </OverlayTrigger>

                      {/* ---------------------------------------------REPORT THE SUBJECT--------------------------------------------------- */}
                      <div className="d-inline">
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 250 }}
                          overlay={renderTooltip("Report the Subject")}
                        >
                          <span className={`ms-4 ps-2`} style={{ cursor: 'pointer', position: 'relative', color: courseDetails.course_report_status ? 'blue' : '#5D60E1' }} onClick={() => {
                            setreportdropdownstate(!reportdropdownstate)
                          }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                              <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                            </svg></span>
                        </OverlayTrigger>
                        <ul className={`${reportdropdownstate ? '' : 'd-none'} rounded me-5 bg-white border-0 py-2 mt-3 px-2 ps-3 report-dropdown`} style={{ width: '180px', listStyleType: 'none', position: 'absolute' }}>
                          <li className={`${courseDetails.course_report_status ? 'd-none' : ''}`}><a data-bs-toggle="modal" data-bs-target="#reportsubjectmodal" className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                          </svg> <span className='ms-2'>Report Irrelevant</span></a></li>
                          <li className={`mt-2 ${courseDetails.course_report_status ? 'd-none' : ''}`}><a data-bs-toggle="modal" data-bs-target="#reportsubjectmodal" className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
                          </svg> <span className='ms-2'>Report Invalid</span></a></li>

                          <li className={`${courseDetails.course_report_status ? '' : 'd-none'}`} style={{ color: '#ff845d' }}><a className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
                          </svg> <span className='ms-2'>Already Reported</span></a></li>
                        </ul>
                      </div>

                    </div>

                  </div>

                  <p onClick={() => {
                    setreportdropdownstate(false)
                  }} className='m-0 d-flex align-items-center' style={{ color: '#2A3941', fontSize: '20px', fontWeight: 500, lineHeight: 'normal', letterSpacing: '0.4px' }}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
                      <path d="M17.7532 12.0259V5.96017L9.49997 10.4233L0.205078 5.37522L9.49997 0.327148L18.7949 5.37522V12.0259H17.7532ZM9.49997 15.4714L3.24997 12.0739V7.82715L9.49997 11.2246L15.75 7.82715V12.0739L9.49997 15.4714Z" fill="#2A3941" />
                    </svg><span className='ms-2'>{courseDetails.course}</span></p>
                  {/* </div> */}
                  <div onClick={() => {
                    setreportdropdownstate(false)
                  }} className='d-flex gap-4 mt-2 pb-2 align-items-center' style={{ color: '#2A3941' }}>
                    <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M2.70435 19.391V17.6762C2.70435 17.1928 2.82955 16.7771 3.07994 16.4292C3.33034 16.0813 3.66685 15.8033 4.08945 15.5951C4.99297 15.1649 5.89011 14.822 6.78086 14.5662C7.67162 14.3105 8.74334 14.1826 9.99601 14.1826C11.2487 14.1826 12.3204 14.3105 13.2112 14.5662C14.1019 14.822 14.9991 15.1649 15.9026 15.5951C16.3252 15.8033 16.6617 16.0813 16.9121 16.4292C17.1625 16.7771 17.2877 17.1928 17.2877 17.6762V19.391H2.70435ZM19.371 19.391V17.6281C19.371 17.0245 19.2488 16.4547 19.0045 15.9188C18.7601 15.3828 18.4136 14.9229 17.9648 14.5392C18.4763 14.6433 18.969 14.7879 19.4431 14.9729C19.9172 15.1578 20.386 15.3658 20.8494 15.5969C21.3008 15.8239 21.6547 16.1144 21.9111 16.4685C22.1675 16.8225 22.2957 17.2091 22.2957 17.6281V19.391H19.371ZM9.99601 11.8589C9.13664 11.8589 8.40096 11.5529 7.78898 10.9409C7.177 10.329 6.87101 9.59329 6.87101 8.73391C6.87101 7.87452 7.177 7.13883 7.78898 6.52686C8.40096 5.91488 9.13664 5.60889 9.99601 5.60889C10.8554 5.60889 11.5911 5.91488 12.203 6.52686C12.815 7.13883 13.121 7.87452 13.121 8.73391C13.121 9.59329 12.815 10.329 12.203 10.9409C11.5911 11.5529 10.8554 11.8589 9.99601 11.8589ZM17.5681 8.73391C17.5681 9.59329 17.2622 10.329 16.6502 10.9409C16.0382 11.5529 15.3025 11.8589 14.4431 11.8589C14.3991 11.8589 14.343 11.8539 14.2749 11.8439C14.2068 11.8339 14.1507 11.8229 14.1066 11.8108C14.4594 11.3786 14.7306 10.8992 14.9201 10.3724C15.1096 9.84569 15.2043 9.29869 15.2043 8.73141C15.2043 8.16416 15.1052 7.62212 14.9069 7.10529C14.7086 6.58847 14.4418 6.10569 14.1066 5.65696C14.1627 5.63694 14.2188 5.62392 14.2749 5.6179C14.331 5.61189 14.3871 5.60889 14.4431 5.60889C15.3025 5.60889 16.0382 5.91488 16.6502 6.52686C17.2622 7.13883 17.5681 7.87452 17.5681 8.73391ZM3.74601 18.3493H16.246V17.6762C16.246 17.4318 16.1849 17.2181 16.0627 17.0352C15.9405 16.8522 15.7212 16.6773 15.4047 16.5103C14.6274 16.095 13.8081 15.7768 12.9467 15.5558C12.0854 15.3348 11.1018 15.2243 9.99601 15.2243C8.89025 15.2243 7.90667 15.3348 7.04528 15.5558C6.18391 15.7768 5.36461 16.095 4.58737 16.5103C4.27086 16.6773 4.0515 16.8522 3.92929 17.0352C3.80711 17.2181 3.74601 17.4318 3.74601 17.6762V18.3493ZM9.99601 10.8172C10.5689 10.8172 11.0594 10.6133 11.4674 10.2053C11.8754 9.79728 12.0793 9.30683 12.0793 8.73391C12.0793 8.161 11.8754 7.67055 11.4674 7.26256C11.0594 6.85457 10.5689 6.65058 9.99601 6.65058C9.4231 6.65058 8.93264 6.85457 8.52466 7.26256C8.11667 7.67055 7.91268 8.161 7.91268 8.73391C7.91268 9.30683 8.11667 9.79728 8.52466 10.2053C8.93264 10.6133 9.4231 10.8172 9.99601 10.8172Z" fill="#2A3941" />
                    </svg> <span className='ms-2' style={{ fontSize: '14px' }}>{courseDetails.count} <span className='d-md-inline d-none'>Students</span></span></span>
                    <span className={`d-flex align-items-center`}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M8.85409 18.2292H16.1458V17.1875H8.85409V18.2292ZM8.85409 14.0625H16.1458V13.0208H8.85409V14.0625ZM6.89093 21.875C6.41151 21.875 6.0112 21.7144 5.69002 21.3932C5.36884 21.072 5.20825 20.6717 5.20825 20.1923V4.80768C5.20825 4.32825 5.36884 3.92795 5.69002 3.60677C6.0112 3.28559 6.41151 3.125 6.89093 3.125H15.1041L19.7916 7.8125V20.1923C19.7916 20.6717 19.631 21.072 19.3098 21.3932C18.9886 21.7144 18.5883 21.875 18.1089 21.875H6.89093ZM14.5833 8.33333V4.16667H6.89093C6.73069 4.16667 6.58379 4.23344 6.45023 4.36698C6.31669 4.50054 6.24992 4.64744 6.24992 4.80768V20.1923C6.24992 20.3526 6.31669 20.4995 6.45023 20.633C6.58379 20.7666 6.73069 20.8333 6.89093 20.8333H18.1089C18.2691 20.8333 18.416 20.7666 18.5496 20.633C18.6831 20.4995 18.7499 20.3526 18.7499 20.1923V8.33333H14.5833Z" fill="#2A3941" />
                    </svg> <span className='ms-1' style={{ fontSize: '14px' }}>{courseDetails.docuemnts_count} <span className='d-md-inline d-none'>Documents</span></span></span>
                    <span className='d-flex  align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M8.3333 20.1923V10.01C8.3333 9.54389 8.49823 9.14793 8.82809 8.82208C9.15795 8.49623 9.55592 8.3333 10.022 8.3333H20.1923C20.6584 8.3333 21.0553 8.49722 21.3832 8.82507C21.711 9.15294 21.875 9.54991 21.875 10.016V17.2676L17.2676 21.875H10.016C9.54991 21.875 9.15294 21.711 8.82507 21.3832C8.49722 21.0553 8.3333 20.6584 8.3333 20.1923ZM3.15101 6.87096C3.06019 6.40488 3.14966 5.98521 3.41942 5.61195C3.6892 5.23868 4.05712 5.00664 4.5232 4.91583L14.5432 3.15101C15.0093 3.06019 15.429 3.14966 15.8023 3.41942C16.1755 3.6892 16.4076 4.05712 16.4984 4.5232L16.7187 5.84932H15.665L15.4427 4.60734C15.416 4.46043 15.3358 4.34358 15.2023 4.25679C15.0687 4.16998 14.9218 4.13993 14.7616 4.16663L4.70749 5.9515C4.52053 5.97821 4.38031 6.065 4.28682 6.2119C4.19334 6.3588 4.15996 6.52574 4.18666 6.7127L5.84932 16.1037V18.121C5.61161 18.0048 5.40962 17.8398 5.24335 17.6262C5.07709 17.4125 4.96791 17.1675 4.91583 16.891L3.15101 6.87096ZM9.37497 10.016V20.1923C9.37497 20.3792 9.43506 20.5328 9.55525 20.653C9.67545 20.7732 9.82902 20.8333 10.016 20.8333H16.6666V16.6666H20.8333V10.016C20.8333 9.82902 20.7732 9.67544 20.653 9.55525C20.5328 9.43506 20.3792 9.37497 20.1923 9.37497H10.016C9.82902 9.37497 9.67545 9.43506 9.55525 9.55525C9.43506 9.67544 9.37497 9.82902 9.37497 10.016Z" fill="#2A3941" />
                    </svg> <span className='ms-2' style={{ fontSize: '14px' }}>{courseDetails.public_flashsets_count} <span className='d-md-inline d-none'>Flashsets</span></span></span>
                  </div>
                  <div onClick={() => {
                    setreportdropdownstate(false)
                  }} className='mt-3 d-flex gap-3 '>
                    <Link to='/courses' className='btn border px-3 py-2 fw-medium text-decoration-none d-flex align-items-center text-white' style={{ height: '44px', backgroundColor: '#5D5FE3', fontSize: '15px' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11.5 16.5H12.5V12.5H16.5V11.5H12.5V7.5H11.5V11.5H7.5V12.5H11.5V16.5ZM5.61538 20C5.15513 20 4.77083 19.8458 4.4625 19.5375C4.15417 19.2292 4 18.8449 4 18.3846V5.61537C4 5.15512 4.15417 4.77083 4.4625 4.4625C4.77083 4.15417 5.15513 4 5.61538 4H18.3846C18.8449 4 19.2292 4.15417 19.5375 4.4625C19.8458 4.77083 20 5.15512 20 5.61537V18.3846C20 18.8449 19.8458 19.2292 19.5375 19.5375C19.2292 19.8458 18.8449 20 18.3846 20H5.61538ZM5.61538 19H18.3846C18.5385 19 18.6795 18.9359 18.8077 18.8077C18.9359 18.6795 19 18.5385 19 18.3846V5.61537C19 5.46154 18.9359 5.32052 18.8077 5.1923C18.6795 5.0641 18.5385 5 18.3846 5H5.61538C5.46154 5 5.32052 5.0641 5.1923 5.1923C5.0641 5.32052 5 5.46154 5 5.61537V18.3846C5 18.5385 5.0641 18.6795 5.1923 18.8077C5.32052 18.9359 5.46154 19 5.61538 19Z" fill="white" />
                    </svg> <span className='ms-2' style={{ fontSize: '14px' }}>{translate_value.common_words.join_course}</span></Link>
                    <Link to={`/uploadpage/${course_id}/${course_name}`} className='btn px-4 py-2 text-decoration-none fw-medium d-flex align-items-center' style={{ height: '44px', color: '#5D5FE3', fontSize: '15px', border: '1px solid #5D5FE3' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M6.77075 19.7918C5.47134 19.7918 4.36524 19.3399 3.45244 18.4362C2.53965 17.5324 2.08325 16.4278 2.08325 15.1223C2.08325 13.8884 2.50793 12.8187 3.35729 11.9132C4.20665 11.0078 5.20424 10.521 6.35007 10.4529C6.58379 8.93579 7.28158 7.68245 8.44343 6.69287C9.60529 5.70329 10.9575 5.2085 12.4999 5.2085C14.241 5.2085 15.7179 5.81489 16.9307 7.02769C18.1435 8.24048 18.7499 9.71742 18.7499 11.4585V12.5002H19.3909C20.3885 12.5322 21.2256 12.8985 21.902 13.5989C22.5784 14.2994 22.9166 15.1484 22.9166 16.146C22.9166 17.1676 22.571 18.0307 21.8799 18.7351C21.1888 19.4396 20.3325 19.7918 19.3108 19.7918H13.6618C13.1823 19.7918 12.782 19.6312 12.4609 19.3101C12.1397 18.9889 11.9791 18.5886 11.9791 18.1091V12.0635L9.79159 14.2389L9.0544 13.5218L12.4999 10.0763L15.9454 13.5218L15.2083 14.2389L13.0208 12.0635V18.1091C13.0208 18.2694 13.0875 18.4163 13.2211 18.5498C13.3546 18.6834 13.5015 18.7502 13.6618 18.7502H19.2708C19.9999 18.7502 20.6162 18.4984 21.1197 17.995C21.6232 17.4915 21.8749 16.8752 21.8749 16.146C21.8749 15.4168 21.6232 14.8005 21.1197 14.297C20.6162 13.7936 19.9999 13.5418 19.2708 13.5418H17.7083V11.4585C17.7083 10.0175 17.2004 8.78923 16.1848 7.7736C15.1692 6.75798 13.9409 6.25016 12.4999 6.25016C11.0589 6.25016 9.83065 6.75798 8.81502 7.7736C7.7994 8.78923 7.29159 10.0175 7.29159 11.4585H6.7307C5.76381 11.4585 4.92113 11.8144 4.20265 12.5262C3.48416 13.238 3.12492 14.0974 3.12492 15.1043C3.12492 16.1113 3.48082 16.9706 4.19263 17.6825C4.90443 18.3943 5.76381 18.7502 6.77075 18.7502H9.37492V19.7918H6.77075Z" fill="#5D5FE3" />
                      </svg> <span className='ms-2  fw-bold' style={{ fontSize: '14px' }}>{translate_value.common_words.upload}</span></Link>

                  </div>
                </div>

                {/* ----------------------------------------------------DISCUSSION AND DOCUMENT LAYOUT--------------------------------- */}
                <div className="m-0 mt-3 mb-5 row justify-content-center">
                  <div className="col-lg-9 p-0">
                    <div onClick={() => {
                      setindex1(-1)
                      setreportdropdownstate(false)
                    }} className='bg-white p-3 rounded shadow-sm d-inline d-md-flex align-items-center'>
                      <ul className="nav nav-underline gap-2 w-100 w-md-50" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active bg-white fw-normal p-2" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" style={{ color: tablist === "discussion" ? '#5D5FE3' : '#8E9696', fontSize: '16px' }} onClick={() => {
                            setTablist("discussion")
                          }}>Discussion ({discussions.length})</button>
                        </li><li className="nav-item" role="presentation">
                          <button className="nav-link p-2 bg-white fw-normal" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" style={{ color: tablist === "documents" ? '#5D5FE3' : '#8E9696', fontSize: '16px' }} onClick={() => {
                            setTablist("documents")
                            fetchdocuments()
                          }}>Documents ({courseDetails.docuemnts_count})</button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link p-2 bg-white fw-normal" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false" style={{ color: tablist === "flashcards" ? '#5D5FE3' : '#8E9696', fontSize: '16px' }}
                            onClick={() => {
                              setTablist("flashcards")
                              getallflashsetsundersubject()
                            }}>Flashsets ({courseDetails.public_flashsets_count})</button>
                        </li>
                      </ul>
                      <div className='w-100 ps-0 ps-md-3 mt-3 mt-md-0 w-md-50'>
                        {/* ------------------------------------------------Document Search bar-------------------------------------------- */}
                        <div className={`input-group bg-light rounded border ${tablist === "documents" ? '' : 'd-none'}`}>
                          <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9771 15.5008C11.3001 15.7439 10.6196 15.8654 9.93586 15.8654C8.26746 15.8654 6.85544 15.2879 5.6998 14.1329C4.54414 12.9778 3.96631 11.5666 3.96631 9.89908C3.96631 8.23158 4.54382 6.81924 5.69883 5.66205C6.85385 4.50486 8.26511 3.92627 9.93261 3.92627C11.6001 3.92627 13.0125 4.50409 14.1696 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0336 20.2564L20.2965 20.9936ZM9.93586 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93586 4.96794C8.55366 4.96794 7.38679 5.4437 6.43527 6.39523C5.48376 7.34676 5.008 8.51362 5.008 9.89583C5.008 11.278 5.48376 12.4449 6.43527 13.3964C7.38679 14.348 8.55366 14.8237 9.93586 14.8237Z" fill="#8E9696" />
                          </svg></span>
                          <input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search} onChange={(e) => {
                            searchDocuments(e.target.value)
                          }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                        </div>

                        {/* --------------------------------------------------Flashcards Search bar------------------------------------------- */}
                        <div className={`input-group bg-light rounded border ${tablist === "flashcards" && flashsetstatus === "myflashcards" ? '' : 'd-none'}`}>
                          <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9771 15.5008C11.3001 15.7439 10.6196 15.8654 9.93586 15.8654C8.26746 15.8654 6.85544 15.2879 5.6998 14.1329C4.54414 12.9778 3.96631 11.5666 3.96631 9.89908C3.96631 8.23158 4.54382 6.81924 5.69883 5.66205C6.85385 4.50486 8.26511 3.92627 9.93261 3.92627C11.6001 3.92627 13.0125 4.50409 14.1696 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0336 20.2564L20.2965 20.9936ZM9.93586 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93586 4.96794C8.55366 4.96794 7.38679 5.4437 6.43527 6.39523C5.48376 7.34676 5.008 8.51362 5.008 9.89583C5.008 11.278 5.48376 12.4449 6.43527 13.3964C7.38679 14.348 8.55366 14.8237 9.93586 14.8237Z" fill="#8E9696" />
                          </svg></span>
                          <input type="text" value={searchflashsetname} className="form-control border-0 ps-0 sub-search bg-transparent" placeholder={translate_value.common_words.flashset} onChange={(e) => {
                            setsearchflashsetname(e.target.value)
                            searchFlashset(e.target.value)
                          }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                        </div>

                        <div className={`input-group bg-light rounded border ${tablist === "flashcards" && flashsetstatus === "public" ? '' : 'd-none'}`}>
                          <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M20.2965 20.9936L13.774 14.4712C13.2532 14.9145 12.6542 15.2577 11.9771 15.5008C11.3001 15.7439 10.6196 15.8654 9.93586 15.8654C8.26746 15.8654 6.85544 15.2879 5.6998 14.1329C4.54414 12.9778 3.96631 11.5666 3.96631 9.89908C3.96631 8.23158 4.54382 6.81924 5.69883 5.66205C6.85385 4.50486 8.26511 3.92627 9.93261 3.92627C11.6001 3.92627 13.0125 4.50409 14.1696 5.65973C15.3268 6.81538 15.9054 8.22741 15.9054 9.89583C15.9054 10.6196 15.7772 11.3201 15.5208 11.9972C15.2644 12.6743 14.9279 13.2532 14.5112 13.734L21.0336 20.2564L20.2965 20.9936ZM9.93586 14.8237C11.3181 14.8237 12.485 14.348 13.4365 13.3964C14.388 12.4449 14.8638 11.278 14.8638 9.89583C14.8638 8.51362 14.388 7.34676 13.4365 6.39523C12.485 5.4437 11.3181 4.96794 9.93586 4.96794C8.55366 4.96794 7.38679 5.4437 6.43527 6.39523C5.48376 7.34676 5.008 8.51362 5.008 9.89583C5.008 11.278 5.48376 12.4449 6.43527 13.3964C7.38679 14.348 8.55366 14.8237 9.93586 14.8237Z" fill="#8E9696" />
                          </svg></span>
                          <input type="text" value={searchflashsetname} className="form-control border-0 ps-0 sub-search bg-transparent" placeholder={translate_value.common_words.flashset} onChange={(e) => {
                            setsearchflashsetname(e.target.value)
                            searchpublicFlashset(e.target.value)
                          }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                        </div>
                      </div>
                    </div>
                    <div className="tab-content" id="myTabContent">

                      {/* ----------------------------------------Course Discussion Section------------------------------------------------- */}
                      <div className="tab-pane fade show active bg-white py-1 px-0 px-md-3 mt-3" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div className='w-100 mt-3'>
                          <div className='d-md-flex justify-content-between mb-3 align-items-center' onClick={() => {
                            setindex1(-1)
                            setreportdropdownstate(false)
                          }}>
                            <div className='d-flex ms-4 ms-md-0'>
                              <span className='d-flex align-items-center'>
                                <button className="btn btn-sm d-flex align-items-center px-3 border-end-0 fs-6 px-5 px-md-3" style={{ borderRadius: '5px 0px 0px 5px', border: '1px solid #5D5FE7', color: usercomment_status == false && pinnedcomment_status == false ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomment_status == false && pinnedcomment_status == false ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setpinnedcomment_status(false)
                                  setusercomment_status(false)
                                  setoriginal_status(true)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                  </svg><span className='d-none d-md-inline'>Comments</span></button>
                              </span>
                              <span className='d-flex align-items-center'>
                                <button className="btn btn-sm d-flex align-items-center px-3 border-end-0 fs-6 px-5 px-md-3" style={{ borderRadius: '0px 0px 0px 0px', border: '1px solid #5D5FE7', color: '#5D5FE7', height: '36px', color: usercomment_status == false && pinnedcomment_status == true ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomment_status == false && pinnedcomment_status == true ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setpinnedcomment_status(!pinnedcomment_status)
                                  setusercomment_status(false)
                                  setoriginal_status(false)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                  </svg><span className='d-none d-md-inline'>Followed</span></button>
                              </span>

                              <span className='d-flex align-items-center'>
                                <button className='btn btn-sm d-flex align-items-center justify-content-center px-3 fs-6 px-5 px-md-3' style={{ borderRadius: '0px 5px 5px 0px', border: '1px solid #5D5FE7', color: '#5D5FE7', height: '36px', color: '#5D5FE7', height: '36px', color: usercomment_status == true && pinnedcomment_status == false ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomment_status == true && pinnedcomment_status == false ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setusercomment_status((prev) => !prev)
                                  setpinnedcomment_status(false)
                                  setoriginal_status(false)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                                  </svg><span className='d-none d-md-inline'>Your Comments</span></button>
                              </span>
                            </div>
                            <div className='mt-3 mt-md-0 px-2 px-md-0'>
                              <div className="input-group bg-light rounded border">
                                <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                                </svg></span>
                                <input type="text" value={searchcomment} className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search_discussion}
                                  onChange={(e) => {
                                    setSearchcomment(e.target.value)
                                  }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                              </div>
                            </div>
                          </div>

                          {/* ----------------------------------------Create a Post Modal------------------------------------------------------- */}

                          <div className="modal fade" id="postmodal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog  modal-dialog-centered modal-lg">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <div className='col-12 bg-white px-3 pt-2 pb-3'>
                                    <h6 className='pb-2 ps-1 fs-5'>Create a Post</h6>
                                    <div className='d-flex gap-3 align-items-center'>
                                      <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                      {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                      <div className="input-group bg-light border rounded pe-3">
                                        <input
                                          type="text"
                                          name="question"
                                          value={question}
                                          onChange={questionData}
                                          // value={editedpost}
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 14 24" fill="none">
                                              <path d="M13.6825 16.4231C13.6825 18.3164 13.0302 19.9276 11.7258 21.2565C10.4213 22.5855 8.8259 23.25 6.9397 23.25C5.05347 23.25 3.4541 22.5855 2.1416 21.2565C0.829102 19.9276 0.172852 18.3164 0.172852 16.4231V5.50962C0.172852 4.1875 0.62758 3.0637 1.53704 2.13822C2.4465 1.21274 3.56229 0.75 4.88441 0.75C6.20652 0.75 7.3223 1.21274 8.23176 2.13822C9.14122 3.0637 9.59595 4.1875 9.59595 5.50962V15.8462C9.59595 16.5801 9.33986 17.2123 8.82769 17.7428C8.31553 18.2732 7.69133 18.5385 6.9551 18.5385C6.21887 18.5385 5.58553 18.2774 5.05507 17.7552C4.52461 17.2331 4.25938 16.5967 4.25938 15.8462V5.46153H5.50941V15.8462C5.50941 16.2452 5.64603 16.5853 5.91926 16.8666C6.19249 17.1478 6.52862 17.2885 6.92766 17.2885C7.32671 17.2885 7.66284 17.1478 7.93607 16.8666C8.20932 16.5853 8.34595 16.2452 8.34595 15.8462V5.48556C8.34113 4.51442 8.00725 3.69071 7.34429 3.01444C6.68135 2.33815 5.86139 2 4.88441 2C3.91519 2 3.09595 2.34215 2.4267 3.02644C1.75747 3.71073 1.42285 4.53846 1.42285 5.50962V16.4231C1.41806 17.9663 1.95252 19.2816 3.02623 20.369C4.09996 21.4563 5.40734 22 6.94838 22C8.46774 22 9.75918 21.4563 10.8227 20.369C11.8863 19.2816 12.4229 17.9663 12.4325 16.4231V5.46153H13.6825V16.4231Z" fill="#8E9696" />
                                            </svg>
                                          </label>
                                          <button disabled={question.length > 0 ? false : true} data-bs-dismiss="modal" onClick={postQuestion} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' >
                                            <svg data-bs-toggle="tooltip" data-bs-placement="top"
                                              data-bs-custom-class="custom-tooltip"
                                              data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                              <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>

                                    </div>
                                    <p className="mt-1 ms-5" style={{ color: '#ff845d', fontSize: '13px', fontStyle: 'italic' }}>*You can edit your post within 24 hours after posting</p>
                                    <div className='d-flex gap-3 mt-3'>
                                      {selectedImages.length > 0 &&
                                        selectedImages.map((image, index) => (
                                          <div key={index} className="image-preview bg-light p-2" style={{ position: 'relative' }}>
                                            <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
                                            <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removemainImage(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
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

                        {/* ---------------------------Search and see the discussion under particular subject--------------------------------- */}
                        <Subject_search_comments course_id={course_id} setCount={setCount} course_name={course_name} searchvalue={searchcomment} />

                        {/* ---------------------------Pinned comments layout section--------------------------------------------------------- */}
                        <div className={`${pinnedcomment_status ? '' : 'd-none'}`} onClick={() => {
                          setindex1(-1)
                          setreportdropdownstate(false)
                        }}>
                          <Subject_discussion setCount={setCount} setreportdropdownstate={setreportdropdownstate} course_id={course_id} pinnedcomments_status={pinnedcomment_status} course_name={course_name} />
                        </div>

                        {/* --------------------------------User comments layout section------------------------------------------------------ */}
                        <div className={`${usercomment_status ? '' : 'd-none'}`} onClick={() => {
                          setindex1(-1)
                          setreportdropdownstate(false)
                        }}>
                          <Subject_user_comments setCount={setCount} course_id={course_id} course_name={course_name} usercomment_status={usercomment_status} />
                        </div>


                        {/* ---------------------------------------All discussion under the particular subject--------------------------------- */}
                        <div className={`${discussions.length > 0 && original_status ? '' : 'd-none'}`}>
                          {discussions.slice(0, visibleDiscussions).map((x, index) => {
                            return (
                              <div className='mt-3' key={index}>
                                <div className='px-3 pe-4 pt-2 pb-3 rounded shadow-sm border'>
                                  <div className="row border-bottom py-3 m-0 align-items-center">
                                    <div className="col-1 px-1 px-lg-0 d-flex justify-content-center" onClick={() => {
                                      setindex1(-1)
                                      setreportdropdownstate(false)
                                    }}>
                                      <img src={x.user_details.profile_pic} className={x.user_details.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                      <p className={x.user_details.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{x.user_details.nickname.slice(0, 1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>

                                    </div>
                                    <div className={`col-8 p-0 ${x.pinned_status ? 'col-md-8' : 'col-md-9'}`} onClick={() => {
                                      setindex1(-1)
                                      setreportdropdownstate(false)
                                    }}>
                                      <Link to={`/profile/${x.user_details.user_id}`} className='ms-3 ms-sm-0 my-0 fw-medium text-decoration-none text-dark' style={{ fontSize: '14px' }}>{x.user_details.nickname}
                                        <span className='fw-normal ms-2 text-secondary' style={{ fontSize: '13px' }}>{x.created_at}</span>
                                      </Link>
                                      <p className='ms-3 ms-sm-0 my-0 d-flex align-items-center' style={{ fontSize: '12px', color: '#8587EA', cursor: 'pointer' }} onClick={() => {
                                        navigate(`/profile/${x.user_details.user_id}`)
                                      }}>click to view more<span className={`ms-2 edit ${x.edited ? '' : 'd-none'}`}>Edited</span></p>
                                    </div>
                                    <div className={`col-3 ps-4 d-flex align-items-center p-0 ${x.pinned_status ? 'col-md-3 justify-content-between' : 'col-md-2 justify-content-end'}`}>
                                      <button data-bs-toggle="tooltip" data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="Unfollow" onClick={() => {
                                          unpin(x.discid)
                                        }} className={`p-1 btn btn-sm border px-2 ${x.pinned_status ? '' : 'd-none'}`} style={{ cursor: 'pointer' }}><i className="fa-solid fa-link-slash d-md-none d-inline"></i><span className='d-none d-md-inline'>Followed</span></button>

                                      <div className="btn-group dropstart">
                                        <span className="border-0" type="button" style={{ cursor: 'pointer' }} onClick={() => {
                                          if (index1 == index)
                                            setindex1(-1)
                                          else
                                            setindex1(index)
                                        }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                            <path d="M17.4998 27.0354C17.0988 27.0354 16.7555 26.8926 16.4699 26.607C16.1843 26.3214 16.0415 25.9781 16.0415 25.5771C16.0415 25.176 16.1843 24.8327 16.4699 24.5471C16.7555 24.2615 17.0988 24.1187 17.4998 24.1187C17.9009 24.1187 18.2442 24.2615 18.5298 24.5471C18.8154 24.8327 18.9582 25.176 18.9582 25.5771C18.9582 25.9781 18.8154 26.3214 18.5298 26.607C18.2442 26.8926 17.9009 27.0354 17.4998 27.0354ZM17.4998 18.9585C17.0988 18.9585 16.7555 18.8157 16.4699 18.5301C16.1843 18.2445 16.0415 17.9012 16.0415 17.5001C16.0415 17.0991 16.1843 16.7558 16.4699 16.4702C16.7555 16.1846 17.0988 16.0418 17.4998 16.0418C17.9009 16.0418 18.2442 16.1846 18.5298 16.4702C18.8154 16.7558 18.9582 17.0991 18.9582 17.5001C18.9582 17.9012 18.8154 18.2445 18.5298 18.5301C18.2442 18.8157 17.9009 18.9585 17.4998 18.9585ZM17.4998 10.8815C17.0988 10.8815 16.7555 10.7388 16.4699 10.4532C16.1843 10.1676 16.0415 9.82424 16.0415 9.42318C16.0415 9.02214 16.1843 8.67882 16.4699 8.39323C16.7555 8.10764 17.0988 7.96484 17.4998 7.96484C17.9009 7.96484 18.2442 8.10764 18.5298 8.39323C18.8154 8.67882 18.9582 9.02214 18.9582 9.42318C18.9582 9.82424 18.8154 10.1676 18.5298 10.4532C18.2442 10.7388 17.9009 10.8815 17.4998 10.8815Z" fill="#2A3941" />
                                          </svg>
                                        </span>
                                        <ul className={`bg-white shadow-sm border rounded mt-0 p-0 px-3 ${index1 == index ? '' : 'd-none'}`} style={{ width: '160px', position: 'absolute', left: '-160px' }}>
                                          <button className={x.user_details.nickname != userdata.nickname || x.created_at.includes("day") || x.created_at.includes("week") || x.created_at.includes("year") ? 'd-none' : 'd-block bg-transparent border-0 my-2 d-flex align-items-center'} data-bs-toggle="modal" data-bs-target="#originaleditModal" onClick={() => {
                                            editPosts(x.discid)
                                          }} style={{ height: '20px' }}><span className='dropdownmenu'> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                                            <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black" />
                                          </svg></span><span className="ms-2">{translate_value.common_words.edit}</span></button>
                                          <button className={`bg-transparent border-0 my-2 ${x.pinned_status ? 'd-none' : 'd-flex align-items-center'}`} onClick={() => {
                                            pincomment(x.discid)
                                          }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin" viewBox="0 0 16 16">
                                            <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                          </svg></span> <span className="ms-2">Follow</span></button>

                                          {/* ----------------------------------------------------Report button--------------------------------------------------- */}
                                          <button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-none' : 'd-flex align-items-center'}`}
                                            onClick={() => {
                                              setreport_id(x.discid)
                                              setreport_status(true)
                                            }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#2A3941" />
                                            </svg></span> <span className="ms-2">Report</span></button>

                                          <button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-flex align-items-center' : 'd-none'}`} style={{ height: '20px', color: '#FF845D' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                            <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D" />
                                          </svg></span> <span className="ms-2">Reported</span></button>


                                          <button className={`bg-transparent border-0 ${userdata.user_id === x.user_details.user_id ? 'd-flex align-items-center my-2' : 'd-none'}`} onClick={() => {
                                            deletePost(x.discid)
                                          }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                                            <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black" />
                                          </svg></span><span className="ms-2">{translate_value.common_words.delete}</span></button>
                                        </ul>
                                      </div>

                                      {/* -----------------------------------------------DELETE THE COMMENT MODAL--------------------------------------------- */}
                                      <div className="modal fade" id="deletecomment" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-body">
                                              <p className=''>Are you Surely Want to Delete this Comment?</p>
                                              <div className='text-end'>
                                                <button className='btn btn-sm border-0 btn-success text-white me-2' data-bs-dismiss="modal" onClick={leaveCourse}>Yes</button><button className='btn btn-sm border-0 btn-danger text-white' data-bs-dismiss="modal">No</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* -----------------------EDIT THE POST--------------------------------------------------------- */}

                                      <div className="modal fade" id="originaleditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered modal-lg">
                                          <div className="modal-content">
                                            <div className="modal-body">
                                              <div className=' bg-white px-3 pt-2 pb-3 rounded'>
                                                <h6 className='pb-2 ps-1'>Edit the Post</h6>
                                                <div className='d-flex gap-3'>
                                                  <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                                  {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                                  <div className="input-group border rounded bg-light pe-3">
                                                    <input
                                                      type="text"
                                                      name="question"
                                                      onChange={(e) => editpostfunctionData(
                                                        e.target.value
                                                      )}
                                                      value={editedpost}
                                                      className="form-control bg-transparent border-0 py-3 ps-3 shadow-none" placeholder="Ask a question....."
                                                      style={{ position: 'relative' }} />
                                                    <button data-bs-dismiss="modal" disabled={editedpost.length > 0 ? false : true} onClick={() => {
                                                      sendEditedData(x.discid)
                                                    }} className='text-info bg-transparent border-0'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
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
                                  <div className='py-2 ms-1 mt-2' onClick={() => {
                                    setindex1(-1)
                                  }}>
                                    <p className='m-0' id={x.discid} style={{ fontSize: '16px', fontWeight: '450', letterSpacing: '0.32px', lineHeight: '22px', color: '#2A3941' }}>{x.post}</p>
                                    {x.images_attached && (
                                      x.images_attached.map((z) => {
                                        return (
                                          <div>
                                            <img src={z.image} width={300} alt="" className='mt-3' />
                                          </div>
                                        )
                                      })
                                    )}

                                  </div>

                                  <div className='d-flex justify-content-between border-bottom pt-3 pb-4 px-2' onClick={() => {
                                    setindex1(-1)
                                    setreportdropdownstate(false)
                                  }}>
                                    <div className='d-flex'>
                                      <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: x.liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                        if (x.liked_status == true) {
                                          handleLike1(x.discid)
                                        }
                                        else {
                                          handleLike(x.discid)
                                        }
                                      }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                          <path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z"
                                            fill="currentColor" />
                                        </svg> <span className='ms-1'>{x.like_count}</span></button>
                                      <button className='bg-transparent border-0 ms-4 d-flex align-items-center' style={{ height: '20px', color: x.dis_like_status ? "#ff845d" : "gray" }} onClick={() => {
                                        if (x.dis_like_status == true) {
                                          handledislike(x.discid)
                                        }
                                        else {
                                          handledislike(x.discid)
                                        }
                                      }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                          <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor" />
                                        </svg></button>
                                    </div>
                                    {x.replies_count > 0 ?
                                      <button className='ms-4 bg-transparent border-0 fw-bold' style={{ color: '#5D5FE3', fontSize: '14px' }} onClick={(e) => {
                                        setreplies_layout(!replies_layout)
                                        getreplies(x.discid, index)
                                      }}>{translate_value.dashboard.view_all} {x.replies_count} {translate_value.dashboard.replies}</button> : <p></p>
                                    }
                                  </div>

                                  {fetchedreplies && fetchedreplies.length > 0 && (
                                    <div className={fetchedreplies[0].discid == x.discid && replies_layout ? 'd-block' : 'd-none'}>
                                      {fetchedreplies.map((y) => {

                                        return (
                                          <div className='ps-0 ps-md-3 py-2 mt-3' onClick={() => {
                                            setindex1(-1)
                                          }}>
                                            <div className="row w-100">
                                              <div className="col-2 col-md-1 d-flex justify-content-end">
                                                <img src={y.user.profile_pic} className={y.user.profile_pic == null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
                                                <p className={y.user.profile_pic == null ? 'bg-info text-white p-2 rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{ fontSize: '14px', height: '30px', width: '30px' }}><span>{y.user.nickname.slice(0, 1)}</span><span>{y.user.nickname.slice(-1)}</span></p>
                                              </div>
                                              <div className="col-8 col-md-9 p-0">
                                                <h6 className='ms-1 ms-sm-0 my-0' style={{ fontSize: '12px' }}>{y.user.nickname}</h6>
                                                <p className='ms-1 ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                              </div>
                                              <div className="col-2 p-0 d-flex justify-content-between">
                                                <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: y.liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                  if (y.liked_status == true) {
                                                    handleReplyLike1(y.disrid, x.discid, index)
                                                  }
                                                  else {
                                                    handleReplyLike(y.disrid, x.discid, index)
                                                  }
                                                }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                    <path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z" fill="currentColor" />
                                                  </svg> {y.like_count}</button>

                                                <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: y.dis_liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                  handlereplydislike(y.disrid, x.discid, index)
                                                }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                    <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor" />
                                                  </svg></button>
                                                <button className={userdata.user_id === y.user.user_id ? 'bg-transparent border-0 ms-1 d-flex align-items-center' : 'd-none'} onClick={() => {
                                                  deleteReply(y.disrid, x.discid)
                                                }} style={{ height: '20px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                    <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#808080" />
                                                  </svg></button>
                                              </div>
                                            </div>
                                            <div className='ps-md-5 ps-0 mt-2 m-0 pe-5' style={{ width: '100%', overflowWrap: 'break-word', overflowX: 'hidden' }}>
                                              <p className='m-0 text-secondary' style={{ fontSize: '14px' }}>{y.post}</p>
                                              {y.images_attached.map((a) => {
                                                return (
                                                  <div className='d-flex justify-content-center'>
                                                    <img src={a.doc_reply_images} width={300} alt="" className='mt-3' />
                                                  </div>
                                                )
                                              })}
                                            </div>

                                            {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
                                            <div className="mt-2 ps-0 ps-0 ps-md-5">
                                              <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal" onClick={() => {
                                                setdiscuss_id(x.discid)
                                                setreply_id(y.disrid)
                                              }} style={{ cursor: 'pointer' }} className="reply_for_reply fw-bold d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                  <path d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z" fill="#2A3941" />
                                                </svg> <span className="ms-1">reply</span></span>

                                              <p style={{ cursor: 'pointer' }} className={`view_reply_for_reply mt-2 ${y.replies_replies_count > 0 ? '' : 'd-none'}`} onClick={() => {
                                                setreplies_for_reply_status(!replies_for_reply_status)
                                                getreplies_for_reply(y.disrid)
                                              }}>---View {y.replies_replies_count} replies</p>

                                              {fetchedreplies_for_reply && fetchedreplies_for_reply.length > 0 && (
                                                <div className={fetchedreplies_for_reply[0].discid == y.disrid && replies_for_reply_status ? 'd-block' : 'd-none'}>
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
                                                          <div className="col-7 col-lg-8 ps-0 p-0">
                                                            <h6 className='ms-sm-0 my-0' style={{ fontSize: '12px' }}>
                                                              <Link to={`/profile/${z.user_id.user_id}`} className="text-decoration-none text-dark">{z.user_id.nickname}</Link>
                                                            </h6>
                                                            <p className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                                          </div>
                                                          <div className="col-3 col-lg-2 ms-auto p-0 d-flex justify-content-between align-items-center">
                                                            <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: z.liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                              handleReplies_reply_like(z.id, y.disrid)
                                                            }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                                                                <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor" />
                                                              </svg> <span className="ms-1" style={{ fontSize: '14px' }}>{z.likes_count}</span></button>
                                                            <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: z.dis_like_status ? "#ff845d" : "gray" }} onClick={() => {
                                                              handlereplies_replydislike(z.id, y.disrid)
                                                            }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                                                                <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor" />
                                                              </svg></button>
                                                            <button className={userdata.first_name === z.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'} onClick={() => {
                                                              deleteReply_for_reply(z.id, y.disrid, x.discid)
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
                                                                <img src={b.dis_reply_reply_images} width={260} alt="" className='mt-3' />
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
                                        )
                                      })}

                                    </div>
                                  )}

                                  {/* -----------------------------------------------To reply for particular comment section------------------------------- */}
                                  <div onClick={() => {
                                    setindex1(-1)
                                  }} className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center'>
                                    <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                    {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ fontSize: '14px', height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                    <div className="input-group border rounded pe-3 bg-light">
                                      <input key={index}
                                        type="text"
                                        name={post}
                                        onChange={repliesData}
                                        className="form-control py-3 ps-3 shadow-none border-0 bg-light reply-input" placeholder={translate_value.dashboard.reply_here}
                                        style={{ position: 'relative' }} />
                                      <div className='d-flex align-items-center bg-light'>
                                        <input
                                          id="file"
                                          type='file'
                                          name='file'
                                          accept="image/*"
                                          multiple
                                          onChange={handleReplyImage}
                                          className="bg-light text-center p-3 btn"
                                        />
                                        <label data-bs-toggle="tooltip" data-bs-placement="top"
                                          data-bs-custom-class="custom-tooltip"
                                          data-bs-title="Attach Image"
                                          htmlFor="file"
                                          className="custom-file-input bg-transparent border-0 px-4 py-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                            <path d="M21.6825 19.4231C21.6825 21.3164 21.0302 22.9276 19.7258 24.2565C18.4213 25.5855 16.8259 26.25 14.9397 26.25C13.0535 26.25 11.4541 25.5855 10.1416 24.2565C8.8291 22.9276 8.17285 21.3164 8.17285 19.4231V8.50962C8.17285 7.1875 8.62758 6.0637 9.53704 5.13822C10.4465 4.21274 11.5623 3.75 12.8844 3.75C14.2065 3.75 15.3223 4.21274 16.2318 5.13822C17.1412 6.0637 17.5959 7.1875 17.5959 8.50962V18.8462C17.5959 19.5801 17.3399 20.2123 16.8277 20.7428C16.3155 21.2732 15.6913 21.5385 14.9551 21.5385C14.2189 21.5385 13.5855 21.2774 13.0551 20.7552C12.5246 20.2331 12.2594 19.5967 12.2594 18.8462V8.46153H13.5094V18.8462C13.5094 19.2452 13.646 19.5853 13.9193 19.8666C14.1925 20.1478 14.5286 20.2885 14.9277 20.2885C15.3267 20.2885 15.6628 20.1478 15.9361 19.8666C16.2093 19.5853 16.3459 19.2452 16.3459 18.8462V8.48556C16.3411 7.51442 16.0072 6.69071 15.3443 6.01444C14.6814 5.33815 13.8614 5 12.8844 5C11.9152 5 11.0959 5.34215 10.4267 6.02644C9.75747 6.71073 9.42285 7.53846 9.42285 8.50962V19.4231C9.41806 20.9663 9.95252 22.2816 11.0262 23.369C12.1 24.4563 13.4073 25 14.9484 25C16.4677 25 17.7592 24.4563 18.8227 23.369C19.8863 22.2816 20.4229 20.9663 20.4325 19.4231V8.46153H21.6825V19.4231Z" fill="#8E9696" />
                                          </svg>
                                        </label>
                                        <button
                                          onClick={() => {
                                            // Assuming postQuestion and postReplies are functions defined elsewhere
                                            postReplies(x.discid, index);
                                          }}
                                          disabled={replies.length > 0 ? false : true}
                                          className='h-100 bg-transparent border-0 ms-2'
                                        >
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
                                    <div className="modal fade" id="RepliesModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                      <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                          <div className="modal-body">
                                            <div className='text-center'>
                                              <input
                                                id="file"
                                                type='file'
                                                name='file'
                                                accept="image/*"
                                                multiple
                                                onChange={handleReplyImage}
                                                className="bg-light text-center p-3 btn"
                                              />
                                              <label
                                                htmlFor='file'
                                                className="custom-file-input rounded-pill border-0 bg-primary bg-gradient text-white px-4 py-2"
                                              >Upload Image</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>



                                  </div>
                                  <div className='d-flex gap-3 mt-3'>
                                    {repliesImage.length > 0 &&
                                      repliesImage.map((image, index) => (
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

                      {/* ----------------------------------------Course Documents Section-------------------------------------------------- */}
                      <div className="tab-pane fade bg-light mt-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                        <h6 className={`text-secondary text-center mt-4 ${courseDocuments.length > 0 ? 'd-none' : ''}`}>Upload your Documents!!!</h6>
                        {courseDocuments.length > 0 && (
                          <div>
                            {subloading ? (<Small_Preloader />) : (
                              <div className="row">
                                <div className="col-12">
                                  <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
                                    <span className='fw-bold' style={{ color: '#8E9696' }}>{courseDocuments.length} Documents</span>
                                    <div>
                                      <select name="" id="filter" className='border border-secondary py-1 px-1 px-md-3 rounded px-2 bg-light' onChange={(e) => {
                                        if (e.target.value === "select_filter1") {
                                          setSelectedCategory(e.target.value)
                                          document.getElementById('original').style.display = 'block'
                                          document.getElementById('filterlike').style.display = 'none'
                                        }
                                        else {
                                          setSelectedCategory(e.target.value)
                                          console.log(e.target.value)
                                          filterfunction2(e.target.value, "")
                                        }
                                      }}>
                                        <option value="select_filter1" className='mt-2'>Select Category</option>
                                        <option value="exam_paper" className=''>Exam Paper</option>
                                        <option value="notes" className=''>Notes</option>
                                        <option value="chapter" className=''>Chapter</option>

                                      </select>

                                      <select name="" id="filter" className={`border border-secondary py-1 px-2 px-md-3 rounded bg-light ms-2 ${selectedCategory === "select_filter1" ? 'd-none' : ''}`} onChange={(e) => {
                                        filterfunction2(selectedCategory, e.target.value)
                                      }}>
                                        <option value="date" className='mt-2'>Updated</option>
                                        <option value="rating" className=''>Rating</option>
                                        <option value="likes" className=''>Likes</option>

                                      </select>

                                      {/* <select name="" id="filter" className={`border-0 px-2 bg-light ms-2 ${selectedCategory==="" ? 'd-none':''}`} onChange={(e)=>{
    filterfunction2(e.target.value)
  }}>
  <option value="select_filter" className='mt-2'>All</option>
  <option value="rating" className=''>Rating</option>
  <option value="likes" className=''>Likes</option>
  <option value="date" className=''>Date</option>
  
  </select> */}
                                    </div>

                                  </div>
                                  {/* ORIGINAL */}
                                  <div id='original'>
                                    {courseDocuments.map((x) => {
                                      return (
                                        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                          <div className="row m-0 align-items-center">
                                            <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
                                              <Document file={x.file.document}>
                                                <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
                                              </Document>
                                            </div>
                                            <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                                              <div className="row m-0 border-bottom">
                                                <div className='d-flex justify-content-between'>
                                                  <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 250 }}
                                                    overlay={renderTooltip(course_name)}
                                                  >
                                                    <Link className='fw-bold d-none d-md-inline' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.file.title}</Link>
                                                  </OverlayTrigger>
                                                  <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 250 }}
                                                    overlay={renderTooltip(course_name)}
                                                  >
                                                    <Link className='fw-bold d-inline d-md-none' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.file.title.slice(0, 16)}</Link>
                                                  </OverlayTrigger>
                                                  <div className='d-flex'>
                                                    <button onClick={() => {
                                                      unsave(x.document_id)
                                                    }} className={`bg-transparent border-0 d-flex align-items-center ${x.study_list_status ? '' : 'd-none'}`} style={{ color: '#8587EA' }}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                        <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3" />
                                                      </svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>

                                                    <button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none' : ''}`} style={{ color: '#8587EA' }} onClick={() => {
                                                      setdocument_id(x.document_id)
                                                    }}>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                        <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3" />
                                                      </svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>

                                                    <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                      <path d="M7.50016 11.2261L3.81425 7.54021L4.55144 6.79102L6.97933 9.21891V0.208496H8.021V9.21891L10.4489 6.79102L11.1861 7.54021L7.50016 11.2261ZM1.89118 14.7918C1.41175 14.7918 1.01145 14.6312 0.690267 14.3101C0.369086 13.9889 0.208496 13.5886 0.208496 13.1091V10.5851H1.25016V13.1091C1.25016 13.2694 1.31693 13.4163 1.45048 13.5498C1.58403 13.6834 1.73094 13.7502 1.89118 13.7502H13.1091C13.2694 13.7502 13.4163 13.6834 13.5498 13.5498C13.6834 13.4163 13.7502 13.2694 13.7502 13.1091V10.5851H14.7918V13.1091C14.7918 13.5886 14.6312 13.9889 14.3101 14.3101C13.9889 14.6312 13.5886 14.7918 13.1091 14.7918H1.89118Z" fill="#8E9696" />
                                                    </svg><span className='ms-1'>{x.download_count}</span></span>
                                                  </div>
                                                </div>
                                                <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                  <img src={x.user_info.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_info.profile_pic != null ? '' : 'd-none'}`} />
                                                  {x.user_info.nickname != undefined ? (<p className={x.user_info.profile_pic == null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{ width: '30px', height: '30px', fontSize: '15px' }}><span>{x.user_info.nickname.slice(0, 1)}</span><span>{x.user_info.nickname.slice(-1)}</span></p>) : (<></>)}
                                                  {x.user_info.nickname} <span style={{ color: '#8E9696' }} className='ms-1'>{x.created_on}</span></p>
                                              </div>
                                              <div className="m-0 d-flex align-items-center mt-2">
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                </svg><span className='ms-1'>{x.views_count} <span className='d-lg-inline d-none'>Views</span></span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                  <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696" />
                                                </svg>  <span className='ms-1'>{x.discussion_post_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696" />
                                                </svg> <span className='ms-1'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                                </svg> <span className='ms-1'>{x.followers_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className={`ms-3 d-none d-md-flex align-items-center`}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                                  <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                                  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                                                </svg><span className='ms-1'>{x.file.sub_cat}</span></span>

                                              </div>

                                            </div>
                                          </div>

                                        </div>
                                      )
                                    })}
                                  </div>

                                  {/* LIKES*/}
                                  <div id='filterlike' style={{ display: 'none' }}>
                                    {filtereddocuments.length <= 0 && (
                                      <h6 className='text-center text-secondary mt-3'>No Documents Found !!!</h6>
                                    )}
                                    {filtereddocuments.map((x) => {
                                      return (
                                        <div className='shadow-sm mt-3 py-2 px-2 px-lg-0 bg-white'>
                                          <div className="row m-0 align-items-center">
                                            <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
                                              <Document file={x.document} onLoadSuccess={() => console.log('Document loaded successfully.')}>
                                                <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
                                              </Document>
                                            </div>
                                            <div className="col-8 col-md-9 ms-md-0 d-flex flex-column justify-content-center ">
                                              <div className="row m-0 border-bottom">
                                                <div className='d-flex justify-content-between'>
                                                  <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 250, hide: 250 }}
                                                    overlay={renderTooltip(course_name)}
                                                  >
                                                    <Link className='fw-bold d-none d-md-inline' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                                                  </OverlayTrigger>

                                                  <Link className='fw-bold d-inline d-md-none' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title.slice(0, 16)}</Link>

                                                  {/* Save document to studylist buttons------------------------------------------- */}
                                                  <button onClick={() => {
                                                    unsave(x.document_id)
                                                  }} className={`bg-transparent border-0 ${x.study_list_status ? '' : 'd-none'}`} style={{ color: '#8587EA' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                      <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3" />
                                                    </svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>

                                                  <button data-bs-toggle="modal" data-bs-target="#studylist_modal" onClick={() => {
                                                    setdocument_id(x.document_id)
                                                  }} className={`bg-transparent border-0 ${x.study_list_status ? 'd-none' : ''}`} style={{ color: '#8587EA' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                      <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3" />
                                                    </svg> <span className='ms-2 d-none d-md-inline'>Save</span></button>
                                                </div>
                                                <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                  <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic != null ? '' : 'd-none'}`} />
                                                  <p className={x.user_details.profile_pic == null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{ width: '30px', height: '30px', fontSize: '15px' }}><span>{x.user_details.nickname.slice(0, 1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>
                                                  {x.user_details.nickname}<span style={{ color: '#8E9696' }} className='ms-1'>{x.created_on}</span></p>
                                              </div>
                                              <div className='d-lg-block d-none'>
                                                <div className="m-0 d-flex align-items-center mt-2">
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Rating" style={{ fontSize: '14px', color: '#AAB0B0' }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.likes} <span className='d-lg-inline d-none'></span>Likes</span></span>
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Comments" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'></span> {x.comment_count} <span className='d-lg-inline d-none ms-1'></span>Discussions</span>
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Pages Count" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'></span>Pages</span></span>
                                                  <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                  </svg><span className='ms-1'>{x.views_count} <span className='d-lg-inline d-none'>Views</span></span></span>
                                                  <span style={{ fontSize: '14px', color: '#AAB0B0' }} className={`ms-3 ${selectedCategory === 'chapter' && x.chapter_name !== "" ? 'd-none d-md-flex align-items-center' : 'd-none'}`}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                                    <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                                    <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                                                  </svg><span className='ms-1'>{x.chapter_name}</span></span>


                                                </div>
                                              </div>

                                              {/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
                                              <div className='d-sm-block d-md-block d-lg-none'>
                                                <div className="m-0 d-flex align-items-center mt-2">
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Rating" style={{ fontSize: '14px', color: '#AAB0B0' }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.likes}</span></span>
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Comments" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'></span> {x.comment_count}</span>
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Pages Count" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696" />
                                                    </svg> <span className='ms-2'>{x.pages}</span></span>
                                                  <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                    data-bs-custom-class="custom-tooltip"
                                                    data-bs-title="Likes" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
                                                    </svg> <span className='ms-2'>{x.average_rating}</span></span>
                                                  <span className='d-none d-lg-block'>
                                                    <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                      data-bs-custom-class="custom-tooltip"
                                                      data-bs-title="Likes" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                      </svg><span className='ms-2'>{x.created_on}</span></span>
                                                  </span>

                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* --------------------------------------------Flashcards Section----------------------------------------------------- */}
                      <div className="tab-pane fade bg-white" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                        <div>
                          {subloading ? (<Small_Preloader />) : (
                            <div className="row">
                              <div className="col-12">
                                <div className='d-flex justify-content-between py-3 px-3 align-items-center'>
                                  <div>
                                    {/* <span className='fw-bold' style={{color:'#8E9696'}}>{flashsets.length} Flashsets</span> */}
                                    <span className={`fw-medium p-1 px-1 px-md-2`}
                                      style={{ cursor: 'pointer', color: flashsetstatus === "public" ? '#fff' : '', borderRadius: '5px 0px 0px 5px', backgroundColor: flashsetstatus === "public" ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }}
                                      onClick={() => {
                                        setflashsetstatus("public")
                                        getallflashsetsundersubject()
                                      }}>Public</span>
                                    <span className={`fw-medium p-1 px-1 px-md-2`}
                                      style={{ cursor: 'pointer', color: flashsetstatus === "myflashcards" ? '#fff' : '', borderRadius: '0px 5px 5px 0px', backgroundColor: flashsetstatus === "myflashcards" ? '#5D5FE3' : '', border: '1px solid #5D5FE3' }}

                                      onClick={() => {
                                        setflashsetstatus("myflashcards")
                                        getparticularusersflashsets()
                                      }}>My Flashcards</span>
                                  </div>


                                  {/* <div className='d-flex justify-content-between bg-light py-3 align-items-center px-2 px-md-3'>
              <h6 className='w-50 d-flex justify-content-center py-2' onClick={()=>{
                setGroups("opengroups")
              }}  style={{cursor:'pointer', color:groups==='opengroups' ? '#fff' : '',borderRadius:'5px 0px 0px 5px',backgroundColor:groups==='opengroups' ? '#5D5FE3':'',border:'1px solid #5D5FE3'}}>{translate_value.group.open_groups}</h6>
              <h6 className='w-50 d-flex justify-content-center py-2' onClick={()=>{
                setGroups("privategroups")
              }} style={{cursor:'pointer', color:groups==='privategroups' ? '#fff' : '',borderRadius:'0px 5px 5px 0px',backgroundColor:groups==='privategroups' ? '#5D5FE3':'',border:'1px solid #5D5FE3'}}>{translate_value.group.private_group}</h6> */}
                                  {/* <button className='btn border border-primary-subtle px-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{height:'44px',color:'#8587EA',fontSize:'19px'}}>Join</button> */}
                                  {/* </div> */}


                                  <select name="" id="filter" className={`border-0 px-2 bg-light ${flashsetstatus === "myflashcards" ? '' : 'd-none'}`} onChange={(e) => {
                                    filterflashsets(e.target.value)
                                  }}>
                                    <option value="select_filter" className='mt-2'>All</option>
                                    <option value="likes" className=''>Likes</option>
                                    <option value="date" className=''>Date</option>
                                  </select>


                                  <select name="" id="filter" className={`border-0 px-2 bg-light ${flashsetstatus === "public" ? '' : 'd-none'}`} onChange={(e) => {
                                    filterpublicflashsets(e.target.value)
                                  }}>
                                    <option value="select_filter" className='mt-2'>All</option>
                                    <option value="likes" className=''>Likes</option>
                                    <option value="date" className=''>Date</option>
                                  </select>
                                </div>
                                {/* ORIGINAL */}
                                <div id='flashsetoriginal' >
                                  {flashsets.map((x) => {
                                    return (
                                      <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                        <div className="row m-0 align-items-center ps-2 ps-lg-3">
                                          <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{ overflow: 'hidden', backgroundColor: '#CFF4D2', height: '100px', width: '100px', border: '0.5px solid #21B3A9' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                              <path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9" />
                                            </svg>
                                          </div>
                                          <div className="col-8 ps-0 col-lg-10 ms-md-0 d-flex flex-column justify-content-center ">
                                            <div className="row m-0 border-bottom">
                                              <div className='d-flex justify-content-between'>
                                                <Link to={`/viewflashcard/subject/${course_id}/${x.flashset_id}`} className='fw-bold' style={{ color: '#2A3941' }}>{x.name}</Link>
                                                <button className={`bg-transparent border-0 ${x.studylist_status ? 'd-none' : ' d-flex align-items-center'}`} style={{ color: '#8587EA' }} onClick={() => {
                                                  setflashsetid(x.flashset_id)
                                                }} data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                    <path d="M6.25 20.3123V5.84919C6.25 5.36976 6.41059 4.96946 6.73177 4.64827C7.05295 4.32709 7.45325 4.1665 7.93268 4.1665H17.0673C17.5467 4.1665 17.947 4.32709 18.2682 4.64827C18.5894 4.96946 18.75 5.36976 18.75 5.84919V20.3123L12.5 17.628L6.25 20.3123ZM7.29167 18.6978L12.5 16.4582L17.7083 18.6978V5.84919C17.7083 5.68894 17.6416 5.54204 17.508 5.40848C17.3745 5.27494 17.2276 5.20817 17.0673 5.20817H7.93268C7.77244 5.20817 7.62554 5.27494 7.49198 5.40848C7.35844 5.54204 7.29167 5.68894 7.29167 5.84919V18.6978Z" fill="#5D5FE3" />
                                                  </svg>
                                                  <span className=''>Save</span></button>

                                                <button className={`bg-transparent border-0 ${x.studylist_status ? ' d-flex align-items-center' : 'd-none'}`} style={{ color: '#8587EA' }} onClick={() => {
                                                  unsave_flashset(x.flashset_id)
                                                }}>
                                                  <svg className={`${x.studylist_status ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                    <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123Z" fill="#5D5FE3" />
                                                  </svg>
                                                  <span className='ms-1'>Saved</span></button>
                                              </div>
                                              <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.profile_pic != null ? '' : 'd-none'}`} />
                                                {x.nickname != undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.profile_pic != null ? 'd-none' : 'd-flex align-items-center justify-content-center'}`} style={{ height: '30px', width: '30px' }}>{x.nickname.slice(0, 1)}{x.nickname.slice(-1)}</span>) : (<></>)}
                                                <span className='ms-1'>{x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></span></p>
                                            </div>
                                            <div className="m-0 d-flex align-items-center mt-2">

                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M4.5012 21.146L4.29688 21.0618C3.74533 20.8228 3.37507 20.4255 3.18609 19.8699C2.99712 19.3144 3.02416 18.7742 3.26721 18.2493L4.5012 15.5891V21.146ZM9.46914 22.7966C8.89622 22.7966 8.40577 22.5926 7.99779 22.1846C7.5898 21.7766 7.38581 21.2862 7.38581 20.7133V16.5867L9.38503 22.1195C9.43711 22.2544 9.48919 22.3749 9.54128 22.4811C9.59336 22.5873 9.6628 22.6924 9.74961 22.7966H9.46914ZM13.5116 21.8511C13.2365 21.966 12.9654 21.9499 12.6983 21.803C12.4312 21.6561 12.2403 21.4384 12.1254 21.15L7.48997 8.44164C7.37513 8.16654 7.38582 7.89444 7.52203 7.62534C7.65825 7.35622 7.86391 7.16625 8.13901 7.05542L16.0036 4.19083C16.2787 4.07597 16.5431 4.092 16.7969 4.23891C17.0506 4.38582 17.2349 4.6035 17.3498 4.89195L21.9852 17.5602C22.1 17.8487 22.0994 18.1308 21.9832 18.4066C21.867 18.6824 21.6647 18.8757 21.3762 18.9865L13.5116 21.8511ZM11.6326 10.4168C11.9277 10.4168 12.1751 10.317 12.3748 10.1173C12.5744 9.91767 12.6743 9.67027 12.6743 9.37513C12.6743 9.07999 12.5744 8.8326 12.3748 8.63294C12.1751 8.43329 11.9277 8.33346 11.6326 8.33346C11.3375 8.33346 11.0901 8.43329 10.8904 8.63294C10.6908 8.8326 10.5909 9.07999 10.5909 9.37513C10.5909 9.67027 10.6908 9.91767 10.8904 10.1173C11.0901 10.317 11.3375 10.4168 11.6326 10.4168ZM13.143 20.8335L21.0076 17.9689L16.3722 5.20846L8.5076 8.07305L13.143 20.8335Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

                                              <span className=''>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                </svg><span className='ms-2'>{x.viewcount}</span></span>
                                              </span>

                                            </div>

                                          </div>
                                        </div>

                                      </div>
                                    )
                                  })}
                                </div>

                                {/* -----------------------------------------To display filtered and searched flashsets section------------------- */}
                                <div id='filtered_flashset' className={`${searchedFlashsets.length > 0 ? '' : 'd-none'}`}>
                                  {searchedFlashsets && (
                                    searchedFlashsets.map((x) => {
                                      return (
                                        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                          <div className="row m-0 align-items-center ps-3">
                                            <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{ overflow: 'hidden', backgroundColor: '#CFF4D2', height: '100px', width: '100px', border: '0.5px solid #21B3A9' }}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                                <path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9" />
                                              </svg>
                                            </div>
                                            <div className="col-10 ps-0 col-lg-10 ms-md-0 d-flex flex-column justify-content-center ">
                                              <div className="row m-0 border-bottom">
                                                <div className='d-flex justify-content-between'>
                                                  <Link to={`/viewflashcard/subject/${course_id}/${x.flashset_id}`} className='fw-bold' style={{ color: '#2A3941' }}>{x.name}</Link>
                                                  <button className={`bg-transparent border-0 ${x.studylist_status ? 'd-none' : ' d-flex align-items-center'}`} style={{ color: '#8587EA' }} onClick={() => {
                                                    setflashsetid(x.flashset_id)
                                                  }} data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M6.25 20.3123V5.84919C6.25 5.36976 6.41059 4.96946 6.73177 4.64827C7.05295 4.32709 7.45325 4.1665 7.93268 4.1665H17.0673C17.5467 4.1665 17.947 4.32709 18.2682 4.64827C18.5894 4.96946 18.75 5.36976 18.75 5.84919V20.3123L12.5 17.628L6.25 20.3123ZM7.29167 18.6978L12.5 16.4582L17.7083 18.6978V5.84919C17.7083 5.68894 17.6416 5.54204 17.508 5.40848C17.3745 5.27494 17.2276 5.20817 17.0673 5.20817H7.93268C7.77244 5.20817 7.62554 5.27494 7.49198 5.40848C7.35844 5.54204 7.29167 5.68894 7.29167 5.84919V18.6978Z" fill="#5D5FE3" />
                                                    </svg>
                                                    <span className='ms-1'>Save</span></button>

                                                  <button className={`bg-transparent border-0 ${x.studylist_status ? ' d-flex align-items-center' : 'd-none'}`} style={{ color: '#8587EA' }} onClick={() => {
                                                    unsave_flashset(x.flashset_id)
                                                  }}>
                                                    <svg className={`${x.studylist_status ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                      <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123Z" fill="#5D5FE3" />
                                                    </svg>
                                                    <span className='ms-1'>Saved</span></button>
                                                </div>
                                                <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                  <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.profile_pic != null ? '' : 'd-none'}`} />
                                                  {x.nickname != undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.profile_pic != null ? 'd-none' : 'd-flex align-items-center justify-content-center'}`} style={{ height: '30px', width: '30px' }}>{x.nickname.slice(0, 1)}{x.nickname.slice(-1)}</span>) : (<></>)}
                                                  <span className='ms-1'>{x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></span></p>
                                              </div>
                                              <div className="m-0 d-flex align-items-center mt-2">

                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696" />
                                                </svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                  <path d="M4.5012 21.146L4.29688 21.0618C3.74533 20.8228 3.37507 20.4255 3.18609 19.8699C2.99712 19.3144 3.02416 18.7742 3.26721 18.2493L4.5012 15.5891V21.146ZM9.46914 22.7966C8.89622 22.7966 8.40577 22.5926 7.99779 22.1846C7.5898 21.7766 7.38581 21.2862 7.38581 20.7133V16.5867L9.38503 22.1195C9.43711 22.2544 9.48919 22.3749 9.54128 22.4811C9.59336 22.5873 9.6628 22.6924 9.74961 22.7966H9.46914ZM13.5116 21.8511C13.2365 21.966 12.9654 21.9499 12.6983 21.803C12.4312 21.6561 12.2403 21.4384 12.1254 21.15L7.48997 8.44164C7.37513 8.16654 7.38582 7.89444 7.52203 7.62534C7.65825 7.35622 7.86391 7.16625 8.13901 7.05542L16.0036 4.19083C16.2787 4.07597 16.5431 4.092 16.7969 4.23891C17.0506 4.38582 17.2349 4.6035 17.3498 4.89195L21.9852 17.5602C22.1 17.8487 22.0994 18.1308 21.9832 18.4066C21.867 18.6824 21.6647 18.8757 21.3762 18.9865L13.5116 21.8511ZM11.6326 10.4168C11.9277 10.4168 12.1751 10.317 12.3748 10.1173C12.5744 9.91767 12.6743 9.67027 12.6743 9.37513C12.6743 9.07999 12.5744 8.8326 12.3748 8.63294C12.1751 8.43329 11.9277 8.33346 11.6326 8.33346C11.3375 8.33346 11.0901 8.43329 10.8904 8.63294C10.6908 8.8326 10.5909 9.07999 10.5909 9.37513C10.5909 9.67027 10.6908 9.91767 10.8904 10.1173C11.0901 10.317 11.3375 10.4168 11.6326 10.4168ZM13.143 20.8335L21.0076 17.9689L16.3722 5.20846L8.5076 8.07305L13.143 20.8335Z" fill="#8E9696" />
                                                </svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

                                                <span className=''>
                                                  <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                  </svg><span className='ms-2'>{x.viewcount}</span></span>
                                                </span>

                                              </div>

                                            </div>
                                          </div>

                                        </div>
                                      )
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>


                  <div className="col-lg-3" onClick={() => {
                    setindex1(-1)
                    setreportdropdownstate(false)
                  }}>
                    <div onClick={() => {
                      setindex1(-1)
                      setreportdropdownstate(false)
                    }} className="bg-white px-2 rounded d-flex flex-column align-items-center mb-3" style={{ height: '400px' }}>
                      <img className={`mt-2 ${tablist === "documents" || tablist === "flashcards" ? "d-block" : "d-none"}`} src={require('../img/images_icons/send-img2.png')} width={60} alt="" />
                      <img className={`mt-2 ${tablist === "discussion" ? "d-block" : "d-none"}`} src={require('../img/images_icons/send-img1.png')} width={60} alt="" />
                      <img src={require('../img/images_icons/mascot1.png')} style={{ height: '250px', width: '118px' }} alt="" />
                      <button className={`btn mt-3 w-100 fw-medium ${tablist === "discussion" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3', fontWeight: 500 }} data-bs-toggle="modal"
                        data-bs-target="#postmodal">{translate_value.dashboard.create_a_post}</button>
                      <Link to={`/uploadpage/${course_id}/${course_name}`} className={`btn mt-3 w-100 fw-medium ${tablist === "documents" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3', fontWeight: 500 }}>{translate_value.common_words.upload_document}</Link>
                      <Link to='/flashcard' className={`btn mt-3 w-100 fw-medium ${tablist === "flashcards" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3', fontWeight: 500 }}>{translate_value.common_words.create_flashcard}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* TOAST MESSAGE */}
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

              <div className="toast-body d-flex justify-content-between align-items-center">
                <span id='toastbody' className='fw-medium p-2'></span>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
            </div>
          </div>

          {/* LEAVE THE COURSE POP UP */}

          <div className="modal fade" id="leavecourse" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-body pt-4 pb-3">
                  {/* <p className=''>Are you Surely Want to Leave the Course?</p>
      <div className='text-end'>
        <button className='btn btn-sm border-0 btn-success text-white me-2' data-bs-dismiss="modal" onClick={leaveCourse}>Yes</button><button className='btn btn-sm border-0 btn-danger text-white' data-bs-dismiss="modal">No</button>
      </div> */}
                  <div>
                    <label htmlFor="" className='fw-medium text-dark'>Why you want to leave this course ? </label>
                    <textarea maxLength={20} onChange={(e) => {
                      setexitgroup_reason(e.target.value)
                    }} className='form-control shadow-sm mt-2 py-3'></textarea>
                  </div>
                  <div className='mt-3 text-end'>
                    <button className='btn btn-sm rounded-pill text-white fw-medium px-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-dismiss="modal" onClick={leaveCourse}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------Report subject--------------------------------------------------- */}
          <div className="modal fade" id="reportsubjectmodal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-body pt-4 pb-3">
                  <div>
                    <label htmlFor="" className='fw-medium text-dark'>⚠ Report the subject</label>
                    <textarea placeholder='Reason must be more than 20 characters...' onChange={(e) => {
                      setReportvalue(e.target.value)
                    }} className='form-control shadow-sm mt-2 py-3'></textarea>
                  </div>
                  <div className='mt-3 text-end'>
                    <button disabled={reportvalue.length > 20 ? false : true} className='btn btn-sm rounded-pill text-white fw-medium px-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-dismiss="modal" onClick={reportCourse}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -----------------------------------------------To post the reply for reply modal------------------------------------------ */}
          <div className="modal fade" id="replyforreply_modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

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
                            <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removereply_Image(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
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


          {/* ----------------------------------------------Create Flashcard Study list layout form------------------------------- */}
          <Create_flashcard_study_list setCount={setCount1} flashset_id={flashsetid} call_function={dummyfunc} />

          {/* -------------------------------------------Create document studylist------------------------------------------------ */}
          <Create_study_list document_id={document_id} setCount={setCount} call_function={fetchdocuments} />

          <Backtotop />

          <Report_post disc_type={"subject"} setCount={setCount} setindex1={setindex1} report_status={report_status} setreport_status={setreport_status} discussion_id={report_id} />
        </div>
      )}
    </div>

  )
}

export default Subjects