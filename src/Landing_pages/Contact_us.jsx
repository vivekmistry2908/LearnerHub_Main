import React from 'react'
import Landing_page_navbar from './Landing_page_navbar'
import Footer from './Footer'
import Backtotop from '../pages/Backtotop'
import { useNavigate } from 'react-router-dom'

const Contact_us = () => {

  const navigate=useNavigate()
  return (
    <div>
        <div style={{height:'100vh'}} className='bg-white animate__animated animate__fadeIn'>
            <Landing_page_navbar state={"contact_us"}/>

            <div className='container mt-5 pt-4 pb-4'>
              <p className='contact-head'>Contact Us</p>
              <div className="row m-0 mt-5">
                <div className='col-lg-4 col-md-6 '>
                <div className="d-flex flex-column align-items-center p-4" style={{backgroundColor:'#F3F0FF'}}>
                  <p className='contact-subhead m-0'>Talk to a member of</p>
                  <p className='contact-subhead m-0'>our Sales team</p>
                  <p className='contact-para mt-3'>We will help you find the right products and pricing for your university.</p>
                  <button className='contact-btn btn text-white fw-medium mt-2' style={{borderRadius:'5px',backgroundColor:'#5d5fe3'}} onClick={()=>{
                    navigate('/sales_team')
                  }}>Contact Sales</button>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4 mt-md-0'>
                <div className="d-flex flex-column align-items-center p-4" style={{backgroundColor:'#F9F9FB'}}>
                  <p className='contact-subhead m-0'>Student & Learning</p>
                  <p className='contact-subhead m-0'>Support</p>
                  <p className='contact-para mt-3'>Couldn’t not find the answer you are looking for, we are here to lend a hand.</p>
                  <button className='contact-btn btn text-white fw-medium mt-2' style={{borderRadius:'5px',backgroundColor:'#2A3941'}} onClick={()=>{
                    navigate('/our_team')
                  }}>Contact Our Team</button>
                </div>
                </div>
                <div className='col-lg-4 col-md-6  mt-4 mt-lg-0'>
                <div className="d-flex flex-column align-items-center p-4" style={{backgroundColor:'#FFEDE7'}}>
                  <p className='contact-subhead m-0'>Product & account</p>
                  <p className='contact-subhead m-0'>support</p>
                  <p className='contact-para mt-3'>Couldn’t not find the answer you are looking for, we are here to lend a hand.</p>
                  <button className='contact-btn btn text-white fw-medium mt-2' style={{borderRadius:'5px',backgroundColor:'#FF845D'}} onClick={()=>{
                    navigate('/support')
                  }}>Go to Help Center</button>
                </div>
                </div>
              </div>

              <div className='mt-5 pt-3'>
                <p className='contact-head'>Location</p>
                <div className='text-center mt-5'>
                  <img src={require('../img/landing_page/Group 461.png')} style={{width:'100%'}} alt="" />
                </div>
              </div>
            </div>
            <div className='' style={{backgroundColor:'#F9F9FB',paddingBottom:'80px'}}>
            <div className="row container mx-auto m-0 mt-5 pt-4">
              <p className='contact-head mb-5'>Help Center</p>

                <div className='col-lg-4 col-md-6'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/bookkeeping 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>our Sales team</p>
                  <p className='contact-para mt-3'>Set yourself up for success with onboarding guides</p>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4 mt-md-0'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/lighthouse 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>Product guides</p>
                  <p className='contact-para mt-3'>Make the most of your setup with our comprehensive documentation</p>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4 mt-lg-0'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/headphone 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>Help and FAQs</p>
                  <p className='contact-para mt-3'>Find solutions for common issues</p>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/first-prize 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>Best practices</p>
                  <p className='contact-para mt-3'>Find tips and step-by-step tutorials for common use cases</p>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/video-conference 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>Videos</p>
                  <p className='contact-para mt-3'>Watch & Larn how to use Lernen Hub</p>
                </div>
                </div>
                <div className='col-lg-4 col-md-6 mt-4'>
                <div className="d-flex flex-column align-items-center justify-content-center p-4 contact-help-div">
                  <img src={require('../img/landing_page/social-network (1) 1.png')} alt="" />
                  <p className='contact-help-head m-0 mt-4'>Community</p>
                  <p className='contact-para mt-3'>Connect, learn, and share with other Zendesk users</p>
                </div>
                </div>
              </div>
            </div>
            <Footer/>
            <Backtotop/>
        </div>
    </div>
  )
}

export default Contact_us