import React from 'react'
import Landing_page_navbar from './Landing_page_navbar'
import Footer from './Footer'
import Backtotop from '../pages/Backtotop'
import './OurTeam.css';  // Make sure to create this CSS file or include the styles within the component

const Our_team = () => {
  return (
    <div>
      <div className='animate__animated animate__fadeIn'>
        <Landing_page_navbar state={"about_us"} />
        <div className=''>
          <div className='container mt-5 pt-4 pb-5'>
            <p className='m-0 our-team-head'>Meet the Team</p>
            <p className='m-0 our-team-head'>Powering <img src={require('../img/landing_page/Group 392.png')} alt="" /></p>
            <p className='m-0 our-team-head'>Our Product</p>

            <div className='mt-5'>
              <p className='our-team-text1 m-0'>Hello and Welcome!</p>
              <p className='our-team-text2 m-0 mt-4'>We’re thrilled to have you here at LERNEN HUB.COM, where we're reshaping the academic experience for university students everywhere. Born in the heart of RWTH Aachen amidst its historic charm and innovative spirit, our platform is here to revolutionize the way students learn and connect</p>
            </div>
            <div className='mt-5'>
              <p className='our-team-text3 m-0'>Our Story</p>
              <p className='our-team-text2 m-0 mt-4'>It all started right here in Aachen, where we saw the need for a platform that allows easy access to shared learning materials. We've all been there—what used to be free suddenly costs a pretty penny. That's why we created LERNEN HUB.COM—to keep vital resources accessible without the hefty price tag, and make sure every student can focus on what really matters: learning and growing together</p>
            </div>
          </div>

          <div className='mt-5 pt-4 pb-5' style={{ backgroundColor: '#F9F9FB' }}>
            <p className='our-team-text6 text-center'>Cool Features You'll Love</p>
            <div className="row m-0 mt-5 container mx-auto">
              <div className="col-md-6 d-flex flex-column align-items-center p-4 border-end border-bottom py-5">
                <img src={require('../img/landing_page/team-work 1.png')} alt="" />
                <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center p-4 border-bottom py-5">
                <img src={require('../img/landing_page/document (2) 1.png')} alt="" />
                <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center p-4 border-end py-5">
                <img src={require('../img/landing_page/shield 1.png')} alt="" />
                <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-center p-4 py-5">
                <img src={require('../img/landing_page/wallet 1.png')} alt="" />
                <p className='our-team-text4 mt-4 m-0'>City-Based Groups</p>
                <p className='our-team-text5 mt-3'>Whether you’re looking for study help or just want to connect, find or create groups in your city and on campus.</p>
              </div>
            </div>
            <div className='text-center mt-5'><button className='btn text-white py-3 px-4' style={{ backgroundColor: '#5d5fe3' }}>Get Started With Us</button></div>
          </div>

          <div className="container py-5 px-4">
            <p className='our-team-text6 text-center'>From Vision to Reality</p>
            <div className='' style={{ borderLeft: '1px dotted gray', position: 'relative' }}>
              <div className='d-flex row m-0'>
                <div className='col-4 pb-4'>
                  <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                    <img className='responsive-img' src={require('../img/landing_page/Group 464.png')} alt="" />
                    <p className='our-team-text7 m-0 ms-3'>Where We Started</p>
                  </div>
                </div>
                <div className='col-8 border-bottom py-4'>
                  <p className='our-team-text8 m-0'>Foundation Laid</p>
                  <p className='our-team-text9 m-0 mt-3'>We launched with core features designed to support basic student needs—study groups, resource sharing, and foundational community engagement.</p>
                </div>
              </div>

              <div className='row m-0'>
                <div className='col-4 py-4'>
                  <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                    <img className='responsive-img' src={require('../img/landing_page/Group 465.png')} alt="" />
                    <p className='our-team-text7 m-0 ms-3'>Where We Are</p>
                  </div>
                </div>
                <div className='col-8 py-4 border-bottom'>
                  <p className='our-team-text8 m-0'>Building Community</p>
                  <p className='our-team-text9 m-0 mt-3'>Currently, we are enhancing our platform by expanding course offerings and forging partnerships witheducational institutions to provide rich, verified content.</p>
                  <p className='our-team-text8 m-0 mt-4'>Enhancing User Experience</p>
                  <p className='our-team-text9 m-0 mt-3'>We're actively collecting and implementing user feedback to refine and improve the functionality and user interface.</p>
                </div>
              </div>

              <div className='d-flex row m-0'>
                <div className='col-4 py-4'>
                  <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                    <img className='responsive-img' src={require('../img/landing_page/Group 467.png')} alt="" />
                    <p className='our-team-text7 m-0 ms-3'>Where We're Heading</p>
                  </div>
                </div>
                <div className='col-8 py-4 border-bottom'>
                  <p className='our-team-text8 m-0'>Innovative Learning</p>
                  <p className='our-team-text9 m-0 mt-3'>Soon, we will introduce AI-driven tools tailored to personalize learning and support. These innovations will include smart tutors and customizable learning paths.</p>
                  <p className='our-team-text8 m-0 mt-4'>Global Accessibility</p>
                  <p className='our-team-text9 m-0 mt-3'>Plans are in place to expand language options and customize features to cater to international educational standards and cultural preferences.</p>
                  <p className='our-team-text8 m-0 mt-4'>Blockchain Integration</p>
                  <p className='our-team-text9 m-0 mt-3'>Looking forward, we aim to enhance security and transparency through blockchain technology, which will safeguard credentials and enable fair, transparent community governance.</p>
                </div>
              </div>

              <div className='d-flex row m-0'>
                <div className='col-4 py-4'>
                  <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                    <img className='responsive-img' src={require('../img/landing_page/Group 468.png')} alt="" />
                    <p className='our-team-text7 m-0 ms-3'>Our Vision for the Future</p>
                  </div>
                </div>
                <div className='col-8 border-bottom py-4'>
                  <p className='our-team-text8 m-0'>Sustainable Growth</p>
                  <p className='our-team-text9 m-0 mt-3'>We commit to continuous innovation, integrating green practices into our educational tools and community engagements.</p>
                  <p className='our-team-text8 m-0 mt-4'>Empowering Students Globally</p>
                  <p className='our-team-text9 m-0 mt-3'>Ultimately, our vision is to make Lernen-Hub a globally recognized platform where every student, regardless of location or background, can access the tools they need to succeed.</p>
                </div>
              </div>

              <div className='d-flex row m-0'>
                <div className='col-4 py-4'>
                  <div className='d-flex align-items-center' style={{ position: 'absolute', left: '-40px' }}>
                    <img className='responsive-img' src={require('../img/landing_page/Group 469.png')} alt="" />
                    <p className='our-team-text7 m-0 ms-3'>Join Our Journey</p>
                  </div>
                </div>
                <div className='col-8 pt-4'>
                  <p className='our-team-text9 m-0'>Ultimately, our vision is to make Lernen-Hub a globally recognized platform where every student, regardless of location or background, can access the tools they need to succeed.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#F3F0FF' }} className='py-5'>
            <div className='pb-4 container'>
              <p className='our-team-text6 text-center'>What’s Next for Us</p>
              <p className='our-team-text2 m-0 mt-4'>Our commitment doesn’t stop at great study tools. We’re looking to integrate blockchain for transparent community decisions and even help you find the best student housing. At LERNEN HUB.COM, we want to enhance every aspect of your student life</p>
              <div className='mt-5 pt-2'>
                <p className='our-team-text3 m-0'>Join Our Community</p>
                <p className='our-team-text2 m-0 mt-4'>Are you ready to leave behind those pricey, restrictive platforms? Join us at LERNEN HUB.COM. Together, let’s make your uni years not just easier, but truly memorable and fun. We’re in this together—</p>
                <p className='out-team-text2 fw-bold text-center' style={{ color: '#2A3941' }}>let’s make it legendary!</p>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
      <Backtotop />

    </div>
  )
}

export default Our_team