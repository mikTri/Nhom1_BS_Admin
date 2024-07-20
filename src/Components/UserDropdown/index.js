import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from '../../App';

// POPUP Transition: tạo hiệu ứng trượt lên của bảng pop up
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const UserDropdown = ({ onSelectUser }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);
    const [filteredUsers, setfilteredUsers] = useState([]);
    const [userList, setUserList] = useState([]);


    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/user").then((res) => {
            setUserList(res?.users);
            setfilteredUsers(res?.users);
        });
    }, []);


    const selectUser = (index, user) => {
        setSelectedTab(index);
        setIsOpenModal(false);
        onSelectUser(user); // Gọi callback prop với dữ liệu sách đã chọn
    };

    const filterList = (e) => {
        const query = e.target.value.toLowerCase();
        let filtered = userList || [];
        if (query) {
            filtered = filtered.filter(user => user.name?.toLowerCase().includes(query));
        } else {
            filtered = userList || [];
        }
        setfilteredUsers(filtered);
    };


    return (
        <>
            <Button className='dropdownComponent' 
                    title='chọn tên khách hàng'
                    onClick={() => {
                        setIsOpenModal(true);
                    }}
            >
                <div className='info d-flex flex-column w-100'>
                    <span className='label'>Chọn tên KH... <FaAngleDown /></span>
                </div>
            </Button>
            <br/>

            <Dialog open={isOpenModal} 
                    onClose={() => setIsOpenModal(false)} 
                    className='locationModal' 
                    TransitionComponent={Transition}
            >
                <h4 className='mb-0'>Vui lòng chọn khách hàng</h4>
                <p>Tổng số khách hàng {filteredUsers ? filteredUsers.length : 0}</p>
                
                <Button className='closeBtn' onClick={() => setIsOpenModal(false)} title='đóng' >
                    <IoCloseOutline />
                </Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Tìm kiếm tên KH...' onChange={filterList} />
                    <Button title='tìm kiếm'><IoIosSearch /></Button>
                </div>

                <ul className='bookList mt-3'>
                    {filteredUsers?.length !== 0 && filteredUsers?.map((item, index) => (
                        <li key={index}>
                            <Button
                                onClick={() => selectUser(index, item)}
                                className={`${selectedTab === index ? 'active' : ''}`}
                                title='tên KH'
                            >
                                {item.name}: {item._id}
                            </Button>
                        </li>
                    ))}
                </ul>
            </Dialog>
        </>
    );
};

export default UserDropdown;
