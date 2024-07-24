import React from 'react';
import { useContext, useEffect } from "react";
import logo from '../../assets/images/bookStoreLogo.png';
import { MyContext } from "../../App";


const Home = () => {
    
    const { setisHideSidebarAndHeader} = useContext(MyContext);
    useEffect(() => {
        setisHideSidebarAndHeader(false);
        // setIsLogin(true);
    }, []);

    return (
        <div className="right-content w-100">
            <div className="home-page w-100">
                    <img src={logo} className='homepage-logo' alt=''/>
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
    );
};

export default Home;
