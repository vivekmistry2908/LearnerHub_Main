import React, { useEffect, useState } from 'react';
import Admin_sidebar from './Admin_sidebar';
import Admin_navbar from './Admin_navbar';
import axios from 'axios';
import { ipaddress } from '../App';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Backtotop from '../pages/Backtotop';

const Help_request = () => {
  const navigate = useNavigate();
  const [help_details, sethelp_details] = useState([]);
  const [displayed_data, setDisplayed_data] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    axios
      .get(`${ipaddress}/admin_app/api/NeedHelpUsers/`)
      .then((r) => {
        // console.log('Help data', r.data);
        sethelp_details(r.data);
        setDisplayed_data(r.data.slice(0, ITEMS_PER_PAGE))
      })
      .catch((err) => {
        // console.log('Help fetching error', err);
      });
  }, []);

  const loadMore = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE;
    const newDisplayedUniversities = help_details.slice(0, nextIndex + ITEMS_PER_PAGE);
    setDisplayed_data(newDisplayedUniversities);
    setCurrentIndex(nextIndex);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(help_details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'help_data.xlsx');
  };

  return (
    <div>
      <Admin_navbar />

      <div className='d-flex'>
        <Admin_sidebar state={'help'} />
        <div className='bg-light w-100 px-3'>
          <div className='mt-3 container'>
            <div className='d-flex justify-content-between align-items-center pb-2'>
              <h6 className='text-primary m-0'>Help Requests</h6>
              <button className='btn btn-sm text-white' style={{backgroundColor:'#5d5fe3'}} onClick={exportToExcel}>
                Export to Excel
              </button>
            </div>

            <h6 className={`text-secondary text-center py-3 ${help_details.length>0 ? 'd-none':''}`}>No data found...</h6>
            <div className={`table-responsive rounded bg-white border-0 ${help_details.length>0 ? '':'d-none'}`}>
              <table className='table caption-top'>
                <thead>
                  <tr>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>SI No</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Asked by</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>User Id</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Date</span>
                    </th>
                    <th scope='col'>
                      <span className='fw-medium text-secondary'>Message</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayed_data.map((x, index) => (
                    <tr>
                      <td scope='row'>{index + 1}</td>
                      <td>{x.user_details}</td>
                      <td>{x.user_id}</td>
                      <td>{x.created_at!=undefined && x.created_at.slice(0,10)}</td>
                      <td>{x.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {displayed_data.length < help_details.length && (
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

export default Help_request
