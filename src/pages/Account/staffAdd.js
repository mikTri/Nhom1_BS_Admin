// 
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import HomeIcon from '@mui/icons-material/Home';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { postData, uploadImage } from '../../utils/api';
import DropdownBox from '../../Components/DropdownBox';



const StaffAdd = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        role: 3,    //mạc định role = 3 (staff) nếu ko chọn
        images: ["https://res.cloudinary.com/dr25ejygj/image/upload/v1720856540/no-user_xsrodo.jpg"],
        createdDate: Date.now()
    });

    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');

    // staff role selections
    const [selectedRole, setSelectedRole] = useState('');
    const  roleList = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Supervisor' },
        { id: 3, name: 'Staff' }
      ];

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const breadcrumbs = [
        { href: '#', label: 'Quản lý tài khoản', icon: <HomeIcon fontSize="small" /> },
        { href: '/staffList', label: 'Tài khoản nhân viên' },
        { href: '#', label: 'Thêm nhân viên mới'}
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

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setSelectedRole(value);
        setFormFields(prevFields => ({
            ...prevFields,
            role: value
        }));
    };

    const handleTogglePassword = (type) => {
        if (type === 'password') {
            setIsShowPassword(prev => !prev);
            setIsShowConfirmPassword(false);
        } else if (type === 'confirmPassword') {
            setIsShowConfirmPassword(prev => !prev);
            setIsShowPassword(false);
        }
    };

    //ok
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formFields.name || !formFields.email || !formFields.phone || !formFields.address) {
            context.setAlertBox({ open: true, error: true, msg: "Vui lòng điền đầy đủ các trường bắt buộc và đảm bảo mật khẩu khớp nhau." });
            return;
        }
    
        try {
            // Upload image first
            let imageUrl = '';
            if (file) {
                // const result = await axios.post("http://localhost:4000/api/uploadStaffImage", { image });
                const result = await uploadImage('/api/uploadStaffImage', { image });
                console.log("result: " + result);
                imageUrl = result.secure_url; // Đảm bảo rằng đây là URL của ảnh
                console.log("imageUrl: " + imageUrl);
            }
            
            // Add image URL to formFields
            // const updatedFormFields = { ...formFields, images: imageUrl ? [imageUrl] : [] };
            const updatedFormFields = { ...formFields, images: imageUrl ? [imageUrl] : formFields.images };
    
            // Sign up the staff
            const res = await postData('/api/staff/signup', updatedFormFields);
    
            if (!res.error) {
                setIsLoading(true);
                context.setAlertBox({ open: true, msg: 'Tài khoản Nhân viên đã được tạo!', error: false });
                setTimeout(() => { setIsLoading(false); navigate('/staffList'); }, 2000);
            } else {
                setIsLoading(false);
                context.setAlertBox({ open: true, error: true, msg: res.msg });
            }
        } catch (error) {
            context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi đăng ký' });
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    const removeImg = () => {
        setPreview('');
        setFile(null);
    };

    

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 p-3">
                <h5 className="mb-0">Thêm tài khoản nhân viên mới</h5>
                <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
            </div>

            <form className='form ml-10 mr-10' onSubmit={handleSubmit}>
                <div className='row my-4'>
                    <div className='col-md-8 card shadow border-0 p-4 px-4'>
                        <div className='card p-4 mt-0'>

                            {/* staff info */}
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>TÊN*</h6>
                                        <input type='text' className='form-control' name="name" value={formFields.name} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>SĐT*</h6>
                                        <input type='text' name="phone" value={formFields.phone} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>Email*</h6>
                                        <input type='text' name="email" value={formFields.email} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>Địa chỉ*</h6>
                                        <input type='text' name="address" value={formFields.address} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>  
                            
                            {/* dropBox: staff role */}
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>Thuộc nhóm phân quyền*</h6>
                                        <DropdownBox handleChange={handleRoleChange} roles={roleList} value={formFields.role}/>
                                        {/* <DropdownBox roles={roleList} handleChange={handleRoleChange} value={""}/> */}
                                        <p>Selected Role: {selectedRole}</p>
                                    </div>
                                </div>
                            </div>

                            {/* password */}
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>Mật khẩu*</h6>
                                        <input type={isShowPassword ? 'text' : 'password'} className='form-control' name="password" value={formFields.password} onChange={handleChange} autoComplete="off" />
                                        {formFields.password && (
                                            <span className='toggleShowPassword' onClick={() => handleTogglePassword('password')}>
                                                {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>Xác nhận mật khẩu*</h6>
                                        <input type={isShowConfirmPassword ? 'text' : 'password'} className='form-control' name="confirmPassword" value={formFields.confirmPassword} onChange={handleChange} autoComplete="off" />
                                        {formFields.confirmPassword && (
                                            <span className='toggleShowPassword' onClick={() => handleTogglePassword('confirmPassword')}>
                                                {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='col-md-4 img-container card shadow border-0 p-3 px-4 py-4'>
                        <div className='imgUploadBox d-flex align-items-center'>
                            {preview ? 
                            (
                                <div className='uploadBox'>
                                    <span className="remove" onClick={removeImg}>
                                        <CiCircleRemove />
                                    </span>
                                    <div className='box'>
                                        <LazyLoadImage alt={"preview"} effect="blur" className="w-100" src={preview} />
                                    </div>
                                </div>
                            ) : 
                            (
                                <div className='uploadBox'>
                                    {isLoading ? 
                                    (
                                        <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                            <CircularProgress />
                                            <span>Đang tải...</span>
                                        </div>
                                    ) : 
                                    (
                                        <>
                                            {/* <input type="file" onChange={handleChange} name="image" required accept="image/png, image/jpeg, image/jpg, image/jfif" /> */}
                                            <input
                                                type="file"
                                                id="image"
                                                className='imgUploadBox'
                                                name="images"
                                                accept='image/*'
                                                onChange={handleChange}
                                            />
                                            <div className='info'>
                                                <h5>Tải ảnh lên</h5>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='imgUploadBtn card shadow border-0 w-100'>
                            <div className='imgBtn d-flex justify-content-center'>
                                <Button variant="contained" type="submit" className="btn btn-primary mt-3" disabled={isLoading}>Lưu</Button>
                            </div>
                        </div>
                    </div>
                </div>

                
            </form>


        </div>
    );
};

export default StaffAdd;