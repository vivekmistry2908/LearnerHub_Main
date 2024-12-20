import React from 'react'
import Navbar from '../components/Navbar'
import Mainsidebar from '../components/Mainsidebar'
import { useState,useEffect,useContext,useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ipaddress2,ipaddress22 } from '../App'
import { Link } from 'react-router-dom'
import ReactCardFlip from 'react-card-flip'
import Backtotop from './Backtotop'
import { Context } from '../context/Context_provider'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axiosInstance from './axiosInstance'


import 'bootstrap';
import * as bootstrap from 'bootstrap';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

const Filterflashcard = () => {

  let {translate_value,addsubjects_layout,setgroup_visible,setstudylist_visible,setcourse_visible,navbar_dropdown_visible,setnavbar_dropdown_visible}=useContext(Context)

  const renderTooltip3 = (value) => (
    <Tooltip id="button-tooltip">
      {value}
    </Tooltip>
  );

    let {flashset_id}=useParams()
    let {id}=useParams()
    let {type}=useParams()

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Stop the current playing mode and then mute the audio
      </Tooltip>
    );

    const renderTooltip2 = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Stop the current playing mode and then unmute the audio
      </Tooltip>
    );


    let {study_status}=useParams()
    const[dropdownstate,setDropdownstate]=useState(false)
    const [study_scope, setStudy_scope] = useState('');
    const [show_first, setShow_first] = useState('');
    const [study_order, setStudy_order] = useState('');
    const [filterbyprogress, setFilterbyprogress] = useState([]);
    const [flashcards, setflashcards] = useState([]);
    const user=JSON.parse(sessionStorage.getItem('user'))

    const[studyflashcardsstatus,setstudyflashcardsstatus]=useState(false)
    // const [studyFlashcardsStatus, setStudyFlashcardsStatus] = useState('stopped');
    // let intervalId;

// ------------------------------To get all the Saved Flashsets--------------------------------------------------

const[savedflashsets,setSavedflashsets]=useState([])

const fetchSavedflashsets=()=>{
  axiosInstance.post(`${ipaddress2}/SavedStudylistFlashsets/`,{
    'user_id':user.user_id
  })
  .then((r)=>{
    // console.log("Saved Flashsets",r.data)
    setSavedflashsets(r.data)
  })
}

// ------------------------------------------------To fetch the Bookmarked flashcards-------------------------------------------

const fetchBookmarkedflashcards=()=>{
  axiosInstance.post(`${ipaddress2}/UserBookmarkedFlashcardsView/`,{
    'user_id':user.user_id
  })
  .then((r)=>{
    // console.log("Bookmarked Flashcards",r.data.bookmarked_flashcards)
    setflashcards(r.data.bookmarked_flashcards)
    setflashcard_obj(r.data.bookmarked_flashcards[0])
    setflashcard_obj_shuffle(r.data.bookmarked_flashcards[0])
    setflashcard_obj_repeat(r.data.bookmarked_flashcards[0])
    setDropdownstate(false)
  })
}


// -------------------------------------To play the flashcards one by one----------------------------------------------
const[flashcardcount,setflashcardcount]=useState(0)
const[count,setCount]=useState(1)
useEffect(()=>{
  if(studyflashcardsstatus==true){
        // setInterval(()=>{
        //   studyFlashcardsrepeatly()
        // },2000)
        studyFlashcardsrepeatly()
      }
},[studyflashcardsstatus,count])

useEffect(() => {
  // Triggering the function when flashcards length becomes zero
  if (flashcards.length === 0) {
    setCount(1)
    studyFlashcardsrepeatly();
  }
}, [flashcards]); 

const studyFlashcardsrepeatly=()=>{
  if(flashcards.length>0){
  setflashcards((prevFilteredcards) => {
    const newFilteredcards = [...prevFilteredcards];
    newFilteredcards.shift(); // To Remove the first element from
    return newFilteredcards;
  });
  // setflashcardcount(flashcardcount + 1);
  setTimeout(()=>{
    setCount((prev)=>prev+1)
  },2000)
  // setflashcardcount(prevCount => prevCount + 1); 
}
else{
  // setflashcardcount(0)
  getflashcards()
}
}

// -----------------------------------------Study flashcards in shuffle------------------------------------------------------
const[studyflashcardshuffle_status,setstudyflashcardshuffle_status]=useState(true)
const[count1,setCount1]=useState(0)

useEffect(()=>{
  if(studyflashcardshuffle_status==true){
        studyFlashcardsshuffle()
      }
},[studyflashcardshuffle_status])

const studyFlashcardsshuffle = () => {
  if (flashcards.length > 0 && studyflashcardshuffle_status==true) {
    // Shuffle the flashcards array
    const shuffledFlashcards = [...flashcards].sort(() => Math.random() - 0.5);

    setflashcards((prevFilteredcards) => {
      const newFilteredcards = [...prevFilteredcards];
      newFilteredcards.shift(); // Remove the first element
      return newFilteredcards;
    });

    // Display the first card from the shuffled array
    displayCard(shuffledFlashcards[0]);

    setTimeout(() => {
    setCount((prev)=>prev+1)
      studyFlashcardsshuffle(); // Call the function recursively
    }, 5000);
  } else {
    // console.log("Stopped")
    getflashcards();
  }
}

const displayCard = (card) => {
  // Display logic for the card
  // console.log(card); // For demonstration, you can replace this with your actual display logic
}

const toggleShuffle = () => {
  if (studyflashcardshuffle_status) {
    //clearTimeout(shuffleTimeout); // Clear the shuffle timeout if shuffle is stopped
  }
  setstudyflashcardshuffle_status((prev) => !prev); // Toggle shuffle status
};

// ------------------------------------------Move to next flashcard------------------------------------------------------

const movetonextflashcard = () => {
  if(flashcardsindex<flashcards.length-1){
    setFlashcardsindex((prev)=>prev+1)
    setIsFlipped(false)
}
if(flashcardsindex<flashcards.length-1){
setflashcard_obj_repeat(flashcards[flashcardsindex+1])
setIsFlipped(false)
}
};

// ------------------------------------------Move to previous flashcard------------------------------------------------------

const movetopreviousflashcard = () => {
  if(flashcardsindex>0){
    setFlashcardsindex((prev)=>prev-1)
    setIsFlipped(false)
  }
  if(flashcardsindex>=0){
  setflashcard_obj_repeat(flashcards[flashcardsindex])
  setIsFlipped(false)
}
};



// -------------------------------------------------Text to Speech for Flashcards---------------------------------------------
const [text, setText] = useState("madhavan");
  const [speaking, setSpeaking] = useState(false);
  const [speaking2, setSpeaking2] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[3]); // Default to the first voice
      };

      updateVoices(); // Initial update

      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  useEffect(() => {
   fetchSavedflashsets()
   getflashcards()

  }, [flashset_id]);

