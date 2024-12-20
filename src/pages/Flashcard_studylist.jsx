import React from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { useState,useEffect,useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Document,Page } from 'react-pdf'
import { ipaddress2,ipaddress } from '../App'
import Preloader from './Preloader'
import { Context } from '../context/Context_provider'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';


const Flashcard_studylist = () => {
  const {study_list_id}=useParams()
  let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)
  
    const[dropdownstate,setdropdownstate]=useState(false)
    const[studylists_flashsets,setStudylists_flashsets]=useState([])
    const[pendingstudylists,setPendingStudylists]=useState([])
    const[studylist_details,setstudylist_details]=useState({})
    const[count,setCount]=useState(0)
    const[loading,setloading]=useState(false)

    const user=JSON.parse(sessionStorage.getItem('user'))
    useEffect(()=>{

      fetchflashsets()
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Cleanup function to destroy tooltips when the component unmounts
  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    });
  };
},[count,study_list_id])

// -------------------------------------------------Fetch studylist flashsets----------------------------------------------------
const fetchflashsets=()=>{
  axiosInstance.post(`${ipaddress2}/FlashcardStudylistRetrive/`,{
    'study_list_id':study_list_id,
    'user_id':user.user_id
  })
  .then((r)=>{
    // console.log("flashcard study list Details Fetched",r.data)
    setstudylist_details(r.data)
    setStudylists_flashsets(r.data.study_lists)
    setloading(false)
  })
  .catch(()=>{
    console.log("flashcard Study list details fetching error")
  })
}
// ------------------------------------------------Filter Flashsets-------------------------------------------------------
const[filteredFlashsets,setfilteredFlashsets]=useState([])
const filterflashsets=(value)=>{
  if(value==="likes"){
  axiosInstance.post(`${ipaddress2}/FlashsetsFiltersStudylist/${user.user_id}/${studylist_details.study_list_name_text}/`,{
    'like':true,
    'datetime':false})
  .then((r)=>{
    // console.log("Flashsets Filtered Successfuly",r.data)
    setfilteredFlashsets(r.data)
  })
  }
  if(value==="date"){
    axiosInstance.post(`${ipaddress2}/FlashsetsFiltersStudylist/${user.user_id}/${studylist_details.study_list_name_text}/`,{
      'like':false,
      'datetime':true})
    .then((r)=>{
      // console.log("Flashsets Filtered Successfuly",r.data)
    setfilteredFlashsets(r.data)
    })
    }

    if(value==="all"){
      setfilteredFlashsets([])
      }
}

// ------------------------------------Functionality to edit the Study list name---------------------------------------------

