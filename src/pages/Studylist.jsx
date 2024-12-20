import React from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { useState,useEffect,useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Document,Page } from 'react-pdf'
import { ipaddress } from '../App'
import Preloader from './Preloader'
import Backtotop from './Backtotop'
import { Context } from '../context/Context_provider'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';



const Studylist = () => {
  const {study_list_id}=useParams()
  let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

    const[dropdownstate,setdropdownstate]=useState(false)
    const[completedstudylists,setCompletedStudylists]=useState([])
    const[pendingstudylists,setPendingStudylists]=useState([])
    const[studylist_details,setstudylist_details]=useState({})
    const[count,setCount]=useState(0)
    const[loading,setloading]=useState(true)
    const[status,setstatus]=useState("False")


    // ----------------------------------TOOLTIP FOR BUTTONS-------------------------------------------------------------
useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Cleanup function to destroy tooltips when the component unmounts
  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    });
  };
}, []);

    const user=JSON.parse(sessionStorage.getItem('user'))
    useEffect(()=>{
  axiosInstance.get(`${ipaddress}/GetUserStudyList/${user.user_id}/${study_list_id}/`)
  .then((r)=>{
    console.log("study list Documents Fetched",r.data)
    const docs=r.data.completed.reverse()
    setCompletedStudylists(docs)
    const docs2=r.data.pending.reverse()
    setPendingStudylists(docs2)
    setstudylist_details(r.data.list_details)
    setloading(false)
  })
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Cleanup function to destroy tooltips when the component unmounts
  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    });
  };
},[count,study_list_id])

// ----------------------------------------------MARK AS COMPLETED-------------------------------------------------------
const makecompleted=(doc_id)=>{
    const formdata=new FormData()
    formdata.append('category_id',study_list_id)
    formdata.append('completed',true)
    axiosInstance.patch(`${ipaddress}/UserStudyListView/${user.user_id}/${doc_id}/`,formdata)
    .then(()=>{
      console.log("Moved to completed")
        setCount(count+1)
        toast.success('Document moved to completed section',{
          autoClose:2000,
        })
setFiltereddocuments([])
    })
}
const makepending=(doc_id)=>{
    const formdata=new FormData()
    formdata.append('category_id',study_list_id)
    formdata.append('completed',false)
    axiosInstance.patch(`${ipaddress}/UserStudyListView/${user.user_id}/${doc_id}/`,formdata)
    .then(()=>{
      console.log("Moved to pending")
        setCount(count+1)
        toast.success('Document moved to pending section',{
          autoClose:2000,
        })
setFiltereddocuments([])
    })
}

// ------------------------------------------------FILTER PENDING DOCUMENTS-------------------------------------------------------
const[filtereddocuments,setFiltereddocuments]=useState([])
const[pendingstatus,setpendingstatus]=useState(false)
const[completedstatus,setcompletedstatus]=useState(false)

const filterpendingdocs=(value,status)=>{

  const formdata=new FormData()
  formdata.append('status',status)
  console.log(status)
  if(value==="likes"){
  filterfunction(`${ipaddress}/FilterStudyListDocumentsByFollowers/${user.user_id}/${study_list_id}/${status}/`)
}
if(value==="rating"){
  filterfunction(`${ipaddress}/FilterStudyListDocumentsByRating/${user.user_id}/${study_list_id}/${status}/`)
}
else{
  setpendingstatus(false)
  setFiltereddocuments([])
}
if(value==="date"){
  filterfunction(`${ipaddress}/FilterStudyListDocumentsByDate/${user.user_id}/${study_list_id}/${status}/`)
}
}
const filterfunction=(value)=>{
  setpendingstatus(true)
  axiosInstance.get(value)
  .then((r)=>{
    console.log("Studylist Documents Filtered Successfuly",r.data)
    setFiltereddocuments(r.data)
  })
}

// -----------------------------------------------FILTER COMPLETED DOCUMENTS----------------------------------------------
const filtercompleteddocs=(value,status)=>{

  const formdata=new FormData()
  formdata.append('status',status)
  console.log(status)
  if(value==="likes"){
  filterfunction1(`${ipaddress}/FilterStudyListDocumentsByFollowers/${user.user_id}/${study_list_id}/${status}/`)
}
if(value==="rating"){
  filterfunction1(`${ipaddress}/FilterStudyListDocumentsByRating/${user.user_id}/${study_list_id}/${status}/`)
}
else{
  setcompletedstatus(false)
  setFiltereddocuments([])
}
if(value==="date"){
  filterfunction1(`${ipaddress}/FilterStudyListDocumentsByDate/${user.user_id}/${study_list_id}/${status}/`)
}
}

