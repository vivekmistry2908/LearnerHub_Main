import React from 'react'
import { Context } from '../context/Context_provider'
import { useState,useEffect,useContext } from 'react'
import { ipaddress } from '../App'
import { Link, useNavigate } from 'react-router-dom'
import Report_post from './Report_post'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import { getAccessToken } from './authService'
import * as bootstrap from 'bootstrap';


const Subject_discussion = ({course_id,pinnedcomments_status,course_name,setreportdropdownstate,setCount}) => {
  const {translate_value}=useContext(Context)
  const[report_status,setreport_status]=useState(false)
const[report,setreport_id]=useState()
const[count1,setCount1]=useState(0)
  const[pinnedComments,setpinnedComments]=useState([])
 const[userdetails,setUserdetails]=useState({})
 const[index1,setindex1]=useState(-1)
 const[replies_layout,setreplies_layout]=useState(false)


  const userdata=JSON.parse(sessionStorage.getItem('user'))
  const user=JSON.parse(sessionStorage.getItem('user'))

  const[replies,setReplies]=useState("")
  
    const repliesData=(e)=>{
      setReplies(e.target.value)
    }
  useEffect(()=>{
     // To fetch user details
     axiosInstance.get(`${ipaddress}/UserUpdateDetails/${userdata.user_id}/`)
     .then((r)=>{
       console.log("User Details fetched Successfully", r.data)
       setUserdetails(r.data)
     })
     .catch(()=>{
       console.log("User Details Fetching Error")
     })

    fetchPinned_comments()
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  
    return () => {
      tooltipList.forEach((tooltip) => {
        tooltip.dispose();
      });
    };
  },[pinnedcomments_status])

  const fetchPinned_comments=()=>{
    axiosInstance.get(`${ipaddress}/coursediscussionpinningview/${userdata.user_id}/${course_id}/`)
    .then((r)=>{
        console.log("Pinned Comments Successfully Fetched",r.data)
        setpinnedComments(r.data.reverse())
    })
  }

// -----------------------------------------------REPLIES IMAGE UPLOAD--------------------------------------------------
const [repliesImage, setRepliesImage] = useState([]);
const clearInput = (index) => {
  const inputElement = document.getElementsByClassName('pin-reply-input');
  if (inputElement) {
    inputElement[index].value = '';
  }
};

const navigate=useNavigate()

const[load,setload]=useState()

const handleReplyImage2 = (event) => {
  const files=event.target.files
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
const postReplies= async (dis_id,index)=>{
  setload(true)
  const user=JSON.parse(sessionStorage.getItem('user'))
  const formData = new FormData();
        for (const file of repliesImage) {
            formData.append('file', file);
        }
        const encoded_reply=encodeURIComponent(replies)
  
  if(replies.length>0){
    try {
      const token=getAccessToken()

      const response = await fetch(`${ipaddress}/CourseDiscussionReply/${user.user_id}/${dis_id}/""/?post=${encoded_reply}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
      });

      if (response.ok) {
          // console.log('Reply Sent successfully',formData);
          fetchPinned_comments()
 setCount((prev)=>prev+1)
          clearInput(index)
  setRepliesImage([])
  setReplies("")
  setreplies_layout(false)
  toast.success('Replied successfully',{
    autoClose:2000,
  })
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
const[reply_id,setreply_id]=useState(0)
const[discuss_id,setdiscuss_id]=useState(0)
const[reply_index,setreply_index]=useState(0)
const[replies_for_reply_status,setreplies_for_reply_status]=useState(false)
const [replies_reply_Image3, setReplies_reply_image3] = useState([]);
const[reply_for_reply,setReply_for_reply]=useState("")
const clearInput2 = (index) => {
  const inputElement = document.getElementsByClassName('reply-input2');
  if (inputElement) {
    inputElement[index].value = '';
  }
};

const handleReply_reply_Image3 = (event) => {
  const files=event.target.files
     // Ensure that 'files' is not null or undefined
  if (files && files.length > 0) {
    setReplies_reply_image3(Array.from(files));
  } else {
    setReplies_reply_image3([]);
  }
};

const removereply_image3 = (index) => {
  setReplies_reply_image3((prevImages) => prevImages.filter((_, i) => i !== index));
};
const postreply_for_replies= async ()=>{
  const user=JSON.parse(sessionStorage.getItem('user'))
  const formData = new FormData();
        for (const file of replies_reply_Image3) {
            formData.append('images_attached', file);
        }

  const encoded_reply_reply=encodeURIComponent(reply_for_reply)

    if(reply_for_reply.length>0){
      try {
        const token=getAccessToken()
        
        const response = await fetch(`${ipaddress}/CourseDiscussionRepliesReply/${user.user_id}/${reply_id}/""/?post=${encoded_reply_reply}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Subject Reply for reply Sent successfully',response.data);
            setReply_for_reply("")
            getreplies(discuss_id)
            setreplies_for_reply_status(false)
    setReplies_reply_image3([])
    toast.success('Replied successfully',{
      autoClose:2000,
    })
        } else {
            console.error('University Reply under reply sending error');
        }
    } catch (error) {
        console.error('Error reply uploading files:', error);
    }
    }
}

// ------------------------------------------Like and Unlike the post in discussion-------------------------------------------------------

function handleLike1(discussion_id) {
  axiosInstance.delete(`${ipaddress}/DiscussionLikes/${userdata.user_id}/${discussion_id}/`)
  .then((r)=>{
   // console.log("User Unliked the Post",r.data)
   fetchPinned_comments()
     setCount((prev)=>prev+1)
  })
  .catch(()=>{
   console.log("User Unlike error")
  })
 }
 function handleLike(discussion_id) {
   axiosInstance.post(`${ipaddress}/DiscussionLikes/${userdata.user_id}/${discussion_id}/`)
   .then((r)=>{
   //  console.log("User liked the Post",r.data)
   fetchPinned_comments()
     setCount((prev)=>prev+1)
   })
   .catch(()=>{
    console.log("User like error")
   })
  }
 
 //-----------------------------To like and unlike the replies under particular comment in the discussion-----------------
 
 function handleReplyLike1(discussion_id,discid,index) {
   axiosInstance.delete(`${ipaddress}/DiscussionRepliesLikes/${userdata.user_id}/${discussion_id}/`)
   .then((r)=>{
    console.log("User Unliked the Reply",r.data)
   //  getdiscussion()
   //  setCount(count+1)
    getreplies(discid,index)
   })
   .catch(()=>{
    console.log("User Reply Unlike error")
   })
  }
  function handleReplyLike(discussion_id,discid,index) {
    axiosInstance.post(`${ipaddress}/DiscussionRepliesLikes/${userdata.user_id}/${discussion_id}/`)
    .then((r)=>{
     console.log("User liked the Reply",r.data)
     getreplies(discid,index)
    })
    .catch((err)=>{
     console.log("User Reply like error",err)
    })
   }
 
 // ------------------------------------------------To dislike the post in discussion-------------------------------------------------------
 
 function handledislike(discussion_id) {
   axiosInstance.post(`${ipaddress}/CourseDiscussionDisLike/${userdata.user_id}/${discussion_id}/`)
   .then((r)=>{
    console.log("User Disliked the Post",r.data)
    fetchPinned_comments()
    setCount((prev)=>prev+1)
   })
   .catch(()=>{
    console.log("User like error")
   })
  }
 
  // ------------------------------------------------To dislike the repliy in discussion-------------------------------------------------------
 
 function handlereplydislike(discussion_id,discid,index) {
   axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesDisLikes/${userdata.user_id}/${discussion_id}/`)
   .then((r)=>{
    console.log("User Disliked the Post",r.data)
    getreplies(discid,index)
   })
   .catch(()=>{
    console.log("User like error")
   })
  }
 
   //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------
 
 function handleReplies_reply_like(replies_reply_id,disc_replyid) {
   axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesReplyLikes/${userdata.user_id}/${replies_reply_id}/`)
   .then((r)=>{
    console.log("User liked the Replies reply",r.data)
    getreplies_for_reply(disc_replyid)
   })
   .catch((err)=>{
    console.log("User Replies reply like error",err)
   })
  }
 
 //  -----------------------------Functionality to dislike the reply uneder particular reply----------------------------------
 function handlereplies_replydislike(replies_reply_id,disc_replyid) {
   axiosInstance.post(`${ipaddress}/CourseDiscussionRepliesReplyDislike/${userdata.user_id}/${replies_reply_id}/`)
   .then((r)=>{
    console.log("University Replies reply disliked",r.data)
    getreplies_for_reply(disc_replyid)
   })
   .catch(()=>{
    console.log("University replies reply dislike error")
   })
  }
 
 
 
 // -----------------------------------------------------To Edit the post in subject discussion--------------------------------------------------------
 const[editedpost,setEditedpost]=useState("")
 const[discussionId,setdiscussionId]=useState(0)
 
 const editpostfunctionData=(value)=>{
   setEditedpost(value)
 }
 
 const editPosts=(discid)=>{
   setdiscussionId(discid)
   const foundDiscussion = pinnedComments.find((x) => discid === x.disid.discid);
 
   if (foundDiscussion) {
     setEditedpost(foundDiscussion.disid.post);
   }
 }
 
 const sendEditedData =() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   const formData = new FormData();
   formData.append('post', editedpost);
 
   axiosInstance.put(`${ipaddress}/CourseDiscussionEdit/${userdata.user_id}/${course_id}/${discussionId}/`,formData)
  .then((r)=>{
    fetchPinned_comments()
    setCount((prev)=>prev+1)
    toast.success('Post updated successfully',{
      autoClose:2000,
    })
 setindex1(-1)
  })
  .catch(()=>{
   console.log("Post Editing Error")
  })
   
 };
 
 // ------------To fetch all the replies corresponding to the particular post when we click on view all comments----------------------------------------------------------------
 
 const[fetchedreplies,setFetchedreplies]=useState([])
 const getreplies=(discussion_id,index)=>{
   axiosInstance.get(`${ipaddress}/coursecommentsreplies/${discussion_id}/${userdata.user_id}/`)
   .then((r)=>{
     console.log("Replies",r.data)
     setFetchedreplies(r.data.reverse())
     fetchPinned_comments()
   })
 }
 
 // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
 const[fetchedreplies_for_reply,setFetchedreplies_for_reply]=useState([])
 
 const getreplies_for_reply=(particular_reply_id)=>{
   axiosInstance.get(`${ipaddress}/CourseDiscussionRepliesReply/${userdata.user_id}/${particular_reply_id}/`)
   .then((r)=>{
     console.log("Course Replies under reply fetched successfully",r.data)
     setFetchedreplies_for_reply(r.data.reverse())
     // setCount(count+1)
   })
 }
 
 
 // ---------------------------------To Delete the  particular post from the discussion--------------------------------------------------------
 
 const deletePost=(discussion_id)=>{
   axiosInstance.delete(`${ipaddress}/CDDI/${discussion_id}/`)
   .then((r)=>{
    fetchPinned_comments()
    setCount((prev)=>prev+1)
    toast.success('Post deleted successfully',{
      autoClose:2000,
    })
 setindex1(-1)
   })
   .catch(()=>{
     console.log("Post Delete Error")
   })
 }
 
 // -------------------------To Delete the particular reply under the specific post in the discussion--------------------------------------------------------
 
 const deleteReply=(disc_reply_id,discid)=>{
   axiosInstance.delete(`${ipaddress}/CourseDiscussionReplydelete/${disc_reply_id}/`)
   .then((r)=>{
    fetchPinned_comments()
    setCount((prev)=>prev+1)
    toast.success('Reply deleted successfully',{
      autoClose:2000,
    })
 getreplies(discid)
   })
   .catch(()=>{
     console.log("Reply Delete Error")
   })
 }
 
 // -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------
 
 const deleteReply_for_reply=(reply_reply_id,disc_reply_id,discid)=>{
   axiosInstance.delete(`${ipaddress}/CourseDiscussionRepliesReply/${userdata.user_id}/${reply_reply_id}/`)
   .then((r)=>{
     console.log("Replies reply deleted successfully",r.data)
     toast.success('Reply deleted successfully',{
      autoClose:2000,
    })
 getreplies(discid)
 getreplies_for_reply(disc_reply_id)
   })
   .catch((err)=>{
     console.log("Replies reply Delete Error",err)
   })
 }
 
 // ---------------------------------------------------UNPIN COMMENT-------------------------------------------------------
