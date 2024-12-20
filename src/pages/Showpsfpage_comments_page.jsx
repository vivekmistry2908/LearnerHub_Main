import React from 'react'
import { useState,useEffect } from 'react'
import { ipaddress } from '../App'
import { Context } from '../context/Context_provider'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from './axiosInstance'
import { getAccessToken } from './authService'
import * as bootstrap from 'bootstrap';


const Showpdfpage_user_comments = ({pinnedcomments_status,id,count,setCount,discussionpagelayout, getdiscussion, editPosts, pincomment, moveToCoordinate}) => {

  const {translate_value}=useContext(Context)

    const user=JSON.parse(sessionStorage.getItem('user'))
    const[report_status,setreport_status]=useState(false)
    const[pinnedComments, setpinnedcomments]=useState([])
  const[userdetails,setUserdetails]=useState({})
  const[index1,setindex1]=useState(-1)
  const[report_id,setreport_id]=useState()
  let[post,setComment]=useState()
  const[dropdownstate,setdropdownstate]=useState(false)
  const userdata=user
  const[reply_layout_status,setreply_layout_status]=useState(false)

useEffect(()=>{
     // To fetch user details
     axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
     .then((r)=>{
      //  console.log("User Details fetched Successfully", r.data)
       setUserdetails(r.data)
     })
     .catch(()=>{
       console.log("User details fetching error")
     })


    getpinnedcomments()
},[count])

const getpinnedcomments=()=>{
    axiosInstance.get(`${ipaddress}/documentdiscussionpinningview/${user.user_id}/${id}/`)
    .then((r)=>{
      // console.log("User's pinned comments",r.data)
        setpinnedcomments(r.data.reverse())
    })
}

// ---------------------------------------------------Post Replies for the particular comment-------------------------------------------------------
 
const[replies,setReplies]=useState(" ")
  const repliesData=(e)=>{
    setReplies(e.target.value)
  }
  const [replyImage2, setReplyImage2] = useState([]);

  const handleReplyImage2 = async (event) => {
    const files = event.target.files;

    // Ensure that 'files' is not null or undefined
    if (files && files.length > 0) {
      setReplyImage2(Array.from(files));
    } else {
      setReplyImage2([]);
    }
  };

  const clearInput = (index) => {
    const inputElement = document.getElementsByClassName('reply-input');
    if (inputElement) {
      inputElement[index].value = '';
    }
  };
const postReplies=async(dis_id,index)=>{
  const user=JSON.parse(sessionStorage.getItem('user'))

  const formData = new FormData();
  // formData.append('user_id',user.pk)
  // formData.append('ddpid',dis_id)
  // formData.append('post',replies)

  for (const file of replyImage2) {
    if (file.size <= 1024 * 1024) {
      formData.append('image', file);
    } else {
      console.error('File size exceeds 1 MB:', file.name);
      alert("Image size limit exceeds")
    }
  }
  
  const encoded_reply=encodeURIComponent(replies)
  
  try {
    const token=getAccessToken()

    const response = await fetch(`${ipaddress}/DocCommentsRepliesNewView/${user.user_id}/${dis_id}/""/?post=${encoded_reply}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.ok) {
        // console.log('Document Reply Sent successfully');
        setCount(count+1)
        clearInput(index)
        setReplyImage2([])
        setreply_layout_status(false)
    } else {
        console.error('Failed to Sent Document Replies');
    }
} catch (error) {
    console.error('Error uploading files:', error);
}   


}


// --------------------Functionality to post replies under a reply---------------------------------------------------------
const[reply_id,setreply_id]=useState(0)
const[discuss_id,setdiscuss_id]=useState(0)
const[reply_index,setreply_index]=useState(0)
const[replies_for_reply_status,setreplies_for_reply_status]=useState(false)
const [replies_reply_Image2, setReplies_reply_image2] = useState([]);
const[reply_for_reply,setReply_for_reply]=useState("")
const clearInput2 = (index) => {
  const inputElement = document.getElementsByClassName('reply-input2');
  if (inputElement) {
    inputElement[index].value = '';
  }
};

const handleReply_reply_Image2 = (event) => {
  const files=event.target.files
     // Ensure that 'files' is not null or undefined
  if (files && files.length > 0) {
    setReplies_reply_image2(Array.from(files));
  } else {
    setReplies_reply_image2([]);
  }
};
const postreply_for_replies= async ()=>{
  const user=JSON.parse(sessionStorage.getItem('user'))
  const formData = new FormData();
        for (const file of replies_reply_Image2) {
            formData.append('images_attached', file);
        }

  const encoded_reply_reply=encodeURIComponent(reply_for_reply)

        try {
          const token=getAccessToken()
          
          const response = await fetch(`${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${reply_id}/""/?post=${encoded_reply_reply}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: formData,
          });

          if (response.ok) {
              // console.log('Document Reply for reply Sent successfully',response.data);
              setReply_for_reply("")
              getreplies(discuss_id)
              setreplies_for_reply_status(false)
      setReplies_reply_image2([])
          } else {
              console.error('Document Reply under reply sending error');
          }
      } catch (error) {
          console.error('Error reply uploading files:', error);
      }
}


// ---------------------------------------------------DISCUSSION LIKES-----------------------------------------------------
function handleLike1(discussion_id) {
  axiosInstance.delete(`${ipaddress}/DocumentCommentsLikes/${user.user_id}/${discussion_id}/`)
  .then((r)=>{
  //  console.log("User Unliked the Post Successfully",r.data)
   getdiscussion()
  })
  .catch(()=>{
   // console.log("User Unlike error")
  })
 }
 function handleLike(discussion_id) {
   axiosInstance.post(`${ipaddress}/DocumentCommentsLikes/${user.user_id}/${discussion_id}/`)
   .then((r)=>{
    // console.log("User liked the Post Successfully",r.data)
    getdiscussion()
   //  setCount(count+1)
   })
   .catch(()=>{
   //  console.log("User like error")
   })
  }
 
 //  ----------------------------------------Document comment dislike functionality---------------------------------------
 function handledislike(discussion_id) {
   axiosInstance.post(`${ipaddress}/doc_comments_dis_likes_view/${user.user_id}/${discussion_id}/`)
   .then((r)=>{
    // console.log("User disliked the Post Successfully",r.data)
    getdiscussion()
   //  setCount(count+1)
   })
   .catch(()=>{
    console.log("User dislike error")
   })
  }
 
 // ----------------------------------------------------Reply Likes------------------------------------------------------
 
 function handleReplyLike1(discussion_reply_id,discid,index) {
   axiosInstance.delete(`${ipaddress}/CommentRepliesLikes/${userdata.user_id}/${discussion_reply_id}/`)
   .then((r)=>{
   //  console.log("User Unliked the Reply",r.data)
    getdiscussion()
    getreplies(discid,index)
   })
   .catch(()=>{
   //  console.log("User Reply Unlike error")
   })
  }
  function handleReplyLike(discussion_reply_id,discid,index) {
    axiosInstance.post(`${ipaddress}/CommentRepliesLikes/${userdata.user_id}/${discussion_reply_id}/`)
    .then((r)=>{
     // console.log("User liked the Reply",r.data)
     getdiscussion()
     getreplies(discid,index)
    })
    .catch(()=>{
     // console.log("User Reply like error")
    })
   }
 
     //  ----------------------Functionality to like the reply under particular reply in the discussion---------------------------------------------------------
 
 function handleReplies_reply_like(replies_reply_id,disc_replyid) {
   axiosInstance.post(`${ipaddress}/adocumentpostrepliesreplieslikesanddislikes/${user.user_id}/${replies_reply_id}/`)
   .then((r)=>{
    console.log("User liked the Replies reply",r.data)
    getreplies_for_reply(disc_replyid)
   })
   .catch((err)=>{
    console.log("User Replies reply like error",err)
   })
  }
 
 //  -----------------------------Functionality to dislike the reply under particular reply----------------------------------
 function handlereplies_replydislike(replies_reply_id,disc_replyid) {
   axiosInstance.patch(`${ipaddress}/adocumentpostrepliesreplieslikesanddislikes/${user.user_id}/${replies_reply_id}/`)
   .then((r)=>{
    console.log("University Replies reply disliked",r.data)
    getreplies_for_reply(disc_replyid)
   })
   .catch(()=>{
    console.log("University replies reply dislike error")
   })
  }
 
 
 
   //  ----------------------------------------Document reply dislike functionality---------------------------------------
 function handlereplydislike(reply_id,discussion_id,index) {
   axiosInstance.post(`${ipaddress}/DocumentReplyDisLikeView/${user.user_id}/${reply_id}/`)
   .then((r)=>{
    console.log("User disliked the reply Successfully",r.data)
    getreplies(discussion_id,index)
   //  setCount(count+1)
   })
   .catch(()=>{
    console.log("User reply dislike error")
   })
  }


// -----------------------------------------DELETE THE DOCUMENT DISCUSSION POST---------------------------------------------------------------
const deletePost=(discussion_id)=>{
  axiosInstance.post(`${ipaddress}/documentcommentdelete/${discussion_id}/`)
  .then((r)=>{
    console.log("Post Successfully Deleted")
    setCount(count+1)
    const toastLiveExample = document.getElementById('liveToast');
    document.getElementById('toastbody').style.color="green"
    document.getElementById('toastbody').textContent = 'Post successfully deleted';
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    setdropdownstate(false)
  })
  .catch(()=>{
    console.log("Post Delete Error")
  })
}

// --------------------------------------To delete the reply under discussion------------------------------------------------

const deleteReply=(disc_reply_id,discid,index)=>{
  axiosInstance.delete(`${ipaddress}/documentcommentreplydelete/${disc_reply_id}/`)
  .then((r)=>{
    // console.log("Document Reply Successfully Deleted",r.data)
    getdiscussion()
    const toastLiveExample = document.getElementById('liveToast');
    document.getElementById('toastbody').style.color="green"
    document.getElementById('toastbody').textContent = 'Reply successfully deleted';
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    getreplies(discid,index)
  })
  .catch(()=>{
    // console.log("Document Reply Delete Error")
  })
}

// -------------------------------To Delete the reply under specific reply in the discussion--------------------------------------------------------

const deleteReply_for_reply=(reply_reply_id,disc_reply_id,discid)=>{
  axiosInstance.delete(`${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${reply_reply_id}/`)
  .then((r)=>{
    console.log("Replies reply deleted successfully",r.data)
    const toastLiveExample = document.getElementById('liveToast')
    document.getElementById('toastbody').textContent="Reply Successfully Deleted"
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
toastBootstrap.show()
getreplies(discid)
getreplies_for_reply(disc_reply_id)
  })
  .catch((err)=>{
    console.log("Replies reply Delete Error",err)
  })
}


// -----------------------------To get the Document Replies based on the discussion post----------------------------------
const[fetchedreplies,setFetchedreplies]=useState([])
const getreplies=(discid,index)=>{
  axiosInstance.get(`${ipaddress}/adocumentcommentsreplies/${discid}/${user.user_id}/`)
  .then((r)=>{
    console.log("Replies Successfully Fetched",r.data)
    setFetchedreplies(r.data.reverse())
  })
}

// ----------------------------------Function to get the replies for the particular reply----------------------------------------------------------------
const[fetchedreplies_for_reply,setFetchedreplies_for_reply]=useState([])

const getreplies_for_reply=(particular_reply_id)=>{
  axiosInstance.get(`${ipaddress}/adocumentpostrepliesreplies/${user.user_id}/${particular_reply_id}/`)
  .then((r)=>{
    console.log("Course Replies under reply fetched successfully",r.data)
    setFetchedreplies_for_reply(r.data.reverse())
    // setCount(count+1)
  })
}


// -----------------------------------------Unpin the comments which are pinned----------------------------------------------------

  const unpin=(discid)=>{
    const formdata1=new FormData()
    formdata1.append('discid',discid)
  axiosInstance.delete(`${ipaddress}/unpindocumentcomments/${user.user_id}/${id}/${discid}/`)
  .then((r)=>{
      setCount((prev)=>prev+1)
      const toastLiveExample = document.getElementById('liveToast')
      document.getElementById('toastbody').style.color="green"
      document.getElementById('toastbody').textContent="Comment Unfollowed Successfully !!!"
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastBootstrap.show()
  })
  }


  return (
    <div className={`${pinnedcomments_status ? '':'d-none'}`}>
      <h6 className={`text-center py-2 ${pinnedComments.length>0 ? 'd-none':''}`} style={{color:'#5d5fe3'}}>No followed comments available...</h6>
        {pinnedComments.length>0  && (
        <div>
    <h6 style={{color:'#5d5fe3'}} className={`${pinnedComments.length>0 ? '':'d-none'}`}>Followed Comments</h6>
    {pinnedComments.map((x,index)=>{
       return(
         <div className='mb-3' key={index}>
         <div className='col-12 bg-white px-3 pt-2 pb-3 rounded border'>
           <div className="row align-items-center">
             <div className="col-1" onClick={()=>{
              setindex1(-1)
             }}>
             <img src={x.user.profile_pic} className={x.user.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
      {x.user.nickname!=undefined ? (<p className={x.user.profile_pic ==null ? 'bg-info text-white rounded-circle my-auto d-flex align-items-center justify-content-center' : 'd-none'} style={{fontSize:'16px',height:'30px',width:'30px'}}><span>{x.user.nickname.slice(0,1)}</span><span>{x.user.nickname.slice(-1)}</span></p>):(<></>)} 
             </div>
             <div className={`${discussionpagelayout ? 'col-9':'col-8 ms-lg-3'}`} onClick={()=>{
              setindex1(-1)
             }}>
             <Link to={`/profile/${x.user.user_id}`} className='ms-3 ms-sm-0 my-0 fw-medium text-dark text-decoration-none' style={{fontSize:'14px'}}>{x.user.nickname}
                </Link>
                 <p className='ms-3 ms-sm-0 my-0' style={{fontSize:'12px'}}>{x.comment.created_on}</p>
             </div>
             <div className="col-2 pe-2 d-flex justify-content-end p-0">
 
             <div className="btn-group dropstart">
             <span className="border-0" type="button" style={{position:'relative'}} onClick={()=>{
               setdropdownstate(true)
                 if(index1==index)
                 setindex1(-1)
               else
                 setindex1(index)
               }}>
             <i className="fa-solid fa-ellipsis"></i>
   </span>
   <ul className={`bg-white border shadow-sm mt-0 p-0 ps-3 rounded ${index1===index && dropdownstate ? '':'d-none'}`} style={{width:'150px',position:'absolute',left:'-160px'}}>
   <button className={x.user.nickname !=user.nickname || x.comment.created_on.includes("day") || x.comment.created_on.includes("week") || x.comment.created_on.includes("year") ? 'd-none':'d-block bg-transparent border-0 my-2 d-flex align-items-center'} data-bs-toggle="modal" data-bs-target="#editModal" onClick={()=>{
               editPosts(x.comment.ddpid)
             }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
             <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
           </svg> <span className="ms-2" style={{fontSize:'14px'}}>Edit</span></button>
             <button className='bg-transparent border-0 d-flex align-items-center my-2' onClick={()=>{
               pincomment(x.comment.ddpid)
             }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin" viewBox="0 0 16 16">
             <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"/>
           </svg> <span className="ms-2" style={{fontSize:'14px'}}>Follow</span></button>

{/* ----------------------------------------------------Report button--------------------------------------------------- */}
<button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-none':'d-flex align-items-center'}`} 
onClick={()=>{
  setreport_id(x.comment.ddpid)
  setreport_status(true)
}} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#2A3941"/>
            </svg> <span className="ms-2">Report</span></button>
            
            <button className={`bg-transparent border-0 my-2 ${x.reported_status ? 'd-flex align-items-center':'d-none'}`} style={{height:'20px',color:'#FF845D'}}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 35 35" fill="none">
              <path d="M17.4997 23.9505C17.754 23.9505 17.9671 23.8645 18.1391 23.6925C18.3111 23.5205 18.3971 23.3073 18.3971 23.0531C18.3971 22.7988 18.3111 22.5856 18.1391 22.4136C17.9671 22.2416 17.754 22.1556 17.4997 22.1556C17.2454 22.1556 17.0322 22.2416 16.8602 22.4136C16.6882 22.5856 16.6023 22.7988 16.6023 23.0531C16.6023 23.3073 16.6882 23.5205 16.8602 23.6925C17.0322 23.8645 17.2454 23.9505 17.4997 23.9505ZM16.7705 19.6316H18.2288V10.7694H16.7705V19.6316ZM12.6479 29.1668L5.83301 22.3651V12.6484L12.6347 5.8335H22.3514L29.1663 12.6352V22.3519L22.3646 29.1668H12.6479ZM13.2705 27.7085H21.7288L27.708 21.7293V13.271L21.7288 7.29183H13.2705L7.29134 13.271V21.7293L13.2705 27.7085Z" fill="#FF845D"/>
            </svg> <span className="ms-2">Reported</span></button>
              <button className={`bg-transparent border-0 my-2 ${user.user_id===x.user.user_id ? 'd-flex align-items-center':'d-none'}`}  onClick={()=>{
               deletePost(x.comment.ddpid)
             }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
           </svg><span className="ms-2" style={{fontSize:'14px'}}>Delete</span></button>
   </ul>
   </div>
             
             </div>
           </div>
           <div className='py-2' onClick={()=>{
              setindex1(-1)
             }}>
             <p className='m-0'>{x.comment.post}</p>
             {x.comment.images_attached.map((z)=>{
             return(
               <div>
                 <img src={z.image} width={300} className="mt-3 img-fluid" alt="" />
               </div>
             )
           })}
           </div>
           
 
 {/* -------------------------------Likes, dislikes and View all comments layout---------------------------------------- */}
 <div className="border-bottom pt-3 pb-3" onClick={()=>{
              setindex1(-1)
             }}>
 <div className='d-flex justify-content-between'>
     <div className="d-flex align-items-center">
      <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: x.status ? "#ff845d" : "gray",fontSize:'17px'}} onClick={()=>{
                 if(x.status==true){
                   handleLike1(x.comment.ddpid)
                 }
                 else{
                   handleLike(x.comment.ddpid)
                 }
               }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
               <path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z" fill="currentColor"/>
             </svg><span style={{fontSize:'14px'}}>{x.likes}</span></button>
      
      {/* -------------------------------------------------Dislike Button----------------------------------------------- */}
      <button className='bg-transparent border-0 ms-4 d-flex align-items-center' style={{height:'20px',color: x.dis_like_status ? "red" : "gray" }} onClick={()=>{
              handledislike(x.comment.ddpid)
           }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
           <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor"/>
         </svg></button>
               </div>
   {x.replies_count>0 
   && (
     <div className="w-75 d-flex justify-content-end">
       <div className="d-flex">
       <button className='ms-4 bg-transparent border-0 fw-bold' style={{color:'#5D5FE3',fontSize:'13px'}} onClick={(e)=>{
       setreply_layout_status(!reply_layout_status)
       getreplies(x.comment.ddpid,index)
     }}>View All {x.replies_count} Comments</button>
     {/* <div  className="ms-2 comment-section-img" style={{position:'relative'}}>
       {x.liked_users.slice(0,5).map((a,index)=>{
         return(
           <>
            <img src="http://localhost:3000/static/media/man.ba3e9327f074cac4e49e.png" width={24} style={{left:`${index*20}px`,position:"absolute",top:'-2px'}} alt="" />
           </>
         )
       })}
       </div> */}
       </div>
     </div>
   )
   }
   </div>

  {/* ---------------------------------See mark button------------------------------------- */}
  {
           x.comment.docmid && (
             <div className=" mt-4 px-2">
             <button onClick={()=>{
               moveToCoordinate(x.comment.docmid.markup_location.x,x.comment.docmid.markup_location.y)
             }} className="btn btn-sm w-100 py-2" style={{backgroundColor:'#F3F0FF',color:'#5D5FE3',border:'1px solid #5D5FE3',fontWeight:500,fontSize:'16px',letterSpacing:'0.32px',lineHeight:'22px'}}>View Mark</button>
             </div>
           )
           }
 </div>
 
   {/* --------------------------------Replies section for the particular comment-------------------------------------- */}
   {fetchedreplies && fetchedreplies.length > 0 && ( 
   <div className={fetchedreplies[0].ddpid == x.comment.ddpid && reply_layout_status ? 'd-block':'d-none'}>
   {fetchedreplies.map((y)=>{
   
     return(
       <div className='py-2 mt-3' onClick={()=>{
        setindex1(-1)
       }}>
   <div className="row m-0 w-100 align-items-center">
     <div className="col-1 p-0 d-flex justify-content-end">
     <img src={y.user_details.profile_pic} className={y.user_details.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
       <p className={y.user_details.profile_pic ==null ? 'bg-info text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{fontSize:'14px',height:'30px',width:'30px'}}><span>{y.user_details.nickname.slice(0,1)}</span><span>{y.user_details.nickname.slice(-1)}</span></p>
     </div>
     <div className={`col-8 ps-2 p-0 ${discussionpagelayout ? 'col-lg-9':'col-lg-8'}`}>
       <h6 className='ms-3 ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.user_details.nickname}</h6>
         <p className='ms-3 ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.created_on}</p>
     </div>
     <div className={`col-3 ${discussionpagelayout ? 'col-lg-2':'col-lg-3'} p-0 d-flex justify-content-between align-items-center`}>
     <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
       if(y.liked_status==true){
         handleReplyLike1(y.dprid,x.comment.ddpid,index)
       }
       else{
         handleReplyLike(y.dprid,x.comment.ddpid,index)
       }
     }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
     <path d="M21.8269 25.0002H9.27884V11.2502L17.1154 3.50977L17.6683 4.06267C17.7821 4.17644 17.8778 4.32228 17.9555 4.50017C18.0333 4.67805 18.0721 4.84151 18.0721 4.99055V5.18767L16.7933 11.2502H25.4808C26.0032 11.2502 26.4704 11.4561 26.8822 11.868C27.2941 12.2798 27.5 12.747 27.5 13.2694V14.8079C27.5 14.9217 27.4872 15.0459 27.4615 15.1805C27.4359 15.3151 27.4023 15.4393 27.3606 15.553L23.9471 23.6444C23.7756 24.029 23.4872 24.3511 23.0818 24.6108C22.6763 24.8704 22.258 25.0002 21.8269 25.0002ZM10.5288 23.7502H21.8269C22.0032 23.7502 22.1835 23.7021 22.3678 23.606C22.5521 23.5098 22.6923 23.3495 22.7885 23.1252L26.25 15.0002V13.2694C26.25 13.045 26.1779 12.8607 26.0337 12.7165C25.8894 12.5723 25.7051 12.5002 25.4808 12.5002H15.2404L16.6875 5.67324L10.5288 11.7838V23.7502ZM9.27884 11.2502V12.5002H5V23.7502H9.27884V25.0002H3.75V11.2502H9.27884Z" fill="currentColor"/>
   </svg>{y.like_count}</button>
     <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: y.disliked_status ? "#ff845d" : "gray" }} onClick={()=>{
      
         handlereplydislike(y.dprid,x.comment.ddpid,index)
     }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
     <path d="M8.17306 4.99983H20.7212V18.7498L12.8846 26.4902L12.3317 25.9373C12.2179 25.8236 12.1222 25.6777 12.0445 25.4998C11.9667 25.322 11.9279 25.1585 11.9279 25.0095V24.8123L13.2067 18.7498H4.51922C3.99678 18.7498 3.52963 18.5439 3.11778 18.132C2.70593 17.7202 2.5 17.253 2.5 16.7306V15.1921C2.5 15.0783 2.51282 14.9541 2.53847 14.8195C2.56409 14.6849 2.59774 14.5607 2.63941 14.447L6.05288 6.35558C6.22435 5.97097 6.51281 5.64886 6.91825 5.38923C7.32371 5.12963 7.74198 4.99983 8.17306 4.99983ZM19.4712 6.24983H8.17306C7.99679 6.24983 7.81651 6.2979 7.63222 6.39404C7.44793 6.49021 7.3077 6.65047 7.21153 6.87483L3.75 14.9998V16.7306C3.75 16.955 3.82211 17.1393 3.96634 17.2835C4.11057 17.4277 4.29486 17.4998 4.51922 17.4998H14.7596L13.3125 24.3268L19.4712 18.2162V6.24983ZM20.7212 18.7498V17.4998H25V6.24983H20.7212V4.99983H26.25V18.7498H20.7212Z" fill="currentColor"/>
   </svg></button>
     <button className={user.first_name === y.user_details.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'}  onClick={()=>{
       deleteReply(y.dprid,x.comment.ddpid,index)
     }} style={{height:'20px'}}><i className="fa-solid fa-trash-can text-secondary"></i></button>
     </div>
   </div>
   <div className='ps-0 ps-lg-5 mt-2 m-0'>
   <p className='m-0 text-secondary' style={{fontSize:'14px'}}>{y.post}</p>
   {y.image.map((a)=>{
       return(
         <div className=''>
           <img src={a.image} style={{width:'100%'}} alt="" className='mt-3'/>
         </div>
       )
     })}
   </div>

     {/* -----------------------------------------------Replies for Reply layout----------------------------------------------- */}
  <div className="mt-2 ps-0 ps-0 ps-md-5">
  <span data-bs-toggle="modal" data-bs-target="#replyforreply_modal" onClick={()=>{
    setdiscuss_id(x.comment.ddpid)
    setreply_id(y.dprid)
  }} style={{cursor:'pointer'}} className="reply_for_reply fw-bold d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M19 18.0001V15.0001C19 14.0385 18.6571 13.2148 17.9712 12.5289C17.2853 11.843 16.4615 11.5001 15.5 11.5001H5.92115L10.0212 15.6001L9.3077 16.3078L4 11.0001L9.3077 5.69238L10.0212 6.40008L5.92115 10.5001H15.5C16.7423 10.5001 17.8029 10.9395 18.6817 11.8184C19.5606 12.6972 20 13.7578 20 15.0001V18.0001H19Z" fill="#2A3941"/>
</svg> <span className="ms-1">reply</span></span>

<p style={{cursor:'pointer'}} className={`view_reply_for_reply mt-2 ${y.replies_count>0 ? '':'d-none'}`} onClick={()=>{
  setreplies_for_reply_status(!replies_for_reply_status)
getreplies_for_reply(y.dprid)
}}>---View {y.replies_count} replies</p>

{fetchedreplies_for_reply && fetchedreplies_for_reply.length > 0 && ( 
  <div className={fetchedreplies_for_reply[0].reply == y.dprid && replies_for_reply_status ? 'd-block':'d-none'}>
  {fetchedreplies_for_reply.map((z)=>{
  
    return(
      <div className={`ps-0 ${discussionpagelayout ? 'ps-md-3':'ps-md-0'} py-2 mt-3 bg-white`} onClick={()=>{
        setindex1(-1)
      }} >
  <div className="row w-100 align-items-center m-0">
    <div className="col-2 col-md-1 d-flex justify-content-center">
    <img src={z.user_id.profile_pic} className={z.user_id.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
      <p className={z.user_id.profile_pic ==null ? 'text-white rounded-circle my-auto d-flex justify-content-center align-items-center' : 'd-none'} style={{fontSize:'14px',height:'30px',width:'30px'}}><span>{z.user_id.nickname.slice(0,1)}</span><span>{z.user_id.nickname.slice(-1)}</span></p>
    </div>
    <div className={`col-7 ${discussionpagelayout ? 'col-lg-9':'col-lg-7'} ps-0 p-0`}>
      <h6 className='ms-sm-0 my-0' style={{fontSize:'12px'}}>
      <Link to={`/profile/${z.user_id.user_id}`} className="text-decoration-none text-dark">{z.user_id.nickname}</Link>
      </h6>
        <p className='ms-sm-0 my-0' style={{fontSize:'13px'}}>{y.created_at}</p>
    </div>
    <div className={`col-3 ${discussionpagelayout ? 'col-lg-2':'col-lg-3'} p-0 d-flex justify-content-between align-items-center`}>
    <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: z.liked_status ? "#ff845d" : "gray" }} onClick={()=>{
        handleReplies_reply_like(z.id,y.dprid)
    }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
    <path d="M21.8269 24.9999H9.27884V11.2499L17.1154 3.50952L17.6683 4.06243C17.7821 4.1762 17.8778 4.32203 17.9555 4.49993C18.0333 4.6778 18.0721 4.84126 18.0721 4.9903V5.18743L16.7933 11.2499H25.4808C26.0032 11.2499 26.4704 11.4559 26.8822 11.8677C27.2941 12.2796 27.5 12.7467 27.5 13.2691V14.8076C27.5 14.9214 27.4872 15.0456 27.4615 15.1802C27.4359 15.3148 27.4023 15.439 27.3606 15.5528L23.9471 23.6442C23.7756 24.0288 23.4872 24.3509 23.0818 24.6105C22.6763 24.8701 22.258 24.9999 21.8269 24.9999ZM10.5288 23.7499H21.8269C22.0032 23.7499 22.1835 23.7019 22.3678 23.6057C22.5521 23.5095 22.6923 23.3493 22.7885 23.1249L26.25 14.9999V13.2691C26.25 13.0448 26.1779 12.8605 26.0337 12.7163C25.8894 12.572 25.7051 12.4999 25.4808 12.4999H15.2404L16.6875 5.67299L10.5288 11.7836V23.7499ZM9.27884 11.2499V12.4999H5V23.7499H9.27884V24.9999H3.75V11.2499H9.27884Z" fill="currentColor"/>
    </svg> <span className="ms-1" style={{fontSize:'14px'}}>{z.like_count}</span></button>
    <button className='bg-transparent border-0 d-flex align-items-center' style={{height:'20px',color: z.dis_liked_status ? "#ff845d" : "gray" }} onClick={()=>{
              handlereplies_replydislike(z.id,y.dprid)
          }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="none">
          <path d="M8.17306 5.00007H20.7212V18.7501L12.8846 26.4905L12.3317 25.9376C12.2179 25.8238 12.1222 25.678 12.0445 25.5001C11.9667 25.3222 11.9279 25.1587 11.9279 25.0097V24.8126L13.2067 18.7501H4.51922C3.99678 18.7501 3.52963 18.5441 3.11778 18.1323C2.70593 17.7204 2.5 17.2533 2.5 16.7309V15.1924C2.5 15.0786 2.51282 14.9544 2.53847 14.8198C2.56409 14.6852 2.59774 14.561 2.63941 14.4472L6.05288 6.35582C6.22435 5.97122 6.51281 5.6491 6.91825 5.38948C7.32371 5.12987 7.74198 5.00007 8.17306 5.00007ZM19.4712 6.25007H8.17306C7.99679 6.25007 7.81651 6.29814 7.63222 6.39429C7.44793 6.49046 7.3077 6.65072 7.21153 6.87507L3.75 15.0001V16.7309C3.75 16.9552 3.82211 17.1395 3.96634 17.2837C4.11057 17.428 4.29486 17.5001 4.51922 17.5001H14.7596L13.3125 24.327L19.4712 18.2164V6.25007ZM20.7212 18.7501V17.5001H25V6.25007H20.7212V5.00007H26.25V18.7501H20.7212Z" fill="currentColor"/>
          </svg></button>
    <button className={user.first_name === z.user_id.first_name ? 'bg-transparent border-0 d-flex align-items-center' : 'd-none'}  onClick={()=>{
      deleteReply_for_reply(z.id,y.dprid,x.comment.ddpid)
    }} style={{height:'20px'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 20" fill="none">
    <path d="M3.51922 19.9996C2.95993 19.9996 2.48356 19.8029 2.09013 19.4095C1.69671 19.0161 1.5 18.5397 1.5 17.9804V2.49965H0.25V1.24965H5.25V0.288086H12.75V1.24965H17.75V2.49965H16.5V17.9804C16.5 18.5557 16.3073 19.0361 15.9219 19.4215C15.5365 19.8069 15.0561 19.9996 14.4808 19.9996H3.51922ZM15.25 2.49965H2.75V17.9804C2.75 18.2048 2.82211 18.3891 2.96634 18.5333C3.11057 18.6775 3.29486 18.7496 3.51922 18.7496H14.4808C14.6731 18.7496 14.8494 18.6695 15.0096 18.5093C15.1699 18.349 15.25 18.1727 15.25 17.9804V2.49965ZM6.25959 16.2496H7.50963V4.99965H6.25959V16.2496ZM10.4904 16.2496H11.7404V4.99965H10.4904V16.2496Z" fill="#8E9696"/>
  </svg></button>
    </div>
  </div>
  <div className={`ps-0 ps-lg-5 mt-2 m-0`}>
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
           
 {/* --------------Reply for the particular post in the discussion--------------------------- */}
 
 <div className='d-flex gap-2 mt-3 pt-3 border-secondary-subtle align-items-center' onClick={()=>{
              setindex1(-1)
             }}>
           <img src={userdetails.profile_pic} className={userdetails.profile_pic==null ? 'd-none' : 'rounded-circle'} width={30} height={30} alt="" />
    {userdetails.profile_pic!=undefined ? (<p className={userdetails.profile_pic ==null ? 'd-flex justify-content-center align-items-center bg-warning text-white rounded-circle my-auto' : 'd-none'} style={{fontSize:'14px',height:'40px',width:'40px'}}><span>{userdetails.nickname.slice(0,1)}</span><span>{userdetails.nickname.slice(-1)}</span></p>):(<></>)}
             <div className="input-group border rounded pe-3 bg-light">
                   <input key={index}
                     type="text"
                     name={post}
                     onChange={repliesData}
                     className="form-control py-3 ps-3 shadow-none border-0 bg-light reply-input" placeholder="Post your Reply..."
                     style={{position:'relative'}}/>
                     <div className='d-flex align-items-center bg-light'>
                     <input
                 id="file2"
                 type='file'
                 name='file'
                 accept="image/*"
                 multiple
                 onChange={handleReplyImage2}
                   className="bg-light text-center p-3 btn"
                 />
                 <label
                   htmlFor="file2"
                   className="custom-file-input bg-transparent border-0 px-4 py-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.0691 16.1859C18.0691 17.7637 17.5255 19.1063 16.4385 20.2138C15.3514 21.3213 14.0219 21.875 12.4501 21.875C10.8782 21.875 9.54541 21.3213 8.45166 20.2138C7.35791 19.1063 6.81104 17.7637 6.81104 16.1859V7.09135C6.81104 5.98958 7.18998 5.05308 7.94786 4.28185C8.70574 3.51062 9.63557 3.125 10.7373 3.125C11.8391 3.125 12.7689 3.51062 13.5268 4.28185C14.2847 5.05308 14.6636 5.98958 14.6636 7.09135V15.7051C14.6636 16.3168 14.4502 16.8436 14.0234 17.2857C13.5966 17.7277 13.0764 17.9487 12.4629 17.9487C11.8494 17.9487 11.3216 17.7312 10.8796 17.296C10.4375 16.8609 10.2165 16.3306 10.2165 15.7051V7.05128H11.2582V15.7051C11.2582 16.0377 11.372 16.3211 11.5997 16.5555C11.8274 16.7899 12.1075 16.9071 12.44 16.9071C12.7726 16.9071 13.0527 16.7899 13.2804 16.5555C13.5081 16.3211 13.6219 16.0377 13.6219 15.7051V7.0713C13.6179 6.26201 13.3397 5.57559 12.7872 5.01203C12.2348 4.44845 11.5515 4.16667 10.7373 4.16667C9.92965 4.16667 9.24695 4.45179 8.68924 5.02203C8.13155 5.59227 7.8527 6.28205 7.8527 7.09135V16.1859C7.84871 17.472 8.29409 18.568 9.18885 19.4742C10.0836 20.3803 11.1731 20.8333 12.4573 20.8333C13.7234 20.8333 14.7996 20.3803 15.6859 19.4742C16.5722 18.568 17.0194 17.472 17.0274 16.1859V7.05128H18.0691V16.1859Z" fill="#8E9696"/>
</svg>
                 </label>
                   <button 
   onClick={() => {
     postReplies(x.comment.ddpid,index);
   }}
 
   className='h-100 bg-transparent border-0 ms-2'
 >
 <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M4.1665 19.2707V5.729L20.2322 12.4998L4.1665 19.2707ZM5.20817 17.7082L17.5519 12.4998L5.20817 7.2915V11.338L10.2562 12.4998L5.20817 13.6617V17.7082Z" fill="#8E9696"/>
</svg>
 </button>
                     </div>
                 </div>
 </div>
 
           <div className='d-flex gap-3 mt-3'>
         {replyImage2.length > 0 &&
           replyImage2.map((image, index) => (
             <img key={index} src={URL.createObjectURL(image)} width={60} alt={`Selected Image ${index + 1}`} />
           ))
         }
       </div>
         </div>
     </div>
       )
     })}
        </div>
)}

{/* -----------------------------------------------To post the reply for reply modal------------------------------------------ */}
<div className="modal fade" id="replyforreply_modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

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
                    onChange={handleReply_reply_Image2}
                    className="bg-light text-center p-3 btn"
                  />
                  <label
                    htmlFor="fileInput3"
                    className="custom-file-input bg-transparent border-0 px-4 py-2">
                    <img src={require('../img/attachment.png')} width={22} height={22} alt="" />
                  </label>
                    <button data-bs-dismiss="modal" onClick={postreply_for_replies} className='text-secondary h-100 bg-transparent border-0 ms-2 outline-0' ><span aria-hidden="true"></span><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                  </div>
                 
            </div>
            <div className='d-flex gap-3 mt-3'>
          {replies_reply_Image2.length > 0 &&
            replies_reply_Image2.map((image, index) => (
              <img key={index} src={URL.createObjectURL(image)} width={60} alt={`Selected Image ${index + 1}`} />
            ))
          }
        </div>
            
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Showpdfpage_user_comments