import React from 'react';
import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { MdHome } from "react-icons/md";
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { RiNewsLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaClipboardCheck } from "react-icons/fa";

import { MyContext } from '../../App';



const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const { setIsLogin } = useContext(MyContext);
    const context = useContext(MyContext);
    const navigate = useNavigate();
    
    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        }
        else {
            navigate("/login");
        }
    }, []);


    const logout = () => {
        localStorage.clear();
        setIsLogin(false);

        context.setAlertBox({  open: true, error: false, msg: "Đăng xuất thành công!" })
        setTimeout(() => { navigate("/login");  context.setAlertBox({ open: false });}, 2000);
    }

    return (
        <>
            <div className="sidebar">
                <ul>

                    {/* HOME */}
                    <li>
                        <NavLink activeclassname='is-active' to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdHome /></span>
                                TRANG CHỦ
                            </Button>
                        </NavLink>
                    </li>

                    {/* DASHBOAD */}
                    <li>
                        <NavLink activeclassname='is-active' to="/dashboard">
                            <Button className={`w-100 ${activeTab === 1 ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                                <span className='icon'><MdDashboard /></span>
                                BÁO CÁO THỐNG KÊ
                            </Button>
                        </NavLink>
                    </li>

                    {/* QUẢN LÝ SẢN PHẨM */}
                    <li>
                        <NavLink activeclassname='is-active' to="/bookList">
                            <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className='icon'> <FaProductHunt fontSize="small" /></span>
                                QUẢN LÝ SẢN PHẨM
                            </Button>
                        </NavLink>
                    </li>


                    {/* QUẢN LÝ TÁC GIẢ*/}
                    <li>
                        <NavLink activeclassname='is-active' to="/authorList">
                            <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className='icon'> <FaProductHunt fontSize="small" /></span>
                                QUẢN LÝ TÁC GIẢ
                            </Button>
                        </NavLink>
                    </li>

                    {/* QUẢN LÝ GIỎ HÀNG + YÊU THÍCH + HÓA ĐƠN*/}
                    <li>
                        <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className='icon'>< FaClipboardCheck/></span>
                            QUẢN LÝ BÁN HÀNG
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink activeclassname='is-active' to="/cartList">Quản lý giỏ hàng (cart list)</NavLink></li>
                                <li><NavLink activeclassname='is-active' to="/myList">Quản lý danh sách yêu thích (my list)</NavLink></li>
                                <li><NavLink activeclassname='is-active' to="/orderList">Quản lý hóa đơn (order)</NavLink></li>
                            </ul>
                        </div>
                    </li>

                    {/* QUẢN LÝ BANNER */}
                    {/* <li>
                        <Button className={`w-100 ${activeTab === 5 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                            <span className='icon'><RiNewsLine /></span>
                            QUẢN LÝ BANNER
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink activeclassname='is-active' to="/homeBannerSlide/list">Home Slides List</NavLink></li>
                                <li><NavLink activeclassname='is-active' to="/homeBannerSlide/add">Add Home Banner Slide</NavLink></li>
                            </ul>
                        </div>
                    </li> */}

                    {/* QUẢN LÝ REVIEW */}
                    {/* <li>
                        <NavLink activeclassname='is-active' to="/reviewList">
                            <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className='icon'> <FaClipboardCheck fontSize="small" /></span>
                                QUẢN LÝ Ý KIẾN KHÁCH HÀNG
                            </Button>
                        </NavLink>
                    </li> */}

                    {/* QUẢN LÝ EMAIL*/}
                    <li>
                        <Button className={`w-100 ${activeTab === 7 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                            <span className='icon'><RiNewsLine /></span>
                            QUẢN LÝ EMAIL
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 7 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink activeclassname='is-active' to="/mailBox">Quản lý hộp thư (mail box)</NavLink></li>
                                <li><NavLink activeclassname='is-active' to="/subscription">Quản lý đăng ký nhận email (subscription)</NavLink></li>
                            </ul>
                        </div>
                    </li>


                    {/* QUẢN LÝ TÀI KHOẢN */}
                    <li>
                        <Button className={`w-100 ${activeTab === 8 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                            <span className='icon'><RiNewsLine /></span>
                            QUẢN LÝ TÀI KHOẢN
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 8 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink activeclassname='is-active' to="/userList">Tài khoản khách hàng</NavLink></li>
                                <li><NavLink activeclassname='is-active' to="/staffList">Tài khoản nhân viên</NavLink></li>
                            </ul>
                        </div>
                    </li>

                </ul>
                <br />

                {/* LOGOUT */}
                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained" onClick={logout} className='logout'><IoMdLogOut />ĐĂNG XUẤT</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar;