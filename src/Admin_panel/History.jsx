import React, { useEffect,useState } from 'react'
import Admin_navbar from './Admin_navbar'
import Admin_sidebar from './Admin_sidebar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ipaddress } from '../App'

const History = () => {
    const {user_id}=useParams()

    const[value,setvalue]=useState("login")

    const[login_details,setlogin_details]=useState([])
    const[logout_details,setlogout_details]=useState([])

    const [displayed_history1, setDisplayed_history1] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const [displayed_history2, setDisplayed_history2] = useState([]);
    const [currentIndex2, setCurrentIndex2] = useState(0);
    const ITEMS_PER_PAGE2 = 10;

    useEffect(()=>{
        axios.get(`${ipaddress}/admin_app/api/UserLoginHistoryViewSet/${user_id}/`)
        .then((r)=>{
            // console.log("User History data",r.data)
            setlogin_details(r.data.login_history)
            setlogout_details(r.data.logout_history)
        setDisplayed_history1(r.data.login_history.slice(0, ITEMS_PER_PAGE))

        setDisplayed_history2(r.data.logout_history.slice(0, ITEMS_PER_PAGE2))

        })
        .catch((err)=>{
            // console.log("User History fetching error",err)
        })
    },[])

    const loadMore = () => {
      const nextIndex = currentIndex + ITEMS_PER_PAGE;
      const newDisplayedUniversities = login_details.slice(0, nextIndex + ITEMS_PER_PAGE);
      setDisplayed_history1(newDisplayedUniversities);
      setCurrentIndex(nextIndex);
    };

    const loadMore2 = () => {
      const nextIndex = currentIndex2 + ITEMS_PER_PAGE2;
      const newDisplayedUniversities = logout_details.slice(0, nextIndex + ITEMS_PER_PAGE2);
      setDisplayed_history2(newDisplayedUniversities);
      setCurrentIndex2(nextIndex);
    };


  return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar/>
            <div className='bg-light p-3 py-4 w-100'>
                <div className='d-flex'>
                <h6 onClick={()=>{
                    setvalue("login")
                }} className='p-2' style={{cursor:'pointer',backgroundColor:value==="login" ? '#5d5fe3':'',color:value==="login" ? '#fff':'#5d5fe3',border:'1px solid #5d5fe3',borderRadius:'5px 0px 0px 5px'}}>Login History</h6>
                <h6 onClick={()=>{
                    setvalue("logout")
                }} className='p-2' style={{cursor:'pointer',backgroundColor:value==="logout" ? '#5d5fe3':'',color:value==="logout" ? '#fff':'#5d5fe3',border:'1px solid #5d5fe3',borderRadius:'0px 5px 5px 0px'}}>Logout History</h6>
                </div>

{/* Login History Table */}
<div className={`table-responsive mt-3 rounded ${value==="login" ? '':'d-none'}`}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Login Date</th>
      <th scope="col" className='fw-medium text-secondary'>Login Time</th>
    </tr>
  </thead>
  <tbody>
    {displayed_history1.map((x,index)=>{
        return(
            <>
              <tr>
      <th scope="row">{index+1}</th>
      <td>{x.date.slice(0,10)}</td>
      <td>{x.date.substring(11, 19)}</td>
    </tr>
            </>
        )
    })}
  </tbody>
</table>

{displayed_history1.length < login_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore}>Load More...</p>
            )}
</div>

{/* Logout History Table */}
<div className={`table-responsive mt-3 rounded ${value==="logout" ? '':'d-none'}`}>
        <table className="table">
  <thead>
    <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Logout Date</th>
      <th scope="col" className='fw-medium text-secondary'>Logout Time</th>
    </tr>
  </thead>
  <tbody>
    {displayed_history2.map((x,index)=>{
        return(
            <>
              <tr>
      <th scope="row">{index+1}</th>
      <td>{x.date.slice(0,10)}</td>
      <td>{x.date.substring(11, 19)}</td>
    </tr>
            </>
        )
    })}
  </tbody>
</table>

{displayed_history2.length < logout_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore2}>Load More...</p>
            )}
</div>
        </div>
        </div>
    </div>
  )
}

export default History