const unpin=(discid)=>{
  const formdata1=new FormData()
  formdata1.append('discid',discid)
axiosInstance.delete(`${ipaddress}/Unpiningcoursecomments/${userdata.user_id}/${course_id}/${discid}/`)
.then((r)=>{
  console.log("UnPinned Successfully",r.data)
    fetchPinned_comments()
    setCount((prev)=>prev+1)
    toast.success('Comment unfollowed successfully',{
      autoClose:2000,
    })
})
.catch(()=>{
  console.log("discussion id")
})
}

  return (
    <div className={`${pinnedcomments_status ? '':'d-none'}`}>
      <h6 className={`text-center py-2 ${pinnedComments.length>0 ? 'd-none':'py-3'}`} style={{color:'#5d5fe3',fontSize:'14px'}}>No followed comments available ...💬</h6>
  <h6 className={`pt-2 ${pinnedComments.length>0 ? '':'d-none'}`} style={{color:'#5d5fe3'}}>Followed Comments</h6>

  {pinnedComments.map((x,index)=>{
    return(
      <div className='mt-3' key={index}>
      <div className='px-3 pe-4 pt-2 pb-3 rounded shadow-sm border'>
        <div className="row border-bottom py-3 m-0 align-items-center">
          <div className="col-1 px-1 px-lg-0 d-flex justify-content-center" onClick={()=>{
            setindex1(-1)
            setreportdropdownstate(false)
          }}>
          <img src={x.disid.user_id.profile_pic} className={x.disid.user_id.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
  <p className={x.disid.user_id.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{x.disid.user_id.nickname.slice(0,1)}</span><span>{x.disid.user_id.nickname.slice(-1)}</span></p>

          </div>
          <div className="col-9 p-0" onClick={()=>{
            setindex1(-1)
            setreportdropdownstate(false)
          }}>
            <Link to={`/profile/${x.disid.user_id.user_id}`} className='ms-3 ms-sm-0 my-0 fw-medium text-decoration-none text-dark' style={{fontSize:'14px'}}>{x.disid.user_id.nickname}
            <span className='fw-normal ms-2 text-secondary' style={{fontSize:'13px'}}>{x.disid.created_at}</span>
            </Link>
            <p className='ms-3 ms-sm-0 my-0 d-flex align-items-center' style={{fontSize:'12px',color:'#8587EA',cursor:'pointer'}} onClick={()=>{
                navigate(`/profile/${x.disid.user_id.user_id}`)
              }}>click to view more<span className={`ms-2 edit ${x.edited ? '':'d-none'}`}>Edited</span></p>
          </div>
          <div className="col-2 d-flex justify-content-between align-items-center p-0">
            <span data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Unfollow" style={{cursor:'pointer'}} onClick={()=>{
              unpin(x.disid.discid)
            }}><i className="fa-solid fa-link-slash" style={{color:'#2A3941'}}></i></span>
          
           <div className="btn-group dropstart">
           <span className="border-0" type="button" style={{cursor:'pointer'}} onClick={()=>{
              if(index1==index)
              setindex1(-1)
            else
              setindex1(index)
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
<path d="M17.4998 27.0354C17.0988 27.0354 16.7555 26.8926 16.4699 26.607C16.1843 26.3214 16.0415 25.9781 16.0415 25.5771C16.0415 25.176 16.1843 24.8327 16.4699 24.5471C16.7555 24.2615 17.0988 24.1187 17.4998 24.1187C17.9009 24.1187 18.2442 24.2615 18.5298 24.5471C18.8154 24.8327 18.9582 25.176 18.9582 25.5771C18.9582 25.9781 18.8154 26.3214 18.5298 26.607C18.2442 26.8926 17.9009 27.0354 17.4998 27.0354ZM17.4998 18.9585C17.0988 18.9585 16.7555 18.8157 16.4699 18.5301C16.1843 18.2445 16.0415 17.9012 16.0415 17.5001C16.0415 17.0991 16.1843 16.7558 16.4699 16.4702C16.7555 16.1846 17.0988 16.0418 17.4998 16.0418C17.9009 16.0418 18.2442 16.1846 18.5298 16.4702C18.8154 16.7558 18.9582 17.0991 18.9582 17.5001C18.9582 17.9012 18.8154 18.2445 18.5298 18.5301C18.2442 18.8157 17.9009 18.9585 17.4998 18.9585ZM17.4998 10.8815C17.0988 10.8815 16.7555 10.7388 16.4699 10.4532C16.1843 10.1676 16.0415 9.82424 16.0415 9.42318C16.0415 9.02214 16.1843 8.67882 16.4699 8.39323C16.7555 8.10764 17.0988 7.96484 17.4998 7.96484C17.9009 7.96484 18.2442 8.10764 18.5298 8.39323C18.8154 8.67882 18.9582 9.02214 18.9582 9.42318C18.9582 9.82424 18.8154 10.1676 18.5298 10.4532C18.2442 10.7388 17.9009 10.8815 17.4998 10.8815Z" fill="#2A3941"/>
</svg>
  </span>
            <ul className={`bg-white shadow-sm border rounded mt-0 p-0 px-3 ${ index1==index ? '':'d-none'}`} style={{width:'160px',position:'absolute',left:'-160px'}}>
  <button className={x.disid.user_id.nickname !=user.nickname || x.disid.created_at.includes("day") || x.disid.created_at.includes("week") || x.disid.created_at.includes("year") ? 'd-none' : 'bg-transparent border-0 d-flex align-items-center my-2'} data-bs-toggle="modal" data-bs-target="#editModal" onClick={()=>{
              editPosts(x.disid.discid)
            }} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
            <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black"/>
          </svg></span><span className="ms-2">{translate_value.common_words.edit}</span></button>

                    {/* ----------------------------------------------------Report button--------------------------------------------------- */}
<button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-none':'d-flex align-items-center'}`} 
onClick={()=>{
  setreport_id(x.disid.discid)
  setreport_status(true)
}} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#2A3941"/>
            </svg></span> <span className="ms-2">Report</span></button>
            
            <button className={`bg-transparent border-0 my-2 ${x.report_status ? 'd-flex align-items-center':'d-none'}`} style={{height:'20px',color:'#FF845D'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D"/>
            </svg></span> <span className="ms-2">Reported</span></button>


            <button className={`bg-transparent border-0 ${userdata.user_id === x.disid.user_id.user_id ? 'd-flex align-items-center my-2':'d-none'}`}  onClick={()=>{
              deletePost(x.disid.discid)
            }} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
            <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
          </svg></span><span className="ms-2">{translate_value.common_words.delete}</span></button>
  </ul>
</div>


          {/* -----------------------EDIT THE POST--------------------------------------------------------- */}

<div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered modal-lg">
  <div className="modal-content">
    <div className="modal-body">
      <div className=' bg-white px-3 pt-2 pb-3 rounded'>
        <h6 className='pb-2 ps-1'>Edit the Post</h6>
        <div className='d-flex gap-3'>
        <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
        {userdetails.nickname!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
          <div className="input-group rounded bg-light pe-3 border">
                <input
                  type="text"
                  name="question"
                  onChange={(e)=>editpostfunctionData(
                    e.target.value
                  )}
                  value={editedpost}
                  className="form-control py-3 ps-3 shadow-none border-0 bg-transparent" placeholder="Ask a question....."
                  style={{position:'relative'}}/>
                 <button data-bs-dismiss="modal" disabled={editedpost.length>0 ? false:true} onClick={()=>{
            sendEditedData(x.disid.discid)
          }} className='bg-transparent border-0'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696"/>
        </svg>
          </button>
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
        <div className='py-2 ms-1 mt-2' onClick={()=>{
            setindex1(-1)
          }}>
          <p className='m-0' id={x.discid} style={{fontSize:'16px',fontWeight:'450',letterSpacing:'0.32px',lineHeight:'22px',color:'#2A3941'}}>{x.disid.post}</p>
          {x.disid.images_attached &&(
            x.disid.images_attached.map((z)=>{
              return(
                <div>
                  <img src={z.image} width={300} alt="" className='mt-3'/>
                </div>
              )
            })
          )}
          
        </div>

<div className='d-flex justify-content-between border-bottom pt-3 pb-4 px-2' onClick={()=>{
            setindex1(-1)
          }}>
<div className='d-flex'>
 <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: x.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
            if(x.liked_status==true){
              handleLike1(x.disid.discid)
            }
            else{
              handleLike(x.disid.discid)
            }
          }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z" 
          fill="currentColor"/>
          </svg> <span className='ms-1'>{x.likes}</span></button>
 <button className='bg-transparent border-0 ms-4 d-flex align-items-center' style={{height:'20px',color: x.dis_liked_status ? "#ff845d" : "gray" }} onClick={()=>{
          if(x.dis_liked_status==true){
            handledislike(x.disid.discid)
          }
          else{
            handledislike(x.disid.discid)
          }
        }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor"/>
        </svg></button>
          </div>
{x.discussion_replies_count>0 ? 
<button className='ms-4 bg-transparent border-0 fw-bold' style={{color:'#5D5FE3',fontSize:'14px'}} onClick={(e)=>{
  setreplies_layout(!replies_layout)
  getreplies(x.disid.discid,index)
}}>{translate_value.dashboard.view_all} {x.discussion_replies_count} {translate_value.dashboard.replies}</button> : <p></p>
}
</div>

{fetchedreplies && fetchedreplies.length > 0 && ( 
<div className={fetchedreplies[0].discid == x.disid.discid && replies_layout ? 'd-block':'d-none'}>
{fetchedreplies.map((y)=>{

return(
  <div className='ps-0 ps-md-3 py-2 mt-3' onClick={()=>{
    setindex1(-1)
  }}>
<div className="row w-100">
<div className="col-2 col-md-1 d-flex justify-content-end">
<img src={y.user.profile_pic} className={y.user.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
  <p className={y.user.profile_pic ==null ? 'bg-info text-white p-2 rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{fontSize:'14px',height:'30px',width:'30px'}}><span>{y.user.nickname.slice(0,1)}</span><span>{y.user.nickname.slice(-1)}</span></p>
</div>
<div className="col-8 col-md-9 p-0">
  <h6 className='ms-1 ms-sm-0 my-0' style={{fontSize:'12px'}}>{y.user.first_name} {y.user.last_name}</h6>
    <p className='ms-1 ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.created_at}</p>
</div>
<div className="col-2 p-0 d-flex justify-content-between">
<button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
  if(y.liked_status==true){
    handleReplyLike1(y.disrid,x.disid.discid,index)
  }
  else{
    handleReplyLike(y.disrid,x.disid.discid,index)
  }
}}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
<path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z" fill="currentColor"/>
</svg> {y.like_count}</button>
 
 <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.dis_liked_status ? "#ff845d" : "gray" }} onClick={()=>{
            handlereplydislike(y.disrid,x.disid.discid,index)
        }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor"/>
        </svg></button>
<button className={userdata.user_id === y.user.user_id ? 'bg-transparent border-0 ms-1 d-flex align-items-center' : 'd-none'}  onClick={()=>{
  deleteReply(y.disrid,x.disid.discid)
}} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
<path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#808080"/>
</svg></button>
</div>
</div>
<div className='ps-md-5 ps-0 mt-2 m-0 pe-5' style={{ width: '100%', overflowWrap: 'break-word', overflowX: 'hidden' }}>
<p className='m-0 text-secondary' style={{fontSize:'14px'}}>{y.post}</p>
{y.images_attached.map((a)=>{
  return(
    <div className='d-flex justify-content-center'>
      <img src={a.doc_reply_images} width={300} alt="" className='mt-3'/>
    </div>
  )
})}
</div>

  {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
  <div className="mt-2 ps-0 ps-0 ps-md-5">
  <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal1" onClick={()=>{
    setdiscuss_id(x.disid.discid)
    setreply_id(y.disrid)
  }} style={{cursor:'pointer'}} className="reply_for_reply fw-bold d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z" fill="#2A3941"/>
</svg> <span className="ms-1">reply</span></span>

<p style={{cursor:'pointer'}} className={`view_reply_for_reply mt-2 ${y.replies_replies_count>0 ? '':'d-none'}`} onClick={()=>{
  setreplies_for_reply_status(!replies_for_reply_status)
getreplies_for_reply(y.disrid)
}}>---View {y.replies_replies_count} replies</p>

{fetchedreplies_for_reply && fetchedreplies_for_reply.length > 0 && ( 
  <div className={fetchedreplies_for_reply[0].discid == y.disrid && replies_for_reply_status ? 'd-block':'d-none'}>
  {fetchedreplies_for_reply.map((z)=>{
  
    return(
      <div className='ps-0 ps-md-3 py-2 mt-3 bg-white' onClick={()=>{
        setindex1(-1)
      }} >
  <div className="row w-100 align-items-center">
    <div className="col-2 col-md-1 d-flex justify-content-center">
    <img src={z.user_id.profile_pic} className={z.user_id.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
      <p className={z.user_id.profile_pic ==null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{fontSize:'14px',height:'30px',width:'30px'}}><span>{z.user_id.nickname.slice(0,1)}</span><span>{z.user_id.nickname.slice(-1)}</span></p>
    </div>
    <div className="col-7 col-lg-8 ps-0 p-0">
      <h6 className='ms-sm-0 my-0' style={{fontSize:'12px'}}>
      <Link to={`/profile/${z.user_id.user_id}`} className="text-decoration-none text-dark">{z.user_id.nickname}</Link>
      </h6>
        <p className='ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.created_at}</p>
    </div>
    <div className="col-3 col-lg-3 px-3 p-0 d-flex justify-content-between align-items-center">
    <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: z.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
        handleReplies_reply_like(z.id,y.disrid)
    }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
    <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor"/>
    </svg> <span className="ms-1" style={{fontSize:'14px'}}>{z.likes_count}</span></button>
    <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: z.dis_like_status ? "#ff845d" : "gray" }} onClick={()=>{
              handlereplies_replydislike(z.id,y.disrid)
          }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
          <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor"/>
          </svg></button>
    <button className={userdata.first_name === z.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'}  onClick={()=>{
      deleteReply_for_reply(z.id,y.disrid,x.disid.discid)
    }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 18 20" fill="none">
    <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#8E9696"/>
  </svg></button>
    </div>
  </div>
  <div className='ps-0 ps-lg-5 mt-2 m-0'>
  <p className='m-0' style={{fontSize:'14px',color:'#8e9696'}}>{z.post}</p>
  {z.images_attached.map((b)=>{
      return(
        <div className='d-flex justify-content-center'>
          <img src={b.dis_reply_reply_images} width={260} alt="" className='mt-3'/>
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
        <div onClick={()=>{
            setindex1(-1)
          }} className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center'>
        <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
    {userdetails.nickname!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{fontSize:'14px',height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
          <div className="input-group border rounded pe-3 bg-light">
                <input key={index}
                  type="text"
                  onChange={repliesData}
                  className="form-control py-3 ps-3 shadow-none border-0 bg-light pin-reply-input" placeholder={translate_value.dashboard.reply_here}
                  style={{position:'relative'}}/>
                  <div className='d-flex align-items-center bg-light'>
                  <input
              id="file1"
              type='file'
              name='file'
              accept="image/*"
              multiple
              onChange={handleReplyImage2}
                className="bg-light text-center p-3 btn"
              />
              <label data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Attach Image"
                htmlFor="file1"
                className="custom-file-input bg-transparent border-0 px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
<path d="M21.6825 19.4231C21.6825 21.3164 21.0302 22.9276 19.7258 24.2565C18.4213 25.5855 16.8259 26.25 14.9397 26.25C13.0535 26.25 11.4541 25.5855 10.1416 24.2565C8.8291 22.9276 8.17285 21.3164 8.17285 19.4231V8.50962C8.17285 7.1875 8.62758 6.0637 9.53704 5.13822C10.4465 4.21274 11.5623 3.75 12.8844 3.75C14.2065 3.75 15.3223 4.21274 16.2318 5.13822C17.1412 6.0637 17.5959 7.1875 17.5959 8.50962V18.8462C17.5959 19.5801 17.3399 20.2123 16.8277 20.7428C16.3155 21.2732 15.6913 21.5385 14.9551 21.5385C14.2189 21.5385 13.5855 21.2774 13.0551 20.7552C12.5246 20.2331 12.2594 19.5967 12.2594 18.8462V8.46153H13.5094V18.8462C13.5094 19.2452 13.646 19.5853 13.9193 19.8666C14.1925 20.1478 14.5286 20.2885 14.9277 20.2885C15.3267 20.2885 15.6628 20.1478 15.9361 19.8666C16.2093 19.5853 16.3459 19.2452 16.3459 18.8462V8.48556C16.3411 7.51442 16.0072 6.69071 15.3443 6.01444C14.6814 5.33815 13.8614 5 12.8844 5C11.9152 5 11.0959 5.34215 10.4267 6.02644C9.75747 6.71073 9.42285 7.53846 9.42285 8.50962V19.4231C9.41806 20.9663 9.95252 22.2816 11.0262 23.369C12.1 24.4563 13.4073 25 14.9484 25C16.4677 25 17.7592 24.4563 18.8227 23.369C19.8863 22.2816 20.4229 20.9663 20.4325 19.4231V8.46153H21.6825V19.4231Z" fill="#8E9696"/>
</svg>
              </label>
                <button disabled={replies.length>0 ? false : true}
onClick={() => {
  // Assuming postQuestion and postReplies are functions defined elsewhere
  postReplies(x.disid.discid,index);
}}
className='h-100 bg-transparent border-0 ms-2'
>
<div className={`spinner-border spinner-border-sm ${load ? '':'d-none'}`} role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<svg data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" className={`${load ? 'd-none':''}`} width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696"/>
        </svg>
</button>
                  </div>
              </div>

        </div>
        <div className='d-flex gap-3 mt-3'>
        {repliesImage.length > 0 &&
          repliesImage.map((image, index) => (
            <div key={index} className="image-preview bg-light p-2" style={{position:'relative'}}>
              <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
              <button style={{position:'absolute',top:'-10px',right:'-16px'}} className='btn btn-sm' onClick={() => removeImage(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg></button>
            </div>
          ))
        }
    </div>
      </div>
  </div>
    )
  })}

  {/* -----------------------------------------------To post the reply for reply modal------------------------------------------ */}
<div className="modal fade" id="replyforreply_modal1" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

<div className="modal-dialog  modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-body">
        <div className='col-12 bg-white px-3 pt-2 pb-3'>
            <h6 className='pb-2 ps-1'>Post a Reply for Reply</h6>
            <div className='d-flex gap-3 align-items-center'>
            <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
        {userdetails.nickname!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
              <div className="input-group bg-light border rounded pe-3">
                    <input
                      type="text"
                      name="question"
                      value={reply_for_reply}
                      onChange={(e)=>{
                        setReply_for_reply(e.target.value)
                      }}
                      className="form-control py-3 ps-3 bg-light border-0 shadow-none post-input" placeholder="Post your reply....."
                      style={{position:'relative'}}/>
                    <div className='d-flex align-items-center bg-light'>
                    <input
                    id="fileInput3"
                    type='file'
                    name='file'
                    accept="image/*"
                    multiple
                    onChange={handleReply_reply_Image3}
                    className="bg-light text-center p-3 btn"
                  />
                  <label data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Attach Image"
                    htmlFor="fileInput3"
                    className="custom-file-input bg-transparent border-0 px-4 py-2">
                    <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
                  </label>
                    <button disabled={reply_for_reply.length>0 ? false : true} data-bs-dismiss="modal" onClick={postreply_for_replies} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' >
                    <svg data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Post" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696"/>
        </svg>
                    </button>
                    </div>
                  </div>
                 
            </div>
            <div className='d-flex gap-3 mt-3'>
            {replies_reply_Image3.length > 0 &&
          replies_reply_Image3.map((image, index) => (
            <div key={index} className="image-preview bg-light p-2" style={{position:'relative'}}>
              <img src={URL.createObjectURL(image)} width={50} alt={`Selected Image ${index + 1}`} />
              <button style={{position:'absolute',top:'-10px',right:'-16px'}} className='btn btn-sm' onClick={() => removereply_image3(index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
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

    <Report_post disc_type={"subject"} setCount={setCount} setindex1={setindex1} report_status={report_status} setreport_status={setreport_status} discussion_id={report}/>

    </div>
  )
}

export default Subject_discussion