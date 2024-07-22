import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';
import { fetchDataFromApi } from "../../utils/api";



const AuthorAdd = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);
    const [uploading, setUploading] = useState(false);
    const [isNominated, setisNominated] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { fetchAuthorList, authorData } = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name: '',
        isNominated: false
    });

    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/authorList', label: 'Danh sách tác giả' },
        { href: '#', label: 'Thêm tác giả mới' }
    ];

    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAuthorList();
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));
    };


    const handleChangeisNominated = (event) => {
        setisNominated(event.target.value);
        setFormFields(prevFields => ({
            ...prevFields,
            isNominated: event.target.value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
 
        // điều kiện điền đủ thông tin
        const requiredFields = ['name', 'isNominated'];
        for (const field of requiredFields) {
            if (formFields[field] === '') {
                context.setAlertBox({ open: true, error: true, msg: `Vui lòng thêm ${field}`});
                return;
            }
        }

        // Kiểm tra xem tên tác giả có trùng hay không
        const isDuplicate = context.authorData.some(author => author.name === formFields.name);
        console.log("isDuplicate: " + isDuplicate);
        if (isDuplicate) {
        context.setAlertBox({ open: true, error: true, msg: 'Author name already exists!' });
        return;
        }
        else{
            console.log("formFields: " + formFields.name);

            // post data
            setUploading(true);
            postData('/api/authors/add', formFields).then(() => {
                context.setAlertBox({ open: true, error: false, msg: 'Tác giả mới đã được thêm thành công!' });
                context.fetchAuthorList(); 
                // setTimeout(() => { setIsLoading(false); window.location.href = "/authorList"; }, 2000);
                setTimeout(() => { setIsLoading(false); navigate('/authorList'); }, 2000);
            })
            .catch(() => {
                context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi thêm tác giả' });
            })
            .finally(() => setUploading(false));
        }

        

        // // điều kiện không trùng tên tác giả
        // try {
        //     const authorName = encodeURIComponent(formFields.name);
        //     const authorres = await fetchDataFromApi(`/api/authors?name=${authorName}`);
        //     // console.log("authorres.name: " + authorres.authorList[0].name);
            
        //     authorData.forEach(data => {
        //         console.log("data: " + data);
        //     });
            
            
        //     if(authorres.authorList[0].name){
        //         console.log("authorres.name: " + authorres.authorList[0].name);
        //         context.setAlertBox({ open: true, error: true, msg: `Tên tác giả ${formFields.name} đã tồn tại` });
        //     }
        //     else{
        //         console.log("formFields.name: " + formFields.name);
        //         console.log("formFields.isNominated: " + formFields.isNominated);
        //         console.log("formFields.count: " + formFields.ctnBook);
        //         // post data
        //         const res = await postData('/api/authors/add', formFields);
    
        //         if (!res.error) {
        //             context.fetchAuthorList();
        //             setIsLoading(true);
        //             context.setAlertBox({ open: true, msg: 'Tác giả mới đã được thêm thành công!', error: false });
        //             // setTimeout(() => { setIsLoading(false); window.location.href = "/authorList"; }, 2000);
        //         } else {
        //             setIsLoading(false);
        //             context.setAlertBox({ open: true, error: true, msg: res.msg });
        //         }
        //     }
            
        // } catch (error) {
        //     context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi thêm tác giả' });
        //     console.error('Lỗi khi gửi dữ liệu:', error);
        // }
    };


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Thêm tác giả mới </h5>
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
                                    <input type='text' name="name" value={formFields.name} onChange={handleChange}/>
                                </div>

                                <div className='col'>
                                    <div className='form-group'>
                                        <h6 className='text-uppercase'>ĐỀ CỬ</h6>
                                        <Select
                                            value={isNominated.toString()}
                                            onChange={handleChangeisNominated}
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
                            <Button type="submit" disabled={uploading === true ? true : false} className="btn-blue btn-lg btn-big w-100"
                            > 
                                {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'THÊM VÀO DANH SÁCH'}  
                            </Button>
                        </div>
                    </div>

                </form>

            </div>
        </>
    )
}

export default AuthorAdd;