import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link } from 'react-router-dom'
import Preloader from './Preloader'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';


const Groups = () => {

  const [groupname, setGroupname] = useState("")
  const [groupimage, setGroupimage] = useState(null)
  const [Loading, setLoading] = useState(true)

  const groupNameData = (e) => {
    setGroupname(e.target.value)
  }
  const groupImage = (e) => {
    var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
    if (fileSize > 0.5) {
      alert("File size must be less than 500 KB.");
    } else {
      setGroupimage(e.target.files[0])
    }
  }
  const user = JSON.parse(sessionStorage.getItem('user'))
  const [count, setcount] = useState(0)
  const createGroup = async () => {
    const formdata = new FormData()
    formdata.append('group_name', groupname)
    formdata.append('file', groupimage)
    formdata.append('user_id', user.user_id)

    await axiosInstance.post(`http://192.168.0.106:9000/ParticularUserGroup/${user.user_id}/`, formdata)
      .then((r) => {
        // console.log("Group Created Successfully ",r.data)
        setcount(count + 1)
        setGroupname("")

        setGroupimage(null)
        const toastLiveExample = document.getElementById('liveToast')
        document.getElementById('toastbody').textContent = "Group Successfully Created !!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
      })
      .catch(() => {
        console.log("Group Creation Error")
      })
  }

  const [groupDetails, setGroupDetails] = useState([])
  const [joinedGroups, setJoinedGroups] = useState([])

  useEffect(() => {
    axiosInstance.get(`http://192.168.0.106:9000/ParticularUserGroup/${user.user_id}/`)
      .then((r) => {
        // console.log("Group details successfully fetched ",r.data)
        setGroupDetails(r.data.user_created_groups)
        setJoinedGroups(r.data.user_joined_groups)
        setLoading(false)
      })
      .catch(() => {
        console.log("Group details fetching error")
      })
  }, [count])

  // ---------------------------------------------SEARCH AND JOIN GROUP-----------------------------------------------------
  const [searchGroup, setSearchGroup] = useState("")
  const [isGroupExist, setIsGroupExist] = useState(false)

  const searchGroupData = (value) => {
    setSearchGroup(value)
    if (value.length == 10) {
      // console.log(value)
      axiosInstance.get(`http://192.168.0.106:9000/SearchGroup/${user.user_id}/${value}/`)
        .then((r) => {
          // console.log(r.data)
          if (r.data === "group is exist") {
            setIsGroupExist(true)
          }
          else {
            setIsGroupExist(false)

          }
        })
    }
  }

  const sendGroupID = () => {
    axiosInstance.post(`http://192.168.0.106:9000/SearchGroup/${user.user_id}/${searchGroup}/`)
      .then((r) => {
        // console.log("Successfully Group ID sent",r.data)
        const toastLiveExample = document.getElementById('liveToast')
        document.getElementById('toastbody').textContent = "Request is Sent !!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
        setcount(count + 1)
      })
      .catch(() => {
        console.log("Group ID Sending Error")
      })
  }

  // ------------------------------------------------DELETE GROUP----------------------------------------------------------
  const deleteGroup = (group_id) => {
    axiosInstance.delete(`http://192.168.0.106:9000/GroupDelete/${group_id}/`)
      .then((r) => {
        // console.log("Group Successfully Deleted",r.data)
        setcount(count + 1)
      })
      .catch(() => {
        console.log("Group Deleting Error")
      })
  }
  return (
    <div>
      {Loading ? (<Preloader />) : (
        <div>
          <div className='d-flex'>
            <Mainsidebar count={count} activevalue={"groups"} />
            <div className="w-100 pt-5  mt-5 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
              <Navbar></Navbar>
              <div className="w-100 p-3 px-2 px-md-5">
                <div className="container">

                  <ul class="nav nav-tabs gap-3" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active fw-medium" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Created Groups</button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link fw-medium" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Joined Groups</button>
                    </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active bg-light" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                      <div className='d-flex justify-content-between mb-4 align-items-center mt-3'>
                        <h3 className='fw-bolder fs-3'>Groups</h3>
                        <button className='btn btn-primary h-50' data-bs-toggle="modal" data-bs-target="#AddgroupModal"><i class="fa-solid fa-plus me-2"></i>Create Group</button>

                        {/* ADD GROUP MODAL */}

                        <div class="modal fade" id="AddgroupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header d-flex justify-content-center">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Create Your Group</h1>
                              </div>
                              <div class="modal-body">
                                <div className='px-3'>
                                  <input type="text" placeholder='Enter Your Group Name' className='form-control py-2' onChange={groupNameData} value={groupname} />
                                  <div className='text-center'>
                                    <input type="file" name="file" id="fileInput" onChange={groupImage} />
                                    <label htmlFor="fileInput" className='bg-primary text-white p-2 rounded-pill mt-3 px-5'><i class="fa-solid fa-cloud-arrow-up me-2"></i>Upload Group Wallpaper</label>
                                  </div>
                                  <div className='mt-3 text-end'>
                                    <button className='bg-info text-white fw-medium btn' onClick={createGroup} data-bs-dismiss="modal">Save</button>
                                    <button className='bg-info text-white fw-medium btn ms-3' data-bs-dismiss="modal">Exit</button>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ADD GROUP END */}
                      </div>
                      <div className="flex-wrap row gap-lg-4 d-flex justify-content-center mx-auto bg-light">
                        {groupDetails.map((x) => {
                          return (
                            // <div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                              <div class="card">
                                <div style={{ height: '150px' }}>
                                  <img src={x.image_url} class="card-img-top img-fluid" style={{ height: '100%', width: '100%' }} alt="..." />
                                </div>
                                <div class="card-body">
                                  <h5 class="card-title">{x.group_name}</h5>
                                  <p class="card-text text-secondary"><i class="fa-solid fa-user-group me-1"></i>{x.member_count} Members</p>
                                  <div className=''>
                                    <button class="btn btn-info text-white fw-medium w-75"><Link to={`/groupchat/${x.group_id}/${x.group_name}`} className='text-decoration-none text-white'>Chat</Link></button>
                                    <button onClick={() => {
                                      deleteGroup(x.group_id)
                                    }} className='btn btn-danger text-white ms-2'><i class="fa-regular fa-trash-can"></i></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            // </div>
                          )
                        })}
                      </div>
                    </div>
                    <div class="tab-pane fade bg-light" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                      <div className='row mt-3'>
                        <div className="col-md-6 col-lg-9">   <h3 className='fw-bolder fs-3'>Joined Groups</h3></div>


                        <div className='col-md-6 col-lg-3 d-flex gap-3'>
                          <input type="text" placeholder='Enter Group ID to Join...' className='form-control' id='' onChange={(e) => {
                            searchGroupData(e.target.value)
                          }} />
                          <button className='btn btn-info text-white fw-medium' disabled={!isGroupExist} onClick={sendGroupID}>Join</button>
                        </div>

                      </div>
                      <div className="flex-wrap row gap-lg-4 d-flex justify-content-center mx-auto mt-4 bg-light">
                        {joinedGroups.map((x) => {
                          return (
                            // <div>
                            <div className="col-sm-6 col-md-6 col-lg-3">
                              <div class="card">
                                <div style={{ height: '150px' }}>
                                  <img src={x.image_url} class="card-img-top img-fluid" style={{ height: '100%', width: '100%' }} alt="..." />
                                </div>
                                <div class="card-body">
                                  <h5 class="card-title">{x.group_name}</h5>
                                  <p class="card-text text-secondary"><i class="fa-solid fa-user-group me-1"></i>{x.group_name.member_count} Members</p>
                                  <div>
                                    <button class="btn bg-secondary text-white fw-medium w-100" disabled>Joined <i class="fa-solid fa-check ms-2"></i></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            // </div>
                          )
                        })}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* TOAST MESSAGE */}
          <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">

              <div class="toast-body d-flex justify-content-between">
                <span id='toastbody'></span>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups