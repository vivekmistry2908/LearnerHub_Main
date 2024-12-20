import React from 'react'

const Slick2_button_left = ({onClick}) => {
  return (
    <div>
        <button onClick={onClick} className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center' style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:'36px',height:'36px',backgroundColor:'#EBE6FF',border:'0.6px solid #5D5FE3'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#5d5fe3">
  <path d="M13.3846 15L19.1346 9.24998L18.25 8.36536L11.6154 15L18.25 21.6346L19.1346 20.75L13.3846 15Z" fill="#5d5fe3"/>
</svg>
        </button>
    </div>
  )
}

export default Slick2_button_left