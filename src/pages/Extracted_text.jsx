import React, { useEffect, useState,useContext } from 'react'
import Mainsidebar from '../components/Mainsidebar'
import Navbar from '../components/Navbar'
import { Link, useParams } from 'react-router-dom'
import { ipaddress } from '../App'
import { Context } from '../context/Context_provider'
import axiosInstance from './axiosInstance'

const Extracted_text = () => {

  let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

    const {id}=useParams()
    const[extracted_text,setExtracted_text]=useState({})

    useEffect(()=>{
      axiosInstance.get(`${ipaddress}/DisplayDocumentText/${id}/`)
      .then((r)=>{
        // console.log("Extracted Text",r.data)
        setExtracted_text(r.data)
        document.getElementById('extracted_text_container').innerHTML=r.data.text
      })
    },[])

  return (
    <div className='d-flex'>
        <Mainsidebar/>
        <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        <Navbar/>
        <div onClick={()=>{
          setnavbar_dropdown_visible(false)
        }} className="w-100 row m-0">
        <h5 className='pb-2 d-flex align-items-center' style={{color:'#5d5fe3'}}><Link to={`/showpdf/${id}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5d5fe3" className="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg></Link> <span className='ms-2'>Extracted Text</span></h5>
            <div className="col-lg-8" style={{height:'80vh',overflowY:'auto'}}>
                <div id='extracted_text_container' className='bg-white p-5 rounded shadow-sm'>
                
                </div>
            </div>
            <div className="col-lg-4 px-1 px-md-3">
              <div className='bg-white d-flex flex-column align-items-center py-3' style={{height:'80vh'}}>
              <img src={require('../img/images_icons/mascot1.png')} style={{height:'350px',width:'150px'}} alt="" />
              <p className='fw-medium fs-5 m-0 mt-3' style={{color:'#5d5fe3'}}>Here is your Extracted Text ...</p>
              </div>
              
            </div>
        </div>

        </div>

    </div>
  )
}

export default Extracted_text