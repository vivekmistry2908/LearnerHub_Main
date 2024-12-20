import React, { useState } from 'react'
import Admin_navbar from './Admin_navbar'
import Admin_sidebar from './Admin_sidebar'
import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ipaddress } from '../App'
import axios from 'axios'
import * as XLSX from 'xlsx';

const Pending_data = () => {
    const[value,setvalue]=useState("university")

    const[pending_report,setpending_report]=useState([])
    const[pending_course_report,setpending_course_report]=useState([])
    const[pending_group_report,setpending_group_report]=useState([])
    const[pending_program_report,setpending_program_report]=useState([])

    const navigate=useNavigate()

    const[count,setCount]=useState(0)

    useEffect(()=>{
       fetchuniversities()
    },[])

// University
const fetchuniversities=()=>{
    axios.get(`${ipaddress}/admin_app/api/DisplayPendingUniversitiesViewSet/`)
    .then((r)=>{
        // console.log("University Pending data",r.data)
        setpending_report(r.data)
    })
    .catch((err)=>{
        // console.log("University Pending fetching error",err)
    })
}

const accept_or_reject=(status,id)=>{
    axios.patch(`${ipaddress}/admin_app/api/DisplayPendingUniversitiesViewSet/update_status/`,{
        'status':status,
        'university_id':id
    })
    .then((r)=>{
        // console.log("Pending data changed",r.data)
       fetchuniversities()
    })
    .catch((err)=>{
        // console.log("Pending data changing error",err)
    })
}


// Course

const fetchCoursedata=()=>{
    axios.get(`${ipaddress}/admin_app/api/DisplayPendingCoursesViewSet/`)
    .then((r)=>{
        // console.log("Course Pending data",r.data)
        setpending_course_report(r.data)
    })
    .catch((err)=>{
        // console.log("Course Pending fetching error",err)
    })
}

const accept_or_reject_course=(status,id)=>{
    axios.patch(`${ipaddress}/admin_app/api/DisplayPendingCoursesViewSet/update_status/${id}/`,{
        'status':status,
    })
    .then((r)=>{
        // console.log("Pending course data changed",r.data)
       fetchCoursedata()
    })
    .catch((err)=>{
        // console.log("Pending course data changing error",err)
    })
}

// Group

const fetchGroupdata=()=>{
    axios.get(`${ipaddress}/admin_app/api/GroupRequestViewSet/`)
    .then((r)=>{
        // console.log("Group Pending data",r.data)
        setpending_group_report(r.data)
    })
    .catch((err)=>{
        // console.log("Group Pending fetching error",err)
    })
}

const accept_or_reject_group=(status,id)=>{
    axios.patch(`${ipaddress}/admin_app/api/GroupRequestViewSet/update_status/${id}/`,{
        'status':status,
    })
    .then((r)=>{
        // console.log("Pending course data changed",r.data)
       fetchGroupdata()
    })
    .catch((err)=>{
        // console.log("Pending course data changing error",err)
    })
}

// Program

const fetchProgramdata=()=>{
    axios.get(`${ipaddress}/admin_app/PendingPrograms/`)
    .then((r)=>{
        // console.log("Program Pending data",r.data)
        setpending_program_report(r.data)
    })
    .catch((err)=>{
        // console.log("Program Pending fetching error",err)
    })
}

const accept_or_reject_program=(status,id)=>{
    axios.patch(`${ipaddress}/admin_app/PendingPrograms/`,{
        'status':status,
        'program_id':id
    })
    .then((r)=>{
        // console.log("Pending program data changed",r.data)
       fetchProgramdata()
    })
    .catch((err)=>{
        // console.log("Pending program data changing error",err)
    })
}


  // Excel

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pending_report);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'University_pending_details.xlsx');
  };

  const exportToExcel_sub = () => {
    const worksheet = XLSX.utils.json_to_sheet(pending_course_report);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Course_pending_details.xlsx');
  };

  const exportToExcel_group = () => {
    const worksheet = XLSX.utils.json_to_sheet(pending_group_report);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Group_pending_details.xlsx');
  };

  const exportToExcel_program = () => {
    const worksheet = XLSX.utils.json_to_sheet(pending_program_report);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Program_pending_details.xlsx');
  };