// ------------------------------To get the flashcards under particular Flashset-----------------------------------------
const [flashcardslength,setFlashcardslength]=useState(0)
const[flashsetdata,setFlashsetdata]=useState({})
const [flashcardsindex,setFlashcardsindex]=useState(0)
const [flashcardsindex1,setFlashcardsindex1]=useState(0)
const[flashcard_obj,setflashcard_obj]=useState({})
const[flashcard_obj_shuffle,setflashcard_obj_shuffle]=useState({})
const[flashcard_obj_repeat,setflashcard_obj_repeat]=useState({})
const[loopstate,setloopstate]=useState(false)
const[shufflestate,setshufflestate]=useState(false)
const[repeatstate,setrepeatstate]=useState(false)


const getflashcards=()=>{
  // console.log("Flashindexcount",flashcardsindex)
axiosInstance.get(`${ipaddress2}/flashcardsList/${flashset_id}/${user.user_id}/`)
.then((r)=>{
//  console.log("Particular Flashset details2 Fetched",r.data)
 setFlashsetdata(r.data)
 setflashcards(r.data.flashcards_data)
 setFlashcardslength(r.data.flashcards_data.length)
 setflashcard_obj(r.data.flashcards_data[0])
 setflashcard_obj_shuffle(r.data.flashcards_data[0])
 setflashcard_obj_repeat(r.data.flashcards_data[0])
})
.catch(()=>{
//  console.log("Particular Flashset details2 Fetching Error")
})
}

const[count3,setCount3]=useState(0)


// Stop the loop
const stop_loop=()=>{
  if (window.confirm("Do you want to stop the loop?")) {
    stopSpeech()
    window.location.reload();
}
}
const[loop_audio,setloop_audio]=useState(false)
const[mute,setmute]=useState(false)
const togglerepeatMute = () => {
  setmute(true);
  setloopstate(true)
};

const prevloopstate = useRef(loopstate);

// useEffect to watch for changes in shuffleState
useEffect(() => {
  // Check if previous state was false and current state is true
  if (prevloopstate.current === false && loopstate === true) {
    // Trigger your function here
    initiateLoop()
  }
  // Update the previous state reference
  prevloopstate.current = loopstate;
}, [loopstate]);

// Main-step
const initiateLoop = () => {
  handleSpeechButtonClick();
};
// Step1

const handleSpeechButtonClick = () => {

  // if (speaking) {
  //   stopSpeech();
  // } else {
    textToSpeech();
  // }
  // setSpeaking(!speaking);
};

// Step2
  // -----------------------------Speech 1----------------------------------------------
  const textToSpeech = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = document.getElementById('paratext').textContent;

      // Set selected voice
      if (selectedVoice) {
        speech.voice = selectedVoice;
      }
       //To Decrease speech speed
    speech.rate = 0.6; // Adjust this value to decrease the speed further if needed
    // Increase volume
    speech.volume = mute ? 0:5;

      window.speechSynthesis.speak(speech);
      speech.onend=()=>{
        handleClick()
      }
    } else {
      console.error('Speech synthesis not supported in your browser.');
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
  };

// Step3

const [isFlipped, setIsFlipped] = useState(false);
const [isFlipped_shuffle, setIsFlipped_shuffle] = useState(false);

const handleClick = () => {
  // e.preventDefault();
  setIsFlipped(!isFlipped);
  handleSpeechButtonClick2();
  // console.log("Flashcardindex counttt",flashcardsindex);
};

// Step4
const handleSpeechButtonClick2 = () => {
  // if (speaking2) {
  //   stopSpeech2();
  // } else {
    textToSpeech2();
  // }
  // setSpeaking2(!speaking2);
};

// Step5
//  ----------------------------Speech 2
const textToSpeech2 = () => {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = document.getElementById('paratext1').textContent;

    // Set selected voice
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }

  speech.rate = 0.6;

  // Increase volume
  speech.volume = mute ? 0:5;

    window.speechSynthesis.speak(speech);
    speech.onend=()=>{
      studyFlashcardnew()
    }
  
  } else {
    console.error('Speech synthesis not supported in your browser.');
  }
};

// const stopSpeech2 = () => {
//   window.speechSynthesis.cancel();
// };

// Step6

const studyFlashcardnew = () => {
  // console.log("Called-flashcardsindex", flashcardsindex);
  // console.log("before-count3", count3);
  setFlashcardsindex(prev => {
    return prev + 1;
  });
  setIsFlipped(false);
};

useEffect(()=>{
  if(flashcardsindex<flashcards.length){
    updateFlashcard(flashcardsindex)
  }
  else{
    setFlashcardsindex(0)
  }
},[flashcardsindex])

const updateFlashcard = (index) => {
  setflashcard_obj(flashcards[index]);
  // console.log("Flashcard rendered index", index);
}

useEffect(()=>{
  // if(flashcardsindex<flashcards.length){
    // console.log("flashcards updated index",flashcardsindex)
    // console.log("ffalsh objectttttttt",flashcard_obj)
    // setflashcard_obj(flashcards[flashcardsindex])
    if(loopstate==true){
      initiateLoop()
    }
  // }
},[flashcard_obj])



// -------------------------------------------Shuffle and read the flashcards------------------------------------------------

const[shuffle_audio,setshuffle_audio]=useState(false)

// Stop the loop
const stop_shuffle=()=>{
  if (window.confirm("Do you want to stop the Shuffle?")) {
    stopSpeech()
    window.location.reload();
}
}

const toggleshuffleMute = () => {
  setmute(true);
  setshufflestate(true)
};

// Main-step
const prevShuffleState = useRef(shufflestate);

// useEffect to watch for changes in shuffleState
useEffect(() => {
  // Check if previous state was false and current state is true
  if (prevShuffleState.current === false && shufflestate === true) {
    // Trigger your function here
    initiateshuffle()
  }
  // Update the previous state reference
  prevShuffleState.current = shufflestate;
}, [shufflestate]);


const initiateshuffle = () => {
  // console.log("Flashcard rendered index",flashcardsindex)
  // console.log("Flashcard rendered object term",flashcard_obj.term)
  // console.log("Flashcard rendered object definition",flashcard_obj.definition)
  handleSpeechButtonClick_shuffle();
};
// Step1

const handleSpeechButtonClick_shuffle = () => {

  // if (speaking) {
  //   stopSpeech();
  // } else {
    textToSpeech_shuffle();
  // }
  // setSpeaking(!speaking);
};

