import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCircleRemove } from "react-icons/ci";
import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { postData, uploadImage } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';
import { fetchDataFromApi } from "../../utils/api";



const BookAdd = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [categoryVal, setCategoryVal] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);
    const [isFSale, setIsFSale] = useState('');
    const [catData, setCatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');

    const [formFields, setFormFields] = useState({
        title: '',
        author: '',
        rating: 0,
        description: '',
        language: '',
        genres: null,
        pages: 0,
        basePrice: 0,
        discountPercent: 0,
        publisher: '',
        cover: '',
        // salesNum: 0,
        isFSale: false
    });

    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/bookList', label: 'Danh sách sản phẩm' },
        { href: '#', label: 'Thêm sản phẩm mới' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const previewFiles = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (e.target.type === 'file' && files.length > 0) {
            const file = files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
            previewFiles(file);
        } else {
            setFormFields(prevFields => ({
                ...prevFields,
                [name]: value
            }));
        }
    };

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        const selectedCategory = event.target.value;
        console.log("selectedCategory: " + selectedCategory);

        setFormFields(prevFields => ({
            ...prevFields,
            genres: selectedCategory
        }));

        // // get genres name:
        // fetchDataFromApi(`/api/categories/${selectedCategory}`).then((res) => {
        //     context.setProgress(100);

        //     setFormFields(prevFields => ({
        //         ...prevFields,
        //         genres: res.name
        //     }));
        // })
        
    };

    const handleChangeisFSale = (event) => {
        setIsFSale(event.target.value);
        setFormFields(prevFields => ({
            ...prevFields,
            isFSale: event.target.value
        }));
    };

    const removeImg = () => {
        setPreview('');
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm hình ảnh sách" });
            return;
        }
        
        // điều kiện điền đủ thông tin
        const requiredFields = ['title', 'author', 'rating', 'description', 'language', 'genres', 'pages', 'basePrice', 'publisher'];
        for (const field of requiredFields) {
            if (formFields[field] === '') {
                context.setAlertBox({ open: true, error: true, msg: `Vui lòng thêm ${field}`});
                return;
            }
        }

        // điều kiện không có 2 sách nào vừa trùng tên sách, vừa trùng tên tác giả
        try {
            const bookName = encodeURIComponent(formFields.title);
            const bookres = await fetchDataFromApi(`/api/books?title=${bookName}`);
            if(bookres.totalBooks > 0){
                bookres.books.forEach(book =>{                    
                    if (book.title === formFields.title && book.author === formFields.author) {
                        context.setAlertBox({ open: true, error: true, msg: `Sách ${formFields.title} của tác giả ${formFields.author} đã tồn tại` });
                    }
                })
            }
            else{
                // Upload image first
                let imageUrl = '';
                if (file) {
                    // const result = await axios.post("http://localhost:4000/api/uploadImage", { image });
                    
                    // console.log("image view: " + image);
                    const result = await uploadImage('/api/uploadImage', { image });
                    // console.log("result: " + result);
    
                    imageUrl = result.secure_url; // Đảm bảo rằng đây là URL của ảnh
                    console.log("imageUrl: " + imageUrl);
                }
    
                // Add image URL to formFields
                const updatedFormFields = { ...formFields, cover: imageUrl ? imageUrl : "" };
    
                console.log("updatedFormFields: " + updatedFormFields.title
                    + ", " + updatedFormFields.description
                    + ", " + updatedFormFields.genres
                    + ", " + updatedFormFields.author
                    + ", " + updatedFormFields.publisher
                    + ", " + updatedFormFields.language
                    + ", " + updatedFormFields.pages
                    + ", " + updatedFormFields.isFSale
                    + ", " + updatedFormFields.basePrice
                    + ", " + updatedFormFields.discountPercent
                    + ", " + updatedFormFields.rating
                    + ", " + updatedFormFields.cover
                );
    
                // post data
                const res = await postData('/api/books', updatedFormFields);
    
    
                if (!res.error) {
                    setIsLoading(true);
                    context.setAlertBox({ open: true, msg: 'Sách mới đã được thêm thành công!', error: false });
                    setTimeout(() => { setIsLoading(false); navigate('/bookList'); }, 2000);
                } else {
                    setIsLoading(false);
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            }
            
        } catch (error) {
            context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi thêm sách mới' });
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Thêm sách mới </h5>
                    {/* <br/> */}
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                {/* <form className='form' onSubmit={addProduct} > */}
                <form className='form' onSubmit={handleSubmit} >
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Thông tin sách</h5>

                                <div className='form-group'>
                                    <h6>TÊN SÁCH</h6>
                                    <input type='text' name="title" value={formFields.title} onChange={handleChange}/>
                                </div>

                                <div className='form-group'>
                                    <h6>MÔ TẢ</h6>
                                    <textarea rows={5} cols={10} value={formFields.description} name="description" onChange={handleChange}/>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>THỂ LOẠI</h6>
                                            <Select value={categoryVal || ''}
                                                    onChange={handleChangeCategory}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    className='w-100'
                                            >
                                                <MenuItem value=""><em value={null}></em></MenuItem>
                                                {context.catData?.map((cat, index) => (
                                                    <MenuItem className="text-capitalize" value={cat.name} key={index}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>


                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>TÁC GIẢ</h6>
                                            <input type='text' name="author" value={formFields.author} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>NHÀ XUẤT BẢN</h6>
                                            <input type='text' name="publisher" value={formFields.publisher} onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>


                                <div className='row'>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>NGÔN NGỮ</h6>
                                            <input type='text' name="language" value={formFields.language} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>SỐ TRANG</h6>
                                            <input type='text' name="pages" value={formFields.pages} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6 className='text-uppercase'>FLASHSALE</h6>
                                            <Select
                                                value={isFSale}
                                                onChange={handleChangeisFSale}
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


                                <div className='row'>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>GIÁ BÁN GỐC</h6>
                                            <input type='text' name="basePrice" value={formFields.basePrice} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>% GIẢM GIÁ</h6>
                                            <input type='text' name="discountPercent" value={formFields.discountPercent} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>GIÁ CÒN LẠI</h6>
                                            <input type='text' name="discount" value={formFields.basePrice * (100-formFields.discountPercent)/100} readOnly />
                                        </div>
                                    </div>

                                </div>

                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>BÌNH CHỌN</h6>
                                            <Rating name="simple-controlled"
                                                    value={ratingsValue}
                                                    onChange={(event, newValue) => {
                                                        setRatingValue(newValue);
                                                        setFormFields(() => ({
                                                                            ...formFields,
                                                                            rating: newValue
                                                                            }))
                                                    }}
                                            />
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

                                {preview ? (
                                    <div className='uploadBox'>
                                        <span className="remove" onClick={removeImg}>
                                            <CiCircleRemove />
                                        </span>
                                        <div className='box'>
                                            <LazyLoadImage alt={"preview"} effect="blur" className="w-100" src={preview} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='uploadBox'>
                                        {isLoading ? (
                                            <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                <CircularProgress />
                                                <span>Đang tải...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <input type="file" onChange={handleChange} name="image" required accept="image/png, image/jpeg, image/jpg, image/jfif" />
                                                <div className='info'>
                                                    <h5>Tải ảnh lên</h5>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <br />


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

export default BookAdd;