return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"pending-data"}/>
            <div className='bg-light container'>
                <h6 className='py-3' style={{color:'#5d5fe3'}}>Pending Details</h6>

                <div className={`mt-2 bg-white py-2 rounded d-flex align-items-center justify-content-evenly`} style={{width:'100%', overflowX: 'auto', overflowY: 'hidden'}}>
       <span className={`py-2 px-3 bg-white me-2 ${value==='university' ? 'fw-medium':''}`} onClick={()=>{
                setvalue("university")
                fetchuniversities()
               }}  style={{fontSize:'16px',cursor:'pointer',color:value==='university' ? '#5d5fe3':'gray',borderBottom:value==='university' ? '2px solid #5d5fe3':'none'}}>University</span>
        
               <span className={`py-2 px-3 bg-white me-2 ${value==='courses' ? 'fw-medium':''}`} onClick={()=>{
                setvalue("courses")
                fetchCoursedata()
               }}  style={{fontSize:'16px',cursor:'pointer',color:value==='courses' ? '#5d5fe3':'gray',borderBottom:value==='courses' ? '2px solid #5d5fe3':'none'}}>Subjects</span>
               <span onClick={()=>{
                setvalue("groups")
                fetchGroupdata()
               }} className={`py-2 px-3 bg-white me-2 ${value==='groups' ? 'fw-medium':''}`}  style={{fontSize:'16px',cursor:'pointer',color:value==='groups' ? '#5d5fe3':'gray',borderBottom:value==='groups' ? '2px solid #5d5fe3':'none'}}>Group</span>
               <span onClick={()=>{
                setvalue("program")
                fetchProgramdata()
               }} className={`py-2 px-3 bg-white me-2 ${value==='program' ? 'fw-medium':''}`}  style={{fontSize:'16px',cursor:'pointer',color:value==='program' ? '#5d5fe3':'gray',borderBottom:value==='program' ? '2px solid #5d5fe3':'none'}}>Program</span>
              
         
       </div>