// Step2
  // -----------------------------Speech 1----------------------------------------------
  const textToSpeech_shuffle = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = document.getElementById('paratext3').textContent;

      // Set selected voice
      if (selectedVoice) {
        speech.voice = selectedVoice;
      }
       //To Decrease speech speed
    speech.rate = 0.6; // Adjust this value to decrease the speed further if needed
    // Increase volume
    speech.volume = mute ? 0:5;

      window.speechSynthesis.speak(speech);
      speech.onend=()=>{
        handleClick_shuffle()
      }
    } else {
      console.error('Speech synthesis not supported in your browser.');
    }
  };

  const stopSpeech_shuffle = () => {
    window.speechSynthesis.cancel();
  };

// Step3

const handleClick_shuffle = () => {
  // e.preventDefault();
  setIsFlipped(!isFlipped);
  handleSpeechButtonClick2_shuffle();
  // console.log("Flashcardindex counttt",flashcardsindex1);
};

// Step4
const handleSpeechButtonClick2_shuffle = () => {
  // if (speaking2) {
  //   stopSpeech2();
  // } else {
    textToSpeech2_shuffle();
  // }
  // setSpeaking2(!speaking2);
};

// Step5
//  ----------------------------Speech 2
const textToSpeech2_shuffle = () => {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = document.getElementById('paratext4').textContent;

    // Set selected voice
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }

  speech.rate = 0.6;

  // Increase volume
  speech.volume = mute ? 0:5;

    window.speechSynthesis.speak(speech);
    speech.onend=()=>{
      studyFlashcardnew_shuffle()
    }
  
  } else {
    console.error('Speech synthesis not supported in your browser.');
  }
};

// const stopSpeech2 = () => {
//   window.speechSynthesis.cancel();
// };

// Step6

const studyFlashcardnew_shuffle = () => {
  // console.log("Called-flashcardsindex", flashcardsindex1);
  // console.log("before-count3", count3);
  const randomIndex = Math.floor(Math.random() * flashcards.length);
  // console.log("Random number",randomIndex)
  if(randomIndex!=0 && randomIndex==flashcardsindex1){
    setFlashcardsindex1(randomIndex-1)
  }
  else if(randomIndex==0 && randomIndex==flashcardsindex1){
    setFlashcardsindex1(randomIndex+1);
  }
  else{
    setFlashcardsindex1(randomIndex)
  }
  setIsFlipped(false);
};

useEffect(()=>{
    updateFlashcard_shuffle(flashcardsindex1)

},[flashcardsindex1])

const updateFlashcard_shuffle = (index) => {
  setflashcard_obj_shuffle(flashcards[index]);
  // console.log("Flashcard rendered index", index);
}

useEffect(()=>{
  // if(flashcardsindex<flashcards.length){
    // console.log("flashcards updated index",flashcardsindex1)
    // console.log("ffalsh objectttttttt",flashcard_obj_shuffle)
    // setflashcard_obj(flashcards[flashcardsindex])
    if(shufflestate==true){
      initiateshuffle()
    }
  // }
},[flashcard_obj_shuffle])


  const handleVoiceChange = (event) => {
    const selectedVoiceIndex = event.target.value;
    setSelectedVoice(voices[selectedVoiceIndex]);
  };

// -----------------------------------------------Text to Speech functionality end-------------------------------------------


// ------------------------------------------------Repeat flashcard functionality------------------------------------------------
// Stop the loop
const stop_repeat=()=>{
  if (window.confirm("Do you want to stop the repeat?")) {
    stopSpeech()
    window.location.reload();
}
}

const[repeat_audio,setrepeat_audio]=useState(false)
const togglerepeatMute2 = () => {
  setmute(true);
  setrepeatstate(true)
};
// Main-step

const prevRepeatState = useRef(repeatstate);

// useEffect to watch for changes in shuffleState
useEffect(() => {
  // Check if previous state was false and current state is true
  if (prevRepeatState.current === false && repeatstate === true) {
    // Trigger your function here
    initiaterepeat()
  }
  // Update the previous state reference
  prevRepeatState.current = repeatstate;
}, [repeatstate]);


const initiaterepeat = () => {
  // console.log("Flashcard rendered index",flashcardsindex)
  // console.log("Flashcard rendered object term",flashcard_obj.term)
  // console.log("Flashcard rendered object definition",flashcard_obj.definition)
  handleSpeechButtonClick_repeat();
};
// Step1

const handleSpeechButtonClick_repeat = () => {

  // if (speaking) {
  //   stopSpeech();
  // } else {
    textToSpeech_repeat();
  // }
  // setSpeaking(!speaking);
};

// Step2
  // -----------------------------Speech 1----------------------------------------------
  const textToSpeech_repeat = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = document.getElementById('paratext5').textContent;

      // Set selected voice
      if (selectedVoice) {
        speech.voice = selectedVoice;
      }
       //To Decrease speech speed
    speech.rate = 0.6; // Adjust this value to decrease the speed further if needed
    // Increase volume
    speech.volume = mute ? 0:5;


      window.speechSynthesis.speak(speech);
      speech.onend=()=>{
        handleClick_repeat()
      }
    } else {
      console.error('Speech synthesis not supported in your browser.');
    }
  };

  const stopSpeech_repeat = () => {
    window.speechSynthesis.cancel();
  };

// Step3
const handleClick_repeat = () => {
  // e.preventDefault();
  setIsFlipped(!isFlipped);
  handleSpeechButtonClick2_repeat();
  // console.log("Flashcardindex counttt",flashcardsindex);
};

// Step4
const handleSpeechButtonClick2_repeat = () => {
  // if (speaking2) {
  //   stopSpeech2();
  // } else {
    textToSpeech2_repeat();
  // }
  // setSpeaking2(!speaking2);
};

const toggleMute = () => {
  setmute(!mute);
};

// Step5
//  ----------------------------Speech 2
const textToSpeech2_repeat = () => {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = document.getElementById('paratext6').textContent;

    // Set selected voice
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }

  speech.rate = 0.6;

  // Increase volume
  speech.volume = mute ? 0:5;


    window.speechSynthesis.speak(speech);
    speech.onend=()=>{
      studyFlashcardnew_repeat()
    }
  
  } else {
    console.error('Speech synthesis not supported in your browser.');
  }
};

// const stopSpeech2 = () => {
//   window.speechSynthesis.cancel();
// };

// Step6

const studyFlashcardnew_repeat = () => {
  // console.log("Called-flashcardsindex", flashcardsindex);
  // console.log("before-count3", count3);
  setIsFlipped(false);
  initiaterepeat()
};

useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  // Cleanup function to destroy tooltips when the component unmounts
  return () => {
    tooltipList.forEach((tooltip) => {
      tooltip.dispose();
    });
  };
}, []);




  return (
    <div className='d-flex'>
        <Mainsidebar/>
        <div onClick={()=>{
            setcourse_visible(false)
            setgroup_visible(false)
            setstudylist_visible(false)
          }} className="w-100 pt-5 mt-2 bg-light main-division d-flex flex-column align-items-center px-3 px-lg-0">
            <Navbar/>
            <div className="container" onClick={()=>{
              setnavbar_dropdown_visible(false)
            }}>

    
{/* -----------------------------------------------DISPLAY FLASHCARDS-------------------------------------------------- */}
<div className="container" id='matchflashcard'>
<div className='row m-0 mt-5 d-flex justify-content-center bg-light pb-4'>
            <div style={{position:'relative'}} className="col-md-9 bg-white rounded shadow-sm mb-3 mb-lg-0 d-flex align-items-center py-4 px-4">
            <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 250 }}
      overlay={renderTooltip3(flashsetdata.name)}
    >
              <span style={{fontSize:'18px',fontWeight:500,cursor:'pointer'}}>Name : <span style={{color:'#FF845D'}}>{flashsetdata.name && flashsetdata.name.slice(0,8)} <span className={`${flashsetdata.name && flashsetdata.name.length>8 ? '':'d-none'}`}>...</span></span></span>
