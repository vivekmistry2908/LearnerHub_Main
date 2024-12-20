import React from 'react'
import { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ipaddress, ipaddress2 } from '../App'
import { Context } from '../context/Context_provider'
import { useContext } from 'react'
import axiosInstance from '../pages/axiosInstance'

const Offcanvases = ({count}) => {

    const navigate=useNavigate()

    const {translate_value}=useContext(Context)
    const[count1,setcount1]=useState(0)
    const[studylists,setStudylists]=useState([])
    const[userdetails,setUserdetails]=useState({})
    const[group_visible,setgroup_visible]=useState(false)

    const[flashcardstudylists,setflashcardStudylists]=useState([])

    const user=JSON.parse(sessionStorage.getItem('user'))

    const getFlashcardStudylist=()=>{
      axiosInstance.get(`${ipaddress2}/FlashcardStudylistSection/${user.user_id}/`)
      .then((r)=>{
          console.log("Flashcard Study Lists Fetched",r.data)
          setflashcardStudylists(r.data.data)
      })
  }

  // To fetch all the document based study lists
  const getStudylist=()=>{
    axiosInstance.get(`${ipaddress}/GetStudyListCategories/${user.user_id}/`)
    .then((r)=>{
        // console.log("Study Lists Fetched",r.data)
        setStudylists(r.data)
    })
}

    useEffect(()=>{
  
        axiosInstance.get(`${ipaddress}/UserUpdateDetails/${user.user_id}/`)
        .then((r)=>{
          // console.log("User Details fetched Successfully", r.data)
          setUserdetails(r.data)
        })
        .catch(()=>{
          // console.log("User Details Fetching Error")
        })
  
        axiosInstance.get(`${ipaddress}/CoursesView/${user.user_id}/`)
        .then((r) => {
          console.log("Joines",r.data)
          setJoinedCourses(r.data.joined_courses);
          console.log("courses:",r.data)
        })
        .catch(() => {
          // console.log("Joined courses fetching error in Offcanvas");
        });
  
      axiosInstance.get(`${ipaddress}/ParticularUserGroup/${user.user_id}/`)
        .then((r) => {
          console.log("Group Details Suceessfully Fetched",r.data)
          setJoinedGroups(r.data.user_joined_groups);
          setUnseenMessages(r.data.unseen_messages);
          setJoinedpublicgroups(r.data.user_joined_public_groups)
        })
        .catch(() => {
          // console.log("Group details fetching error");
        })
  
        getStudylist()
        // setActive(activevalue)
      },[count,count1])
  


    const [joinedCourses, setJoinedCourses] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [joinedpublicgroups, setJoinedpublicgroups] = useState([]);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [messagelength, setMessagelength] = useState(0);
  
    const [groups,setGroups]=useState("opengroups")
  
  const removeunseenmessages=(course_id,course_name)=>{
    joinedCourses.map((x)=>{
      if(x.course_id===course_id){
        // console.log("Course ID is ",x.course_id)
    axiosInstance.post(`${ipaddress}/CourseMessagesSeenView/${user.user_id}/${course_id}/`,x.discussion_ids)
  .then((r)=>{
    console.log("Successfully seen",r.data)
    // console.log(x.discussion_ids)
    // setCount1(count1+1)
    navigate(`/subjects/${course_id}/${course_name}`)
  })
  .catch((err)=>{
    // console.log("Errorrrrrrrr",err)
  })
        // navigate(`/subjects/${course_id}/${course_name}`)
        // setVisible(false)
      }
    })
  }

  // ------------------------------------------To remove unseen messages count for private groups-------------------------------------------
const removeprivategroupunseenmessages=(group_id,group_name)=>{
  joinedGroups.map((x)=>{
    if(x.group_id===group_id){
      console.log("Group ID is ",x.group_id)
      axiosInstance.post(`${ipaddress}/SeenMessageView/${user.user_id}/${group_id}/`,x.unseen_messages_ids)
.then((r)=>{
  console.log("Private group messages Successfully seen",r.data)
  navigate(`/groupchat/privategroup/${group_id}`)
  setcount1(count1+1)
})
.catch((err)=>{
  // console.log("Errorrrrrrrr",err)
})
}
  })
}

// ------------------------------------------To remove unseen messages count for public groups-------------------------------------------
const removepublicgroupunseenmessages=(group_id,group_name)=>{

  joinedpublicgroups.map((x)=>{
    if(x.group_id===group_id){
      axiosInstance.post(`${ipaddress}/SeenMessageView/${user.user_id}/${group_id}/`,x.unseen_messages_ids)
.then((r)=>{
  console.log("Public Group Messages Successfully seen",r.data)
  navigate(`/groupchat/opengroup/${group_id}`)
  setcount1(count1+1)
  setgroup_visible(false)
})
.catch((err)=>{
  console.log(" Public Group Messages seen error",err)
}) 
    }
  })
}
  
  // --------------------------------------------Flashcard Studylist functionalities-----------------------------------------

const[studylisttype,setStudylisttype]=useState("document")
const[flashsets_studylist,setFlashsets_studylist]=useState([])

// --------------------------------------------Function to create new Studylists----------------------------------------------
const [allstudylists, setallstudylists] = useState([]);
const[status,setStatus]=useState(false)

const getallStudylist=()=>{
    axiosInstance.get(`${ipaddress}/GetStudyListCategories/${user.user_id}/`)
    .then((r)=>{
        console.log("Study Lists",r.data)
        setallstudylists(r.data)
    })
}
  
  return (
    <div>
        {/* -------------------------------------------------COURSE OFFCANVAS FOR SMALLER SCREENS---------------------------------- */}
      <div className="offcanvas offcanvas-start"data-bs-scroll="true" tabindex="-1" id="courseOffcanvas" aria-labelledby="courseOffcanvasLabel" style={{width:'390px'}}>
  <div className="offcanvas-body p-0" >
    <div className='text-end px-2 bg-light'>
        <button className='bg-transparent border-0' data-bs-dismiss="offcanvas"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg></button>
    </div>
    <div className='px-2 py-3 bg-light d-flex justify-content-between align-items-center'>
    <p className='m-0'>Modules ({joinedCourses.length})</p> <button className='btn btn-sm' style={{border:'1px solid #5D5FE3'}}><Link to='/courses' className='text-decoration-none' style={{color:'#5D5FE3'}}><i className="fa-solid fa-plus me-2"></i>Add Module</Link></button>
    </div>
            <ul className='p-0 mt-2 px-2' style={{listStyleType:'none'}}>
            {joinedCourses && (
                  joinedCourses.map((x,index)=>{
                    return(
                      <li data-bs-dismiss="offcanvas" key={index} className='mt-2 py-3 border-bottom px-2 px-lg-3'>
                      <span onClick={()=>{
                        removeunseenmessages(x.course_id,x.course_name)
                      }} className='text-decoration-none text-dark' style={{fontSize:'16px',cursor:'pointer',fontWeight:450,lineHeight:'22px',letterSpacing:'0.32px'}}>{x.course_name} 
                      <span className={`text-white ms-1 ${x.notification_count>0 ? '':'d-none'}`} style={{backgroundColor:'#FF845D',fontSize:'13px',paddingTop:'3px',paddingBottom:'3px',paddingLeft:'6px',paddingRight:'6px',borderRadius:'50%'}}>{x.notification_count}</span>
                      </span>
                      <div className='mt-1'>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.16357 15.513V14.1412C2.16357 13.7544 2.26373 13.4219 2.46405 13.1436C2.66437 12.8653 2.93357 12.6428 3.27166 12.4763C3.99448 12.1322 4.71219 11.8578 5.42478 11.6532C6.13739 11.4486 6.99477 11.3463 7.99691 11.3463C8.99905 11.3463 9.85642 11.4486 10.569 11.6532C11.2816 11.8578 11.9993 12.1322 12.7222 12.4763C13.0602 12.6428 13.3294 12.8653 13.5298 13.1436C13.7301 13.4219 13.8302 13.7544 13.8302 14.1412V15.513H2.16357ZM15.4969 15.513V14.1027C15.4969 13.6198 15.3992 13.164 15.2037 12.7352C15.0082 12.3064 14.7309 11.9385 14.3719 11.6315C14.7811 11.7149 15.1753 11.8305 15.5546 11.9785C15.9339 12.1265 16.3089 12.2929 16.6796 12.4777C17.0407 12.6593 17.3238 12.8918 17.529 13.175C17.7341 13.4582 17.8367 13.7675 17.8367 14.1027V15.513H15.4969ZM7.99691 9.48733C7.30941 9.48733 6.72087 9.24253 6.23128 8.75295C5.7417 8.26337 5.49691 7.67483 5.49691 6.98733C5.49691 6.29981 5.7417 5.71126 6.23128 5.22168C6.72087 4.7321 7.30941 4.4873 7.99691 4.4873C8.68441 4.4873 9.27295 4.7321 9.76253 5.22168C10.2521 5.71126 10.4969 6.29981 10.4969 6.98733C10.4969 7.67483 10.2521 8.26337 9.76253 8.75295C9.27295 9.24253 8.68441 9.48733 7.99691 9.48733ZM14.0546 6.98733C14.0546 7.67483 13.8098 8.26337 13.3202 8.75295C12.8307 9.24253 12.2421 9.48733 11.5546 9.48733C11.5194 9.48733 11.4745 9.48332 11.42 9.47531C11.3655 9.46729 11.3206 9.45848 11.2854 9.44887C11.5677 9.1031 11.7846 8.71953 11.9362 8.29814C12.0878 7.87675 12.1636 7.43915 12.1636 6.98533C12.1636 6.53152 12.0842 6.09789 11.9256 5.68443C11.7669 5.27097 11.5535 4.88475 11.2854 4.52576C11.3302 4.50975 11.3751 4.49933 11.42 4.49451C11.4649 4.48971 11.5097 4.4873 11.5546 4.4873C12.2421 4.4873 12.8307 4.7321 13.3202 5.22168C13.8098 5.71126 14.0546 6.29981 14.0546 6.98733ZM2.99691 14.6796H12.9969V14.1412C12.9969 13.9456 12.948 13.7747 12.8503 13.6283C12.7525 13.482 12.577 13.342 12.3238 13.2085C11.702 12.8762 11.0466 12.6217 10.3575 12.4448C9.66838 12.268 8.88152 12.1796 7.99691 12.1796C7.1123 12.1796 6.32543 12.268 5.63632 12.4448C4.94723 12.6217 4.29178 12.8762 3.66999 13.2085C3.41678 13.342 3.2413 13.482 3.14353 13.6283C3.04578 13.7747 2.99691 13.9456 2.99691 14.1412V14.6796ZM7.99691 8.65399C8.45524 8.65399 8.8476 8.4908 9.17399 8.16441C9.50038 7.83802 9.66357 7.44566 9.66357 6.98733C9.66357 6.52899 9.50038 6.13663 9.17399 5.81024C8.8476 5.48385 8.45524 5.32066 7.99691 5.32066C7.53857 5.32066 7.14621 5.48385 6.81982 5.81024C6.49343 6.13663 6.33024 6.52899 6.33024 6.98733C6.33024 7.44566 6.49343 7.83802 6.81982 8.16441C7.14621 8.4908 7.53857 8.65399 7.99691 8.65399Z" 
            fill="#ff845d"/>
            </svg> <span className='ms-1 text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>{x.students_count} Students</span></span>
            
            <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.08341 14.5833H12.9167V13.75H7.08341V14.5833ZM7.08341 11.25H12.9167V10.4167H7.08341V11.25ZM5.51289 17.5C5.12935 17.5 4.80911 17.3715 4.55216 17.1146C4.29522 16.8576 4.16675 16.5374 4.16675 16.1539V3.84615C4.16675 3.4626 4.29522 3.14236 4.55216 2.88542C4.80911 2.62847 5.12935 2.5 5.51289 2.5H12.0834L15.8334 6.25V16.1539C15.8334 16.5374 15.7049 16.8576 15.448 17.1146C15.1911 17.3715 14.8708 17.5 14.4873 17.5H5.51289ZM11.6667 6.66667V3.33333H5.51289C5.3847 3.33333 5.26718 3.38675 5.16033 3.49358C5.0535 3.60043 5.00008 3.71795 5.00008 3.84615V16.1539C5.00008 16.282 5.0535 16.3996 5.16033 16.5064C5.26718 16.6132 5.3847 16.6667 5.51289 16.6667H14.4873C14.6155 16.6667 14.733 16.6132 14.8398 16.5064C14.9467 16.3996 15.0001 16.282 15.0001 16.1539V6.66667H11.6667Z" fill="#ff845d"/>
            </svg><span className='ms-1 text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>{x.documents_count} Documents</span></span>
                        <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#ff845d"/>
            </svg> <span className='ms- text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>
            {x.public_flashsets_count} Flashsets</span></span>
                      </div>
                      </li>
                    )
                  })
                )}
   </ul>
  </div>
</div>

{/* --------------------------------------------------GROUP OFFCANVAS FOR SMALLER SCREENS---------------------------------- */}
      <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="groupOffcanvas" aria-labelledby="groupOffcanvasLabel">
        <div className="offcanvas-body p-0 w-100">
          <div className="text-end bg-light px-2">
            <button data-bs-dismiss="offcanvas" className='bg-transparent border-0'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg></button>
          </div>
        <div>
        <div className='d-flex justify-content-between bg-light py-3 align-items-center px-2 px-md-3'>
              <h6 className='w-50 d-flex justify-content-center py-2' onClick={()=>{
                setGroups("opengroups")
              }}  style={{cursor:'pointer', color:groups==='opengroups' ? '#fff' : '',borderRadius:'5px 0px 0px 5px',backgroundColor:groups==='opengroups' ? '#5D5FE3':'',border:'1px solid #5D5FE3'}}>{translate_value.group.open_groups}</h6>
              <h6 className='w-50 d-flex justify-content-center py-2' onClick={()=>{
                setGroups("privategroups")
              }} style={{cursor:'pointer', color:groups==='privategroups' ? '#fff' : '',borderRadius:'0px 5px 5px 0px',backgroundColor:groups==='privategroups' ? '#5D5FE3':'',border:'1px solid #5D5FE3'}}>{translate_value.group.private_group}</h6>
              {/* <button className='btn border border-primary-subtle px-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{height:'44px',color:'#8587EA',fontSize:'19px'}}>Join</button> */}
            </div>
            <div className={groups==="opengroups" ? 'd-block' : 'd-none'}>
            <div className='px-3 px-lg-5 mt-3'>
              <Link className='btn px-5 py-2 w-100' data-bs-dismiss="offcanvas" onClick={()=>{
                navigate('/groups/opengroup')
              }} style={{color:'#2A3941',border:'1px solid #2A3941',fontWeight:450,letterSpacing:'0.32px',lineHeight:'22px'}}>{translate_value.group.join_group}</Link>
            </div>
          <div>
                <ul className='p-0 mt-3 px-2' style={{listStyleType:'none'}}>
                {joinedpublicgroups && (
                  joinedpublicgroups.map((x,index)=>{
                    return(
                      <li data-bs-dismiss="offcanvas" key={index} style={{cursor:'pointer'}} className='mt-1 py-3 border-bottom px-2 px-lg-3'>
                      <span data-bs-dismiss="offcanvas" onClick={()=>{
                        removepublicgroupunseenmessages(x.group_id,x.group_name)
                      }} className='text-decoration-none text-dark' style={{fontSize:'16px',fontWeight:450,lineHeight:'normal',letterSpacing:'0.32px'}}>{x.group_name} <span className={`text-white rounded-circle px-1 ${x.unseen_count>0 ? '':'d-none'}`} style={{backgroundColor:'#FF845D',height:'20px',width:'20px',fontSize:'13px'}}>{x.unseen_count}</span></span>
                      <div className='mt-1 d-flex align-items-center'>
                        <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.16345 15.513V14.1412C2.16345 13.7544 2.26361 13.4219 2.46393 13.1436C2.66425 12.8653 2.93345 12.6428 3.27154 12.4763C3.99435 12.1322 4.71206 11.8578 5.42466 11.6532C6.13727 11.4486 6.99465 11.3463 7.99679 11.3463C8.99892 11.3463 9.8563 11.4486 10.5689 11.6532C11.2815 11.8578 11.9992 12.1322 12.722 12.4763C13.0601 12.6428 13.3293 12.8653 13.5296 13.1436C13.73 13.4219 13.8301 13.7544 13.8301 14.1412V15.513H2.16345ZM15.4968 15.513V14.1027C15.4968 13.6198 15.399 13.164 15.2036 12.7352C15.0081 12.3064 14.7308 11.9385 14.3718 11.6315C14.781 11.7149 15.1752 11.8305 15.5545 11.9785C15.9337 12.1265 16.3088 12.2929 16.6795 12.4777C17.0406 12.6593 17.3237 12.8918 17.5288 13.175C17.734 13.4582 17.8365 13.7675 17.8365 14.1027V15.513H15.4968ZM7.99679 9.48733C7.30929 9.48733 6.72074 9.24253 6.23116 8.75295C5.74158 8.26337 5.49679 7.67483 5.49679 6.98733C5.49679 6.29981 5.74158 5.71126 6.23116 5.22168C6.72074 4.7321 7.30929 4.4873 7.99679 4.4873C8.68429 4.4873 9.27283 4.7321 9.76241 5.22168C10.252 5.71126 10.4968 6.29981 10.4968 6.98733C10.4968 7.67483 10.252 8.26337 9.76241 8.75295C9.27283 9.24253 8.68429 9.48733 7.99679 9.48733ZM14.0545 6.98733C14.0545 7.67483 13.8097 8.26337 13.3201 8.75295C12.8305 9.24253 12.242 9.48733 11.5545 9.48733C11.5192 9.48733 11.4744 9.48332 11.4199 9.47531C11.3654 9.46729 11.3205 9.45848 11.2852 9.44887C11.5675 9.1031 11.7845 8.71953 11.9361 8.29814C12.0877 7.87675 12.1635 7.43915 12.1635 6.98533C12.1635 6.53152 12.0841 6.09789 11.9255 5.68443C11.7668 5.27097 11.5534 4.88475 11.2852 4.52576C11.3301 4.50975 11.375 4.49933 11.4199 4.49451C11.4647 4.48971 11.5096 4.4873 11.5545 4.4873C12.242 4.4873 12.8305 4.7321 13.3201 5.22168C13.8097 5.71126 14.0545 6.29981 14.0545 6.98733ZM2.99679 14.6796H12.9968V14.1412C12.9968 13.9456 12.9479 13.7747 12.8502 13.6283C12.7524 13.482 12.5769 13.342 12.3237 13.2085C11.7019 12.8762 11.0465 12.6217 10.3574 12.4448C9.66826 12.268 8.8814 12.1796 7.99679 12.1796C7.11217 12.1796 6.32531 12.268 5.6362 12.4448C4.9471 12.6217 4.29166 12.8762 3.66987 13.2085C3.41666 13.342 3.24117 13.482 3.14341 13.6283C3.04566 13.7747 2.99679 13.9456 2.99679 14.1412V14.6796ZM7.99679 8.65399C8.45512 8.65399 8.84748 8.4908 9.17387 8.16441C9.50026 7.83802 9.66345 7.44566 9.66345 6.98733C9.66345 6.52899 9.50026 6.13663 9.17387 5.81024C8.84748 5.48385 8.45512 5.32066 7.99679 5.32066C7.53845 5.32066 7.14609 5.48385 6.8197 5.81024C6.49331 6.13663 6.33012 6.52899 6.33012 6.98733C6.33012 7.44566 6.49331 7.83802 6.8197 8.16441C7.14609 8.4908 7.53845 8.65399 7.99679 8.65399Z" fill="#FF845D"/>
            </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.member_count} Members</span></span>
                        <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF845D" className="bi bi-geo-alt" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg><span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.city}</span></span>

            <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff845d" className="bi bi-tags" viewBox="0 0 16 16">
  <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/>
  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>
</svg><span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.category}</span></span>
                      </div>
                      </li>
                    )
                  })
                )}
               </ul>
          </div>
            </div>

