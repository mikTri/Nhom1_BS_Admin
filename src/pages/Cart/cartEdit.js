import React, { useContext, useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Breadcrumb from '../../Components/Breadcrumb';
import { fetchDataFromApi, editData } from "../../utils/api";

import { MyContext } from '../../App';

const CartEdit = () => {
    
    const navigate = useNavigate();
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);

    const [formFields, setFormFields] = useState({
        productTitle: '',
        price: 0,
        quantity: 0,
        subTotal: 0,
        productId: '',
        userId: '',
        image: ''
    });

    let { id } = useParams();
    
    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/cartList', label: 'Danh sách giỏ hàng' },
        { href: '#', label: 'Cập nhật giỏ hàng' }
    ];

    useEffect(() => {
        console.log("id: " + id );
        window.scrollTo(0, 0);
 
        fetchDataFromApi(`/api/cart/${id}`)
            .then((res) => {
                setFormFields({
                            productTitle: res.productTitle,
                            price: res.price,
                            quantity: res.quantity,
                            subTotal: res.subTotal,
                            productId: res.productId,
                            userId: res.userId,
                            image: res.image
                            });

                console.log("res.productTitle: " + res.productTitle); 
            })
            .catch((error) => {
                console.error("Error fetching cart data", error);
            });
    }, []);


    // cập nhật lại subTotal khi quantity có thay đổi
    useEffect(() => {
        const newSubTotal = formFields.price * formFields.quantity;
        setFormFields(prevFields => ({
            ...prevFields,
            subTotal: newSubTotal
        }));
    }, [formFields.quantity]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['productTitle', 'quantity', 'userId'];
        for (const field of requiredFields) {
            if (!formFields[field]) {
                context.setAlertBox({ open: true, error: true, msg: `Vui lòng nhập ${field}` });
                return;
            }
        }

        try {
            console.log("formData: " + 
                formFields.productTitle + ", " +
                formFields.image + ", " +
                formFields.price + ", " +
                formFields.quantity + ", " +
                formFields.subTotal + ", " +
                formFields.productId + ", " +
                formFields.userId);

            const res = await editData(`/api/cart/${id}`, formFields);

            if (!res.error) {
                setIsLoading(true);
                context.setAlertBox({ open: true, msg: 'giỏ hàng đã được cập nhật thành công!', error: false });
                setTimeout(() => { setIsLoading(false); navigate('/cartList'); }, 2000);
            } else {
                setIsLoading(false);
                context.setAlertBox({ open: true, error: true, msg: res.msg });
            }

        } catch (error) {
            context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi cập nhật giỏ hàng' });
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Cập nhật giỏ hàng</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <form className='form' onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>

                                <div className='row'>
                                    <div className='col'></div>
                                    <div className='col'></div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>MÃ KHÁCH HÀNG</h6>
                                            <input type='text' name="userId" value={formFields.userId} onChange={handleChange} readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>MÃ SÁCH</h6>
                                            <input type='text' name="productId" value={formFields.productId} onChange={handleChange} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>TÊN SÁCH</h6>
                                            <input type='text' name="productTitle" value={formFields.productTitle} onChange={handleChange} readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>ĐƠN GIÁ</h6>
                                            <input type='text' name="price" value={formFields.price} onChange={handleChange} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>SỐ LƯỢNG*</h6>
                                            <input type='text' name="quantity" value={formFields.quantity} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-4'></div>
                                    <div className='col-md-4'></div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>THÀNH TIỀN</h6>
                                            <input type='text' name="basePrice" value={formFields.price * formFields.quantity || 0 } onChange={handleChange} readOnly />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='card p-4 mt-0'>
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">ẢNH TRANG BÌA</h5>

                            <div className='imgUploadBox d-flex align-items-center'>
                                <div className='uploadBox'>
                                    <div className='box'>
                                        <img alt="trangBia" className="w-100" src={formFields.image} />
                                    </div>
                                </div>
                            </div>

                            <br />

                            <Button type="submit" disabled={isLoading} className="btn-blue btn-lg btn-big w-100">
                                {isLoading ? <CircularProgress color="inherit" className="loader" /> : 'CẬP NHẬT GIỎ HÀNG'}
                            </Button>

                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CartEdit;