const[newstudylist_name,setNewstudylist_nakme]=useState("")
const editStudylist=()=>{
  const formdata=new FormData()
  formdata.append('user_id',user.user_id)
  formdata.append('study_list_id',study_list_id)
  formdata.append('study_list_name',newstudylist_name)
  axiosInstance.put(`${ipaddress2}/EditStudylist/`,formdata)
  .then((r)=>{
      // console.log("Flashset Studylist Updated",r.data)
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
  const formdata=new FormData()
  formdata.append('user_id',user.user_id)
  formdata.append('study_list_id',study_list_id)
  formdata.append('study_list_name',studylist_details.study_list_name_text)
  axiosInstance.post(`${ipaddress2}/Deletestudylist/`,formdata)
  .then((r)=>{
      // console.log("Flashset Studylist Deleted",r.data)
      navigate('/dashboard/page')
  })
  .catch((err)=>{
    // console.log("name",studylist_details.study_list_name_text)
    // console.log("Delete error",err)
   
  })
}

// -------------------------------------------------Search flashset under studylist--------------------------------------------

const searchFlashset=(value)=>{
  if(value.length>0){
  axiosInstance.get(`${ipaddress2}/SearchStudylistFlashsets/${user.user_id}/${studylist_details.study_list_name_text}/${value}/`)
  .then((r)=>{
    // console.log("Searched flashsets under studylist found",r.data)
    setStudylists_flashsets(r.data)
  })
  }
  else{
    fetchflashsets()
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
                 
 </span> <span className='ms-4'>{studylist_details.study_list_name_text}</span></h6>
                 <div className="">
   <button className="btn border-0 text-white" style={{position:'relative'}} onClick={()=>{
     setdropdownstate(!dropdownstate)
   }}>
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
   <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
 </svg>
   </button>
   <ul className={`bg-white rounded py-3 border p-0 px-2 py-2 ${dropdownstate ? '':'d-none'}`} style={{position:'absolute',left:'78%',listStyleType:'none'}}>
     <li style={{cursor:'pointer'}} data-bs-toggle="modal" data-bs-target="#studylist_edit_modal" className=''><a className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M6.25 23.75H7.62259L20.9952 10.3774L19.6226 9.00481L6.25 22.3774V23.75ZM5 25V21.851L21.476 5.35816C21.604 5.24397 21.7454 5.15573 21.9001 5.09344C22.0549 5.03115 22.2162 5 22.3841 5C22.552 5 22.7146 5.02644 22.8721 5.07931C23.0295 5.13221 23.1747 5.22756 23.3077 5.36538L24.6418 6.70672C24.7797 6.83974 24.8738 6.98566 24.9243 7.14447C24.9748 7.30328 25 7.46209 25 7.62091C25 7.7903 24.9714 7.95236 24.9143 8.10709C24.8573 8.26182 24.7664 8.40321 24.6418 8.53125L8.14903 25H5ZM20.2968 9.70316L19.6226 9.00481L20.9952 10.3774L20.2968 9.70316Z" fill="black"/>
</svg> <span className='ms-2'>Edit Study List Name</span></a></li>
     <li onClick={deleteStudylist} style={{cursor:'pointer'}} className='mt-2'><a className="dropdown-item"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg> <span className='ms-2'>Delete Study List</span></a></li>
   </ul>
 </div>
                 </div>
                 <div onClick={()=>{
                  setdropdownstate(false)
                 }} className='container d-flex gap-2 gap-lg-5 px-1 px-md-5 mb-3 mb-lg-5'>
                  <span className={`text-white d-flex align-items-center gap-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#fff"/>
</svg><span style={{fontSize:'14px'}}>{studylist_details.flashset_count} Flashsets</span></span>
 <span className='text-white d-flex align-items-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84937 21.8752C5.36994 21.8752 4.96964 21.7146 4.64846 21.3934C4.32728 21.0722 4.16669 20.6719 4.16669 20.1925V6.89117C4.16669 6.41174 4.32728 6.01144 4.64846 5.69026C4.96964 5.36908 5.36994 5.20849 5.84937 5.20849H7.69231V2.88477H8.81411V5.20849H16.266V2.88477H17.3077V5.20849H19.1507C19.6301 5.20849 20.0304 5.36908 20.3516 5.69026C20.6728 6.01144 20.8334 6.41174 20.8334 6.89117V20.1925C20.8334 20.6719 20.6728 21.0722 20.3516 21.3934C20.0304 21.7146 19.6301 21.8752 19.1507 21.8752H5.84937ZM5.84937 20.8335H19.1507C19.3109 20.8335 19.4578 20.7667 19.5914 20.6332C19.7249 20.4996 19.7917 20.3527 19.7917 20.1925V11.0578H5.20835V20.1925C5.20835 20.3527 5.27512 20.4996 5.40867 20.6332C5.54223 20.7667 5.68913 20.8335 5.84937 20.8335ZM5.20835 10.0162H19.7917V6.89117C19.7917 6.73093 19.7249 6.58403 19.5914 6.45047C19.4578 6.31693 19.3109 6.25016 19.1507 6.25016H5.84937C5.68913 6.25016 5.54223 6.31693 5.40867 6.45047C5.27512 6.58403 5.20835 6.73093 5.20835 6.89117V10.0162Z" fill="white"/>
</svg> <span style={{fontSize:'14px'}}>{studylist_details.studylist_created_date}</span></span>
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
   <input onChange={(e)=>{
    searchFlashset(e.target.value)
   }} type="text" className="form-control bg-white border-0 py-2 py-lg-3" placeholder="Search Documents in your study lists" aria-label="Username" aria-describedby="basic-addon1"/>
 </div>
               </div>
               </div>
 
 {/* --------------------------------------------TABLIST--------------------------------------------------------------- */}
                 <ul onClick={()=>{
                  setdropdownstate(false)
                 }} className="container nav nav-underline bg-white py-2 rounded shadow-sm mt-md-5 mt-5 px-lg-5" id="myTab" role="tablist">
   <li className="nav-item" role="presentation">
     <button className="nav-link active px-3 text-dark bg-white" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Flashsets</button>
   </li>
 </ul>
 
 <div onClick={()=>{
                  setdropdownstate(false)
                 }} className="tab-content" id="myTabContent">
 
   {/* ---------------------------------------------FLASHSETS--------------------------------------------------- */}
   <div className="container px-lg-5 tab-pane fade show active bg-light mt-2" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
   
   <div className="row">
     <h6 className={`text-center text-secondary fw-medium mt-3 ${studylists_flashsets.length>0 ? 'd-none':''}`}>No documents available under Pending List !!!</h6>
     <div className={`col-12 ${studylists_flashsets.length>0 ? '':'d-none'}`}>
     <div className='d-flex justify-content-between bg-light py-3 px-3 align-items-center'>
           <span className='fw-bold' style={{color:'#8E9696'}}>{studylists_flashsets.length} Flashsets</span>
 <select name="" id="filter" className='border-0 px-2 bg-light' onChange={(e)=>{
   filterflashsets(e.target.value)
 }}>
 <option value="all" className='mt-2'>All</option>
   <option value="likes" className=''>Likes</option>
   <option value="date" className=''>Date</option>
 
 </select>
         </div>
       {/* ORIGINAL */}
       <div className={`${filteredFlashsets.length>0 ? 'd-none':''}`}>
       {studylists_flashsets.map((x)=>{
      return(
        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
          <div className="row m-0 align-items-center ps-2 ps-lg-3">
          <div className="col-1 d-flex align-items-center justify-content-center rounded" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="40" viewBox="0 0 42 40" fill="none">
  <path d="M4.28125 35.2501L2.51042 34.5209C1.43403 34.0696 0.713544 33.2883 0.348961 32.1772C-0.0156225 31.0661 0.0451414 29.9723 0.531253 28.8959L4.28125 20.7709V35.2501ZM12.6146 39.8334C11.4688 39.8334 10.4879 39.4255 9.67188 38.6095C8.85591 37.7935 8.44792 36.8126 8.44792 35.6668V23.1668L13.9688 38.4793C14.0729 38.7223 14.1771 38.9567 14.2813 39.1824C14.3854 39.4081 14.5243 39.6251 14.6979 39.8334H12.6146ZM23.3438 39.6251C22.2326 40.0418 21.1563 39.9897 20.1146 39.4689C19.0729 38.948 18.3438 38.1321 17.9271 37.0209L8.65625 11.6043C8.23959 10.4932 8.27431 9.40809 8.76042 8.34907C9.24653 7.29004 10.0451 6.56955 11.1563 6.18761L26.8854 0.458442C27.9965 0.0417752 29.0729 0.0938585 30.1146 0.614692C31.1563 1.13553 31.8854 1.9515 32.3021 3.06261L41.5729 28.4793C41.9896 29.5904 41.9549 30.6755 41.4688 31.7345C40.9826 32.7935 40.184 33.514 39.0729 33.8959L23.3438 39.6251ZM18.8646 14.8334C19.4549 14.8334 19.9497 14.6338 20.349 14.2345C20.7483 13.8352 20.9479 13.3404 20.9479 12.7501C20.9479 12.1598 20.7483 11.665 20.349 11.2657C19.9497 10.8664 19.4549 10.6668 18.8646 10.6668C18.2743 10.6668 17.7795 10.8664 17.3802 11.2657C16.9809 11.665 16.7813 12.1598 16.7813 12.7501C16.7813 13.3404 16.9809 13.8352 17.3802 14.2345C17.7795 14.6338 18.2743 14.8334 18.8646 14.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                      <div className="col-10 ps-0 col-lg-9 ms-md-0 d-flex flex-column ps-2 justify-content-center ">
                       <div className="row m-0 border-bottom">
                        <div className='d-flex justify-content-between'>
                        <Link to={`/viewflashcard/'study_list'/${study_list_id}/${x.flashset_details.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.flashset_details.name}</Link>
                       </div>
                       <p className='mt-1' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.flashset_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.flashset_details.profile_pic!=null ? '':'d-none'}`}/> 
                        {x.flashset_details.nickname!=undefined ? (<span className={`bg-info rounded-circle text-white p-1 me-1 ${x.flashset_details.profile_pic!=null ? 'd-none':''}`} style={{height:'28px',fontSize:'13px'}}>{x.flashset_details.nickname.slice(0,1)}{x.flashset_details.nickname.slice(-1)}</span>):(<></>)}
                        
                        {x.flashset_details.nickname} <span className='ms-1 text-secondary'>{x.flashset_details.time_since_created}</span></p>
                      </div>        
                      <div className="m-0 d-flex align-items-center mt-2">
    
      <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashset_details.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
    <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashset_details.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

</div>
                     
                      </div>      
                  </div>
                  
        </div>
      )
    })}
       </div>
 
{/* -----------------------------------------------Filtered Flashsets---------------------------------------------------- */}
<div className={`${filteredFlashsets.length>0 ? '':'d-none'}`}>
       {filteredFlashsets.map((x)=>{
      return(
        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
          <div className="row m-0 align-items-center ps-2 ps-lg-3">
          <div className="col-1 d-flex align-items-center justify-content-center rounded" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="40" viewBox="0 0 42 40" fill="none">
  <path d="M4.28125 35.2501L2.51042 34.5209C1.43403 34.0696 0.713544 33.2883 0.348961 32.1772C-0.0156225 31.0661 0.0451414 29.9723 0.531253 28.8959L4.28125 20.7709V35.2501ZM12.6146 39.8334C11.4688 39.8334 10.4879 39.4255 9.67188 38.6095C8.85591 37.7935 8.44792 36.8126 8.44792 35.6668V23.1668L13.9688 38.4793C14.0729 38.7223 14.1771 38.9567 14.2813 39.1824C14.3854 39.4081 14.5243 39.6251 14.6979 39.8334H12.6146ZM23.3438 39.6251C22.2326 40.0418 21.1563 39.9897 20.1146 39.4689C19.0729 38.948 18.3438 38.1321 17.9271 37.0209L8.65625 11.6043C8.23959 10.4932 8.27431 9.40809 8.76042 8.34907C9.24653 7.29004 10.0451 6.56955 11.1563 6.18761L26.8854 0.458442C27.9965 0.0417752 29.0729 0.0938585 30.1146 0.614692C31.1563 1.13553 31.8854 1.9515 32.3021 3.06261L41.5729 28.4793C41.9896 29.5904 41.9549 30.6755 41.4688 31.7345C40.9826 32.7935 40.184 33.514 39.0729 33.8959L23.3438 39.6251ZM18.8646 14.8334C19.4549 14.8334 19.9497 14.6338 20.349 14.2345C20.7483 13.8352 20.9479 13.3404 20.9479 12.7501C20.9479 12.1598 20.7483 11.665 20.349 11.2657C19.9497 10.8664 19.4549 10.6668 18.8646 10.6668C18.2743 10.6668 17.7795 10.8664 17.3802 11.2657C16.9809 11.665 16.7813 12.1598 16.7813 12.7501C16.7813 13.3404 16.9809 13.8352 17.3802 14.2345C17.7795 14.6338 18.2743 14.8334 18.8646 14.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                      <div className="col-10 ps-0 col-lg-9 ms-md-0 d-flex flex-column ps-2 justify-content-center ">
                       <div className="row m-0 border-bottom">
                        <div className='d-flex justify-content-between'>
                        <Link to={`/viewflashcard/'study_list'/${study_list_id}/${x.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.name}</Link>
                       </div>
                       <p className='mt-1' style={{fontSize:'14px',color:'#5D5FE3'}}>
                        <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.profile_pic!=null ? '':'d-none'}`}/> 
                        {x.nickname!=undefined ? (<span className={`bg-info rounded-circle text-white p-1 me-1 ${x.profile_pic!=null ? 'd-none':''}`} style={{height:'28px',fontSize:'13px'}}>{x.nickname.slice(0,1)}{x.nickname.slice(-1)}</span>):(<></>)}
                        
                        {x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></p>
                      </div>        
                      <div className="m-0 d-flex align-items-center mt-2">
    
      <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
    <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>
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
     </div>
    )}
   </div>
  )
}

export default Flashcard_studylist