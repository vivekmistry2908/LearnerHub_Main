import React from 'react'

const Slick_button_left = ({onClick}) => {
  return (
    <div>
        <button onClick={onClick} className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center' style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:'30px',height:'30px',backgroundColor:'#ffede7',border:'0.6px solid #ff9e80'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 30 30" fill="none">
  <path d="M13.3846 15L19.1346 9.24998L18.25 8.36536L11.6154 15L18.25 21.6346L19.1346 20.75L13.3846 15Z" fill="#FF845D"/>
</svg>
        </button>
    </div>
  )
}

export default Slick_button_left