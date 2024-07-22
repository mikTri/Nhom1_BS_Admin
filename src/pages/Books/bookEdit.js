import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { editData, fetchDataFromApi, uploadImage } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';



const EditUpload = () => {

    const [categoryVal, setcategoryVal] = useState('');
    const [isFSale, setIsFSale] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);

    const [catData, setCatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [product, setProducts] = useState([]);
    const [previews, setPreviews] = useState([]);

    let { id } = useParams();
    const navigate = useNavigate();

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

    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    // const [preview, setPreview] = useState('');

    const context = useContext(MyContext);

    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/bookList', label: 'Danh sách sản phẩm' },
        { href: '#', label: 'Cập nhật sản phẩm' }
    ];


    useEffect(() => {

        console.log("id: " + id );
        window.scrollTo(0, 0);
        setCatData(context.catData);
 
        fetchDataFromApi(`/api/books/${id}`)
            .then((res) => {
                setProducts(res);
                setFormFields({
                            title: res.title,
                            author: res.author,
                            rating: res.rating ?? 0,
                            description: res.description,
                            language: res.language,
                            genres: res.genres,
                            pages: res.pages,
                            basePrice: res.basePrice,
                            discountPercent: res.discountPercent,
                            publisher: res.publisher,
                            cover: res.cover,
                            isFSale: res.isFSale
                            });
                
                setRatingValue(res.rating || 0);
                setcategoryVal(res.genres);
                setPreviews(res.cover);
                context.setProgress(100);
            })
            .catch((error) => {
                console.error("Error fetching book data", error);
            });
    }, [context.catData]);


    const previewFiles = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);

            console.log("reader.result: " + reader.result);
        };
    };


    const handleChangeCategory = (event) => {
        setcategoryVal(event.target.value);

        console.log("genres changed: " + event.target.value);
        setFormFields(prevFields => ({
            ...prevFields,
            genres: event.target.value
        }));
    };

    const handleChangeisFSale = (event) => {
        setIsFSale(event.target.value);
        setFormFields(prevFields => ({
            ...prevFields,
            isFSale: event.target.value
        }));
    };

    // const handleRatingChange = (event, newValue) => {
    //     setRatingValue(newValue);
    //     setFormFields(prevFields => ({
    //         ...prevFields,
    //         rating: newValue
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFile(file);
            setPreviews(URL.createObjectURL(file));
            previewFiles(file);
        } 
        else {
            setFormFields(prevFields => ({
                ...prevFields,
                [name]: value
            }));
        }
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['title', 'author', 'rating', 'description', 'language', 'genres', 'pages', 'basePrice', 'publisher'];
        for (const field of requiredFields) {
            if (formFields[field] === '') {
                context.setAlertBox({ open: true, error: true, msg: `Vui lòng thêm ${field}`});
                return;
            }
        }

        try {
            const bookName = encodeURIComponent(formFields.title);
            const bookres = await fetchDataFromApi(`/api/books?title=${bookName}`);

            console.log("bookres.totalBooks: " + bookres.totalBooks);
            
            // điều kiện không có 2 sách nào vừa trùng tên sách, vừa trùng tên tác giả
            if(bookres.totalBooks > 1){
                bookres.books.forEach(book =>{   
                    // console.log("book.title: " + book.title );
                    // console.log("book.author: " + book.author);
                    // console.log("book.id: " + book.id);
                    // console.log("formFields.title: " + formFields.title);
                    // console.log("formFields.author " + formFields.author);
                    // console.log("id: " + id);

                    if (book.title === formFields.title && book.author === formFields.author && book.id !== id) {
                        context.setAlertBox({ open: true, error: true, msg: `Sách ${formFields.title} của tác giả ${formFields.author} đã tồn tại` });
                    }
                })
            }
            else{
                // Upload image first
                let imageUrl = '';
                if (file) {  // const result = await axios.post("http://localhost:4000/api/uploadImage", { image });
                    const result = await uploadImage('/api/uploadImage', { image });
                    imageUrl = result.secure_url;
                    console.log("imageUrl: " + imageUrl);
                }
                // Add image URL to formFields
                const formDataWithImages = { ...formFields, cover: imageUrl ? imageUrl : previews };
                console.log("previews: "+ previews);
    
                console.log(
                    "formDataWithImages: " + formDataWithImages.title
                    + ", " + formDataWithImages.description.length
                    + ", " + formDataWithImages.genres
                    + ", " + formDataWithImages.author
                    + ", " + formDataWithImages.publisher
                    + ", " + formDataWithImages.language
                    + ", " + formDataWithImages.pages
                    + ", " + formDataWithImages.isFSale
                    + ", " + formDataWithImages.basePrice
                    + ", " + formDataWithImages.discountPercent
                    + ", " + formDataWithImages.rating
                    + ", " + formDataWithImages.cover
                );


                // kiểm tra nếu có ô rỗng
                const requiredFields = ['title', 'author', 'rating', 'description', 'language', 'genres', 'pages', 'basePrice', 'publisher'];
                const toCheckNull = 0;
                for (const field of requiredFields) {
                    if (formFields[field] === '') {
                        toCheckNull++;
                    }
                }
                console.log("toCheckNull: " + toCheckNull);

                // nếu tât cả các ô đều có giá trị thì gọi PUT api, nếu tồn tại 1 ô rỗng thì hiện thông báo
                if (toCheckNull === 0) {   
                        setIsLoading(true); 
                        editData(`/api/books/update/${id}`, formDataWithImages)
                            .then((res) => {
                                setIsLoading(false);                                                                       
                                context.setAlertBox({ open: true, error: false, msg: "Sách đã được cập nhật" });
                            });
                        setTimeout(() => {setIsLoading(false); navigate('/bookList'); }, 2000);
                }
                else {
                    context.setAlertBox({ open: true, error: true, msg: 'Vui lòng điền đầy đủ thông tin' });
                    return false;
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    const removeImg = () => {
        setPreviews('');
        setFile(null);
    };

    const handleImageClick = () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.click();
        } else {
            console.error("File input element not found.");
        }
    };



    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Cập nhật thông tin sách</h5>
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
                                            <Select 
                                                value={formFields.genres || ''}
                                                onChange={handleChangeCategory}
                                                name="genres"
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
                                                value={formFields.isFSale}
                                                onChange={handleChangeisFSale}
												name="isFSale"
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
                                                precision={0.5} 
                                                readOnly
                                                // onChange={handleRatingChange}
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

                            <div className='imgUploadBox d-flex align-items-center' onClick={handleImageClick} >

                                {previews ? (
                                    <div className='box d-flex align-items-center justify-content-center'>
                                        <img alt="previews" effect="blur" className="w-100" src={previews} />
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
                                                <h5 className='info'>Tải ảnh lên</h5>
                                            </>
                                        )}
                                    </div>
                                )}
                                {isLoading || (
                                    <input type="file" id="file-input" onChange={handleChange} name="cover" accept="image/png, image/jpeg, image/jpg, image/jfif" style={{ display: 'none' }} />
                                )}
                            </div>
                            <br />


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

export default EditUpload;