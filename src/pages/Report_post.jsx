import React from 'react'
import { useState,useEffect } from 'react'
import { ipaddress } from '../App'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'

const Report_post = ({report_status,setreport_status,count,setCount,discussion_id,setindex1,disc_type}) => {

    const user=JSON.parse(sessionStorage.getItem('user'))
    const[reportreason,setReportreason]=useState("")

    const reportPost=()=>{

    if(disc_type==="university"){
        axiosInstance.post(`${ipaddress}/UniversityDiscussionReport/${user.user_id}/${discussion_id}/`,{
            'reason':reportreason
          })
          .then((r)=>{
            console.log("Successfully reported")
            setReportreason("")
            toast.warn('Comment reported',{
              autoClose:2000,
            })
        setCount((prev)=>prev+1)
        setreport_status(false)
        setindex1(-1)
          })
          .catch(()=>{
            console.log(reportreason,discussion_id)
          })
    }

    if(disc_type==="subject"){
        axiosInstance.post(`${ipaddress}/CourseDiscussionReport/${user.user_id}/${discussion_id}/`,{
            'reason':reportreason
          })
          .then((r)=>{
            console.log("Subject comment reported")
            setReportreason("")
            toast.warn('Comment reported',{
              autoClose:2000,
            })
        setCount((prev)=>prev+1)
        setreport_status(false)
        setindex1(-1)
          })
          .catch((err)=>{
            console.log("Subject discussion report error",err)
          })
    }

    if(disc_type==="group"){
        axiosInstance.post(`${ipaddress}/GroupDiscussionReport/${user.user_id}/${discussion_id}/`,{
            'reason':reportreason
          })
          .then((r)=>{
            setReportreason("")
            toast.warn('Comment reported',{
              autoClose:2000,
            })
        setCount((prev)=>prev+1)
        setreport_status(false)
        setindex1(-1)
          })
          .catch(()=>{
            console.log(reportreason,discussion_id)
          })
    }

    if(disc_type==="document"){
        axiosInstance.post(`${ipaddress}/DocumentCommentReport/${user.user_id}/${discussion_id}/`,{
            'reason':reportreason
          })
          .then((r)=>{
            setReportreason("")
            toast.warn('Comment reported',{
              autoClose:2000,
            })
        setCount((prev)=>prev+1)
        setreport_status(false)
        setindex1(-1)
          })
          .catch(()=>{
            console.log(reportreason,discussion_id)
          })
    }
    }
  return (
<div className={`${report_status ? 'animate__animated animate__fadeIn':'d-none'}`} style={{ backgroundColor: 'rgb(0, 0, 0,0.6)', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 6, height: '100%' }}>
            {/* -----------------------To report the post form-------------------------------- */}
            <div className="container py-4 d-flex align-items-center justify-content-center px-2 px-lg-5" style={{ height: '100vh'}}>
<div className='bg-white rounded px-3 py-3 w-75'>
    <div className='d-flex justify-content-between'>
    <h6 className='pb-2 ps-1 fs-5'>Report the Post</h6>
            <svg onClick={()=>{
                setreport_status(false)
            }} style={{cursor:'pointer'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>
    </div>
            <div>
              <textarea value={reportreason} onChange={(e)=>{
                setReportreason(e.target.value)
              }} name="" className="form-control" id=""></textarea>
              <div className="text-end mt-3">
              <button className="btn btn-sm text-white" style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
                reportPost()
              }}>Send</button>
              </div>
            </div>
          </div>
          </div>
</div>
  )
}

export default Report_post