{/* University Table */}
<div className={`${value==='university' ? '':'d-none'}`}>
<h6 className={`text-secondary text-center py-4 ${pending_report.length>0 ? 'd-none':''}`}>No Pending University reports available...💬</h6>
       <div className={`table-responsive mt-3 rounded ${pending_report.length>0 ? '':'d-none'}`}>
       <div className='d-flex justify-content-end align-items-center pb-3'>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>SI.No</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Requested by</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>University Name</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Domain</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Country</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>City</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {pending_report.map((x,index)=>{
        return(
              <tr>
      <th scope="row">{index+1}</th>
      <td className={`${value==='university' ? '':'d-none'}`}>{x.user}</td>

      <td className={``}>{x.university_name}-{x.university_id}</td>

      <td className={`${value==='university' ? '':'d-none'}`}>{x.domain}</td>

      <td className={`${value==='university' ? '':'d-none'}`}>{x.country}</td>
      <td className={`${value==='university' ? '':'d-none'}`}>{x.city}</td>
      <td>
        <div className={`${value==='university' ? '':'d-none'}`}>
     <span onClick={()=>{
        accept_or_reject('True',x.university_id)
     }} style={{cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg></span>

<span onClick={()=>{
        accept_or_reject('False',x.university_id)
     }} style={{cursor:'pointer'}} className='ms-0 ms-md-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg></span>
      </div>
</td>
    </tr>
        )
    })}
  </tbody>
</table>
</div>
</div>

{/* Course Table */}
<div className={`${value==='courses' ? '':'d-none'}`}>
<h6 className={`text-secondary text-center py-4 ${pending_course_report.length>0 ? 'd-none':''}`}>No Pending Subject reports available...💬</h6>
       <div className={`table-responsive mt-3 rounded ${pending_course_report.length>0 ? '':'d-none'}`}>
       <div className='d-flex justify-content-end align-items-center pb-3'>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_sub}>
                Export to Excel
              </button>
            </div>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>SI.No</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Requested by</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>University Name</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Subject Name</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {pending_course_report.map((x,index)=>{
        return(
              <tr>
      <th scope="row">{index+1}</th>
      <td className={``}>{x.user_details}</td>

      <td className={``}>{x.universityname}-{x.university_name}</td>

      <td className={``}>{x.course_name}</td>
      <td>
        <div className={``}>
     <span onClick={()=>{
        accept_or_reject_course('True',x.id)
     }} style={{cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg></span>

<span onClick={()=>{
        accept_or_reject_course('False',x.id)
     }} style={{cursor:'pointer'}} className='ms-0 ms-md-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg></span>
      </div>
</td>
    </tr>
        )
    })}
  </tbody>
</table>
</div>
</div>

{/* Group Table */}
<div className={`${value==='groups' ? '':'d-none'}`}>
<h6 className={`text-secondary text-center py-4 ${pending_group_report.length>0 ? 'd-none':''}`}>No Pending Group reports available...💬</h6>
       <div className={`table-responsive mt-3 rounded ${pending_group_report.length>0 ? '':'d-none'}`}>
       <div className='d-flex justify-content-end align-items-center pb-3'>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_group}>
                Export to Excel
              </button>
            </div>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>SI.No</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Requested by</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Requested on</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Group Name</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Group Id</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Category</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Group Description</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {pending_group_report.map((x,index)=>{
        return(
              <tr>
      <th scope="row">{index+1}</th>
      <td className={``}>{x.user_details}</td>
      <td className={``}>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
      <td className={``}>{x.group_name}</td>
      <td className={``}>{x.group_id}</td>
      <td className={``}>{x.category}</td>
      <td className={``}>{x.description}</td>
      <td>
        <div className={``}>
     <span onClick={()=>{
        accept_or_reject_group('True',x.group_id)
     }} style={{cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg></span>

<span onClick={()=>{
        accept_or_reject_group('False',x.group_id)
     }} style={{cursor:'pointer'}} className='ms-0 ms-md-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg></span>
      </div>
</td>
    </tr>
        )
    })}
  </tbody>
</table>
</div>
</div>

{/* Program Table */}
<div className={`${value==='program' ? '':'d-none'}`}>
<h6 className={`text-secondary text-center py-4 ${pending_program_report.length>0 ? 'd-none':''}`}>No Pending Program reports available...💬</h6>
       <div className={`table-responsive mt-3 rounded ${pending_program_report.length>0 ? '':'d-none'}`}>
       <div className='d-flex justify-content-end align-items-center pb-3'>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_program}>
                Export to Excel
              </button>
            </div>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>SI.No</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>Program Id</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Program Name</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>University Id</th>
      <th scope="col" className={`fw-medium text-secondary`} style={{fontSize:'15px'}}>University Name</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {pending_program_report.map((x,index)=>{
        return(
              <tr>
      <th scope="row">{index+1}</th>
      <td className={``}>{x.pid}</td>
      <td className={``}>{x.program_name}</td>
      <td className={``}>{x.uni_name}</td>
      <td className={``}>{x.university_name}</td>
      <td>
        <div className={``}>
     <span onClick={()=>{
        accept_or_reject_program('True',x.pid)
     }} style={{cursor:'pointer'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg></span>

<span onClick={()=>{
        accept_or_reject_program('False',x.pid)
     }} style={{cursor:'pointer'}} className='ms-0 ms-md-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-x-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
</svg></span>
      </div>
</td>
    </tr>
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

export default Pending_data