import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const Viewpdf_page = ({ view_pdf_status, setview_pdf_status, url, doc_name }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageScale, setPageScale] = useState(1.4);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  const handleZoomIn = () => {
    if (pageScale < 1.8) {
      setPageScale((prevScale) => prevScale + 0.2);
    }
  };

  const handleZoomOut = () => {
    if (pageScale > 1.4) {
      setPageScale((prevScale) => prevScale - 0.2);
    }
  };

  return (
    <div className={`${view_pdf_status ? '' : 'd-none'} animate__animated animate__fadeIn`} style={{ position: 'fixed', width: '100%', backgroundColor: 'rgb(0, 0, 0,0.7)', zIndex: 6 }}>
      <div className={`row m-0`} style={{ height: '100vh' }}>
        <div className="col-12 bg-white mx-auto" style={{ height: '100%' }}>
          <div>
            <h6 className='d-flex align-items-center pt-3 pb-2'><span style={{ cursor: 'pointer' }} onClick={() => {
              setview_pdf_status((prev) => !prev)
            }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
              </svg></span> <span className='ms-2'>{doc_name}</span></h6>
          </div>

          <div style={{ height: '90%' }}>
            <div className="button-container rounded d-flex justify-content-center align-items-center border border-bottom-0 py-1" style={{ backgroundColor: '#5d5fe3' }}>
              <button className="border-0 btn text-white btn-sm me-2" onClick={handleZoomIn} disabled={pageScale >= 1.8}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M28.415 29.3913L19.2835 20.2599C18.5544 20.8806 17.7158 21.3611 16.7679 21.7014C15.82 22.0417 14.8674 22.2118 13.9101 22.2118C11.5743 22.2118 9.59752 21.4033 7.97962 19.7863C6.3617 18.1693 5.55273 16.1935 5.55273 13.859C5.55273 11.5245 6.36125 9.54723 7.97827 7.92716C9.59529 6.3071 11.5711 5.49707 13.9056 5.49707C16.2401 5.49707 18.2174 6.30602 19.8374 7.92392C21.4575 9.54182 22.2675 11.5187 22.2675 13.8545C22.2675 14.8678 22.088 15.8484 21.729 16.7963C21.3701 17.7443 20.8989 18.5548 20.3156 19.2279L29.447 28.3593L28.415 29.3913ZM13.9101 20.7535C15.8452 20.7535 17.4788 20.0874 18.811 18.7553C20.1431 17.4232 20.8092 15.7895 20.8092 13.8545C20.8092 11.9194 20.1431 10.2858 18.811 8.95361C17.4788 7.62147 15.8452 6.9554 13.9101 6.9554C11.975 6.9554 10.3414 7.62147 9.00928 8.95361C7.67716 10.2858 7.0111 11.9194 7.0111 13.8545C7.0111 15.7895 7.67716 17.4232 9.00928 18.7553C10.3414 20.0874 11.975 20.7535 13.9101 20.7535ZM13.1809 17.332V14.5836H10.4326V13.1253H13.1809V10.3769H14.6393V13.1253H17.3877V14.5836H14.6393V17.332H13.1809Z" fill="white"/>
</svg>
              </button>

              <span className="border border-white rounded text-white py-2 px-2" style={{fontSize:'14px',width:'50px'}}><span className={pageScale===1.4 ? '':'d-none'}>100</span>
              <span className={pageScale>1.4 && pageScale<1.6 ? '':'d-none'}>125</span>
           <span className={pageScale>=1.6 && pageScale<1.8 ? '':'d-none'}>150</span>
           <span className={pageScale>=1.8 ? '':'d-none'}>200</span>
           {/* <span className={pageScale== ? '':'d-none'}>50</span> */}
            %</span>


              <button className="border-0 btn text-white btn-sm ms-2" onClick={handleZoomOut} disabled={pageScale <= 1.0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M28.415 29.3913L19.2835 20.2599C18.5544 20.8806 17.7158 21.3611 16.7679 21.7014C15.82 22.0417 14.8674 22.2118 13.9101 22.2118C11.5743 22.2118 9.59752 21.4033 7.97962 19.7863C6.3617 18.1693 5.55273 16.1935 5.55273 13.859C5.55273 11.5245 6.36125 9.54723 7.97827 7.92716C9.59529 6.3071 11.5711 5.49707 13.9056 5.49707C16.2401 5.49707 18.2174 6.30602 19.8374 7.92392C21.4575 9.54182 22.2675 11.5187 22.2675 13.8545C22.2675 14.8678 22.088 15.8484 21.729 16.7963C21.3701 17.7443 20.8989 18.5548 20.3156 19.2279L29.447 28.3593L28.415 29.3913ZM13.9101 20.7535C15.8452 20.7535 17.4788 20.0874 18.811 18.7553C20.1431 17.4232 20.8092 15.7895 20.8092 13.8545C20.8092 11.9194 20.1431 10.2858 18.811 8.95361C17.4788 7.62147 15.8452 6.9554 13.9101 6.9554C11.975 6.9554 10.3414 7.62147 9.00928 8.95361C7.67716 10.2858 7.0111 11.9194 7.0111 13.8545C7.0111 15.7895 7.67716 17.4232 9.00928 18.7553C10.3414 20.0874 11.975 20.7535 13.9101 20.7535ZM10.6008 14.5836V13.1253H17.2194V14.5836H10.6008Z" fill="white"/>
</svg>
              </button>

              
            </div>

            <div id="pdf-container" className="d-flex justify-content-center bg-secondary-subtle" style={{ marginBottom: '20px', zIndex: '1px', width: '100%', height: '100%', overflowY: 'scroll' }}>
              {url && (
                <Document className="" file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                  {Array.from({ length: numPages }, (_, index) => (
                    <Page key={index + 1} pageNumber={index + 1} scale={pageScale} style={{ display: index + 1 === currentPage ? 'block' : 'none' }} />
                  ))}
                </Document>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Viewpdf_page;
