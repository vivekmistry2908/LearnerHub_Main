import React from 'react'

const Slick2_button_right = ({onClick}) => {
  return (
    <div>
        <button onClick={onClick} className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center' style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',height:'36px',width:'36px',backgroundColor:'#EBE6FF',border:'0.6px solid #5D5FE3'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M16.6154 15L10.8654 9.24998L11.75 8.36536L18.3846 15L11.75 21.6346L10.8654 20.75L16.6154 15Z" fill="#5D5FE3"/>
</svg>
        </button>
    </div>
  )
}

export default Slick2_button_right