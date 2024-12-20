import React, { useEffect, useState, useContext } from 'react'
import Mainsidebar from '../components/Mainsidebar'
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import { Document, Page } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { ipaddress, ipaddress2 } from '../App';
import { Context } from '../context/Context_provider';
import Navpath from './Navpath';
import axiosInstance from './axiosInstance';
import axios from 'axios';
import * as bootstrap from 'bootstrap';


const Group_document_upload = () => {
  // const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)

  const [loading, setloading] = useState()
  const navigate = useNavigate()
  const { group_id } = useParams()
  const [subsubCategory, setSubsubcategory] = useState([])

  const [preview_btn_status, setpreview_btn_status] = useState(true)
  const [chaptervisibility, setChaptervisibility] = useState(false)
  const [exam_papervisibility, setexam_papervisibility] = useState(false)
  const [notesvisibility, setnotesvisibility] = useState(false)

  const [theoryvisibility, settheoryvisibility] = useState(false)
  const [exercisevisibility, setexercisevisibility] = useState(false)
  const [notevisibility, setnotevisibility] = useState(false)

  // -------------------------------------------------Set Path-------------------------------------------------------------
  sessionStorage.setItem("name3", JSON.stringify('Upload Document'))
  sessionStorage.setItem("path3", JSON.stringify(`/group_upload_page/${group_id}`))




  // const category=(e)=>{
  //   setCategoryIdid(e.target.value)
  // }
  const [courseid, setCourseid] = useState(0)
  const courseData = (e) => {
    setCourseid(e.target.value)

  }

  const [subcategoryid, setsubcategoryid] = useState("")
  const subcategoryData = (e) => {
    setsubcategoryid(e.target.value)
    if (e.target.value === "chapter") {
      setChaptervisibility(true)
      setexam_papervisibility(false)
      setnotesvisibility(false)
    }
    if (e.target.value === "exam_paper") {
      setChaptervisibility(false)
      setexam_papervisibility(true)
      setnotesvisibility(false)
    }
    if (e.target.value === "notes") {
      setChaptervisibility(false)
      setexam_papervisibility(false)
      setnotesvisibility(true)
    }
  }
  const [subsubcategoryid, setsubsubcategoryid] = useState("")
  const subsubcategoryData = (e) => {
    setsubsubcategoryid(e.target.value)
    if (e.target.value === "theory") {
      settheoryvisibility(true)
      setexercisevisibility(false)
      setnotevisibility(false)
    }
    if (e.target.value === "exercise") {
      settheoryvisibility(false)
      setexercisevisibility(true)
      setnotevisibility(false)
    }
    if (e.target.value === "note") {
      settheoryvisibility(false)
      setexercisevisibility(false)
      setnotevisibility(true)
    }
  }
  const [Chaptername, setChaptername] = useState("")
  const [chapternames, setChapternames] = useState([])
  const [chapterlayoutstatus, setchapterlayoutstatus] = useState(true)

  const chapternameData = (e) => {
    setChaptername(e.target.value)
    // To get the Available chapter names
    if (e.target.value.length > 0) {
      axiosInstance.get(`${ipaddress}/ChapterSuggestions/${e.target.value}/`)
        .then((p) => {
          setChapternames(p.data)
          // console.log("Chapter names fetching :",p.data)
        })
        .catch(() => {
          console.log("Chapter names fetching Error")
        })
    }
  }

  const [semesterid, setSemesterid] = useState(0)
  const semesterId = (e) => {
    setSemesterid(e.target.value)
  }
  const [year, setyear] = useState(0)
  const yeardata = (e) => {
    setyear(e.target.value)
  }

  const [subsubsubcategoryid, setsubsubsubcategoryid] = useState("")
  const subsubsubcategorydata = (e) => {
    setsubsubsubcategoryid(e.target.value)
  }

  const [description, setDescription] = useState("")
  const descriptionData = (e) => {
    setDescription(e.target.value)
  }


  // --------------------------------------TO GET YEAR----------------------------------------------
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  // const files = acceptedFiles.map(file => (
  //   <li className='mt-4 fs-6' style={{listStyleType:'none'}} key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  const [filename, setFilename] = useState("")
  const [document_title, setdocument_title] = useState("")

  const [file, setFile] = useState(null)
  const onFileChange = (e) => {
    var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
    if (fileSize > 2) {
      alert("File size must be less than 2 MB.");
    } else {
      setFile(e.target.files[0])
      document.getElementById('uploadform').style.display = 'none'
      document.getElementById('details').style.display = 'block'
    }
  }

  const upload = async (e) => {
    setloading(true)
    const user = JSON.parse(sessionStorage.getItem('user'))
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1044 * 1044);
    if (fileSizeInMB <= 100) {
      // Send the PDF file to the Django backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", document_title);
      formData.append("group_id", group_id);
      formData.append("course_id", categoryid);
      formData.append("semester_id", semesterid);
      formData.append("subcategory", subcategoryid);
      formData.append("description", description);
      formData.append("subsubcategory", subsubcategoryid);
      formData.append("subsubsubcategory", subsubsubcategoryid);
      formData.append("year", year);

      // console.log(file.size)
      // console.log(formData)

      try {
        const response = await axios.post(`${ipaddress}/uploadDocuments/${user.user_id}/`, formData);
        // console.log("Data sent successfully:", response.data);

        if (response.data.message === 'document is already present inside this') {
          setloading(false)
          const toastLiveExample = document.getElementById('liveToast');
          document.getElementById('toastbody').style.color = "red"
          document.getElementById('toastbody').textContent = 'This document is already uploaded';
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
          toastBootstrap.show();
        }
        else {
          setloading(false)
          setCount(count + 1)
          document.getElementById('uploadedsuccessfully').style.display = 'none'
          document.getElementById('finalstep').style.display = 'block'

          setTimeout(() => {
            navigate(`/groupchat/privategroup/${group_id}`)
          }, 2000)
        }
      }

      catch (error) {
        console.error("Error sending data:", error);
        // console.log(formData)
      }
    }
    else {
      setloading(false)
      // console.log("File size Exceeded")
      document.getElementById('file-msg').style.color = "red"
      document.getElementById('file-msg').style.fontStyle = 'italic'
      setFilename("*File Size Limit Exceeded (Max Limit 100MB)")
    }
  };

  const [joinedCourses, setJoinedCourses] = useState([])
  const [semesterdata, setSemesterdata] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [count, setCount] = useState(0)

  const [user, setUserdata] = useState({})
  useEffect(() => {
    const university = JSON.parse(sessionStorage.getItem('user'))
    axiosInstance.get(`${ipaddress}/CoursesView/${university.user_id}/`)
      .then((r) => {
        // console.log(r.data)
        setJoinedCourses(r.data.joined_courses)
      })
      .catch(() => {
        console.log("Joined courses fetching error")
      })

    axiosInstance.get(`${ipaddress}/Semesters/`)
      .then((p) => {
        setSemesterdata(p.data)
        // console.log("Semester data :",p.data)
      })
      .catch(() => {
        console.log("Semester Error")
      })
    axiosInstance.get(`${ipaddress}/category_view/`)
      .then((p) => {
        setCategoryData(p.data)
        // console.log("Category data :",p.data)
      })
      .catch(() => {
        console.log("Category Error")
      })
    axiosInstance.get(`${ipaddress}/subCategoryView/`)
      .then((p) => {
        setSubcategories(p.data)
        // console.log("Sub Category data :",p.data)
      })
      .catch(() => {
        console.log("Sub Category data Error")
      })
  }, [])

  const chapter_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
  const [chapter_id, setchapter_id] = useState()
  const [status, setstatus] = useState(false)
  const [message, setmessage] = useState('')

  const [categoryid, setCategoryIdid] = useState()
  const fetch_chapter = (id) => {
    axiosInstance.get(`${ipaddress2}/SendChapterName/${categoryid}/${id}/`)
      .then((r) => {
        console.log("Chapter_names", r.data)
        if (r.data === 'not found') {
          setmessage('*Chapter name not available, Enter the Chapter Name')
          setChaptername('')
        }
        else {
          setChaptername(r.data.chapter_name)
          setmessage('')
        }
      })
      .catch((err) => {
        console.log("Course_id", categoryid)
      })
  }

  return (
    <div>
      <div className="d-flex">
        <Mainsidebar activevalue={"upload"}></Mainsidebar>
        <div onClick={() => {
          setcourse_visible(false)
          setgroup_visible(false)
          setstudylist_visible(false)
        }} className='w-100 pt-4  mt-5 main-division d-flex flex-column align-items-center px-3 px-lg-0' style={{ backgroundColor: '#F9F9FB' }}>
          <Navbar count={count}></Navbar>

          <div onClick={() => {
            setnavbar_dropdown_visible(false)
          }}>
            <div className="container-fluid pb-5 pt-3" style={{ position: 'relative', backgroundColor: '#F3F0FF', height: '150px' }}>
              <div className='pt-4 ps-4'>
                <Navpath />
              </div>
              <div id='uploadimg' className='rounded-circle bg-white border p-2' style={{ position: 'absolute', top: '100px' }}>
                <img src={require('../img/images_icons/send-img2.png')} width={80} alt="" />
              </div>
            </div>
            <div className="container mt-2 p-md-3 p-1 pt-4">

              {/* -----------------------------------------------UPLOAD FORM---------------------------------------------------------- */}

              <section className="row justify-content-center mt-4" id='uploadform'>
                <div className='d-flex justify-content-evenly py-2 py-lg-3 pb-2 px-lg-5'>
                  <span className='fw-bold'>Upload Document</span>
                  <span className='text-secondary'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Details</span></span>
                  <span className='text-secondary'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Preview & Submit</span></span>
                </div>
                <div className="col-lg-9 col-md-10 rounded shadow-sm text-center mx-auto pt-4 pb-3 bg-white shadow-sm">

                  <div className='bg-light py-5 rounded px-4' style={{ border: '1px dashed #5D5FE3' }}>
                    <p>
                      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44" fill="none">
                        <path d="M16.125 35.5H17.875V23.375L23.5 29L24.75 27.75L17 20L9.25 27.75L10.5 29L16.125 23.375V35.5ZM4 43.75C2.91667 43.75 2.02083 43.3958 1.3125 42.6875C0.604167 41.9792 0.25 41.0833 0.25 40V4C0.25 2.91667 0.604167 2.02083 1.3125 1.3125C2.02083 0.604167 2.91667 0.25 4 0.25H23.625L33.75 10.375V40C33.75 41.0833 33.3958 41.9792 32.6875 42.6875C31.9792 43.3958 31.0833 43.75 30 43.75H4ZM22.75 11.25V2H4C3.5 2 3.04167 2.20833 2.625 2.625C2.20833 3.04167 2 3.5 2 4V40C2 40.5 2.20833 40.9583 2.625 41.375C3.04167 41.7917 3.5 42 4 42H30C30.5 42 30.9583 41.7917 31.375 41.375C31.7917 40.9583 32 40.5 32 40V11.25H22.75Z" fill="#5D5FE3" />
                      </svg>
                    </p>
                    <p className="mb-3" style={{ color: '#5D5FE3', fontSize: '17px' }}>
                      Browse & Upload Your Files Here...
                    </p>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf"
                      onChange={onFileChange}
                      className="bg-light text-center p-3 btn"
                    />
                    <label
                      for="fileInput"
                      className="custom-file-input rounded border-0 text-white px-5 py-2 fw-normal" style={{ backgroundColor: '#5D5FE3' }}
                    >
                      Browse
                    </label>
                    {/* {file && (
                  <p className='mt-3 fw-medium' id='file-msg'>{file.name}</p>
                )}
                <div className='text-end'>
                  {file && (
                    <button className='btn btn-sm btn-danger text-white' data-bs-toggle="modal" data-bs-target="#previewmodal">Preview</button>
                  )}
                  <button className='btn btn-sm btn-primary text-white ms-3' onClick={upload}>Upload</button>
                </div> */}
                  </div>
                </div>
              </section>

              {/* -------------------------------------------------DETAILS FORM----------------------------------------------------- */}
              <div className='py-3 px-lg-5' id='details' style={{ display: 'none' }}>
                <div className='d-flex justify-content-evenly py-2 py-lg-3 pb-2 px-lg-5'>
                  <span className='fw-bold'>Upload Document</span>
                  <span className='text-dark'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Details</span></span>
                  <span className='text-secondary'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Preview & Submit</span></span>
                </div>
                <div className='row shadow-sm py-3 py-md-4 mx-auto d-flex justify-content-center bg-white align-items-center px-3'>
                  <div className="mb-4 col-md-12">
                    <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document Title <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className='form-control py-3' value={document_title} onChange={(e) => {
                      setdocument_title(e.target.value)
                    }} />
                  </div>
                  <div className="mb-4 col-md-6">
                    <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Subject Name <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="courses"
                      className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                      aria-label="Large select example"
                      onChange={(e) => {
                        setCategoryIdid(e.target.value)
                        setpreview_btn_status(false)
                      }}
                      value={categoryid}
                    >
                      <option value="" selected>Select the Subject</option>
                      {joinedCourses.map((x, index) => {
                        return (
                          <>
                            <option value={x.course_id}>{x.course_name}</option>
                          </>
                        )
                      })}
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document Type <span style={{ color: 'red' }}>*</span></label>
                    <select
                      name="courses"
                      className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                      aria-label="Large select example"
                      onChange={subcategoryData}
                      value={subcategoryid}
                    >
                      <option value="" selected>Select the Document Type</option>
                      <option value="chapter">Chapter</option>
                      <option value="exam_paper">Exam Paper</option>
                      <option value="notes">Notes</option>
                    </select>
                  </div>

                  {/* --------------------------------------------CHAPTER SUB SUB CATEGORY-------------------------------------------- */}
                  <div className={`col-12 ${chaptervisibility ? '' : 'd-none'}`}>
                    <div className="row">

                      <div className="col-lg-6 mb-3">
                        <label for="formGroupExampleInput" className="form-label text-secondary">Chapter Number</label>
                        <div className="input-group bg-light border py-2">
                          <input type="text" style={{ cursor: 'pointer' }} onClick={() => {
                            setstatus(true)
                          }} value={chapter_id} className="form-control border-0 bg-transparent country-input" placeholder="Select the Chapter Number" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                        {/* --------------------------------SEARCH BAR FOR PROGRAM----------------------------------- */}
                        <div className={`px-3 py-2 bg-light border border-top-0 ${status && chapter_numbers.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                          {chapter_numbers.map((x) => {
                            return (
                              <>
                                <p onClick={() => {
                                  setchapter_id(x)
                                  setstatus(false)
                                  fetch_chapter(x)
                                }} className="m-0" style={{ cursor: 'pointer' }}>Chapter {x}</p>
                              </>
                            )
                          })}
                        </div>
                      </div>

                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Chapter Name</label>
                        <input type="text" value={Chaptername} maxLength={25} onChange={(e) => {
                          setChaptername(e.target.value)
                        }} className='form-control py-3' name="" id="" />
                        <p className='mt-1' style={{ color: 'red', fontSize: '14px' }}>{message && message}</p>

                      </div>


                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document Category</label>
                        <select
                          name="courses"
                          className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                          aria-label="Large select example"
                          onChange={subsubcategoryData}
                          value={subsubcategoryid}
                        >
                          <option value="" selected>Select the Document Category</option>
                          <option value="theory">Theory</option>
                          <option value="exercise">Exercise</option>
                          <option value="note">Notes</option>
                        </select>
                      </div>
                    </div>

                    {/* -----------------------------------------------CHAPTER SUB SUB SUB CATEGORY-------------------------------------- */}
                    <div className={`row ${theoryvisibility ? '' : 'd-none'}`}>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document sub category</label>
                        <input type="text" className='form-control py-3' name="" id="" value={subsubsubcategoryid} onChange={subsubsubcategorydata} />
                      </div>
                    </div>

                    <div className={`row ${exercisevisibility ? '' : 'd-none'}`}>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document Sub Category</label>
                        <select
                          name="courses"
                          className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                          aria-label="Large select example"
                          onChange={subsubsubcategorydata}
                          value={subsubsubcategoryid}
                        >
                          <option value="" selected>Select the Document Sub Category</option>
                          <option value="questions">Questions</option>
                          <option value="answers">Answers</option>
                          <option value="question & answers">Question & Answers</option>
                        </select>
                      </div>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Description</label>
                        <input type="text" className='form-control py-3' name="" id="" value={description} onChange={descriptionData} />
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------------EXAM PAPER SUB SUB CATEGORY-------------------------------------------- */}
                  <div className={`col-12 ${exam_papervisibility ? '' : 'd-none'}`}>
                    <div className="row">
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Semester</label>
                        <select
                          name="courses"
                          className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                          aria-label="Large select example"
                          onChange={(e) => {
                            document.getElementById('subsubsubsubcategory').style.display = "block"
                            setSemesterid(e.target.value)
                          }}
                          value={semesterId}
                        >
                          <option value="" selected>Select Semester</option>
                          {semesterdata && (
                            semesterdata.map((x) => {
                              return (
                                <>
                                  <option value={x.semester_id}>{x.sem_name}</option>
                                </>
                              )
                            })
                          )}
                        </select>
                      </div>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Year</label>
                        <select
                          name="courses"
                          className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                          aria-label="Large select example"
                          onChange={yeardata}
                          value={year}
                        >
                          <option value="" selected>Select Year</option>
                          {getYears().map((year) => {
                            return (
                              <>
                                <option value={year}>{year}</option>
                              </>
                            )
                          })}
                        </select>
                      </div>
                    </div>

                    {/* ----------------------------------------------EXAM PAPER SUB SUB SUB CATEGORY------------------------------------ */}
                    <div className='row' id='subsubsubsubcategory' style={{ display: 'none' }}>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Document Sub Category</label>
                        <select
                          name="courses"
                          className="form-select form-select-md px-5 ps-4 py-3 shadow-none"
                          aria-label="Large select example"
                          onChange={subsubsubcategorydata}
                          value={subsubsubcategoryid}
                        >
                          <option value="" selected>Select the Document Sub Category</option>
                          <option value="questions">Questions</option>
                          <option value="answers">Answers</option>
                          <option value="question & answers">Question & Answers</option>
                        </select>
                      </div>
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Description</label>
                        <input type="text" className='form-control py-3' name="" value={description} onChange={descriptionData} id="" />
                      </div>
                    </div>
                  </div>

                  {/* --------------------------------------------NOTES SUB SUB CATEGORY-------------------------------------------- */}
                  <div className={`col-12 ${notesvisibility ? '' : 'd-none'}`}>
                    <div className="row">
                      <div className="mb-4 col-md-6">
                        <label htmlFor="" className='mb-2' style={{ color: '#8E9696' }}>Semester</label>
                        <input type="text" className='form-control py-3' value={description} onChange={descriptionData} />
                      </div>
                    </div>
                  </div>


                  {file && (
                    <div className="col-12 mt-3 d-flex justify-content-between align-items-center p-3 rounded" style={{ border: '1px solid #21B3A9' }}>
                      <p className='m-0 d-flex align-items-center fw-bold' style={{ color: '#21B3A9' }}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38" fill="none">
                        <path d="M7.70866 30.4583H22.292V28.375H7.70866V30.4583ZM7.70866 22.125H22.292V20.0417H7.70866V22.125ZM3.78236 37.75C2.8235 37.75 2.02289 37.4288 1.38053 36.7865C0.738173 36.1441 0.416992 35.3435 0.416992 34.3846V3.61536C0.416992 2.65651 0.738173 1.8559 1.38053 1.21354C2.02289 0.571181 2.8235 0.25 3.78236 0.25H20.2087L29.5837 9.625V34.3846C29.5837 35.3435 29.2625 36.1441 28.6201 36.7865C27.9778 37.4288 27.1771 37.75 26.2183 37.75H3.78236ZM19.167 10.6667H27.5003L19.167 2.33333V10.6667Z" fill="#21B3A9" />
                      </svg> <span className='ms-2 d-none d-md-inline'>{file.name}</span> <span className='ms-2 d-inline d-md-none'>{file.name.slice(0, 6)}</span></p>
                      <button onClick={() => {
                        setFile(null)
                        document.getElementById('details').style.display = 'none'
                        document.getElementById('uploadform').style.display = 'block'
                      }} className='btn d-flex align-items-center fw-medium' style={{ color: '#FF845D' }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                          <path d="M7.93236 20.8335C7.46628 20.8335 7.06931 20.6696 6.74145 20.3418C6.4136 20.0139 6.24967 19.6169 6.24967 19.1508V6.2502H5.20801V5.20853H9.37467V4.40723H15.6247V5.20853H19.7913V6.2502H18.7497V19.1508C18.7497 19.6303 18.5891 20.0306 18.2679 20.3518C17.9467 20.6729 17.5464 20.8335 17.067 20.8335H7.93236ZM17.708 6.2502H7.29134V19.1508C7.29134 19.3378 7.35144 19.4914 7.47163 19.6116C7.59182 19.7318 7.74539 19.7919 7.93236 19.7919H17.067C17.2272 19.7919 17.3741 19.7251 17.5077 19.5915C17.6412 19.458 17.708 19.3111 17.708 19.1508V6.2502ZM10.216 17.7085H11.2577V8.33353H10.216V17.7085ZM13.7417 17.7085H14.7833V8.33353H13.7417V17.7085Z" fill="#FF845D" />
                        </svg> <span className='ms-2'>Remove</span></button>
                    </div>
                  )}

                  <div className='mt-4 text-center'>
                    <button disabled={preview_btn_status} className='btn text-white fw-medium' style={{ backgroundColor: '#5D5FE3' }} onClick={() => {
                      document.getElementById('details').style.display = 'none'
                      document.getElementById('uploadedsuccessfully').style.display = 'block'
                    }}>Preview & Submit</button>
                  </div>
                </div>

              </div>

              {/* -----------------------------------------------PREVIEW DOCUMENT-------------------------------------------------- */}
              <section className="row justify-content-center mt-4" id='uploadedsuccessfully' style={{ display: 'none' }}>
                <div className='d-flex justify-content-evenly py-2 py-lg-3 pb-2 px-lg-5'>
                  <span className='fw-bold'>Upload Document</span>
                  <span className='text-dark'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Details</span></span>
                  <span className='text-dark'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Preview & Submit</span></span>
                </div>
                <div className="col-lg-9 col-md-10 rounded text-center mx-auto pt-3 pt-lg-4 pb-3">
                  <div className='row m-0 bg-white mb-2 shadow-sm py-2 py-lg-3 rounded ps-0 ps-lg-3 justify-content-evenly'>
                    <div className="col-lg-3 text-start">
                      <p className='m-0 fw-bold' style={{ color: '#5D5FE3' }}>Group Id</p>
                      <p className='m-0 mt-1 fw-medium'>{group_id}</p>
                    </div>
                    <div className="col-lg-3 text-start">
                      <p className='m-0 fw-bold' style={{ color: '#5D5FE3' }}>Category</p>
                      <p className='m-0 mt-1 fw-medium'>{subcategoryid}</p>
                    </div>
                  </div>
                  <div className='d-flex justify-content-center bg-white rounded shadow-sm' style={{ overflowX: 'scroll', height: '80vh' }}>
                    {file && (
                      <Document file={file}>
                        {/* <Page pageNumber={1} /> */}
                        {[...Array(file.numPages)].map((_, index) => (
                          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                      </Document>
                    )}
                  </div>
                  <div className='mt-4'>
                    <button onClick={() => {
                      setFile(null)
                      setloading(false)
                      document.getElementById('uploadedsuccessfully').style.display = 'none'
                      document.getElementById('uploadform').style.display = 'block'
                    }} className='px-2 px-lg-5 btn border border-dark fw-medium text-dark bg-transparent py-2' style={{ fontSize: '14px' }}>
                      Go Back
                    </button>
                    <button onClick={() => {
                      upload()
                    }} className='btn text-white fw-medium py-2 ms-0 ms-4' style={{ backgroundColor: '#5D5FE3', fontSize: '14px' }}>
                      {loading ? 'Uploading...' : 'Confirm Submission'}
                    </button>
                  </div>
                </div>
              </section>

              {/* -----------------------------------------------SUCCESSFULLY UPLOADED-------------------------------------------------- */}
              <section className="row justify-content-center mt-4" id='finalstep' style={{ display: 'none' }}>
                <div className='d-flex justify-content-evenly py-2 py-lg-3 pb-2 px-lg-5'>
                  <span className='fw-bold'>Upload Document</span>
                  <span className='text-dark'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Details</span></span>
                  <span className='text-dark'><span className='d-md-inline d-none'>-----------------------------</span> <span className='d-md-none d-inline'>---</span> <span className='fw-bold ms-1 ms-lg-5'>Preview & Submit</span></span>
                </div>
                <div className="col-lg-9 col-md-10 rounded text-center mx-auto pt-2 pb-3 bg-white shadow-sm">
                  <div className='row m-0 bg-white mb-2 shadow-sm py-2 py-lg-3 rounded ps-0 ps-lg-3 justify-content-evenly'>
                    <div className="col-lg-3 text-start">
                      <p className='m-0 fw-bold' style={{ color: '#5D5FE3' }}>Group Id</p>
                      <p className='m-0 mt-1 fw-medium'>{group_id}</p>
                    </div>
                    <div className="col-lg-3 text-start">
                      <p className='m-0 fw-bold' style={{ color: '#5D5FE3' }}>Category</p>
                      <p className='m-0 mt-1 fw-medium'>{subcategoryid}</p>
                    </div>
                  </div>
                  <div className='py-5 rounded px-4 mt-4' style={{ border: '1px dashed #5D5FE3', backgroundColor: '#CFF4D2' }}>
                    <img className='animate__animated animate__bounceIn' src={require('../img/checkmark-removebg-preview.png')} width={50} alt="" />
                    <p className='fw-medium mt-2 animate__animated animate__bounceIn' style={{ color: '#21B3A9', fontSize: '17px' }}>Document Uploaded Successfully</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

      </div>

      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">

          <div className="toast-body d-flex justify-content-between align-items-center">
            <span id='toastbody' className='fw-medium p-2'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>

  );
}
export default Group_document_upload