import React, { useEffect, useState } from 'react'
import Admin_sidebar from './Admin_sidebar'
import Admin_navbar from './Admin_navbar'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { ipaddress } from '../App'
import * as XLSX from 'xlsx';

const Admin_report = () => {
const navigate=useNavigate()

  const[report_details,setreport_details]=useState([])
  const[doc_report_details,setdoc_report_details]=useState([])
  const[course_report_details,setcourse_report_details]=useState([])
  const[group_report_details,setgroup_report_details]=useState([])
  const[flashset_report_details,setflashset_report_details]=useState([])

  const [displayed_user, setDisplayed_user] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const [displayed_doc, setDisplayed_doc] = useState([]);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const ITEMS_PER_PAGE2 = 10;

  const [displayed_course, setDisplayed_course] = useState([]);
  const [currentIndex3, setCurrentIndex3] = useState(0);
  const ITEMS_PER_PAGE3 = 10;

  const [displayed_group, setDisplayed_group] = useState([]);
  const [currentIndex4, setCurrentIndex4] = useState(0);
  const ITEMS_PER_PAGE4 = 10;

  const [displayed_flashset, setDisplayed_flashset] = useState([]);
  const [currentIndex5, setCurrentIndex5] = useState(0);
  const ITEMS_PER_PAGE5 = 10;

  const[tab,setTab]=useState('users')

  const {university_id}=useParams()

  useEffect(()=>{
    fetchdata()
  },[])

  const fetchdata=()=>{
    axios.get(`${ipaddress}/admin_app/ReportedValues/${tab}/`)
    .then((r)=>{
        console.log("reported data",r.data)
        setreport_details(r.data)
        setDisplayed_user(r.data.slice(0, ITEMS_PER_PAGE))

    })
    .catch((err)=>{
        // console.log("Reported data fetching error",err)
    })
  }

//   Document Report
  const fetchdocumentdata=()=>{
    axios.get(`${ipaddress}/admin_app/ReportedValues/documents/`)
    .then((r)=>{
        // console.log("document reported data",r.data)
        setdoc_report_details(r.data)
        setDisplayed_doc(r.data.slice(0, ITEMS_PER_PAGE2))
    })
    .catch((err)=>{
        // console.log("Document Reported data fetching error",err)
    })
  }

  //   Course Report
  const fetchcoursedata=()=>{
    axios.get(`${ipaddress}/admin_app/ReportedValues/courses/`)
    .then((r)=>{
        // console.log("Course reported data",r.data)
        setcourse_report_details(r.data)
        setDisplayed_course(r.data.slice(0, ITEMS_PER_PAGE3))
    })
    .catch((err)=>{
        // console.log("Course Reported data fetching error",err)
    })
  }

  //   Group Report
  const fetchgroupdata=()=>{
    axios.get(`${ipaddress}/admin_app/ReportedValues/groups/`)
    .then((r)=>{
        // console.log("Group reported data",r.data)
        setgroup_report_details(r.data)
        setDisplayed_group(r.data.slice(0, ITEMS_PER_PAGE4))
    })
    .catch((err)=>{
        // console.log("Group Reported data fetching error",err)
    })
  }

  //  Flashset Report
  const fetchflashsetdata=()=>{
    axios.get(`${ipaddress}/admin_app/AdminFlashReport/`)
    .then((r)=>{
        // console.log("Flashset reported data",r.data)
        setflashset_report_details(r.data)
        setDisplayed_flashset(r.data.slice(0, ITEMS_PER_PAGE5))
    })
    .catch((err)=>{
        // console.log("Flashset Reported data fetching error",err)
    })
  }

  // Excel

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(report_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'User_report_details.xlsx');
  };

  const exportToExcel_doc = () => {
    const worksheet = XLSX.utils.json_to_sheet(doc_report_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Document_report_details.xlsx');
  };

  const exportToExcel_sub = () => {
    const worksheet = XLSX.utils.json_to_sheet(course_report_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Course_report_details.xlsx');
  };

  const exportToExcel_group = () => {
    const worksheet = XLSX.utils.json_to_sheet(group_report_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Group_report_details.xlsx');
  };

  const exportToExcel_flashset = () => {
    const worksheet = XLSX.utils.json_to_sheet(flashset_report_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'Flashset_report_details.xlsx');
  };

  // Load more

  const loadMore = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE;
    const newDisplayedUniversities = report_details.slice(0, nextIndex + ITEMS_PER_PAGE);
    setDisplayed_user(newDisplayedUniversities);
    setCurrentIndex(nextIndex);
  };

  const loadMore2 = () => {
    const nextIndex = currentIndex2 + ITEMS_PER_PAGE2;
    const newDisplayedUniversities = doc_report_details.slice(0, nextIndex + ITEMS_PER_PAGE2);
    setDisplayed_doc(newDisplayedUniversities);
    setCurrentIndex2(nextIndex);
  };

  const loadMore3 = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE3;
    const newDisplayedUniversities = course_report_details.slice(0, nextIndex + ITEMS_PER_PAGE3);
    setDisplayed_course(newDisplayedUniversities);
    setCurrentIndex3(nextIndex);
  };

  const loadMore4 = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE4;
    const newDisplayedUniversities = group_report_details.slice(0, nextIndex + ITEMS_PER_PAGE4);
    setDisplayed_group(newDisplayedUniversities);
    setCurrentIndex4(nextIndex);
  };

  const loadMore5 = () => {
    const nextIndex = currentIndex5 + ITEMS_PER_PAGE5;
    const newDisplayedUniversities = flashset_report_details.slice(0, nextIndex + ITEMS_PER_PAGE5);
    setDisplayed_flashset(newDisplayedUniversities);
    setCurrentIndex5(nextIndex);
  };
  return (
    <div>
        <Admin_navbar/>

        <div className='d-flex'>
            <Admin_sidebar state={"report"}/>
            <div className='bg-light w-100 px-3'>
           
        <h6 className='mt-4 d-flex align-items-center'><span style={{cursor:'pointer'}} onClick={()=>{
          navigate('/university_details')
        }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg></span><span className='ms-2'>Report Details</span></h6>


      <div className="container px-1 px-lg-4">

            <ul className="nav nav-underline px-2 px-lg-5 gap-5 bg-white py-2 d-flex justify-content-between rounded shadow-sm" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
    <button className="nav-link active bg-white" style={{fontSize:'16px',color:tab=== "users" ? '#4880FF' : 'gray'}} id="home-tab" onClick={()=>{
      fetchdata()
      setTab("users")
    }} data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">User Reports</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link bg-white" style={{fontSize:'16px',color:tab=== "documents" ? '#4880FF' : 'gray'}} id="home-tab2" onClick={()=>{
     setTab("documents")
   fetchdocumentdata()
    }} data-bs-toggle="tab" data-bs-target="#home-tab-pane2" type="button" role="tab" aria-controls="home-tab-pane2" aria-selected="true">Documents Report</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link bg-white" style={{fontSize:'16px',color:tab=== "course" ? '#4880FF' : 'gray'}} id="home-tab3" onClick={()=>{
    fetchcoursedata()
      setTab("course")
    }} data-bs-toggle="tab" data-bs-target="#home-tab-pane3" type="button" role="tab" aria-controls="home-tab-pane3" aria-selected="true">Course Report</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link bg-white" style={{fontSize:'16px',color:tab=== "group" ? '#4880FF' : 'gray'}} id="profile-tab" onClick={()=>{
      fetchgroupdata()
      setTab("group")
    }} data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Group Report</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link bg-white" style={{fontSize:'16px',color:tab=== "flashset" ? '#4880FF' : 'gray'}} id="contact-tab" onClick={()=>{
      setTab("flashset")
      fetchflashsetdata()
    }} data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Flashset Report</button>
  </li>
</ul>
<div className="tab-content" id="myTabContent">

{/* --------------------------------------------------User Report--------------------------------------------------- */}
<div className="tab-pane fade bg-white show active mt-4" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
  
  <h6 className={`text-secondary text-center py-3 ${report_details.length>0 ? 'd-none':''}`}>No user reports available.....</h6>
  <div className={` mt-4 p-3 ${report_details.length>0 ? '':'d-none'}`}>
  <div className='d-flex justify-content-between align-items-center pb-3'>
                  <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>User Report</span></h6>
              <button className={`btn btn-sm text-white ${report_details.length>0 ? '':'d-none'}`} style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
<div className='table-responsive rounded bg-white border-0 p-3' style={{minHeight:'100vh'}}>
<table className={`table caption-top rounded`}>
  <thead className='invoice-table'>
    <tr>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>SI No</span></th>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>Reported by</span></th>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>Nickname</span></th>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>User Id</span></th>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>Reported on</span></th>
      <th scope="col" className='pb-3'><span className='fw-normal' style={{color:'#5A607F',fontSize:'16px'}}>Reports Count</span></th>
    </tr>
  </thead>
  <tbody>
    {report_details.map((x,index)=>{
      return(
        <tr style={{cursor:'pointer '}} onClick={()=>{
            navigate(`/report/users/${x.user_id}`)
        }}>
        <td className='py-3' scope="row">{index+1}</td>
        <td className='py-3'>{x.first_name} {x.last_name}</td>
        <td className='py-3'>{x.nickname}</td>
        <td className='py-3'>{x.user_id}</td>
        <td className='py-3'>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
        <td className={`py-3`}>{x.reports_count}</td>
     

      </tr>
      )
    })}
  </tbody>
</table>

{displayed_user.length < report_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore}>Load More...</p>
            )}
</div>
        
</div>
  </div>

{/* --------------------------------------------------Document Report--------------------------------------------------- */}
  <div className="tab-pane fade bg-white mt-4" id="home-tab-pane2" role="tabpanel" aria-labelledby="home-tab2" tabindex="0">
  <h6 className={`text-secondary text-center py-3 ${doc_report_details.length>0 ? 'd-none':''}`}>No document reports available.....</h6>
  
 <div className={`mt-4 p-3 ${doc_report_details.length>0 ? '':'d-none'}`}>
 <div className='d-flex justify-content-between align-items-center pb-3'>
                  <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>Document Report</span></h6>
              <button className={`btn btn-sm text-white ${doc_report_details.length>0 ? '':'d-none'}`} style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_doc}>
                Export to Excel
              </button>
            </div>
 <div className={`table-responsive mt-4`} style={{minHeight:'100vh'}}>
        <table className="table caption-top ">
  <thead>
  <tr>
      <th scope="col" className='fw-medium text-secondary'>SI.No</th>
      <th scope="col" className='fw-medium text-secondary'>Document Id</th>
      <th scope="col" className='fw-medium text-secondary'>Document Name</th>
      <th scope="col" className='fw-medium text-secondary'>Title</th>
      <th scope="col" className='fw-medium text-secondary'>Description</th>
      <th scope="col" className='fw-medium text-secondary'>Document Type</th>
      <th scope="col" className='fw-medium text-secondary'>Uploaded on</th>
      <th scope="col" className='fw-medium text-secondary'>Pages</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Sub Sub Sub Category</th>
      <th scope="col" className='fw-medium text-secondary'>Chapter Name</th>
      <th scope="col" className='fw-medium text-secondary'>Professor</th>
      <th scope="col" className='fw-medium text-secondary'>Report Count</th>

    </tr>
  </thead>
  <tbody>
    {doc_report_details.map((x,index)=>{
        return(
            <tr style={{cursor:'pointer'}} onClick={()=>{
                navigate(`/report/documents/${x.document_id}`)
            }}>
            <th scope="row">{index+1}</th>
            <td>{x.document_id}</td>
            <td>{x.doc_name}</td>
            <td>{x.title}</td>
            <td>{x.doc_description}</td>
            <td>{x.doc_type}</td>
            <td>{x.created_on!=undefined && x.created_on.slice(0,10)}</td>
            <td>{x.pages}</td>
            <td>{x.sub_cat}</td>
            <td>{x.sub_sub_cat!=null ? `${x.sub_sub_cat}`:'null'}</td>
            <td>{x.sub_sub_sub_cat!=null ? `${x.sub_sub_sub_cat}`:'null'}</td>
            <td>{x.chapter_name!=null ? `${x.chapter_name}`:'null'}</td>
            <td>{x.professor}</td>
            <td>{x.reports_count}</td>
          </tr>
        )
    })}
  </tbody>
</table>

{displayed_doc.length < doc_report_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore2}>Load More...</p>
            )}
</div>
 </div>
  </div>

