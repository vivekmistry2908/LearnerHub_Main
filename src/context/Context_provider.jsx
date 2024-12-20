import React, { createContext, useState } from 'react'
import data from '../pages/translate';

export const Context=createContext()

const Context_provider = (props) => {
    const [translate_value, settranslate_value] = useState(data.en);
    const [lang, setLang] = useState("en");
    const[group_id,setgroup_id]=useState("")
    const[addsubjects_layout,setAddsubjects_layout]=useState(false)
    const[course_visible,setcourse_visible]=useState(false)
    const[group_visible,setgroup_visible]=useState(false)
    const[studylist_visible,setstudylist_visible]=useState(false)
    const[navbar_dropdown_visible,setnavbar_dropdown_visible]=useState(false)
    const[count4,setCount4]=useState(0)

    const provided_value={translate_value,setCount4,count4,settranslate_value,lang, setLang,group_id,setgroup_id,addsubjects_layout,setAddsubjects_layout,
      course_visible,setcourse_visible,
      group_visible,setgroup_visible,studylist_visible,setstudylist_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}

  return (
    <Context.Provider value={provided_value}>
        {props.children}
    </Context.Provider>
  )
}

export default Context_provider