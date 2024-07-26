
// 
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';


// images
import logo from '../../assets/images/bookStoreLogo.png';
import { MyContext } from '../../App';




const Header = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMyAcc = Boolean(anchorEl);
    
    // const [staff, setStaff] = useState("");
    const { setIsLogin, setStaff, staff } = useContext(MyContext);
    const context = useContext(MyContext)
    const navigate = useNavigate();

    const handleOpenMyAccDrop = (event) => { setAnchorEl(event.currentTarget); };
    const handleCloseMyAccDrop = () => { setAnchorEl(null); };


    const logout=()=>{
        localStorage.clear();
        setIsLogin(false);
        setAnchorEl(null);   
        setIsLoading(true);
        
        setTimeout(() => {
            context.setAlertBox({ open:true, error:false, msg:"Đăng xuất thành công!" }); 
            navigate('/login'); 
            setIsLoading(false);
            context.setAlertBox({ open: false });
        }, 2000
        );

        
    }



    useEffect(() => {
        const storedStaff = JSON.parse(localStorage.getItem("staff")); 
        if (storedStaff) {setStaff(storedStaff);}
    }, []);

    useEffect(() => {}, [staff]);    
   


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
 
                        </div>

                        {/*  */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">

                            <div className='dropdownWrapper position-relative'>
                            </div>


                            {/* USER ICON */}
                            {
                                context.isLogin !== true ?                                                                    
                                // <Link to={'/'}><Button className='btn-blue btn-lg btn-round'>Đăng nhập</Button></Link> : 
                                <div></div> :   
                                <div className="myAccWrapper">                                                                 
                                    <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                        {/* hiển thị tên user */}
                                        <div className="userImg">
                                            <span className="rounded-circle"> {staff?.name?.charAt(0)} </span>
                                        </div>
                                        {/* hiển thị email user */}
                                        <div className="userInfo">
                                            <h4>{staff?.name}</h4>
                                            <p className="mb-0">{staff?.email}</p>
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
                                            <Link to={`/staffList/staffEdit/${staff?.staffId}/change-personal-info`} className='link'>
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