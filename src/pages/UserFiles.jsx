import React, { useState,useEffect,useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Document,Page } from 'react-pdf'
import { ipaddress,ipaddress2 } from '../App'
import Preloader from './Preloader'
import { Context } from '../context/Context_provider'
import Backtotop from './Backtotop'
import Create_study_list from './Create_study_list'
import Create_flashcard_study_list from './Create_Flashcard_study_list'
import axiosInstance from './axiosInstance'

const UserFiles = () => {

    let {value}=useParams()
    let {user_id}=useParams()

    let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

    const[pageloading,setpageloading]=useState(true)
    const user=JSON.parse(sessionStorage.getItem('user'))

    const[document_id,setdocument_id]=useState()
    const[variable,setVariable]=useState("")
    const[uploadedDocuments,setUploadeddocuments]=useState([])
    const[favouritedocs,setFavouritedocs]=useState([])
    const[createdFlashsets,setcreatedFlashsets]=useState([])
    const[savedFlashsets,setsavedFlashsets]=useState([])
    const[count,setCount]=useState(0)

    useEffect(()=>{

      if(value==="uploaded_documents"){
        fetchuploaded_docs()
      }

      if(value==="followed_documents"){
        fetchfollowed_docs()
      }

      if(value==="uploaded_flashcards"){
        fetchcreated_flashsets()
      }

      if(value==="followed_flashcards"){
        fetchsaved_flashsets()
      }

      setpageloading(false)
    },[value])

// To get all the uploaded documents under particular user
const fetchuploaded_docs=()=>{
  axiosInstance.get(`${ipaddress}/uploadDocuments/${user_id}/`)
  .then((r)=>{
    // console.log("Document fetched successfully",r.data)
    const docs=r.data.reverse()
    setUploadeddocuments(docs)
  })
  .catch((err)=>{
    console.log(err);
  })
}

// To get followed documents under particular user
const fetchfollowed_docs=()=>{
  axiosInstance.get(`${ipaddress}/FavouriteDocuments/${user_id}`)
  .then((p)=>{
    const docs=p.data.reverse()
    setFavouritedocs(docs)
    // console.log("Favourite Documents Fetched Successfully :",p.data)
  })
}

// To get created flashsets under particular user
const fetchcreated_flashsets=()=>{
  axiosInstance.get(`${ipaddress2}/UserFlashcardsetsRetrive/${user_id}/`)
  .then((p)=>{
    const docs=p.data.reverse()
    setcreatedFlashsets(docs)
    // console.log("Created Flashsets Fetched Successfully :",p.data)
  })
  .catch((err)=>{
    console.log("created flashsets fetching error",err)
  })
}

// To get saved flashsets under particular user
const fetchsaved_flashsets=()=>{
  axiosInstance.post(`${ipaddress2}/SavedStudylistFlashsets/`,{
    'user_id':user_id
  })
  .then((p)=>{
    const docs=p.data.reverse()
    setsavedFlashsets(docs)
    // console.log("Saved Flashsets Fetched Successfully :",p.data)
  })
  .catch(()=>{
    console.log("Saved flashcards fetching error")
  })
}

// ----------------------------------------Functionality to get Filtered Uploaded Documents-----------------------------------------------------------
const[filtereddocuments,setFiltereddocuments]=useState([])

const filterdocs=(e)=>{
  const value=e.target.value
  if(e.target.value==="likes"){
  filterfunction(`${ipaddress}/userfilteredocuments/${user_id}/`)
}
if(e.target.value==="rating"){
  filterfunction(`${ipaddress}/FilterDocumentsByRating/${user_id}/`)
}
if(e.target.value==="select_filter"){
  setFiltereddocuments([])
}
if(e.target.value==="date"){
  filterfunction(`${ipaddress}/FilterUserDocumentsByDate/${user_id}/`)
}
}

const filterfunction=(value)=>{
  axiosInstance.get(value)
  .then((r)=>{
    // console.log("Filtered Successfuly",r.data)
    setFiltereddocuments(r.data)
  })
}

// ------------------------------------------To get the filtered Followed documents------------------------------------------
const [filteredfollowed_docs,setfilteredfollowed_docs]=useState([])
const [filtertype,setFiltertype]=useState("followeddocs_original")

const filterfolloweddocs=(value)=>{
  if(value==="followeddocs_original"){
    setFiltertype("followeddocs_original")
  }
  else{
    axiosInstance.get(`${ipaddress}/FavouriteDocumentsFilter/${user_id}/${value}/`)
    .then((r)=>{
      // console.log("Followed Documents Filtered Successfuly",r.data)
      setfilteredfollowed_docs(r.data)
    })
  }
}

// -----------------------------------------Search uploaded Documents--------------------------------------------------------

const searchDocument=(document_name)=>{
  if(document_name.length>0){
  axiosInstance.get(`${ipaddress}/UserDocumentsSearch/${user.user_id}/${document_name}/`)
  .then((r)=>{
    // console.log("Uploaded Documents Found ",r.data)
    setFiltereddocuments(r.data.documents)
  })
  .catch((err)=>{
    console.log("Search Data Sent Failed",err)
  })
}
else{
  setFiltereddocuments([])
}
}
// -------------------------------------To search and take Followed Documents---------------------------------------------

const search_followeddocs=(value)=>{
  if(value!=null && value.length>0){
  axiosInstance.get(`${ipaddress}/FavouriteDocumentsSearchFilter/${user.user_id}/${value}/`)
  .then((r)=>{
    // console.log("Followed Search Documents Fetched Successfuly",r.data)
    setfilteredfollowed_docs(r.data)
  })
}
else{
  setfilteredfollowed_docs([])
}
}


// ------------------------------------------------Search and take created flashsets------------------------------------------

const searchCreatedflashsets=(value)=>{
if(value.length>0){
  axiosInstance.get(`${ipaddress2}/SearchFlashsetsCreatedFlashsets/${user.user_id}/${value}/`)
  .then((r)=>{
    // console.log("Searched created flashsets found",r.data)
    setcreatedFlashsets(r.data)
  })
}
else{
  fetchcreated_flashsets()
}
}

// ------------------------------------------------Search and take saved flashsets------------------------------------------

const searchSavedflashsets=(value)=>{
  if(value.length>0){
    axiosInstance.get(`${ipaddress2}/SearchFlashsetsSavedFlashsets/${user.user_id}/${value}/`)
    .then((r)=>{
      // console.log("Searched saved flashsets found",r.data)
      setsavedFlashsets(r.data)
    })
  }
  else{
    fetchsaved_flashsets()
  }
  }

// ----------------------------------------Filter created flashsets----------------------------------------------------

const filtercreatedflashsets=(value)=>{
  if(value==="likes"){
  axiosInstance.post(`${ipaddress2}/FlashsetsFiltersCreatedFlashsets/${user.user_id}/`,{
    'like':true,
    'datetime':false})
  .then((r)=>{
    setcreatedFlashsets(r.data)
    // document.getElementById('flashsetoriginal').style.display='none'
  })
  }
  if(value==="date"){
    axiosInstance.post(`${ipaddress2}/FlashsetsFiltersCreatedFlashsets/${user.user_id}/`,{
      'like':false,
      'datetime':true})
    .then((r)=>{
      setcreatedFlashsets(r.data)
      // document.getElementById('flashsetoriginal').style.display='none'
    })
    }

    if(value==="all"){
        fetchcreated_flashsets()
      }
}

// ----------------------------------------Filter saved flashsets----------------------------------------------------

const[searchedFlashsets,setSearchedFlashsets]=useState([])
const filtersavedflashsets=(value)=>{
  if(value==="likes"){
  axiosInstance.post(`${ipaddress2}/FlashsetsFiltersSavedFlashsets/${user.user_id}/`,{
    'like':true,
    'datetime':false})
  .then((r)=>{
    setSearchedFlashsets(r.data)
    // document.getElementById('flashsetoriginal').style.display='none'
  })
  }
  if(value==="date"){
    axiosInstance.post(`${ipaddress2}/FlashsetsFiltersSavedFlashsets/${user.user_id}/`,{
      'like':false,
      'datetime':true})
    .then((r)=>{
      setSearchedFlashsets(r.data)
      // document.getElementById('flashsetoriginal').style.display='none'
    })
    }

    if(value==="all"){
        setSearchedFlashsets([])
      }
}

// ----------------------------------------------Functionality to Unsave the document--------------------------------------
const unsave=(doc_id)=>{
  axiosInstance.delete(`${ipaddress}/UserStudyListView/${user.user_id}/${doc_id}/`)
  .then((r)=>{
    // console.log("Document successfully unsaved",r.data)
    fetchuploaded_docs()
  })
}

// ----------------------------------------------Functionality to Unsave the document--------------------------------------
const unsave1=(doc_id)=>{
  axiosInstance.delete(`${ipaddress}/UserStudyListView/${user.user_id}/${doc_id}/`)
  .then((r)=>{
    // console.log("Document successfully unsaved",r.data)
    fetchfollowed_docs()
  })
}


const[flashsetid,setflashsetid]=useState("")
// ----------------------------------------------Functionality to Unsave the Flashset--------------------------------------
const unsave_flashset=(flashset_id)=>{
  axiosInstance.put(`${ipaddress2}/Unsave_flashcard_studylist/${user.user_id}/${flashset_id}/`)
  .then((r)=>{
    // console.log("Flashset successfully unsaved",r.data)
    fetchcreated_flashsets()
    fetchsaved_flashsets()
  })
  .catch((err)=>{
    console.log("Unsave error",err)
  })
}

const call_func=()=>{
  fetchuploaded_docs()
  fetchfollowed_docs()
}

const call_func2=()=>{
fetchcreated_flashsets()
fetchsaved_flashsets()
}



  return (
    <div>
      {pageloading ? (<Preloader/>):(
        <div>
        <div className="d-flex">
      <Mainsidebar></Mainsidebar>
        <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        <Navbar></Navbar>
          <div onClick={()=>{
            setnavbar_dropdown_visible(false)
          }} className="container">
         <div className='bg-white px-3 pt-2 shadow-sm'>
        <Link to={`/profile/${user_id}`}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="black" className="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg></Link> 
          <ul className="nav nav-underline mt-4 d-flex justify-content-center" id="myTab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className={`nav-link bg-white me-lg-4 ${value==="uploaded_documents" ? 'text-primary active' : 'text-secondary'}`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true" onClick={()=>{
      fetchuploaded_docs()
    }}>Uploaded Documents ({uploadedDocuments.length})</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className={`nav-link bg-white me-lg-4 ${value==="followed_documents" ? 'text-primary active' : 'text-secondary'}`} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false" onClick={()=>{
      fetchfollowed_docs()
    }}>Liked Documents ({favouritedocs.length})</button>
  </li>
  <li className={`nav-item ${user_id===user.user_id ? '':'d-none'}`} role="presentation">
    <button onClick={()=>{
      fetchcreated_flashsets()
    }} className={`nav-link bg-white me-lg-4 ${value==="uploaded_flashcards" ? 'text-primary active' : 'text-secondary'}`} id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Created Flashsets ({createdFlashsets.length})</button>
  </li>
  <li className={`nav-item ${user_id===user.user_id ? '':'d-none'}`} role="presentation">
    <button onClick={()=>{
      fetchsaved_flashsets()
    }} className={`nav-link bg-white ${value==="followed_flashcards" ? 'text-primary active' : 'text-secondary'}`} id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false">Saved Flashsets ({savedFlashsets.length})</button>
  </li>
</ul>
          </div>
<div className="tab-content" id="myTabContent">

{/* ------------------------------------------Uploaded Documents Layout Section----------------------------------------- */}
{uploadedDocuments && (
  <div className={`tab-pane fade bg-light mt-3 ${value==="uploaded_documents" ? 'show active' : ''}`} id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
  <div className='d-flex justify-content-between bg-white shadow-sm py-3 px-3 align-items-center mb-3'>
  <span className=''>{uploadedDocuments.length} Documents</span>
  <div className='d-flex'>
    <div>
    <div className="input-group bg-light rounded border">
<span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
<input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search} onChange={(e)=>{
  searchDocument(e.target.value)
}} aria-label="Username" aria-describedby="basic-addon1" style={{fontSize:'14px'}}/>
</div>
    </div>
  <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light ms-2' onChange={filterdocs}>
<option value="select_filter" className='mt-2'>All</option>
  <option value="rating" className=''>Rating</option>
  <option value="likes" className=''>Likes</option>
  <option value="date" className=''>Date</option>
</select>
  </div>
        </div>
 {/* ORIGINAL */}
 <div className={`${filtereddocuments.length>0 ? 'd-none':''}`}>
      {uploadedDocuments.map((x)=>{
        return(
          <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
            <div className="row m-0 align-items-center">
            <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center">
          <Document file={x.doc_url} onLoadSuccess={() => console.log('Document loaded successfully.')}>
            <Page pageNumber={1} scale={0.3} width={280} /> {/* Adjust the scale to make the page smaller */}
          </Document>
            </div>
                        <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                         <div className="row m-0 border-bottom">
                         <div className='d-flex justify-content-between'>
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title.slice(0,16)}</Link>
                          
                          <button onClick={()=>{
                            unsave(x.document_id)
                          }} className={`bg-transparent border-0 ${x.study_list_status ? '':'d-none'}`} style={{color:'#8587EA'}}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3"/>
</svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
<button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none':''}`} style={{color:'#8587EA'}} onClick={()=>{
  setdocument_id(x.document_id)
}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3"/>
</svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                          </div>
                         <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                          <img src={x.user_data.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_data.profile_pic !=null ?'':'d-none'}`}/>
                          {x.user_data.nickname !=undefined ? (<p className={x.user_data.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_data.nickname.slice(0,1)}</span><span>{x.user_data.nickname.slice(-1)}</span></p>):(<></>)}
                         {x.user_data.nickname}<span style={{color:'#8E9696'}} className='ms-1'>{x.created_on}</span></p>
                         </div>        
                         <div className='d-lg-block d-none'>
                          <div className="m-0 d-flex align-items-center mt-2">
                          <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M7.50016 11.2261L3.81425 7.54021L4.55144 6.79102L6.97933 9.21891V0.208496H8.021V9.21891L10.4489 6.79102L11.1861 7.54021L7.50016 11.2261ZM1.89118 14.7918C1.41175 14.7918 1.01145 14.6312 0.690267 14.3101C0.369086 13.9889 0.208496 13.5886 0.208496 13.1091V10.5851H1.25016V13.1091C1.25016 13.2694 1.31693 13.4163 1.45048 13.5498C1.58403 13.6834 1.73094 13.7502 1.89118 13.7502H13.1091C13.2694 13.7502 13.4163 13.6834 13.5498 13.5498C13.6834 13.4163 13.7502 13.2694 13.7502 13.1091V10.5851H14.7918V13.1091C14.7918 13.5886 14.6312 13.9889 14.3101 14.3101C13.9889 14.6312 13.5886 14.7918 13.1091 14.7918H1.89118Z" fill="#8E9696"/>
</svg><span className='ms-1'>{x.download_count} <span className='d-lg-inline d-none'>Downloads</span></span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg>  <span className='ms-2'>{x.discussion_count} Discussions</span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} Pages</span></span>
        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.favourites_count} Likes</span></span>
</div>
                          </div>

{/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
<div className='d-sm-block d-md-block d-lg-none'>
<div className="m-0 d-flex align-items-center mt-2">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
        <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.favourites_count}</span></span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
</svg> <span className='ms-2'></span> {x.discussion_count}</span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.pages}</span></span>
        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
      </svg> <span className='ms-2'>{x.average_rating}</span></span>
                      
                          </div>
</div>
                       
                        </div>      
                    </div>
                    
          </div>
        )
      })}
      </div>

      {/* LIKES*/}
      <div className={`${filtereddocuments.length>0 ? '':'d-none'}`}>
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
                        <div className='d-flex justify-content-between'>
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title.slice(0,16)}</Link>
                          
                          <button onClick={()=>{
                            unsave(x.document_id)
                          }} className={`bg-transparent border-0 ${x.study_list_status ? '':'d-none'}`} style={{color:'#8587EA'}}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3"/>
</svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
<button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none':''}`} style={{color:'#8587EA'}} onClick={()=>{
  setdocument_id(x.document_id)
}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3"/>
</svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                          </div>
                        <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                          <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic !=null ?'':'d-none'}`}/>
                          {x.user_details.nickname !=undefined ? (<p className={x.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_details.nickname.slice(0,1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>):(<></>)}
                         {x.user_details.nickname}<span style={{color:'#8E9696'}} className='ms-1'>{x.created_on}</span></p>
                          </div>
                          <div className='d-lg-block d-none'>
                          <div className="m-0 d-flex align-items-center mt-2">
                          <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M7.50016 11.2261L3.81425 7.54021L4.55144 6.79102L6.97933 9.21891V0.208496H8.021V9.21891L10.4489 6.79102L11.1861 7.54021L7.50016 11.2261ZM1.89118 14.7918C1.41175 14.7918 1.01145 14.6312 0.690267 14.3101C0.369086 13.9889 0.208496 13.5886 0.208496 13.1091V10.5851H1.25016V13.1091C1.25016 13.2694 1.31693 13.4163 1.45048 13.5498C1.58403 13.6834 1.73094 13.7502 1.89118 13.7502H13.1091C13.2694 13.7502 13.4163 13.6834 13.5498 13.5498C13.6834 13.4163 13.7502 13.2694 13.7502 13.1091V10.5851H14.7918V13.1091C14.7918 13.5886 14.6312 13.9889 14.3101 14.3101C13.9889 14.6312 13.5886 14.7918 13.1091 14.7918H1.89118Z" fill="#8E9696"/>
</svg><span className='ms-1'>{x.download_count} <span className='d-lg-inline d-none'>Downloads</span></span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg>  <span className='ms-2'>{x.replies_count} Discussions</span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} Pages</span></span>
        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} Likes</span></span>
</div>
                          </div>

{/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
<div className='d-sm-block d-md-block d-lg-none'>
<div className="m-0 d-flex align-items-center mt-2">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
        <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.followers_count}</span></span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg> <span className='ms-2'></span> {x.replies_count}</span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.pages}</span></span>
        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
      </svg> <span className='ms-2'>{x.average_rating}</span></span>
                      
                          </div>
</div>
                        </div>      
                    </div>
          </div>
        )
      })}
      </div>
  </div>
)}

{/* ------------------------------------------Followed Documents Layout Section----------------------------------------- */}

<div className={`tab-pane fade bg-light mt-3 ${value==="followed_documents" ? 'show active' : ''}`} id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
{/* <h6 className={`text-secondary text-center mt-4 ${favouritedocs.length>0 ? 'd-none':''}`}>No documents available under Favourites list !!!</h6> */}
<div>
<div className='d-flex justify-content-between bg-white shadow-sm py-3 px-3 align-items-center mb-3'>
          <span className=''>{favouritedocs.length} Documents</span>
          <div className='d-flex'>
            <div>
            <div className="input-group bg-light rounded border">
<span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
<input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search} onChange={(e)=>{
  search_followeddocs(e.target.value)
}} aria-label="Username" aria-describedby="basic-addon1" style={{fontSize:'14px'}}/>
</div>
            </div>
            <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light ms-2' onChange={(e)=>{
              setFiltertype(e.target.value)
              filterfolloweddocs(e.target.value)
            }}>
<option value="followeddocs_original" className='mt-2'>All</option>
  <option value="rating" className=''>Rating</option>
  <option value="likes" className=''>Likes</option>
  <option value="created_on" className=''>Date</option>

</select>
          </div>
        </div>
        <h6 className={`text-secondary text-center mt-4 ${favouritedocs.length>0 ? 'd-none':''}`}>No documents available under Favourites list !!!</h6>

<div className={`${filtertype==="followeddocs_original" && filteredfollowed_docs.length<=0 && favouritedocs.length>0 ? '':'d-none'}`}>
  {favouritedocs.map((x)=>{
  return(
    <div className='shadow-sm mb-3 py-1 py-lg-3 px-2 px-lg-0 rounded bg-white'>
    <div className="row m-0 align-items-center">
    <div className="col-2 col-lg-2 d-flex align-items-center justify-content-center" style={{overflow:'hidden'}}>
                        <Document file={x.document_url} onLoadSuccess={() => console.log('Document loaded successfully.')}>
            <Page pageNumber={1} scale={0.3} width={280}/> {/* Adjust the scale to make the page smaller */}
          </Document>
                        </div>
                <div className="col-10 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                 <div className="row m-0 border-bottom">
                 <div className='d-flex justify-content-between'>
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title!=undefined && x.title.slice(0,16)}</Link>
                          
                          <button onClick={()=>{
                            unsave1(x.document_id)
                          }} className={`bg-transparent border-0 ${x.study_list_status ? '':'d-none'}`} style={{color:'#8587EA'}}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3"/>
</svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
<button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none':''}`} style={{color:'#8587EA'}} onClick={()=>{
  setdocument_id(x.document_id)
}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3"/>
</svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                          </div>
                          <p className='mt-2 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                          <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic !=null ?'':'d-none'}`}/>
                          {x.user_details.nickname !=undefined ? (<p className={x.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_details.nickname.slice(0,1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>):(<></>)}
                         {x.user_details.nickname}<span style={{color:'#8E9696'}} className='ms-1'>{x.created_at}</span></p>
                 </div>        
                 <div className='d-lg-block d-none'>
                          <div className="m-0 d-flex align-items-center mt-2">
                          <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M7.50016 11.2261L3.81425 7.54021L4.55144 6.79102L6.97933 9.21891V0.208496H8.021V9.21891L10.4489 6.79102L11.1861 7.54021L7.50016 11.2261ZM1.89118 14.7918C1.41175 14.7918 1.01145 14.6312 0.690267 14.3101C0.369086 13.9889 0.208496 13.5886 0.208496 13.1091V10.5851H1.25016V13.1091C1.25016 13.2694 1.31693 13.4163 1.45048 13.5498C1.58403 13.6834 1.73094 13.7502 1.89118 13.7502H13.1091C13.2694 13.7502 13.4163 13.6834 13.5498 13.5498C13.6834 13.4163 13.7502 13.2694 13.7502 13.1091V10.5851H14.7918V13.1091C14.7918 13.5886 14.6312 13.9889 14.3101 14.3101C13.9889 14.6312 13.5886 14.7918 13.1091 14.7918H1.89118Z" fill="#8E9696"/>
</svg><span className='ms-1'>{x.download_count} <span className='d-lg-inline d-none'>Downloads</span></span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg>  <span className='ms-2'>{x.discussion_count} Discussions</span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} Pages</span></span>
        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.followers_count} Likes</span></span>
</div>
                          </div>

{/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
<div className='d-sm-block d-md-block d-lg-none'>
<div className="m-0 d-flex align-items-center mt-2">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
        <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.followers_count}</span></span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg> <span className='ms-2'></span> {x.discussion_count}</span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.pages}</span></span>
        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
      </svg> <span className='ms-2'>{x.average_rating}</span></span>
                      
                          </div>
</div>
        
                </div>      
            </div>
            
  </div>
  )
 })} 
