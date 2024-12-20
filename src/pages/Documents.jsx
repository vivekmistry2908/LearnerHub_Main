import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns';
import { ipaddress } from '../App'
import axiosInstance from './axiosInstance'

const Documents = () => {
 
    const [open,isOpen]=useState(true)
    function open1(){
        isOpen(!open)
        if(open==true){
            document.getElementById('acc-apan2').textContent="-"
        }
        else{
            document.getElementById('acc-apan2').textContent="+"
        }
    }

const[open3,setOpen3]=useState(true)
const openfunc3=()=>{
  setOpen3(!open3)
  if(open3==true){
    document.getElementById('acc-apan3').textContent="-"
}
else{
    document.getElementById('acc-apan3').textContent="+"
}
}

    const[userDocuments,setUserDocuments]=useState([])
    const[count1,setCount1]=useState(0)
const user=JSON.parse(sessionStorage.getItem("user"))
    useEffect(()=>{
      axiosInstance.get(`${ipaddress}/uploadDocuments/${user.user_id}/`)
      .then((r)=>{
        // console.log("Document fetched successfully")
        // console.log(r.data)
        setUserDocuments(r.data)
      })
      .catch((err)=>{
        console.log(err);
      })
    },[count1])

    const deleteFile=(value,event)=>{
      event.preventDefault()
      axiosInstance.delete(`${ipaddress}/SpecificDocumentDisplay/${user.user_id}/${value}`)
      .then((r)=>{
        // console.log("Document Successfully Deleted",r.data)
        setCount1(count1+1)
      })
      .catch(()=>{
        console.log("Error while deleting document")
      })
    }

    // SEARCH DOCUMENT
const[search,setSearchData]=useState("")
const[searchDocs,setSearchDocs]=useState([])
const[searchdocsbyword,setSearchdocsbyword]=useState([])

const searchData=(e)=>{
  setSearchData(e.target.value)
  const searchword=e.target.value
  if(e.target.value.length<=0){
    document.getElementById('doc_search').style.display='none'
    document.getElementById('no_doc').style.display='none'
  }
  else{
    axiosInstance.get(`${ipaddress}/DisplayDocumentSuggestions/${searchword}/${user.user_id}/`)
  .then((r)=>{
    // console.log("Search word send successfully",r.data)
    setSearchdocsbyword(r.data.suggestions)
    if(r.data.suggestions.length>0){
      document.getElementById('doc_search').style.display='block'
      document.getElementById('no_doc').style.display='none'
    }
    else{
      document.getElementById('doc_search').style.display='none'
      document.getElementById('no_doc').style.display='block'
    }
  })
  .catch(()=>{
    console.log("Search word sending error")
  })
  }
}
    const searchDocument=(document_name)=>{
      axiosInstance.get(`${ipaddress}/DocumentSearch/${document_name}/${user.user_id}/`)
      .then((r)=>{
        // console.log("Documents Found ",r.data)
        setSearchDocs(r.data)
        setSearchData(document_name)
    document.getElementById('doc_search').style.display='none'

      })
      .catch(()=>{
        console.log("Search Data Sent Failed")
      })
    }

// -----------------------------------------------FILTER DOCUMENTS----------------------------------------------------------
const[filtereddocuments,setFiltereddocuments]=useState([])
const[filteredratingdocs,setFilteredratingdocs]=useState([])

const filterdocs=(e)=>{
  const value=e.target.value
  if(e.target.value==="likes"){
  filterfunction(`${ipaddress}/userfilteredocuments/${user.user_id}/`)
}
if(e.target.value==="rating"){
  filterfunction(`${ipaddress}/FilterDocumentsByRating/${user.user_id}/`)
}
if(e.target.value==="select_filter"){
  original()
}
if(e.target.value==="date"){
  filterfunction(`${ipaddress}/FilterUserDocumentsByDate/${user.user_id}/`)
}
}
const original=()=>{
  document.getElementById('original').style.display='block'
  document.getElementById('filterlike').style.display='none'
}

const filterfunction=(value)=>{
  axiosInstance.get(value)
  .then((r)=>{
    console.log("Filtered Successfuly",r.data)
    setFiltereddocuments(r.data)
    document.getElementById('original').style.display='none'
    document.getElementById('filterlike').style.display='block'
  })
}

  return (
    <div>
         <div className="d-flex">
         <Mainsidebar activevalue={"documents"}></Mainsidebar>
                <div className="w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
                <Navbar></Navbar>
                <div className='w-100'>
                  <div>
                  <div className="input-group common-search mx-auto mt-5" id='common-search'>
        <input
        onChange={searchData}
        value={search}
          type="search"
          className="home-search form-control w-75 form-control mx-auto outline-0 shadow-none py-3 ps-4"
          placeholder="Document Search...."
          aria-label="Recipient's username"
          aria-describedby="basic-addon2" style={{borderRadius:'0px  0px 0px 0px'}}
        />
      </div>
      <ul className='mx-auto p-0 px-1 py-2 border border-top-0' style={{listStyleType:'none',display:'none'}} id='doc_search'>
        {searchdocsbyword.map((x)=>{
        return(
          <div>
            <li className='py-2 mb-2 bg-light px-2' onClick={()=>{
              searchDocument(x)
            }}><Link className='text-decoration-none'>{x}</Link></li>
          </div>
        )
        })}
      </ul>
      <ul className='mx-auto p-0 px-4 py-3  border border-top-0' style={{listStyleType:'none',display:'none'}} id='no_doc'>
        <h6 className='text-center m-0'>No Matching Documents Found</h6>
      </ul>
                  </div>
                
      <div className=" px-2 mt-5">
      <div className="accordion accordion-flush" id="accordionFlushExample2">
  <div className="accordion-item">
    <h2 className="accordion-header ">
      <button onClick={openfunc3} style={{fontFamily:" 'DM Sans', sans-serif"}} id='acc-btn' className="acc-btn collapsed shadow-sm  border fw-medium w-100  py-3  bg-white d-flex align-items-center justify-content-between py-2" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
       <span className='float-start acc-span'><img src={require('../img/expand.gif')} width={30} className='me-1' alt="" />Expand and View the Documents </span> <span className='float-end plus px-3' id='acc-apan3' style={{fontSize:'24px'}}>+</span>
      </button>
    </h2>
    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div className="accordion-body">
      <ul className="view-doc ps-0" style={{ listStyleType: 'none' }}>
                    {searchDocs.map((x, index) => {
                      // const dateTime = new Date(x.created_on);
                      // const year = dateTime.getFullYear();
                      // const month = dateTime.getMonth() + 1; // Month is zero-based, so we add 1
                      // const day = dateTime.getDate();
                      // const hours = dateTime.getHours();
                      // const minutes = dateTime.getMinutes();
                      // const seconds = dateTime.getSeconds();
                      return(
                        <div>
                           <li
                        key={index}
                        className="py-2 rounded mt-2 px-2 border d-flex justify-content-between"
                      >
                        <div className='d-flex'>
                        <div className='align-items-center d-flex'>
                        <img src={require('../img/documents.png')} width={30} alt="" className='me-2'/>
                        </div>
                        <div className='ms-1'>
                        <Link to={`/showpdf/${x.document_id}`}
                          href="#"
                          className="fw-medium d-flex align-items-center text-decoration-none"
                        >
                          {x.doc_name}
                          
                        </Link>
                        <ul className='d-flex gap-3 p-0' style={{listStyleType:"none"}}>
                        <li>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-calendar-days me-1"></i>{x.created_on}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-file-lines me-1"></i>{x.pages}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-star me-1"></i>{x.average_rating>0 ? `${x.average_rating}` : '0'}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-thumbs-up me-1"></i>{x.followers_count}</a>
                          </li>
                         
                        </ul>
                        
                        </div>
                        </div>
                        
                        <div>
                        <Link to={`/showpdf/${x.document_id}`}
                          className="view-btn btn btn-sm text-white px-3 py-2 text-decoration-none"
                        >
                          View
                        </Link>
                        <a type='button' id="liveToastBtn" href="" onClick={(event)=>{
                          deleteFile(x.document_id, event)
                        }} className='ms-3'>
                        <i className="fa-solid fa-trash-can text-danger"></i>
                        </a>
                        </div>
                        
                      </li>
                        </div>
                      )
                      })}
                  </ul>
      </div>
    </div>
  </div>
</div>
</div>
      <div className="px-2 mt-5">
      <div className="accordion accordion-flush" id="accordionFlushExample2">
  <div className="accordion-item">
    <h2 className="accordion-header ">
      <button onClick={open1} style={{fontFamily:" 'DM Sans', sans-serif"}} id='acc-btn' className="acc-btn collapsed shadow-sm  border fw-medium w-100  py-3  bg-white d-flex align-items-center justify-content-between py-2" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
       <span className='float-start acc-span'><img src={require('../img/expand.gif')} width={30} className='me-1' alt="" />Expand and View the Documents </span> <span className='float-end plus px-3' id='acc-apan2' style={{fontSize:'24px'}}>+</span>
      </button>
    </h2>
    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div className="accordion-body">
      <div className="row">
    <div className='d-flex justify-content-between bg-white shadow-sm py-3 px-3 align-items-center'>
          <span className=''>{userDocuments.length} Documents</span>
<select name="" id="filter" className='border-0 px-2' onChange={filterdocs}>
<option value="select_filter" className='mt-2'>All</option>
  <option value="rating" className=''>Rating</option>
  <option value="likes" className=''>Likes</option>
  <option value="date" className=''>Date</option>

</select>
        </div>
      {/* ORIGINAL */}
      <div id='original'>
      <ul className="view-doc ps-0" style={{ listStyleType: 'none' }}>
      {userDocuments.map((x, index) => {
                      return(
                        <div>
                           <li
                        key={index}
                        className="py-2 rounded mt-2 px-2 border d-flex justify-content-between"
                      >
                        <div className='d-flex'>
                        <div className='align-items-center d-flex'>
                        <img src={require('../img/documents.png')} width={30} alt="" className='me-2'/>
                        </div>
                        <div className='ms-1'>
                        <Link to={`/showpdf/${x.document_id}`}
                          href="#"
                          className="fw-medium d-flex align-items-center text-decoration-none"
                        >
                          {x.doc_name}
                          
                        </Link>
                        <ul className='d-flex gap-3 p-0' style={{listStyleType:"none"}}>
                        <li>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-calendar-days me-1"></i>{x.created_on}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-file-lines me-1"></i>{x.pages}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-star me-1"></i>{x.average_rating>0 ? `${x.average_rating}` : '0'}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-thumbs-up me-1"></i>{x.favourites_count}</a>
                          
                          </li>
                         
                        </ul>
                        
                        </div>
                        </div>
                        
                        <div>
                        {/* <Link to={`/showpdf/${x.document_id}`}
                          className="view-btn btn btn-sm text-white px-3 py-2 text-decoration-none"
                        >
                          View
                        </Link> */}
                        <a type='button' id="liveToastBtn" href="" onClick={(event)=>{
                          deleteFile(x.document_id, event)
                        }} className='ms-3'>
                        <i className="fa-solid fa-trash-can text-danger"></i>
                        </a>
                        </div>
                        
                      </li>
                        </div>
                      )
                      })}
                  </ul>
      </div>

      {/* LIKES*/}
      <div id='filterlike' style={{display:'none'}}>
      {filtereddocuments.map((x, index) => {
                      return(
                        <div>
                           <li
                        key={index}
                        className="align-items-center rounded mt-2 px-2 border d-flex justify-content-between"
                      >
                        <div className='d-flex align-items-center'>
                        <div className=''>
                        <img src={require('../img/documents.png')} width={30} alt="" className='me-2'/>
                        </div>
                        <div className='ms-1 mt-2'>
                        <Link to={`/showpdf/${x.document_id}`}
                          href="#"
                          className="fw-medium text-decoration-none"
                        >
                          {x.doc_name}
                          
                        </Link>
                        <ul className='d-flex gap-3 p-0' style={{listStyleType:"none"}}>
                        <li>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-calendar-days me-1"></i>{x.created_on}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-solid fa-file-lines me-1"></i>{x.pages}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-star me-1"></i>{x.average_rating>0 ? `${x.average_rating}` : '0'}</a>
                          </li>
                          <li className=''>
                          <a href="" className='text-secondary text-decoration-none' style={{fontSize:"13px"}}><i className="fa-regular fa-thumbs-up me-1"></i>{x.followers_count}</a>
                          
                          </li>
                         
                        </ul>
                       
                        </div>
                        </div>
                        
                        <div>
                        {/* <Link to={`/showpdf/${x.document_id}`}
                          className="view-btn btn btn-sm text-white px-3 py-2 text-decoration-none"
                        >
                          View
                        </Link> */}
                        <a type='button' id="liveToastBtn" href="" onClick={(event)=>{
                          deleteFile(x.document_id, event)
                        }} className='ms-3'>
                        <i className="fa-solid fa-trash-can text-danger"></i>
                        </a>
                        </div>
                        
                      </li>
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

                
                </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div className="toast-header">
      <strong className="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div className="toast-body">
      Hello, world! This is a toast message.
    </div>
  </div>
</div>
    </div>
  )
}

export default Documents