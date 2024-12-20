import React, { useEffect, useState } from 'react';
import Admin_sidebar from './Admin_sidebar';
import Admin_navbar from './Admin_navbar';
import axios from 'axios';
import { ipaddress } from '../App';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Backtotop from '../pages/Backtotop';

const Users_page = () => {
  const navigate = useNavigate();
  const [user_details, setUser_details] = useState([]);
  const [displayed_users, setDisplayed_users] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    axios
      .get(`${ipaddress}/admin_app/AllUsers/1/`)
      .then((r) => {
        // console.log('All Users data', r.data);
        setUser_details(r.data);
        setDisplayed_users(r.data.slice(0, ITEMS_PER_PAGE))
      })
      .catch((err) => {
        // console.log('All users fetching error', err);
      });
  }, []);

  const loadMore = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE;
    const newDisplayedUniversities = user_details.slice(0, nextIndex + ITEMS_PER_PAGE);
    setDisplayed_users(newDisplayedUniversities);
    setCurrentIndex(nextIndex);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(user_details);

    //  // Get the range of the worksheet

    //  const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    //  // Define a style for the header row

    //  const headerStyle = { font: { bold: true } };
 
    //  // Apply the style to the first row

    //  for (let C = range.s.c; C <= range.e.c; ++C) {
    //    const cell_address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    //    if (!worksheet[cell_address]) continue;
    //    if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
    //    worksheet[cell_address].s = headerStyle;
    //  }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'UsersData.xlsx');
  };

  return (
    <div>
      <Admin_navbar />

      <div className='d-flex'>
        <Admin_sidebar state={'user-page'} />
        <div className='bg-light w-100 px-3'>
          <h6 className='mt-4'>Users Details</h6>
          <div className='mt-3 container'>
            <div className='d-flex justify-content-between align-items-center pb-2'>
              <h6 className='text-primary m-0'>All Users</h6>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>
            <div className='table-responsive rounded bg-white border-0 '>
              <table className='table caption-top'>
                <thead>
                  <tr>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>SI No</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>User Id</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Name</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Nickname</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Email</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>University</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Program</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>City</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayed_users.map((x, index) => (
                    <tr
                      key={x.user_id}
                    >
                      <td scope='row'>{index + 1}</td>
                      <td>{x.user_id}</td>
                      <td  style={{ cursor: 'pointer' }}
                      onClick={() => {
                        navigate(`/history/${x.user_id}`);
                      }}>
                        {x.first_name} <span>{x.last_name}</span>
                      </td>
                      <td>{x.nickname}</td>
                      <td>{x.email}</td>
                      <td>{x.university}</td>
                      <td>{x.program}</td>
                      <td>{x.city}</td>
                      <td>
                        <button
                          className={`btn btn-sm text-white px-3 ${
                            x.blocked_status ? 'd-none' : ''
                          }`}
                          style={{ backgroundColor: '#5d5fe3' }}
                        >
                          Block
                        </button>
                        <button
                          className={`btn btn-sm text-white px-3 ${
                            x.blocked_status ? '' : 'd-none'
                          }`}
                          style={{ backgroundColor: '#5d5fe3' }}
                        >
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {displayed_users.length < user_details.length && (
              <p style={{cursor:'pointer',color:'#5d5fe3'}} className='text-decoration-underline text-center' onClick={loadMore}>Load More...</p>
            )}
            </div>
          </div>
        </div>
      </div>
      <Backtotop/>
    </div>
  );
};

export default Users_page;
