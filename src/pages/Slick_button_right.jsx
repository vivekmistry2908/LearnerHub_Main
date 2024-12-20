import React from 'react'

const Slick_button_right = ({onClick}) => {
  return (
    <div>
        <button onClick={onClick} className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center' style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',height:'30px',width:'30px',backgroundColor:'#ffede7',border:'0.6px solid #ff9e80'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M11.6307 10.5L7.60571 6.47495L8.22495 5.85571L12.8692 10.5L8.22495 15.1442L7.60571 14.525L11.6307 10.5Z" fill="#FF845D"/>
</svg>
        </button>
    </div>
  )
}

export default Slick_button_right