</div>

{/* --------------------------------------------Filtered Followed Documents Section-------------------------------------- */}
<div className={`${filteredfollowed_docs.length>0 ? '':'d-none'}`}>
      {filteredfollowed_docs.map((x)=>{
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
                        <div className='d-flex justify-content-between'>
                          <Link className='fw-bold d-none d-md-inline' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title}</Link>
                          <Link className='fw-bold d-inline d-md-none' style={{color:'#2A3941',fontSize:'16px'}} to={`/showpdf/${x.document_id}`}>{x.title.slice(0,16)}</Link>
                          
                          <button onClick={()=>{
                            unsave1(x.document_id)
                          }} className={`bg-transparent border-0 ${x.study_list_status ? '':'d-none'}`} style={{color:'#8587EA'}}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3128V1.84967C0.25 1.37025 0.41059 0.969944 0.731771 0.648763C1.05295 0.327582 1.45325 0.166992 1.93268 0.166992H11.0673C11.5467 0.166992 11.947 0.327582 12.2682 0.648763C12.5894 0.969944 12.75 1.37025 12.75 1.84967V16.3128L6.5 13.6285L0.25 16.3128Z" fill="#5D5FE3"/>
</svg> <span className='ms-2 d-none d-md-inline'>Saved</span></button>
<button data-bs-toggle="modal" data-bs-target="#studylist_modal" className={`bg-transparent border-0 ${x.study_list_status ? 'd-none':''}`} style={{color:'#8587EA'}} onClick={()=>{
  setdocument_id(x.document_id)
}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
  <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123ZM1.29167 14.6978L6.5 12.4582L11.7083 14.6978V1.84919C11.7083 1.68894 11.6416 1.54204 11.508 1.40848C11.3745 1.27494 11.2276 1.20817 11.0673 1.20817H1.93268C1.77244 1.20817 1.62554 1.27494 1.49198 1.40848C1.35844 1.54204 1.29167 1.68894 1.29167 1.84919V14.6978Z" fill="#5D5FE3"/>
</svg> <span className='ms-1 d-none d-md-inline'>Save</span></button>
                          </div>
                          <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                          <img src={x.user_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.user_details.profile_pic !=null ?'':'d-none'}`}/>
                          {x.user_details.nickname !=undefined ? (<p className={x.user_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.user_details.nickname.slice(0,1)}</span><span>{x.user_details.nickname.slice(-1)}</span></p>):(<></>)}
                         {x.user_details.nickname}<span style={{color:'#8E9696'}} className='ms-1'>{x.created_on}</span></p>
                          </div>
                          <div className='d-lg-block d-none'>
                          <div className="m-0 d-flex align-items-center mt-2">
                          <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
  <path d="M7.50016 11.2261L3.81425 7.54021L4.55144 6.79102L6.97933 9.21891V0.208496H8.021V9.21891L10.4489 6.79102L11.1861 7.54021L7.50016 11.2261ZM1.89118 14.7918C1.41175 14.7918 1.01145 14.6312 0.690267 14.3101C0.369086 13.9889 0.208496 13.5886 0.208496 13.1091V10.5851H1.25016V13.1091C1.25016 13.2694 1.31693 13.4163 1.45048 13.5498C1.58403 13.6834 1.73094 13.7502 1.89118 13.7502H13.1091C13.2694 13.7502 13.4163 13.6834 13.5498 13.5498C13.6834 13.4163 13.7502 13.2694 13.7502 13.1091V10.5851H14.7918V13.1091C14.7918 13.5886 14.6312 13.9889 14.3101 14.3101C13.9889 14.6312 13.5886 14.7918 13.1091 14.7918H1.89118Z" fill="#8E9696"/>
</svg><span className='ms-1'>{x.download_count} <span className='d-lg-inline d-none'>Downloads</span></span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg>  <span className='ms-2'>{x.discussion_count} Discussions</span></span>
                        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.pages} Pages</span></span>
        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.likes} Likes</span></span>
</div>
                          </div>

{/* ----------------------------------------MOBILE SCREEN-------------------------------------------------------------- */}
<div className='d-sm-block d-md-block d-lg-none'>
<div className="m-0 d-flex align-items-center mt-2">
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" className='ms-3 d-flex align-items-center'
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Rating" style={{fontSize:'14px',color:'#AAB0B0'}}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
        <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.followers_count}</span></span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Comments" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      </svg> <span className='ms-2'></span> {x.replies_count}</span>
                        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Pages Count" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
        <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#8E9696"/>
      </svg> <span className='ms-2'>{x.pages}</span></span>
        <span data-bs-toggle="tooltip" data-bs-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="Likes" style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
      </svg> <span className='ms-2'>{x.average_rating}</span></span>
                      
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

{/* --------------------------------------------Created Flashcards Layout Section--------------------------------------- */}

  <div className={`tab-pane fade bg-light mt-3 ${value==="uploaded_flashcards" ? 'show active' : ''}`} id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
 <div>
 <div className='d-flex justify-content-between bg-white shadow-sm py-3 px-3 align-items-center mb-3'>
            <span className=''>{createdFlashsets.length} Flashsets</span>
            <div className='d-flex'>
              <div>
              <div className="input-group bg-light rounded border">
  <span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
  </svg></span>
  <input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search} onChange={(e)=>{
    searchCreatedflashsets(e.target.value)
  }} aria-label="Username" aria-describedby="basic-addon1" style={{fontSize:'14px'}}/>
  </div>
              </div>
              <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light' onChange={(e)=>{
                filtercreatedflashsets(e.target.value)
              }}>
  <option value="all" className='mt-2'>All</option>
    <option value="likes" className=''>Likes</option>
    <option value="date" className=''>Date</option>
  
  </select>
            </div>
          </div>
          <h6 className={`text-secondary text-center mt-4 ${createdFlashsets.length>0 ? 'd-none':''}`}>Create your Flashsets !!!</h6>
  <div className={`${createdFlashsets.length>0 ? '':'d-none'}`}>
    {createdFlashsets.map((x)=>{
        return(
          <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
            <div className="row m-0 align-items-center ps-3">
            <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px',border:'0.5px solid #21B3A9'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                        <div className="col-10 ps-0 col-lg-10 ms-md-0 d-flex flex-column justify-content-center ">
                         <div className="row m-0 border-bottom">
                         <div className='d-flex justify-content-between'>
                        <Link to={`/viewflashcard/course/""/${x.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.name}</Link>
                        <button className={`bg-transparent border-0 ${x.studylist_status ? 'd-none':' d-flex align-items-center'}`} style={{color:'#8587EA'}} onClick={()=>{
                          setflashsetid(x.flashset_id)
                        }} data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M6.25 20.3123V5.84919C6.25 5.36976 6.41059 4.96946 6.73177 4.64827C7.05295 4.32709 7.45325 4.1665 7.93268 4.1665H17.0673C17.5467 4.1665 17.947 4.32709 18.2682 4.64827C18.5894 4.96946 18.75 5.36976 18.75 5.84919V20.3123L12.5 17.628L6.25 20.3123ZM7.29167 18.6978L12.5 16.4582L17.7083 18.6978V5.84919C17.7083 5.68894 17.6416 5.54204 17.508 5.40848C17.3745 5.27494 17.2276 5.20817 17.0673 5.20817H7.93268C7.77244 5.20817 7.62554 5.27494 7.49198 5.40848C7.35844 5.54204 7.29167 5.68894 7.29167 5.84919V18.6978Z" fill="#5D5FE3"/>
</svg>
                      <span className='ms-1'>Save</span></button>

                      <button className={`bg-transparent border-0 ${x.studylist_status ? ' d-flex align-items-center':'d-none'}`} style={{color:'#8587EA'}} onClick={()=>{
                          unsave_flashset(x.flashset_id)
                        }}>
                          <svg className={`${x.studylist_status ? '':'d-none'}`} xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                        <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123Z" fill="#5D5FE3"/>
                      </svg>
                      <span className='ms-1'>Saved</span></button>
                        </div>
                         <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                         <img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.profile_pic !=null ?'':'d-none'}`}/>
                         {x.nickname && ( <p className={x.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.nickname.slice(0,1)}</span><span>{x.nickname.slice(-1)}</span></p> )}
                         {x.nickname} <span className='ms-1 text-secondary'>{x.time_since_created}</span></p>
                        </div>        
                        <div className="m-0 d-flex align-items-center mt-2">
      
        <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
      <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M1.50123 17.146L1.29691 17.0618C0.74536 16.8228 0.3751 16.4255 0.186124 15.8699C-0.00285151 15.3144 0.0241884 14.7742 0.267244 14.2493L1.50123 11.5891V17.146ZM6.46917 18.7966C5.89626 18.7966 5.4058 18.5926 4.99782 18.1846C4.58983 17.7766 4.38584 17.2862 4.38584 16.7133V12.5867L6.38506 18.1195C6.43714 18.2544 6.48922 18.3749 6.54131 18.4811C6.59339 18.5873 6.66284 18.6924 6.74964 18.7966H6.46917ZM10.5116 17.8511C10.2365 17.966 9.96544 17.9499 9.69834 17.803C9.43126 17.6561 9.24028 17.4384 9.12542 17.15L4.49001 4.44164C4.37516 4.16654 4.38585 3.89444 4.52206 3.62534C4.65828 3.35622 4.86394 3.16625 5.13904 3.05542L13.0036 0.190833C13.2787 0.0759722 13.5432 0.0919967 13.7969 0.238906C14.0507 0.385816 14.235 0.603499 14.3498 0.891954L18.9852 13.5602C19.1001 13.8487 19.0994 14.1308 18.9832 14.4066C18.867 14.6824 18.6647 14.8757 18.3762 14.9865L10.5116 17.8511ZM8.63264 6.4168C8.92777 6.4168 9.17517 6.31697 9.37482 6.11732C9.57448 5.91767 9.6743 5.67027 9.6743 5.37513C9.6743 5.07999 9.57448 4.8326 9.37482 4.63294C9.17517 4.43329 8.92777 4.33346 8.63264 4.33346C8.3375 4.33346 8.0901 4.43329 7.89045 4.63294C7.69079 4.8326 7.59097 5.07999 7.59097 5.37513C7.59097 5.67027 7.69079 5.91767 7.89045 6.11732C8.0901 6.31697 8.3375 6.4168 8.63264 6.4168ZM10.1431 16.8335L18.0076 13.9689L13.3722 1.20846L5.50764 4.07305L10.1431 16.8335Z" fill="#2A3941"/>
</svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

      <span className=''>
      <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
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



{/* --------------------------------------------Saved flashsets layout section------------------------------------------- */}

  <div className={`tab-pane fade bg-light mt-3 ${value==="followed_flashcards" ? 'show active' : ''}`} id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">
<div>
<div className='d-flex justify-content-between bg-white shadow-sm py-3 px-3 align-items-center mb-3'>
          <span className=''>{savedFlashsets.length} Flashsets</span>
          <div className='d-flex'>
            <div>
            <div className="input-group bg-light rounded border">
<span className="input-group-text bg-transparent border-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></span>
<input type="text" className="form-control bg-transparent border-0 ps-0 sub-search" placeholder={translate_value.common_words.search} onChange={(e)=>{
  searchSavedflashsets(e.target.value)
}} aria-label="Username" aria-describedby="basic-addon1" style={{fontSize:'14px'}}/>
</div>
            </div>
            <select name="" id="filter" className='border border-secondary py-1 px-2 px-md-3 rounded bg-light ms-2' onChange={(e)=>{
              filtersavedflashsets(e.target.value)
            }}>
<option value="all" className='mt-2'>All</option>
  <option value="likes" className=''>Likes</option>
  <option value="date" className=''>Date</option>

</select>
          </div>
        </div>

        <h6 className={`text-secondary text-center mt-4 ${savedFlashsets.length>0 ? 'd-none':''}`}>No Flashsets available under Saved list !!!</h6>
<div  className={`${searchedFlashsets.length>0 ? 'd-none':''}`}>
  {savedFlashsets.map((x)=>{
      return(
        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
          <div className="row m-0 align-items-center ps-3">
          <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px',border:'0.5px solid #21B3A9'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                      <div className="col-10 ps-0 col-lg-10 ms-md-0 d-flex flex-column justify-content-center ">
                       <div className="row m-0 border-bottom">
                        <div className='d-flex justify-content-between'>
                        {x.flashset_details && x.flashset_details.flashset_id!=undefined ? (<Link to={`/viewflashcard/group/""/${x.flashset_details.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.flashset_details.name}</Link>):(<></>)}
                        <button className={`bg-transparent border-0 ${x.flashset_details.studylist_status ? 'd-none':' d-flex align-items-center'}`} style={{color:'#8587EA'}} onClick={()=>{
                          setflashsetid(x.flashset_details.flashset_id)
                        }} data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M6.25 20.3123V5.84919C6.25 5.36976 6.41059 4.96946 6.73177 4.64827C7.05295 4.32709 7.45325 4.1665 7.93268 4.1665H17.0673C17.5467 4.1665 17.947 4.32709 18.2682 4.64827C18.5894 4.96946 18.75 5.36976 18.75 5.84919V20.3123L12.5 17.628L6.25 20.3123ZM7.29167 18.6978L12.5 16.4582L17.7083 18.6978V5.84919C17.7083 5.68894 17.6416 5.54204 17.508 5.40848C17.3745 5.27494 17.2276 5.20817 17.0673 5.20817H7.93268C7.77244 5.20817 7.62554 5.27494 7.49198 5.40848C7.35844 5.54204 7.29167 5.68894 7.29167 5.84919V18.6978Z" fill="#5D5FE3"/>
