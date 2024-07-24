import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { editData, fetchDataFromApi, uploadImage } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';



const AuthorEdit = () => {

    let { id } = useParams();
    const [isNominated, setisNominated] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name: '',
        isNominated: false
    });

    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/authorList', label: 'Danh sách tác giả' },
        { href: '#', label: 'Cập nhật tác giả' }
    ];


    useEffect(() => {

        console.log("id: " + id );
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/authors/${id}`)
            .then((res) => {
                setFormFields({
                            name: res.name,
                            isNominated: res.isNominated
                            });

                console.log("res.name: " + res.name); 
                context.setProgress(100);
            })
            .catch((error) => {
                console.error("Error fetching author data", error);
            });
    }, []);


    const handleChangeisNominated = (event) => {
        setisNominated(event.target.value);
        setFormFields(prevFields => ({
            ...prevFields,
            isNominated: event.target.value
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['name', 'isNominated'];
        for (const field of requiredFields) {
            if (formFields[field] === '') {
                context.setAlertBox({ open: true, error: true, msg: `Vui lòng thêm ${field}`});
                return;
            }
        }

        try {
            setIsLoading(true); 
            editData(`/api/authors/${id}`, formFields)
                .then((res) => {
                    setIsLoading(false);                                                                       
                    context.setAlertBox({ open: true, error: false, msg: "Tác giả đã được cập nhật" });
                });
            setTimeout(() => {setIsLoading(false); navigate('/authorList'); }, 2000);

        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi khi gửi dữ liệu:', error);
        }

    };


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Cập nhật thông tin tác giả</h5>
                    {/* <br/> */}
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>


                {/* <form className='form' onSubmit={addProduct} > */}
                <form className='form' onSubmit={handleSubmit} >
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Thông tin tác giả</h5>

                                <div className='form-group'>
                                    <h6>TÊN TÁC GIẢ</h6>
                                    <input type='text' name="title" value={formFields.name} onChange={handleChange}/>
                                </div>

                                <div className='col'>
                                    <div className='form-group'>
                                        <h6 className='text-uppercase'>ĐỀ CỬ</h6>
                                        <Select
                                            value={formFields.isNominated}
                                            onChange={handleChangeisNominated}
                                            name="isNominated"
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className='w-100'
                                        >
                                            <MenuItem value={true}>Có</MenuItem>
                                            <MenuItem value={false}>Không</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>


                    <div className='card p-4 mt-0'>
                        <div className="imagesUploadSec">
                            <Button type="submit" disabled={uploading === true ? true : false} className="btn-blue btn-lg btn-big w-100"> 
                                {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'THÊM VÀO DANH SÁCH'}  
                            </Button>

                        </div>
                    </div>

                </form>

            </div>
        </>
    )
}

export default AuthorEdit;