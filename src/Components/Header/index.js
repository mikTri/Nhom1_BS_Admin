
// 
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { IoShieldHalfSharp } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';

// import SearchBox from "../SearchBox";

// images
import logo from '../../assets/images/no-user.jpg';
import img from '../../assets/images/no-user.jpg';
// import UserAvatarImgComponent from '../../assets/images/no-user.jpg';

import UserAvatarImgComponent from '../userAvatarImg';
import { MyContext } from '../../App';




const Header = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);

    const context = useContext(MyContext)

    const history = useNavigate();

    const handleOpenMyAccDrop = (event) => { setAnchorEl(event.currentTarget); };
    const handleCloseMyAccDrop = () => { setAnchorEl(null); };

    const handleOpenotificationsDrop = () => { setisOpennotificationDrop(true) }

    const handleClosenotificationsDrop = () => { setisOpennotificationDrop(false) }


    const logout=()=>{
        localStorage.clear();
        setAnchorEl(null);   
        setIsLoading(true);
        setTimeout(() => {
            context.setAlertBox({ open:true, error:false, msg:"Đăng xuất thành công!" }); 
            window.location.href = "/";
            setIsLoading(false);}, 2000
        );

        
    }

    const [staff, setStaff] = useState("");
    
    useEffect(() => {}, [staff]);    

    useEffect(() => {
        const storedStaff = JSON.parse(localStorage.getItem("staff")); 
        if (storedStaff) {setStaff(storedStaff);}
    }, []);
   


    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo + store name */}
                        <div className="col-sm-2 part1 pr-0">
                            <Link to={'/'} className="d-flex align-items-center logo">
                                <img src={logo} alt=''/>
                                <span className="ml-2 web-name">BOOKSTORE</span>
                            </Link>
                        </div>

                        <div className="col-sm-3 d-flex align-items-center part2">

                            {/* menu icon (hide + unhide Sidebar) */}
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                { context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu /> }
                            </Button>
                            
                            {/* <SearchBox /> */}
                            {/* <div className="searchBox posotion-relative d-flex align-items-center">
                                <IoSearch className="mr-2"/>
                                <input type="text" placeholder="Search here..."/>
                            </div> */}

                        </div>

                        {/*  */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">

                            <div className='dropdownWrapper position-relative'>
                                
                                {/* Notifications */}
                                    {/* Notifications: button */}
                                {/* <Button className="rounded-circle mr-3" onClick={handleOpenotificationsDrop}><FaRegBell /></Button> */}

                                    {/* Notifications: dropdown list */}
                                <Menu anchorEl={isOpennotificationDrop}
                                    className='notifications dropdown_list'
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleClosenotificationsDrop}
                                    onClick={handleClosenotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >

                                    <div className='head pl-3 pb-0'><h4 className='ml-10'>Thông báo</h4></div>

                                    <Divider className="mb-1" />
                                    
                                    {/*  */}
                                    <div className='scroll'>
                                        {/* Notifications: each noti */}
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                <div><UserAvatarImgComponent img src={img} alt=''/></div>

                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>Thông báo 1:</b> Nội dung thông báo <b> .....</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>Vài giây trước</p>
                                                </div>
                                            </div>
                                        </MenuItem>


                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src={img} alt=''/>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>Thông báo 2:</b> Nội dung thông báo <b> .....</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>Vài giây trước</p>
                                                </div>

                                            </div>
                                        </MenuItem>


                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <div className='d-flex'>
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src={img} alt='' />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='dropdownInfo'>
                                                    <h4>
                                                        <span>
                                                            <b>Thông báo 3:</b> Nội dung thông báo <b> .....</b>
                                                        </span>
                                                    </h4>
                                                    <p className='text-sky mb-0'>Vài giây trước</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                    </div>

                                    {/* button: xem tất cả thông báo */}
                                    <div className='pl-3 pr-3 w-100 pt-2 pb-1'>
                                        <Button className='btn-blue w-100'>Xem tất cả</Button>
                                    </div>

                                </Menu>
                            </div>


                            {/* USER ICON */}
                            {
                                context.isLogin !== true ?                                                                      //if
                                <Link to={'/'}><Button className='btn-blue btn-lg btn-round'>Đăng nhập</Button></Link> :     //then
                                <div className="myAccWrapper">                                                                  {/*else*/}
                                    <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                        {/* hiển thị tên user */}
                                        <div className="userImg">
                                            <span className="rounded-circle"> {context.staff?.name?.charAt(0)} </span>
                                        </div>
                                        {/* hiển thị email user */}
                                        <div className="userInfo">
                                            <h4>{context.staff?.name}</h4>
                                            <p className="mb-0">{context.staff?.email}</p>
                                        </div>
                                    </Button>

                                    <Menu  anchorEl={anchorEl}
                                        id="account-menu"
                                        open={openMyAcc}
                                        onClose={handleCloseMyAccDrop}
                                        onClick={handleCloseMyAccDrop}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        {/* my account */}
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                        {/* /staffList/staffEdit/${staff.staffId}/change-personal-info */}
                                            <Link to={`/staffList/staffEdit/${staff.staffId}/change-personal-info`} className='link'>
                                                <ListItemIcon><PersonAdd fontSize="small" /></ListItemIcon>
                                                Tài khoản của tôi
                                            </Link>
                                        </MenuItem>
                                        
                                        {/* logout */}
                                        <MenuItem onClick={logout}>
                                            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                            Đăng xuất
                                        </MenuItem>

                                    </Menu>

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;