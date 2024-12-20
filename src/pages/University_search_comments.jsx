import { ipaddress } from '../App'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context/Context_provider'
import { useContext } from 'react'
import Report_post from './Report_post'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import { getAccessToken } from './authService'
import * as bootstrap from 'bootstrap';


const University_search_comments = ({count,searchvalue,setCount}) => {
  const {translate_value}=useContext(Context)
  const[report_status,setreport_status]=useState(false)
  const[report_id,setreport_id]=useState()

    const user=JSON.parse(sessionStorage.getItem('user'))
    const[replies_status,setreplies_status]=useState(false)
    const[count1,setcount1]=useState(0)
  const[index1,setindex1]=useState(-1)
  const[replies,setReplies]=useState("")
  
    const repliesData=(e)=>{
      setReplies(e.target.value)
    }

// ----------------------------------------Search Discussion under university-------------------------------------------------------
const [searchedComments, setSearchedComments] = useState([]);
const [searchcomment, setSearchcomment] = useState("");


useEffect(()=>{
  searchcomments()

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    });
  };
  },[searchvalue])

    // To fetch user details
    const searchcomments = () => {
        if(searchvalue.length>0){
        axiosInstance.get(`${ipaddress}/SearchCommentsUnderUniversity/${user.user_id}/${user.university_id}/${searchvalue}/`)
          .then((response) => {
            console.log("University Searched Comment successful", response.data);
            setSearchedComments(response.data);
          })
          .catch((error) => {
            console.error("Error fetching comments:", error);
          })
        }
        else{
            console.log("Empty")
          setSearchedComments([])
        }
      }


    const[userdetails,setUserdetails]=useState({})

    useEffect(()=>{
      // To fetch user details
      axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
      .then((r)=>{
        console.log("User Details fetched Successfully", r.data)
        setUserdetails(r.data)
      })
      .catch(()=>{
        console.log("User Details Fetching Error")
      })
    },[count1])


// ------------------------Functionality for posting replies under particular comment discussion--------------------------------------------------

const [repliesImage4, setRepliesImage4] = useState([]);
const[load,setload]=useState()

const clearInput = (index) => {
  const inputElement = document.getElementsByClassName('reply-input4');
  if (inputElement) {
    inputElement[index].value = '';
  }
};

const handleReplyImage4 = (event) => {
  const files=event.target.files
     // Ensure that 'files' is not null or undefined
  if (files && files.length > 0) {
    setRepliesImage4(Array.from(files));
  } else {
    setRepliesImage4([]);
  }
};
const postReplies= async (dis_id,index)=>{
  setload(true)
  const user=JSON.parse(sessionStorage.getItem('user'))
  const formData = new FormData();
        for (const file of repliesImage4) {
            formData.append('images_attached', file);
        }

  const encoded_reply=encodeURIComponent(replies)

        try {
          const token=getAccessToken()

          const response = await fetch(`${ipaddress}/UniversityDiscussionReplyView/${user.user_id}/${user.university_id}/${dis_id}/""/?post=${encoded_reply}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });

          if (response.ok) {
              // console.log('University Reply Sent successfully',formData);
              searchcomments()
     setCount((prev)=>prev+1)
     toast.success('Replied successfully',{
      autoClose:2000,
    })
              clearInput(index)
              getreplies(dis_id)
      setRepliesImage4([])
      setload(false)
          } else {
            setload(false)
              console.error('University Reply sending error');
          }
      } catch (error) {
          console.error('Error reply uploading files:', error);
      }
}

// --------------------Functionality to post replies under a reply---------------------------------------------------------
const[reply_id,setreply_id]=useState(0)
const[discuss_id,setdiscuss_id]=useState(0)
const[reply_index,setreply_index]=useState(0)

const [replies_reply_Image4, setReplies_reply_image4] = useState([]);
const[reply_for_reply,setReply_for_reply]=useState("")
const clearInput2 = (index) => {
  const inputElement = document.getElementsByClassName('reply-input2');
  if (inputElement) {
    inputElement[index].value = '';
  }
};

const handleReply_reply_Image4 = (event) => {
  const files=event.target.files
     // Ensure that 'files' is not null or undefined
  if (files && files.length > 0) {
    setReplies_reply_image4(Array.from(files));
  } else {
    setReplies_reply_image4([]);
  }
};
const postreply_for_replies= async ()=>{
  const user=JSON.parse(sessionStorage.getItem('user'))
  const formData = new FormData();
        for (const file of replies_reply_Image4) {
            formData.append('images_attached', file);
        }

  const encoded_reply_reply=encodeURIComponent(reply_for_reply)

        try {
          const token=getAccessToken()
          
          const response = await fetch(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${reply_id}/""/?post=${encoded_reply_reply}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });

          if (response.ok) {
              console.log('University Reply for reply Sent successfully',response.data);
              setReply_for_reply("")
              getreplies(discuss_id)
              setreplies_for_reply_status(false)
      setReplies_reply_image4([])
          } else {
              console.error('University Reply under reply sending error');
          }
      } catch (error) {
          console.error('Error reply uploading files:', error);
      }
}

// ------------------------------------------------To Unlike the discussion post-------------------------------------------------------
function handleLike1(discussion_id) {
  axiosInstance.delete(`${ipaddress}/UniversityDiscussionLikesView/${discussion_id}/${user.user_id}/`)
  .then((r)=>{
   // console.log("User Unliked the Post",r.data)
   searchcomments()
   setCount((prev)=>prev+1)
  })
  .catch(()=>{
   console.log("User Unlike error")
  })
 }
 
 // ------------------------------------------------To Like the discussion post-------------------------------------------------------
 
 function handleLike(discussion_id) {
   axiosInstance.post(`${ipaddress}/UniversityDiscussionLikesView/${discussion_id}/${user.user_id}/`)
   .then((r)=>{
    console.log("User liked the Post",r.data)
    searchcomments()
    setCount((prev)=>prev+1)
   })
   .catch(()=>{
    console.log("User like error")
   })
  }
 
  // ---------------------------------------------To Dislike the discussion post-------------------------------------------------------
 function handledislike1(discussion_id) {
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionDisLikesView/${discussion_id}/${user.user_id}/`)
   .then((r)=>{
   //  console.log("User Removed the dislike",r.data)
   searchcomments()
   setCount((prev)=>prev+1)
   })
   .catch(()=>{
   //  console.log("User Removed the dislike error")
   })
  }
  function handledislike(discussion_id) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionDisLikesView/${discussion_id}/${user.user_id}/`)
    .then((r)=>{
     // console.log("University Disliked the Post",r.data)
     searchcomments()
     setCount((prev)=>prev+1)
    })
    .catch(()=>{
     // console.log("University dislike error")
    })
   }
 
  // ---------------------------------------------To Dislike the discussion replies-------------------------------------------------------
  function handlereplydislike1(discussion_id,discid,index) {
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionReplyDisLikesView/${user.user_id}/${discussion_id}/`)
   .then((r)=>{
   //  console.log("University reply Removed the dislike",r.data)
    getreplies(discid,index)
   })
   .catch(()=>{
   //  console.log("User Removed the dislike error")
   })
  }
  function handlereplydislike(discussion_id,discid,index) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionReplyDisLikesView/${user.user_id}/${discussion_id}/`)
    .then((r)=>{
     // console.log("University Reply disliked",r.data)
     getreplies(discid,index)
    })
    .catch(()=>{
     // console.log("University reply dislike error")
    })
   }
 
 //  ----------------------Functionality to like the reply under particular comment in the discussion---------------------------------------------------------
 
 function handleReplyLike1(discussion_id,discid,index) {
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionReplyLikesView/${user.user_id}/${discussion_id}/`)
   .then((r)=>{
   //  console.log("User Unliked the Reply",r.data)
    getreplies(discid,index)
   })
   .catch(()=>{
   //  console.log("User Reply Unlike error")
   })
  }
 
  //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------
 
 function handleReplies_reply_like(replies_reply_id,disc_replyid) {
   axiosInstance.post(`${ipaddress}/UniversityDiscussionRepliesReplyLike/${user.user_id}/${replies_reply_id}/`)
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
   axiosInstance.post(`${ipaddress}/UniversityDiscussionRepliesReplyDisLike/${user.user_id}/${replies_reply_id}/`)
   .then((r)=>{
    console.log("University Replies reply disliked",r.data)
    getreplies_for_reply(disc_replyid)
   })
   .catch(()=>{
    console.log("University replies reply dislike error")
   })
  }
 
 //  ----------------------Functionality to like the reply under particular comment in the discussion---------------------------------------------------------
 
  function handleReplyLike(discussion_id,discid,index) {
    axiosInstance.post(`${ipaddress}/UniversityDiscussionReplyLikesView/${user.user_id}/${discussion_id}/`)
    .then((r)=>{
     // console.log("User liked the Reply",r.data)
     getreplies(discid,index)
    })
    .catch(()=>{
     // console.log("User Reply like error")
    })
   }
 
 // -----------------------------This function is used to edit the post under university discussion--------------------------------------------------------
 
 const[editedpost,setEditedpost]=useState("")
 const[discussionId,setdiscussionId]=useState(0)
 
 const editpostfunctionData=(value)=>{
   setEditedpost(value)
 }
 
 const editPosts=(discid)=>{
   setdiscussionId(discid)
   const foundDiscussion = searchedComments.find((x) => discid === x.id);
 
   if (foundDiscussion) {
     setEditedpost(foundDiscussion.discussion);
   }
 }
 
 const sendEditedData =() => {
   const user = JSON.parse(sessionStorage.getItem('user'));
   const formData = new FormData();
   formData.append('discussion', editedpost);
 
   axiosInstance.put(`${ipaddress}/UniversityDiscussionDelete/${user.user_id}/${discussionId}/`,formData)
  .then((r)=>{
   // console.log("Post Edited Successfully",r.data)
   searchcomments()
   setCount((prev)=>prev+1)
   toast.success('Post Updated Successfully',{
    autoClose:2000,
  })
 setindex1(-1)
  })
  .catch(()=>{
   // console.log("Post Editing Error")
  })
   
 }
 
 // ----------------------------------Function to get the replies for the particular post----------------------------------------------------------------
 const[fetchedreplies,setFetchedreplies]=useState([])
 const getreplies=(discussion_id,index)=>{
   axiosInstance.get(`${ipaddress}/UniversityDiscussionReply/${user.user_id}/${user.university_id}/${discussion_id}/`)
   .then((r)=>{
     console.log("University Replies fetched successfully",r.data)
     setFetchedreplies(r.data.reverse())
   })
 }
 
 // ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
 const[fetchedreplies_for_reply,setFetchedreplies_for_reply]=useState([])
 const[replies_for_reply_status,setreplies_for_reply_status]=useState(false)
 
 const getreplies_for_reply=(particular_reply_id)=>{
   axiosInstance.get(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${particular_reply_id}/`)
   .then((r)=>{
     console.log("University Replies under reply fetched successfully",r.data)
     setFetchedreplies_for_reply(r.data.reverse())
     // setCount(count+1)
   })
 }
 
 // ----------------------------------------To Delete the post under discussion--------------------------------------------------------
 const deletePost=(discussion_id)=>{
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionDelete/${user.user_id}/${discussion_id}/`)
   .then((r)=>{
     // console.log("Post Successfully Deleted")
   searchcomments()
   setCount((prev)=>prev+1)
   toast.success('Post Deleted',{
    autoClose:2000,
  })
 setindex1(-1)
   })
   .catch(()=>{
     // console.log("Post Delete Error")
   })
 }
 
 // -------------------------------To Delete the reply under specific post in the discussion--------------------------------------------------------
 
 const deleteReply=(disc_reply_id,discid)=>{
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionReply/${user.user_id}/${discid}/${disc_reply_id}/`)
   .then((r)=>{
     // console.log("University Reply Successfully Deleted",r.data)
   searchcomments()
   setCount((prev)=>prev+1)
   toast.success('Reply Deleted',{
    autoClose:2000,
  })
 getreplies(discid)
   })
   .catch(()=>{
     // console.log("Reply Delete Error")
   })
 }
 
 // -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------
 
 const deleteReply_for_reply=(reply_reply_id,disc_reply_id,discid)=>{
   axiosInstance.delete(`${ipaddress}/UniversityDiscussionRepliesRepliesView/${user.user_id}/${user.university_id}/${reply_reply_id}/`)
   .then((r)=>{
     console.log("Replies reply deleted successfully",r.data)
     toast.success('Reply Deleted',{
      autoClose:2000,
    })
 getreplies(discid)
 getreplies_for_reply(disc_reply_id)
   })
   .catch((err)=>{
     console.log("Replies reply Delete Error",err)
   })
 }

  // -------------------------------------------PINNING COMMENTS------------------------------------------------------------
const pincomment=(discId)=>{
  axiosInstance.post(`${ipaddress}/UniversityPinnedCommentsView/${user.user_id}/${discId}/${user.university_id}/`)
  .then((r)=>{
    console.log("Pinned Successfully",r.data)
    if(r.data.message==='Message already followed'){
      const toastLiveExample = document.getElementById('liveToast')
      document.getElementById('toastbody').style.color="blue"
      document.getElementById('toastbody').textContent="Comment Already Followed !!!"
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()
  setindex1(-1)
    }
    else{
      searchcomments()
      setCount((prev)=>prev+1)
      toast.success('Followed successfully',{
        autoClose:2000,
      })
  setindex1(-1)
    }
  })
  }

 // ---------------------------------------------------UNPIN COMMENT-------------------------------------------------------
 const unpin=(discid)=>{
  axiosInstance.delete(`${ipaddress}/UniversityPinnedCommentsView/${user.user_id}/${discid}/${user.university_id}/`)
  .then((r)=>{
    console.log("UnPinned Successfully",r.data)
    toast.success('Post Unfollowed',{
      autoClose:2000,
    })
    searchcomments()
    setCount((prev)=>prev+1)
  })
  .catch(()=>{
    console.log("Unpinning error")
  })
  }

  return (
    <div className={`${searchvalue.length>0 ? '':'d-none'}`}>
        <h6 className={`text-center ${searchedComments.length>0 ? 'd-none':'py-3'}`} style={{color:'#5d5fe3',fontSize:'15px'}}>No Matched Comments available ...💬</h6>
        <h6 className={`${searchedComments.length>0 ? 'py-2':'d-none'}`} style={{color:'#5d5fe3',fontSize:'15px'}}>💬 Searched Comments</h6>

         {searchedComments.length>0 && (
         searchedComments.map((x,index)=>{
          return(
            <div key={index} style={{zIndex:4}}>
            <div className='col-12 px-3 pe-4 pt-2 pb-3 rounded shadow-sm border mb-3 bg-white'>
              <div className="row border-bottom py-3 m-0 align-items-center">
                <div className="col-2 col-md-1 px-1 px-lg-0 d-flex justify-content-center">
                <img src={x.user_id.profile_pic} className={x.user_id.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
        <p className={x.user_id.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{x.user_id.nickname.slice(0,1)}</span><span>{x.user_id.nickname.slice(-1)}</span></p>
    
                </div>
                <div className={`col-7 p-0 ${x.pinned_status ? ' col-md-8':'col-md-9'}`} onClick={()=>{
                    setindex1(-1)
                  }} >
                  <h6 className='ms-sm-0 my-0 discussion_name'>
                    <Link to={`/profile/${x.user_id.user_id}`} className="text-decoration-none text-dark">{x.user_id.nickname}</Link>
                  <span className='fw-normal ms-2 text-secondary' style={{fontSize:'13px'}}>{x.created_at}</span>
                  </h6>
                    <p className='ms-sm-0 my-0 d-flex align-items-center' style={{fontSize:'12px',color:'#8587EA'}}>{user.university_name}  <span className={`ms-2 edit ${x.edited ? '':'d-none'}`}>Edited</span></p>
                </div>
                <div className={`col-2 d-flex align-items-center p-0 ${x.pinned_status ? 'col-md-3 justify-content-between':'col-md-2 justify-content-end'}`} style={{position:'relative'}}>

  {/* --------------------------------------------Unfollow comment------------------------------------------------------ */}
  <button data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Unfollow" onClick={()=>{
  unpin(x.id)
  }} className={`p-1 btn btn-sm border px-2 ${x.pinned_status ? '':'d-none'}`} style={{cursor:'pointer'}}><i className="fa-solid fa-link-slash d-md-none d-inline"></i><span className='d-none d-md-inline'>Followed</span></button>

  
                <span className="border-0" type="button" style={{cursor:'pointer'}} onClick={()=>{
                  if(index1==index)
                  setindex1(-1)
                else
                  setindex1(index)
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M17.5 27.0354C17.099 27.0354 16.7557 26.8926 16.4701 26.607C16.1845 26.3214 16.0417 25.9781 16.0417 25.5771C16.0417 25.176 16.1845 24.8327 16.4701 24.5471C16.7557 24.2615 17.099 24.1187 17.5 24.1187C17.9011 24.1187 18.2444 24.2615 18.53 24.5471C18.8156 24.8327 18.9584 25.176 18.9584 25.5771C18.9584 25.9781 18.8156 26.3214 18.53 26.607C18.2444 26.8926 17.9011 27.0354 17.5 27.0354ZM17.5 18.9585C17.099 18.9585 16.7557 18.8157 16.4701 18.5301C16.1845 18.2445 16.0417 17.9012 16.0417 17.5001C16.0417 17.0991 16.1845 16.7558 16.4701 16.4702C16.7557 16.1846 17.099 16.0418 17.5 16.0418C17.9011 16.0418 18.2444 16.1846 18.53 16.4702C18.8156 16.7558 18.9584 17.0991 18.9584 17.5001C18.9584 17.9012 18.8156 18.2445 18.53 18.5301C18.2444 18.8157 17.9011 18.9585 17.5 18.9585ZM17.5 10.8815C17.099 10.8815 16.7557 10.7388 16.4701 10.4532C16.1845 10.1676 16.0417 9.82424 16.0417 9.42318C16.0417 9.02214 16.1845 8.67882 16.4701 8.39323C16.7557 8.10764 17.099 7.96484 17.5 7.96484C17.9011 7.96484 18.2444 8.10764 18.53 8.39323C18.8156 8.67882 18.9584 9.02214 18.9584 9.42318C18.9584 9.82424 18.8156 10.1676 18.53 10.4532C18.2444 10.7388 17.9011 10.8815 17.5 10.8815Z" fill="#2A3941"/>
  </svg>
      </span>
                <ul className={`bg-white shadow-sm border rounded mt-0 p-0 px-3 ${ index1==index ? '':'d-none'}`} style={{width:'160px',position:'absolute',right:'26px',top:'0px'}}>
      <button className={x.user_id.nickname !=user.nickname || x.created_at.includes("day") || x.created_at.includes("week") || x.created_at.includes("year") ? 'd-none' : 'd-flex allign-items-center bg-transparent border-0 my-2'} data-bs-toggle="modal" data-bs-target="#editModal" onClick={()=>{
                  editPosts(x.id)
                }} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black"/>
              </svg></span><span className="ms-2">{translate_value.common_words.edit}</span></button>
              <button className={`bg-transparent border-0 my-2 ${x.pinned_status ? 'd-none':'d-flex align-items-center'}`} onClick={()=>{
               pincomment(x.id)
              }} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin" viewBox="0 0 16 16">
              <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"/>
            </svg></span> <span className="ms-2">Follow</span></button>
  
  {/* ----------------------------------------------------Report button--------------------------------------------------- */}
  <button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-none':'d-flex align-items-center'}`} 
  onClick={()=>{
    setreport_id(x.id)
    setreport_status(true)
  }} style={{height:'20px'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#2A3941"/>
              </svg></span> <span className="ms-2">Report</span></button>
              
              <button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-flex align-items-center':'d-none'}`} style={{height:'20px',color:'#FF845D'}}><span className='dropdownmenu'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
                <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D"/>
              </svg></span> <span className="ms-2">Reported</span></button>
  
                <button className={`bg-transparent border-0 my-2 ${user.user_id===x.user_id.user_id ? 'd-flex align-items-center':'d-none'}`}  onClick={()=>{
                  deletePost(x.id)
                }} style={{height:'20px'}}><span className='dropdownmenu'> <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
                <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
              </svg></span><span className="ms-2">{translate_value.common_words.delete}</span></button>
      </ul>
    
  {/* ---------------------------------------Edit post section (Edit the Post for 24 hours)--------------------------------------------- */}
    
    <div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-body">
            <div className=' bg-white px-3 pt-2 pb-3 rounded'>
              <h6 className='pb-2 ps-1'>Edit the Post</h6>
              <div className='d-flex gap-3'>
              <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
          {userdetails.nickname!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
                <div className="input-group bg-light rounded pe-3 border">
                      <input
                        type="text"
                        name="question"
                        onChange={(e)=>editpostfunctionData(
                          e.target.value
                        )}
                        value={editedpost}
                        className="form-control bg-transparent py-3 ps-3 shadow-none border-0" placeholder="Ask a question....."
                        style={{position:'relative'}}/>
                        <button data-bs-dismiss="modal" disabled={editedpost.length>0 ? false:true} onClick={()=>{
                  sendEditedData(x.id)
                }} className='text-secondary bg-transparent border-0'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 23.125V6.875L24.2789 15L5 23.125ZM6.25 21.25L21.0625 15L6.25 8.75V13.6058L12.3077 15L6.25 16.3942V21.25Z" fill="#8E9696"/>
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
              <div onClick={()=>{
                    setindex1(-1)
                  }}  className='py-2 ms-1 pt-3'>
                <p className='m-0 discussion_post' id={x.id}>{x.discussion}</p>
                {x.images_attached &&(
                  x.images_attached.map((z)=>{
                    return(
                      <div className='d-flex justify-content-center'>
                        <img src={z.image} width={300} alt="" className='mt-3'/>
                      </div>
                    )
                  })
                )}
                
              </div>
    <div onClick={()=>{
                    setindex1(-1)
                  }}  className='d-flex justify-content-between border-bottom pt-3 pb-4 ps-2'>
      <div className="d-flex align-items-center">
       <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: x.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
                  if(x.liked_status==true){
                    handleLike1(x.id)
                  }
                  else{
                    handleLike(x.id)
                  }
                }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor"/>
              </svg> <span style={{fontSize:'14px',fontWeight:500,lineHeight:'22px'}} className="ms-1">{x.likes_count}</span></button>
            
            <button className='bg-transparent border-0 ms-4 d-flex align-items-center' style={{height:'20px',color: x.dis_liked_status ? "#ff845d" : "gray" }} onClick={()=>{
              if(x.dis_liked_status==true){
                handledislike1(x.id)
              }
              else{
                handledislike(x.id)
              }
            }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor"/>
            </svg></button>
                </div>
    {x.replies_count>0 
    && (
      <div className="w-75 d-flex justify-content-end">
        <div className="d-flex">
        <button className='ms-4 bg-transparent border-0 fw-bold' style={{color:'#5D5FE3',fontSize:'14px'}} onClick={(e)=>{
        setreplies_status(!replies_status)
        getreplies(x.id,index)
        console.log(fetchedreplies.length)
      }}>{translate_value.dashboard.view_all} {x.replies_count} {translate_value.dashboard.replies}</button>
      <div  className="ms-2 comment-section-img" style={{position:'relative'}}>
       </div>
        </div>
      </div>
    )
    }
    </div>
    
    {/* --------------------------------Replies section for the particular comment-------------------------------------- */}
  
    {fetchedreplies && fetchedreplies.length > 0 && ( 
    <div className={fetchedreplies[0].udisid == x.id && replies_status ? 'd-block':'d-none'}>
    {fetchedreplies.map((y,index2)=>{
    
      return(
        <div key={index2} className='ps-0 ps-md-3 py-2 mt-3 bg-white' onClick={()=>{
          setindex1(-1)
        }} >
    <div className="row w-100 align-items-center">
      <div className="col-2 col-md-1 d-flex justify-content-center">
      <img src={y.user_id.profile_pic} className={y.user_id.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
        <p className={y.user_id.profile_pic ==null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{fontSize:'14px',height:'30px',width:'30px'}}><span>{y.user_id.nickname.slice(0,1)}</span><span>{y.user_id.nickname.slice(-1)}</span></p>
      </div>
      <div className="col-7 col-lg-8 ps-0 p-0">
        <h6 className='ms-sm-0 my-0' style={{fontSize:'12px'}}>
        <Link to={`/profile/${y.user_id.user_id}`} className="text-decoration-none text-dark">{y.user_id.nickname}</Link>
        </h6>
          <p className='ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.created_at}</p>
      </div>
      <div className="col-3 col-lg-3 px-3 p-0 d-flex justify-content-between align-items-center">
      <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.status ? "#ff845d" : "gray" }} onClick={()=>{
        if(y.status==true){
          handleReplyLike1(y.id,x.id,index)
        }
        else{
          handleReplyLike(y.id,x.id,index)
        }
      }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor"/>
      </svg> <span className="ms-1">{y.likes_count}</span></button>
      <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.dis_like_status ? "#ff845d" : "gray" }} onClick={()=>{
              if(y.dis_like_status==true){
                handlereplydislike1(y.id,x.id,index)
              }
              else{
                handlereplydislike(y.id,x.id,index)
              }
            }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor"/>
            </svg></button>
      <button className={user.first_name === y.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'}  onClick={()=>{
        deleteReply(y.id,x.id)
      }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#8E9696"/>
    </svg></button>
      </div>
    </div>
    <div className='ps-0 ps-lg-5 mt-2 m-0'>
    <p className='m-0' style={{fontSize:'14px',color:'#8e9696'}}>{y.post}</p>
    {y.images_attached.map((a)=>{
        return(
          <div className='d-flex justify-content-center'>
            <img src={a.university_discussion_reply_images} width={300} alt="" className='mt-3'/>
          </div>
        )
      })}
    
    {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
    <div className="mt-2 ps-0">
    <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal1" onClick={()=>{
      setdiscuss_id(x.id)
      setreply_id(y.id)
    }} style={{cursor:'pointer'}} className="reply_for_reply fw-bold d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z" fill="#2A3941"/>
  </svg> <span className="ms-1">reply</span></span>
  
  <p style={{cursor:'pointer'}} className={`view_reply_for_reply mt-2 ${y.replies_count>0 ? '':'d-none'}`} onClick={()=>{
    setreplies_for_reply_status(!replies_for_reply_status)
  getreplies_for_reply(y.id)
  }}>---View {y.replies_count} replies</p>
  
  {fetchedreplies_for_reply && fetchedreplies_for_reply.length > 0 && ( 
    <div className={fetchedreplies_for_reply[0].reply == y.id && replies_for_reply_status ? 'd-block':'d-none'}>
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
          handleReplies_reply_like(z.id,y.id)
      }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
      <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor"/>
      </svg> <span className="ms-1" style={{fontSize:'14px'}}>{z.likes}</span></button>
      <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: z.dis_liked_status ? "#ff845d" : "gray" }} onClick={()=>{
                handlereplies_replydislike(z.id,y.id)
            }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 30" fill="none">
            <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor"/>
            </svg></button>
      <button className={user.first_name === z.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'}  onClick={()=>{
        deleteReply_for_reply(z.id,y.id,x.id)
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
            <img src={b.university_discussion_reply_reply_images} width={300} alt="" className='mt-3'/>
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
  
      <div onClick={()=>{
                    setindex1(-1)
                  }}  className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center'>
               <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={40} height={40} alt="" />
          {userdetails.nickname!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
                <div className="input-group border rounded pe-3 bg-light">
                      <input key={index}
                        type="text"
                        // name={post}
                        onChange={repliesData}
                        className="form-control py-3 ps-3 shadow-none border-0 bg-light reply-input4" placeholder={translate_value.dashboard.reply_here}
                        style={{position:'relative'}}/>
                        <div className='d-flex align-items-center bg-light'>
                        <input
                        id="file4"
                        type='file'
                        name='file'
                        accept="image/*"
                        multiple
                        onChange={handleReplyImage4}
                      className="bg-light text-center p-3 btn"
                    />
                    <label data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Attach Image"
                      htmlFor="file4"
                      className="custom-file-input bg-transparent border-0 px-4 py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M21.6827 19.4231C21.6827 21.3164 21.0304 22.9276 19.7259 24.2565C18.4214 25.5855 16.8261 26.25 14.9399 26.25C13.0536 26.25 11.4543 25.5855 10.1418 24.2565C8.82928 22.9276 8.17303 21.3164 8.17303 19.4231V8.50962C8.17303 7.1875 8.62776 6.0637 9.53722 5.13822C10.4467 4.21274 11.5625 3.75 12.8846 3.75C14.2067 3.75 15.3225 4.21274 16.2319 5.13822C17.1414 6.0637 17.5961 7.1875 17.5961 8.50962V18.8462C17.5961 19.5801 17.34 20.2123 16.8279 20.7428C16.3157 21.2732 15.6915 21.5385 14.9553 21.5385C14.2191 21.5385 13.5857 21.2774 13.0553 20.7552C12.5248 20.2331 12.2596 19.5967 12.2596 18.8462V8.46153H13.5096V18.8462C13.5096 19.2452 13.6462 19.5853 13.9194 19.8666C14.1927 20.1478 14.5288 20.2885 14.9278 20.2885C15.3269 20.2885 15.663 20.1478 15.9363 19.8666C16.2095 19.5853 16.3461 19.2452 16.3461 18.8462V8.48556C16.3413 7.51442 16.0074 6.69071 15.3445 6.01444C14.6815 5.33815 13.8616 5 12.8846 5C11.9154 5 11.0961 5.34215 10.4269 6.02644C9.75765 6.71073 9.42303 7.53846 9.42303 8.50962V19.4231C9.41824 20.9663 9.9527 22.2816 11.0264 23.369C12.1001 24.4563 13.4075 25 14.9486 25C16.4679 25 17.7594 24.4563 18.8229 23.369C19.8865 22.2816 20.4231 20.9663 20.4327 19.4231V8.46153H21.6827V19.4231Z" fill="#8E9696"/>
  </svg>
                    </label>
                      <button disabled={replies.length>0 ? false:true}
      onClick={() => {
        postReplies(x.id,index);
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
  
  {/* ------------------------------To display the selected images before posting reply--------------------------------------- */}
           
           <div onClick={()=>{
                    setindex1(-1)
                  }}  className='d-flex gap-3 mt-3'>
            {repliesImage4.length > 0 &&
              repliesImage4.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} width={60} alt={`Selected Image ${index + 1}`} />
              ))
            }
          </div>
            </div>
        </div>
          )
        })
      )}

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
                    id="fileInput4"
                    type='file'
                    name='file'
                    accept="image/*"
                    multiple
                    onChange={handleReply_reply_Image4}
                    className="bg-light text-center p-3 btn"
                  />
                  <label data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Attach Image"
                    htmlFor="fileInput4"
                    className="custom-file-input bg-transparent border-0 px-4 py-2">
                    <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
                  </label>
                    <button data-bs-dismiss="modal" disabled={reply_for_reply.length>0 ? false:true} onClick={postreply_for_replies} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' >
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
          {replies_reply_Image4.length > 0 &&
            replies_reply_Image4.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} width={60} alt={`Selected Image ${index + 1}`} />
            ))
          }
        </div>
            
          </div>
        </div>
      </div>
    </div>
    </div>
    <Report_post disc_type={"university"} setCount={setCount} setindex1={setindex1} report_status={report_status} setreport_status={setreport_status} discussion_id={report_id}/>

    </div>
  )
}

export default University_search_comments