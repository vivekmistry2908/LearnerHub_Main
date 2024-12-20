import React from 'react'
import Admin_sidebar from './Admin_sidebar'
import Admin_navbar from './Admin_navbar'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { ipaddress } from '../App'
import { useNavigate, useParams } from 'react-router-dom'

const Specific_report_page = () => {

    const {type}=useParams()
    const {id}=useParams()


    const[specific_report,setspecific_report]=useState([])

    const navigate=useNavigate()

    useEffect(()=>{

      if(type==='flashset'){
        axios.get(`${ipaddress}/admin_app/AdminFlashDetailReport/${id}/`)
      .then((r)=>{
          // console.log("Particular Flashset report data",r.data)
          setspecific_report(r.data)
      })
      .catch((err)=>{
          // console.log("Particular Flashset report fetching error",err)
      })
      }

      else{
        axios.post(`${ipaddress}/admin_app/ReportedValues/${id}/`,{
          'type':type
      })
      .then((r)=>{
          // console.log("Particular report data",r.data)
          setspecific_report(r.data)
      })
      .catch((err)=>{
          // console.log("Particular report fetching error",err)
      })
      }
    },[])


return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"report"}/>
            <div className='bg-light w-100 px-3'>
           
        <h6 className='mt-4 d-flex align-items-center'><svg style={{cursor:'pointer'}} onClick={()=>{
          navigate('/admin_report')
        }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg> <span className='ms-2'>Report</span></h6>
        <div className={`table-responsive mt-3 rounded `}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Posted by</th>
      <th scope="col" className='fw-medium text-secondary'>Posted on</th>
      <th scope="col" className={`fw-medium text-secondary ${type==='users' ? '':'d-none'}`}>Reported About</th>
      <th scope="col" className={`fw-medium text-secondary ${type==='documents' ? '':'d-none'}`}>Reported Document Id</th>
      <th scope="col" className={`fw-medium text-secondary ${type==='flashset' ? '':'d-none'}`}>Reported Flashset Id</th>
      <th scope="col" className={`fw-medium text-secondary ${type==='courses' ? '':'d-none'}`}>Reported Course</th>
      <th scope="col" className={`fw-medium text-secondary ${type==='groups' ? '':'d-none'}`}>Reported Group</th>

      <th scope="col" className='fw-medium text-secondary'>Report</th>
    </tr>
  </thead>
  <tbody>
    {specific_report.map((x,index)=>{
        return(
            <>
              <tr>
      <th scope="row">{index+1}</th>
      <td className={`${type==='users' ? '':'d-none'}`}>{x.posted_user}</td>
      <td className={`${type==='documents' || type==='flashset' ? '':'d-none'}`}>{x.user_id}</td>
      <td className={`${type==='courses' || type==='groups' ? '':'d-none'}`}>{x.user_name}</td>


      <td className={`${type==='flashset' ? 'd-none':''}`}>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
      <td className={`${type==='flashset' ? '':'d-none'}`}>{x.date_time!=undefined && x.date_time.slice(0,10)}</td>


      <td className={`${type==='users' ? '':'d-none'}`}>{x.userr}</td>
      <td className={`${type==='courses' ? '':'d-none'}`}>{x.course_name}</td>
      <td className={`${type==='documents' ? '':'d-none'}`}>{x.document_id}</td>
      <td className={`${type==='groups' ? '':'d-none'}`}>{x.group_name}</td>
      <td className={`${type==='flashset' ? '':'d-none'}`}>{x.flashsetid}</td>
      <td className={`${type==='users' || type==='documents' ? '':'d-none'}`}>{x.report}</td>
      <td className={`${type==='courses' || type==='groups' ? '':'d-none'}`}>{x.reason}</td>
      <td className={`${type==='flashset' ? '':'d-none'}`}>{x.user_report}</td>

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
  )
}

export default Specific_report_page