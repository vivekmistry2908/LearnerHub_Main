import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Mainsidebar from '../components/Mainsidebar';
import { useParams } from 'react-router-dom';
import { ipaddress } from '../App';
import axiosInstance from './axiosInstance';

const Matchflashcard = () => {
  let {flashset_id}=useParams()
  const user=JSON.parse(sessionStorage.getItem('user'))

  useEffect(() => {
    const flipCard = document.querySelector('.flip-card');

    const handleFlip = () => {
      flipCard.classList.toggle('is-flipped');
    };

    flipCard.addEventListener('click', handleFlip);

    // Cleanup event listener when component unmounts
    return () => {
      flipCard.removeEventListener('click', handleFlip);
    };
    
  }, []);

  const[flashcards,setFlashcards]=useState([])
  useEffect(()=>{
    axiosInstance.get(`${ipaddress}/studyflashcard/${user.user_id}/${flashset_id}/`)
    .then((r)=>{
      // console.log("Filtered Flashcards fetched successfully",r.data)
    })
    .catch(()=>{
      console.log("Filltered flashcards fetching error")
    })

  },[flashset_id])

  return (
    <div>
      <Navbar></Navbar>
      <div className="d-flex main-sidebarcontent">
        <Mainsidebar></Mainsidebar>
        <div className="container">
          <div className='row m-0 mt-5'>
            <div className="col-md-3">
                
            </div>
            <div className="col-md-6">
              <div className='scene'>
                <div className='flip-card card bg-white border-0 shadow-sm'>
                  <div className="card__face card__face--front d-flex align-items-center justify-content-evenly bg-light shadow-sm">
                    <img src={require('../img/documents.png')} width={150} alt="" />
                  <p>hdfjhdjhdgjhd</p>
                  </div>
                  <div className="card__face card__face--back d-flex align-items-center justify-content-evenly bg-light shadow-sm">
                    <img src={require('../img/documents.png')} width={150} alt="" />
                  <p>hdfjhdjhdgjhd</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchflashcard;
