import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Group_discussion_modals from './Group_discussion_modals'
import Preloader from './Preloader'
import { Document, Page } from 'react-pdf'
import { ipaddress, ipaddress2 } from '../App'
import { Context } from '../context/Context_provider'
import Create_flashcard_study_list from './Create_Flashcard_study_list'
import Small_Preloader from './Small_loader'
import Backtotop from './Backtotop'
import Group_discussion_pincomments from './Group_discussion_pincomments'
import Navpath from './Navpath'
import Create_study_list from './Create_study_list'
import Report_post from './Report_post'
import Group_search_comments from './Group_search_comments'
import { toast } from 'react-toastify'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axiosInstance from './axiosInstance'
import { getAccessToken } from './authService'
import * as bootstrap from 'bootstrap';


const Groupchat = () => {

  const { translate_value, setgroup_id, group_documents_count, group_flashsets_count, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const renderTooltip = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );

  let [count, setCount] = useState(0)
  let { group_id } = useParams()
  let { grouptype } = useParams()
  const [loading, setLoading] = useState(true)
  const [subloading, setsubLoading] = useState()
  const [replies_layout, setreplies_layout] = useState(false)
  const [pincomment_status, setpincomment_status] = useState(false)
  const [usercomments_status, setusercomments_status] = useState(false)
  const [document_id, setdocument_id] = useState()
  let navigate = useNavigate()
  const [index1, setindex1] = useState(-1)
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [flashsetid, setflashsetid] = useState("")

  const [original_status, setoriginal_status] = useState(true)

  // -------------------------------------------------Set Path-------------------------------------------------------------
  sessionStorage.setItem("name2", JSON.stringify('Groups'))
  sessionStorage.setItem("path2", JSON.stringify(`/groupchat/${grouptype}/${group_id}`))

  sessionStorage.removeItem("name3")
  sessionStorage.removeItem("path3")

  // -------------------------------------------Tablist Javascript--------------------------------------------------------
  const [tablist, setTablist] = useState("discussion")
  const [groupdetails, setGroupdetails] = useState({})
  const [groupdiscussion, setGroupdiscussion] = useState([])
  const [groupdocuments, setGroupdocuments] = useState([])
  const [count1, setCount1] = useState(0)
  const [userdetails, setUserdetails] = useState({})

  useEffect(() => {
    axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r) => {
        // console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
        setLoading(false)
      })
      .catch(() => {
        console.log("User Details Fetching Error")
      })

    setgroup_id(group_id)

    fetchgroupdetails()

    setLoading(false)

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };
  }, [group_id])

  // -------------------------------------Function to fetch the particular Group details------------------------------------
  const fetchgroupdetails = () => {
    axiosInstance.get(`${ipaddress}/DisplayGroupDetails/${group_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Particular Group Details",r.data)
        setGroupdetails(r.data)
      })
      .catch((err) => {
        console.log("Particular group error", err)
      })
  }

  // -------------------------------------Function to get particular group documents-----------------------------------------
  const fetchdocs = () => {
    setsubLoading(true)
    axiosInstance.get(`${ipaddress}/GroupDocuments/${user.user_id}/${group_id}/`)
      .then((r) => {
        // console.log("Particular Group Documents",r.data)
        const docs = r.data.reverse()
        setGroupdocuments(docs)
        setsubLoading(false)
      })
      .catch((err) => {
        console.log("Particular group documents error", err)
      })
  }

  // ----------------------------------  To get all the Flashsets under particular private group-----------------------------
  const [flashsets, setFlashsets] = useState([])

  const getallflashsetsundergroup = () => {
    setsubLoading(true)
    axiosInstance.get(`${ipaddress2}/GroupFlashCardSetRetrieveView/${group_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Private Group Flashsets Fetched Successfully :",r.data)
        setFlashsets(r.data)
        setsubLoading(false)
      })
      .catch(() => {
        console.log("Private Group Flashsets fetching Error")
      })
  }


  // ------------------------------------------------FILTER DOCUMENTS-------------------------------------------------------
  const [filtereddocuments, setFiltereddocuments] = useState([])
  const [filteredratingdocs, setFilteredratingdocs] = useState([])

  const filterdocs = (e) => {
    const value = e.target.value
    if (e.target.value === "likes") {
      filterfunction(`${ipaddress}/FilterGroupDocumentsByLikes/${group_id}/${user.user_id}/`)
    }
    if (e.target.value === "rating") {
      filterfunction(`${ipaddress}/FilterGroupDocumentsByRating/${group_id}/${user.user_id}/`)
    }
    if (e.target.value === "select_filter") {
      original()
    }
    if (e.target.value === "date") {
      filterfunction(`${ipaddress}/FilterGroupDocumentsByDate/${group_id}/${user.user_id}/`)
    }
  }
  const original = () => {
    document.getElementById('original').style.display = 'block'
    document.getElementById('filterlike').style.display = 'none'
  }

  const filterfunction = (value) => {
    axiosInstance.get(value)
      .then((r) => {
        // console.log("Group Documents Filtered Successfuly",r.data)
        setFiltereddocuments(r.data)
        document.getElementById('original').style.display = 'none'
        document.getElementById('filterlike').style.display = 'block'
      })
  }

  // ----------------------------------------Filter flashsets----------------------------------------------------

  const [searchedFlashsets, setSearchedFlashsets] = useState([])
  const filterflashsets = (value) => {
    if (value === "likes") {
      axiosInstance.post(`${ipaddress2}/FlashsetsFiltersGroups/${user.user_id}/${group_id}/`, {
        'like': true,
        'datetime': false
      })
        .then((r) => {
          setSearchedFlashsets(r.data)
          // document.getElementById('flashsetoriginal').style.display='none'
        })
    }
    if (value === "date") {
      axiosInstance.post(`${ipaddress2}/FlashsetsFiltersGroups/${user.user_id}/${group_id}/`, {
        'like': false,
        'datetime': true
      })
        .then((r) => {
          setSearchedFlashsets(r.data)
          // document.getElementById('flashsetoriginal').style.display='none'
        })
    }

    if (value === "select_filter") {
      setSearchedFlashsets([])
    }
  }



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

  const removemain_image = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const postQuestion = async (e) => {
    const formData = new FormData();

    for (const file of selectedImages) {
      if (file.size <= 1024 * 1024) {
        formData.append('images_attached', file);
      } else {
        console.error('File size exceeds 1 MB:', file.name);
        alert("Image size limit Exceeds")
      }
    }

    const encoded_question = encodeURIComponent(question)

    if (question.length > 0) {
      try {
        const token = getAccessToken()

        const response = await fetch(`${ipaddress}/NewGroupDiscussionView/${group_id}/${user.user_id}/""/?post=${encoded_question}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('Group discussion posted successfully');
          setCount(count + 1)
          setSelectedImages([])

          // Set the question to an empty string after a successful post
          setQuestion("");
          toast.success('Comment posted successfully', {
            autoClose: 2000,
          })
        } else {
          console.error('Group discussion posting error');
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
      if (file.size <= 1024 * 1024) {
        formData.append('images_attached', file);
      } else {
        console.error('File size exceeds 1 MB:', file.name);
        alert("Image size limit exceeds")
      }
    }

    const encoded_reply = encodeURIComponent(replies)

    if (replies.length > 0) {
      try {
        const token = getAccessToken()

        const response = await fetch(`${ipaddress}/NewGroupDiscussionReplyView/${user.user_id}/${dis_id}/${group_id}/""/?post=${encoded_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('Group Reply Reply Sent successfully',formData);
          setCount1(count1 + 1)
          setReplies("")
          clearInput(index)
          getdiscussion()
          toast.success('Replied successfully', {
            autoClose: 2000,
          })
          setCount(count + 1)
          setreplies_layout(false)

          setRepliesImage([])
          setload(false)
        } else {
          setload(false)
          console.error('Group Reply Reply sending error');
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

  const removereply_image = (index) => {
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

        const response = await fetch(`${ipaddress}/GroupDiscussionRepliesReplyView/${user.user_id}/${reply_id}/""/?post=${encoded_reply_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // console.log('Group Reply for reply Sent successfully',response.data);
          setReply_for_reply("")
          getreplies(discuss_id)
          setreplies_for_reply_status(false)
          setReplies_reply_image([])
        } else {
          console.error('Group Reply under reply sending error');
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
    axiosInstance.get(`${ipaddress}/NewGroupDiscussionView/${group_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Particular Group Discussion",r.data)
        setGroupdiscussion(r.data.reverse())
      })
      .catch((err) => {
        console.log("Particular group discussion error", err)
      })

  }
  useEffect(() => {
    setSearchcomment("")
    getdiscussion()
  }, [count, group_id])

  // ------------------------------------------------LIKES-------------------------------------------------------
  function handleLike1(discussion_id) {
    axiosInstance.delete(`${ipaddress}/NewGroupDiscussionLikeView/${user.user_id}/${group_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("User Unliked the Post",r.data)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("User Unlike error")
      })
  }
  function handleLike(discussion_id) {
    axiosInstance.post(`${ipaddress}/NewGroupDiscussionLikeView/${user.user_id}/${group_id}/${discussion_id}/`)
      .then((r) => {
        //  console.log("User liked the Post",r.data)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("User like error")
      })
  }

  // ------------------------------------------------DISLIKES-------------------------------------------------------
  function handledislike1(discussion_id) {
    axiosInstance.delete(`${ipaddress}/NewGroupDiscussionDisLikeView/${user.user_id}/${group_id}/${discussion_id}/`)
      .then((r) => {
        //  console.log("User Unliked the Post",r.data)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("User Unlike error")
      })
  }
  function handledislike(discussion_id) {
    axiosInstance.post(`${ipaddress}/NewGroupDiscussionDisLikeView/${user.user_id}/${group_id}/${discussion_id}/`)
      .then((r) => {
        // console.log("User Disliked the Post",r.data)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("User like error")
      })
  }


  //  ------------------------------------------------Reply Likes---------------------------------------------------------
  function handleReplyLike1(disc_reply_id, discid, index) {
    axiosInstance.delete(`${ipaddress}/NewGroupDiscussionReplyLikeView/${user.user_id}/${discid}/${disc_reply_id}/`)
      .then((r) => {
        //  console.log("Group Unliked the Reply",r.data)
        getreplies(discid, index)
      })
      .catch(() => {
        console.log("Group Reply Unlike error")
      })
  }
  function handleReplyLike(disc_reply_id, discid, index) {
    axiosInstance.post(`${ipaddress}/NewGroupDiscussionReplyLikeView/${user.user_id}/${discid}/${disc_reply_id}/`)
      .then((r) => {
        // console.log("Group liked the Reply",r.data)
        getreplies(discid, index)
      })
      .catch(() => {
        console.log("Group Reply like error")
      })
  }

  // -----------------------------------To dislike the reply under particular post-------------------------------------------
  function handleReplyDisLike(disc_reply_id, discid, index) {
    axiosInstance.post(`${ipaddress}/NewGroupDiscussionReplyDisLikeView/${user.user_id}/${discid}/${disc_reply_id}/`)
      .then((r) => {
        console.log("Group disliked the Reply", r.data)
        getreplies(discid, index)
      })
      .catch(() => {
        console.log("Group Reply dislike error")
      })
  }


  //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------

  function handleReplies_reply_like(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/GroupDiscussionRepliesReplyLike/${user.user_id}/${replies_reply_id}/`)
      .then((r) => {
        //  console.log("User liked the Replies reply",r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch((err) => {
        console.log("User Replies reply like error", err)
      })
  }

  //  -----------------------------Functionality to dislike the reply under particular reply----------------------------------
  function handlereplies_replydislike(replies_reply_id, disc_replyid) {
    axiosInstance.post(`${ipaddress}/GroupDiscussionRepliesReplyDisLike/${user.user_id}/${replies_reply_id}/`)
      .then((r) => {
        //  console.log("University Replies reply disliked",r.data)
        getreplies_for_reply(disc_replyid)
      })
      .catch(() => {
        console.log("University replies reply dislike error")
      })
  }
  // -----------------------------------------------------EDIT POSTS--------------------------------------------------------
  const [editedpost, setEditedpost] = useState("")
  const [discussionId, setdiscussionId] = useState(0)

  const editpostfunctionData = (value) => {
    setEditedpost(value)
  }

  const editPosts = (discid) => {
    // console.log("Discussion id",discid)
    setdiscussionId(discid)
    const foundDiscussion = groupdiscussion.find((x) => discid === x.id);

    if (foundDiscussion) {
      setEditedpost(foundDiscussion.content);
    }
  }

  const sendEditedData = () => {
    const formData = new FormData();
    formData.append('discussion', editedpost);

    axiosInstance.patch(`${ipaddress}/NewGroupDiscussionView/${discussionId}/${user.user_id}/`, formData)
      .then((r) => {
        // console.log("Post Edited Successfully",r.data)
        setCount1(count1 + 1)
        toast.success('Post updated successfully', {
          autoClose: 2000,
        })
        getdiscussion()
        setindex1(-1)
      })
      .catch(() => {
        console.log("Post Editing Error")
      })

  };

  // -------------------------------------------GET REPLIES----------------------------------------------------------------
  const [fetchedreplies, setFetchedreplies] = useState([])
  const getreplies = (discussion_id, index) => {
    console.log(user.user_id)
    axiosInstance.get(`${ipaddress}/NewGroupDiscussionReplyView/${user.user_id}/${discussion_id}/${group_id}/`)
      .then((r) => {
        // console.log("Group Replies fetched successfully",r.data)
        setFetchedreplies(r.data.reverse())
        setCount1(count1 + 1)
      })
  }

  // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
  const [fetchedreplies_for_reply, setFetchedreplies_for_reply] = useState([])
  const [replies_for_reply_status, setreplies_for_reply_status] = useState(false)

  const getreplies_for_reply = (particular_reply_id) => {
    axiosInstance.get(`${ipaddress}/GroupDiscussionRepliesReplyView/${user.user_id}/${particular_reply_id}/`)
      .then((r) => {
        // console.log("Group Replies under reply fetched successfully",r.data)
        setFetchedreplies_for_reply(r.data.reverse())
        // setCount(count+1)
      })
  }

  // ---------------------------------------------------DELETE POST--------------------------------------------------------
  const deletePost = (discussion_id) => {
    axiosInstance.delete(`${ipaddress}/NewGroupDiscussionView/${discussion_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Post Successfully Deleted")
        setCount1(count1 + 1)
        toast.success('Comment deleted successfully', {
          autoClose: 2000,
        })
        setindex1(-1)
        setCount(count + 1)
      })
      .catch(() => {
        console.log("Post Delete Error")
      })
  }

  // ------------------------------------Functionality to delete the reply----------------------------------------------------

  const deleteReply = (disc_reply_id, discid) => {
    axiosInstance.delete(`${ipaddress}/NewGroupDiscussionReplyView/${user.user_id}/${disc_reply_id}/${group_id}/`)
      .then((r) => {
        // console.log("Group Reply Successfully Deleted",r.data)
        setCount(count + 1)
        toast.success('Reply deleted successfully', {
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
    axiosInstance.delete(`${ipaddress}/GroupDiscussionRepliesReplyView/${user.user_id}/${reply_reply_id}/`)
      .then((r) => {
        // console.log("Replies reply deleted successfully",r.data)
        toast.success('Deleted successfully', {
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
    axiosInstance.post(`${ipaddress}/UserPinnedComments/${user.user_id}/${group_id}/${discId}/`)
      .then((r) => {
        // console.log("Pinned Successfully",r.data)
        if (r.data.message === 'already Pinned') {
          const toastLiveExample = document.getElementById('liveToast')
          document.getElementById('toastbody').style.color = "green"
          document.getElementById('toastbody').textContent = "Comment already followed!!!"
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
          toastBootstrap.show()
          setindex1(-1)
          setCount(count + 1)
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

  // ---------------------------------------------------UNPIN COMMENT-------------------------------------------------------
  const unpin = (discid) => {
    axiosInstance.delete(`${ipaddress}/UserPinnedComments/${user.user_id}/${group_id}/${discid}/`)
      .then((r) => {
        // console.log("UnPinned Successfully",r.data)
        getdiscussion()
        toast.success('Comment unfollowed successfully', {
          autoClose: 2000,
        })
        setCount((prev) => prev + 1)
      })
      .catch(() => {
        console.log("Unpinning error")
      })
  }

  // Dropdown states
  const [dropdownstate, setdropdownstate] = useState(false)
  const [reportdropdownstate, setreportdropdownstate] = useState(false)

  // ------------------------------To Report the Group-----------------------------
  const [reportvalue, setReportvalue] = useState("")

  const reportGroup = () => {
    const report = new FormData()
    report.append('reason', reportvalue)
    axiosInstance.post(`${ipaddress}/ReportGroup/${group_id}/${user.user_id}/`, report)
      .then((r) => {
        // console.log("Reported Successfully",r.data)
        if (r.data === "Already Reported") {
          toast.warn('Already reported', {
            autoClose: 2000,
          })
          setreportdropdownstate(false)
        }
        const toastLiveExample = document.getElementById('liveToast')
        toast.warn('Reported successfully', {
          autoClose: 2000,
        })
        setreportdropdownstate(false)
        fetchgroupdetails()
      })
  }

  // -------------------------------Search and Take Documents under particular private group---------------------------------------

  const searchDocuments = (value) => {
    if (value.length > 0) {
      axiosInstance.post(`${ipaddress}/SearchFlashcardsDocumentsUnderPrivateGroup/${user.user_id}/${group_id}/${value}/`)
        .then((r) => {
          // console.log("Search documents under group found",r.data)
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

  // -------------------------------------Search and Take Flashsets----------------------------------------------------------

  const searchFlashsets = (value) => {
    if (value.length > 0) {
      axiosInstance.get(`${ipaddress2}/SearchFlashsetsGroups/${user.user_id}/${group_id}/${value}/`)
        .then((r) => {
          // console.log("Search flashsetsunder group found",r.data)
          setSearchedFlashsets(r.data)
          if (r.data.length > 0) {
            document.getElementById('flashset_original').style.display = 'none'
            document.getElementById('flashset_filterlike').style.display = 'block'
          }
        })
        .catch(() => {
          console.log("Filter error")
        })
    }
    else {
      setSearchedFlashsets([])
      document.getElementById('flashset_original').style.display = 'block'
      document.getElementById('flashset_filterlike').style.display = 'none'
    }
  }

  // ----------------------------------------------Search discussion under particular group-------------------------------------------------------
  const [searchcomment, setSearchcomment] = useState("");

  // ---------------------------------Functionality to exit from the group------------------------------------------------------

  const [exitgroup_reason, setexitgroup_reason] = useState("")
  const leaveGroup = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.post(`${ipaddress}/exitGroup/${user.user_id}/${group_id}/`, {
      'reason': exitgroup_reason
    })
      .then((r) => {
        navigate('/dashboard/page')
      })
  }


  // -----------------------------------Make other members as Admin-----------------------------------------------------------
  const makeAdmin = (user_id, nickname) => {
    axiosInstance.put(`${ipaddress}/makeadmin/${user_id}/${group_id}/`)
      .then((r) => {
        // console.log("Make as admin successfull",r.data)
        fetchgroupdetails()
        setCount(count + 1)
        toast.success(`Successfully make ${nickname} as Admin`, {
          autoClose: 2000,
        })
      })
  }

  // -----------------------------------Remove other members from the group-----------------------------------------------------------
  const kickout = (user_id, nickname) => {
    axiosInstance.delete(`${ipaddress}/kickout/${user_id}/${group_id}/`)
      .then((r) => {
        // console.log("User successfully kicked out",r.data)
        fetchgroupdetails()
        setCount(count + 1)
        toast.success(`${nickname} removed from the group !!!`, {
          autoClose: 2000,
        })
      })
  }

  // ----------------------------------------To report the discussion comment----------------------------------------------
  const [report_status, setreport_status] = useState(false)
  const [report_id, setreport_id] = useState()

  // ----------------------------------------------Functionality to Unsave the document--------------------------------------
  const unsave = (doc_id) => {
    axiosInstance.delete(`${ipaddress}/UserStudyListView/${user.user_id}/${doc_id}/`)
      .then((r) => {
        // console.log("Document successfully unsaved",r.data)
        fetchdocs()
      })
  }

  // ----------------------------------------------Functionality to Unsave the Flashset--------------------------------------
  const unsave_flashset = (flashset_id) => {
    axiosInstance.put(`${ipaddress2}/Unsave_flashcard_studylist/${user.user_id}/${flashset_id}/`)
      .then((r) => {
        // console.log("Flashset successfully unsaved",r.data)
        getallflashsetsundergroup()
      })
      .catch((err) => {
        console.log("Unsave error", err)
      })
  }


  return (
    <div>
      {loading ? (<Preloader />) : (
        <div className=''>
          <div className="d-flex bg-light">
            <Mainsidebar activevalue={"groups"} count={count} />
            <div onClick={() => {
              setcourse_visible(false)
              setgroup_visible(false)
              setstudylist_visible(false)
            }} className='container-fluid px-1 px-lg-5 pt-5 mt-5 bg-light main-division'>
              <Navbar count={count}></Navbar>

              <div onClick={() => {
                setnavbar_dropdown_visible(false)
              }}>
                <div className="w-100 p-4 px-1 px-md-3 px-lg-5 mt-1 d-flex flex-column groupchat-div" onClick={() => {
                  setindex1(-1)
                }} id='subject-div'>

                  <div className='d-flex justify-content-between mb-3'>
                    <Navpath type={"group"} group_id={group_id} />

                    <div className=''>
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 250 }}
                        overlay={renderTooltip("Exit the Group")}
                      >
                        <button className={`p-1 border-0 bg-transparent ${groupdetails.group_member_status ? '' : 'd-none'}`} data-bs-toggle="modal" data-bs-target="#exitgroupmodal"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#fff" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                        </svg></button>
                      </OverlayTrigger>

                      {/* ---------------------------------------------REPORT THE GROUP--------------------------------------------------- */}
                      <div className="d-inline">
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 250 }}
                          overlay={renderTooltip("Report the Group")}
                        >
                          <span className={`ms-4 ps-2 text-white ${groupdetails.group_member_status ? '' : 'd-none'}`} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => {
                            setreportdropdownstate(!reportdropdownstate)
                          }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                              <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                            </svg></span>
                        </OverlayTrigger>

                        <ul className={`${reportdropdownstate ? '' : 'd-none'} rounded me-5 bg-white border-0 py-2 mt-3 px-2 ps-3 report-dropdown`} style={{ width: '180px', listStyleType: 'none', position: 'absolute', right: '120px', top: '150px' }}>
                          <li className={`${groupdetails.group_report_status ? 'd-none' : ''}`}><a data-bs-toggle="modal" data-bs-target="#reportgroupmodal" className="dropdown-item d-flex align-items-center" style={{ cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                          </svg> <span className='ms-2'>Report Irrelevant</span></a></li>
                          <li className={`${groupdetails.group_report_status ? 'd-none' : 'mt-2'}`}><a data-bs-toggle="modal" data-bs-target="#reportgroupmodal" className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
                          </svg> <span className='ms-2'>Report Invalid</span></a></li>

                          <li className={`${groupdetails.group_report_status ? '' : 'd-none'}`} style={{ color: '#FF845D' }}><a className="dropdown-item d-flex align-items-center" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bug" viewBox="0 0 16 16">
                            <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z" />
                          </svg> <span className='ms-2'>Already Reported</span></a></li>

                        </ul>
                      </div>


                      <span className={`ms-4 ps-2 text-white ${grouptype === "privategroup" ? '' : 'd-none'}`} data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="Group Info" style={{ cursor: 'pointer' }}>
                        <span data-bs-toggle="modal" data-bs-target="#groupdescriptionmodal">
                          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-arrows-fullscreen" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707" />
                          </svg>
                        </span>
                      </span>
                    </div>

                  </div>


                  <h5 onClick={() => {
                    setreportdropdownstate(false)
                  }} className='fw-bold text-white d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-unlock-fill ${grouptype === "opengroup" ? '' : 'd-none'}`} viewBox="0 0 16 16">
                      <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-lock-fill ${grouptype === "opengroup" ? 'd-none' : ''}`} viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                    </svg>
                    <span className='ms-2'>{groupdetails.group_name}</span> <img src={groupdetails.data && groupdetails.data.group_image != undefined && groupdetails.data.group_image} className='ms-3 rounded' style={{ width: '80px', height: '50px' }} alt="" /></h5>
                  <p onClick={() => {
                    setreportdropdownstate(false)
                  }} className='m-0 d-flex align-items-center my-2'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M6.77074 17.7079V9.37461H7.81241V17.7079H6.77074ZM11.9791 17.7079V9.37461H13.0207V17.7079H11.9791ZM3.68579 20.8329V19.7913H21.314V20.8329H3.68579ZM17.1874 17.7079V9.37461H18.2291V17.7079H17.1874ZM3.68579 7.29128V6.40987L12.4999 2.20312L21.314 6.40987V7.29128H3.68579ZM6.43821 6.24961H18.5616L12.4999 3.38503L6.43821 6.24961Z" fill="white" />
                    </svg> <span className='ms-1' style={{ fontSize: '14px', lineHeight: 'normal', letterSpacing: '0.28px', fontWeight: 500, color: '#fff' }}>{user.university_name}</span></p>
                  {/* </div> */}
                  <div onClick={() => {
                    setreportdropdownstate(false)
                  }} className='d-flex gap-4 text-secondary mt-1'>
                    {groupdetails.data && (
                      <span className='text-white d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M2.70435 19.3915V17.6767C2.70435 17.1933 2.82955 16.7776 3.07994 16.4297C3.33034 16.0818 3.66685 15.8038 4.08945 15.5956C4.99297 15.1654 5.89011 14.8225 6.78086 14.5667C7.67162 14.311 8.74334 14.1831 9.99601 14.1831C11.2487 14.1831 12.3204 14.311 13.2112 14.5667C14.1019 14.8225 14.9991 15.1654 15.9026 15.5956C16.3252 15.8038 16.6617 16.0818 16.9121 16.4297C17.1625 16.7776 17.2877 17.1933 17.2877 17.6767V19.3915H2.70435ZM19.371 19.3915V17.6286C19.371 17.025 19.2488 16.4552 19.0045 15.9192C18.7601 15.3833 18.4136 14.9234 17.9648 14.5397C18.4763 14.6438 18.969 14.7884 19.4431 14.9734C19.9172 15.1583 20.386 15.3663 20.8494 15.5974C21.3008 15.8244 21.6547 16.1149 21.9111 16.469C22.1675 16.823 22.2957 17.2096 22.2957 17.6286V19.3915H19.371ZM9.99601 11.8594C9.13664 11.8594 8.40096 11.5534 7.78898 10.9414C7.177 10.3295 6.87101 9.59378 6.87101 8.7344C6.87101 7.87501 7.177 7.13932 7.78898 6.52734C8.40096 5.91536 9.13664 5.60938 9.99601 5.60938C10.8554 5.60938 11.5911 5.91536 12.203 6.52734C12.815 7.13932 13.121 7.87501 13.121 8.7344C13.121 9.59378 12.815 10.3295 12.203 10.9414C11.5911 11.5534 10.8554 11.8594 9.99601 11.8594ZM17.5681 8.7344C17.5681 9.59378 17.2622 10.3295 16.6502 10.9414C16.0382 11.5534 15.3025 11.8594 14.4431 11.8594C14.3991 11.8594 14.343 11.8544 14.2749 11.8444C14.2068 11.8344 14.1507 11.8233 14.1066 11.8113C14.4594 11.3791 14.7306 10.8997 14.9201 10.3729C15.1096 9.84618 15.2043 9.29918 15.2043 8.7319C15.2043 8.16464 15.1052 7.62261 14.9069 7.10578C14.7086 6.58896 14.4418 6.10618 14.1066 5.65745C14.1627 5.63743 14.2188 5.62441 14.2749 5.61839C14.331 5.61238 14.3871 5.60938 14.4431 5.60938C15.3025 5.60938 16.0382 5.91536 16.6502 6.52734C17.2622 7.13932 17.5681 7.87501 17.5681 8.7344ZM3.74601 18.3498H16.246V17.6767C16.246 17.4323 16.1849 17.2186 16.0627 17.0357C15.9405 16.8527 15.7212 16.6778 15.4047 16.5108C14.6274 16.0955 13.8081 15.7773 12.9467 15.5563C12.0854 15.3353 11.1018 15.2248 9.99601 15.2248C8.89025 15.2248 7.90667 15.3353 7.04528 15.5563C6.18391 15.7773 5.36461 16.0955 4.58737 16.5108C4.27086 16.6778 4.0515 16.8527 3.92929 17.0357C3.80711 17.2186 3.74601 17.4323 3.74601 17.6767V18.3498ZM9.99601 10.8177C10.5689 10.8177 11.0594 10.6137 11.4674 10.2058C11.8754 9.79777 12.0793 9.30732 12.0793 8.7344C12.0793 8.16149 11.8754 7.67103 11.4674 7.26305C11.0594 6.85506 10.5689 6.65107 9.99601 6.65107C9.4231 6.65107 8.93264 6.85506 8.52466 7.26305C8.11667 7.67103 7.91268 8.16149 7.91268 8.7344C7.91268 9.30732 8.11667 9.79777 8.52466 10.2058C8.93264 10.6137 9.4231 10.8177 9.99601 10.8177Z" fill="white" />
                      </svg> <span className='ms-1 text-white' style={{ fontSize: '14px' }}>{groupdetails.data.member_count} <span className='d-none d-md-inline'>Members</span></span></span>
                    )}
                    <span className={`text-white ${grouptype === "opengroup" ? 'd-none' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M8.85409 18.2292H16.1458V17.1875H8.85409V18.2292ZM8.85409 14.0625H16.1458V13.0208H8.85409V14.0625ZM6.89093 21.875C6.41151 21.875 6.0112 21.7144 5.69002 21.3932C5.36884 21.072 5.20825 20.6717 5.20825 20.1923V4.80768C5.20825 4.32825 5.36884 3.92795 5.69002 3.60677C6.0112 3.28559 6.41151 3.125 6.89093 3.125H15.1041L19.7916 7.8125V20.1923C19.7916 20.6717 19.631 21.072 19.3098 21.3932C18.9886 21.7144 18.5883 21.875 18.1089 21.875H6.89093ZM14.5833 8.33333V4.16667H6.89093C6.73069 4.16667 6.58379 4.23344 6.45023 4.36698C6.31669 4.50054 6.24992 4.64744 6.24992 4.80768V20.1923C6.24992 20.3526 6.31669 20.4995 6.45023 20.633C6.58379 20.7666 6.73069 20.8333 6.89093 20.8333H18.1089C18.2691 20.8333 18.416 20.7666 18.5496 20.633C18.6831 20.4995 18.7499 20.3526 18.7499 20.1923V8.33333H14.5833Z" fill="white" />
                    </svg> <span className='ms-1 text-white' style={{ fontSize: '14px' }}>{groupdetails.documents_count} <span className='d-none d-md-inline'>Documents</span></span></span>
                    <span className='text-white'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg> <span className='ms-1 text-white' style={{ fontSize: '14px' }}>{groupdetails.city}</span></span>
                    <span className={`text-white ${grouptype === "opengroup" ? 'd-none' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M8.3333 20.1928V10.0105C8.3333 9.54438 8.49823 9.14842 8.82809 8.82256C9.15795 8.49671 9.55592 8.33379 10.022 8.33379H20.1923C20.6584 8.33379 21.0553 8.49771 21.3832 8.82556C21.711 9.15342 21.875 9.55039 21.875 10.0165V17.2681L17.2676 21.8755H10.016C9.54991 21.8755 9.15294 21.7115 8.82507 21.3837C8.49722 21.0558 8.3333 20.6588 8.3333 20.1928ZM3.15101 6.87145C3.06019 6.40537 3.14966 5.9857 3.41942 5.61243C3.6892 5.23917 4.05712 5.00713 4.5232 4.91631L14.5432 3.1515C15.0093 3.06068 15.429 3.15015 15.8023 3.41991C16.1755 3.68968 16.4076 4.05761 16.4984 4.52369L16.7187 5.8498H15.665L15.4427 4.60783C15.416 4.46092 15.3358 4.34407 15.2023 4.25728C15.0687 4.17047 14.9218 4.14042 14.7616 4.16712L4.70749 5.95199C4.52053 5.97869 4.38031 6.06549 4.28682 6.21238C4.19334 6.35929 4.15996 6.52623 4.18666 6.71319L5.84932 16.1042V18.1214C5.61161 18.0053 5.40962 17.8403 5.24335 17.6267C5.07709 17.413 4.96791 17.1679 4.91583 16.8915L3.15101 6.87145ZM9.37497 10.0165V20.1928C9.37497 20.3797 9.43506 20.5333 9.55525 20.6535C9.67545 20.7737 9.82902 20.8338 10.016 20.8338H16.6666V16.6671H20.8333V10.0165C20.8333 9.82951 20.7732 9.67593 20.653 9.55574C20.5328 9.43555 20.3792 9.37546 20.1923 9.37546H10.016C9.82902 9.37546 9.67545 9.43555 9.55525 9.55574C9.43506 9.67593 9.37497 9.82951 9.37497 10.0165Z" fill="white" />
                    </svg> <span className='ms-1 text-white' style={{ fontSize: '14px' }}>{groupdetails.flashset_count} <span className='d-none d-md-inline'>Flashsets</span></span></span>
                  </div>
                  <div className='mt-4 d-flex gap-3' onClick={() => {
                    setreportdropdownstate(false)
                  }}>
                    <Link to={`/groups/${grouptype}`} className='btn border px-3 py-2 fw-medium text-decoration-none d-flex align-items-center' style={{ height: '44px', backgroundColor: '#fff', color: '#5D5FE3', fontSize: '14px' }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M11.5 16.5H12.5V12.5H16.5V11.5H12.5V7.5H11.5V11.5H7.5V12.5H11.5V16.5ZM5.61538 20C5.15513 20 4.77083 19.8458 4.4625 19.5375C4.15417 19.2292 4 18.8449 4 18.3846V5.61537C4 5.15512 4.15417 4.77083 4.4625 4.4625C4.77083 4.15417 5.15513 4 5.61538 4H18.3846C18.8449 4 19.2292 4.15417 19.5375 4.4625C19.8458 4.77083 20 5.15512 20 5.61537V18.3846C20 18.8449 19.8458 19.2292 19.5375 19.5375C19.2292 19.8458 18.8449 20 18.3846 20H5.61538ZM5.61538 19H18.3846C18.5385 19 18.6795 18.9359 18.8077 18.8077C18.9359 18.6795 19 18.5385 19 18.3846V5.61537C19 5.46154 18.9359 5.32052 18.8077 5.1923C18.6795 5.0641 18.5385 5 18.3846 5H5.61538C5.46154 5 5.32052 5.0641 5.1923 5.1923C5.0641 5.32052 5 5.46154 5 5.61537V18.3846C5 18.5385 5.0641 18.6795 5.1923 18.8077C5.32052 18.9359 5.46154 19 5.61538 19Z" fill="#5D5FE3" />
                    </svg> <span className='ms-2'>{groupdetails.group_member_status ? 'Joined Groups' : 'Join Group'}</span></Link>
                    <button onClick={() => {
                      navigate(`/group_upload_page/${group_id}`)
                    }} className={`btn px-4 py-2 text-decoration-none fw-medium d-flex align-items-center ${grouptype === "opengroup" ? 'd-none' : ''}`} style={{ height: '44px', color: '#fff', fontSize: '14px', border: '1px solid #fff' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M6.77075 19.7913C5.47134 19.7913 4.36524 19.3395 3.45244 18.4357C2.53965 17.5319 2.08325 16.4273 2.08325 15.1219C2.08325 13.8879 2.50793 12.8182 3.35729 11.9127C4.20665 11.0073 5.20424 10.5205 6.35007 10.4524C6.58379 8.9353 7.28158 7.68197 8.44343 6.69238C9.60529 5.7028 10.9575 5.20801 12.4999 5.20801C14.241 5.20801 15.7179 5.81441 16.9307 7.0272C18.1435 8.24 18.7499 9.71693 18.7499 11.458V12.4997H19.3909C20.3885 12.5317 21.2256 12.898 21.902 13.5984C22.5784 14.2989 22.9166 15.1479 22.9166 16.1455C22.9166 17.1671 22.571 18.0302 21.8799 18.7346C21.1888 19.4391 20.3325 19.7913 19.3108 19.7913H13.6618C13.1823 19.7913 12.782 19.6308 12.4609 19.3096C12.1397 18.9884 11.9791 18.5881 11.9791 18.1087V12.063L9.79159 14.2385L9.0544 13.5213L12.4999 10.0758L15.9454 13.5213L15.2083 14.2385L13.0208 12.063V18.1087C13.0208 18.2689 13.0875 18.4158 13.2211 18.5494C13.3546 18.6829 13.5015 18.7497 13.6618 18.7497H19.2708C19.9999 18.7497 20.6162 18.4979 21.1197 17.9945C21.6232 17.491 21.8749 16.8747 21.8749 16.1455C21.8749 15.4163 21.6232 14.8 21.1197 14.2965C20.6162 13.7931 19.9999 13.5413 19.2708 13.5413H17.7083V11.458C17.7083 10.017 17.2004 8.78874 16.1848 7.77311C15.1692 6.75749 13.9409 6.24967 12.4999 6.24967C11.0589 6.24967 9.83065 6.75749 8.81502 7.77311C7.7994 8.78874 7.29159 10.017 7.29159 11.458H6.7307C5.76381 11.458 4.92113 11.8139 4.20265 12.5257C3.48416 13.2375 3.12492 14.0969 3.12492 15.1038C3.12492 16.1108 3.48082 16.9702 4.19263 17.682C4.90443 18.3938 5.76381 18.7497 6.77075 18.7497H9.37492V19.7913H6.77075Z" fill="white" />
                      </svg> <span className='ms-2'>{translate_value.common_words.upload}</span></button>

                  </div>
                </div>

                {/* ----------------------------------------------------PRIVATE DISCUSSION AND DOCUMENT LAYOUT--------------------------------- */}
                <div className={`m-0 mt-3 mb-5 row justify-content-center`}>
                  <div className="col-lg-9 p-0">
                    <div className='bg-white p-3 rounded shadow-sm d-md-flex align-items-center' onClick={() => {
                      setindex1(-1)
                      setreportdropdownstate(false)
                    }}>
                      <ul className="nav nav-underline gap-1 w-md-50" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active bg-white fw-normal p-2" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" style={{ color: tablist === "discussion" ? '#5D5FE3' : '#8E9696', fontSize: '16px', letterSpacing: '0.36px', lineHeight: 'normal' }} onClick={() => {
                            setTablist("discussion")
                          }}>Discussion ({groupdiscussion.length})</button>
                        </li>
                        <li className={`nav-item ${grouptype === "opengroup" ? 'd-none' : ''}`} role="presentation">
                          {groupdocuments && (
                            <button className="nav-link p-2 bg-white fw-normal" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" style={{ color: tablist === "documents" ? '#5D5FE3' : '#8E9696', fontSize: '16px', letterSpacing: '0.36px', lineHeight: 'normal' }} onClick={() => {
                              setTablist("documents")
                              fetchdocs()
                            }}>Documents ({groupdetails.documents_count})</button>
                          )}
                        </li>
                        <li className={`nav-item ${grouptype === "opengroup" ? 'd-none' : ''}`} role="presentation">
                          <button className="nav-link p-2 bg-white fw-normal" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false" style={{ color: tablist === "flashcards" ? '#5D5FE3' : '#8E9696', fontSize: '16px', letterSpacing: '0.36px', lineHeight: 'normal' }}
                            onClick={() => {
                              setTablist("flashcards")
                              getallflashsetsundergroup()
                            }}>Flashsets ({groupdetails.flashset_count})</button>
                        </li>
                      </ul>
                      <div className={`w-50 ps-0 ps-md-3 mt-3 mt-md-0 ${grouptype === "privategroup" ? '' : 'd-none'}`}>
                        {/* ------------------------Document search bar */}
                        <div className={`input-group bg-light rounded border ${tablist === "documents" ? '' : 'd-none'}`}>
                          <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                          </svg></span>
                          <input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.group_search} onChange={(e) => {
                            searchDocuments(e.target.value)
                          }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                        </div>

                        {/* --------------------------Flashset search bar */}
                        <div className={`input-group bg-light rounded border ${tablist === "flashcards" ? '' : 'd-none'}`}>
                          <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                          </svg></span>
                          <input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.group_flashset} onChange={(e) => {
                            searchFlashsets(e.target.value)
                          }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                        </div>
                      </div>

                    </div>
                    <div className="tab-content" id="myTabContent">

                      {/* ------------------------------------------Group Discussion Section--------------------------------------------------*/}
                      <div className="tab-pane fade show active bg-white py-1 px-0 px-md-3 mt-3" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                        <div className='w-100 mt-3'>
                          <div onClick={() => {
                            setindex1(-1)
                          }} className='d-md-flex ms-4 ms-md-0 justify-content-between mb-3'>
                            <div className='d-flex'>
                              <span className='d-flex align-items-center'>
                                <button className="btn btn-sm d-flex align-items-center px-3 border-end-0 fs-6 px-5 px-md-3" style={{ borderRadius: '5px 0px 0px 5px', border: '1px solid #5D5FE7', color: usercomments_status == false && pincomment_status == false ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomments_status == false && pincomment_status == false ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setpincomment_status(false)
                                  setusercomments_status(false)
                                  setoriginal_status(true)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                  </svg><span className='d-none d-md-inline'>Comments</span></button>
                              </span>
                              <span className='d-flex align-items-center'>
                                <button className="btn btn-sm d-flex align-items-center px-3 border-end-0 fs-6 px-5 px-md-3" style={{ borderRadius: '0px 0px 0px 0px', border: '1px solid #5D5FE7', color: '#5D5FE7', height: '36px', color: usercomments_status == false && pincomment_status == true ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomments_status == false && pincomment_status == true ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setpincomment_status(!pincomment_status)
                                  setusercomments_status(false)
                                  setoriginal_status(false)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                  </svg><span className='d-none d-md-inline'>Followed</span></button>
                              </span>

                              <span className='d-flex align-items-center'>
                                <button className='btn btn-sm d-flex align-items-center justify-content-center px-3 fs-6 px-5 px-md-3' style={{ borderRadius: '0px 5px 5px 0px', border: '1px solid #5D5FE7', color: '#5D5FE7', height: '36px', color: '#5D5FE7', height: '36px', color: usercomments_status == true && pincomment_status == false ? '#fff' : '#5D5FE7', height: '36px', backgroundColor: usercomments_status == true && pincomment_status == false ? '#5d5fe3' : '#fff' }} onClick={() => {
                                  setusercomments_status((prev) => !prev)
                                  setpincomment_status(false)
                                  setoriginal_status(false)
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill d-inline d-md-none" viewBox="0 0 16 16">
                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                                  </svg><span className='d-none d-md-inline'>Your Comments</span></button>
                              </span>
                            </div>
                            <div className='mt-3 mt-md-0 px-1 px-md-0'>
                              <div className="input-group bg-light rounded border">
                                <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg></span>
                                <input type="text" value={searchcomment} className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search_discussion}
                                  onChange={(e) => {
                                    setSearchcomment(e.target.value)
                                  }} aria-label="Username" aria-describedby="basic-addon1" style={{ fontSize: '14px' }} />
                              </div>
                            </div>
                          </div>

                          {/* ----------------------------------------Create a Post Modal------------------------------------------------------- */}

                          <div className="modal fade" id="postmodalform" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                            <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
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
                                            <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removemain_image(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
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

                        {/* ------------------------------Search and take discussion under particular group------------------------------------ */}

                        <Group_search_comments searchvalue={searchcomment} setCount={setCount} group_id={group_id} />

                        {/* -----------------------------------------Pinned comments section layout-------------------------------------------- */}
                        <Group_discussion_pincomments pincomments_status={pincomment_status} setCount={setCount} group_id={group_id} />

                        {/* -----------------------------------------User comments section layout---------------------------------------------- */}
                        <Group_discussion_modals usercomments_status={usercomments_status} setCount={setCount} group_id={group_id} />


                        {/* --------------------------------------------Discussion under particular Group-------------------------------------- */}

                        <div className={`${searchcomment.length > 0 ? 'd-none' : ''}`}>
                          <h6 className={`text-center py-3 ${groupdiscussion.length > 0 ? 'd-none' : 'py-3'}`} style={{ color: '#5d5fe3', fontSize: '14px' }}>Post your comments ...💬</h6>
                          <div className={`${original_status ? '' : 'd-none'}`}>
                            {groupdiscussion.map((x, index) => {
                              return (
                                <div className='' key={index}>
                                  <div className='col-12 px-3 pe-4 pt-2 pb-3 rounded shadow-sm border mb-3 bg-white'>
                                    <div className="row border-bottom py-3 m-0 align-items-center">
                                      <div className="col-1 px-1 px-lg-0 d-flex justify-content-center" onClick={() => {
                                        setindex1(-1)
                                        setreportdropdownstate(false)
                                      }}>
                                        <img src={x.sender.profile_pic} className={x.sender.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                        {x.sender.nickname && (<p className={x.sender.profile_pic == null ? 'd-flex align-items-center justify-content-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{x.sender.nickname.slice(0, 1)}</span><span>{x.sender.nickname.slice(-1)}</span></p>)}

                                      </div>
                                      <div className={`p-0 ${x.pinned_status ? 'col-8' : 'col-9'}`} onClick={() => {
                                        setindex1(-1)
                                        setreportdropdownstate(false)
                                      }}>
                                        <Link to={`/profile/${x.sender.user_id}`} className='ms-3 ms-sm-0 my-0 fw-medium text-decoration-none text-dark' style={{ fontSize: '14px' }}>{x.sender.nickname}
                                          <span className='fw-normal ms-2 text-secondary' style={{ fontSize: '13px' }}>{x.created_at}</span>
                                        </Link>
                                        <p className='ms-3 ms-sm-0 my-0 d-flex align-items-center' style={{ fontSize: '12px', color: '#8587EA', cursor: 'pointer' }} onClick={() => {
                                          navigate(`/profile/${x.sender.user_id}`)
                                        }}>Click to view more <span className={`ms-2 edit ${x.edited ? '' : 'd-none'}`}>Edited</span></p>
                                      </div>
                                      <div className={`col-2 ${x.pinned_status ? 'col-3 justify-content-between' : 'col-2 justify-content-end'} d-flex align-items-center p-0 ${groupdetails.group_member_status ? '' : 'd-none'}`} style={{ position: 'relative' }}>
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 250 }}
                                          overlay={renderTooltip("Unfollow")}
                                        >
                                          <button data-bs-toggle="tooltip" data-bs-placement="top"
                                            data-bs-custom-class="custom-tooltip"
                                            data-bs-title="Unfollow" onClick={() => {
                                              unpin(x.id)
                                            }} className={`p-1 btn btn-sm border px-2 ${x.pinned_status ? '' : 'd-none'}`} style={{ cursor: 'pointer' }}><i className="fa-solid fa-link-slash d-md-none d-inline"></i><span className='d-none d-md-inline'>Followed</span></button>
                                        </OverlayTrigger>

                                        <div className="btn-group dropstart">
                                          <span className={`border-0 ${groupdetails.group_member_status ? '' : 'd-none'}`} type="button" style={{ cursor: 'pointer' }} onClick={() => {
                                            if (index1 == index)
                                              setindex1(-1)
                                            else
                                              setindex1(index)
                                          }}>
                                            <img src={require('../img/more.png')} width={30} height={30} alt="" />
                                          </span>
                                          <ul className={`bg-white shadow-sm border rounded mt-0 p-0 px-3 ${index1 == index ? '' : 'd-none'}`} style={{ width: '160px', position: 'absolute', left: '-160px' }}>
                                            <button className={x.sender.user_id != user.user_id || x.created_at.includes("day") || x.created_at.includes("week") || x.created_at.includes("year") ? 'd-none' : 'd-flex align-items-center bg-transparent border-0 my-2'} data-bs-toggle="modal" data-bs-target="#originaleditModal" onClick={() => {
                                              editPosts(x.id)
                                            }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                                              <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black" />
                                            </svg></span><span className="ms-2">{translate_value.common_words.edit}</span></button>
                                            <button className={`bg-transparent border-0 my-2 ${x.pinned_status ? 'd-none' : 'd-flex align-items-center'}`} onClick={() => {
                                              pincomment(x.id)
                                            }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin" viewBox="0 0 16 16">
                                              <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282" />
                                            </svg></span> <span className="ms-2">Follow</span></button>

                                            {/* ----------------------------------------------------Report button--------------------------------------------------- */}
                                            <button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-none' : 'd-flex align-items-center'}`}
                                              onClick={() => {
                                                setreport_id(x.id)
                                                setreport_status(true)
                                              }} style={{ height: '20px' }}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                                <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#2A3941" />
                                              </svg></span> <span className="ms-2">Report</span></button>

                                            <button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-flex align-items-center' : 'd-none'}`} style={{ height: '20px', color: '#FF845D' }}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                                              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D" />
                                            </svg> <span className="ms-2">Reported</span></button>


                                            <button className={`bg-transparent border-0 my-2 ${user.user_id === x.sender.user_id ? ' d-flex align-items-center' : 'd-none'}`} onClick={() => {
                                              deletePost(x.id)
                                            }} style={{ height: '20px' }}><span className='dropdownmenu'> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                                              <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black" />
                                            </svg></span><span className="ms-2">{translate_value.common_words.delete}</span></button>
                                          </ul>
                                        </div>

                                        {/* ---------------------------------------Edit post section (Edit the Post for 24 hours)--------------------------------------------- */}

                                        <div className="modal fade" id="originaleditModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                      }} className='bg-transparent border-0'> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
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
                                    <div className='py-2 ms-1 pt-3' onClick={() => {
                                      setindex1(-1)
                                      setreportdropdownstate(false)
                                    }}>
                                      <p className='m-0' id={x.id}>{x.content}</p>
                                      {x.images_attached && (
                                        x.images_attached.map((z) => {
                                          return (
                                            <div>
                                              <img src={z.images} width={200} alt="" className='mt-3' />
                                            </div>
                                          )
                                        })
                                      )}

                                    </div>
                                    <div className='d-flex justify-content-between border-bottom pt-3 pb-4' onClick={() => {
                                      setindex1(-1)
                                    }}>
                                      <div className="d-flex align-items-center">
                                        <button className={`bg-transparent border-0 ${groupdetails.group_member_status ? 'd-flex align-items-center' : 'd-none'}`} style={{ height: '20px', color: x.status ? "#ff845d" : "gray" }} onClick={() => {
                                          if (x.status == true) {
                                            handleLike1(x.id)
                                          }
                                          else {
                                            handleLike(x.id)
                                          }
                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                            <path d="M18.8269 22.0002H6.27884V8.25017L14.1154 0.509766L14.6683 1.06267C14.7821 1.17644 14.8778 1.32228 14.9555 1.50017C15.0333 1.67805 15.0721 1.84151 15.0721 1.99055V2.18767L13.7933 8.25017H22.4808C23.0032 8.25017 23.4704 8.4561 23.8822 8.86795C24.2941 9.27981 24.5 9.74695 24.5 10.2694V11.8079C24.5 11.9217 24.4872 12.0459 24.4615 12.1805C24.4359 12.3151 24.4023 12.4393 24.3606 12.553L20.9471 20.6444C20.7756 21.029 20.4872 21.3511 20.0818 21.6108C19.6763 21.8704 19.258 22.0002 18.8269 22.0002ZM7.52884 20.7502H18.8269C19.0032 20.7502 19.1835 20.7021 19.3678 20.606C19.5521 20.5098 19.6923 20.3495 19.7885 20.1252L23.25 12.0002V10.2694C23.25 10.045 23.1779 9.86074 23.0337 9.71652C22.8894 9.57229 22.7051 9.50017 22.4808 9.50017H12.2404L13.6875 2.67324L7.52884 8.78383V20.7502ZM6.27884 8.25017V9.50017H2V20.7502H6.27884V22.0002H0.75V8.25017H6.27884Z" fill="currentColor" />
                                          </svg> <span className='ms-1'>{x.likes_count}</span></button>

                                        <button className={`bg-transparent border-0 ${groupdetails.group_member_status ? 'd-none' : ''}`} style={{ height: '20px', color: x.status ? "#ff845d" : "gray" }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                          <path d="M18.8269 22.0002H6.27884V8.25017L14.1154 0.509766L14.6683 1.06267C14.7821 1.17644 14.8778 1.32228 14.9555 1.50017C15.0333 1.67805 15.0721 1.84151 15.0721 1.99055V2.18767L13.7933 8.25017H22.4808C23.0032 8.25017 23.4704 8.4561 23.8822 8.86795C24.2941 9.27981 24.5 9.74695 24.5 10.2694V11.8079C24.5 11.9217 24.4872 12.0459 24.4615 12.1805C24.4359 12.3151 24.4023 12.4393 24.3606 12.553L20.9471 20.6444C20.7756 21.029 20.4872 21.3511 20.0818 21.6108C19.6763 21.8704 19.258 22.0002 18.8269 22.0002ZM7.52884 20.7502H18.8269C19.0032 20.7502 19.1835 20.7021 19.3678 20.606C19.5521 20.5098 19.6923 20.3495 19.7885 20.1252L23.25 12.0002V10.2694C23.25 10.045 23.1779 9.86074 23.0337 9.71652C22.8894 9.57229 22.7051 9.50017 22.4808 9.50017H12.2404L13.6875 2.67324L7.52884 8.78383V20.7502ZM6.27884 8.25017V9.50017H2V20.7502H6.27884V22.0002H0.75V8.25017H6.27884Z" fill="currentColor" />
                                        </svg>{x.likes_count}</button>

                                        <button className={`bg-transparent border-0 ms-4 ${groupdetails.group_member_status ? '' : 'd-none'}`} style={{ height: '20px', color: x.dislike_status ? "#ff845d" : "gray" }} onClick={() => {
                                          if (x.dislike_status == true) {
                                            handledislike1(x.id)
                                          }
                                          else {
                                            handledislike(x.id)
                                          }
                                        }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                            <path d="M6.17306 -0.000173569H18.7212V13.7498L10.8846 21.4902L10.3317 20.9373C10.2179 20.8236 10.1222 20.6777 10.0445 20.4998C9.96674 20.322 9.92788 20.1585 9.92788 20.0095V19.8123L11.2067 13.7498H2.51922C1.99678 13.7498 1.52963 13.5439 1.11778 13.132C0.705927 12.7202 0.5 12.253 0.5 11.7306V10.1921C0.5 10.0783 0.512823 9.95415 0.538469 9.81955C0.564095 9.68492 0.59774 9.56072 0.639406 9.44695L4.05288 1.35558C4.22435 0.970972 4.51281 0.648857 4.91825 0.389233C5.32371 0.129627 5.74198 -0.000173569 6.17306 -0.000173569ZM17.4712 1.24983H6.17306C5.99679 1.24983 5.81651 1.2979 5.63222 1.39404C5.44793 1.49021 5.3077 1.65047 5.21153 1.87483L1.75 9.99983V11.7306C1.75 11.955 1.82211 12.1393 1.96634 12.2835C2.11057 12.4277 2.29486 12.4998 2.51922 12.4998H12.7596L11.3125 19.3268L17.4712 13.2162V1.24983ZM18.7212 13.7498V12.4998H23V1.24983H18.7212V-0.000173569H24.25V13.7498H18.7212Z" fill="currentColor" />
                                          </svg></button>
                                      </div>
                                      {x.replies > 0
                                        && (
                                          <div className="w-75 d-flex justify-content-end">
                                            <div className="d-flex w-md-50">
                                              <button className='ms-4 bg-transparent border-0 fw-bold' style={{ color: '#5D5FE3', fontSize: '14px' }} onClick={(e) => {
                                                setreplies_layout(!replies_layout)
                                                getreplies(x.id, index)
                                              }}>{translate_value.dashboard.view_all} {x.replies} {translate_value.dashboard.replies}</button>

                                              <div className="ms-2 comment-section-img" style={{ position: 'relative' }}>
                                                {x.replied_users_images.slice(0, 5).map((a, index) => {
                                                  return (
                                                    <>
                                                      <img src="http://localhost:3000/static/media/man.ba3e9327f074cac4e49e.png" width={24} style={{ left: `${index * 20}px`, position: "absolute", top: '-2px' }} alt="" />
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

                                    {fetchedreplies && fetchedreplies.length > 0 && (
                                      <div className={fetchedreplies[0].group_messages == x.id && replies_layout ? 'd-block' : 'd-none'}>
                                        {fetchedreplies.map((y) => {

                                          return (
                                            <div className='ps-3 py-2 mt-3 bg-white' onClick={() => {
                                              setindex1(-1)
                                            }}>
                                              <div className="row w-100 align-items-center">
                                                <div className="col-2 col-md-1 d-flex justify-content-end">
                                                  <img src={y.user_id.profile_pic} className={y.user_id.profile_pic == null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
                                                  <p className={y.user_id.profile_pic == null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'}
                                                    style={{ fontSize: '14px', height: '35px', width: '35px' }}><span>{y.user_id.nickname.slice(0, 1)}</span><span>{y.user_id.nickname.slice(-1)}</span></p>
                                                </div>
                                                <div className="col-7 col-lg-9 ps-0 p-0">
                                                  <h6 className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.user_id.nickname}</h6>
                                                  <p className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                                </div>
                                                <div className="col-3 col-lg-2 p-0 d-flex justify-content-between align-items-center">
                                                  <button className={`bg-transparent border-0 ${groupdetails.group_member_status ? 'd-flex align-items-center' : 'd-none'}`} style={{ height: '20px', color: y.like_status ? "#ff845d" : "gray" }} onClick={() => {
                                                    if (y.like_status == true) {
                                                      handleReplyLike1(y.id, x.id, index)
                                                    }
                                                    else {
                                                      handleReplyLike(y.id, x.id, index)
                                                    }
                                                  }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                                      <path d="M18.8269 22.0002H6.27884V8.25017L14.1154 0.509766L14.6683 1.06267C14.7821 1.17644 14.8778 1.32228 14.9555 1.50017C15.0333 1.67805 15.0721 1.84151 15.0721 1.99055V2.18767L13.7933 8.25017H22.4808C23.0032 8.25017 23.4704 8.4561 23.8822 8.86795C24.2941 9.27981 24.5 9.74695 24.5 10.2694V11.8079C24.5 11.9217 24.4872 12.0459 24.4615 12.1805C24.4359 12.3151 24.4023 12.4393 24.3606 12.553L20.9471 20.6444C20.7756 21.029 20.4872 21.3511 20.0818 21.6108C19.6763 21.8704 19.258 22.0002 18.8269 22.0002ZM7.52884 20.7502H18.8269C19.0032 20.7502 19.1835 20.7021 19.3678 20.606C19.5521 20.5098 19.6923 20.3495 19.7885 20.1252L23.25 12.0002V10.2694C23.25 10.045 23.1779 9.86074 23.0337 9.71652C22.8894 9.57229 22.7051 9.50017 22.4808 9.50017H12.2404L13.6875 2.67324L7.52884 8.78383V20.7502ZM6.27884 8.25017V9.50017H2V20.7502H6.27884V22.0002H0.75V8.25017H6.27884Z" fill="currentColor" />
                                                    </svg> <span className='ms-1'>{y.likes_count}</span></button>
                                                  <button className={`bg-transparent border-0 ${groupdetails.group_member_status ? 'd-none' : ''}`} style={{ height: '20px', color: y.like_status ? "#ff845d" : "gray" }}><i className={`${y.like_status ? 'fa-solid fa-thumbs-up me-1 fs-5' : 'fa-regular fa-thumbs-up me-1 fs-5'}`}></i>{y.likes_count}</button>

                                                  <button className={`bg-transparent border-0 ${groupdetails.group_member_status ? '' : 'd-none'}`} style={{ height: '20px', color: y.dis_like_status ? "#ff845d" : "gray" }} onClick={() => {
                                                    handleReplyDisLike(y.id, x.id, index)
                                                  }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                                                      <path d="M6.17306 -0.000173569H18.7212V13.7498L10.8846 21.4902L10.3317 20.9373C10.2179 20.8236 10.1222 20.6777 10.0445 20.4998C9.96674 20.322 9.92788 20.1585 9.92788 20.0095V19.8123L11.2067 13.7498H2.51922C1.99678 13.7498 1.52963 13.5439 1.11778 13.132C0.705927 12.7202 0.5 12.253 0.5 11.7306V10.1921C0.5 10.0783 0.512823 9.95415 0.538469 9.81955C0.564095 9.68492 0.59774 9.56072 0.639406 9.44695L4.05288 1.35558C4.22435 0.970972 4.51281 0.648857 4.91825 0.389233C5.32371 0.129627 5.74198 -0.000173569 6.17306 -0.000173569ZM17.4712 1.24983H6.17306C5.99679 1.24983 5.81651 1.2979 5.63222 1.39404C5.44793 1.49021 5.3077 1.65047 5.21153 1.87483L1.75 9.99983V11.7306C1.75 11.955 1.82211 12.1393 1.96634 12.2835C2.11057 12.4277 2.29486 12.4998 2.51922 12.4998H12.7596L11.3125 19.3268L17.4712 13.2162V1.24983ZM18.7212 13.7498V12.4998H23V1.24983H18.7212V-0.000173569H24.25V13.7498H18.7212Z" fill="currentColor" />
                                                    </svg></button>
                                                  <button className={user.user_id === y.user_id.user_id ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'} onClick={() => {
                                                    deleteReply(y.id, x.id)
                                                  }} style={{ height: '20px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                      <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#878787" />
                                                    </svg></button>
                                                </div>
                                              </div>
                                              <div className='ps-0 ps-lg-5 mt-2 m-0'>
                                                <p className='m-0 text-secondary' style={{ fontSize: '14px' }}>{y.post}</p>
                                                {y.images_attached.map((a) => {
                                                  return (
                                                    <div className=''>
                                                      <img src={a.images} width={300} alt="" className='mt-3' />
                                                    </div>
                                                  )
                                                })}
                                              </div>

                                              {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
                                              <div className="mt-2 ps-0 ps-0 ps-md-5">
                                                <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal" onClick={() => {
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
                                                            <div className="col-7 col-lg-8 ps-0 p-0">
                                                              <h6 className='ms-sm-0 my-0' style={{ fontSize: '12px' }}>
                                                                <Link to={`/profile/${z.user_id.user_id}`} className="text-decoration-none text-dark">{z.user_id.nickname}</Link>
                                                              </h6>
                                                              <p className='ms-sm-0 my-0' style={{ fontSize: '13px' }}>{y.created_at}</p>
                                                            </div>
                                                            <div className="col-3 col-lg-2 p-0 d-flex justify-content-between ms-auto align-items-center">
                                                              <button className='bg-transparent border-0 d-flex align-items-center' style={{ height: '20px', color: z.liked_status ? "#ff845d" : "gray" }} onClick={() => {
                                                                handleReplies_reply_like(z.id, y.id)
                                                              }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
                                                                  <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor" />
                                                                </svg> <span className="ms-1" style={{ fontSize: '14px' }}>{z.reply_likes}</span></button>
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
                                                                  <img src={b.Group_Discussion_Replies_Reply_Images} width={260} alt="" className='mt-3' />
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


                                    {/* To post the replies for the particular comment under the discussion */}

                                    <div onClick={() => {
                                      setindex1(-1)
                                    }} className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center'>
                                      <img src={userdetails.profile_pic} className={userdetails.profile_pic == null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
                                      {userdetails.nickname != undefined ? (<p className={userdetails.profile_pic == null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{ height: '40px', width: '40px' }}><span>{userdetails.nickname.slice(0, 1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>) : (<></>)}
                                      <div className="input-group border rounded pe-3 bg-light">
                                        <input key={index} disabled={!groupdetails.group_member_status}
                                          type="text"
                                          name={post}
                                          onChange={repliesData}
                                          className="form-control py-3 ps-3 shadow-none border-0 bg-light reply-input" placeholder={translate_value.dashboard.reply_here}
                                          style={{ position: 'relative' }} />
                                        <div className='d-flex align-items-center bg-light'>
                                          <input disabled={!groupdetails.group_member_status}
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
                                            htmlFor='file'
                                            className="text-white px-4 py-2" style={{ cursor: 'pointer' }}
                                          ><img src={require('../img/attachment.png')} width={22} height={22} alt="" /></label>
                                          <button
                                            onClick={() => {
                                              postReplies(x.id, index);
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
                          </div>

                        </div>

                      </div>


                      {/* ------------------------------------------Group Documents Section------------------------------------------------------- */}
                      <div className="tab-pane fade bg-light mt-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                        <h6 className={`text-secondary text-center mt-4 ${groupdocuments.length > 0 ? 'd-none' : ''}`}>Upload your Documents!!!</h6>

                        {groupdocuments.length > 0 && (<div>
                          {subloading ? (<Small_Preloader />) : (
                            <div className="row">
                              <div className="col-12">
                                <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
                                  <span className='fw-bold' style={{ color: '#8E9696' }}>{groupdocuments.length} Documents</span>
                                  <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light' onChange={filterdocs}>
                                    <option value="select_filter" className='mt-2'>All</option>
                                    <option value="rating" className=''>Rating</option>
                                    <option value="likes" className=''>Likes</option>
                                    <option value="date" className=''>Date</option>

                                  </select>
                                </div>
                                {/* ORIGINAL */}
                                <div id='original'>
                                  {groupdocuments.map((x) => {
                                    return (
                                      <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                        <div className="row m-0 align-items-center">
                                          <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
                                            <Document file={x.doc_url} onLoadSuccess={() => console.log('Document loaded successfully.')}>
                                              <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
                                            </Document>
                                          </div>
                                          <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                                            <div className="row m-0 border-bottom">
                                              <div className='d-flex justify-content-between'>
                                                <OverlayTrigger
                                                  placement="top"
                                                  delay={{ show: 250, hide: 250 }}
                                                  overlay={renderTooltip(groupdetails.group_name)}
                                                >
                                                  <Link className='fw-bold d-none d-md-inline' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                                                </OverlayTrigger>
                                                <Link className='fw-bold d-inline d-md-none' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title.slice(0, 16)}</Link>

                                                <button onClick={() => {
                                                  unsave(x.document_id)
                                                }} className={`bg-transparent border-0 ${x.study_list_status ? '' : 'd-none'}`} style={{ color: '#8587EA' }}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                    <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3" />
                                                  </svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
                                                <button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none' : ''}`} style={{ color: '#8587EA' }} onClick={() => {
                                                  setdocument_id(x.document_id)
                                                }}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                    <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3" />
                                                  </svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                                              </div>
                                              <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                <img src={x.user_data.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_data.profile_pic != null ? '' : 'd-none'}`} />
                                                <p className={x.user_data.profile_pic == null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{ width: '30px', height: '30px', fontSize: '15px' }}><span>{x.user_data.nickname.slice(0, 1)}</span><span>{x.user_data.nickname.slice(-1)}</span></p>
                                                {x.user_data.nickname}<span className='ms-2' style={{ color: '#8E9696' }}>{x.created_on}</span>
                                                <span className='ms-2 text-secondary d-sm-block d-md-inline-block d-lg-none'>{x.created_on}</span></p>
                                            </div>
                                            <div className="m-0 d-flex align-items-center mt-2">
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                              </svg><span className='ms-1'>{x.views_countdocument_id} <span className='d-lg-inline d-none'>Views</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696" />
                                              </svg>  <span className='ms-2'>{x.discussion_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.favourites_count} <span className='d-lg-inline d-none'>Likes</span></span></span>

                                            </div>

                                          </div>
                                        </div>

                                      </div>
                                    )
                                  })}
                                </div>

                                {/* LIKES*/}
                                <div id='filterlike' style={{ display: 'none' }}>
                                  {filtereddocuments.map((x) => {
                                    return (
                                      <div className='shadow-sm mt-3 py-2 px-2 px-lg-0'>
                                        <div className="row m-0 align-items-center">
                                          <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{ overflow: 'hidden' }}>
                                            <Document file={x.document}>
                                              <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
                                            </Document>
                                          </div>
                                          <div className="col-8 col-md-9 ms-md-0 d-flex flex-column justify-content-center ">
                                            <div className="row m-0 border-bottom">
                                              <div className='d-flex justify-content-between'>
                                                <OverlayTrigger
                                                  placement="top"
                                                  delay={{ show: 250, hide: 250 }}
                                                  overlay={renderTooltip(groupdetails.group_name)}
                                                >
                                                  <Link className='fw-bold d-none d-md-inline' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                                                </OverlayTrigger>
                                                <Link className='fw-bold d-inline d-md-none' style={{ color: '#2A3941', fontSize: '16px' }} to={`/showpdf/${x.document_id}`}>{x.title.slice(0, 16)}</Link>

                                                <button onClick={() => {
                                                  unsave(x.document_id)
                                                }} className={`bg-transparent border-0 ${x.study_list_status ? '' : 'd-none'}`} style={{ color: '#8587EA' }}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                    <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3" />
                                                  </svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
                                                <button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none' : ''}`} style={{ color: '#8587EA' }} onClick={() => {
                                                  setdocument_id(x.document_id)
                                                }}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                                                    <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3" />
                                                  </svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                                              </div>
                                              <p className='mt-1 d-flex align-items-center' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic != null ? '' : 'd-none'}`} />
                                                <p className={x.user_details.profile_pic == null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{ width: '30px', height: '30px', fontSize: '15px' }}><span>{x.user_details.nickname.slice(0, 1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>
                                                {x.user_details.nickname}<span className='ms-2' style={{ color: '#8E9696' }}>{x.created_on}</span>
                                                <span className='ms-2 text-secondary d-sm-block d-md-inline-block d-lg-none'>{x.created_on}</span></p>
                                            </div>
                                            <div className='d-lg-block d-none'>
                                              <div className="m-0 d-flex align-items-center mt-2">
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                </svg><span className='ms-1'>{x.views_countdocument_id} <span className='d-lg-inline d-none'>Views</span></span></span>
                                                <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
                                                  data-bs-custom-class="custom-tooltip"
                                                  data-bs-title="Rating" style={{ fontSize: '14px', color: '#AAB0B0' }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                    <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                                  </svg> <span className='ms-2'>{x.likes} <span className='d-lg-inline d-none'></span>Likes</span></span>
                                                <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                  data-bs-custom-class="custom-tooltip"
                                                  data-bs-title="Comments" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                    <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696" />
                                                  </svg> <span className='ms-2'></span> {x.comment_count}<span className='d-lg-inline d-none ms-1'></span> Discussions</span>
                                                <span data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                  data-bs-custom-class="custom-tooltip"
                                                  data-bs-title="Pages Count" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                    <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696" />
                                                  </svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'></span>Pages</span></span>
                                                <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                  <path d="M12.5002 16.2261L8.81425 12.5402L9.55144 11.791L11.9793 14.2189V5.2085H13.021V14.2189L15.4489 11.791L16.1861 12.5402L12.5002 16.2261ZM6.89118 19.7918C6.41175 19.7918 6.01145 19.6312 5.69027 19.3101C5.36909 18.9889 5.2085 18.5886 5.2085 18.1091V15.5851H6.25016V18.1091C6.25016 18.2694 6.31693 18.4163 6.45048 18.5498C6.58403 18.6834 6.73094 18.7502 6.89118 18.7502H18.1091C18.2694 18.7502 18.4163 18.6834 18.5498 18.5498C18.6834 18.4163 18.7502 18.2694 18.7502 18.1091V15.5851H19.7918V18.1091C19.7918 18.5886 19.6312 18.9889 19.3101 19.3101C18.9889 19.6312 18.5886 19.7918 18.1091 19.7918H6.89118Z" fill="#8E9696" />
                                                </svg><span className='ms-1'>{x.download_count} <span className='d-lg-inline d-none'>Downloads</span></span></span>


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
                                                    data-bs-title="Likes" style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                      <path d="M5.84919 21.8752C5.36976 21.8752 4.96946 21.7146 4.64827 21.3934C4.32709 21.0722 4.1665 20.6719 4.1665 20.1925V6.89117C4.1665 6.41174 4.32709 6.01144 4.64827 5.69026C4.96946 5.36908 5.36976 5.20849 5.84919 5.20849H7.69213V2.88477H8.81393V5.20849H16.2659V2.88477H17.3075V5.20849H19.1505C19.6299 5.20849 20.0302 5.36908 20.3514 5.69026C20.6726 6.01144 20.8332 6.41174 20.8332 6.89117V20.1925C20.8332 20.6719 20.6726 21.0722 20.3514 21.3934C20.0302 21.7146 19.6299 21.8752 19.1505 21.8752H5.84919ZM5.84919 20.8335H19.1505C19.3107 20.8335 19.4576 20.7667 19.5912 20.6332C19.7247 20.4996 19.7915 20.3527 19.7915 20.1925V11.0578H5.20817V20.1925C5.20817 20.3527 5.27494 20.4996 5.40848 20.6332C5.54204 20.7667 5.68894 20.8335 5.84919 20.8335ZM5.20817 10.0162H19.7915V6.89117C19.7915 6.73093 19.7247 6.58403 19.5912 6.45047C19.4576 6.31693 19.3107 6.25016 19.1505 6.25016H5.84919C5.68894 6.25016 5.54204 6.31693 5.40848 6.45047C5.27494 6.58403 5.20817 6.73093 5.20817 6.89117V10.0162Z" fill="#8E9696" />
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
                        </div>)}
                      </div>

                      {/* -----------------------------------------Private Groups flashcards section--------------------------------------------- */}
                      <div className="tab-pane fade bg-white" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                        <div>
                          {subloading ? (<Small_Preloader />) : (
                            <div className="row">
                              <div className="col-12">
                                <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
                                  <p className='m-0 fw-medium'>{flashsets.length} Flashsets</p>
                                  <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light' onChange={(e) => {
                                    filterflashsets(e.target.value)
                                  }}>
                                    <option value="select_filter" className='mt-2'>All</option>
                                    <option value="likes" className=''>Likes</option>
                                    <option value="date" className=''>Date</option>

                                  </select>
                                </div>
                                {/* ORIGINAL */}
                                <div id='flashset_original' className={`${searchedFlashsets.length > 0 ? 'd-none' : ''}`}>
                                  {flashsets.map((x) => {
                                    return (
                                      <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                        <div className="row m-0 align-items-center ps-0 ps-md-3">
                                          <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{ overflow: 'hidden', backgroundColor: '#CFF4D2', height: '100px', width: '100px', border: '0.5px solid #21B3A9' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                              <path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9" />
                                            </svg>
                                          </div>
                                          <div className="col-8 ps-0 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                                            <div className="row m-0 border-bottom">
                                              <div className='d-flex justify-content-between'>
                                                <Link to={`/viewflashcard/group/${group_id}/${x.flashset_id}`} className='fw-bold' style={{ color: '#2A3941' }}>{x.name}</Link>

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
                                              <p className='mt-2' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.profile_pic != null ? '' : 'd-none'}`} />
                                                {x.nickname != undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.profile_pic != null ? 'd-none' : ''}`} style={{ height: '30px', width: '30px' }}>{x.nickname.slice(0, 1)}{x.nickname.slice(-1)}</span>) : (<></>)}
                                                <span className='ms-1'>{x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></span>
                                                {/* <span className='ms-2 text-secondary d-sm-block d-md-inline d-lg-none'>{x.time_since_created}</span> */}
                                              </p>
                                            </div>
                                            <div className="m-0 d-flex align-items-center mt-2">

                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M4.50111 21.146L4.29678 21.0618C3.74524 20.8228 3.37498 20.4255 3.186 19.8699C2.99703 19.3144 3.02407 18.7742 3.26712 18.2493L4.50111 15.5891V21.146ZM9.46905 22.7966C8.89613 22.7966 8.40568 22.5926 7.9977 22.1846C7.58971 21.7766 7.38572 21.2862 7.38572 20.7133V16.5867L9.38494 22.1195C9.43702 22.2544 9.4891 22.3749 9.54119 22.4811C9.59327 22.5873 9.66271 22.6924 9.74952 22.7966H9.46905ZM13.5115 21.8511C13.2364 21.966 12.9653 21.9499 12.6982 21.803C12.4311 21.6561 12.2402 21.4384 12.1253 21.15L7.48988 8.44164C7.37504 8.16654 7.38573 7.89444 7.52194 7.62534C7.65816 7.35622 7.86382 7.16625 8.13892 7.05542L16.0035 4.19083C16.2786 4.07597 16.5431 4.092 16.7968 4.23891C17.0505 4.38582 17.2348 4.6035 17.3497 4.89195L21.9851 17.5602C22.0999 17.8487 22.0993 18.1308 21.9831 18.4066C21.8669 18.6824 21.6646 18.8757 21.3761 18.9865L13.5115 21.8511ZM11.6325 10.4168C11.9277 10.4168 12.175 10.317 12.3747 10.1173C12.5744 9.91767 12.6742 9.67027 12.6742 9.37513C12.6742 9.07999 12.5744 8.8326 12.3747 8.63294C12.175 8.43329 11.9277 8.33346 11.6325 8.33346C11.3374 8.33346 11.09 8.43329 10.8903 8.63294C10.6907 8.8326 10.5908 9.07999 10.5908 9.37513C10.5908 9.67027 10.6907 9.91767 10.8903 10.1173C11.09 10.317 11.3374 10.4168 11.6325 10.4168ZM13.1429 20.8335L21.0075 17.9689L16.3721 5.20846L8.50751 8.07305L13.1429 20.8335Z" fill="#8E9696" />
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

                                {/* LIKES*/}
                                <div id='flashset_filterlike' className={`${searchedFlashsets.length > 0 ? '' : 'd-none'}`}>
                                  {searchedFlashsets.map((x) => {
                                    return (
                                      <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
                                        <div className="row m-0 align-items-center ps-0 ps-md-3">
                                          <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{ overflow: 'hidden', backgroundColor: '#CFF4D2', height: '100px', width: '100px', border: '0.5px solid #21B3A9' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                              <path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9" />
                                            </svg>
                                          </div>
                                          <div className="col-10 ps-0 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                                            <div className="row m-0 border-bottom">
                                              <div className='d-flex justify-content-between'>
                                                <Link to={`/viewflashcard/group/${group_id}/${x.flashset_id}`} className='fw-bold' style={{ color: '#2A3941' }}>{x.name}</Link>

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
                                              <p className='mt-2' style={{ fontSize: '14px', color: '#5D5FE3' }}>
                                                <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.profile_pic != null ? '' : 'd-none'}`} />
                                                {x.nickname != undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.profile_pic != null ? 'd-none' : ''}`} style={{ height: '30px', width: '30px' }}>{x.nickname.slice(0, 1)}{x.nickname.slice(-1)}</span>) : (<></>)}
                                                <span className='ms-1'>{x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></span>
                                              </p>
                                            </div>
                                            <div className="m-0 d-flex align-items-center mt-2">

                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696" />
                                              </svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
                                              <span style={{ fontSize: '14px', color: '#AAB0B0' }} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                <path d="M4.50111 21.146L4.29678 21.0618C3.74524 20.8228 3.37498 20.4255 3.186 19.8699C2.99703 19.3144 3.02407 18.7742 3.26712 18.2493L4.50111 15.5891V21.146ZM9.46905 22.7966C8.89613 22.7966 8.40568 22.5926 7.9977 22.1846C7.58971 21.7766 7.38572 21.2862 7.38572 20.7133V16.5867L9.38494 22.1195C9.43702 22.2544 9.4891 22.3749 9.54119 22.4811C9.59327 22.5873 9.66271 22.6924 9.74952 22.7966H9.46905ZM13.5115 21.8511C13.2364 21.966 12.9653 21.9499 12.6982 21.803C12.4311 21.6561 12.2402 21.4384 12.1253 21.15L7.48988 8.44164C7.37504 8.16654 7.38573 7.89444 7.52194 7.62534C7.65816 7.35622 7.86382 7.16625 8.13892 7.05542L16.0035 4.19083C16.2786 4.07597 16.5431 4.092 16.7968 4.23891C17.0505 4.38582 17.2348 4.6035 17.3497 4.89195L21.9851 17.5602C22.0999 17.8487 22.0993 18.1308 21.9831 18.4066C21.8669 18.6824 21.6646 18.8757 21.3761 18.9865L13.5115 21.8511ZM11.6325 10.4168C11.9277 10.4168 12.175 10.317 12.3747 10.1173C12.5744 9.91767 12.6742 9.67027 12.6742 9.37513C12.6742 9.07999 12.5744 8.8326 12.3747 8.63294C12.175 8.43329 11.9277 8.33346 11.6325 8.33346C11.3374 8.33346 11.09 8.43329 10.8903 8.63294C10.6907 8.8326 10.5908 9.07999 10.5908 9.37513C10.5908 9.67027 10.6907 9.91767 10.8903 10.1173C11.09 10.317 11.3374 10.4168 11.6325 10.4168ZM13.1429 20.8335L21.0075 17.9689L16.3721 5.20846L8.50751 8.07305L13.1429 20.8335Z" fill="#8E9696" />
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
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-3" onClick={() => {
                    setindex1(-1)
                    setreportdropdownstate(false)
                  }}>
                    <div onClick={() => {
                      setindex1(-1)
                      setreportdropdownstate(false)
                    }} className="ms-0 ms-lg-3 bg-white rounded d-flex flex-column align-items-center mb-3 px-2" style={{ height: '400px' }}>
                      <img className={`mt-2 ${tablist === "documents" || tablist === "flashcards" ? "d-block" : "d-none"}`} src={require('../img/images_icons/send-img2.png')} width={60} alt="" />
                      <img className={`mt-2 ${tablist === "discussion" ? "d-block" : "d-none"}`} src={require('../img/images_icons/send-img1.png')} width={60} alt="" />
                      <img src={require('../img/images_icons/mascot1.png')} style={{ height: '250px', width: '118px' }} alt="" />
                      <button disabled={!groupdetails.group_member_status} className={`btn mt-2 w-100 fw-medium ${tablist === "discussion" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3' }} data-bs-toggle="modal"
                        data-bs-target="#postmodalform">{translate_value.dashboard.create_a_post}</button>
                      <Link to={`/group_upload_page/${group_id}`} className={`btn mt-2 w-100 fw-medium ${tablist === "documents" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3' }}>{translate_value.common_words.upload_document}</Link>
                      <Link to='/create_group_flashcard' className={`btn mt-2 w-100 fw-medium ${tablist === "flashcards" ? "d-block" : "d-none"}`} style={{ border: '1px solid #5D5FE3', color: '#5D5FE3' }}>{translate_value.common_words.create_flashcard}</Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* --------------------------------------------------MODALS---------------------------------------------- */}
          <Group_discussion_modals group_id={group_id} count={count} />


          {/* ---------------------------------------------UPLOAD DOCUMENT---------------------------------------------- */}
          <Backtotop />
        </div>

      )}
      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

          <div className="toast-body d-flex justify-content-between align-items-center">
            <span id='toastbody' className='fw-medium p-1'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>

      {/* ------------------------------------Group details displaying modal------------------------------------------------ */}
      <div className="modal fade" id="groupdescriptionmodal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body rounded bg-light py-4">
              {groupdetails && groupdetails.data && (
                <div>
                  <div className='row m-0 border-bottom pb-4'>
                    <div className="col-sm-6 d-flex align-items-center bg-white shadow-sm justify-content-center p-3">
                      {groupdetails.data.group_image != undefined ? (<img className='rounded' src={groupdetails.data.group_image} style={{ width: '80%' }} alt="" />) : (<></>)}
                    </div>
                    <div className="col-sm-6 mt-3 mt-lg-0">
                      {groupdetails.data.group_name != undefined ? (<h6 className='text-center pb-3 border-bottom'>{groupdetails.data.group_name}</h6>) : (<></>)}
                      <div>
                        {groupdetails.data.group_id != undefined ? (<p className='fw-medium' style={{ fontSize: '15px', color: '#5d5fe3' }}>Group Id : <span className='text-dark fw-normal'>{groupdetails.data.group_id}</span></p>) : (<></>)}
                        {groupdetails.data.created_at != undefined ? (<p className='fw-medium' style={{ fontSize: '15px', color: '#5d5fe3' }}>Created on : <span className='text-dark fw-normal'>{groupdetails.data.created_at.slice(0, 10)}</span></p>) : (<></>)}

                      </div>
                      <div className='text-center'>
                        {groupdetails.data.description != undefined ? (<span className='text-secondary' style={{ fontSize: '13px' }}>{groupdetails.data.description}</span>) : (<></>)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h6 style={{ color: '#5d5fe3' }} className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 29 21" fill="none">
                      <path d="M0.786041 20.1475V17.7468C0.786041 17.07 0.961321 16.488 1.31188 16.001C1.66244 15.514 2.13354 15.1247 2.72519 14.8333C3.99012 14.231 5.24611 13.7509 6.49316 13.3928C7.74022 13.0348 9.24063 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786041ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.7789 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79125 9.60258 8.7613 9.17419 7.90453 8.31742C7.04776 7.46065 6.61937 6.4307 6.61937 5.22758C6.61937 4.02443 7.04776 2.99447 7.90453 2.1377C8.7613 1.28092 9.79125 0.852539 10.9944 0.852539C12.1975 0.852539 13.2274 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2274 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758ZM2.24437 18.6891H19.7444V17.7468C19.7444 17.4046 19.6588 17.1055 19.4878 16.8494C19.3167 16.5932 19.0096 16.3483 18.5665 16.1146C17.4783 15.5331 16.3313 15.0877 15.1254 14.7782C13.9194 14.4688 12.5424 14.3141 10.9944 14.3141C9.44631 14.3141 8.0693 14.4688 6.86335 14.7782C5.65743 15.0877 4.51041 15.5331 3.42227 16.1146C2.97916 16.3483 2.67206 16.5932 2.50097 16.8494C2.32991 17.1055 2.24437 17.4046 2.24437 17.7468V18.6891ZM10.9944 8.14424C11.7965 8.14424 12.4831 7.85865 13.0543 7.28747C13.6255 6.71629 13.911 6.02966 13.911 5.22758C13.911 4.42549 13.6255 3.73886 13.0543 3.16768C12.4831 2.5965 11.7965 2.31091 10.9944 2.31091C10.1923 2.31091 9.50566 2.5965 8.93448 3.16768C8.3633 3.73886 8.07771 4.42549 8.07771 5.22758C8.07771 6.02966 8.3633 6.71629 8.93448 7.28747C9.50566 7.85865 10.1923 8.14424 10.9944 8.14424Z" fill="currentColor" />
                    </svg> <span className='ms-1'>Group Admin</span></h6>
                    {groupdetails.admin.map((x) => {
                      return (
                        <div className='bg-white row rounded shadow-sm align-items-center p-3'>
                          <div className="col-1 d-flex justify-content-center align-items-center">
                            {x.user_id.profile_pic != undefined && (<img src={x.user_id.profile_pic} style={{ width: '100%' }} className='rounded' alt="" />)}
                            {x.user_id.nickname != undefined ? (<span className={`rounded text-white p-1 ${x.user_id.profile_pic != null ? 'd-none' : 'd-flex justify-content-center'}`} style={{ height: '100%', width: '100%', backgroundColor: '#5d5fe3' }}>{x.user_id.nickname.slice(0, 1)}{x.user_id.nickname.slice(-1)}</span>) : (<></>)}
                          </div>
                          <div className="col-9">
                            <p className='m-0'>{x.user_id.nickname}</p>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                  <div className={`mt-4 ${groupdetails.members.length > 0 ? '' : 'd-none'}`}>
                    <h6 className='d-flex' style={{ color: '#5d5fe3' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 29 21" fill="none">
                      <path d="M0.786041 20.1475V17.7468C0.786041 17.07 0.961321 16.488 1.31188 16.001C1.66244 15.514 2.13354 15.1247 2.72519 14.8333C3.99012 14.231 5.24611 13.7509 6.49316 13.3928C7.74022 13.0348 9.24063 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786041ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.7789 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79125 9.60258 8.7613 9.17419 7.90453 8.31742C7.04776 7.46065 6.61937 6.4307 6.61937 5.22758C6.61937 4.02443 7.04776 2.99447 7.90453 2.1377C8.7613 1.28092 9.79125 0.852539 10.9944 0.852539C12.1975 0.852539 13.2274 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2274 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758ZM2.24437 18.6891H19.7444V17.7468C19.7444 17.4046 19.6588 17.1055 19.4878 16.8494C19.3167 16.5932 19.0096 16.3483 18.5665 16.1146C17.4783 15.5331 16.3313 15.0877 15.1254 14.7782C13.9194 14.4688 12.5424 14.3141 10.9944 14.3141C9.44631 14.3141 8.0693 14.4688 6.86335 14.7782C5.65743 15.0877 4.51041 15.5331 3.42227 16.1146C2.97916 16.3483 2.67206 16.5932 2.50097 16.8494C2.32991 17.1055 2.24437 17.4046 2.24437 17.7468V18.6891ZM10.9944 8.14424C11.7965 8.14424 12.4831 7.85865 13.0543 7.28747C13.6255 6.71629 13.911 6.02966 13.911 5.22758C13.911 4.42549 13.6255 3.73886 13.0543 3.16768C12.4831 2.5965 11.7965 2.31091 10.9944 2.31091C10.1923 2.31091 9.50566 2.5965 8.93448 3.16768C8.3633 3.73886 8.07771 4.42549 8.07771 5.22758C8.07771 6.02966 8.3633 6.71629 8.93448 7.28747C9.50566 7.85865 10.1923 8.14424 10.9944 8.14424Z" fill="currentColor" />
                    </svg> <span className='ms-1'>Group Members</span></h6>

                    {groupdetails.members.map((x) => {
                      return (
                        <div className='row bg-white rounded shadow-sm align-items-center p-3'>
                          <div className="col-1 d-flex justify-content-center align-items-center">
                            {x.user_id.profile_pic != undefined && (<img src={x.user_id.profile_pic} style={{ width: '100%' }} className='rounded' alt="" />)}
                            {x.user_id.nickname != undefined ? (<span className={`rounded text-white p-1 ${x.user_id.profile_pic != null ? 'd-none' : 'd-flex justify-content-center'}`} style={{ height: '100%', width: '100%', backgroundColor: '#5d5fe3' }}>{x.user_id.nickname.slice(0, 1)}{x.user_id.nickname.slice(-1)}</span>) : (<></>)}
                          </div>
                          <div className="col-9 d-flex align-items-center">
                            <p className='m-0'>{x.user_id.nickname}</p>
                          </div>
                          <div className='col-2'>
                            <button className={`btn btn-sm text-white ${userdetails.user_id === x.user_id.user_id ? 'd-none' : ''}`} style={{ backgroundColor: '#5d5fe3' }} onClick={() => {
                              makeAdmin(x.user_id.user_id, x.user_id.nickname)
                            }}>Make Admin</button>
                            <button onClick={() => {
                              kickout(x.user_id.user_id, x.user_id.nickname)
                            }} className={`btn btn-sm text-white ms-2 ${userdetails.user_id === x.user_id.user_id ? 'd-none' : ''}`} style={{ backgroundColor: '#5d5fe3' }}>Remove</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

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
                        <button style={{ position: 'absolute', top: '-10px', right: '-16px' }} className='btn btn-sm' onClick={() => removereply_image(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
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

      <Create_flashcard_study_list setCount={setCount} flashset_id={flashsetid} call_function={getallflashsetsundergroup} />

      <Create_study_list document_id={document_id} setCount={setCount} call_function={fetchdocs} />

      <Report_post disc_type={"group"} setCount={setCount} setindex1={setindex1} report_status={report_status} setreport_status={setreport_status} discussion_id={report_id} />
      {/*---------------------------------------------Exit the Group Modal---------------------------------------------------*/}

      <div className="modal fade" id="exitgroupmodal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-body pt-4 pb-3">
              <div>
                <label htmlFor="" className='fw-medium text-dark'>Why you want to leave this Group ? </label>
                <textarea placeholder='Reason must be more than 20 characters...' onChange={(e) => {
                  setexitgroup_reason(e.target.value)
                }} className='form-control shadow-sm mt-2 py-3'></textarea>
              </div>
              <div className='mt-3 text-end'>
                <button disabled={exitgroup_reason.length > 20 ? false : true} className='btn btn-sm rounded-pill text-white fw-medium px-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-dismiss="modal" onClick={leaveGroup}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------Report subject modal--------------------------------------------------- */}
      <div className="modal fade" id="reportgroupmodal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-body pt-4 pb-3">
              <div>
                <label htmlFor="" className='fw-medium text-dark'>⚠ Report the Group</label>
                <textarea placeholder='Reason must be more than 20 characters...' onChange={(e) => {
                  setReportvalue(e.target.value)
                }} className='form-control shadow-sm mt-2 py-3'></textarea>
              </div>
              <div className='mt-3 text-end'>
                <button disabled={reportvalue.length > 20 ? false : true} className='btn btn-sm rounded-pill text-white fw-medium px-4' style={{ backgroundColor: '#5d5fe3' }} data-bs-dismiss="modal" onClick={reportGroup}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Groupchat