import React from 'react'

const Subjects_sidebar = () => {
  return (
    <div className='' style={{width:'440px',height:'100vh',position:'fixed',left:'94px',zIndex:6}}>
         <div className='d-flex justify-content-between bg-light py-3 align-items-center px-3'>
              <p className='m-0' style={{fontSize:'16px',fontWeight:500,letterSpacing:'0.32px',lineHeight:'normal'}}>{translate_value.common_words.subjects}</p>
              <Link className='btn border border-primary-subtle px-3 py-2 text-decoration-none ms-auto d-flex align-items-center' to='/courses' style={{height:'44px',color:'#8587EA',fontSize:'14px'}}><i class="fa-solid fa-plus me-2"></i>Add {translate_value.common_words.subjects}</Link>
            </div>
          <div>
            {loading ? (<Small_Preloader/>):(
                <ul className='p-0 px-2' style={{listStyleType:'none',height:'90%',overflowY:joinedCourses1.length>6 ? 'scroll':'none'}}>
                {joinedCourses1 && (
                  joinedCourses1.map((x,index)=>{
                    return(
                      <li key={index} className='mt-2 py-3 border-bottom px-2 px-lg-3'>
                      <span onClick={()=>{
                        removeunseenmessages(x.course_id,x.course_name)
                      }} className='text-decoration-none text-dark' style={{fontSize:'16px',cursor:'pointer',fontWeight:450,lineHeight:'22px',letterSpacing:'0.32px'}}>{x.course_name} 
                      <span className={`text-white ms-1 ${x.notification_count>0 ? '':'d-none'}`} style={{backgroundColor:'#FF845D',fontSize:'13px',paddingTop:'3px',paddingBottom:'3px',paddingLeft:'6px',paddingRight:'6px',borderRadius:'50%'}}>{x.notification_count}</span>
                      </span>
                      <div className='mt-1'>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.16357 15.513V14.1412C2.16357 13.7544 2.26373 13.4219 2.46405 13.1436C2.66437 12.8653 2.93357 12.6428 3.27166 12.4763C3.99448 12.1322 4.71219 11.8578 5.42478 11.6532C6.13739 11.4486 6.99477 11.3463 7.99691 11.3463C8.99905 11.3463 9.85642 11.4486 10.569 11.6532C11.2816 11.8578 11.9993 12.1322 12.7222 12.4763C13.0602 12.6428 13.3294 12.8653 13.5298 13.1436C13.7301 13.4219 13.8302 13.7544 13.8302 14.1412V15.513H2.16357ZM15.4969 15.513V14.1027C15.4969 13.6198 15.3992 13.164 15.2037 12.7352C15.0082 12.3064 14.7309 11.9385 14.3719 11.6315C14.7811 11.7149 15.1753 11.8305 15.5546 11.9785C15.9339 12.1265 16.3089 12.2929 16.6796 12.4777C17.0407 12.6593 17.3238 12.8918 17.529 13.175C17.7341 13.4582 17.8367 13.7675 17.8367 14.1027V15.513H15.4969ZM7.99691 9.48733C7.30941 9.48733 6.72087 9.24253 6.23128 8.75295C5.7417 8.26337 5.49691 7.67483 5.49691 6.98733C5.49691 6.29981 5.7417 5.71126 6.23128 5.22168C6.72087 4.7321 7.30941 4.4873 7.99691 4.4873C8.68441 4.4873 9.27295 4.7321 9.76253 5.22168C10.2521 5.71126 10.4969 6.29981 10.4969 6.98733C10.4969 7.67483 10.2521 8.26337 9.76253 8.75295C9.27295 9.24253 8.68441 9.48733 7.99691 9.48733ZM14.0546 6.98733C14.0546 7.67483 13.8098 8.26337 13.3202 8.75295C12.8307 9.24253 12.2421 9.48733 11.5546 9.48733C11.5194 9.48733 11.4745 9.48332 11.42 9.47531C11.3655 9.46729 11.3206 9.45848 11.2854 9.44887C11.5677 9.1031 11.7846 8.71953 11.9362 8.29814C12.0878 7.87675 12.1636 7.43915 12.1636 6.98533C12.1636 6.53152 12.0842 6.09789 11.9256 5.68443C11.7669 5.27097 11.5535 4.88475 11.2854 4.52576C11.3302 4.50975 11.3751 4.49933 11.42 4.49451C11.4649 4.48971 11.5097 4.4873 11.5546 4.4873C12.2421 4.4873 12.8307 4.7321 13.3202 5.22168C13.8098 5.71126 14.0546 6.29981 14.0546 6.98733ZM2.99691 14.6796H12.9969V14.1412C12.9969 13.9456 12.948 13.7747 12.8503 13.6283C12.7525 13.482 12.577 13.342 12.3238 13.2085C11.702 12.8762 11.0466 12.6217 10.3575 12.4448C9.66838 12.268 8.88152 12.1796 7.99691 12.1796C7.1123 12.1796 6.32543 12.268 5.63632 12.4448C4.94723 12.6217 4.29178 12.8762 3.66999 13.2085C3.41678 13.342 3.2413 13.482 3.14353 13.6283C3.04578 13.7747 2.99691 13.9456 2.99691 14.1412V14.6796ZM7.99691 8.65399C8.45524 8.65399 8.8476 8.4908 9.17399 8.16441C9.50038 7.83802 9.66357 7.44566 9.66357 6.98733C9.66357 6.52899 9.50038 6.13663 9.17399 5.81024C8.8476 5.48385 8.45524 5.32066 7.99691 5.32066C7.53857 5.32066 7.14621 5.48385 6.81982 5.81024C6.49343 6.13663 6.33024 6.52899 6.33024 6.98733C6.33024 7.44566 6.49343 7.83802 6.81982 8.16441C7.14621 8.4908 7.53857 8.65399 7.99691 8.65399Z" 
            fill="#ff845d"/>
            </svg> <span className='ms-1 text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>{x.students_count} Students</span></span>
            
            <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.08341 14.5833H12.9167V13.75H7.08341V14.5833ZM7.08341 11.25H12.9167V10.4167H7.08341V11.25ZM5.51289 17.5C5.12935 17.5 4.80911 17.3715 4.55216 17.1146C4.29522 16.8576 4.16675 16.5374 4.16675 16.1539V3.84615C4.16675 3.4626 4.29522 3.14236 4.55216 2.88542C4.80911 2.62847 5.12935 2.5 5.51289 2.5H12.0834L15.8334 6.25V16.1539C15.8334 16.5374 15.7049 16.8576 15.448 17.1146C15.1911 17.3715 14.8708 17.5 14.4873 17.5H5.51289ZM11.6667 6.66667V3.33333H5.51289C5.3847 3.33333 5.26718 3.38675 5.16033 3.49358C5.0535 3.60043 5.00008 3.71795 5.00008 3.84615V16.1539C5.00008 16.282 5.0535 16.3996 5.16033 16.5064C5.26718 16.6132 5.3847 16.6667 5.51289 16.6667H14.4873C14.6155 16.6667 14.733 16.6132 14.8398 16.5064C14.9467 16.3996 15.0001 16.282 15.0001 16.1539V6.66667H11.6667Z" fill="#ff845d"/>
            </svg><span className='ms-1 text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>{x.documents_count} Documents</span></span>
                        <span className='ms-3'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6.66669 16.1536V8.00778C6.66669 7.63492 6.79863 7.31815 7.06252 7.05747C7.32641 6.79679 7.64479 6.66645 8.01765 6.66645H16.1539C16.5267 6.66645 16.8443 6.79758 17.1066 7.05986C17.3689 7.32215 17.5 7.63973 17.5 8.01259V13.8139L13.8141 17.4998H8.01284C7.63997 17.4998 7.3224 17.3686 7.06011 17.1064C6.79783 16.8441 6.66669 16.5265 6.66669 16.1536ZM2.52086 5.49657C2.4482 5.12371 2.51978 4.78797 2.73559 4.48936C2.95141 4.19075 3.24575 4.00512 3.61861 3.93247L11.6346 2.52061C12.0075 2.44796 12.3432 2.51954 12.6419 2.73534C12.9405 2.95116 13.1261 3.2455 13.1988 3.61836L13.375 4.67926H12.5321L12.3542 3.68567C12.3328 3.56815 12.2687 3.47467 12.1619 3.40524C12.055 3.33579 11.9375 3.31175 11.8093 3.33311L3.76604 4.76101C3.61647 4.78237 3.50429 4.85181 3.4295 4.96932C3.35472 5.08685 3.32802 5.2204 3.34938 5.36997L4.6795 12.8828V14.4966C4.48934 14.4036 4.32774 14.2717 4.19473 14.1007C4.06172 13.9298 3.97438 13.7338 3.93271 13.5126L2.52086 5.49657ZM7.50002 8.01259V16.1536C7.50002 16.3032 7.5481 16.4261 7.64425 16.5222C7.74041 16.6184 7.86327 16.6664 8.01284 16.6664H13.3334V13.3331H16.6667V8.01259C16.6667 7.86302 16.6186 7.74016 16.5225 7.64401C16.4263 7.54785 16.3034 7.49978 16.1539 7.49978H8.01284C7.86327 7.49978 7.74041 7.54785 7.64425 7.64401C7.5481 7.74016 7.50002 7.86302 7.50002 8.01259Z" fill="#ff845d"/>
            </svg> <span className='ms- text-decoration-underline' style={{fontSize:'12px',color:'#37454D'}}>
            {x.flashsets_count} Flashsets</span></span>
                      </div>
                      </li>
                    )
                  })
                )}
                
               </ul>
            )}
          </div>
    </div>
  )
}

export default Subjects_sidebar