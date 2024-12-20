import React from 'react'
import Admin_sidebar from './Admin_sidebar'
import Admin_navbar from './Admin_navbar'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { ipaddress } from '../App'
import { useNavigate } from 'react-router-dom'
import Backtotop from '../pages/Backtotop'
import * as XLSX from 'xlsx';


const University_details = () => {
    const[university_details,setuniversity_details]=useState([])
    const [displayed_universities, setDisplayed_universities] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const navigate=useNavigate()

    useEffect(()=>{
        axios.get(`${ipaddress}/admin_app/api/AllUniversities/`)
        .then((r)=>{
            // console.log("Universities data",r.data)
            setuniversity_details(r.data)
            setDisplayed_universities(r.data.slice(0, ITEMS_PER_PAGE));
        })
        .catch((err)=>{
            // console.log("Universities fetching error",err)
        })
    },[])

    const loadMore = () => {
      const nextIndex = currentIndex + ITEMS_PER_PAGE;
      const newDisplayedUniversities = university_details.slice(0, nextIndex + ITEMS_PER_PAGE);
      setDisplayed_universities(newDisplayedUniversities);
      setCurrentIndex(nextIndex);
    };

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(university_details);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(workbook, 'University_details.xlsx');
    };
  return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"universities"}/>
            <div className='bg-light w-100 px-3'>
           
            <div className='d-flex justify-content-between align-items-center py-3'>
              <h6 className='text-primary m-0'>University Details</h6>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
        <div className={`table-responsive mt-3 rounded`}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>University Name</th>
      <th scope="col" className='fw-medium text-secondary'>Domain</th>
      <th scope="col" className='fw-medium text-secondary'>City</th>
      <th scope="col" className='fw-medium text-secondary'>Country</th>
      <th scope="col" className='fw-medium text-secondary'>Added by</th>
    </tr>
  </thead>
  <tbody>
    {displayed_universities.map((x,index)=>{
        return(
            <>
              <tr style={{cursor:'pointer'}} onClick={()=>{
                navigate(`/admin_course/${x.university_id}`)
              }}>
      <th scope="row">{index+1}</th>
      <td>{x.university_name}</td>
      <td>{x.domain}</td>
      <td>{x.city}</td>
      <td>{x.country}</td>
      <td>{x.user}</td>
    </tr>
            </>
        )
    })}
  </tbody>
</table>

{displayed_universities.length < university_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore}>Load More...</p>
            )}
</div>
            </div>
        </div>
<Backtotop/>
    </div>
  )
}

export default University_details