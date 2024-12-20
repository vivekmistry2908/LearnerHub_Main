import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { Link } from 'react-router-dom'
import Navpath from './Navpath'
import { useParams } from 'react-router-dom'
import { ipaddress } from '../App'
import Preloader from './Preloader'
import { Context } from '../context/Context_provider'
import { toast } from 'react-toastify'
import axiosInstance from './axiosInstance'
import * as bootstrap from 'bootstrap';
import axios from 'axios';


const Opengroups = () => {

  let { translate_value, addsubjects_layout, setgroup_visible, setstudylist_visible, setcourse_visible, navbar_dropdown_visible, setnavbar_dropdown_visible } = useContext(Context)


  let [count, setCount] = useState(0)

  const { grouptype } = useParams()

  const [loading, setloading] = useState(true)
  const [val, setval] = useState(false)
  const [categories, setCategories] = useState([])
  const [publicgroups, setpublicgroups] = useState([])
  const [cities, setcities] = useState([])
  const [joinedPrivategroups, setjoinedPrivategroups] = useState([])

  useEffect(() => {
    if (grouptype === "opengroup") {
      axiosInstance.get(`${ipaddress}/GroupCategories/`)
        .then((r) => {
          // console.log("Group Category",r.data)
          setCategories(r.data)
        })

      axiosInstance.get(`${ipaddress}/SearchGroupWithCity/${user.user_id}/`)
        .then((r) => {
          // console.log("Public Groupssssssssssss",r.data)
          setpublicgroups(r.data.available_groups)
          setloading(false)
        })
    }

    // To get all the available cities
    axiosInstance.get(`${ipaddress}/DisplayCityAndCountry/`)
      .then((r) => {
        setcities(r.data.cities)
      })

    fetchprivategroups()
    fetchJoinedgroups()
  }, [count, grouptype])


  // ------------------------------To get particular users joined private groups-------------------------------------------

  const fetchprivategroups = () => {
    axiosInstance.get(`${ipaddress}/ParticularUserGroup/${user.user_id}/`)
      .then((r) => {
        // console.log("Private Group Details Suceessfully Fetched",r.data)
        setjoinedPrivategroups(r.data.user_created_groups.reverse());
        setloading(false)
      })
      .catch((err) => {
        console.log("Group details fetching error", err);
      })
  }

  const [groupname, setGroupname] = useState("")
  const [groupimage, setGroupimage] = useState(null)
  const [groupimage2, setGroupimage2] = useState(null)

  const [scope, setscope] = useState("private")
  const [scope1, setscope1] = useState("public")
  const [category, setcategory] = useState("")
  const [city, setcity] = useState("")
  const [group_description, setgroup_description] = useState("")

  const groupNameData = (e) => {
    setGroupname(e.target.value)
  }
  const groupImage = (e) => {
    console.log(e)
    var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
    if (fileSize > 0.5) {
      alert("File size must be less than 500 KB.");
    } else {
      setGroupimage(e.target.files[0])
    }
  }

  const groupImage2 = (e) => {
    console.log(e)
    var fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
    if (fileSize > 0.5) {
      alert("File size must be less than 500 KB.");
    } else {
      // console.log("skjnjgnfkj",e.target.files[0])
      alert("skjnjgnfkj"+fileSize+e.target.files[0]);
      setGroupimage2(e.target.files[0])
    }
  }

  const user = JSON.parse(sessionStorage.getItem('user'))

  // --------------------------------------------Functionality to create Private groups--------------------------------------
  const [public_group_state, setpublic_group_state] = useState(false)
  const [public_group_state1, setpublic_group_state1] = useState(false)
  const [public_group_state2, setpublic_group_state2] = useState(false)


  const createGroup = () => {
    const formdata = new FormData()
    formdata.append('group_name', groupname)
    formdata.append('file', groupimage)
    formdata.append('scope', scope)
    console.log(groupImage);


    axiosInstance.post(`${ipaddress}/PrivateGroups/${user.user_id}/`, formdata)
      .then((r) => {
        // console.log("Group Created Successfully",r.data)
        setCount(count + 1)
        setGroupname("")
        setGroupimage(null)
        setpublic_group_state1(false)
        setpublic_group_state2(true)
        const toastLiveExample = document.getElementById('liveToast')
        document.getElementById('toastbody').style.color = "green"
        document.getElementById('toastbody').textContent = "Your Group Created Succesfully!!!"
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
        toastBootstrap.show()
        fetchprivategroups()
      })
      .catch((err) => {
        console.log("Group Creation Error", err)
      })
  }

  // --------------------------------Create Public Group--------------------------------------
  const createpublicGroup = () => {
    const formdata4 = new FormData()
    formdata4.append('group_name', groupname)
    formdata4.append('file', groupimage2)
    alert("in the public group"+groupimage2)
    formdata4.append('scope', scope1)
    formdata4.append('category', category)
    formdata4.append('description', group_description)
    // for (let [key, value] of formdata4.entries()) {
    //   console.log(`${key}:`, value);
    // }
    axiosInstance.post(`${ipaddress}/PrivateGroups/${user.user_id}/`, formdata4)
      .then((r) => {
        // console.log("Group Created Successfully ",r.data)
        console.log("Group Created Successfully", r.data);
        setCount(count + 1)
        setGroupname("")
        setcategory("")
        setGroupimage(null)
        setgroup_description("")
        
        alert(`Request successfully sent to the Admin !!! ${groupimage2 ? groupimage2.name : 'No file selected'}`);
        console.log("Imagesssjjjkd  df", groupimage2);

        for (let [key, value] of formdata4.entries()) {
          console.log(`${key}:`, value);
        }

      })
      .catch(() => {
        console.log("Group Creation Error")
      })
  }

  // ---------------------------------------FILTER PUBLIC GROUPS USING CATEGORY---------------------------------------------------
  const [categoryname, setcategoryname] = useState("all")
  const [categoryId, setCategoryId] = useState("")
  const [groupsbycategories, setgroupsbycategories] = useState([])

  const filtergroupsbycategory = (category_id) => {
    axiosInstance.get(`${ipaddress}/SearchWithName/${category_id}/${user.user_id}/`)
      .then((r) => {
        // console.log("Category Groups",r.data)
        setgroupsbycategories(r.data)
      })

  }

  // ---------------------------------------------SEARCH AND JOIN PRIVATE GROUP-----------------------------------------------------
  const [searchGroup, setSearchGroup] = useState("")
  const [isGroupExist, setIsGroupExist] = useState(false)
  const [private_group_id, setprivate_group_id] = useState("")

  const searchGroupData = (value) => {
    if (value.length === 10) {
      // console.log(value)
      axiosInstance.get(`${ipaddress}/SearchGroup/${user.user_id}/${value}/`)
        .then((r) => {
          // console.log("Group called",r.data)
          if (r.data === "Group exists") {
            setIsGroupExist(true)
          }
          else {
            setIsGroupExist(false)

          }
        })
    }
  }

  const sendGroupID = () => {
    axiosInstance.post(`${ipaddress}/SearchGroup/${user.user_id}/${private_group_id}/`)
      .then((r) => {
        // console.log("Successfully Group ID sent",r.data)
        setprivate_group_id("")
        if (r.data === "Group Chat Room is Full") {
          toast.warn('Group Chat Room is Full', {
            autoClose: 2000,
          })
        }
        else {
          toast.success('Request sent to the Admin', {
            autoClose: 2000,
          })
          setCount(count + 1)
        }
      })
      .catch((err) => {
        console.log("Group ID Sending Error", err)
      })
  }


  // ------------------------------To join public groups------------------------------------------------
  const joinPublicgroup = (group_id) => {
    axiosInstance.post(`${ipaddress}/SearchGroup/${user.user_id}/${group_id}/`)
      .then((r) => {
        // console.log("Successfully Joined",r.data)
        setCount(count + 1)
        setsearchvalue("")
        setSearchedGroups([])
        toast.success('Successfully Joined the Group', {
          autoClose: 1000
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch(() => {
        console.log("Public group joining Error")
      })
  }

  // -------------------------------Search and take the public groups---------------------------------
  const [SearchedGroups, setSearchedGroups] = useState([])
  const [searchvalue, setsearchvalue] = useState("")

  const searchGroups = (searchvalue) => {
    if (searchvalue.length > 0) {
      axiosInstance.post(`${ipaddress}/SearchWithName/${searchvalue}/${user.user_id}/`)
        .then((r) => {
          // console.log("Successfully search and fetched",r.data)
          setSearchedGroups(r.data)
        })
        .catch(() => {
          console.log("Search group error")
        })
    }
    else {
      setSearchedGroups([])
    }
  }

  // -------------------------------Search and take the public groups---------------------------------
  const [SearchedprivateGroups, setSearchedprivateGroups] = useState([])
  const [searchprivatevalue, setsearchprivatevalue] = useState("")

  const searchprivateGroups = (searchvalue) => {
    if (searchvalue.length > 0) {
      axiosInstance.get(`${ipaddress}/SearchPrivateGroup/${user.user_id}/${searchvalue}/`)
        .then((r) => {
          // console.log("Successfully private groups search and fetched",r.data)
          setSearchedprivateGroups(r.data)
        })
        .catch((err) => {
          console.log("Search group error", err)
        })
    }
    else {
      setSearchedprivateGroups([])
    }
  }


  // --------------------------------Function to search and take city--------------------------------------
  const [showcity, setShowcity] = useState(false)
  const [filteredcities, setFilteredcities] = useState([])
  const searchCities = (value) => {
    setcity(value)

    if (value.length > 0) {
      setShowcity(true)
      const filteredData = cities.filter(c => c.toLowerCase().includes(value.toLowerCase()))
      setFilteredcities(filteredData)
    }
    else {
      setShowcity(false)
      setFilteredcities([])
    }
  }

  const sendselectedcity_tosearch = () => {
    const formdata = new FormData()
    formdata.append('category_id', categoryId)
    formdata.append('city', city)
    axiosInstance.post(`${ipaddress}/SearchGroupWithCity/${user.user_id}/`, formdata)
      .then((r) => {
        console.log("Fetcheddddddddddddd", r.data)
        setgroupsbycategories(r.data)
        setcity("")
      })
      .catch((err) => {
        console.log("Filter error", err)
      })
  }



  const groupIDElement = document.getElementById('group-id');
  const [termsVisible, setTermsVisible,] = useState(false); // Initial state for terms visibility
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState({});



  // Add click event listener to the share button

  const copy = () => {
    const groupID = groupIDElement.textContent;

    // Copy the group ID to the clipboard
    navigator.clipboard.writeText(groupID)
      .then(() => {
        alert('Group ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  const [joined_public_groups, setjoined_public_groups] = useState([])

  const fetchJoinedgroups = () => {
    axiosInstance.get(`${ipaddress}/ParticularUserGroup/${user.user_id}/`)
      .then((r) => {
        setjoined_public_groups(r.data.user_joined_public_groups)
      })
      .catch((err) => {
        console.log("joned Groups fetching error", err);
      })
  }


  return (
    <div>
      {loading ? (<Preloader />) : (
        <div>
          <div className="d-flex" style={{ position: 'relative' }}>
            <Mainsidebar count={count} activevalue={"groups"}></Mainsidebar>
            <div onClick={() => {
              setcourse_visible(false)
              setgroup_visible(false)
              setstudylist_visible(false)
            }} className='ps-1 ps-lg-4 w-100 pt-5  mt-5 bg-light'>
              <Navbar count={count}></Navbar>

              <div onClick={() => {
                setnavbar_dropdown_visible(false)
              }}>
                <div className='container mt-4 px-2 px-lg-5'>
                  <div className='row align-items-center'>
                    <div className='col-md-8'>
                      {/* Public Group */}
                      <h5 className={`fw-bold d-flex align-items-center ${grouptype === "opengroup" ? 'd-flex' : 'd-none'} flex-wrap`} style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 'normal', letterSpacing: '0.4px' }}>
                        <svg className={`${grouptype === "privategroup" ? 'd-none' : ''}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16" style={{ verticalAlign: 'middle', color: '#7A57D1', marginRight: '10px' }}>
                          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
                        </svg>
                        <span className='page6-head m-0' style={{ fontSize: '4rem', verticalAlign: 'middle', color: '#7A57D1', marginRight: '16px' }}>{translate_value.group.create_public_group}</span>

                      </h5>
                      {/* Private Group  */}
                      <h5 className={`fw-bold d-flex align-items-center ${grouptype === "opengroup" ? 'd-none' : 'd-flex'} flex-wrap`} style={{ fontSize: '2rem', fontWeight: 500, lineHeight: 'normal', letterSpacing: '0.4px' }}>
                        <svg className={`${grouptype === "privategroup" ? '' : 'd-none'}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 15 19" style={{ verticalAlign: 'middle', color: '#7A57D1', marginRight: '10px' }}>
                          <path d="M1.89093 18.875C1.42819 18.875 1.03206 18.7102 0.702549 18.3807C0.373018 18.0512 0.208252 17.6551 0.208252 17.1923V8.05768C0.208252 7.59494 0.373018 7.19881 0.702549 6.8693C1.03206 6.53977 1.42819 6.375 1.89093 6.375H3.33325V4.29167C3.33325 3.13115 3.73757 2.14657 4.54619 1.33794C5.35482 0.529315 6.3394 0.125 7.49992 0.125C8.66044 0.125 9.64501 0.529315 10.4536 1.33794C11.2623 2.14657 11.6666 3.13115 11.6666 4.29167V6.375H13.1089C13.5716 6.375 13.9678 6.53977 14.2973 6.8693C14.6268 7.19881 14.7916 7.59494 14.7916 8.05768V17.1923C14.7916 17.6551 14.6268 18.0512 14.2973 18.3807C13.9678 18.7102 13.5716 18.875 13.1089 18.875H1.89093ZM7.49992 14.1875C7.93929 14.1875 8.30955 14.0369 8.6107 13.7358C8.91185 13.4346 9.06242 13.0644 9.06242 12.625C9.06242 12.1856 8.91185 11.8154 8.6107 11.5142C8.30955 11.2131 7.93929 11.0625 7.49992 11.0625C7.06054 11.0625 6.69028 11.2131 6.38914 11.5142C6.08799 11.8154 5.93742 12.1856 5.93742 12.625C5.93742 13.0644 6.08799 13.4346 6.38914 13.7358C6.69028 14.0369 7.06054 14.1875 7.49992 14.1875ZM4.37492 6.375H10.6249V4.29167C10.6249 3.42361 10.3211 2.68576 9.71346 2.07812C9.10582 1.47049 8.36797 1.16667 7.49992 1.16667C6.63186 1.16667 5.89402 1.47049 5.28638 2.07812C4.67874 2.68576 4.37492 3.42361 4.37492 4.29167V6.375Z" fill="#7A57D1" />
                        </svg>

                        <span className='page6-head m-0' style={{ fontSize: '4rem', verticalAlign: 'middle', color: '#7A57D1' }}>{translate_value.group.create_private_group}</span>

                      </h5>
                    </div>
                    {/* Public Group add more group button before ************/}
                    <div className='col-md-4 d-flex justify-content-md-end mt-3 mt-md-0'>
                      {/* *************  Start  ************
     
      <button data-bs-toggle="modal" data-bs-target="#AddpublicgroupModal" className={`btn d-flex align-items-center ${grouptype === "opengroup" ? '' : 'd-none'}`} style={{ border: '0.2px solid #8587EA', color: '#8587EA', padding: '10px 20px', fontSize: '1.5rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
        <span className='page6-month' style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#7A57D1', marginLeft: '8px' }}>{translate_value.group.add_public_group}</span>
      </button>

        {/* *************  End  ************/}

                      {/* ************* Start changed by VA ************/}
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#AddpublicgroupModal"
                        className={`btn btn-sm border border-primary-subtle text-decoration-none ms-auto d-flex align-items-center ${grouptype === "opengroup" ? '' : 'd-none'}`}
                        style={{
                          padding: '0.5vw 1vw', // Dynamic padding based on viewport width
                          color: '#8587EA',
                          height: '64px',
                          fontSize: 'calc(10px + 0.5vw)', // Responsive font size
                          backgroundColor: '#FFFFFF',
                          transition: 'all 0.3s ease-in-out',
                          boxShadow: 'none',
                          transform: 'scale(1)',
                          width: 'auto', // Allows the button to adjust its width based on content and padding
                          maxWidth: '100%', // Ensures button doesn't overflow its container
                          display: 'block', // Use block to fill the width of the parent container
                          margin: '0px', // Center the button horizontally
                          textAlign: 'center', // Center the text inside the button
                          border: '0.2px solid #8587EA', // Maintaining the border style from the old button
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.backgroundColor = '#EAEAFF';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
                          <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                        <span
                          className='page6-month'
                          style={{
                            fontSize: 'calc(12px + 1vw)', // Larger, responsive font size for icon text
                            verticalAlign: 'middle',
                            color: '#7A57D1',
                            marginLeft: '8px'
                          }}
                        >
                          {translate_value.group.add_public_group}
                        </span>
                      </button>

                      {/* ************* End changed by VA ************/}


                      {/* Private Group add more group button by Bteam*
      
      <button onClick={() => {
        setpublic_group_state(true)
        setpublic_group_state1(true)
      }} 
        className={`btn d-flex align-items-center ${grouptype === "privategroup" ? '' : 'd-none'}`} style={{ border: '0.2px solid #8587EA', color: '#8587EA', padding: '5px 20px', fontSize: '1.5rem' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
        </svg>
        <span className='page6-month' style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#7A57D1', marginLeft: '8px' }}> {translate_value.group.add_private_group}</span>
      </button>

  {/* Private Group add more group button*/}
                      {/* Start****************Private Group add more group button chnaged by VA*/}
                      <button
                        onClick={() => {
                          setpublic_group_state(true);
                          setpublic_group_state1(true);
                        }}
                        className={`btn btn-sm border border-primary-subtle text-decoration-none ms-auto d-flex align-items-center ${grouptype === "privategroup" ? '' : 'd-none'}`}
                        style={{
                          padding: '0.5vw 1vw', // Dynamic padding based on viewport width
                          color: '#8587EA',
                          height: '64px',
                          fontSize: 'calc(10px + 0.5vw)', // Responsive font size
                          backgroundColor: '#FFFFFF',
                          transition: 'all 0.3s ease-in-out',
                          boxShadow: 'none',
                          transform: 'scale(1)',
                          width: 'auto', // Allows the button to adjust its width based on content and padding
                          maxWidth: '100%', // Ensures button doesn't overflow its container
                          display: 'block', // Use block to fill the width of the parent container
                          margin: '0px', // Center the button horizontally
                          textAlign: 'center', // Center the text inside the button
                          border: '0.2px solid #8587EA', // Keeping the border style from the old button
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.backgroundColor = '#EAEAFF';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16" style={{ verticalAlign: 'middle' }}>
                          <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                        <span
                          className='page6-month'
                          style={{
                            fontSize: 'calc(12px + 1vw)', // Larger, responsive font size for icon text
                            verticalAlign: 'middle',
                            color: '#7A57D1',
                            marginLeft: '8px'
                          }}
                        >
                          {translate_value.group.add_private_group}
                        </span>
                      </button>


                      {/* **** End **************Private Group add more group button chnaged by VA*/}


                    </div>
                  </div>
                  {/* ------------------------------------------------Key points for public group------------------------------------------ */}
                  {grouptype == "opengroup" &&
                    <div className='mt-3'>
                      <div className='d-flex flex-wrap' style={{ gap: '10px' }}>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-users' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}> City-specific Groups</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-user-friends' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Connect with Study Friends</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-file-alt' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Diverse Discussions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-comments' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Engage in Online Discussions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-university' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Join Popular University Groups</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-bell' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Stay Updated with Group Activities</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-question" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Ask Questions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-handshake" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Participate in Conversations</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-search" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Search suitable Groups</span>
                        </div>
                      </div>
                    </div>
                  }
                  {/* ------------------------------------------------Key points for private group------------------------------------------ */}
                  {grouptype != "opengroup" &&

                    <div className='mt-3'>
                      <div className='d-flex flex-wrap' style={{ gap: '10px' }}>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-plus-circle' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Create Private Study Groups</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-users-cog' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Create Group & Share Id-Key to Join</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-share-alt' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Share Study Materials</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-calendar-alt' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Plan Private Study Sessions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-bullseye' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Focused Discussions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className='fas fa-book' style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Collaborative Learning</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-question" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Ask Questions</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-tasks" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Stay Organized</span>
                        </div>
                        <div className='col-12 col-sm-6 col-md-4 p-2 card-option' style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', flex: '1 1 300px', padding: '20px', cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center' }}>
                          <i className="fas fa-lock" style={{ marginRight: '10px', fontSize: '1.5rem', color: '#6f42c1' }}></i>
                          <span className='gradient-text' style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem', letterSpacing: '0.32px' }}>Private and Secure</span>
                        </div>
                      </div>
                    </div>
                  }





                  <style jsx>{`
  .card-option:hover {
    background-color: #e2e6ea;
  }

  .gradient-text {
    background: linear-gradient(to right, #6f42c1, #b362f9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`}</style>
                  {/* -----------------------------------------------End of key points for public group------------------------------------------ */}
                </div>


                <div className="container px-lg-5 mt-4">

                  {/* ------------------------------------------------Search bar for public group------------------------------------------ */}
                  <div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${grouptype === "opengroup" && val == false ? '' : 'd-none'}`} style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                    </svg></span>
                    <input type="text" value={searchvalue} onChange={(e) => {
                      setsearchvalue(e.target.value)
                      searchGroups(e.target.value)
                    }} className="form-control border-0 bg-transparent ps-1" placeholder="Search Public Group" aria-label="Username" aria-describedby="basic-addon1" />
                  </div>

                  <div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${grouptype === "opengroup" && val == true ? '' : 'd-none'}`} style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                    </svg></span>
                    <input type="text" value={city} onChange={(e) => {
                      searchCities(e.target.value)
                    }} className="form-control border-0 bg-transparent ps-1" placeholder="Search and Select City" aria-label="Username" aria-describedby="basic-addon1" />

                    <span onClick={() => {
                      sendselectedcity_tosearch()
                    }} className="input-group-text border-0 rounded me-1 me-md-2 text-white" style={{ backgroundColor: '#5d5fe3', cursor: 'pointer' }} id="basic-addon1">Search</span>
                  </div>


                  {/* --------------------------------SEARCH BAR FOR public group VA ----------------------------------- */}
                  {/* --------------------------------did not work-----------------------------------
<div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${val === false ? '' : 'd-none'}`} style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={searchvalue}
                      onChange={(e) => {
                        setsearchvalue(e.target.value);
                        searchGroups(e.target.value);
                      }}
                      className="form-control border-0 bg-transparent ps-1"
                      placeholder="Search Public Group"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </div>

                  <div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${val === true ? '' : 'd-none'}`} style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        searchCities(e.target.value);
                      }}
                      className="form-control border-0 bg-transparent ps-3"
                      placeholder="Search and Select City"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                    <span
                      onClick={() => {
                        sendselectedcity_tosearch();
                      }}
                      className="input-group-text border-0 rounded me-1 me-md-2 text-white"
                      style={{ backgroundColor: '#5d5fe3', cursor: 'pointer' }}
                      id="basic-addon1"
                    >
                      Search
                    </span>
                  </div>

 --------------------------------------*/}





                  {/* --------------------------------SEARCH BAR FOR CITY----------------------------------- */}
                  <div className={`px-3 py-2 bg-white border border-top-0 ${showcity && cities.length > 0 ? '' : 'd-none'}`} style={{ maxHeight: '80px', overflowY: 'scroll' }}>
                    {filteredcities.map((x, index) => {
                      return (
                        <>
                          <p key={index} onClick={() => {
                            setcity(x)
                            setShowcity(!showcity)
                          }} className="m-0 d-flex align-items-center mb-2" style={{ cursor: 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="currentColor" className="bi bi-bank2" viewBox="0 0 16 16">
                              <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z" />
                            </svg><span className='ms-3' style={{ fontSize: '14px' }}>{x}</span></p>
                        </>
                      )
                    })}
                  </div>

                  {/* -----------------------------------------------Search bar for private group------------------------------------------ 
                  <div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${grouptype === "privategroup" ? '' : 'd-none'}`}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                    </svg></span>
                    <input type="text" value={searchprivatevalue} onChange={(e) => {
                      setsearchprivatevalue(e.target.value)
                      searchprivateGroups(e.target.value)
                    }} className="form-control border-0 bg-transparent ps-1" placeholder="Search Private Group" aria-label="Username" aria-describedby="basic-addon1" />
                  </div> */}

                  <div className={`input-group mb-3 bg-white py-2 rounded shadow-sm ${grouptype === "privategroup" ? '' : 'd-none'}`} style={{ border: '2px solid #7A57D1', borderRadius: '8px' }}>
                    <span className="input-group-text bg-transparent border-0 ps-4" id="basic-addon1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M20.2965 20.9941L13.774 14.4717C13.2532 14.915 12.6542 15.2582 11.9771 15.5013C11.3001 15.7443 10.6196 15.8659 9.93586 15.8659C8.26746 15.8659 6.85544 15.2884 5.6998 14.1333C4.54414 12.9783 3.96631 11.5671 3.96631 9.89957C3.96631 8.23207 4.54382 6.81973 5.69883 5.66254C6.85385 4.50535 8.26511 3.92676 9.93261 3.92676C11.6001 3.92676 13.0125 4.50458 14.1696 5.66022C15.3268 6.81586 15.9054 8.2279 15.9054 9.89632C15.9054 10.6201 15.7772 11.3206 15.5208 11.9977C15.2644 12.6748 14.9279 13.2537 14.5112 13.7345L21.0336 20.2569L20.2965 20.9941ZM9.93586 14.8242C11.3181 14.8242 12.485 14.3484 13.4365 13.3969C14.388 12.4454 14.8638 11.2785 14.8638 9.89632C14.8638 8.51411 14.388 7.34725 13.4365 6.39572C12.485 5.44419 11.3181 4.96842 9.93586 4.96842C8.55366 4.96842 7.38679 5.44419 6.43527 6.39572C5.48376 7.34725 5.008 8.51411 5.008 9.89632C5.008 11.2785 5.48376 12.4454 6.43527 13.3969C7.38679 14.3484 8.55366 14.8242 9.93586 14.8242Z" fill="#8E9696" />
                      </svg>
                    </span>
                    <input type="text" value={searchprivatevalue} onChange={(e) => {
                      setsearchprivatevalue(e.target.value)
                      searchprivateGroups(e.target.value)
                    }} className="form-control border-0 bg-transparent ps-1" placeholder="Search Private Group" aria-label="Search Private Group" aria-describedby="basic-addon1" style={{ color: '#333' }} />
                  </div>

                  <style jsx>{`
                      .input-group-text svg {
                        fill: #7A57D1;
                      }
                      .form-control::placeholder {
                        color: #7A57D1;
                        opacity: 1;
                      }
                      .form-control {
                        transition: color 0.3s ease;
                      }
                      .form-control:focus {
                        color: #000;
                      }
                    `}</style>

                  {/* -------------------------------------Search and take public groups--------------------------------------------------- */}
                  <ul className={`ps-0 mt-3 ${grouptype === "opengroup" ? '' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                    {SearchedGroups && (
                      SearchedGroups.map((x, index) => {
                        return (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white`} key={index}>
                            <div className='d-flex flex-column'>
                              <Link to={`/groupchat/opengroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                              <div className='mt-2 d-flex'>
                                <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M2.70435 19.3915V17.6767C2.70435 17.1933 2.82955 16.7776 3.07994 16.4297C3.33034 16.0818 3.66685 15.8038 4.08945 15.5956C4.99297 15.1654 5.89011 14.8225 6.78086 14.5667C7.67162 14.311 8.74334 14.1831 9.99601 14.1831C11.2487 14.1831 12.3204 14.311 13.2112 14.5667C14.1019 14.8225 14.9991 15.1654 15.9026 15.5956C16.3252 15.8038 16.6617 16.0818 16.9121 16.4297C17.1625 16.7776 17.2877 17.1933 17.2877 17.6767V19.3915H2.70435ZM19.371 19.3915V17.6286C19.371 17.025 19.2488 16.4552 19.0045 15.9192C18.7601 15.3833 18.4136 14.9234 17.9648 14.5397C18.4763 14.6438 18.969 14.7884 19.4431 14.9734C19.9172 15.1583 20.386 15.3663 20.8494 15.5974C21.3008 15.8244 21.6547 16.1149 21.9111 16.469C22.1675 16.823 22.2957 17.2096 22.2957 17.6286V19.3915H19.371ZM9.99601 11.8594C9.13664 11.8594 8.40096 11.5534 7.78898 10.9414C7.177 10.3295 6.87101 9.59378 6.87101 8.7344C6.87101 7.87501 7.177 7.13932 7.78898 6.52734C8.40096 5.91536 9.13664 5.60938 9.99601 5.60938C10.8554 5.60938 11.5911 5.91536 12.203 6.52734C12.815 7.13932 13.121 7.87501 13.121 8.7344C13.121 9.59378 12.815 10.3295 12.203 10.9414C11.5911 11.5534 10.8554 11.8594 9.99601 11.8594ZM17.5681 8.7344C17.5681 9.59378 17.2622 10.3295 16.6502 10.9414C16.0382 11.5534 15.3025 11.8594 14.4431 11.8594C14.3991 11.8594 14.343 11.8544 14.2749 11.8444C14.2068 11.8344 14.1507 11.8233 14.1066 11.8113C14.4594 11.3791 14.7306 10.8997 14.9201 10.3729C15.1096 9.84618 15.2043 9.29918 15.2043 8.7319C15.2043 8.16464 15.1052 7.62261 14.9069 7.10578C14.7086 6.58896 14.4418 6.10618 14.1066 5.65745C14.1627 5.63743 14.2188 5.62441 14.2749 5.61839C14.331 5.61238 14.3871 5.60938 14.4431 5.60938C15.3025 5.60938 16.0382 5.91536 16.6502 6.52734C17.2622 7.13932 17.5681 7.87501 17.5681 8.7344ZM3.74601 18.3498H16.246V17.6767C16.246 17.4323 16.1849 17.2186 16.0627 17.0357C15.9405 16.8527 15.7212 16.6778 15.4047 16.5108C14.6274 16.0955 13.8081 15.7773 12.9467 15.5563C12.0854 15.3353 11.1018 15.2248 9.99601 15.2248C8.89025 15.2248 7.90667 15.3353 7.04528 15.5563C6.18391 15.7773 5.36461 16.0955 4.58737 16.5108C4.27086 16.6778 4.0515 16.8527 3.92929 17.0357C3.80711 17.2186 3.74601 17.4323 3.74601 17.6767V18.3498ZM9.99601 10.8177C10.5689 10.8177 11.0594 10.6137 11.4674 10.2058C11.8754 9.79777 12.0793 9.30732 12.0793 8.7344C12.0793 8.16149 11.8754 7.67103 11.4674 7.26305C11.0594 6.85506 10.5689 6.65107 9.99601 6.65107C9.4231 6.65107 8.93264 6.85506 8.52466 7.26305C8.11667 7.67103 7.91268 8.16149 7.91268 8.7344C7.91268 9.30732 8.11667 9.79777 8.52466 10.2058C8.93264 10.6137 9.4231 10.8177 9.99601 10.8177Z" fill="#8E9696" />
                                </svg><span className='ms-1'>{x.member_count}</span> <span className='ms-1 d-lg-inline d-md-inline d-none'>Members</span></span>
                                {x.city && (
                                  <span className='mt-1 text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.city}</span></span>
                                )}
                                <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                  <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                                </svg><span className='ms-1 text-secondary'>{x.category}</span></span>
                                <span className='mt-1 text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.created_at.slice(0, 10)}</span></span>
                              </div>
                            </div>
                            <button onClick={() => {
                              joinPublicgroup(x.group_id)
                            }} className='btn border border-primary-subtle px-3 px-lg-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{ height: '44px', color: '#8587EA', fontSize: '19px' }}>{translate_value.common_words.join}</button>
                          </li>
                        )
                      })
                    )}

                  </ul>

                  <div className={`col-md-6 col-lg-3 ms-auto d-flex gap-3 ${grouptype === "privategroup" ? '' : 'd-none'}`}>
                    <input value={private_group_id} type="text" placeholder={translate_value.group.placeholder} className='form-control' id='' onChange={(e) => {
                      setprivate_group_id(e.target.value)
                      searchGroupData(e.target.value)
                    }} />
                    <button className='btn text-white fw-medium' style={{ backgroundColor: '#5d5fe3' }} disabled={!isGroupExist} onClick={sendGroupID}>{translate_value.common_words.join}</button>
                  </div>
                  {/* ------------------------------------------------CATEGORIES OF OPEN GROUPS----------------------------------------- */}
                  <div className={`mt-4 py-2 ${grouptype === "opengroup" ? '' : 'd-none'}`} style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
                    <span className='rounded-pill py-2 px-3 me-2' onClick={() => {
                      setval(false)
                      setcategoryname("all")
                    }} style={{ fontSize: '14px', cursor: 'pointer', border: categoryname === "all" ? '1px solid #5D5FE3' : '1px solid #5D5FE3', color: categoryname === "all" ? '#fff' : '#5D5FE3', backgroundColor: categoryname === 'all' ? '#5d5fe3' : '#fff' }}>All</span>
                    {categories && (
                      categories.map((x, index) => {
                        return (
                          <>
                            <span className='rounded-pill py-2 px-3 me-2' key={index} onClick={() => {
                              setval(true)
                              setCategoryId(x.id)
                              setcategoryname(x.name)
                              filtergroupsbycategory(x.id)
                            }} style={{ fontSize: '14px', cursor: 'pointer', border: categoryname === x.name ? '1px solid #5D5FE3' : '1px solid #AAB0B0', color: categoryname === x.name ? '#fff' : '#5D5FE3', backgroundColor: categoryname === x.name ? '#5d5fe3' : '#fff' }}>{x.name}</span>
                          </>
                        )
                      })
                    )}

                  </div>
                </div>

                <div className="container px-2 px-lg-5 mt-4 pt-2">

                  {/* ---------------------------------------Public groups layout------------------------------------------------ */}
                  <ul className={`ps-0 ${grouptype === "opengroup" ? '' : 'd-none'}`} style={{ listStyleType: 'none' }}>
                    <div className='d-md-flex justify-content-between align-items-center pb-4'>

                      <span className='page6-month' style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#7A57D1' }}>{translate_value.group.recommended_groups}</span>
                      <div className="col-sm-5 mt-4 mt-md-0">
                      </div>
                    </div>

                    {/* -----------------------------------------------Public Groups Section---------------------------------------------------------------- */}
                    {publicgroups && (
                      publicgroups.map((x, index) => {
                        return (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white ${categoryname === "all" ? 'd-block' : 'd-none'}`} key={index}>
                            <div className='d-flex flex-column'>
                              <Link to={`/groupchat/opengroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                              <div className='mt-2 d-flex align-items-center'>
                                <span className='text-secondary d-flex align-items-center' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M2.70435 19.3915V17.6767C2.70435 17.1933 2.82955 16.7776 3.07994 16.4297C3.33034 16.0818 3.66685 15.8038 4.08945 15.5956C4.99297 15.1654 5.89011 14.8225 6.78086 14.5667C7.67162 14.311 8.74334 14.1831 9.99601 14.1831C11.2487 14.1831 12.3204 14.311 13.2112 14.5667C14.1019 14.8225 14.9991 15.1654 15.9026 15.5956C16.3252 15.8038 16.6617 16.0818 16.9121 16.4297C17.1625 16.7776 17.2877 17.1933 17.2877 17.6767V19.3915H2.70435ZM19.371 19.3915V17.6286C19.371 17.025 19.2488 16.4552 19.0045 15.9192C18.7601 15.3833 18.4136 14.9234 17.9648 14.5397C18.4763 14.6438 18.969 14.7884 19.4431 14.9734C19.9172 15.1583 20.386 15.3663 20.8494 15.5974C21.3008 15.8244 21.6547 16.1149 21.9111 16.469C22.1675 16.823 22.2957 17.2096 22.2957 17.6286V19.3915H19.371ZM9.99601 11.8594C9.13664 11.8594 8.40096 11.5534 7.78898 10.9414C7.177 10.3295 6.87101 9.59378 6.87101 8.7344C6.87101 7.87501 7.177 7.13932 7.78898 6.52734C8.40096 5.91536 9.13664 5.60938 9.99601 5.60938C10.8554 5.60938 11.5911 5.91536 12.203 6.52734C12.815 7.13932 13.121 7.87501 13.121 8.7344C13.121 9.59378 12.815 10.3295 12.203 10.9414C11.5911 11.5534 10.8554 11.8594 9.99601 11.8594ZM17.5681 8.7344C17.5681 9.59378 17.2622 10.3295 16.6502 10.9414C16.0382 11.5534 15.3025 11.8594 14.4431 11.8594C14.3991 11.8594 14.343 11.8544 14.2749 11.8444C14.2068 11.8344 14.1507 11.8233 14.1066 11.8113C14.4594 11.3791 14.7306 10.8997 14.9201 10.3729C15.1096 9.84618 15.2043 9.29918 15.2043 8.7319C15.2043 8.16464 15.1052 7.62261 14.9069 7.10578C14.7086 6.58896 14.4418 6.10618 14.1066 5.65745C14.1627 5.63743 14.2188 5.62441 14.2749 5.61839C14.331 5.61238 14.3871 5.60938 14.4431 5.60938C15.3025 5.60938 16.0382 5.91536 16.6502 6.52734C17.2622 7.13932 17.5681 7.87501 17.5681 8.7344ZM3.74601 18.3498H16.246V17.6767C16.246 17.4323 16.1849 17.2186 16.0627 17.0357C15.9405 16.8527 15.7212 16.6778 15.4047 16.5108C14.6274 16.0955 13.8081 15.7773 12.9467 15.5563C12.0854 15.3353 11.1018 15.2248 9.99601 15.2248C8.89025 15.2248 7.90667 15.3353 7.04528 15.5563C6.18391 15.7773 5.36461 16.0955 4.58737 16.5108C4.27086 16.6778 4.0515 16.8527 3.92929 17.0357C3.80711 17.2186 3.74601 17.4323 3.74601 17.6767V18.3498ZM9.99601 10.8177C10.5689 10.8177 11.0594 10.6137 11.4674 10.2058C11.8754 9.79777 12.0793 9.30732 12.0793 8.7344C12.0793 8.16149 11.8754 7.67103 11.4674 7.26305C11.0594 6.85506 10.5689 6.65107 9.99601 6.65107C9.4231 6.65107 8.93264 6.85506 8.52466 7.26305C8.11667 7.67103 7.91268 8.16149 7.91268 8.7344C7.91268 9.30732 8.11667 9.79777 8.52466 10.2058C8.93264 10.6137 9.4231 10.8177 9.99601 10.8177Z" fill="#8E9696" />
                                </svg> <span className='ms-1'>{x.member_count}</span> <span className='ms-1 d-lg-inline d-md-inline d-none'>Members</span></span>
                                {x.city && (
                                  <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg><span className='d-lg-inline d-md-inline d-none ms-1'>{x.city}</span></span>
                                )}

                                <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                  <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                                </svg><span className='ms-1 text-secondary'>{x.category}</span></span>

                                <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.created_at.slice(0, 10)}</span></span>
                              </div>
                            </div>
                            <button onClick={() => {
                              joinPublicgroup(x.group_id)
                            }} className='btn border border-primary-subtle px-3 px-lg-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{ height: '44px', color: '#8587EA', fontSize: '19px' }}>{translate_value.common_words.join}</button>
                          </li>
                        )
                      })
                    )}

                    {groupsbycategories && (
                      groupsbycategories.map((x, index) => {
                        return (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white ${categoryname === "all" ? 'd-none' : ''}`} key={index}>
                            <div className='d-flex flex-column'>
                              <a href='#' className='d-flex align-items-center text-decoration-none text-dark' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</a>
                              <div className='mt-2 d-flex'>
                                <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                  <path d="M2.70435 19.3915V17.6767C2.70435 17.1933 2.82955 16.7776 3.07994 16.4297C3.33034 16.0818 3.66685 15.8038 4.08945 15.5956C4.99297 15.1654 5.89011 14.8225 6.78086 14.5667C7.67162 14.311 8.74334 14.1831 9.99601 14.1831C11.2487 14.1831 12.3204 14.311 13.2112 14.5667C14.1019 14.8225 14.9991 15.1654 15.9026 15.5956C16.3252 15.8038 16.6617 16.0818 16.9121 16.4297C17.1625 16.7776 17.2877 17.1933 17.2877 17.6767V19.3915H2.70435ZM19.371 19.3915V17.6286C19.371 17.025 19.2488 16.4552 19.0045 15.9192C18.7601 15.3833 18.4136 14.9234 17.9648 14.5397C18.4763 14.6438 18.969 14.7884 19.4431 14.9734C19.9172 15.1583 20.386 15.3663 20.8494 15.5974C21.3008 15.8244 21.6547 16.1149 21.9111 16.469C22.1675 16.823 22.2957 17.2096 22.2957 17.6286V19.3915H19.371ZM9.99601 11.8594C9.13664 11.8594 8.40096 11.5534 7.78898 10.9414C7.177 10.3295 6.87101 9.59378 6.87101 8.7344C6.87101 7.87501 7.177 7.13932 7.78898 6.52734C8.40096 5.91536 9.13664 5.60938 9.99601 5.60938C10.8554 5.60938 11.5911 5.91536 12.203 6.52734C12.815 7.13932 13.121 7.87501 13.121 8.7344C13.121 9.59378 12.815 10.3295 12.203 10.9414C11.5911 11.5534 10.8554 11.8594 9.99601 11.8594ZM17.5681 8.7344C17.5681 9.59378 17.2622 10.3295 16.6502 10.9414C16.0382 11.5534 15.3025 11.8594 14.4431 11.8594C14.3991 11.8594 14.343 11.8544 14.2749 11.8444C14.2068 11.8344 14.1507 11.8233 14.1066 11.8113C14.4594 11.3791 14.7306 10.8997 14.9201 10.3729C15.1096 9.84618 15.2043 9.29918 15.2043 8.7319C15.2043 8.16464 15.1052 7.62261 14.9069 7.10578C14.7086 6.58896 14.4418 6.10618 14.1066 5.65745C14.1627 5.63743 14.2188 5.62441 14.2749 5.61839C14.331 5.61238 14.3871 5.60938 14.4431 5.60938C15.3025 5.60938 16.0382 5.91536 16.6502 6.52734C17.2622 7.13932 17.5681 7.87501 17.5681 8.7344ZM3.74601 18.3498H16.246V17.6767C16.246 17.4323 16.1849 17.2186 16.0627 17.0357C15.9405 16.8527 15.7212 16.6778 15.4047 16.5108C14.6274 16.0955 13.8081 15.7773 12.9467 15.5563C12.0854 15.3353 11.1018 15.2248 9.99601 15.2248C8.89025 15.2248 7.90667 15.3353 7.04528 15.5563C6.18391 15.7773 5.36461 16.0955 4.58737 16.5108C4.27086 16.6778 4.0515 16.8527 3.92929 17.0357C3.80711 17.2186 3.74601 17.4323 3.74601 17.6767V18.3498ZM9.99601 10.8177C10.5689 10.8177 11.0594 10.6137 11.4674 10.2058C11.8754 9.79777 12.0793 9.30732 12.0793 8.7344C12.0793 8.16149 11.8754 7.67103 11.4674 7.26305C11.0594 6.85506 10.5689 6.65107 9.99601 6.65107C9.4231 6.65107 8.93264 6.85506 8.52466 7.26305C8.11667 7.67103 7.91268 8.16149 7.91268 8.7344C7.91268 9.30732 8.11667 9.79777 8.52466 10.2058C8.93264 10.6137 9.4231 10.8177 9.99601 10.8177Z" fill="#8E9696" />
                                </svg><span className='ms-1'>{x.member_count}</span><span className='d-lg-inline d-md-inline d-none'>Members</span></span>
                                {x.city && (
                                  <span className='mt-1 text-secondary ms-2 ms-lg-4' style={{ fontSize: "15px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.city}</span></span>
                                )}
                                <span className='mt-1 text-secondary ms-2 ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.created_at.slice(0, 10)}</span></span>
                              </div>
                            </div>
                            <button onClick={() => {
                              joinPublicgroup(x.group_id)
                            }} className='btn border border-primary-subtle px-3 px-lg-5 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{ height: '44px', color: '#8587EA', fontSize: '19px' }}>{translate_value.common_words.join}</button>
                          </li>
                        )
                      })
                    )}

                  </ul>


                  {/* -----------------------------------------------JOINED PUBLIC GROUPS---------------------------------------------- */}

                  <span className={`page6-month ${joined_public_groups.length > 0 ? '' : 'd-none'}`} style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#7A57D1' }}>Joined Public Groups</span>

                  {joined_public_groups && (

                    joined_public_groups.map((x, index) => {
                      return (
                        <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white ${categoryname === "all" ? 'd-block' : 'd-none'}`} key={index}>
                          <div className='d-flex flex-column'>
                            <Link to={`/groupchat/opengroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                            <div className='mt-2 d-flex align-items-center'>
                              <span className='text-secondary d-flex align-items-center' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path d="M2.70435 19.3915V17.6767C2.70435 17.1933 2.82955 16.7776 3.07994 16.4297C3.33034 16.0818 3.66685 15.8038 4.08945 15.5956C4.99297 15.1654 5.89011 14.8225 6.78086 14.5667C7.67162 14.311 8.74334 14.1831 9.99601 14.1831C11.2487 14.1831 12.3204 14.311 13.2112 14.5667C14.1019 14.8225 14.9991 15.1654 15.9026 15.5956C16.3252 15.8038 16.6617 16.0818 16.9121 16.4297C17.1625 16.7776 17.2877 17.1933 17.2877 17.6767V19.3915H2.70435ZM19.371 19.3915V17.6286C19.371 17.025 19.2488 16.4552 19.0045 15.9192C18.7601 15.3833 18.4136 14.9234 17.9648 14.5397C18.4763 14.6438 18.969 14.7884 19.4431 14.9734C19.9172 15.1583 20.386 15.3663 20.8494 15.5974C21.3008 15.8244 21.6547 16.1149 21.9111 16.469C22.1675 16.823 22.2957 17.2096 22.2957 17.6286V19.3915H19.371ZM9.99601 11.8594C9.13664 11.8594 8.40096 11.5534 7.78898 10.9414C7.177 10.3295 6.87101 9.59378 6.87101 8.7344C6.87101 7.87501 7.177 7.13932 7.78898 6.52734C8.40096 5.91536 9.13664 5.60938 9.99601 5.60938C10.8554 5.60938 11.5911 5.91536 12.203 6.52734C12.815 7.13932 13.121 7.87501 13.121 8.7344C13.121 9.59378 12.815 10.3295 12.203 10.9414C11.5911 11.5534 10.8554 11.8594 9.99601 11.8594ZM17.5681 8.7344C17.5681 9.59378 17.2622 10.3295 16.6502 10.9414C16.0382 11.5534 15.3025 11.8594 14.4431 11.8594C14.3991 11.8594 14.343 11.8544 14.2749 11.8444C14.2068 11.8344 14.1507 11.8233 14.1066 11.8113C14.4594 11.3791 14.7306 10.8997 14.9201 10.3729C15.1096 9.84618 15.2043 9.29918 15.2043 8.7319C15.2043 8.16464 15.1052 7.62261 14.9069 7.10578C14.7086 6.58896 14.4418 6.10618 14.1066 5.65745C14.1627 5.63743 14.2188 5.62441 14.2749 5.61839C14.331 5.61238 14.3871 5.60938 14.4431 5.60938C15.3025 5.60938 16.0382 5.91536 16.6502 6.52734C17.2622 7.13932 17.5681 7.87501 17.5681 8.7344ZM3.74601 18.3498H16.246V17.6767C16.246 17.4323 16.1849 17.2186 16.0627 17.0357C15.9405 16.8527 15.7212 16.6778 15.4047 16.5108C14.6274 16.0955 13.8081 15.7773 12.9467 15.5563C12.0854 15.3353 11.1018 15.2248 9.99601 15.2248C8.89025 15.2248 7.90667 15.3353 7.04528 15.5563C6.18391 15.7773 5.36461 16.0955 4.58737 16.5108C4.27086 16.6778 4.0515 16.8527 3.92929 17.0357C3.80711 17.2186 3.74601 17.4323 3.74601 17.6767V18.3498ZM9.99601 10.8177C10.5689 10.8177 11.0594 10.6137 11.4674 10.2058C11.8754 9.79777 12.0793 9.30732 12.0793 8.7344C12.0793 8.16149 11.8754 7.67103 11.4674 7.26305C11.0594 6.85506 10.5689 6.65107 9.99601 6.65107C9.4231 6.65107 8.93264 6.85506 8.52466 7.26305C8.11667 7.67103 7.91268 8.16149 7.91268 8.7344C7.91268 9.30732 8.11667 9.79777 8.52466 10.2058C8.93264 10.6137 9.4231 10.8177 9.99601 10.8177Z" fill="#8E9696" />
                              </svg> <span className='ms-1'>{x.member_count}</span> <span className='ms-1 d-lg-inline d-md-inline d-none'>Members</span></span>
                              {x.city && (
                                <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                  </svg><span className='d-lg-inline d-md-inline d-none ms-1'>{x.city}</span></span>
                              )}

                              <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                              </svg><span className='ms-1 text-secondary'>{x.category}</span></span>

                              <span className='text-secondary ms-2 d-flex align-items-center ms-lg-4' style={{ fontSize: "15px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                              </svg><span className='d-lg-inline d-md-inline d-none ms-2'>{x.created_at.slice(0, 10)}</span></span>
                            </div>
                          </div>
                          <button disabled='true' className='btn border border-primary-subtle px-3 px-lg-4 py-2 fw-medium text-decoration-none ms-auto d-flex align-items-center' style={{ height: '44px', color: '#ffff', fontSize: '19px', backgroundColor: '#5d5fe3' }}>Joined</button>
                        </li>
                      )
                    })
                  )}

                  {/*              {/* --------------------------------------Layouts for Private Groups---------------------------------------------------- */}
                  {/*VA     <div className={`${grouptype === "privategroup" ? '' : 'd-none'}`}>
                    <h6 className='pb-1 d-flex align-items-center' style={{ color: '#8987eb' }}><svg xmlns="http://www.w3.org/2000/svg" width="29" height="21" viewBox="0 0 29 21" fill="none">
                      <path d="M0.786041 20.1475V17.7468C0.786041 17.07 0.961321 16.488 1.31188 16.001C1.66244 15.514 2.13354 15.1247 2.72519 14.8333C3.99012 14.231 5.24611 13.7509 6.49316 13.3928C7.74022 13.0348 9.24063 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786041ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.7789 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79125 9.60258 8.7613 9.17419 7.90453 8.31742C7.04776 7.46065 6.61937 6.4307 6.61937 5.22758C6.61937 4.02443 7.04776 2.99447 7.90453 2.1377C8.7613 1.28092 9.79125 0.852539 10.9944 0.852539C12.1975 0.852539 13.2274 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2274 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758Z" fill="#5D5FE3" />
                    </svg><span className='page6-head m-0'style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>{translate_value.group.your_groups}</span></h6>
              
                    {/* ----------------------------------------------To view Searched private groups---------------------------------------- */}
                  {/*VA         {SearchedprivateGroups.length > 0 && (
                      SearchedprivateGroups.map((x, index) => {
                        return (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white ${categoryname === "all" ? 'd-block' : 'd-none'}`} key={index}>
                            <div style={{ width: '100px' }}>
                              <img src={x.group_image} className='rounded' style={{ width: '100%' }} alt="" />
                            </div>
                            <div className='ms-3 d-flex flex-column'>
                              <Link to={`/groupchat/privategroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark fw-medium' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                              <div className='d-flex'>
                                <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                  <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                </svg><span className='ms-2'>{x.group_id}</span></span>
                                {x.created_at && (
                                  <span className='mt-1 text-secondary align-items-center d-none d-sm-flex ms-2 ms-lg-4' style={{ fontSize: "14px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                  </svg><span className='ms-2'>{x.created_at.slice(0, 10)}</span></span>
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })
                    )}


                    {/* --------------------------------------------To view all private groups working VA---------------------------------------------- */}
                  {/*VA   {joinedPrivategroups && (
                      joinedPrivategroups.map((x, index) => {
                        return (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center px-4 bg-white ${categoryname === "all" ? 'd-block' : 'd-none'}`} key={index}>
                            <div style={{ width: '100px' }}>
                              <img src={x.group_image} className='rounded' style={{ width: '100%' }} alt="" />
                            </div>
                            <div className='ms-3 d-flex flex-column'>
                              <Link to={`/groupchat/privategroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark fw-medium' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                              <div className='d-flex'>
                                <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                  <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                </svg><span className='ms-2'>{x.group_id}</span></span>
                                {x.created_at && (
                                  <span className='mt-1 text-secondary align-items-center d-none d-sm-flex ms-2 ms-lg-4' style={{ fontSize: "14px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                  </svg><span className='ms-2'>{x.created_at.slice(0, 10)}</span></span>
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })
                    )}
                  </div> 
                VA */}

                  <div className={`${grouptype === "privategroup" ? '' : 'd-none'}`}>
                    <h6 className='pb-1 d-flex align-items-center' style={{ color: '#8987eb' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="29" height="21" viewBox="0 0 29 21" fill="none" style={{ marginRight: '8px' }}>
                        <path d="M0.786041 20.1475V17.7468C0.786041 17.07 0.961321 16.488 1.31188 16.001C1.66244 15.514 2.13354 15.1247 2.72519 14.8333C3.99012 14.231 5.24611 13.7509 6.49316 13.3928C7.74022 13.0348 9.24063 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786041ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.7789 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79125 9.60258 8.7613 9.17419 7.90453 8.31742C7.04776 7.46065 6.61937 6.4307 6.61937 5.22758C6.61937 4.02443 7.04776 2.99447 7.90453 2.1377C8.7613 1.28092 9.79125 0.852539 10.9944 0.852539C12.1975 0.852539 13.2274 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2274 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758Z" fill="#5D5FE3" />
                      </svg>
                      <span className='page6-head m-0' style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>{translate_value.group.your_groups}</span>
                    </h6>

                    {/* ----------------------------------------------Search Results Section---------------------------------------------- */}
                    {SearchedprivateGroups.length > 0 && (
                      <div className="search-results-section" style={{ border: '2px solid #8987eb', borderRadius: '8px', padding: '10px', marginTop: '20px' }}>
                        <h6 className='pb-1 d-flex align-items-center' style={{ color: '#8987eb' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="21" viewBox="0 0 29 21" fill="none" style={{ marginRight: '8px' }}>
                            <path d="M0.786041 20.1475V17.7468C0.786041 17.07 0.961321 16.488 1.31188 16.001C1.66244 15.514 2.13354 15.1247 2.72519 14.8333C3.99012 14.231 5.24611 13.7509 6.49316 13.3928C7.74022 13.0348 9.24063 12.8558 10.9944 12.8558C12.7481 12.8558 14.2485 13.0348 15.4956 13.3928C16.7426 13.7509 17.9986 14.231 19.2636 14.8333C19.8552 15.1247 20.3263 15.514 20.6769 16.001C21.0274 16.488 21.2027 17.07 21.2027 17.7468V20.1475H0.786041ZM24.1194 20.1475V17.6795C24.1194 16.8344 23.9483 16.0367 23.6063 15.2864C23.2642 14.536 22.7789 13.8922 22.1506 13.3549C22.8667 13.5008 23.5566 13.7032 24.2203 13.9621C24.8841 14.2211 25.5403 14.5123 26.1891 14.8357C26.8211 15.1536 27.3165 15.5603 27.6755 16.056C28.0345 16.5516 28.2139 17.0928 28.2139 17.6795V20.1475H24.1194ZM10.9944 9.60258C9.79125 9.60258 8.7613 9.17419 7.90453 8.31742C7.04776 7.46065 6.61937 6.4307 6.61937 5.22758C6.61937 4.02443 7.04776 2.99447 7.90453 2.1377C8.7613 1.28092 9.79125 0.852539 10.9944 0.852539C12.1975 0.852539 13.2274 1.28092 14.0842 2.1377C14.941 2.99447 15.3694 4.02443 15.3694 5.22758C15.3694 6.4307 14.941 7.46065 14.0842 8.31742C13.2274 9.17419 12.1975 9.60258 10.9944 9.60258ZM21.5954 5.22758C21.5954 6.4307 21.167 7.46065 20.3102 8.31742C19.4534 9.17419 18.4235 9.60258 17.2204 9.60258C17.1587 9.60258 17.0801 9.59556 16.9848 9.58154C16.8894 9.56752 16.8109 9.55209 16.7492 9.53527C17.2432 8.93019 17.6228 8.25893 17.8881 7.5215C18.1534 6.78407 18.286 6.01826 18.286 5.22408C18.286 4.42992 18.1472 3.67106 17.8696 2.94751C17.5919 2.22396 17.2185 1.54807 16.7492 0.919841C16.8277 0.891817 16.9062 0.873588 16.9848 0.865154C17.0633 0.856744 17.1418 0.852539 17.2204 0.852539C18.4235 0.852539 19.4534 1.28092 20.3102 2.1377C21.167 2.99447 21.5954 4.02443 21.5954 5.22758Z" fill="#5D5FE3" />
                          </svg>
                          <span className='page6-head m-0' style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>Search Results</span>
                        </h6>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          {SearchedprivateGroups.map((x, index) => (
                            <li className="mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center bg-white" key={index} style={{ gap: '20px' }}>
                              <div style={{ width: '80px' }}>
                                <img src={x.group_image} className='rounded' style={{ width: '100%' }} alt="" />
                              </div>
                              <div className='ms-3 d-flex flex-column'>
                                <Link to={`/groupchat/privategroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark fw-medium' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                                <div className='d-flex'>
                                  <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                      <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                    </svg>
                                    <span className='ms-2'>{x.group_id}</span>
                                  </span>
                                  {x.created_at && (
                                    <span className='mt-1 text-secondary d-flex align-items-center ms-3' style={{ fontSize: "14px" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                      </svg>
                                      <span className='ms-2'>{x.created_at.slice(0, 10)}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* --------------------------------------------To view all private groups---------------------------------------------- */}
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {joinedPrivategroups && (
                        joinedPrivategroups.map((x, index) => (
                          <li className={`mb-3 py-3 rounded px-2 shadow-sm d-flex align-items-center bg-white ${categoryname === "all" ? 'd-block' : 'd-none'}`} key={index} style={{ gap: '20px' }}>
                            <div style={{ width: '80px' }}>
                              <img src={x.group_image} className='rounded' style={{ width: '100%' }} alt="" />
                            </div>
                            <div className='ms-3 d-flex flex-column'>
                              <Link to={`/groupchat/privategroup/${x.group_id}`} className='d-flex align-items-center text-decoration-none text-dark fw-medium' style={{ fontSize: '18px', fontWeight: 450, lineHeight: 'normal', letterSpacing: '0.36px' }}>{x.group_name}</Link>
                              <div className='d-flex'>
                                <span className='mt-1 text-secondary d-flex align-items-center' style={{ fontSize: "14px" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                                    <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                  </svg>
                                  <span className='ms-2'>{x.group_id}</span>
                                </span>
                                {x.created_at && (
                                  <span className='mt-1 text-secondary d-flex align-items-center ms-3' style={{ fontSize: "14px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                    <span className='ms-2'>{x.created_at.slice(0, 10)}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Chanage by VA */}
                </div>
              </div>
            </div>
          </div>


          {/* ADD PUBLIC GROUP MODAL * Actual code by Bteam

          <div className="modal fade" id="AddpublicgroupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-center bg-light">
                  <h1 className="modal-title fs-5 text-primary" id="staticBackdropLabel">Createeeee Your Group</h1>
                </div>
                <div className="modal-body">
                  <div className="row px-2 px-lg-2">
                    <div className="mb-3 col-sm-6">
                      <label for="formGroupExampleInput" className="form-label">{translate_value.group.group_name}</label>
                      <input type="text" className="form-control bg-light" id="formGroupExampleInput" onChange={groupNameData} value={groupname} />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label for="formGroupExampleInput2" className="form-label">{translate_value.group.category}</label>
                      <select type="text" className="form-control bg-light" value={category} id="formGroupExampleInput2" onChange={(e) => {
                        setcategory(e.target.value)
                      }}>
                        <option value="" selected></option>
                        {categories.map((y, index) => {
                          return (
                            <>
                              <option value={y.id}>{y.name}</option>
                            </>
                          )
                        })}
                      </select>
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label for="formGroupExampleInput2" className="form-label">{translate_value.group.scope}</label>
                      <input type="text" className="form-control" value={scope1} id="formGroupExampleInput2" placeholder="Another input placeholder" onChange={(e) => {
                        //  setscope(e.target.value)
                        //  console.log(scope1)
                      }} />
                    </div>
                    <div className="mb-3 col-12">
                      <label for="formGroupExampleInput" className="form-label">{translate_value.group.group_description}</label>
                      <textarea type="text" className="form-control bg-light" id="formGroupExampleInput" onChange={(e) => {
                        setgroup_description(e.target.value)
                      }} value={group_description}></textarea>
                    </div>

                  </div>
                  <div className=''>
                    <div className='text-center'>
                      <input type="file" name="file" id="fileInput" onChange={groupImage} />
                      <label htmlFor="fileInput" style={{ cursor: 'pointer' }} className='bg-primary text-white p-2 rounded-pill mt-3 px-5'><i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload Group Profile Image</label>
                    </div>
                    {groupimage && (
                      <p className='text-center text-info mt-2'>{groupimage.name}</p>
                    )}
                    <div className='mt-3 text-end'>
                      <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm' data-bs-dismiss="modal" onClick={createpublicGroup}>{translate_value.group.create}</button>
                      <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm ms-3' data-bs-dismiss="modal" onClick={() => {
                        setGroupname("")
                        setcategory("")
                        setGroupimage(null)
                        setgroup_description("")
                      }}>{translate_value.group.exit}</button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         {/* -------------------------------------------- */}
          {/* -------------------------------------------- */}


          {/*------------------Start- Updated public group application-form changed by VA------------------------ */}

          <div className="modal fade" id="AddpublicgroupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-center" style={{ backgroundColor: '#5d5fe3' }}>
                  <h1 className="modal-title fs-5 text-white" id="staticBackdropLabel">Create A New Public Group</h1>
                </div>
                <div className="modal-body" style={{ backgroundColor: '#f8f9fa' }}>
                  <h4>(Admin approval required)</h4> {/* Added instruction */}
                  <div className="row px-2 px-lg-2">
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="formGroupExampleInput" className="form-label">Group Name*</label>
                      <input type="text" className="form-control" id="formGroupExampleInput" onChange={groupNameData} value={groupname} maxLength={50} style={{ borderColor: '#6f42c1' }} required placeholder="min 6 characters " />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="formGroupExampleInput2" className="form-label">Category</label>
                      <select className="form-control" id="formGroupExampleInput2" onChange={(e) => setcategory(e.target.value)} value={category} style={{ borderColor: '#6f42c1', backgroundColor: '#e9ecef', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 140 140\'><path d=\'M35 55l35 35 35-35z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '1em auto' }} required>
                        <option value="">Select Category *</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3 col-sm-6">
                      <label htmlFor="formGroupExampleInput2" className="form-label">City</label>
                      {/* <select className="form-control" id="formGroupExampleInput2" onChange={(e) => showcity(e.target.value)} value={city} style={{ borderColor: '#6f42c1', backgroundColor: '#e9ecef', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 140 140\'><path d=\'M35 55l35 35 35-35z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '1em auto' }} required>
                        <option value="">Select City Name </option>
                        {cities.map((city, index) => (
                          <option key={index} value={city.name}>{city.name}</option>
                        ))}
                      </select> */}
                      <input disabled='true' value={user.city} type="text" className='form-control'  style={{ borderColor: '#6f42c1', backgroundColor: '#e9ecef' }} />
                    </div>
                    <div className="mb-3 col-sm-6">
                      <label htmlFor="formGroupExampleInput2" className="form-label">Scope</label>
                      <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="public/private" onChange={(e) => setscope(e.target.value)} value={scope1} style={{ borderColor: '#6f42c1', backgroundColor: '#e9ecef' }} />
                    </div>
                    <div className="mb-3 col-12">
                      <label htmlFor="formGroupExampleInput" className="form-label">Group Description*</label>
                      <textarea className="form-control" id="formGroupExampleInput" onChange={(e) => setgroup_description(e.target.value)} value={group_description} style={{ borderColor: '#6f42c1' }} minLength="20" placeholder="Enter at least 20 characters for the group description..."></textarea>
                    </div>
                  </div>
                  <div className='text-center'>
                    <input type="file" name="file" id="fileInput2" className="d-none" onChange={groupImage2} />
                    <label htmlFor="fileInput2" className='btn btn-primary mt-3' style={{ backgroundColor: '#5d5fe3', cursor: 'pointer' }}>
                      <i className="fa-solid fa-cloud-arrow-up me-2"></i> Upload Group Profile Image
                    </label>


                    {groupimage2 && (
                      <p className='text-center text-muted mt-2'>{groupimage2.name}</p>
                    )}
                  </div>
                  <div className='mb-3'>
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      className="me-2"
                    />
                    <label htmlFor="termsCheckbox" className="form-check-label">
                      I agree to the <a href="#" onClick={() => setTermsVisible(!termsVisible)} style={{ textDecoration: 'underline' }}>Public Group Terms & Conditions</a>
                    </label>
                    {termsVisible && (
                      <div className='terms-container ps-4 text-muted mt-2'>
                        <p className="fw-bold">Here are the terms and conditions:</p>
                        <ul className="list-styled">
                          <li className="fw-bold">Inclusive Access: <span className="fw-normal">Open groups are available to all community members without the need for invitations or special codes.</span></li>
                          <li className="fw-bold">Diverse Participation: <span className="fw-normal">Encourage participation from members with different backgrounds and areas of study to foster diverse discussions.</span></li>
                          <li className="fw-bold">Content Quality: <span className="fw-normal">Maintain high standards for shared content to ensure it is relevant and beneficial to group members.</span></li>
                          <li className="fw-bold">Community Guidelines: <span className="fw-normal">Adhere to platform-wide community guidelines to create a respectful and supportive environment.</span></li>
                          <li className="fw-bold">Active Engagement: <span className="fw-normal">Regularly participate in discussions and group activities to keep the group dynamic and active.</span></li>
                          <li className="fw-bold">Flexibility: <span className="fw-normal">Feel free to join or leave groups as your interests and needs evolve, ensuring your participation remains relevant and engaging.</span></li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className='mt-3 text-end'>
                    <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm' onClick={() => {
                      if (!groupname || !category || !scope1 || group_description.length < 20 || !groupimage2 || !document.getElementById('termsCheckbox').checked) {
                        alert('Please fill all the mandatory fields correctly.');
                        return;
                      }


                      createpublicGroup();  // Proceed with group creation
                    }} data-bs-dismiss="modal">{translate_value.group.create}</button>
                    <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm ms-3' data-bs-dismiss="modal" onClick={() => {
                      setGroupname("");
                      setcategory("");
                      setGroupimage2(null);
                      setgroup_description("");
                      setTermsVisible(false);
                    }}>{translate_value.group.exit}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>




          {/*------------------End- Updated public group application form -Chanage by VA------------------------ */}

          {/* -------------------------------------------- */}
          {/*------------------Start-  private group application form -Bteam------------------------ *
<div className={`${public_group_state ? 'animate__animated animate__fadeIn' : 'd-none'}`} style={{ backgroundColor: 'rgb(0,0,0,0.6)', zIndex: 6, top: 0, left: 0, width: '100%', height: '100%', position: 'fixed' }}>
            {/* Layout 1 *------
            <div className={`bg-white create-group-div rounded mx-auto mt-4 p-3 ${public_group_state1 ? '' : 'd-none'}`}>
              <h6 style={{ color: '#5d5fe3' }} className='text-center border-bottom pb-3'>Create your Group</h6>
              <div className="row px-3 pt-2">
                <div className="mb-3">
                  <label for="formGroupExampleInput" className="form-label">Group Name</label>
                  <input type="text" className="form-control bg-light" id="formGroupExampleInput" onChange={groupNameData} value={groupname} />
                </div>
                <div className="mb-3">
                  <label for="formGroupExampleInput2" className="form-label">Scope</label>
                  <input type="text" className="form-control bg-light" value={scope} id="formGroupExampleInput2" />
                </div>

              </div>
              <div className=''>
                <div className='text-center'>
                  <input type="file" name="file" id="fileInput" onChange={groupImage} />
                  <label htmlFor="fileInput" style={{ cursor: 'pointer' }} className='bg-primary text-white p-2 rounded-pill mt-3 px-5'><i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload Group Profile Image</label>
                </div>
                {groupimage && (
                  <p className='text-center text-info mt-2'>{groupimage.name}</p>
                )}
                <div className='mt-4 text-end'>
                  <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm' onClick={() => {
                    createGroup()
                  }}>{translate_value.group.create}</button>
                  <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm ms-3' onClick={() => {
                    setGroupname("")
                    setGroupimage(null)
                    setpublic_group_state(false)
                  }}>{translate_value.group.exit}</button>

                </div>
              </div>
            </div>
{/*------------------End-  private group application form -Bteam------------------------ */}

          {/*------------------Start- Updated private group application-form changed by VA------------------------ */}
          {/* ---------------ADD PRIVATE GROUP LAYOUT */}
          <div className={`${public_group_state ? 'animate__animated animate__fadeIn' : 'd-none'}`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 6, top: 0, left: 0, width: '100%', height: '100%', position: 'fixed' }}>
            {/* Layout 1 */}
            <div className={`bg-white create-group-div rounded mx-auto mt-4 p-3 ${public_group_state1 ? '' : 'd-none'}`}>
              <div className="modal-header d-flex justify-content-center" style={{ backgroundColor: '#5d5fe3' }}>
                <h6 style={{ backgroundColor: '#5d5fe3' }} className='modal-title fs-5 text-white' id="staticBackdropLabel">Create Your Private Group</h6>
              </div>

              <div className="row px-3 pt-2">
                <div className="mb-3 col-sm-6">
                  <label htmlFor="formGroupExampleInput" className="form-label">Group Name*</label>
                  <input type="text" className="form-control" id="formGroupExampleInput" onChange={groupNameData} value={groupname} maxLength={50} style={{ borderColor: '#5d5fe3' }} required placeholder="min 6 characters" />
                </div>
                <div className="mb-3 col-sm-6">
                  <label htmlFor="formGroupExampleInput2" className="form-label">Scope</label>
                  <input type="text" className="form-control" id="formGroupExampleInput1" value={scope} style={{ borderColor: '#5d5fe3', backgroundColor: '#e9ecef' }} required placeholder="public/private" />
                </div>
              </div>
              <div className='text-center'>
                <input type="file" name="file" id="fileInput" className="d-none" onChange={groupImage} />
                <label htmlFor="fileInput" className='btn btn-primary mt-3' style={{ backgroundColor: '#5d5fe3', cursor: 'pointer' }}>
                  <i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload Group Profile Image
                </label>
                {groupimage && (
                  <p className='text-center text-muted mt-2'>{groupimage.name}</p>
                )}
              </div>
              <div className='mb-3'>
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  className="me-2"
                />
                <label htmlFor="termsCheckbox" className="form-check-label">
                  I agree to the <a href="#" onClick={() => setTermsVisible(!termsVisible)} style={{ textDecoration: 'underline' }}>Private Groups Terms & Conditions</a>
                </label>
                {termsVisible && (
                  <div className='terms-container ps-4 text-muted mt-2'>
                    <p className="fw-bold">Here are the terms and conditions:</p>
                    <ul className="list-unstyled">
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Privacy Assurance:</span><span className="fw-normal"> Group content is accessible only to invited members.</span></li>
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Member Invitations:</span><span className="fw-normal"> Invite members via email or username.</span></li>
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Content Guidelines:</span><span className="fw-normal"> Follow community standards for all posts.</span></li>
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Moderation:</span><span className="fw-normal"> Group creators must moderate content actively.</span></li>
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Reporting Mechanism:</span><span className="fw-normal"> Members can report inappropriate content.</span></li>
                      <li style={{ listStyleType: 'disc', marginLeft: '20px' }}><span className="fw-bold">Data Usage:</span><span className="fw-normal"> Data within the group is used for platform improvement and not shared externally.</span></li>
                    </ul>
                  </div>
                )}
              </div>
              <div className='mt-4 text-end'>
                <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm' onClick={() => {
                  if (!groupname || !scope || !groupimage || !document.getElementById('termsCheckbox').checked) {
                    alert('Please fill all the mandatory fields correctly and agree to the terms and conditions.');
                    return;
                  }
                  createGroup();
                }}>{translate_value.group.create}</button>
                <button style={{ backgroundColor: '#5d5fe3' }} className='text-white fw-medium btn btn-sm ms-3' onClick={() => {
                  setGroupname("");
                  setGroupimage(null);
                  setpublic_group_state(false);
                  setTermsVisible(false);
                }}>{translate_value.group.exit}</button>
              </div>
            </div>
          </div>



          {/*------------------End- Updated private group application-form changed by VA------------------------ */}


          {/* Layout 2 */}
          {/* -----------------------------------------Copy Created Group Id------------------------------------------------------ */}
          <div className={`bg-light create-group-div2 rounded p-2 px-3 mx-auto mt-4 animate__animated animate__fadeIn ${public_group_state2 ? '' : 'd-none'}`}>
            <div className='d-flex justify-content-between align-items-center py-2'>
              <h6 className='m-0' style={{ color: '#5d5fe3' }}>Share your Group ID</h6>
              <svg style={{ cursor: 'pointer' }} onClick={() => {
                setpublic_group_state2(false)
                setpublic_group_state(false)
              }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </div>
            <div className='bg-white shadow-sm rounded row m-0 my-2 py-3'>
              <div className="col-1 d-flex align-items-center justify-content-center">
                {joinedPrivategroups[0] && joinedPrivategroups[0].group_image != undefined && (<img src={joinedPrivategroups[0].group_image} style={{ width: '100%', height: '90%' }} alt="" />)}
              </div>
              <div className="col-10 ps-2 d-flex justify-content-center flex-column">
                {joinedPrivategroups[0] && joinedPrivategroups[0].group_name !== undefined && (<p className='m-0 fw-medium' style={{ fontSize: '17px' }}>{joinedPrivategroups[0].group_name}</p>)}
                {joinedPrivategroups[0] && joinedPrivategroups[0].group_id !== undefined && (<span className='d-flex align-items-center' style={{ fontSize: '14px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-key" viewBox="0 0 16 16">
                  <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                  <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg><span className='ms-1' id='group-id'>{joinedPrivategroups[0].group_id}</span></span>)}
              </div>
              <div className="col-1 d-flex align-items-center justify-content-center">
                <button className='btn btn-sm border-0' onClick={() => {
                  copy()
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="29" viewBox="0 0 25 29" fill="none">
                    <path d="M21.2532 28.3543C20.2413 28.3543 19.3802 27.9999 18.6697 27.2909C17.9592 26.5821 17.604 25.7212 17.604 24.7085C17.604 24.5146 17.6208 24.3137 17.6545 24.1059C17.6881 23.8981 17.7386 23.7026 17.8059 23.5194L6.51506 16.8671C6.15796 17.2691 5.74289 17.5828 5.26986 17.8081C4.79685 18.0334 4.29017 18.146 3.74984 18.146C2.7371 18.146 1.87628 17.7919 1.16738 17.0836C0.458464 16.3753 0.104004 15.5153 0.104004 14.5034C0.104004 13.4916 0.458464 12.6305 1.16738 11.92C1.87628 11.2096 2.7371 10.8543 3.74984 10.8543C4.29017 10.8543 4.79685 10.967 5.26986 11.1923C5.74289 11.4175 6.15796 11.7312 6.51506 12.1332L17.8059 5.48092C17.7386 5.2977 17.6881 5.1022 17.6545 4.89441C17.6208 4.68663 17.604 4.48576 17.604 4.29183C17.604 3.27909 17.9581 2.41827 18.6664 1.70938C19.3747 1.00046 20.2347 0.645996 21.2465 0.645996C22.2584 0.645996 23.1195 1.00013 23.83 1.70839C24.5404 2.41668 24.8957 3.27672 24.8957 4.28851C24.8957 5.30035 24.5412 6.1615 23.8323 6.87195C23.1234 7.58242 22.2626 7.93766 21.2498 7.93766C20.7095 7.93766 20.2028 7.82502 19.7298 7.59973C19.2568 7.37444 18.8417 7.0608 18.4846 6.65881L7.19377 13.3111C7.26107 13.4943 7.31155 13.6891 7.34521 13.8956C7.37885 14.1021 7.39567 14.3016 7.39567 14.4944C7.39567 14.6871 7.37885 14.8886 7.34521 15.0989C7.31155 15.3093 7.26107 15.506 7.19377 15.6892L18.4846 22.3415C18.8417 21.9395 19.2568 21.6259 19.7298 21.4006C20.2028 21.1753 20.7095 21.0627 21.2498 21.0627C22.2626 21.0627 23.1234 21.4168 23.8323 22.1251C24.5412 22.8333 24.8957 23.6934 24.8957 24.7052C24.8957 25.717 24.5415 26.5782 23.8333 27.2886C23.125 27.9991 22.2649 28.3543 21.2532 28.3543ZM21.2498 6.47933C21.85 6.47933 22.3646 6.26478 22.7937 5.83569C23.2228 5.4066 23.4373 4.89198 23.4373 4.29183C23.4373 3.69168 23.2228 3.17705 22.7937 2.74796C22.3646 2.31887 21.85 2.10433 21.2498 2.10433C20.6497 2.10433 20.1351 2.31887 19.706 2.74796C19.2769 3.17705 19.0623 3.69168 19.0623 4.29183C19.0623 4.89198 19.2769 5.4066 19.706 5.83569C20.1351 6.26478 20.6497 6.47933 21.2498 6.47933ZM3.74984 16.6877C4.34999 16.6877 4.86461 16.4731 5.2937 16.044C5.72279 15.6149 5.93734 15.1003 5.93734 14.5002C5.93734 13.9 5.72279 13.3854 5.2937 12.9563C4.86461 12.5272 4.34999 12.3127 3.74984 12.3127C3.14968 12.3127 2.63506 12.5272 2.20597 12.9563C1.77688 13.3854 1.56234 13.9 1.56234 14.5002C1.56234 15.1003 1.77688 15.6149 2.20597 16.044C2.63506 16.4731 3.14968 16.6877 3.74984 16.6877ZM21.2498 26.896C21.85 26.896 22.3646 26.6814 22.7937 26.2524C23.2228 25.8233 23.4373 25.3086 23.4373 24.7085C23.4373 24.1083 23.2228 23.5937 22.7937 23.1646C22.3646 22.7355 21.85 22.521 21.2498 22.521C20.6497 22.521 20.1351 22.7355 19.706 23.1646C19.2769 23.5937 19.0623 24.1083 19.0623 24.7085C19.0623 25.3086 19.2769 25.8233 19.706 26.2524C20.1351 26.6814 20.6497 26.896 21.2498 26.896Z" fill="#5D5FE3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TOAST MESSAGE */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-body d-flex justify-content-between align-items-center">
            <span id='toastbody' className='fw-medium p-1'></span>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Opengroups