</OverlayTrigger>
                <p className={`m-0 mx-auto ${shufflestate ? 'd-none':''}`} style={{fontSize:'32px',lineHeight:'26px',fontWeight:500,lineHeight:'0.64px'}}> <span style={{color:'#21b3a9'}}>{flashcardsindex+1}</span> / {flashcardslength}</p>
                <p className={`m-0 mx-auto ${shufflestate ? '':'d-none'}`} style={{fontSize:'32px',lineHeight:'26px',fontWeight:500,lineHeight:'0.64px'}}> <span style={{color:'#21b3a9'}}>{flashcardsindex1+1}</span> / {flashcardslength}</p>
                <span className='ms-auto' style={{cursor:'pointer'}} onClick={()=>{
                  setDropdownstate(!dropdownstate)
                }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
</svg></span>
<div className={`bg-white border rounded p-2 ${dropdownstate ? '':'d-none'}`} style={{position:'absolute',right:'6%'}}>
  <span className='d-block border-bottom pb-1' style={{cursor:'pointer'}} onClick={()=>{
    fetchBookmarkedflashcards()
  }}>Bookmarked Flashcards</span>
   <span className='pt-1' style={{cursor:'pointer'}} onClick={()=>{
    setDropdownstate(false)
    getflashcards()
  }}>All Flashcards</span>

</div>
            </div>

{/* -----------------------------------------------Display Flashcrds layout section------------------------------------ */}
<div className='d-flex flex-column align-items-center' style={{position:'relative',height:'370px'}}>
<div className="col-md-7 bg-white mt-3 rounded" style={{height:'323px',position:'absolute',top:'40px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
</div>
<div className="col-md-8 bg-white mt-3 rounded" style={{height:'323px',position:'absolute',top:'20px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
</div>
<div className="col-md-9 bg-transparent mt-3 rounded" style={{height:'323px',position:'absolute'}}>
<div className="" style={{position:'relative'}}>

{/* ---------------------------------------------------Move to next flashcard button------------------------------------ */}
              <button className='btn rounded-circle d-flex align-items-center justify-content-center' style={{backgroundColor:'#f5f5f5',border:'0.5px solid #5D5FE3',position:'absolute',right:'-10px',zIndex:4,top:'50%',height:'35px',width:'35px'}} onClick={movetonextflashcard}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
</svg></button>

{/* --------------------------------------------------Move to previous flashcard button---------------------------------- */}
<button className='btn rounded-circle d-flex align-items-center justify-content-center' style={{backgroundColor:'#f5f5f5',border:'0.5px solid #5D5FE3',position:'absolute',left:'-10px',zIndex:4,top:'50%',height:'35px',width:'35px'}} onClick={movetopreviousflashcard}>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
</svg></button>

<div className={`${shufflestate || repeatstate ? 'd-none':''}`}>
<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
  <div className='w-100 d-flex flex-column align-items-center bg-white rounded' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
  <div className='text-center mt-3'>
       
                </div>
                <div className='mt-5 pt-4 px-1 px-md-5'>
      {flashcard_obj && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext'>
    {flashcard_obj.term}
    </p>
)}
      </div>
      <button className='mt-5 pt-5 mb-4 d-flex align-items-center btn bg-transparent border-0 fw-bold' style={{color:'#5d5fe3'}} onClick={()=>{
        setIsFlipped((prev)=>!prev)
      }}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M10.4998 20.3957C8.25758 20.3957 6.2517 19.7213 4.48221 18.3724C2.71271 17.0236 1.54284 15.2675 0.972598 13.104H2.02627C2.59252 14.9844 3.65556 16.4961 5.21538 17.6393C6.77521 18.7824 8.53669 19.354 10.4998 19.354C12.2466 19.354 13.8358 18.8682 15.2675 17.8967C16.6991 16.9251 17.8396 15.6748 18.6889 14.1457H15.1873V13.104H20.3957V18.3123H19.354V15.0271C18.4045 16.627 17.1572 17.9217 15.612 18.9113C14.0669 19.9009 12.3628 20.3957 10.4998 20.3957ZM10.4998 12.5832C9.91223 12.5832 9.41811 12.3828 9.01747 11.9822C8.61683 11.5816 8.4165 11.0874 8.4165 10.4998C8.4165 9.91223 8.61683 9.41811 9.01747 9.01747C9.41811 8.61683 9.91223 8.4165 10.4998 8.4165C11.0874 8.4165 11.5816 8.61683 11.9822 9.01747C12.3828 9.41811 12.5832 9.91223 12.5832 10.4998C12.5832 11.0874 12.3828 11.5816 11.9822 11.9822C11.5816 12.3828 11.0874 12.5832 10.4998 12.5832ZM0.604004 7.89567V2.68734H1.64567V5.97257C2.59518 4.37269 3.84251 3.07796 5.38765 2.08838C6.93279 1.0988 8.63685 0.604004 10.4998 0.604004C12.7421 0.604004 14.748 1.27841 16.5175 2.62723C18.287 3.97607 19.4568 5.73222 20.0271 7.89567H18.9734C18.4072 6.01532 17.3441 4.50357 15.7843 3.36041C14.2245 2.21725 12.463 1.64567 10.4998 1.64567C8.75305 1.64567 7.16384 2.13145 5.73221 3.10301C4.30059 4.07456 3.16011 5.32489 2.31075 6.854H5.81234V7.89567H0.604004Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>Flip</span></button>
  </div>

{/* Back side div */}
<div className='w-100 d-flex flex-column align-items-center bg-secondary-subtle rounded' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
<div className='text-center mt-3'>

                </div>

                <div className='mt-5 pt-4 px-1 px-md-5'>
      {flashcard_obj && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext1'>{flashcard_obj.definition}</p>
)}
      </div>

      <button className='mt-5 pt-5 mb-4 d-flex align-items-center btn bg-transparent border-0 fw-bold' style={{color:'#5d5fe3'}} onClick={()=>{
        setIsFlipped((prev)=>!prev)
      }}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M10.4998 20.3957C8.25758 20.3957 6.2517 19.7213 4.48221 18.3724C2.71271 17.0236 1.54284 15.2675 0.972598 13.104H2.02627C2.59252 14.9844 3.65556 16.4961 5.21538 17.6393C6.77521 18.7824 8.53669 19.354 10.4998 19.354C12.2466 19.354 13.8358 18.8682 15.2675 17.8967C16.6991 16.9251 17.8396 15.6748 18.6889 14.1457H15.1873V13.104H20.3957V18.3123H19.354V15.0271C18.4045 16.627 17.1572 17.9217 15.612 18.9113C14.0669 19.9009 12.3628 20.3957 10.4998 20.3957ZM10.4998 12.5832C9.91223 12.5832 9.41811 12.3828 9.01747 11.9822C8.61683 11.5816 8.4165 11.0874 8.4165 10.4998C8.4165 9.91223 8.61683 9.41811 9.01747 9.01747C9.41811 8.61683 9.91223 8.4165 10.4998 8.4165C11.0874 8.4165 11.5816 8.61683 11.9822 9.01747C12.3828 9.41811 12.5832 9.91223 12.5832 10.4998C12.5832 11.0874 12.3828 11.5816 11.9822 11.9822C11.5816 12.3828 11.0874 12.5832 10.4998 12.5832ZM0.604004 7.89567V2.68734H1.64567V5.97257C2.59518 4.37269 3.84251 3.07796 5.38765 2.08838C6.93279 1.0988 8.63685 0.604004 10.4998 0.604004C12.7421 0.604004 14.748 1.27841 16.5175 2.62723C18.287 3.97607 19.4568 5.73222 20.0271 7.89567H18.9734C18.4072 6.01532 17.3441 4.50357 15.7843 3.36041C14.2245 2.21725 12.463 1.64567 10.4998 1.64567C8.75305 1.64567 7.16384 2.13145 5.73221 3.10301C4.30059 4.07456 3.16011 5.32489 2.31075 6.854H5.81234V7.89567H0.604004Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>Flip</span></button>
</div>

    </ReactCardFlip>
</div>

{/* ----------------------------------------------------Shuffle flip card------------------------------------------------ */}

<div className={`${shufflestate ? '':'d-none'}`}>
<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" >
  <div className='w-100 d-flex flex-column align-items-center bg-white rounded' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
  <div className='text-center mt-3'>
                {/* <button className='bg-transparent border-0 btn btn-sm fs-5' style={{color:'#ff845d'}} onClick={handleSpeechButtonClick_shuffle}> */}
                  {/* <svg className={`${speaking ? 'd-none':''}`} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M27.9213 31.6121L23.5379 27.2286C23.1359 27.4867 22.7162 27.7134 22.2787 27.9087C21.8412 28.1041 21.3887 28.2775 20.9213 28.429V26.8977C21.2055 26.7949 21.4789 26.6874 21.7416 26.5752C22.0043 26.463 22.2534 26.3312 22.489 26.1798L16.8829 20.5736V25.6329L11.6665 20.4165H6.67452V14.5832H10.8925L3.78027 7.47103L4.81234 6.43896L28.9534 30.58L27.9213 31.6121ZM26.7883 24.3035L25.7675 23.2827C26.3676 22.4545 26.8318 21.5477 27.1599 20.5624C27.488 19.5771 27.6521 18.5441 27.6521 17.4634C27.6521 15.3283 27.0351 13.3988 25.8011 11.675C24.5671 9.95114 22.9405 8.73587 20.9213 8.02913V6.49784C23.3556 7.2719 25.329 8.66154 26.8416 10.6667C28.3541 12.672 29.1104 14.9375 29.1104 17.4634C29.1104 18.7329 28.9062 19.9491 28.4976 21.1121C28.0891 22.275 27.5193 23.3388 26.7883 24.3035ZM22.7442 20.2595L20.9213 18.4366V12.6032C21.7458 13.138 22.3726 13.8419 22.8017 14.715C23.2308 15.5881 23.4454 16.5164 23.4454 17.4999C23.4454 17.9953 23.3869 18.4754 23.2701 18.94C23.1532 19.4046 22.9779 19.8444 22.7442 20.2595ZM16.8829 14.3981L14.3812 11.8685L16.8829 9.36682V14.3981ZM15.4245 22.0936V19.1153L12.3508 16.0415H8.13285V18.9582H12.2891L15.4245 22.0936Z" fill="#FF845D"/>
</svg> */}
{/* <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
  <path d="M20.529 28.4292V26.8979C22.5483 26.1912 24.1749 24.9759 25.4088 23.2521C26.6428 21.5283 27.2598 19.5988 27.2598 17.4636C27.2598 15.3285 26.6428 13.399 25.4088 11.6752C24.1749 9.95134 22.5483 8.73607 20.529 8.02933V6.49805C22.9447 7.27211 24.9134 8.66174 26.4353 10.6669C27.9572 12.6722 28.7182 14.9377 28.7182 17.4636C28.7182 19.9895 27.9572 22.2551 26.4353 24.2603C24.9134 26.2655 22.9447 27.6551 20.529 28.4292ZM6.28223 20.4167V14.5834H11.2742L16.4906 9.36703V25.6331L11.2742 20.4167H6.28223ZM20.529 22.3238V12.6034C21.3536 13.1382 21.9804 13.8421 22.4095 14.7152C22.8386 15.5883 23.0531 16.5166 23.0531 17.5001C23.0531 18.4779 22.8339 19.3926 22.3954 20.2443C21.957 21.0959 21.3349 21.7891 20.529 22.3238ZM15.0323 12.9063L11.8968 16.0417H7.7406V18.9584H11.8968L15.0323 22.0938V12.9063Z" fill="#FF845D"/>
</svg>
</button> */}
                </div>
                <div className='mt-5 px-1 px-md-5'>
      {flashcard_obj_shuffle && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext3'>
    {flashcard_obj_shuffle.term}
    </p>
)}
      </div>
  </div>

{/* Back side div */}
<div className='w-100 d-flex flex-column align-items-center bg-secondary-subtle' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
<div className='text-center mt-3'>
                
                </div>

                <div className='mt-5 px-1 px-md-5'>
      {flashcard_obj_shuffle && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext4'>{flashcard_obj_shuffle.definition}</p>
)}
      </div>

</div>

    </ReactCardFlip>
</div>


{/* -------------------------------------------------Repeat flashcard----------------------------------------------------- */}

<div className={`${repeatstate ? '':'d-none'}`}>
<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" >
  <div className='w-100 d-flex flex-column align-items-center bg-white rounded' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
  <div className='text-center mt-3'>
               
                </div>
                <div className='mt-5 px-1 px-md-5'>
      {flashcard_obj_repeat && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext5'>
    {flashcard_obj_repeat.term}
    </p>
)}
      </div>
      <button className='mt-4 pt-5 mb-4 d-flex align-items-center btn bg-transparent border-0 fw-bold' style={{color:'#5d5fe3'}} onClick={()=>{
        setIsFlipped((prev)=>!prev)
      }}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M10.4998 20.3957C8.25758 20.3957 6.2517 19.7213 4.48221 18.3724C2.71271 17.0236 1.54284 15.2675 0.972598 13.104H2.02627C2.59252 14.9844 3.65556 16.4961 5.21538 17.6393C6.77521 18.7824 8.53669 19.354 10.4998 19.354C12.2466 19.354 13.8358 18.8682 15.2675 17.8967C16.6991 16.9251 17.8396 15.6748 18.6889 14.1457H15.1873V13.104H20.3957V18.3123H19.354V15.0271C18.4045 16.627 17.1572 17.9217 15.612 18.9113C14.0669 19.9009 12.3628 20.3957 10.4998 20.3957ZM10.4998 12.5832C9.91223 12.5832 9.41811 12.3828 9.01747 11.9822C8.61683 11.5816 8.4165 11.0874 8.4165 10.4998C8.4165 9.91223 8.61683 9.41811 9.01747 9.01747C9.41811 8.61683 9.91223 8.4165 10.4998 8.4165C11.0874 8.4165 11.5816 8.61683 11.9822 9.01747C12.3828 9.41811 12.5832 9.91223 12.5832 10.4998C12.5832 11.0874 12.3828 11.5816 11.9822 11.9822C11.5816 12.3828 11.0874 12.5832 10.4998 12.5832ZM0.604004 7.89567V2.68734H1.64567V5.97257C2.59518 4.37269 3.84251 3.07796 5.38765 2.08838C6.93279 1.0988 8.63685 0.604004 10.4998 0.604004C12.7421 0.604004 14.748 1.27841 16.5175 2.62723C18.287 3.97607 19.4568 5.73222 20.0271 7.89567H18.9734C18.4072 6.01532 17.3441 4.50357 15.7843 3.36041C14.2245 2.21725 12.463 1.64567 10.4998 1.64567C8.75305 1.64567 7.16384 2.13145 5.73221 3.10301C4.30059 4.07456 3.16011 5.32489 2.31075 6.854H5.81234V7.89567H0.604004Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>Flip</span></button>
  </div>

