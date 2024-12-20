import React, { useEffect, useState,useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { ipaddress } from '../App'
import Backtotop from './Backtotop'
import { Context } from '../context/Context_provider'
import axiosInstance from './axiosInstance'

const Rewards = () => {
    let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

    const[creditCount,setCreditCount]=useState({})
    const[rewardCredits,setRewardCredit]=useState([])
    const user=JSON.parse(sessionStorage.getItem('user'))
    useEffect(()=>{
        axiosInstance.get(`${ipaddress}/user_total_credits/${user.user_id}/`)
        .then((r)=>{
            console.log("Credit count Fetched ",r.data)
            setCreditCount(r.data)
        })
        .catch(()=>
        console.log("Credit fetch error"))

        axiosInstance.get(`${ipaddress}/TotalCreditsByActionAPIView/${user.user_id}/`)
        .then((r)=>{
            console.log("Successfully credits fetched",r.data)
            setRewardCredit(r.data)
        })
        .catch(()=>{
            console.log("Credit fetching error")
        })
    },[])
  return (
    <div className='d-flex'>
        <Mainsidebar></Mainsidebar>
        <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="w-100 pt-5 mt-2 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        <Navbar></Navbar>
                <div onClick={()=>{
                    setnavbar_dropdown_visible(false)
                }} className='w-100'>
                    <div className="my-3 mx-auto px-2 px-md-4 py-3">
                        <div className='rewards p-4 rounded'>
                            <h1 className='fs-3 text-white' style={{fontWeight:500}}>Rewards Store</h1>
                            <button className='bg-white px-4 border-0 py-2 mt-5 d-flex align-items-center'>Your Balance : <span className='fw-bold text-warning ms-2 me-2'>{creditCount.credits}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <circle cx="17.5" cy="17.5" r="17.25" fill="#F4CD00" stroke="#2A3941" stroke-width="0.5"/>
  <path d="M14.4423 29.106L15.6923 20.5002H10.3798L19.7308 7.01465H20.3077L19.0817 16.7502H25.3317L15.0192 29.106H14.4423Z" fill="white"/>
</svg></button>
                        </div>
                        <div className='mt-3'>
                            <h3 className='fs-3 text-center m-0' style={{fontWeight:600}}>Earned Credits</h3>
                            <div className="row mx-auto justify-content-between text-center">
                            {rewardCredits.map((x)=>{
                                return(
                                <>
                                    <div className="col-lg-4 col-md-5  px-4 py-4 rounded">
                                    <div className='rewards-specification rounded'>
                                    <p className='my-auto'><span className='fw-medium' style={{color:'#f4cd00'}}>{x.total_credits} Credit</span> <span className='text-white'> for {x.action}</span></p>
                                    </div>
                                    </div>
                                </> 
                                )
                            })}
                        </div>
                        </div>
                    </div>
                </div>
                </div>
                <Backtotop/>
    </div>
  )
}

export default Rewards