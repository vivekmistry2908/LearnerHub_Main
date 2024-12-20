import React from 'react'
import { useState,useEffect } from 'react'
import { ipaddress } from '../App'
import axiosInstance from './axiosInstance'

const Particular_group_details_page = ({group_id}) => {

    const user=JSON.parse(sessionStorage.getItem('user'))
    useEffect(()=>{
        fetchgroupdetails()
    },[count])
// -------------------------------------Function to fetch the particular Group details------------------------------------

const[groupdetails,setgroupdetails]=useState({})
const[group_members,setgroup_members]=useState([])

const fetchgroupdetails=()=>{
    axiosInstance.get(`${ipaddress}/DisplayGroupDetails/${group_id}/${user.user_id}/`)
    .then((r)=>{
      console.log("Particular Group Details",r.data.data)
      setgroupdetails(r.data.data)
      setgroupdetails(r.data.members)
    })
    .catch((err)=>{
      console.log("Particular group error",err)
    })
  }
  return (
    <div>
        <div class="modal fade" id="group_details_modal" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
<div class="modal-dialog modal-lg">
  <div class="modal-content">
    <div class="modal-body pt-4 pb-3">
       <div className='row m-0'>
          <div className="col-sm-6 d-flex align-items-center">
          <img src={groupdetails.group_image} style={{width:'100%'}} alt="" />
        </div>
        <div className="col-sm-6">
         {groupdetails.group_name!=undefined ? (<h6 className='text-center pb-3 border-bottom'>{groupdetails.group_name}</h6>):(<></>)}
          <div>
            {groupdetails.group_id!=undefined ? (<p className='text-primary fw-medium'>Group Id : <span className='text-dark fw-normal'>{groupdetails.group_id}</span></p>):(<></>)}
            {groupdetails.created_at!=undefined ? (<p className='text-primary fw-medium'>Created on : <span className='text-dark fw-normal'>{groupdetails.created_at.slice(0,10)}</span></p>):(<></>)}

          </div>
          <div className='text-center'>
            <span className='text-secondary' style={{fontSize:'13px'}}>{groupdetails.description}</span>
          </div>
        </div>
       </div>

       <div>

       </div>
    </div>
  </div>
</div>
</div>
    </div>
  )
}

export default Particular_group_details_page