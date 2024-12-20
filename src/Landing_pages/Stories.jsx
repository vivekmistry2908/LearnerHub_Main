import React from 'react'
import Landing_page_navbar from './Landing_page_navbar'
import Footer from './Footer'
import Backtotop from '../pages/Backtotop'

const Stories = () => {
  return (
    <div>
        <div className='animate__animated animate__fadeIn'>
            <Landing_page_navbar state={"stories"}/>

            <div className='mt-3' style={{backgroundColor:'#F3F0FF'}}>
                <div className="row container m-0 py-4 mx-auto">
                    <div className="col-md-6 col-lg-8 d-flex flex-column justify-content-center">
                       <div>
                       <p className='stories-head m-0' style={{color:'#2A3941'}}>Share your story</p>
                        <p className='stories-head m-0' style={{color:'#5d5fe3'}}>anonymously.</p>
                        <span className='stories-text1 d-block mt-3'>Share your real story or problems faced during your studies. Share the solution if you have one. Let’s learn together or find solution together. Your journey can help many of us</span>
                       </div>
                       <div className='mt-4'>
                       <button className='btn text-white fw-medium py-3 px-3 px-md-4' style={{backgroundColor:'#5d5fe3',fontSize:'14px'}}>Share your story</button>
                       </div>
                    </div>
                    <div className="col-md-6 col-lg-4 d-flex story-img mt-4 mt-md-0">
                        <img src={require('../img/landing_page/Layer 1 copy11 1.png')} alt="" />
                    </div>
                </div>
            </div>

<div style={{backgroundColor:'#F9F9FB'}} className='pb-5'>
<div className='row container mx-auto  pt-5 border-bottom pb-5' style={{backgroundColor:'#F9F9FB'}}>
            <div className="col-md-7 pb-2 d-flex flex-column justify-content-between">
               <div>
               <p className='para5-subdiv-date'>Updated on : 04 days ago</p>
                <p className='page5-subdiv-para'>Story header one or two line goes here, Story header one or two line goes here</p>
               </div>
                <div className=''>
                <button className='btn fw-medium py-2 px-3' style={{border:'1px solid #5d5fe3',color:'#5d5fe3',fontSize:'14px'}}>Read full story</button>
                </div>
            </div>
            <div className="col-md-5 d-flex align-items-center">
                <img src={require('../img/landing_page/Rectangle 81.png')} style={{width:'100%'}} alt="" />
            </div>
        </div>
<div className='row container mx-auto mt-5 border-bottom pb-5'>
            <div className="col-md-7 pb-2 d-flex flex-column justify-content-between">
               <div>
               <p className='para5-subdiv-date'>Updated on : 04 days ago</p>
                <p className='page5-subdiv-para'>Story header one or two line goes here, Story header one or two line goes here</p>
               </div>
                <div className=''>
                <button className='btn fw-medium py-2 px-3' style={{border:'1px solid #5d5fe3',color:'#5d5fe3',fontSize:'14px'}}>Read full story</button>
                </div>
            </div>
            <div className="col-md-5 d-flex align-items-center">
                <img src={require('../img/landing_page/Rectangle 81.png')} style={{width:'100%'}} alt="" />
            </div>
        </div>
</div>

<Footer/>
    
        </div>

<Backtotop/>
    </div>
  )
}

export default Stories