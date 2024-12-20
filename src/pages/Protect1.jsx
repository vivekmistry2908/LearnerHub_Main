import React from 'react'
import Loginpage from './Loginpage'
import Shared_document_page from './Shared_document_page'

const Protect1 = ({Child,settranslated_pdf_url}) => {
    const user=sessionStorage.getItem("user")
    let verify=()=>{
        if(user==null){
            return false
            alert("Invalid Login Credentials")
        }
        else{
            return true
        }
    }
  return (
    <div>
        {
            verify()? <Child settranslated_pdf_url={settranslated_pdf_url}/> : <Shared_document_page/>
        }
    </div>
  )
}

export default Protect1