const filterfunction1=(value)=>{
  setcompletedstatus(true)
  axiosInstance.get(value)
  .then((r)=>{
    console.log("Studylist Documents Filtered Successfuly",r.data)
    setFiltereddocuments(r.data)
  })
}

// ------------------------------------Functionality to edit the Study list name---------------------------------------------

const[newstudylist_name,setNewstudylist_nakme]=useState("")
const editStudylist=()=>{
  const formdata=new FormData()
  formdata.append('study_list_id',study_list_id)
  formdata.append('study_list_name',newstudylist_name)
  axiosInstance.patch(`${ipaddress}/GetStudyListCategories/${user.user_id}/`,formdata)
  .then((r)=>{
      console.log("Studylist Updated",r.data)
      // getStudylist()
      setNewstudylist_nakme("")
      setCount(count+1)
      setdropdownstate(false)
      toast.success('Studylist name updated',{
        autoClose:2000,
      })
  })
}

let navigate=useNavigate()
// ---------------------------------------To delete the Study list---------------------------------------------------------
const deleteStudylist=()=>{
console.log({
  "study_list_id":study_list_id
})
  axiosInstance.put(`${ipaddress}/GetStudyListCategories/${user.user_id}/`,{
    "study_list_id":study_list_id
  })
  .then((r)=>{
      console.log("Studylist Deleted",r.data)
      console.log(study_list_id)
      // setCount(count+1)
      navigate('/dashboard/page')
  })
}

// -------------------------------------Search and take Documents under studylist-------------------------------------------
const[searcheddocs,setSearcheddocs]=useState([])

