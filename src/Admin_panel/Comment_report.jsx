import React, { useState } from 'react'
import Admin_navbar from './Admin_navbar'
import Admin_sidebar from './Admin_sidebar'
import {useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ipaddress } from '../App'
import axios from 'axios'
import * as XLSX from 'xlsx';

const Comment_report = () => {
    const[value,setvalue]=useState("university")

    const[specific_report,setspecific_report]=useState([])

    const navigate=useNavigate()

    const[count,setCount]=useState(0)

    useEffect(()=>{
        axios.get(`${ipaddress}/admin_app/AdminCommentsReports/${value}/`)
        .then((r)=>{
            // console.log("Comment report data",r.data)
            setspecific_report(r.data)
        })
        .catch((err)=>{
            // console.log("Comment report fetching error",err)
        })
    },[value,count])

const deletecomment=(id)=>{
    axios.delete(`${ipaddress}/admin_app/AdminCommentsReports/${value}/${id}/`)
    .then((r)=>{
        // console.log("Comment deleted",r.data)
        setCount(count+1)
    })
    .catch((err)=>{
        // console.log("Comment deleting error",err)
    })
}


  // Excel

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(specific_report);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Comments_report_details.xlsx');
  };

  return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"comment"}/>
            <div className='bg-light container'>
                <h6 className='py-3' style={{color:'#5d5fe3'}}>Reported Comments</h6>

                <div className={`mt-2 bg-white py-2 rounded d-flex align-items-center justify-content-evenly`} style={{width:'100%', overflowX: 'auto', overflowY: 'hidden'}}>
       <span className={`py-2 px-3 bg-white me-2 ${value==='university' ? 'fw-medium':''}`} onClick={()=>{
                setvalue("university")
               }}  style={{fontSize:'16px',cursor:'pointer',color:value==='university' ? '#5d5fe3':'gray',borderBottom:value==='university' ? '2px solid #5d5fe3':'none'}}>University Comments</span>
        
               <span className={`py-2 px-3 bg-white me-2 ${value==='courses' ? 'fw-medium':''}`} onClick={()=>{
                setvalue("courses")
               }}  style={{fontSize:'16px',cursor:'pointer',color:value==='courses' ? '#5d5fe3':'gray',borderBottom:value==='courses' ? '2px solid #5d5fe3':'none'}}>Course Comments</span>
               <span onClick={()=>{
                setvalue("groups")
               }} className={`py-2 px-3 bg-white me-2 ${value==='groups' ? 'fw-medium':''}`}  style={{fontSize:'16px',cursor:'pointer',color:value==='groups' ? '#5d5fe3':'gray',borderBottom:value==='groups' ? '2px solid #5d5fe3':'none'}}>Group Comments</span>
               <span onClick={()=>{
                setvalue("document")
               }} className={`py-2 px-3 bg-white me-2 ${value==='document' ? 'fw-medium':''}`}  style={{fontSize:'16px',cursor:'pointer',color:value==='document' ? '#5d5fe3':'gray',borderBottom:value==='document' ? '2px solid #5d5fe3':'none'}}>Document Comments</span>
              
         
       </div>

<h6 className={`text-secondary text-center py-4 ${specific_report.length>0 ? 'd-none':''}`}>No reported Comments available...💬</h6>
       <div className={`table-responsive mt-3 rounded ${specific_report.length>0 ? '':'d-none'}`}>
       <div className='d-flex justify-content-end align-items-center pb-3'>
                  {/* <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>University Comments</span></h6> */}
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>

            </div>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>SI.No</th>
      <th scope="col" className={`fw-medium text-secondary ${value==='university' ? '':'d-none'}`} style={{fontSize:'15px'}}>University Name</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Posted on</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>User Id</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Discussion Id</th>
      <th scope="col" className='fw-medium text-secondary' style={{fontSize:'15px'}}>Reason</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {specific_report.map((x,index)=>{
        return(
              <tr>
      <th scope="row">{index+1}</th>
      <td className={`${value==='university' ? '':'d-none'}`}>{x.university_name}</td>
      <td>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
      <td>{x.user_details}</td>
      <td className={`${value==='university' ? '':'d-none'}`}>{x.discussion_id}</td>
      <td className={`${value==='courses' ? '':'d-none'}`}>{x.discid}</td>
      <td className={`${value==='groups' ? '':'d-none'}`}>{x.message}</td>
      <td className={`${value==='document' ? '':'d-none'}`}>{x.ddpid}</td>
      <td>{x.reason}</td>
      <td><svg className={`${value==='university' ? '':'d-none'}`} style={{cursor:'pointer'}} onClick={()=>{
        deletecomment(x.discussion_id)
      }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg>

<svg className={`${value==='courses' ? '':'d-none'}`} style={{cursor:'pointer'}} onClick={()=>{
        deletecomment(x.discid)
      }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg>

<svg className={`${value==='groups' ? '':'d-none'}`} style={{cursor:'pointer'}} onClick={()=>{
        deletecomment(x.message)
      }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg>

<svg className={`${value==='document' ? '':'d-none'}`} style={{cursor:'pointer'}} onClick={()=>{
        deletecomment(x.ddpid)
      }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M9.51922 24.9996C8.95993 24.9996 8.48356 24.8029 8.09013 24.4095C7.69671 24.0161 7.5 23.5397 7.5 22.9804V7.49965H6.25V6.24965H11.25V5.28809H18.75V6.24965H23.75V7.49965H22.5V22.9804C22.5 23.5557 22.3073 24.0361 21.9219 24.4215C21.5365 24.8069 21.0561 24.9996 20.4808 24.9996H9.51922ZM21.25 7.49965H8.75V22.9804C8.75 23.2048 8.82211 23.3891 8.96634 23.5333C9.11057 23.6775 9.29486 23.7496 9.51922 23.7496H20.4808C20.6731 23.7496 20.8494 23.6695 21.0096 23.5093C21.1699 23.349 21.25 23.1727 21.25 22.9804V7.49965ZM12.2596 21.2496H13.5096V9.99965H12.2596V21.2496ZM16.4904 21.2496H17.7404V9.99965H16.4904V21.2496Z" fill="black"/>
</svg>
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
  )
}

export default Comment_report