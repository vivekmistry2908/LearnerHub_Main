import React, { useState, useEffect } from 'react'
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import './pdf.css'

import ReactCardFlip from 'react-card-flip';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Uploadpage from './pages/Uploadpage.jsx';
import Documents from './pages/Documents.jsx';
import Showpdfpage from './pages/Showpdfpage.jsx';
import Courses from './pages/Courses.jsx';
import Protect from './pages/Protect.jsx';
import Profile from './pages/Profile.jsx';
import Subjects from './pages/Subjects.jsx';
import Flashcard from './pages/Flashcard.jsx';
import Rewards from './pages/Rewards.jsx';
import Groups from './pages/Groups.jsx';
import Groupchat from './pages/Groupchat.jsx';
import Viewflashcard from './pages/Viewflashcard.jsx';
import FlashSet from './pages/FlashSet.jsx';
import Matchflashcard from './pages/Matchflashcard.jsx';
import Translatedpdf from './pages/Translatedpdf.jsx';
import Filterflashcard from './pages/Filterflashcard.jsx';
import Studylist from './pages/Studylist.jsx';
import Loginpage from './pages/Login/Loginpage.jsx';
import Signuppage from './pages/Signup/Signuppage.jsx'; //Flow The Folder structure
import UserFiles from './pages/UserFiles.jsx';
import Adddetails from './pages/Adddetails.jsx';
import Opengroups from './pages/Opengroups.jsx';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Addsubjects from './pages/Addsubjects.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Preloader from './pages/Preloader.jsx';
import Group_document_upload from './pages/Group_document_upload.jsx';
import Navbar from './components/Navbar.jsx';
import Forgot_password_page from './pages/Forgot_password_page.jsx';
import Extracted_text from './pages/Extracted_text.jsx';
import Add_additional_flashcards from './pages/Add_additional_flashcards.jsx';
import Flashcard_studylist from './pages/Flashcard_studylist.jsx';
import Group_flashcard from './pages/Group_flashcard.jsx';
import Shared_document_page from './pages/Shared_document_page.jsx';
import Protect1 from './pages/Protect1.jsx';
import Landing_page from './Landing_pages/Landing_page.jsx';
// import Landing_page2 from './Landing_pages/Landing_page2.jsx';
// import Landing_page3 from './Landing_pages/Landing_page3.jsx';
// import Landing_page4 from './Landing_pages/Landing_page4.jsx';
// import Landing_page5 from './Landing_pages/Landing_page5.jsx';
// import Landing_page6 from './Landing_pages/Landing_page6.jsx';
import Footer from './Landing_pages/Footer.jsx';
import Contact_us from './Landing_pages/Contact_us.jsx';
import Our_team from './Landing_pages/Our_team.jsx';
import { ToastContainer } from 'react-toastify';
import FAQ from './Landing_pages/FAQ.jsx';
import Error from './Landing_pages/Error.jsx';
import Stories from './Landing_pages/Stories.jsx';
import Support from './Landing_pages/Support.jsx';
import Privacy_policy from './Landing_pages/Privacy_policy.jsx';
import Terms_of_use from './Landing_pages/Terms_of_use.jsx';
import Community_page from './Landing_pages/Community_page.jsx';
import Users_page from './Admin_panel/Users_page.jsx';
import University_details from './Admin_panel/University_details.jsx';
import Admin_course from './Admin_panel/Admin_course.jsx';
import History from './Admin_panel/History.jsx';
import Admin_documents from './Admin_panel/Admin_documents.jsx';
import Admin_report from './Admin_panel/Admin_report.jsx';
import Specific_report_page from './Admin_panel/Specific_report_page.jsx';
import Comment_report from './Admin_panel/Comment_report.jsx';
import Admin_Loginpage from './Admin_panel/Admin_login.jsx';
import Sales_team from './Landing_pages/Sales_team.jsx';
import Pending_data from './Admin_panel/Pending_data.jsx';
import Help_request from './Admin_panel/Help_request.jsx';
import ScrollToTop from './Landing_pages/Scroll_to_top.jsx';
import Getting_started from './Landing_pages/Getting_started.jsx';
import Product_guidelines from './Landing_pages/Product_guidelines.jsx';
import Best_practices from './Landing_pages/Best_practices.jsx';
import Videos from './Landing_pages/Videos.jsx';
import OTPValidationForm from './pages/Paste.jsx';
import Login_message from './pages/Login_message.jsx';
import Work_flow from './pages/Work_flow.jsx';
import TagManager from 'react-gtm-module'



import 'bootstrap';
import * as bootstrap from 'bootstrap';
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

