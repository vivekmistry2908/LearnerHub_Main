import React from 'react'

const Landing_page6 = () => {
  return (
    <div className="py-4" style={{ background: '#F3F0FF' }}>
      <div className="container py-5">
        <div className="row" style={{ height: '100%' }}>
          {/* Left section (text and button) */}
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
            <div className="text-center w-100">
              <p className="page6-head m-0">
                Together We Achieve More... <span className="page6-para m-0"></span>
              </p>
              <button className="btn text-white page6-btn py-3 px-3 mt-5" style={{ backgroundColor: '#5d5fe3' }}>
                Signup Now
              </button>
            </div>
          </div>

          {/* Right section (features) */}
          <div className="col-12 col-lg-6 mt-5 mt-lg-0 bg-white p-3" style={{ border: '0.5px solid #5d5fe3' }}>
            <div className="h-100 px-2 py-2" style={{ backgroundColor: '#F3F0FF' }}>
              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/computer (1) 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">Ad-Free Learning</p>
                  <span className="page6-subdiv-text">Study more efficiently without interruptions. Zero ads, zero distractions</span>
                </div>
              </div>

              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/sync (1) 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">Document Access</p>
                  <span className="page6-subdiv-text">Download your study materials and access them anytime, anywhere. Study offline and stay ahead</span>
                </div>
              </div>

              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/detective (1) 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">Anonymous Posting</p>
                  <span className="page6-subdiv-text">Speak freely, share boldly. Post anonymously and engage in genuine peer-to-peer learning</span>
                </div>
              </div>

              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/euro (1) 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">Full Refund on Course Completion</p>
                  <span className="page6-subdiv-text">Our promise: Complete your course within the official period, and receive a full refund. Commit to your success, risk-free!</span>
                </div>
              </div>

              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/group 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">City Group Exposure</p>
                  <span className="page6-subdiv-text">Expand your study network. Connect with peers across cities and exchange diverse insights</span>
                </div>
              </div>

              <div className="row m-0 py-2 pb-3">
                <div className="col-3 col-sm-2 d-flex align-items-center">
                  <img src={require('../img/landing_page/chat (1) 1.png')} alt="" className="img-fluid" />
                </div>
                <div className="col-9 col-sm-10">
                  <p className="page6-subdiv-head m-0">Private Study Groups</p>
                  <span className="page6-subdiv-text">Study better together. Create private groups and conquer academic challenges with friends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Landing_page6