import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Navpath = ({count3,type,course_id,group_id}) => {
  const[name,setname]=useState("")
  const[path,setpath]=useState("")
  const[name2,setname2]=useState("")
  const[path2,setpath2]=useState("")
  const[name3,setname3]=useState("")
  const[path3,setpath3]=useState("")
  const[name4,setname4]=useState("")
  const[path4,setpath4]=useState("")

  useEffect(()=>{
    setname(JSON.parse(sessionStorage.getItem('name')))
    setpath(JSON.parse(sessionStorage.getItem('path')))
    setname2(JSON.parse(sessionStorage.getItem('name2')))
    setpath2(JSON.parse(sessionStorage.getItem('path2')))
    setname3(JSON.parse(sessionStorage.getItem('name3')))
    setpath3(JSON.parse(sessionStorage.getItem('path3')))
    setname4(JSON.parse(sessionStorage.getItem('name4')))
    setpath4(JSON.parse(sessionStorage.getItem('path4')))
  },[count3,course_id,group_id])

  return (
    <div className='d-flex align-items-center pb-2'>
        {path !=undefined && name!=undefined ? (<span style={{color:type ? '#fff':'#2A3941'}}><Link className='nav_paths' style={{color:type ? '#fff':'#2A3941',textDecoration:'none'}} to={path}>{name}</Link> </span>):(<></>)}
        
        {path2 !=undefined && name2!=undefined ? (
        <span className='ms-2' style={{color:type ? '#fff':'#2A3941'}}><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M5.29238 6.00008L0.692383 1.40008L1.40008 0.692383L6.70778 6.00008L1.40008 11.3078L0.692383 10.6001L5.29238 6.00008Z" fill="currentColor"/>
      </svg> <Link className='nav_paths' style={{color:type ? '#fff':'#2A3941',textDecoration:'none'}} to={path2}>{name2}</Link></span>):(<></>)} 
      
      {path3 !=undefined && name3!=undefined ? (<span style={{color:type ? '#fff':'#2A3941'}} className='ms-2'><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
  <path d="M5.29238 6.00008L0.692383 1.40008L1.40008 0.692383L6.70778 6.00008L1.40008 11.3078L0.692383 10.6001L5.29238 6.00008Z" fill="currentColor"/>
</svg> <Link style={{color:type ? '#fff':'#2A3941',textDecoration:'none',fontSize:'14px'}} to={path3}>{name3}</Link></span>):(<></>)}

    </div>
  )
}

export default Navpath