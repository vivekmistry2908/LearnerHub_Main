import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link } from 'react-router-dom'
import { ipaddress } from '../App'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';


const FlashSet = () => {

    const[flashset,setFlashset]=useState([])
    const[count,setCount]=useState(0)
const user=JSON.parse(sessionStorage.getItem('user'))
    useEffect(()=>{
        axiosInstance.get(`${ipaddress}/flashcardsetsRetrive/${user.user_id}/`)
        .then((r)=>{
        //  console.log("Flashset Successfully Fetched",r.data)
         setFlashset(r.data)
        })
        .catch(()=>{
        //  console.log("Flashset Fetching Error")
        })
    },[count])

const bookmarkFlashset=(flashsetId,index)=>{
    axiosInstance.post(`${ipaddress}/bookmarkflashset/${flashsetId}/${user.user_id}/`)
    .then((r)=>{
        // console.log("Successfully Flashset Bookmarked",r.data)
        setCount(count+1)
        
        const toastLiveExample = document.getElementById('liveToast')
        if(flashset[index].bookmark_status==false){
        document.getElementById('toastbody').textContent="Added to Bookmark !!!"
        document.getElementById('toastbody').style.color="green"

        }
        else{
            document.getElementById('toastbody').textContent="Removed from Bookmark !!!"
        document.getElementById('toastbody').style.color="red"
        }
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
        
    })
    .catch(()=>{
        // console.log("Bookmark Error")
    })
}
    
  return (
    <div className='d-flex'>
        
        <Mainsidebar></Mainsidebar>
        <div className="w-100 pt-5 mt-2 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
        <Navbar></Navbar>
            <div className="w-100">
                <div className="container mt-5 px-5 px-lg-0">
                    <h4>My Flashcards</h4>
                    <Link to={`/viewflashcard/2`}>View</Link>
                    {flashset.map((x,index)=>{
                        return(

                            <div className="row shadow-sm mt-3 py-2 px-2 px-lg-0" key={index}>
                        <div className="col-2 col-md-1 d-flex align-items-center justify-content-center">
                            <img src={require('../img/flash-card.png')} width={40} alt="" />
                            </div>
                        <div className="col-8 col-md-9 ms-md-0">
                         <Link to={`/viewflashcard/${x.flashset_id}`} className='text-decoration-none'>{x.name}</Link>
                         <p className='mt-1' style={{fontSize:'13px'}}>{x.course_id}</p>
                        </div>
                        <div className="col-2 justify-content-end d-flex align-items-center pe-0 pe-lg-5">
                        <button className='border-0 bg-transparent' onClick={()=>{
                            bookmarkFlashset(x.flashset_id,index)
                        }}><i className={x.bookmark_status == true ? "fa-regular fa-bookmark text-warning" : "fa-regular fa-bookmark"}></i></button>

                        </div>
                        
                    </div>
                        )
                    })}
                </div>
            </div>
        </div>
        {/* TOAST MESSAGE */}
<div className="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
    
    <div className="toast-body d-flex justify-content-between">
      <span id='toastbody'></span> 
      <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
    </div>
  )
}

export default FlashSet