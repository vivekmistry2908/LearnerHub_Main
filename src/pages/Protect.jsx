import React from 'react'
import Loginpage from './Loginpage'

const Protect = ({Child,language}) => {
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
            verify()? <Child language={language}/> : <Loginpage/>
        }
    </div>
  )
}

export default Protect