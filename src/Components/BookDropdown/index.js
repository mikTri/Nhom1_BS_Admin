import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { FaAngleDown } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { MyContext } from '../../App';

// POPUP Transition: tạo hiệu ứng trượt lên của bảng pop up
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BookDropdown = ({ onSelectBook }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const context = useContext(MyContext); // để chia sẻ dữ liệu toàn cầu trong toàn bộ ứng dụng React
    const { fetchBookList } = useContext(MyContext);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                setIsLoading(true);
                context.setProgress(40);
                await fetchBookList();
                context.setProgress(100);
                setFilteredBooks(context.bookData);

            } catch (error) {
                console.error("Failed to fetch book list", error);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to load book data!' });
                context.setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadBooks();
    }, []);

    useEffect(() => {
        setFilteredBooks(context.bookData); // Update ilteredCarts khi cart thay đổi
    }, [context.bookData.books]);




    const selectBook = (index, book) => {
        setSelectedTab(index);
        setIsOpenModal(false);
        onSelectBook(book); // Gọi callback prop với dữ liệu sách đã chọn
    };

    const filterList = (e) => {
        const query = e.target.value.toLowerCase();
        let filtered = context.bookData || [];
        if (query) {
            filtered = filtered.filter(book => book.title?.toLowerCase().includes(query));
        } else {
            filtered = context.bookData || [];
        }
        setFilteredBooks(filtered);
    };

    return (
        <>
            <Button className='dropdownComponent' 
                    title='chọn tên sách'
                    onClick={() => {
                        setIsOpenModal(true);
                        fetchBookList();
                    }}
            >
                <div className='info d-flex flex-column'>
                    <span className='label'>Chọn tên sách... <FaAngleDown /></span>
                </div>
            </Button>
            <br/>

            <Dialog open={isOpenModal} 
                    onClose={() => setIsOpenModal(false)} 
                    className='locationModal' 
                    TransitionComponent={Transition}
            >
                <h4 className='mb-0'>Vui lòng chọn sách</h4>
                <p>Tổng số lượng sách {filteredBooks ? filteredBooks.length : 0}</p>
                
                <Button className='closeBtn' 
                        onClick={() => setIsOpenModal(false)} 
                        title='đóng'
                >
                    <IoCloseOutline />
                </Button>

                <div className='headerSearch w-100'>
                    <input type='text' placeholder='Tìm kiếm tên sách...' onChange={filterList} />
                    <Button title='tìm kiếm'><IoIosSearch /></Button>
                </div>

                <ul className='bookList mt-3'>
                    {filteredBooks?.length !== 0 && filteredBooks?.map((item, index) => (
                        <li key={index}>
                            <Button
                                onClick={() => selectBook(index, item)}
                                className={`${selectedTab === index ? 'active' : ''}`}
                                title='tên sách'
                            >
                                {item.title}
                            </Button>
                        </li>
                    ))}
                </ul>
            </Dialog>
        </>
    );
};

export default BookDropdown;
