import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className='animate__animated animate__fadeIn footer' style={{ backgroundColor: '#3C147D' }}>
                <div className="container m-0 d-flex align-items-center mx-auto flex-column" style={{ height: '100%' }}>
                    <div className="row m-0 w-100 footer-row1 align-items-center">
                        <div className="col-md-5">
                            <div>
                                <img src={require('../img/landing_page/Group 377.png')} alt="" />
                                <div class="mt-5" bis_skin_checked="1">
                                    <span class="footer-text d-block">Verantwortlich gemäß § 5 TMG:</span>
                                    <span class="footer-text d-block">Dipeshkumar Khandelwal</span>
                                    <span class="footer-text d-block">Krugenofen 14-16</span>
                                    <span class="footer-text d-block">52066 Aachen</span>
                                    <span class="footer-text d-block"></span>
                                    <p class="footer-text d-block">Germany</p>
                                    <span class="footer-text d-block">Telefon: +49 (0) 176 87328837</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className='footer-subdiv d-flex justify-content-between ms-md-auto mt-5 mt-md-0'>
                                <ul className='footer-ul'>
                                    <p className='footer-ul-head' style={{ cursor: 'pointer' }}>Support / Help</p>
                                    <li>
                                        <span className='footer-ul-li' style={{ cursor: 'pointer' }}>info@lernen-hub.de</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none' onClick={() => {
                                            navigate('/support')
                                        }}>Help Center</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none' onClick={() => {
                                            navigate('/faq')
                                        }}>FAQ</span>
                                    </li>
                                </ul>

                                <ul className='footer-ul'>
                                    <p className='footer-ul-head'>Profiles</p>
                                    <li>
                                        <span className='footer-ul-li text-decoration-none'>Home</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>About Us</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>Stories</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>Contact us</span>
                                    </li>
                                </ul>

                                <ul className='footer-ul'>
                                    <p className='footer-ul-head'>Social</p>
                                    <li>
                                        <span className='footer-ul-li text-decoration-none'>Linkedin</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>Intagram</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>Facebook</span>
                                    </li>
                                    <li className='mt-3'>
                                        <span className='footer-ul-li text-decoration-none'>X (Twitter)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='border-top border-white w-100'>
                        <div className='mt-5'>
                            <span className='footer-subdiv2-text' style={{ cursor: 'pointer' }} onClick={() => {
                                navigate('/terms_of_use')
                            }}>Terms of use</span>
                            <span style={{ cursor: 'pointer' }} onClick={() => {
                                navigate('/privacy_policy')
                            }} className='footer-subdiv2-text ms-5'>Privacy Policy</span>
                            <span className='footer-subdiv2-text ms-5'>Cookies Settings</span>
                            <span className='footer-subdiv2-text ms-5'><img src={require('../img/landing_page/copyright_FILL0_wght200_GRAD0_opsz24 (1) 1.png')} className='me-1' alt="" />LernenHub</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer