import React from 'react'

const Landing_page2 = () => {
  return (
    <div className='pb-5 pt-5 mb-5'>
      <div id="carouselExampleControlsNoTouching" style={{ position: 'relative' }} className="slide1 carousel slide bg-white" data-bs-touch="false">
        <div className="carousel-inner">
          <div className="carousel-item active bg-white">
            <div className='d-flex flex-column align-items-center'>
              <p className='page2-heading m-0'>Social Integration</p>
              <p className='page2-subheading'>Getting invloved in university campus</p>
              <div className='container px-5 pb-1'>
                <p className='page2-subheading2 m-0 px-0 px-md-5 ms-0 ms-md-5 me-0 me-md-5'>Boost student connections with our platform. We provide forums, study groups, and networking to overcome social integration challenges and enhance academic success</p>
              </div>
              <img src={require('../img/landing_page/Group.png')} className="page2-img mt-4" alt="..." />
            </div>
          </div>
          <div className="carousel-item bg-white">
            <div className='d-flex flex-column align-items-center'>
              <p className='page2-heading m-0'>New Beginnings</p>
              <p className='page2-subheading'>First Week challenges</p>
              <div className='container px-5 pb-1'>
                <p className='page2-subheading2 m-0 px-0 px-md-5 ms-0 ms-md-5 me-0 me-md-5'>Starting your journey can be tough and overwhelming. Our platform helps you navigate challenges with resources and guidance.</p>
              </div>
              <img src={require('../img/landing_page/Group (1).png')} className="page2-img mt-4" alt="..." />
            </div>
          </div>
          <div className="carousel-item bg-white">
            <div className='d-flex flex-column align-items-center'>
              <p className='page2-heading m-0'>Essentials only!</p>
              <p className='page2-subheading'>More time learning and less time looking</p>
              <div className='container px-5 pb-1'>
                <p className='page2-subheading2 m-0 px-0 px-md-5 ms-0 ms-md-5 me-0 me-md-5'>Students often struggle to find relevant information amidst the clutter. Our platform offers curated guidance from peers, ensuring easy access to the right resources.</p>
              </div>
              <img src={require('../img/landing_page/Group (2).png')} className="page2-img mt-4" alt="..." />
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" style={{ top: '0px', position: 'absolute' }} type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev">
          <span className="carousel-control-prev-icon">
            <div className="svg-container">
              <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 74 74"
                style={{ width: "100%", height: "auto" }}
                fill="none">
                <path d="M37 49.8125L38.9792 47.8333L29.6042 38.4583H50.9583V35.5417H29.6042L38.9792 26.1667L37 24.1875L24.1875 37L37 49.8125ZM37.0177 73.25C32.0059 73.25 27.2931 72.299 22.8792 70.3969C18.4653 68.4948 14.626 65.9132 11.3615 62.6521C8.09618 59.391 5.51146 55.5566 3.60729 51.149C1.70243 46.7406 0.75 42.0302 0.75 37.0177C0.75 32.0059 1.70104 27.2931 3.60312 22.8792C5.50521 18.4653 8.08681 14.626 11.3479 11.3615C14.609 8.09618 18.4434 5.51146 22.851 3.60729C27.2594 1.70243 31.9698 0.75 36.9823 0.75C41.9941 0.75 46.7069 1.70104 51.1208 3.60313C55.5347 5.50521 59.374 8.0868 62.6385 11.3479C65.9038 14.609 68.4885 18.4434 70.3927 22.851C72.2976 27.2594 73.25 31.9698 73.25 36.9823C73.25 41.9941 72.299 46.7069 70.3969 51.1208C68.4948 55.5347 65.9132 59.374 62.6521 62.6385C59.391 65.9038 55.5566 68.4885 51.149 70.3927C46.7406 72.2976 42.0302 73.25 37.0177 73.25ZM37 70.3333C46.3056 70.3333 54.1875 67.1042 60.6458 60.6458C67.1042 54.1875 70.3333 46.3056 70.3333 37C70.3333 27.6944 67.1042 19.8125 60.6458 13.3542C54.1875 6.89583 46.3056 3.66667 37 3.66667C27.6944 3.66667 19.8125 6.89583 13.3542 13.3542C6.89583 19.8125 3.66667 27.6944 3.66667 37C3.66667 46.3056 6.89583 54.1875 13.3542 60.6458C19.8125 67.1042 27.6944 70.3333 37 70.3333Z" fill="#5D5FE3" />
              </svg>
            </div>
          </span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next">
          <span className="carousel-control-next-icon">
            <div className="svg-container">
              <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 74 74"
                style={{ width: "100%", height: "auto" }}
                fill="none">
                <path d="M37 49.8125L35.0208 47.8333L44.3958 38.4583H23.0417V35.5417H44.3958L35.0208 26.1667L37 24.1875L49.8125 37L37 49.8125ZM36.9823 73.25C41.9941 73.25 46.7069 72.299 51.1208 70.3969C55.5347 68.4948 59.374 65.9132 62.6385 62.6521C65.9038 59.391 68.4885 55.5566 70.3927 51.149C72.2976 46.7406 73.25 42.0302 73.25 37.0177C73.25 32.0059 72.299 27.2931 70.3969 22.8792C68.4948 18.4653 65.9132 14.626 62.6521 11.3615C59.391 8.09618 55.5566 5.51146 51.149 3.60729C46.7406 1.70243 42.0302 0.75 37.0177 0.75C32.0059 0.75 27.2931 1.70104 22.8792 3.60313C18.4653 5.50521 14.626 8.0868 11.3615 11.3479C8.09618 14.609 5.51146 18.4434 3.60729 22.851C1.70243 27.2594 0.75 31.9698 0.75 36.9823C0.75 41.9941 1.70104 46.7069 3.60313 51.1208C5.50521 55.5347 8.08681 59.374 11.3479 62.6385C14.609 65.9038 18.4434 68.4885 22.851 70.3927C27.2594 72.2976 31.9698 73.25 36.9823 73.25ZM37 70.3333C27.6944 70.3333 19.8125 67.1042 13.3542 60.6458C6.89584 54.1875 3.66667 46.3056 3.66667 37C3.66667 27.6944 6.89584 19.8125 13.3542 13.3542C19.8125 6.89583 27.6944 3.66667 37 3.66667C46.3056 3.66667 54.1875 6.89583 60.6458 13.3542C67.1042 19.8125 70.3333 27.6944 70.3333 37C70.3333 46.3056 67.1042 54.1875 60.6458 60.6458C54.1875 67.1042 46.3056 70.3333 37 70.3333Z" fill="#5D5FE3" />
              </svg> </div></span>
        </button>
      </div>
    </div>
  )
}

export default Landing_page2