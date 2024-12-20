import React from 'react'

const Landing_page5 = () => {
  return (
    <div style={{background:'#F9F9FB'}} className='py-5'>
        <div className='container'>
            <p className='page5-heading m-0' style={{color:'#2A3941'}}>Share your story</p>
            <p className='page5-heading m-0' style={{color:'#5D5FE3'}}>anonymously.</p>
            <p className='page5-para mt-3 pe-5'>Share your real story or problems faced during your studies. Share the solution if you have one.</p>
            <p className='page5-para  m-0 pe-5'>Let’s learn together or find solution together. Your journey can help many of us</p>

        <div className='row mt-5 border-bottom pb-5'>
            <div className="col-md-7 pb-2 d-flex flex-column justify-content-between">
               <div>
               <p className='para5-subdiv-date'>Updated on : 04 days ago</p>
                <p className='page5-subdiv-para'>Story header one or two line goes here, Story header one or two line goes here</p>
               </div>
                <div className=''>
                <button className='btn' style={{border:'1px solid #5d5fe3',color:'#5d5fe3',fontSize:'14px'}}>Read full story</button>
                </div>
            </div>
            <div className="col-md-5 d-flex align-items-center">
                <img src={require('../img/landing_page/Rectangle 81.png')} style={{width:'100%'}} alt="" />
            </div>
        </div>

        <div className='row mt-5 border-bottom pb-5'>
            <div className="col-md-7 pb-2 d-flex flex-column justify-content-between">
               <div>
               <p className='para5-subdiv-date'>Updated on : 04 days ago</p>
                <p className='page5-subdiv-para'>Story header one or two line goes here, Story header one or two line goes here</p>
               </div>
                <div className=''>
                <button className='btn' style={{border:'1px solid #5d5fe3',color:'#5d5fe3',fontSize:'14px'}}>Read full story</button>
                </div>
            </div>
            <div className="col-md-5 d-flex align-items-center">
                <img src={require('../img/landing_page/Rectangle 81.png')} style={{width:'100%'}} alt="" />
            </div>
        </div>

        <div className='text-center mt-4 '>
            <button className='btn text-white fw-medium px-3 py-2' style={{backgroundColor:'#5d5fe3',fontSize:'14px'}}>Share your story</button>
            <button onClick={()=>{
                
            }} className='btn btn-white fw-medium px-3 py-2 ms-4' style={{border:'1px solid #5d5fe3',fontSize:'14px',color:'#5d5fe3'}}>Read all stories</button>

        </div>
        </div>
    </div>
  )
}

export default Landing_page5