const searchdocument=(value)=>{
  if(value.length>0){
  axiosInstance.get(`${ipaddress}/SearchDocumentsUnderStudylist/${user.user_id}/${study_list_id}/${status}/${value}/`)
  .then((r)=>{
    console.log("Searched docs found",r.data)
    setFiltereddocuments(r.data)
  })
}
else{
  setFiltereddocuments([])
}
}


  return (
   <div>
    {loading ? (<Preloader/>):(
       <div>

       <div className="d-flex">
 <Mainsidebar activevalue={"studylist"} count={count}/>
         <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="container-fluid pt-4 mt-5 main-division bg-light">
             <Navbar/>
             <div onClick={()=>{
              setnavbar_dropdown_visible(false)
             }} className="w-100 mt-3">
               <div className='py-4 py-lg-4 studylist-div' style={{position:'relative'}}>
                 <div className="container d-flex justify-content-between align-items-center py-2">
                 <h6 className='m-0 fw-medium text-white d-flex align-items-center gap-3'><span className='text-white'>
                 
 </span> <span className='ms-4'>{studylist_details.study_list_name}</span></h6>
                 <div>
   <button className="btn border-0 text-white" style={{position:'relative'}} onClick={()=>{
     setdropdownstate(!dropdownstate)
   }}>
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
   <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
 </svg>
   </button>
   <ul className={`bg-white rounded py-3 border p-0 px-2 py-2 ${dropdownstate ? '':'d-none'}`} style={{position:'absolute',left:'78%',listStyleType:'none',zIndex:10}}>
     <li style={{cursor:"pointer"}} data-bs-toggle="modal" data-bs-target="#studylist_edit_modal" className=''><a className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black"/>
</svg> <span className='ms-2'>Edit Study List Name</span></a></li>
     <li style={{cursor:"pointer"}} onClick={deleteStudylist} className='mt-2'><a className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg> <span className='ms-2'>Delete Study List</span></a></li>
   </ul>
 </div>
                 </div>
                 <div onClick={()=>{
                  setdropdownstate(false)
                 }} className='container d-flex gap-2 gap-lg-5 px-1 px-md-5 mb-3 mb-lg-5'>
                  <span className={`text-white d-flex align-items-center gap-2 ${pendingstudylists.length > 0 || completedstudylists.length>0 ? '':'d-none'}`}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19" fill="none">
  <path d="M3.85415 15.2292H11.1458V14.1875H3.85415V15.2292ZM3.85415 11.0625H11.1458V10.0208H3.85415V11.0625ZM1.891 18.875C1.41157 18.875 1.01126 18.7144 0.690084 18.3932C0.368903 18.072 0.208313 17.6717 0.208313 17.1923V1.80768C0.208313 1.32825 0.368903 0.927951 0.690084 0.606771C1.01126 0.28559 1.41157 0.125 1.891 0.125H10.1041L14.7916 4.8125V17.1923C14.7916 17.6717 14.6311 18.072 14.3099 18.3932C13.9887 18.7144 13.5884 18.875 13.109 18.875H1.891ZM9.58331 5.33333V1.16667H1.891C1.73075 1.16667 1.58385 1.23344 1.45029 1.36698C1.31675 1.50054 1.24998 1.64744 1.24998 1.80768V17.1923C1.24998 17.3526 1.31675 17.4995 1.45029 17.633C1.58385 17.7666 1.73075 17.8333 1.891 17.8333H13.109C13.2692 17.8333 13.4161 17.7666 13.5497 17.633C13.6832 17.4995 13.75 17.3526 13.75 17.1923V5.33333H9.58331Z" fill="white"/>
</svg> <span style={{fontSize:'14px'}}>{pendingstudylists.length + completedstudylists.length} <span className='d-none d-md-inline'>Documents</span></span></span>
 <span className='text-white d-flex align-items-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84937 21.8752C5.36994 21.8752 4.96964 21.7146 4.64846 21.3934C4.32728 21.0722 4.16669 20.6719 4.16669 20.1925V6.89117C4.16669 6.41174 4.32728 6.01144 4.64846 5.69026C4.96964 5.36908 5.36994 5.20849 5.84937 5.20849H7.69231V2.88477H8.81411V5.20849H16.266V2.88477H17.3077V5.20849H19.1507C19.6301 5.20849 20.0304 5.36908 20.3516 5.69026C20.6728 6.01144 20.8334 6.41174 20.8334 6.89117V20.1925C20.8334 20.6719 20.6728 21.0722 20.3516 21.3934C20.0304 21.7146 19.6301 21.8752 19.1507 21.8752H5.84937ZM5.84937 20.8335H19.1507C19.3109 20.8335 19.4578 20.7667 19.5914 20.6332C19.7249 20.4996 19.7917 20.3527 19.7917 20.1925V11.0578H5.20835V20.1925C5.20835 20.3527 5.27512 20.4996 5.40867 20.6332C5.54223 20.7667 5.68913 20.8335 5.84937 20.8335ZM5.20835 10.0162H19.7917V6.89117C19.7917 6.73093 19.7249 6.58403 19.5914 6.45047C19.4578 6.31693 19.3109 6.25016 19.1507 6.25016H5.84937C5.68913 6.25016 5.54223 6.31693 5.40867 6.45047C5.27512 6.58403 5.20835 6.73093 5.20835 6.89117V10.0162Z" fill="white"/>
</svg> <span style={{fontSize:'14px'}}>{studylist_details.created_at.slice(0,10)}</span></span>
 <span className='text-white d-flex align-items-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M12.5 19.4714L6.24997 16.0739V11.0259L3.20508 9.37522L12.5 4.32715L21.7949 9.37522V16.0259H20.7532V9.96017L18.75 11.0259V16.0739L12.5 19.4714ZM12.5 13.2294L19.6154 9.37522L12.5 5.52105L5.38458 9.37522L12.5 13.2294ZM12.5 18.2835L17.7083 15.471V11.5988L12.5 14.4196L7.29164 11.5988V15.471L12.5 18.2835Z" fill="white"/>
</svg> <span style={{fontSize:'14px'}}>Communication Design</span></span>
                 </div>
                 <div onClick={()=>{
                  setdropdownstate(false)
                 }} className='container' style={{position:'absolute'}}>
                 <div className="input-group bg-white rounded shadow-sm" id="studylist-search">
   <span className="input-group-text bg-white border-0 py-3 px-4"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696"/>
</svg></span>
   <input type="text" onChange={(e)=>{
    searchdocument(e.target.value)
   }} className="form-control bg-white border-0 py-2 py-lg-3" placeholder="Search Documents in your study lists" aria-label="Username" aria-describedby="basic-addon1"/>
 </div>
               </div>
               </div>
 
 {/* --------------------------------------------TABLIST--------------------------------------------------------------- */}
                 <ul onClick={()=>{
                  setdropdownstate(false)
                 }} className="container nav nav-underline bg-white py-2 rounded shadow-sm mt-md-5 mt-5 px-lg-5" id="myTab" role="tablist">
   <li className="nav-item" role="presentation">
     <button className="nav-link active px-3 text-dark bg-white" onClick={()=>{
      setstatus("False")
     }} id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Pending</button>
   </li>
   <li className="nav-item" role="presentation">
     <button className="nav-link px-3 text-dark bg-white" onClick={()=>{
      setstatus("True")
     }} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Completed</button>
   </li>
 </ul>
 
 <div className="tab-content" id="myTabContent" onClick={()=>{
                  setdropdownstate(false)
                 }}>
 
   {/* ---------------------------------------------PENDING DOCUMENTS--------------------------------------------------- */}
   <div className="container px-lg-5 tab-pane fade show active bg-light mt-2" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
   
   <div className="row">
     <h6 className={`text-center text-secondary fw-medium mt-3 ${pendingstudylists.length>0 ? 'd-none':''}`}>No documents available under Pending List !!!</h6>
     <div className={`col-12 ${pendingstudylists.length>0 ? '':'d-none'}`}>
     <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
           <span className='fw-bold' style={{color:'#8E9696'}}>{pendingstudylists.length} Documents</span>
 <select name="" id="filter" className='border-0 px-2 bg-light' onChange={(e)=>{
   filterpendingdocs(e.target.value,'False')
 }}>
 <option value="select_filter" className='mt-2'>All</option>
   <option value="rating" className=''>Rating</option>
   <option value="likes" className=''>Likes</option>
   <option value="date" className=''>Date</option>
 
 </select>
         </div>
       {/* ORIGINAL */}
       <div className={`${filtereddocuments.length>0 ? 'd-none':'' }`}>
       {pendingstudylists.map((x)=>{
         return(
           <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
             <div className="row m-0 align-items-center">
             <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{overflow:'hidden'}}>
           <Document file={x.document.doc} onLoadSuccess={() => console.log('Document loaded successfully.')}>
             <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
           </Document>
             </div>
                         <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                          <div className="row m-0 border-bottom">
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941'}} to={`/showpdf/${x.document.id}`}>{x.document.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941'}} to={`/showpdf/${x.document.id}`}>{x.document.title}</Link>
                          <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.document.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.document.user_details.profile_pic !=null ?'':'d-none'}`}/>
                        <p className={x.document.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.document.user_details.nickname.slice(0,1)}</span><span>{x.document.user_details.nickname.slice(-1)}</span></p> 
                       {x.document.user_details.nickname} <span style={{color:'#8E9696'}} className='ms-1'>{x.document.created_at}</span></p>
                          </div>        
                         <div className="m-0 d-flex align-items-center justify-content-between mt-2">
                           <div className='d-flex align-items-center'>
                           <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg><span className='ms-2'>{x.rating} <span className='d-lg-inline d-none'>Rating</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
</svg>  <span className='ms-2'>{x.comments_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
       <span className='d-none d-inline-lg-block'>
       <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
</svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
                           </div>
                           <span data-bs-toggle="tooltip" data-bs-placement="bottom"
          data-bs-custom-class="custom-tooltip"
          data-bs-title="Move document to completed list" className='bg-success p-1 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makecompleted(x.document.id)
       }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
   <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
 </svg>
       </span>
 </div>
                        
                         </div>      
                     </div>
                     
           </div>
         )
       })}
       </div>
 
       {/* LIKES*/}
       <div id='filterlike' className={`${filtereddocuments.length>0 ? '':'d-none'}`}>
       {filtereddocuments.map((x)=>{
         return(
           <div className='shadow-sm mt-3 py-2 px-2 px-lg-0 bg-white'>
             <div className="row m-0 align-items-center">
                         <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{overflow:'hidden'}}>
                         <Document file={x.document} onLoadSuccess={() => console.log('Document loaded successfully.')}>
             <Page pageNumber={1} scale={0.3} width={280}/> {/* Adjust the scale to make the page smaller */}
           </Document>
                         </div>
                         <div className="col-8 col-md-9 ms-md-0 d-flex flex-column justify-content-center ">
                         <div className="row m-0 border-bottom">
                         <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                         <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic !=null ?'':'d-none'}`}/>
                        <p className={x.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_details.nickname.slice(0,1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p> 
                       {x.user_details.nickname} <span style={{color:'#8E9696'}} className='ms-1'>{x.created_on}</span></p>
                         </div>
                           <div className='d-lg-block d-none'>
                           <div className="m-0 d-flex align-items-center justify-content-between mt-2">
                           <div className='d-flex align-items-center'>
                           <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg><span className='ms-2'>{x.rating} <span className='d-lg-inline d-none'>Rating</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
</svg>  <span className='ms-2'>{x.discussion_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
       <span className='d-none d-inline-lg-block'>
       <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
</svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
                           </div>
                           <span data-bs-toggle="tooltip" data-bs-placement="bottom"
          data-bs-custom-class="custom-tooltip"
          data-bs-title="Move document to completed list" className='bg-success p-1 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makecompleted(x.document_id)
       }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
   <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
 </svg>
       </span>
 </div>
                           </div>
 
 {/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
 <div className='d-sm-block d-md-block d-lg-none'>
 <div className="m-0 d-flex align-items-center justify-content-between mt-2">
   <div className='d-flex align-items-center'>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.fcount}</span></span>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.comments_count}</span></span>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.pages}</span></span>
         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg> <span className='ms-2'>{x.rating}</span></span>
       <span className='d-none d-lg-block'>
       <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
       </svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
     </div>
     <span data-bs-toggle="tooltip" data-bs-placement="bottom"
          data-bs-custom-class="custom-tooltip"
          data-bs-title="Move document to completed list" className='bg-warning p-1 ms-3 ms-md-0 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makecompleted(x.document.id)
       }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
   <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
 </svg>
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
   </div>
 
   {/* ---------------------------------------------COMPLETED DOCUMENTS------------------------------------------------- */}
   <div className="container px-lg-5 tab-pane fade show bg-light mt-2" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
   <div className="row">
   <h6 className={`text-center text-secondary fw-medium mt-3 ${completedstudylists.length>0 ? 'd-none':''}`}>No documents available under Completed List !!!</h6>
     <div className={`col-12 ${completedstudylists.length>0 ? '':'d-none'}`}>
     <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
           <span className='fw-bold' style={{color:'#8E9696'}}>{completedstudylists.length} Documents</span>
 <select name="" id="filter" className='border-0 px-2 bg-light' onChange={(e)=>{
   filtercompleteddocs(e.target.value,'True')
 }}>
 <option value="select_filter" className='mt-2'>All</option>
   <option value="rating" className=''>Rating</option>
   <option value="likes" className=''>Likes</option>
   <option value="date" className=''>Date</option>
 
 </select>
         </div>
       {/* ORIGINAL */}
       <div id='original1' className={`${filtereddocuments.length>0 ? 'd-none':''}`}>
       {completedstudylists.map((x)=>{
         return(
           <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
             <div className="row m-0 align-items-center">
             <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{overflow:'hidden'}}>
           <Document file={x.document.doc} onLoadSuccess={() => console.log('Document loaded successfully.')}>
             <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
           </Document>
             </div>
                         <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                          <div className="row m-0 border-bottom">
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941'}} to={`/showpdf/${x.document.id}`}>{x.document.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941'}} to={`/showpdf/${x.document.id}`}>{x.document.title}</Link>
                          <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.document.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.document.user_details.profile_pic !=null ?'':'d-none'}`}/>
                        <p className={x.document.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.document.user_details.nickname.slice(0,1)}</span><span>{x.document.user_details.nickname.slice(-1)}</span></p> 
                       {x.document.user_details.nickname} <span style={{color:'#8E9696'}} className='ms-1'>{x.document.created_at}</span></p>
                          </div>        
                         <div className="m-0 d-flex align-items-center justify-content-between mt-2">
                         <div className='d-flex align-items-center'>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg><span className='ms-2'>{x.rating} <span className='d-lg-inline d-none'>Rating</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
</svg>  <span className='ms-2'>{x.comments_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
       <span className='d-none d-inline-lg-block'>
       <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
</svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
       </div>
       <span data-bs-toggle="tooltip" data-bs-placement="bottom"
          data-bs-custom-class="custom-tooltip"
          data-bs-title="Move document to pending list" className='bg-warning p-1 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makepending(x.document.id)
       }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
   <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
 </svg>
       </span>
 </div>
                        
                         </div>      
                     </div>
                     
           </div>
         )
       })}
       </div>
 
       {/* LIKES*/}
       <div id='filterlike1' className={`${filtereddocuments.length>0 ? '':'d-none'}`}>
       {filtereddocuments.map((x)=>{
         return(
           <div className='shadow-sm mt-3 py-2 px-2 px-lg-0 bg-white'>
             <div className="row m-0 align-items-center">
                         <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{overflow:'hidden'}}>
                         <Document file={x.document} onLoadSuccess={() => console.log('Document loaded successfully.')}>
             <Page pageNumber={1} scale={0.3} width={280}/> {/* Adjust the scale to make the page smaller */}
           </Document>
                         </div>
                         <div className="col-8 col-md-9 ms-md-0 d-flex flex-column justify-content-center ">
                         <div className="row m-0 border-bottom">
                         <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                         <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic !=null ?'':'d-none'}`}/>
                        <p className={x.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_details.nickname.slice(0,1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p> 
                       {x.user_details.nickname} <span style={{color:'#8E9696'}} className='ms-1'>{x.created_on}</span></p>
                         </div>
                           <div className='d-lg-block d-none'>
                           <div className="m-0 d-flex align-items-center justify-content-between mt-2">
                         <div className='d-flex align-items-center'>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg><span className='ms-2'>{x.rating} <span className='d-lg-inline d-none'>Rating</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
</svg>  <span className='ms-2'>{x.discussion_count} <span className='d-lg-inline d-none'>Discussions</span></span></span>
                         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} <span className='d-lg-inline d-none'>Pages</span></span></span>
         <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
       <span className='d-none d-inline-lg-block'>
       <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
</svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
       </div>
       <span data-bs-toggle="tooltip" data-bs-placement="bottom"
          data-bs-custom-class="custom-tooltip"
          data-bs-title="Move document to pending list" className='bg-warning p-1 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makepending(x.document_id)
       }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
   <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
 </svg>
       </span>
 </div>
                           </div>
 
 {/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
 <div className='d-sm-block d-md-block d-lg-none'>
 <div className="m-0 d-flex align-items-center justify-content-between mt-2">
   <div className='d-flex align-items-center'>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.fcount}</span></span>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M3.125 20.9135V4.80768C3.125 4.32825 3.28559 3.92795 3.60677 3.60677C3.92795 3.28559 4.32826 3.125 4.80768 3.125H20.1923C20.6717 3.125 21.072 3.28559 21.3932 3.60677C21.7144 3.92795 21.875 4.32825 21.875 4.80768V16.0257C21.875 16.5051 21.7144 16.9054 21.3932 17.2266C21.072 17.5477 20.6717 17.7083 20.1923 17.7083H6.33013L3.125 20.9135ZM5.88542 16.6667H20.1923C20.3526 16.6667 20.4995 16.5999 20.633 16.4664C20.7666 16.3328 20.8333 16.1859 20.8333 16.0257V4.80768C20.8333 4.64744 20.7666 4.50054 20.633 4.36698C20.4995 4.23344 20.3526 4.16667 20.1923 4.16667H4.80768C4.64744 4.16667 4.50054 4.23344 4.36698 4.36698C4.23344 4.50054 4.16667 4.64744 4.16667 4.80768V18.3794L5.88542 16.6667Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.comments_count}</span></span>
                         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M10.4166 14.0625H14.0425V13.0208H10.4166V14.0625ZM10.4166 10.9375H17.6683V9.89583H10.4166V10.9375ZM10.4166 7.8125H17.6683V6.77083H10.4166V7.8125ZM8.4535 17.7083C7.97407 17.7083 7.57376 17.5477 7.25258 17.2266C6.9314 16.9054 6.77081 16.5051 6.77081 16.0257V4.80768C6.77081 4.32826 6.9314 3.92795 7.25258 3.60677C7.57376 3.28559 7.97407 3.125 8.4535 3.125H19.6715C20.1509 3.125 20.5512 3.28559 20.8724 3.60677C21.1936 3.92795 21.3541 4.32826 21.3541 4.80768V16.0257C21.3541 16.5051 21.1936 16.9054 20.8724 17.2266C20.5512 17.5477 20.1509 17.7083 19.6715 17.7083H8.4535ZM8.4535 16.6667H19.6715C19.8317 16.6667 19.9786 16.5999 20.1122 16.4664C20.2457 16.3328 20.3125 16.1859 20.3125 16.0257V4.80768C20.3125 4.64744 20.2457 4.50054 20.1122 4.36698C19.9786 4.23344 19.8317 4.16667 19.6715 4.16667H8.4535C8.29325 4.16667 8.14635 4.23344 8.01279 4.36698C7.87925 4.50054 7.81248 4.64744 7.81248 4.80768V16.0257C7.81248 16.1859 7.87925 16.3328 8.01279 16.4664C8.14635 16.5999 8.29325 16.6667 8.4535 16.6667ZM5.3285 20.8333C4.84907 20.8333 4.44876 20.6727 4.12758 20.3516C3.8064 20.0304 3.64581 19.6301 3.64581 19.1507V6.89102H4.68748V19.1507C4.68748 19.3109 4.75425 19.4578 4.88779 19.5914C5.02133 19.7249 5.16824 19.7917 5.3285 19.7917H17.5881V20.8333H5.3285Z" fill="#8E9696"/>
       </svg> <span className='ms-2'>{x.pages}</span></span>
         <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
       </svg> <span className='ms-2'>{x.rating}</span></span>
       <span className='d-none d-lg-block'>
       <span data-bs-toggle="tooltip" data-bs-placement="bottom"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
         <path d="M5.84931 21.8752C5.36988 21.8752 4.96958 21.7146 4.6484 21.3934C4.32722 21.0722 4.16663 20.6719 4.16663 20.1925V6.89117C4.16663 6.41174 4.32722 6.01144 4.6484 5.69026C4.96958 5.36908 5.36988 5.20849 5.84931 5.20849H7.69225V2.88477H8.81405V5.20849H16.266V2.88477H17.3077V5.20849H19.1506C19.63 5.20849 20.0303 5.36908 20.3515 5.69026C20.6727 6.01144 20.8333 6.41174 20.8333 6.89117V20.1925C20.8333 20.6719 20.6727 21.0722 20.3515 21.3934C20.0303 21.7146 19.63 21.8752 19.1506 21.8752H5.84931ZM5.84931 20.8335H19.1506C19.3109 20.8335 19.4578 20.7667 19.5913 20.6332C19.7249 20.4996 19.7916 20.3527 19.7916 20.1925V11.0578H5.20829V20.1925C5.20829 20.3527 5.27506 20.4996 5.40861 20.6332C5.54216 20.7667 5.68907 20.8335 5.84931 20.8335ZM5.20829 10.0162H19.7916V6.89117C19.7916 6.73093 19.7249 6.58403 19.5913 6.45047C19.4578 6.31693 19.3109 6.25016 19.1506 6.25016H5.84931C5.68907 6.25016 5.54216 6.31693 5.40861 6.45047C5.27506 6.58403 5.20829 6.73093 5.20829 6.89117V10.0162Z" fill="#8E9696"/>
       </svg><span className='ms-2'>{x.created_on}</span></span>
       </span>
     </div>
     <span className='bg-warning p-1 ms-3 ms-md-0 px-2 rounded text-white' style={{cursor:'pointer'}} onClick={()=>{
         makepending(x.document_id)
       }}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass" viewBox="0 0 16 16">
   <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
 </svg>
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
   </div>
   </div>
 
             </div>
         </div>
       </div>
         
 
         {/* TOAST MESSAGE */}
 <div className="toast-container position-fixed bottom-0 end-0 p-3">
   <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
     
     <div className="toast-body d-flex justify-content-between">
       <span id='toastbody' className=''></span> 
       <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
     </div>
   </div>
 </div>
 
 {/* --------------------------------------Edit Study list name Modal-------------------------------------------------- */}
 <div className="modal fade" id="studylist_edit_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div className="modal-dialog modal-lg">
     <div className="modal-content">
       <div className="modal-body py-4 px-4">
         <h5>Update the Study List Name</h5>
         <div className='mt-3'>
             
             <div className={`d-flex mt-3 `}>
                 <input type="text" className='form-control' placeholder='Enter Study List Name' value={newstudylist_name} onChange={(e)=>{
                     setNewstudylist_nakme(e.target.value)
                 }} />
                 <button className='btn text-white fw-medium ms-2 px-3' data-bs-dismiss="modal" style={{backgroundColor:'#5D5FE3'}} onClick={editStudylist}>Update</button>
                 <button className='btn fw-medium ms-2 px-3' style={{border:'1px solid #606060',color:'#606060'}} data-bs-dismiss="modal">Cancel</button>
             </div>
         </div>
       </div>
     </div>
   </div>
 </div>

 <Backtotop/>
     </div>
    )}
   </div>
  )
}

export default Studylist