</svg>
                      <span className='ms-1'>Save</span></button>

                      <button className={`bg-transparent border-0 ${x.flashset_details.studylist_status ? ' d-flex align-items-center':'d-none'}`} style={{color:'#8587EA'}} onClick={()=>{
                          unsave_flashset(x.flashset_details.flashset_id)
                        }}>
                          <svg className={`${x.flashset_details.studylist_status ? '':'d-none'}`} xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                        <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123Z" fill="#5D5FE3"/>
                      </svg>
                      <span className='ms-1'>Saved</span></button>
                        </div>
                        <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                       {x.flashset_details && x.flashset_details.profile_pic!=undefined ? (<img src={x.flashset_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.flashset_details.profile_pic !=null ?'':'d-none'}`}/>):(<></>)}
                       {x.flashset_details && x.flashset_details.nickname!=undefined ? ( <p className={x.flashset_details.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.flashset_details.nickname.slice(0,1)}</span><span>{x.flashset_details.nickname.slice(-1)}</span></p> ):(<></>)}
                       {x.flashset_details && x.flashset_details.nickname!=undefined ? `${x.flashset_details.nickname}` : ''} <span className='ms-1 text-secondary'>{x.flashset_details.time_since_created}</span></p>
                      </div>        
                      <div className="m-0 d-flex align-items-center mt-2">
    
                      {x.flashset_details && x.flashset_details.upvote_count!=undefined ? (<span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashset_details.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>):(<></>)}
    
{x.flashset_details && x.flashset_details.flashcards_count!=undefined ? (<span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M1.50123 17.146L1.29691 17.0618C0.74536 16.8228 0.3751 16.4255 0.186124 15.8699C-0.00285151 15.3144 0.0241884 14.7742 0.267244 14.2493L1.50123 11.5891V17.146ZM6.46917 18.7966C5.89626 18.7966 5.4058 18.5926 4.99782 18.1846C4.58983 17.7766 4.38584 17.2862 4.38584 16.7133V12.5867L6.38506 18.1195C6.43714 18.2544 6.48922 18.3749 6.54131 18.4811C6.59339 18.5873 6.66284 18.6924 6.74964 18.7966H6.46917ZM10.5116 17.8511C10.2365 17.966 9.96544 17.9499 9.69834 17.803C9.43126 17.6561 9.24028 17.4384 9.12542 17.15L4.49001 4.44164C4.37516 4.16654 4.38585 3.89444 4.52206 3.62534C4.65828 3.35622 4.86394 3.16625 5.13904 3.05542L13.0036 0.190833C13.2787 0.0759722 13.5432 0.0919967 13.7969 0.238906C14.0507 0.385816 14.235 0.603499 14.3498 0.891954L18.9852 13.5602C19.1001 13.8487 19.0994 14.1308 18.9832 14.4066C18.867 14.6824 18.6647 14.8757 18.3762 14.9865L10.5116 17.8511ZM8.63264 6.4168C8.92777 6.4168 9.17517 6.31697 9.37482 6.11732C9.57448 5.91767 9.6743 5.67027 9.6743 5.37513C9.6743 5.07999 9.57448 4.8326 9.37482 4.63294C9.17517 4.43329 8.92777 4.33346 8.63264 4.33346C8.3375 4.33346 8.0901 4.43329 7.89045 4.63294C7.69079 4.8326 7.59097 5.07999 7.59097 5.37513C7.59097 5.67027 7.69079 5.91767 7.89045 6.11732C8.0901 6.31697 8.3375 6.4168 8.63264 6.4168ZM10.1431 16.8335L18.0076 13.9689L13.3722 1.20846L5.50764 4.07305L10.1431 16.8335Z" fill="#2A3941"/>
</svg> <span className='ms-2'>{x.flashset_details.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>):(<></>)}


    {x.flashset_details && x.flashset_details.viewcount!=undefined ? (<span className=''>
    <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
</svg><span className='ms-2'>{x.flashset_details.viewcount}</span></span>
    </span>):(<></>)}
    
</div>
                     
                      </div>      
                  </div>
                  
        </div>
      )
    })}
</div>

{/* ----------------------------------------------Filtered saved flashsets---------------------------------------------- */}
<div className={`${searchedFlashsets.length>0 ? '':'d-none'}`}>
  {searchedFlashsets.map((x)=>{
      return(
        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
          <div className="row m-0 align-items-center ps-3">
          <div className="col-3 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px',border:'0.5px solid #21B3A9'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                      <div className="col-10 ps-0 col-lg-10 ms-md-0 d-flex flex-column justify-content-center ">
                       <div className="row m-0 border-bottom">
                       <div className='d-flex justify-content-between'>
                        <Link to={`/viewflashcard/course/""/${x.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.name}</Link>
                        <button className={`bg-transparent border-0 ${x.studylist_status ? 'd-none':' d-flex align-items-center'}`} style={{color:'#8587EA'}} onClick={()=>{
                          setflashsetid(x.flashset_id)
                        }} data-bs-toggle="modal" data-bs-target="#flashcard_studylist_modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M6.25 20.3123V5.84919C6.25 5.36976 6.41059 4.96946 6.73177 4.64827C7.05295 4.32709 7.45325 4.1665 7.93268 4.1665H17.0673C17.5467 4.1665 17.947 4.32709 18.2682 4.64827C18.5894 4.96946 18.75 5.36976 18.75 5.84919V20.3123L12.5 17.628L6.25 20.3123ZM7.29167 18.6978L12.5 16.4582L17.7083 18.6978V5.84919C17.7083 5.68894 17.6416 5.54204 17.508 5.40848C17.3745 5.27494 17.2276 5.20817 17.0673 5.20817H7.93268C7.77244 5.20817 7.62554 5.27494 7.49198 5.40848C7.35844 5.54204 7.29167 5.68894 7.29167 5.84919V18.6978Z" fill="#5D5FE3"/>
</svg>
                      <span className='ms-1'>Save</span></button>

                      <button className={`bg-transparent border-0 ${x.studylist_status ? ' d-flex align-items-center':'d-none'}`} style={{color:'#8587EA'}} onClick={()=>{
                          unsave_flashset(x.flashset_id)
                        }}>
                          <svg className={`${x.studylist_status ? '':'d-none'}`} xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
                        <path d="M0.25 16.3123V1.84919C0.25 1.36976 0.41059 0.969455 0.731771 0.648275C1.05295 0.327094 1.45325 0.166504 1.93268 0.166504H11.0673C11.5467 0.166504 11.947 0.327094 12.2682 0.648275C12.5894 0.969455 12.75 1.36976 12.75 1.84919V16.3123L6.5 13.628L0.25 16.3123Z" fill="#5D5FE3"/>
                      </svg>
                      <span className='ms-1'>Saved</span></button>
                        </div>
                        <p className='mt-1 d-flex align-items-center' style={{fontSize:'14px',color:'#5D5FE3'}}>
                       {x.profile_pic!=undefined ? (<img src={x.profile_pic} width={28} height={28} className={`me-1 rounded-circle ${x.profile_pic !=null ?'':'d-none'}`}/>):(<></>)}
                       {x.nickname!=undefined ? ( <p className={x.profile_pic ==null ? 'd-flex justify-content-center bg-warning text-white rounded-circle my-auto align-items-center me-2' : 'd-none'} style={{width:'30px',height:'30px',fontSize:'15px'}}><span>{x.nickname.slice(0,1)}</span><span>{x.nickname.slice(-1)}</span></p> ):(<></>)}
                       {x.nickname}
                       {x.time_since_created!=undefined ? (<span className='ms-2 text-secondary'>{x.time_since_created}</span>):(<></>)}</p>
                      </div>        
                      <div className="m-0 d-flex align-items-center mt-2">
    
                      {x.upvote_count!=undefined ? (<span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M15.1891 18.8335H4.73237V7.37514L11.2628 0.924805L11.7236 1.38556C11.8184 1.48037 11.8982 1.6019 11.9629 1.75014C12.0277 1.89837 12.0601 2.03459 12.0601 2.15879V2.32306L10.9944 7.37514H18.234C18.6693 7.37514 19.0586 7.54675 19.4018 7.88996C19.7451 8.23317 19.9167 8.62246 19.9167 9.05783V10.3399C19.9167 10.4347 19.906 10.5382 19.8846 10.6504C19.8633 10.7626 19.8352 10.8661 19.8005 10.9609L16.9559 17.7037C16.813 18.0242 16.5727 18.2926 16.2348 18.509C15.8969 18.7253 15.5483 18.8335 15.1891 18.8335ZM5.77404 17.7918H15.1891C15.336 17.7918 15.4862 17.7518 15.6398 17.6716C15.7934 17.5915 15.9103 17.4579 15.9904 17.271L18.875 10.5001V9.05783C18.875 8.87086 18.8149 8.71729 18.6947 8.5971C18.5745 8.4769 18.4209 8.41681 18.234 8.41681H9.70031L10.9062 2.7277L5.77404 7.81986V17.7918ZM4.73237 7.37514V8.41681H1.16667V17.7918H4.73237V18.8335H0.125V7.37514H4.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>):(<></>)}
    
{x.flashcards_count!=undefined ? (<span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
  <path d="M1.50123 17.146L1.29691 17.0618C0.74536 16.8228 0.3751 16.4255 0.186124 15.8699C-0.00285151 15.3144 0.0241884 14.7742 0.267244 14.2493L1.50123 11.5891V17.146ZM6.46917 18.7966C5.89626 18.7966 5.4058 18.5926 4.99782 18.1846C4.58983 17.7766 4.38584 17.2862 4.38584 16.7133V12.5867L6.38506 18.1195C6.43714 18.2544 6.48922 18.3749 6.54131 18.4811C6.59339 18.5873 6.66284 18.6924 6.74964 18.7966H6.46917ZM10.5116 17.8511C10.2365 17.966 9.96544 17.9499 9.69834 17.803C9.43126 17.6561 9.24028 17.4384 9.12542 17.15L4.49001 4.44164C4.37516 4.16654 4.38585 3.89444 4.52206 3.62534C4.65828 3.35622 4.86394 3.16625 5.13904 3.05542L13.0036 0.190833C13.2787 0.0759722 13.5432 0.0919967 13.7969 0.238906C14.0507 0.385816 14.235 0.603499 14.3498 0.891954L18.9852 13.5602C19.1001 13.8487 19.0994 14.1308 18.9832 14.4066C18.867 14.6824 18.6647 14.8757 18.3762 14.9865L10.5116 17.8511ZM8.63264 6.4168C8.92777 6.4168 9.17517 6.31697 9.37482 6.11732C9.57448 5.91767 9.6743 5.67027 9.6743 5.37513C9.6743 5.07999 9.57448 4.8326 9.37482 4.63294C9.17517 4.43329 8.92777 4.33346 8.63264 4.33346C8.3375 4.33346 8.0901 4.43329 7.89045 4.63294C7.69079 4.8326 7.59097 5.07999 7.59097 5.37513C7.59097 5.67027 7.69079 5.91767 7.89045 6.11732C8.0901 6.31697 8.3375 6.4168 8.63264 6.4168ZM10.1431 16.8335L18.0076 13.9689L13.3722 1.20846L5.50764 4.07305L10.1431 16.8335Z" fill="#2A3941"/>
</svg> <span className='ms-2'>{x.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>):(<></>)}

    {x.viewcount!=undefined ? (<span className=''>
    <span  style={{fontSize:'14px',color:'#AAB0B0'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
</svg><span className='ms-2'>{x.viewcount}</span></span>
    </span>):(<></>)}
    
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

<Create_flashcard_study_list setCount={setCount} flashset_id={flashsetid} call_function={call_func2}/>
<Create_study_list document_id={document_id} setCount={setCount} call_function={call_func}/>
<Backtotop/>
    </div>
  )}
  </div>
  )
}

export default UserFiles