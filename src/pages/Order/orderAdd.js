import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import { FaPlus } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumb from '../../Components/Breadcrumb';
import BookDropdown from '../../Components/BookDropdown';
import UserDropdown from '../../Components/UserDropdown';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from '../../App';

const OrderAdd = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [bookFormFields, setBookFormFields] = useState({
        productId: '',
        productTitle: '',
        quantity: 1,
        price: 0,
        subTotal: 0
    });
    
    const [formFields, setFormFields] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        amount: 0,
        paymentId: '',
        email: '',
        userid: '',
        status: '',
        products: []
    });

    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/orderList', label: 'Quản lý hóa đơn' },
        { href: '#', label: 'Thêm sản phẩm mới vào đơn hàng' }
    ];

    // payment status
    const paymentStatus = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'paid' },
        { id: 3, status: 'cancelled' }
    ];

    // fetch data
    const { fetchBookList } = useContext(MyContext);

    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBookList();
        fetchUserList(); // Fetch user list for UserDropdown
    }, []);


    const fetchUserList = async () => {
        try {
            const response = await fetchDataFromApi('/api/user'); 
            if (!response.error) {
                setUserList(response.users);
            } else {
                context.setAlertBox({ open: true, error: true, msg: response.msg });
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
        }
    };

    const handleSelectBook = (book) => {
        setBookFormFields(prevFields => ({
            ...prevFields,
            productTitle: book.title,
            productId: book.id,
            price: book.discountPrice,
            subTotal: book.discountPrice * prevFields.quantity
        }));
    };

    const handleSelectUser = (user) => {
        setFormFields({
            ...formFields,
            name: user.name,
            phoneNumber: user.phone,
            address: user.address,
            email: user.email,
            userid: user._id
        });
    };

    const handleBookChange = (e, index) => {
        const { name, value } = e.target;
        const updatedProducts = [...formFields.products];
        
        if (index < 0 || index >= updatedProducts.length) {
            console.error('Chỉ mục sách không tồn tại');
            return;
        }
        
        const product = updatedProducts[index];
        
        if (!product) {
            console.error('Không tìm thấy sản phẩm');
            return;
        }
    
        const quantity = name === 'quantity' ? parseInt(value, 10) || 1 : product.quantity;
        const price = product.price || 0;
    
        updatedProducts[index] = {
            ...product,
            [name]: value,
            subTotal: price * quantity
        };
        
        const totalAmount = updatedProducts.reduce((total, prod) => total + (prod.subTotal || 0), 0);

        setFormFields(prevFields => ({
            ...prevFields,
            products: updatedProducts,
            amount: totalAmount
        }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        const { value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            status: value
        }));
    };


    const handleAddProduct = () => {
        const updatedProduct = {
            ...bookFormFields,
            subTotal: bookFormFields.price * bookFormFields.quantity
        };
        
        const updatedProducts = [...formFields.products, updatedProduct];
        const totalAmount = updatedProducts.reduce((total, prod) => total + (prod.subTotal || 0), 0);

        setFormFields(prevFields => ({
            ...prevFields,
            products: updatedProducts,
            amount: totalAmount
        }));

        setBookFormFields({
            productId: '',
            productTitle: '',
            quantity: 1,
            price: 0,
            subTotal: 0
        });
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = formFields.products.filter((_, i) => i !== index);
        const totalAmount = updatedProducts.reduce((total, prod) => total + (prod.subTotal || 0), 0);
    
        setFormFields(prevFields => ({
            ...prevFields,
            products: updatedProducts,
            amount: totalAmount
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("*****status: " + formFields.status);

        const requiredUserFields = ['userid', 'email'];
        for (const field of requiredUserFields) {
            if (!formFields[field]) {
                context.setAlertBox({ open: true, error: true, msg: 'Vui lòng nhập thông tin khách hàng' });
                return;
            }
        }

        if (formFields.products.length === 0) {
            context.setAlertBox({ open: true, error: true, msg: 'Vui lòng thêm ít nhất một sản phẩm' });
            return;
        }

        if (formFields.paymentId.length === 0) {
            context.setAlertBox({ open: true, error: true, msg: 'Vui lòng nhập mã thanh toán' });
            return;
        }

        try {
            setIsLoading(true);
            const res = await postData('/api/orders/create', formFields);

            if (!res.error) {
                setTimeout(() => { 
                    setIsLoading(false); 
                    context.setAlertBox({ open: true, msg: 'Đơn hàng mới đã được tạo thành công!', error: false }); 
                    navigate("/orderList"); 
                }, 2000);
            } else {
                setIsLoading(false);
                context.setAlertBox({ open: true, error: true, msg: res.msg });
            }

        } catch (error) {
            setIsLoading(false);
            context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi tạo đơn hàng' });
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3 card-order">
                    <h5 className="mb-0">Thêm đơn hàng mới</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <form className='form' onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                {/* user name selection */}
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6 className='mb-4'>CHỌN NGƯỜI DÙNG*</h6>
                                        <UserDropdown onSelectUser={handleSelectUser} userList={userList} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='row'>
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>Tên Người Dùng</h6>
                                                <input type='text' name="name" value={formFields.name} onChange={handleFormChange} readOnly />
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>Số Điện Thoại</h6>
                                                <input type='text' name="phoneNumber" value={formFields.phoneNumber} onChange={handleFormChange} readOnly />
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>Địa Chỉ</h6>
                                                <input type='text' name="address" value={formFields.address} onChange={handleFormChange} readOnly />
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>Email</h6>
                                                <input type='text' name="email" value={formFields.email} onChange={handleFormChange} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    {/* books */}
                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <div className='card p-4'>
                                
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6 className='mb-4'>CHỌN SÁCH*</h6>
                                        <BookDropdown onSelectBook={handleSelectBook} />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Tên Sách</h6>
                                            <input type='text' name="productTitle" value={bookFormFields.productTitle} onChange={(e) => setBookFormFields({ ...bookFormFields, [e.target.name]: e.target.value })} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Giá Sách</h6>
                                            <input type='number' name="price" value={bookFormFields.price} onChange={(e) => setBookFormFields({ ...bookFormFields, [e.target.name]: e.target.value })} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Số Lượng</h6>
                                            <input type='number' name="quantity" value={bookFormFields.quantity} onChange={(e) => setBookFormFields({ ...bookFormFields, [e.target.name]: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                {/* "#6d4aae" */}
                                <Button variant="contained" sx={{ backgroundColor: '#6d4aae', '&:hover': { backgroundColor: '#5c3e8e' } }}  startIcon={<FaPlus />} onClick={handleAddProduct} className="mt-2">
                                    Thêm Sách
                                </Button>

                                <br/><br/>
                                
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <h5>Bảng chi tiết</h5>
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>Mã Sách</th>
                                                    <th>Tên Sách</th>
                                                    <th>Số Lượng</th>
                                                    <th>Đơn Giá</th>
                                                    <th>Thành Tiền</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formFields.products.map((product, index) => (
                                                    <tr key={index}>
                                                        <td>{product.productId}</td>
                                                        <td>{product.productTitle}</td>
                                                        <td><input type='number' name="quantity" value={product.quantity} onChange={(e) => handleBookChange(e, index)} /></td>
                                                        <td>{product.price}</td>
                                                        <td>{product.subTotal}</td>
                                                        <td>
                                                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveProduct(index)}>
                                                                Xóa
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <h5>Tổng tiền: {formFields.amount} VND</h5>
                                    </div>
                                </div>
                                <br/>

                            </div>
                        </div>
                    </div>


                    {/* payment status */}
                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <div className='card p-4'>
                                <div className='row'>
                                    
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>Mã Thẻ Thanh Toán*</h6>
                                            <input type='text' name="paymentId" value={formFields.paymentId} onChange={handleFormChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='w-10'>Trạng Thái Thanh Toán*</h6>
                                            <Select name="status" value={formFields.status} onChange={handleStatusChange} fullWidth>
                                                {paymentStatus.map((status) => (
                                                    <MenuItem key={status.id} value={status.status}>{status.status}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                </div>                           

                            </div>
                        </div>
                    </div>



                    <div className='row mt-3'>
                        <div className='col-md-12'>
                            <div className=' p-3'>

                                <div className='row mt-3'>
                                    <Button type="submit" variant="contained" sx={{ backgroundColor: '#6d4aae', '&:hover': { backgroundColor: '#5c3e8e' } }}  disabled={isLoading}>
                                        {isLoading ? <CircularProgress size={24} /> : 'Tạo Đơn Hàng'}
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>


                    
                </form>
            </div>
        </>
    );
};

export default OrderAdd;
