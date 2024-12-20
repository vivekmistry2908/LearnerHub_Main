// ToastComponent.js
import React from 'react';

const ToastComponent = ({toaststatus,message}) => {
  return (
   <div>
   {/* TOAST MESSAGE */}
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-animation="true" data-bs-autohide="true" data-bs-delay="3000">
    <div class="toast-body d-flex justify-content-between py-3 px-3">
      <p className='m-0 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00ae13" class={`bi bi-check-circle-fill ${toaststatus ? '':'d-none'}`} viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg><span id="toastbody" className='fw-medium ms-4'>{message}</span></p> 
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
   </div>
  );
};

export default ToastComponent;