{/* -------------------------------------PRIVATE GROUPS--------------------------------------------------- */}
    <div className={groups==="privategroups" ? 'd-block' : 'd-none'}>
      <div className='d-flex justify-content-between px-2 px-lg-5 mt-3'>
              <span data-bs-dismiss="offcanvas" onClick={()=>{
                navigate('/groups/privategroup')
              }} className='btn px-5 py-2 w-100' style={{color:'#2A3941',border:'1px solid #2A3941'}}>{translate_value.group.create_group}</span>
            </div>
          
          <div>
              <ul className='p-0 mt-3 px-2' style={{listStyleType:'none'}}>
              {joinedGroups && (
                joinedGroups.map((x,index)=>{
                  return(
                    <li data-bs-dismiss="offcanvas" style={{cursor:'pointer'}} key={index} className='mt-1 py-3 border-bottom px-2 px-lg-3'>
                    <span data-bs-dismiss="offcanvas" onClick={()=>{
                      removeprivategroupunseenmessages(x.group_id,x.group_name)
                    }} className='text-decoration-none text-dark'>{x.group_name} <span className={`text-white rounded-circle px-1 ${x.unseen_messages_count>0 ? '':'d-none'}`} style={{backgroundColor:'#FF845D',height:'20px',width:'20px',fontSize:'13px'}}>{x.unseen_messages_count}</span></span>
                    <div className='mt-1 d-flex'>
                      <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.16345 15.513V14.1412C2.16345 13.7544 2.26361 13.4219 2.46393 13.1436C2.66425 12.8653 2.93345 12.6428 3.27154 12.4763C3.99435 12.1322 4.71206 11.8578 5.42466 11.6532C6.13727 11.4486 6.99465 11.3463 7.99679 11.3463C8.99892 11.3463 9.8563 11.4486 10.5689 11.6532C11.2815 11.8578 11.9992 12.1322 12.722 12.4763C13.0601 12.6428 13.3293 12.8653 13.5296 13.1436C13.73 13.4219 13.8301 13.7544 13.8301 14.1412V15.513H2.16345ZM15.4968 15.513V14.1027C15.4968 13.6198 15.399 13.164 15.2036 12.7352C15.0081 12.3064 14.7308 11.9385 14.3718 11.6315C14.781 11.7149 15.1752 11.8305 15.5545 11.9785C15.9337 12.1265 16.3088 12.2929 16.6795 12.4777C17.0406 12.6593 17.3237 12.8918 17.5288 13.175C17.734 13.4582 17.8365 13.7675 17.8365 14.1027V15.513H15.4968ZM7.99679 9.48733C7.30929 9.48733 6.72074 9.24253 6.23116 8.75295C5.74158 8.26337 5.49679 7.67483 5.49679 6.98733C5.49679 6.29981 5.74158 5.71126 6.23116 5.22168C6.72074 4.7321 7.30929 4.4873 7.99679 4.4873C8.68429 4.4873 9.27283 4.7321 9.76241 5.22168C10.252 5.71126 10.4968 6.29981 10.4968 6.98733C10.4968 7.67483 10.252 8.26337 9.76241 8.75295C9.27283 9.24253 8.68429 9.48733 7.99679 9.48733ZM14.0545 6.98733C14.0545 7.67483 13.8097 8.26337 13.3201 8.75295C12.8305 9.24253 12.242 9.48733 11.5545 9.48733C11.5192 9.48733 11.4744 9.48332 11.4199 9.47531C11.3654 9.46729 11.3205 9.45848 11.2852 9.44887C11.5675 9.1031 11.7845 8.71953 11.9361 8.29814C12.0877 7.87675 12.1635 7.43915 12.1635 6.98533C12.1635 6.53152 12.0841 6.09789 11.9255 5.68443C11.7668 5.27097 11.5534 4.88475 11.2852 4.52576C11.3301 4.50975 11.375 4.49933 11.4199 4.49451C11.4647 4.48971 11.5096 4.4873 11.5545 4.4873C12.242 4.4873 12.8305 4.7321 13.3201 5.22168C13.8097 5.71126 14.0545 6.29981 14.0545 6.98733ZM2.99679 14.6796H12.9968V14.1412C12.9968 13.9456 12.9479 13.7747 12.8502 13.6283C12.7524 13.482 12.5769 13.342 12.3237 13.2085C11.7019 12.8762 11.0465 12.6217 10.3574 12.4448C9.66826 12.268 8.8814 12.1796 7.99679 12.1796C7.11217 12.1796 6.32531 12.268 5.6362 12.4448C4.9471 12.6217 4.29166 12.8762 3.66987 13.2085C3.41666 13.342 3.24117 13.482 3.14341 13.6283C3.04566 13.7747 2.99679 13.9456 2.99679 14.1412V14.6796ZM7.99679 8.65399C8.45512 8.65399 8.84748 8.4908 9.17387 8.16441C9.50026 7.83802 9.66345 7.44566 9.66345 6.98733C9.66345 6.52899 9.50026 6.13663 9.17387 5.81024C8.84748 5.48385 8.45512 5.32066 7.99679 5.32066C7.53845 5.32066 7.14609 5.48385 6.8197 5.81024C6.49331 6.13663 6.33012 6.52899 6.33012 6.98733C6.33012 7.44566 6.49331 7.83802 6.8197 8.16441C7.14609 8.4908 7.53845 8.65399 7.99679 8.65399Z" fill="#FF8A65"/>
          </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.member_count} Students</span></span>
                      <span className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.08335 14.5833H12.9167V13.75H7.08335V14.5833ZM7.08335 11.25H12.9167V10.4167H7.08335V11.25ZM5.51283 17.5C5.12929 17.5 4.80905 17.3715 4.5521 17.1146C4.29516 16.8576 4.16669 16.5374 4.16669 16.1539V3.84615C4.16669 3.4626 4.29516 3.14236 4.5521 2.88542C4.80905 2.62847 5.12929 2.5 5.51283 2.5H12.0834L15.8334 6.25V16.1539C15.8334 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51283ZM11.6667 6.66667V3.33333H5.51283C5.38464 3.33333 5.26712 3.38675 5.16027 3.49358C5.05344 3.60043 5.00002 3.71795 5.00002 3.84615V16.1539C5.00002 16.282 5.05344 16.3996 5.16027 16.5064C5.26712 16.6132 5.38464 16.6667 5.51283 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65"/>
          </svg><span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.document_count} Documents</span></span>
                      <span className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#FF8A65"/>
                    </svg> <span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.flashset_count} Flashcards</span></span>
                     
                    </div>
                    </li>
                  )
                })
              )}
             </ul>
          </div>
            </div>
        </div>

        </div>
      </div>