{/* Back side div */}
<div className='w-100 d-flex flex-column align-items-center bg-secondary-subtle' style={{height:'323px',boxShadow:'0px 5px 3px 0px rgba(0, 0, 0, 0.07)'}}>
<div className='text-center mt-3'>
               
                </div>

                <div className='mt-5 px-1 px-md-5'>
      {flashcard_obj_repeat && (
  <p className='border-0 outline-0' style={{fontSize:'16px',fontWeight:450,letterSpacing:'0.32px',lineHeight:''}} id='paratext6'>{flashcard_obj_repeat.definition}</p>
)}
      </div>

      <button className='mt-4 pt-5 mb-4 d-flex align-items-center btn bg-transparent border-0 fw-bold' style={{color:'#5d5fe3'}} onClick={()=>{
        setIsFlipped((prev)=>!prev)
      }}><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M10.4998 20.3957C8.25758 20.3957 6.2517 19.7213 4.48221 18.3724C2.71271 17.0236 1.54284 15.2675 0.972598 13.104H2.02627C2.59252 14.9844 3.65556 16.4961 5.21538 17.6393C6.77521 18.7824 8.53669 19.354 10.4998 19.354C12.2466 19.354 13.8358 18.8682 15.2675 17.8967C16.6991 16.9251 17.8396 15.6748 18.6889 14.1457H15.1873V13.104H20.3957V18.3123H19.354V15.0271C18.4045 16.627 17.1572 17.9217 15.612 18.9113C14.0669 19.9009 12.3628 20.3957 10.4998 20.3957ZM10.4998 12.5832C9.91223 12.5832 9.41811 12.3828 9.01747 11.9822C8.61683 11.5816 8.4165 11.0874 8.4165 10.4998C8.4165 9.91223 8.61683 9.41811 9.01747 9.01747C9.41811 8.61683 9.91223 8.4165 10.4998 8.4165C11.0874 8.4165 11.5816 8.61683 11.9822 9.01747C12.3828 9.41811 12.5832 9.91223 12.5832 10.4998C12.5832 11.0874 12.3828 11.5816 11.9822 11.9822C11.5816 12.3828 11.0874 12.5832 10.4998 12.5832ZM0.604004 7.89567V2.68734H1.64567V5.97257C2.59518 4.37269 3.84251 3.07796 5.38765 2.08838C6.93279 1.0988 8.63685 0.604004 10.4998 0.604004C12.7421 0.604004 14.748 1.27841 16.5175 2.62723C18.287 3.97607 19.4568 5.73222 20.0271 7.89567H18.9734C18.4072 6.01532 17.3441 4.50357 15.7843 3.36041C14.2245 2.21725 12.463 1.64567 10.4998 1.64567C8.75305 1.64567 7.16384 2.13145 5.73221 3.10301C4.30059 4.07456 3.16011 5.32489 2.31075 6.854H5.81234V7.89567H0.604004Z" fill="#5D5FE3"/>
</svg> <span className='ms-2'>Flip</span></button>
</div>

    </ReactCardFlip>
</div>

            </div>
</div>
</div>


{/* ----------------------------------------------Read buttons layout--------------------------------------------------- */}
            <div className="col-md-6 mt-3 py-3 pb-5">
            <div className='d-flex justify-content-evenly'>

