import React from 'react';
import { useContext, useEffect, useState } from "react";

import HomeIcon from '@mui/icons-material/Home';

import { fetchDataFromApi } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';

import logo from '../../assets/images/bookStoreLogo.png';
import { MyContext } from "../../App";

const Home = () => {
    const context = useContext(MyContext);

    const [userList, setUserList] = useState([]);
    const [totalUsers, setTotalUsers] = useState();

    const [staffList, setStaffList] = useState([]);
    const [totalStaffs, setTotalStaffs] = useState();

    const [reviewList, setReviewList] = useState([]);


    const { fetchBookList, bookData } = useContext(MyContext);
    const { fetchOrderList, orderData } = useContext(MyContext);
    const { fetchAuthorList, authorData } = useContext(MyContext);

    // chart data
    const [userChartData, setUserChartData] = useState([["Date", "Users"]]);
    const [userAddressData, setUserAddressData] = useState([["Address", "Users"]]);

    const [staffChartData, setStaffChartData] = useState([["Date", "Staffs"]]);
    const [staffRoleData, setStaffRoleData] = useState([["Role", "Staffs"]]);

    const [bookGenresData, setBookGenresData] = useState([["Genres", "Books"]]);
    
    const [orderChartData, setOrderChartData] = useState([["Date", "Pending", "Paid", "Cancelled"]]);
    
    const [reviewChartData, setReviewChartData] = useState([["Date", "Reviews"]]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


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