{/* --------------------------------------------------STUDYIST OFFCANVAS FOR SMALLER SCREENS---------------------------------- */}
<div className="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="studylistcanvas" aria-labelledby="studylistcanvasLabel">
        <div className="offcanvas-body p-0 w-100">
          <div className="d-flex justify-content-between align-items-center bg-light px-2 py-3">
            <p className='m-0'>Study List</p>
            <button data-bs-dismiss="offcanvas" className='bg-transparent border-0'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg></button>
          </div>
        <div>


        <div className='d-flex bg-light py-2 align-items-center px-3' >
              <h6 style={{cursor:'pointer',color:studylisttype==="document" ? '#fff':'',borderRadius:'5px 0px 0px 5px',backgroundColor:studylisttype==="document" ? '#5D5FE3':'',border:'1px solid #5D5FE3'}} className='w-50 d-flex justify-content-center py-2' onClick={()=>{
                setStudylisttype("document")
              }}>Document</h6>
              <h6 style={{cursor:'pointer',color:studylisttype==="flashcard" ? '#fff':'',borderRadius:'0px 5px 5px 0px',backgroundColor:studylisttype==="flashcard" ? '#5D5FE3':'',border:'1px solid #5D5FE3'}} onClick={()=>{
                getFlashcardStudylist()
                setStudylisttype("flashcard")
              }} className='w-50 d-flex justify-content-center py-2'>Flashcard</h6>

              {/* <Link className='btn px-3 py-2 text-decoration-none ms-auto d-flex align-items-center' to='/courses' style={{color:'#8587EA',fontSize:'15px',border:'1px solid #8587EA'}}>Create Study List</Link> */}
            </div>

{/* ----------------------------------------------Document Studylist Section--------------------------------------------- */}
            <div>
                <ul className={`p-0 px-2 ${studylisttype==="document" ? '':'d-none'}`} style={{listStyleType:'none',height:'80%',overflowY:studylists.length>5 ? 'scroll':'none'}}>
                {studylists && (
                  studylists.map((x)=>{
                    return(
                      <>
                        <li data-bs-dismiss="offcanvas" className='mb-2 py-3 border-bottom px-2 px-lg-3'>
            <Link to={`/studylist/${x.id}`} className='text-decoration-none text-dark' style={{fontSize:'16px',cursor:'pointer',letterSpacing:'0.32px',lineHeight:'normal',fontWeight:450}}>{x.study_list_name}</Link>
            <div className='mt-1'>
              <span className=''><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.08333 14.5833H12.9167V13.75H7.08333V14.5833ZM7.08333 11.25H12.9167V10.4167H7.08333V11.25ZM5.51281 17.5C5.12927 17.5 4.80903 17.3715 4.55208 17.1146C4.29514 16.8576 4.16667 16.5374 4.16667 16.1539V3.84615C4.16667 3.4626 4.29514 3.14236 4.55208 2.88542C4.80903 2.62847 5.12927 2.5 5.51281 2.5H12.0833L15.8333 6.25V16.1539C15.8333 16.5374 15.7049 16.8576 15.4479 17.1146C15.191 17.3715 14.8707 17.5 14.4872 17.5H5.51281ZM11.6667 6.66667V3.33333H5.51281C5.38462 3.33333 5.2671 3.38675 5.16025 3.49358C5.05342 3.60043 5 3.71795 5 3.84615V16.1539C5 16.282 5.05342 16.3996 5.16025 16.5064C5.2671 16.6132 5.38462 16.6667 5.51281 16.6667H14.4872C14.6154 16.6667 14.7329 16.6132 14.8398 16.5064C14.9466 16.3996 15 16.282 15 16.1539V6.66667H11.6667Z" fill="#FF8A65"/>
  </svg><span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.document_count} Documents</span></span>
            </div>
            </li>
                      </>
                    )
                  })
                )}
     </ul>
            </div>

{/* ----------------------------------------------Flashcards Studylist Section------------------------------------------- */}

<div>
  {/* {loading ? (<Small_Preloader/>):( */}
    <ul className={`p-0 px-2 ${studylisttype==="flashcard" ? '':'d-none'}`} style={{listStyleType:'none',height:'80%',overflowY:flashcardstudylists.length>5 ? 'scroll':'none'}}>
    {flashcardstudylists && (
      flashcardstudylists.map((x)=>{
        return(
          <>
            <li data-bs-dismiss="offcanvas" className='mb-2 py-3 border-bottom px-2 px-lg-3'>
<Link to={`/flashcard_studylist/${x.id}`} className='text-decoration-none text-dark' style={{fontSize:'17px',cursor:'pointer'}}>{x.study_list_name}</Link>
<div className='mt-1'>
  <span className=''><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#FF8A65"/>
</svg><span className='ms-1 text-secondary text-decoration-underline' style={{fontSize:'13px'}}>{x.flashset_count} Flashsets</span></span>
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

        </div>
      </div>

    </div>
  )
}

export default Offcanvases