const tagManagerArgs = {
  gtmId: 'GTM-NDD6WWG7'
}

TagManager.initialize(tagManagerArgs)

export const ipaddress = "https://api.lernen-hub.de"
export const ipaddress2 = "https://api.lernen-hub.de"
// export const ipaddress="http://127.0.0.1:8000/"
// export const ipaddress2="http://127.0.0.1:8000/"    
export const domain = "https://lernen-hub.de"


const App = () => {

  // useEffect(() => {
  //   const disableRightClick = (event) => {
  //     event.preventDefault();
  //   };

  //   // Add event listener to disable right-click
  //   document.addEventListener('contextmenu', disableRightClick);

  //   // Cleanup function to remove event listener when component unmounts
  //   return () => {
  //     document.removeEventListener('contextmenu', disableRightClick);
  //   };
  // }, []);


  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [translated_pdf_url, settranslated_pdf_url] = useState("")
  const [language, setLanguage] = useState("en")
  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing_page />} />
          <Route path="/navbar" element={<Navbar setLanguage={setLanguage} />} />
          <Route path="/loginpage" element={<Loginpage />} />
          <Route path="/contact_us" element={<Contact_us />} />
          <Route path="/our_team" element={<Our_team />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/support" element={<Support />} />
          <Route path="/sales_team" element={<Sales_team />} />
          <Route path="/terms_of_use" element={<Terms_of_use />} />
          <Route path="/privacy_policy" element={<Privacy_policy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/getting_started" element={<Getting_started />} />
          <Route path="/product_guidelines" element={<Product_guidelines />} />
          <Route path="/best_practices" element={<Best_practices />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/community" element={<Community_page />} />

          <Route path="/forgot_password/:pattern" element={<Forgot_password_page />} />
          <Route path='signuppage' element={<Signuppage />} />
          <Route path="/dashboard/:data" element={<Protect Child={Dashboard} language={language} />} />
          <Route path="/uploadpage/:course_id/:course_name" element={<Uploadpage />} />
          <Route path="/group_upload_page/:group_id" element={<Group_document_upload />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/subjects/:course_id/:course_name" element={<Subjects />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/showpdf/:id" element={<Protect1 Child={Showpdfpage} settranslated_pdf_url={settranslated_pdf_url} />} />
          <Route path="/profile/:user_id" element={<Profile />} />
          <Route path="/subjects_sidebar" element={<Profile />} />
          <Route path="/adddetails" element={<Adddetails />} />
          <Route path="/userfiles/:user_id/:value" element={<UserFiles />} />
          <Route path="/flashcard/" element={<Flashcard />} />
          <Route path="/create_group_flashcard" element={<Group_flashcard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/groups/:grouptype" element={<Opengroups />} />
          <Route path="/groups/" element={<Groups />} />
          <Route path="/groupchat/:grouptype/:group_id" element={<Groupchat />} />
          <Route path="/viewflashcard/:type/:id/:flashset_id" element={<Viewflashcard />} />
          <Route path="/add_additional_flashcard/:type/:id/:flashset_id" element={<Add_additional_flashcards />} />
          <Route path="/flashset" element={<FlashSet />} />
          <Route path="/matchflashcard/:flashset_id" element={<Matchflashcard />} />
          <Route path="/filterflashcard/:type/:id/:flashset_id" element={<Filterflashcard />} />
          <Route path="/translatedpdf" element={<Translatedpdf url={translated_pdf_url} />} />
          <Route path="/extracted_text/:id" element={<Extracted_text />} />
          <Route path="/studylist/:study_list_id" element={<Studylist />} />
          <Route path="/flashcard_studylist/:study_list_id" element={<Flashcard_studylist />} />
          <Route path="/shareddocument/:token/" element={<Shared_document_page />} />
          <Route path="/work_flow" element={<Work_flow />} />



          <Route path="/admin_login" element={<Admin_Loginpage />} />
          <Route path="/user_page" element={<Users_page />} />
          <Route path="/history/:user_id" element={<History />} />
          <Route path="/university_details" element={<University_details />} />
          <Route path="/admin_course/:university_id" element={<Admin_course />} />
          <Route path="/admin_documents/:course_id" element={<Admin_documents />} />
          <Route path="/admin_report" element={<Admin_report />} />
          <Route path="/report/:type/:id" element={<Specific_report_page />} />
          <Route path="/reported_comments" element={<Comment_report />} />
          <Route path="/pending_details" element={<Pending_data />} />
          <Route path="/help_request" element={<Help_request />} />

          <Route path="/success" element={<Login_message />} />


        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