{/* --------------------------------------------------Course Report-------------------------------------------------- */}
<div className="tab-pane fade bg-white mt-4" id="home-tab-pane3" role="tabpanel" aria-labelledby="home-tab3" tabindex="0">
<h6 className={`text-secondary text-center py-3 ${course_report_details.length>0 ? 'd-none':''}`}>No course reports available.....</h6>

  <div className={`table-responsive mt-4 p-2 rounded ${course_report_details.length>0 ? '':'d-none'}`} style={{minHeight:'100vh'}}>
  <div className='d-flex justify-content-between align-items-center py-3'>
                  <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>Course Report</span></h6>
              <button className={`btn btn-sm text-white`} style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_sub}>
                Export to Excel
              </button>
            </div>
        <table className="table caption-top">
        <thead>
    <tr>
      <th scope="col"><span className='fw-medium text-secondary'>SI No</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Course Id</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Course Name</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Reports Count</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>University Name</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>City</span></th>
    </tr>
  </thead>
  <tbody>
    {course_report_details.map((x,index)=>{
      return(
        <tr style={{cursor:'pointer'}} onClick={()=>{
            navigate(`/report/courses/${x.course_id}`)
        }}>
        <td scope="row" className='py-3'>{index+1}</td>
        <td className='py-3'>{x.course_id}</td>
        <td className='py-3'>{x.ccourse_name}</td>
        <td className='py-3'>{x.reports_count}</td>
        <td className='py-3'>{x.university_name.university_name}</td>
        <td className='py-3'>{x.university_name.city}</td>
       
      </tr>
      )
    })}
  </tbody>
</table>

{displayed_course.length < course_report_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore3}>Load More...</p>
            )}
</div>
  </div>

{/* ------------------------------------------------Group Report------------------------------------------------------ */}
  <div className="tab-pane fade bg-white mt-4" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
  <h6 className={`text-secondary text-center py-3 ${group_report_details.length>0 ? 'd-none':''}`}>No group reports available.....</h6>

  <div className={`table-responsive p-2 ${group_report_details.length>0 ? '':'d-none'}`} style={{minHeight:'100vh'}}>
  <div className='d-flex justify-content-between align-items-center py-3'>
                  <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>Group Report</span></h6>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_group}>
                Export to Excel
              </button>
            </div>
        <table className="table caption-top">
  <thead>
    <tr>
      <th scope="col"><span className='fw-medium text-secondary'>SI No</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Group Id</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Group Name</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Created on</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Description</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Member Count</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Reports Count</span></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {group_report_details.map((x,index)=>{
      return(
        <tr style={{cursor:'pointer'}} onClick={()=>{
            navigate(`/report/groups/${x.group_id}`)
        }}>
      <td scope="row">{index+1}</td>
      <td>{x.group_id}</td>
      <td>{x.group_name}</td>
      <td>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
      <td>{x.description}</td>
      <td>{x.member_count}</td>
      <td>{x.reports_count}</td>
    </tr>
      )
    })}
  </tbody>
</table>

{displayed_group.length < group_report_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore4}>Load More...</p>
            )}
</div>
  </div>

{/* --------------------------------------------------Flashset Report--------------------------------------------------- */}
  <div className="tab-pane fade bg-white mt-4" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
<h6 className={`text-secondary text-center py-3 ${flashset_report_details.length>0 ? 'd-none':''}`}>No flashset reports available.....</h6>
  

  <div className={`table-responsive ${flashset_report_details.length>0 ? '':'d-none'}`} style={{minHeight:'100vh'}}>
  <div className='d-flex justify-content-between align-items-center py-3'>
                  <h6 className='m-0 d-flex align-items-center'><span className='ms-2'>Flashset Report</span></h6>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel_flashset}>
                Export to Excel
              </button>
            </div>
        <table className="table caption-top">
  <thead>
    <tr>
    <th scope="col"><span className='fw-medium text-secondary'>SI No</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Flashset Id</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Reported on</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Reported by</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Report</span></th>
      <th scope="col"><span className='fw-medium text-secondary'>Report Count</span></th>
    </tr>
  </thead>
  <tbody>
  {flashset_report_details.map((x,index)=>{
      return(
        <tr style={{cursor:'pointer'}} onClick={()=>{
          navigate(`/report/flashset/${x.flashsetid}`)
      }}>
        <td scope="row">{index+1}</td>
        <td>{x.flashsetid}</td>
        <td>{x.date_time!=undefined && x.date_time.slice(0,10)}</td>
        <td>{x.user_id}</td>
        <td>{x.user_report}</td>
        <td>{x.report_count}</td>
      </tr>
      )
    })}
  </tbody>
</table>

{displayed_flashset.length < flashset_report_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore5}>Load More...</p>
            )}
</div>
  </div>

</div>
        </div>
            </div>
        </div>
    </div>
  )
}

export default Admin_report