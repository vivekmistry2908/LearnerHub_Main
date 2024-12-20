// Document discussion modal forms (Pinning comment, User's comments and search comments)

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ipaddress, ipaddress2 } from '../App'
import axiosInstance from './axiosInstance'

const DocumentCommentsection = ({id,count}) => {

    const[userComments,setUsercomments]=useState([])
    const[pinnedComments,setpinnedcomments]=useState([])
    const[count1,setCount1]=useState(0)

    const user=JSON.parse(sessionStorage.getItem('user'))

// --------------------------------------------------GEMINI AI-------------------------------------------------------------
const [question, setQuestion] = useState("");
const[answer,setAnswer]=useState(null)
  let searchData = (e) => {
    setQuestion(e.target.value);
  };

    const[load,setload]=useState(false)
  let sendSearch = async (e) => {
    e.preventDefault();
  setload(true)
    try {
      // const response = await axiosInstance.post(`${ipaddress}/GenerateContentView/`, { question });
      const response = await axiosInstance.post(`${ipaddress2}/askquery`, { 
        "query":question
       });
      setAnswer(response.data);
      setQuestion("")
      document.getElementById('see-result').style.display='block'
      console.log(response.data)
        setload(false)
    } catch (error) {
      console.error("Error sending data:", error);
        setload(false)
    }
  };
  
  // useEffect to log the updated value of answer
  useEffect(() => {
  }, [answer]);

  // -----------------------------------------Unpin the comments which are pinned----------------------------------------------------

  return (
    <div>

{/* ------------------------------------------GEMINI AI---------------------------------------------------------------- */}
<div class="modal fade" id="geminiai" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-body">
        <div className='text-end pb-2'>
        <button data-bs-dismiss="modal" className='bg-transparent border-0'><i class="fa-solid fa-circle-xmark fs-5"></i></button>
        </div>
      <div className="border shadow-sm rounded pt-2 mt-3 mt-md-0" style={{height:'auto'}}>
                    <h6 className="mb-3 mt-2 px-2"><img src={require('../img/search.gif')} width={36} alt="" />Ask Your Question Here...</h6>
                    <form onSubmit={e => { e.preventDefault(); }}>
                      <div class="input-group w-100 px-1 px-md-5">
                        <input
                          type="text"
                          name="question"
                          value={question}
                          onChange={searchData}
                          class="form-control  mx-auto outline-0  shadow-none py-2 border-end-0 ps-4"
                          placeholder="Search...."
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          style={{ borderRadius: "30px  0px 0px 30px" }}
                        />
                        <span
                          class={`input-group-text fw-bold bg-transparent px-3 `}
                          id="basic-addon2"
                          style={{ borderRadius: "0px 30px 30px 0px" }}
                        >
                          <a href="" onClick={sendSearch}>
                             <div class={`spinner-border spinner-border-sm ${load ? '':'d-none'}`} role="status">
  <span class="visually-hidden">Loading...</span>
</div>
                            <i class={`fa-solid fa-magnifying-glass text-secondary fs-6 ${load || question.length<1 ? 'd-none':''}`}></i>
                          </a>
                        </span>
                      </div>
                    </form>
                    <div className="px-2 mt-2 mt-3">
                      <span id="see-result" className="fw-medium px-2" style={{display:'none'}}><i class="fa-solid fa-comment me-2"></i>See Your Result...</span>
                      {answer != null ? (
                        <p>{answer.response.explanation}</p>) : (<></>)
                      }
                    {answer != null && <div className=''>
                      
                      {answer.response.sources && answer.response.sources.map((x)=>{
                        return(
                          <div className='mt-3' key="{x.title}">
                            <p>{x.title}</p>
                            <a href={x.url}>{x.url}</a>
                          </div>
                        )
                      })}
                      </div>
                    }
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
)
}

export default DocumentCommentsection