{/* Start shuffle button */}
                <button data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Play in Shuffle" className={`border-0 rounded-circle text-white ${shufflestate ? 'd-none':''}`} style={{backgroundColor:"#21B3A9",height:'45px',width:'45px'}} onClick={()=>{
                 if(loopstate==true){
                  if(window.confirm("Stop the loop and then click and play in Shuffle mode")){
                stopSpeech()
                    window.location.reload()
                  }
                 }
                 else if(repeatstate==true){
                  if(window.confirm("Stop the repeat and then click and play in shuffle mode")){
                stopSpeech()
                    window.location.reload()
                  }
                 }
                 else{
                  setshuffle_audio(true)
                 }
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-shuffle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
                <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
              </svg></button>
              <button className={`rounded-circle text-white animate__animated animate__tada animate__infinite	infinite ${shufflestate ? '':'d-none'}`} style={{backgroundColor:"#21B3A9",height:'45px',width:'45px',border:'2px solid green'}} onClick={()=>{
                 stop_shuffle()
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-shuffle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
                <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
              </svg></button>

{/* Start Loop button */}
                <button data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Play in Loop" className={`text-white rounded-circle ${loopstate ? 'd-none':''}`} style={{backgroundColor:"#F4CD00",height:'45px',width:'45px',border:studyflashcardsstatus ? '4px solid green':'none'}} onClick={()=>{
                      if(shufflestate==true){
                        if(window.confirm("Stop the shuffle and then click and play in Loop mode")){
                          window.speechSynthesis.cancel();
                          window.location.reload()
                        }
                       }
                       else if(repeatstate==true){
                        if(window.confirm("Stop the repeat and then click and play in Loop mode")){
                          window.speechSynthesis.cancel();
                          window.location.reload()
                        }
                       }
                       else{
                        // setloopstate(true)
                        // initiateLoop()
                        setloop_audio(true)
                       }
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-repeat" viewBox="0 0 16 16">
                <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
              </svg></button>
              <button className={`text-white rounded-circle animate__animated animate__tada animate__infinite	infinite ${loopstate ? '':'d-none'}`} style={{backgroundColor:"#F4CD00",height:'45px',width:'45px',border:'1px solid green'}} onClick={()=>{
                // stopSpeech()
                 stop_loop()
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-repeat" viewBox="0 0 16 16">
                <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"/>
              </svg></button>

{/* To start the repeat */}

                <button data-bs-toggle="tooltip" data-bs-placement="top"
         data-bs-custom-class="custom-tooltip"
         data-bs-title="Play in Repeat" className={`border-0 text-white rounded-circle ${repeatstate ? 'd-none':''}`} style={{backgroundColor:"#FF845D",height:'45px',width:'45px'}} onClick={()=>{
               if(shufflestate==true){
                if(window.confirm("Stop the shuffle and then click and play in repeat mode")){
                stopSpeech()
                  window.location.reload()
                }
               }
               else if(loopstate==true){
                if(window.confirm("Stop the loop and then click and play in Repeat mode")){
                stopSpeech()
                  window.location.reload()
                }
               }
               else{
                // setrepeatstate(true)
                setrepeat_audio(true)
               }
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
              </svg></button>

              <button className={`text-white rounded-circle animate__animated animate__tada animate__infinite	infinite ${repeatstate ? '':'d-none'}`} style={{backgroundColor:"#FF845D",height:'45px',width:'45px',border:'1px solid green'}} onClick={()=>{
                // stopSpeech()
                stop_repeat()
                }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
              </svg></button>

              </div>
            </div>
            
            <div className="col-md-9 mt-5 py-2 border-top pt-4">
            <div className='d-flex'>
   <h6 style={{cursor:'pointer',fontSize:'13px'}} className={`border-primary fw-bold text-primary rounded-pill border py-2 px-3`} onClick={()=>{
    }}>Saved Flashsets</h6>
  </div>


{/* -----------------------------------------------Saved flashsets section---------------------------------------------- */}
<div className={`mt-3`}>
<div className='mt-3 px-2'>
  {savedflashsets.map((x)=>{
      return(
        <div className='shadow-sm mb-3 py-3 px-2 px-lg-0 rounded bg-white'>
          <div className="row m-0 align-items-center ps-3">
          <div className="col-2 col-lg-1 d-flex align-items-center justify-content-center rounded me-2" style={{overflow:'hidden',backgroundColor:'#CFF4D2',height:'100px',width:'100px',border:'0.5px solid #21B3A9'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<path d="M8.28125 41.2501L6.51042 40.5209C5.43403 40.0696 4.71354 39.2883 4.34896 38.1772C3.98438 37.0661 4.04514 35.9723 4.53125 34.8959L8.28125 26.7709V41.2501ZM16.6146 45.8334C15.4688 45.8334 14.4879 45.4255 13.6719 44.6095C12.8559 43.7935 12.4479 42.8126 12.4479 41.6668V29.1668L17.9688 44.4793C18.0729 44.7223 18.1771 44.9567 18.2813 45.1824C18.3854 45.4081 18.5243 45.6251 18.6979 45.8334H16.6146ZM27.3438 45.6251C26.2326 46.0418 25.1563 45.9897 24.1146 45.4689C23.0729 44.948 22.3438 44.1321 21.9271 43.0209L12.6563 17.6043C12.2396 16.4932 12.2743 15.4081 12.7604 14.3491C13.2465 13.29 14.0451 12.5696 15.1563 12.1876L30.8854 6.45844C31.9965 6.04178 33.0729 6.09386 34.1146 6.61469C35.1563 7.13553 35.8854 7.9515 36.3021 9.06261L45.5729 34.4793C45.9896 35.5904 45.9549 36.6755 45.4688 37.7345C44.9826 38.7935 44.184 39.514 43.0729 39.8959L27.3438 45.6251ZM22.8646 20.8334C23.4549 20.8334 23.9497 20.6338 24.349 20.2345C24.7483 19.8352 24.9479 19.3404 24.9479 18.7501C24.9479 18.1598 24.7483 17.665 24.349 17.2657C23.9497 16.8664 23.4549 16.6668 22.8646 16.6668C22.2743 16.6668 21.7795 16.8664 21.3802 17.2657C20.9809 17.665 20.7813 18.1598 20.7813 18.7501C20.7813 19.3404 20.9809 19.8352 21.3802 20.2345C21.7795 20.6338 22.2743 20.8334 22.8646 20.8334Z" fill="#21B3A9"/>
</svg>
          </div>
                      <div className="col-10 ps-0 col-lg-9 ms-md-0 d-flex flex-column justify-content-center ">
                       <div className="row m-0 border-bottom">
                        <div className='d-flex justify-content-between'>
                        <Link to={`/viewflashcard/${type}/${id}/${x.flashset_details.flashset_id}`} className='fw-bold' style={{color:'#2A3941'}}>{x.flashset_details.name}</Link>
                        <Link className='text-decoration-none' style={{color:'#5d5fe3'}} to={`/filterflashcard/${type}/${id}/${x.flashset_details.flashset_id}`}><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
  <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
</svg><span className='' style={{fontSize:"14px"}}>Play</span></Link>
                        </div>
                       <p className='mt-2' style={{fontSize:'14px',color:'#5D5FE3'}}>
                       <img src={x.flashset_details.profile_pic} width={28} height={28} className={`me-1 rounded-circle  ${x.flashset_details.profile_pic!=null ? '':'d-none'}`}/> 
                       {x.flashset_details.nickname !=undefined ? (<span className={`rounded-circle bg-warning text-white p-1 ${x.flashset_details.profile_pic!=null ? 'd-none':''}`} style={{height:'30px',width:'30px'}}>{x.flashset_details.nickname.slice(0,1)}{x.flashset_details.nickname.slice(-1)}</span>):(<></>)}
                         <span className='ms-1'>{x.flashset_details.nickname} <span className='ms-1 text-secondary'>{x.flashset_details.time_since_created}</span></span></p>
                      </div>        
                      <div className="m-0 d-flex align-items-center mt-2">
    
      <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M18.1891 20.8335H7.73237V9.37514L14.2628 2.9248L14.7236 3.38556C14.8184 3.48037 14.8982 3.6019 14.9629 3.75014C15.0277 3.89837 15.0601 4.03459 15.0601 4.15879V4.32306L13.9944 9.37514H21.234C21.6693 9.37514 22.0586 9.54675 22.4018 9.88996C22.7451 10.2332 22.9167 10.6225 22.9167 11.0578V12.3399C22.9167 12.4347 22.906 12.5382 22.8846 12.6504C22.8633 12.7626 22.8352 12.8661 22.8005 12.9609L19.9559 19.7037C19.813 20.0242 19.5727 20.2926 19.2348 20.509C18.8969 20.7253 18.5483 20.8335 18.1891 20.8335ZM8.77404 19.7918H18.1891C18.336 19.7918 18.4862 19.7518 18.6398 19.6716C18.7934 19.5915 18.9103 19.4579 18.9904 19.271L21.875 12.5001V11.0578C21.875 10.8709 21.8149 10.7173 21.6947 10.5971C21.5745 10.4769 21.4209 10.4168 21.234 10.4168H12.7003L13.9062 4.7277L8.77404 9.81986V19.7918ZM7.73237 9.37514V10.4168H4.16667V19.7918H7.73237V20.8335H3.125V9.37514H7.73237Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashset_details.upvote_count} <span className='d-lg-inline d-none'>Likes</span></span></span>
    <span  style={{fontSize:'14px',color:'#AAB0B0'}}  className='ms-3 d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M4.50111 21.146L4.29678 21.0618C3.74524 20.8228 3.37498 20.4255 3.186 19.8699C2.99703 19.3144 3.02407 18.7742 3.26712 18.2493L4.50111 15.5891V21.146ZM9.46905 22.7966C8.89613 22.7966 8.40568 22.5926 7.9977 22.1846C7.58971 21.7766 7.38572 21.2862 7.38572 20.7133V16.5867L9.38494 22.1195C9.43702 22.2544 9.4891 22.3749 9.54119 22.4811C9.59327 22.5873 9.66271 22.6924 9.74952 22.7966H9.46905ZM13.5115 21.8511C13.2364 21.966 12.9653 21.9499 12.6982 21.803C12.4311 21.6561 12.2402 21.4384 12.1253 21.15L7.48988 8.44164C7.37504 8.16654 7.38573 7.89444 7.52194 7.62534C7.65816 7.35622 7.86382 7.16625 8.13892 7.05542L16.0035 4.19083C16.2786 4.07597 16.5431 4.092 16.7968 4.23891C17.0505 4.38582 17.2348 4.6035 17.3497 4.89195L21.9851 17.5602C22.0999 17.8487 22.0993 18.1308 21.9831 18.4066C21.8669 18.6824 21.6646 18.8757 21.3761 18.9865L13.5115 21.8511ZM11.6325 10.4168C11.9277 10.4168 12.175 10.317 12.3747 10.1173C12.5744 9.91767 12.6742 9.67027 12.6742 9.37513C12.6742 9.07999 12.5744 8.8326 12.3747 8.63294C12.175 8.43329 11.9277 8.33346 11.6325 8.33346C11.3374 8.33346 11.09 8.43329 10.8903 8.63294C10.6907 8.8326 10.5908 9.07999 10.5908 9.37513C10.5908 9.67027 10.6907 9.91767 10.8903 10.1173C11.09 10.317 11.3374 10.4168 11.6325 10.4168ZM13.1429 20.8335L21.0075 17.9689L16.3721 5.20846L8.50751 8.07305L13.1429 20.8335Z" fill="#8E9696"/>
</svg> <span className='ms-2'>{x.flashset_details.flashcards_count} <span className='d-lg-inline d-none'>Flashcards</span></span></span>

</div>
                     
                      </div>      
                  </div>
                  
        </div>
      )
    })}
  </div>
</div>
</div>
</div>

</div>
            </div>

        </div>

{/* SHUFFLE AUDIO MODAL LAYOUT */}
<div className={`${shuffle_audio ? '':'d-none'}`} style={{backgroundColor:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed',top:0,left:0,zIndex:10}}>
<div className='mx-auto bg-white w-50 p-3 rounded mt-3'>
  <p className='text-center'>Do you want Audio for Flashcard ?</p>
  <div className='text-end'>
    <button className='btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      setshufflestate(true)
      setshuffle_audio(false)
    }}>Yes</button>
     <button className='ms-3 btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      toggleshuffleMute()
      setshuffle_audio(false)
    }}>No</button>
  </div>
</div>
</div>


{/*  AUDIO MODAL LAYOUT */}
<div className={`${loop_audio ? '':'d-none'}`} style={{backgroundColor:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed',top:0,left:0,zIndex:10}}>
<div className='mx-auto bg-white w-50 p-3 rounded mt-3'>
  <p className='text-center'>Do you want Audio for Flashcard ?</p>
  <div className='text-end'>
    <button className='btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      setloopstate(true)
      setloop_audio(false)
    }}>Yes</button>
     <button className='ms-3 btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      togglerepeatMute()
      setloop_audio(false)
    }}>No</button>
  </div>
</div>
</div>

{/* REPEAT AUDIO MODAL LAYOUT */}
<div className={`${repeat_audio ? '':'d-none'}`} style={{backgroundColor:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed',top:0,left:0,zIndex:10}}>
<div className='mx-auto bg-white w-50 p-3 rounded mt-3'>
  <p className='text-center'>Do you want Audio for Flashcard ?</p>
  <div className='text-end'>
    <button className='btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      setrepeatstate(true)
      setrepeat_audio(false)
    }}>Yes</button>
     <button className='ms-3 btn btn-sm text-white px-3' style={{backgroundColor:'#5d5fe3'}} onClick={()=>{
      togglerepeatMute2()
      setrepeat_audio(false)
    }}>No</button>
  </div>
</div>
</div>
<Backtotop/>
    </div>
  )
}

export default Filterflashcard