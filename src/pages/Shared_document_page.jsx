import React from 'react'
import { Document,Page } from 'react-pdf';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ipaddress } from '../App';
import { setAccessToken } from './authService';
import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';

const Shared_document_page = () => {

    const[pdfurldata,setPdfurldata]=useState({})
    const user=JSON.parse(sessionStorage.getItem('user'))
    const [error, setError] = useState(null);
    const[emailvalidation,setemailvalidation]=useState("")
    const {token}=useParams()
    const[document_id,setdocument_id]=useState(0)
    useEffect(()=>{
        axios.get(`${ipaddress}/DisplayDocument/${token}/`)
        .then((response) => {
          // console.log("document shared data fetched", response.data);
          setPdfurldata(response.data.pdf_data[0]);
          setdocument_id(response.data.pdf_data[0].documnet_id.document_id);
          
        //   setLoading(false);
          
        })
        .catch((error) => {
          // console.log("Error in Document Followers Fetching", error);
          setError("Error fetching document data");
        //   setLoading(false);
        });
    },[token])


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


  // ----------------------------------------------Login functionality------------------------------------------------------
  const[userid,setUserid]=useState("")
  const[password,setPassword]=useState("")
  const useridData=(e)=>{
    setUserid(e.target.value)
  }
  const passwordData=(e)=>{
    setPassword(e.target.value)
  }

  let navigate = useNavigate();
  const handleSubmit = async () => {
    await axiosInstance.post(`${ipaddress}/CheckEmailForThreeMonths/${userid}/`)
      .then((r) => {
        if (r.data.message === "You can access this view.") {
          verifiedlogin();
          setUserid("");
          setPassword("");
        }
        if (r.data.message === "Please re-verify your email.") {
          setemailvalidation(true);
        }
      })
      .catch((err) => {
        toast.error('Email not verified', {
          autoClose: 3000,
        });
      });
  };

  const generate_token = (e) => {
    e.preventDefault();
    axios.post(`${ipaddress}/api/token/`, {
      email: userid,
      password: password
    })
      .then((r) => {
        setAccessToken(r.data.access, r.data.refresh);
        handleSubmit();
      })
      .catch((err) => {
        console.error("Token error", err);
        toast.error('Invalid Login Credentials',{
          autoClose:1000,
          theme:'colored',
          position:'top-center'
        })
      });
  };

  const[loading,setloading]=useState()
  const verifiedlogin=()=>{
    // setloading(true)
    console.log("Called")
    const values={userid,password}
      axiosInstance.post(`${ipaddress}/UserLogin/`,values)
      .then((r)=>{
        console.log("Login successfully", r.data);
      sessionStorage.setItem("user",JSON.stringify(r.data))
      // setloading(false)
      navigate(`/showpdf/${document_id}`)
      setUserid("")
      setPassword("")
      })
      // navigate('/verify');
    .catch((err)=>{
      // Handle error
      console.error("Error Message",err);
      setUserid("")
      setPassword("")
      toast.error('Invalid Login Credentials',{
        autoClose:1000,
        theme:'colored',
        position:'top-center'
      })
    })
  }
  return (
    <div className='p-3'>
          <div data-bs-toggle="modal" data-bs-target="#loginmodal">
          <div className="w-100 p-1 p-md-4 pt-3 showpdf-div pb-2 mb-3">
                 <div className="d-flex justify-content-end">

                 </div>
               <p
                   className="fw-medium d-block fs-5 text-white mt-3 mt-md-0"
                   style={{fontSize:'20px',fontWeight:500,lineHeight:'normal',letterSpacing:'0.4px'}}
                 >
                   
                   {pdfurldata && pdfurldata.documnet_id &&  pdfurldata.documnet_id.doc_name!=undefined ? (
                     pdfurldata.documnet_id.doc_name
                   ):(<></>)}
                 </p>

{/* -----------------------------------------------Document Details------------------------------------------------------ */}

<div className="m-0 d-flex align-items-center mt-4 gap-lg-3" >
                         <span  style={{fontSize:'14px',color:'#fff'}}  className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M10.4168 14.0625H14.0426V13.0208H10.4168V14.0625ZM10.4168 10.9375H17.6684V9.89583H10.4168V10.9375ZM10.4168 7.8125H17.6684V6.77083H10.4168V7.8125ZM8.45368 17.7083C7.97425 17.7083 7.57395 17.5477 7.25277 17.2266C6.93159 16.9054 6.771 16.5051 6.771 16.0257V4.80768C6.771 4.32826 6.93159 3.92795 7.25277 3.60677C7.57395 3.28559 7.97425 3.125 8.45368 3.125H19.6716C20.1511 3.125 20.5514 3.28559 20.8726 3.60677C21.1937 3.92795 21.3543 4.32826 21.3543 4.80768V16.0257C21.3543 16.5051 21.1937 16.9054 20.8726 17.2266C20.5514 17.5477 20.1511 17.7083 19.6716 17.7083H8.45368ZM8.45368 16.6667H19.6716C19.8319 16.6667 19.9788 16.5999 20.1124 16.4664C20.2459 16.3328 20.3127 16.1859 20.3127 16.0257V4.80768C20.3127 4.64744 20.2459 4.50054 20.1124 4.36698C19.9788 4.23344 19.8319 4.16667 19.6716 4.16667H8.45368C8.29344 4.16667 8.14653 4.23344 8.01298 4.36698C7.87943 4.50054 7.81266 4.64744 7.81266 4.80768V16.0257C7.81266 16.1859 7.87943 16.3328 8.01298 16.4664C8.14653 16.5999 8.29344 16.6667 8.45368 16.6667ZM5.32868 20.8333C4.84925 20.8333 4.44895 20.6727 4.12777 20.3516C3.80659 20.0304 3.646 19.6301 3.646 19.1507V6.89102H4.68766V19.1507C4.68766 19.3109 4.75443 19.4578 4.88798 19.5914C5.02152 19.7249 5.16842 19.7917 5.32868 19.7917H17.5883V20.8333H5.32868Z" fill="#fff"/>
</svg> <span className='ms-2'>
                   {pdfurldata && pdfurldata.documnet_id && pdfurldata.documnet_id.pages!=undefined ? (
                     pdfurldata.documnet_id.pages
                   ):(<></>)} <span className="d-none d-md-inline">Pages</span></span></span>
                   
       <span  style={{fontSize:'14px',color:'#fff'}} className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M5.84919 21.8752C5.36976 21.8752 4.96946 21.7146 4.64827 21.3934C4.32709 21.0722 4.1665 20.6719 4.1665 20.1925V6.89117C4.1665 6.41174 4.32709 6.01144 4.64827 5.69026C4.96946 5.36908 5.36976 5.20849 5.84919 5.20849H7.69213V2.88477H8.81393V5.20849H16.2659V2.88477H17.3075V5.20849H19.1505C19.6299 5.20849 20.0302 5.36908 20.3514 5.69026C20.6726 6.01144 20.8332 6.41174 20.8332 6.89117V20.1925C20.8332 20.6719 20.6726 21.0722 20.3514 21.3934C20.0302 21.7146 19.6299 21.8752 19.1505 21.8752H5.84919ZM5.84919 20.8335H19.1505C19.3107 20.8335 19.4576 20.7667 19.5912 20.6332C19.7247 20.4996 19.7915 20.3527 19.7915 20.1925V11.0578H5.20817V20.1925C5.20817 20.3527 5.27494 20.4996 5.40848 20.6332C5.54204 20.7667 5.68894 20.8335 5.84919 20.8335ZM5.20817 10.0162H19.7915V6.89117C19.7915 6.73093 19.7247 6.58403 19.5912 6.45047C19.4576 6.31693 19.3107 6.25016 19.1505 6.25016H5.84919C5.68894 6.25016 5.54204 6.31693 5.40848 6.45047C5.27494 6.58403 5.20817 6.73093 5.20817 6.89117V10.0162Z" fill="#fff"/>
</svg><span className='ms-2'>
                   {pdfurldata && pdfurldata.documnet_id && pdfurldata.documnet_id.created_on!=undefined ?(
                     pdfurldata.documnet_id.created_on
                   ):(<></>)}</span></span>
 </div>
 <div className="mt-4 d-flex align-items-center gap-3">
 
 {pdfurldata && (
 <span className="text-white ms-3 d-flex align-items-center" style={{fontSize:'14px'}}>
  {/* {pdfurldata.user_id.profile_pic!=undefined ? (<img src={pdfurldata.user_id.profile_pic} className={`me-2 my-auto ${pdfurldata.user_id.profile_pic !=null ? '':'d-none'}`} width={30} height={30} alt="" />):(<></>)} */}
  {/* {pdfurldata.user_id.nickname!=undefined ? (<p className={`me-2 ${pdfurldata.user_id.profile_pic !=null ? 'd-none':' my-auto d-flex align-items-center justify-content-center'} bg-primary rounded-circle`} style={{height:'28px',width:'28px',fontSize:'13px'}}>{pdfurldata.user_id.nickname.slice(0,1)}{pdfurldata.user_id.nickname.slice(-1)}</p>):(<></>)} */}
 {/* <span style={{fontSize:'14px',fontWeight:450,lineHeight:'normal',letterSpacing:'0.28px'}}>By {user.nickname}</span> */}
 </span>
 )}
 </div>
               </div>


{/* --------------------------------------------------Display document layout----------------------------------------------- */}
           <div>
            <div className="button-container rounded d-flex justify-content-center align-items-center border border-bottom-0 py-1" style={{ backgroundColor: '#5d5fe3' }}>
              <button className="btn text-white btn-sm" onClick={handleZoomIn} disabled={pageScale >= 1.8}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M28.415 29.3913L19.2835 20.2599C18.5544 20.8806 17.7158 21.3611 16.7679 21.7014C15.82 22.0417 14.8674 22.2118 13.9101 22.2118C11.5743 22.2118 9.59752 21.4033 7.97962 19.7863C6.3617 18.1693 5.55273 16.1935 5.55273 13.859C5.55273 11.5245 6.36125 9.54723 7.97827 7.92716C9.59529 6.3071 11.5711 5.49707 13.9056 5.49707C16.2401 5.49707 18.2174 6.30602 19.8374 7.92392C21.4575 9.54182 22.2675 11.5187 22.2675 13.8545C22.2675 14.8678 22.088 15.8484 21.729 16.7963C21.3701 17.7443 20.8989 18.5548 20.3156 19.2279L29.447 28.3593L28.415 29.3913ZM13.9101 20.7535C15.8452 20.7535 17.4788 20.0874 18.811 18.7553C20.1431 17.4232 20.8092 15.7895 20.8092 13.8545C20.8092 11.9194 20.1431 10.2858 18.811 8.95361C17.4788 7.62147 15.8452 6.9554 13.9101 6.9554C11.975 6.9554 10.3414 7.62147 9.00928 8.95361C7.67716 10.2858 7.0111 11.9194 7.0111 13.8545C7.0111 15.7895 7.67716 17.4232 9.00928 18.7553C10.3414 20.0874 11.975 20.7535 13.9101 20.7535ZM13.1809 17.332V14.5836H10.4326V13.1253H13.1809V10.3769H14.6393V13.1253H17.3877V14.5836H14.6393V17.332H13.1809Z" fill="white"/>
</svg>
              </button>
              <button className="btn text-white btn-sm ms-2" onClick={handleZoomOut} disabled={pageScale <= 1.0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M28.415 29.3913L19.2835 20.2599C18.5544 20.8806 17.7158 21.3611 16.7679 21.7014C15.82 22.0417 14.8674 22.2118 13.9101 22.2118C11.5743 22.2118 9.59752 21.4033 7.97962 19.7863C6.3617 18.1693 5.55273 16.1935 5.55273 13.859C5.55273 11.5245 6.36125 9.54723 7.97827 7.92716C9.59529 6.3071 11.5711 5.49707 13.9056 5.49707C16.2401 5.49707 18.2174 6.30602 19.8374 7.92392C21.4575 9.54182 22.2675 11.5187 22.2675 13.8545C22.2675 14.8678 22.088 15.8484 21.729 16.7963C21.3701 17.7443 20.8989 18.5548 20.3156 19.2279L29.447 28.3593L28.415 29.3913ZM13.9101 20.7535C15.8452 20.7535 17.4788 20.0874 18.811 18.7553C20.1431 17.4232 20.8092 15.7895 20.8092 13.8545C20.8092 11.9194 20.1431 10.2858 18.811 8.95361C17.4788 7.62147 15.8452 6.9554 13.9101 6.9554C11.975 6.9554 10.3414 7.62147 9.00928 8.95361C7.67716 10.2858 7.0111 11.9194 7.0111 13.8545C7.0111 15.7895 7.67716 17.4232 9.00928 18.7553C10.3414 20.0874 11.975 20.7535 13.9101 20.7535ZM10.6008 14.5836V13.1253H17.2194V14.5836H10.6008Z" fill="white"/>
</svg>
              </button>

              
            </div>

            <div id="pdf-container" className="d-flex justify-content-center bg-secondary-subtle" style={{ marginBottom: '20px', zIndex: '1px', width: '100%', height: '100%', overflowY: 'scroll' }}>
              {pdfurldata && pdfurldata.documnet_id ? (
                <Document className="" file={pdfurldata.documnet_id.document_url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                  {Array.from({ length: numPages }, (_, index) => (
                    <Page key={index + 1} pageNumber={index + 1} scale={pageScale} style={{ display: index + 1 === currentPage ? 'block' : 'none' }} />
                  ))}
                </Document>
              ):(<></>)}
            </div>
          </div>
          </div>

{/* -----------------------------------------------Login page modal---------------------------------------------------- */}
<div className="modal fade" id="loginmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-body">
      <div className="d-flex justify-content-center align-items-center">
            <div className='bg-white rounded py-5 login-form d-flex flex-column align-items-center justify-content-center' style={{height:'544px'}}>
              <h3 className='text-center mb-5 fw-bold'>Login</h3>
            <form action="" className='p-2 px-2 w-100' onSubmit={generate_token}>
                <div className="mb-4">
                <label for="floatingInput" style={{color:'#8E9696'}} className='mb-2'>Email</label>
          <input type="text" name='userid' className="form-control shadow-none bg-light" id="floatingInput" style={{height:'50px'}} onChange={useridData} value={userid}/>
        </div>
        
        <div className="mb-2">
        <label for="floatingPassword" style={{color:'#8E9696'}} className='mb-2'>Password</label>
          <input type="password" name='password' className="form-control shadow-none bg-light" style={{height:'50px'}} id="floatingPassword" onChange={passwordData} value={password}/>
        </div>
         <div className="text-center mt-4">
            <button type='submit' className='btn Login-btn btn-md py-2 px-5 text-white fw-medium' data-bs-dismiss="modal">Submit</button>
        </div> 
        <p className='text-center mt-4'>Don't have account? <span className='text-primary text-decoration-underline' style={{cursor:'pointer'}} onClick={()=>{
          navigate('/signuppage')
        }}>Sign Up here</span></p>    
        </form>
              
            </div>
          </div>
      </div>
      
    </div>
  </div>
</div>
    </div>
  )
}

export default Shared_document_page
