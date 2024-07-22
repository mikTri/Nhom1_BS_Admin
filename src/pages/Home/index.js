import React from 'react';

import logo from '../../assets/images/bookStoreLogo.png';


const Home = () => {
    return (
        <div className="right-content w-100">
            <div className="home-page w-100">
                <div className='row'>
                    <img src={logo} className='homepage-logo w-100' alt=''/>
                    <div className='row'>
                        <div className='d-flex align-items-center flex-column justify-content-center'>
                            <h1><span className='text-sky'>TRANG WEB</span> ADMIN</h1>
                            <p>Quản lý ứng dụng web bookstore.com</p>
                            <br/>
                            <br/>

                        </div>
                    </div>
                </div>
                
            </div>            

            
        </div>
    );
};

export default Home;
