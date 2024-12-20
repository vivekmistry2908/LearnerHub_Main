import React, { useState,useEffect } from "react";
import axios from "axios";
import { Document, Page,pdfjs } from "react-pdf";
import Navbar from "../components/Navbar";
import Mainsidebar from "../components/Mainsidebar";
import { useParams } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import Preloader from "./Preloader";
import Backtotop from "./Backtotop";

const Translatedpdf = ({url}) => {
// console.log("Translated pdf props",url)

  const [data1, setData1] = useState("");

  const {id}=useParams()
  const[pdfdata,setPdfdata]=useState({})
  const [pdfurldata, setPdfurldata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[folllowersdata,setFollowersdata]=useState([])
  let[count1,setCount1]=useState(0)
  const [preloading, setPreLoading] = useState(true);

// PRE LOADER
useEffect(() => {
  setTimeout(() => {
    setPreLoading(false);
  }, 3000); // Set the timeout to match the delay in milliseconds

}, []); 

  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const [pageScale, setPageScale] = useState(1.4);


const handlePreviousPage = () => {
  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
};

const handleNextPage = () => {
  setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
};

function handleZoomIn() {
  if (pageScale < 1.8) {
    setPageScale(pageScale + 0.2);
  }
}

function handleZoomOut() {
  if (pageScale > 1.4) {
    setPageScale(pageScale - 0.2);
  }
}

// ------------------------------------------------CLOSE AND OPEN DISCUSSION PAGE----------------------------------------
const[disc,setDisc]=useState(true)
const discussionAction=()=>{
setDisc(!disc)
}

  return (
    <div className="">
<div className="">
        <Navbar></Navbar>
        <div className="main-sidebarcontent d-flex">
          <Mainsidebar></Mainsidebar>

          <div className="ps-3 pt-3 w-100">
            <div className="row mt-0 container-fluid">
            {/* <h1>{pdfdata.pdf_title}</h1> */}
              <div className="col-sm-8 mt-2">
                <h5
                  className="fw-medium d-block fs-3"
                  style={{ font: "'Epilogue', sans-serif'" }}
                >
                 {/* {pdfdata.pdf_title} */}
                </h5>
              </div>
             
              <div className="col-12 mt-4">
                <div className="row">
                  <div className={disc==false ? "col-md-12 col-lg-12" : "col-md-12 col-lg-8 mx-auto"} style={{height:'600px',overflow:'auto'}}>
                  <div className="button-container d-flex justify-content-center align-items-center border border-bottom-0 py-2 bg-secondary-subtle">
          <button className="btn btn-sm" onClick={handleZoomIn} disabled={pageScale >= 3}>
          <i className="fa-solid fa-plus"></i>
          </button>
          <button className="btn btn-sm ms-2" onClick={handleZoomOut} disabled={pageScale <= 0.3}>
          <i className="fa-solid fa-minus"></i>
          </button>
          </div>
{/* 
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && ( */}
        <div id="pdf-container" className="" style={{marginBottom: '20px',zIndex:'1px',width:'100%' }}>
          {pdfurldata && (
            <Document  className=""
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from({ length: numPages }, (_, index) => (
                <Page key={index + 1} pageNumber={index + 1} scale={pageScale} style={{ display: index + 1 === currentPage ? 'block' : 'none' }} />
              ))}
            </Document>
          )}
        </div>
        
      {/* )} */}

                  </div>
                 
                </div>
              </div>

             
            </div>
           
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
<Backtotop/>
    </div>
  );
};

export default Translatedpdf;

