import React, { useEffect, useState } from 'react'
import Admin_sidebar from './Admin_sidebar'
import Admin_navbar from './Admin_navbar'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { ipaddress } from '../App'
import * as XLSX from 'xlsx';

const Admin_documents = () => {
const navigate=useNavigate()
const[value,setvalue]=useState("documents")

  const[document_details,setdocument_details]=useState([])
  const[flashset_details,setflashset_details]=useState([])

  const {course_id}=useParams()

  useEffect(()=>{
      axios.get(`${ipaddress}/admin_app/AdminCourseDocuments/${course_id}/`)
      .then((r)=>{
          // console.log("Documents data",r.data)
          setdocument_details(r.data)
      })
      .catch((err)=>{
          // console.log("Documents fetching error",err)
      })
  },[])


  const fetchflashset=()=>{
    axios.get(`${ipaddress}/admin_app/FlashDetails/${course_id}/`)
    .then((r)=>{
        // console.log("Flashsets data",r.data)
        setflashset_details(r.data)
    })
    .catch((err)=>{
        // console.log("Flashsets fetching error",err)
    })
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(document_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Document_details.xlsx');
  };

  const exportToExcel2 = () => {
    const worksheet = XLSX.utils.json_to_sheet(flashset_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Flashset_details.xlsx');
  };


  return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"course"}/>
            <div className='bg-light container px-3'>

            <div className='d-flex pt-3'>
                <h6 onClick={()=>{
                    setvalue("documents")
                }} className='p-2 px-3' style={{cursor:'pointer',backgroundColor:value==="documents" ? '#5d5fe3':'',color:value==="documents" ? '#fff':'#5d5fe3',border:'1px solid #5d5fe3',borderRadius:'5px 0px 0px 5px'}}>Document</h6>
                <h6 onClick={()=>{
                    setvalue("flashsets")
                    fetchflashset()
                }} className='p-2 px-3' style={{cursor:'pointer',backgroundColor:value==="flashsets" ? '#5d5fe3':'',color:value==="flashsets" ? '#fff':'#5d5fe3',border:'1px solid #5d5fe3',borderRadius:'0px 5px 5px 0px'}}>Flashset</h6>
                </div>


<div className={`${value==='documents' ? '':'d-none'}`}>
<div className='d-flex justify-content-between align-items-center py-3'>
                  <h6 className='m-0 d-flex align-items-center'><span style={{cursor:'pointer'}} onClick={()=>{
          navigate(`/admin_course/${course_id}`)
        }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg></span><span className='ms-2'>Course {value}</span></h6>
              <button className={`btn btn-sm text-white ${document_details.length>0 ? '':'d-none'}`} style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
<h6 className={`text-secondary text-center py-3 ${document_details.length>0 ? 'd-none':''}`}>No records available.....</h6>
<div className={`table-responsive mt-3 rounded ${document_details.length>0  ? '':'d-none'}`}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Document Id</th>
      <th scope="col" className='fw-medium text-secondary'>Document Name</th>
      <th scope="col" className='fw-medium text-secondary'>Title</th>
      <th scope="col" className='fw-medium text-secondary'>Description</th>
      <th scope="col" className='fw-medium text-secondary'>Document Type</th>
      <th scope="col" className='fw-medium text-secondary'>Uploaded on</th>
      <th scope="col" className='fw-medium text-secondary'>Pages</th>
      <th scope="col" className='fw-medium text-secondary'>Likes</th>
      <th scope="col" className='fw-medium text-secondary'>Dislikes</th>
      <th scope="col" className='fw-medium text-secondary'>Download Count</th>
      <th scope="col" className='fw-medium text-secondary'>Discussion Count</th>
      <th scope="col" className='fw-medium text-secondary'>Rating</th>
      <th scope="col" className='fw-medium text-secondary'>Reports Count</th>
      <th scope="col" className='fw-medium text-secondary'>Study List</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Sub Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Chapter Name</th>
      <th scope="col" className='fw-medium text-secondary'>Uploaded By</th>
      <th scope="col" className='fw-medium text-secondary'>User Id</th>
      <th scope="col" className='fw-medium text-secondary'>Views Count</th>

    </tr>
  </thead>
  <tbody>
    {document_details.map((x,index)=>{
        return(
            <>
              <tr>
      <th scope="row">{index+1}</th>
      <td>{x.document_id}</td>
      <td>{x.doc_name}</td>
      <td>{x.file.title}</td>
      <td>{x.doc_description}</td>
      <td>{x.doc_type}</td>
      <td>{x.created_on.slice(0,10)}</td>
      <td>{x.pages}</td>
      <td>{x.likes}</td>
      <td>{x.dis_likes}</td>
      <td>{x.download_count}</td>
      <td>{x.discussion_post_count}</td>
      <td>{x.average_rating}</td>
      <td>{x.reports_count}</td>
      <td>{x.study_list}</td>
      <td>{x.file.sub_cat}</td>
      <td>{x.file.sub_sub_cat!=null ? `${x.file.sub_sub_cat}`:'null'}</td>
      <td>{x.file.sub_sub_sub_cat!=null ? `${x.file.sub_sub_sub_cat}`:'null'}</td>
      <td>{x.file.chapter_name!=null ? `${x.file.chapter_name}`:'null'}</td>
      <td>{x.user_info.nickname}</td>
      <td>{x.user_info.user_id}</td>
      <td>{x.views_count}</td>
    </tr>
            </>
        )
    })}
  </tbody>
</table>
</div>
</div>


{/* Flashset Table */}

<div className={`${value==='flashsets' ? '':'d-none'}`}>
<div className='d-flex justify-content-between align-items-center py-3'>
                  <h6 className='m-0 d-flex align-items-center'><span style={{cursor:'pointer'}} onClick={()=>{
          navigate(`/admin_course/${course_id}`)
        }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg></span><span className='ms-2'>Course {value}</span></h6>
              <button className={`btn btn-sm text-white ${flashset_details.length>0 ? '':'d-none'}`} style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
<h6 className={`text-secondary text-center py-3 ${flashset_details.length>0 ? 'd-none':''}`}>No records available.....</h6>

<div className={`table-responsive mt-3 rounded ${flashset_details.length>0  ? '':'d-none'}`}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Flashset Id</th>
      <th scope="col" className='fw-medium text-secondary'>Flashset Name</th>
      <th scope="col" className='fw-medium text-secondary'>Created by</th>
      <th scope="col" className='fw-medium text-secondary'>Scope</th>
      <th scope="col" className='fw-medium text-secondary'>Flashcard Count</th>
      <th scope="col" className='fw-medium text-secondary'>Language</th>
      <th scope="col" className='fw-medium text-secondary'>Description</th>
      <th scope="col" className='fw-medium text-secondary'>Likes</th>
      <th scope="col" className='fw-medium text-secondary'>Dislikes</th>
      <th scope="col" className='fw-medium text-secondary'>View Count</th>
      <th scope="col" className='fw-medium text-secondary'>Created on</th>
      <th scope="col" className='fw-medium text-secondary'>Tags</th>
      <th scope="col" className='fw-medium text-secondary'>Semester</th>
    </tr>
  </thead>
  <tbody>
    {flashset_details.map((x,index)=>{
        return(
            <>
              <tr>
      <th scope="row">{index+1}</th>
      <td>{x.flashset_id}</td>
      <td>{x.name}</td>
      <td>{x.nickname}</td>
      <td>{x.scope}</td>
      <td>{x.flashcards_count}</td>
      <td>{x.language}</td>
      <td>{x.description}</td>
      <td>{x.like_count}</td>
      <td>{x.dislike_count}</td>
      <td>{x.viewcount}</td>
      <td>{x.time_since_created}</td>
      <td>{x.tags}</td>
      <td>{x.semester_id}</td>
    </tr>
            </>
        )
    })}
  </tbody>
</table>
</div>
</div>
      
            </div>
        </div>
    </div>
  )
}

export default Admin_documents