import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Routes, Route, Link, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import { Tab, Tabs, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Breadcrumb from '../../Components/Breadcrumb';
import PasswordBox from '../../Components/PasswordBox';
import { fetchDataFromApi, editData, uploadImage } from '../../utils/api';
import { MyContext } from '../../App';


const UserEdit = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState([]);

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const [inputIndex, setInputIndex] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        isAdmin: false,
        images: ["https://res.cloudinary.com/dr25ejygj/image/upload/v1720856540/no-user_xsrodo.jpg"],
        createdDate: Date.now()
    });

    const [fields, setFields] = useState({
        staffPassword: "",
        password: "",
        confirmPassword: ""
    });

    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');

    const [value, setValue] = useState(0);
    const context = useContext(MyContext);
    

    const breadcrumbs = [
        { href: '#', label: 'Quản lý tài khoản', icon: <HomeIcon fontSize="small" /> },
        { href: '/userList', label: 'Tài khoản khách hàng' },
        { href: '#', label: 'Cập nhật tài khoản khách hàng' }
    ];

    let { id } = useParams();   //gọi client id được chọn từ userList
    useEffect(() => {
        
        console.log("id: " + id );
        window.scrollTo(0, 0); // cuộn trang về đầu (tọa độ 0,0) khi component được render
        const token = localStorage.getItem("token"); // giá trị của token từ localStorage
        // console.log(token);
        if (token !== "" && token !== undefined && token !== null) { // nếu token tồn tại (đã đăng nhập)
            setIsLogin(true); // đổi trạng thái isLogin = true
        } else {
            navigate("/signIn"); // điều hướng đến trang đăng nhập nếu chưa đăng nhập
        }
        
        fetchDataFromApi(`/api/user/${id}`)
            .then((res) => {
                setUserData(res);
                setFormFields({
                    name: res.name,
                    email: res.email,
                    phone: res.phone,
                    address: res.address,
                    images: res.images[0]
                });
                setPreview(res.images[0]);
            })
            .catch((error) => {
                console.error("Error fetching user data", error);
            });  
    }, [navigate]);

    // 
    useEffect(() => {
        if (location.pathname.includes('change-password')) {
            setValue(1);
        } else {
            setValue(0);
        }
    }, [location.pathname]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            navigate(`/userList/userEdit/${id}/change-personal-info`);
        } else {
            navigate(`/userList/userEdit/${id}/change-password`);
        }
    };


    // change user info (without password)
    const changeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevFields => ({
            ...prevFields,
            [name]: value
        }));
    };

    const changeInput2 = (e) => {
        setFields(() => (
            {
                ...fields,
                [e.target.name]: e.target.value
            }
        ));
        console.log('Updated fields:', fields);
    };


    const changePassword = (e) => {
        e.preventDefault();
        console.log("fields.staffPassword: " + fields.staffPassword);
        console.log("fields.password: " + fields.password);
        console.log("fields.confirmPassword: " + fields.confirmPassword);

        if (!fields.staffPassword || !fields.password || !fields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: 'Vui lòng điền đầy đủ thông tin' });
            return;
        }

        if (fields.password !== fields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: 'Mật khẩu và xác nhận mật khẩu không khớp' });
            return;
        }

        const staffStr = localStorage.getItem("staff");
        let staffEmail = "";
        let staffRole = "";

        if (staffStr) {
            const staffObj = JSON.parse(staffStr);
            staffEmail = staffObj.email;
            staffRole = staffObj.role;
        }

        const data = {
            email: staffEmail,
            password: fields.staffPassword,
            role: staffRole,
            newPassword: fields.password
        };
        console.log("data: " + data.email + ", " + data.password + ", " + data.role + ", " + data.newPassword);

        setIsLoading(true);
        editData(`/api/user/changePasswordbyAdmin/${id}`, data)
            // axios.put(`http://localhost:4000/api/user/changePasswordbyAdmin/6690aa0ef4ba890d2abda36b`,data)
            .then((res) => {
                setIsLoading(false);
                context.setAlertBox({ open: true, error: false, msg: "Người dùng đã được cập nhật" });
                setTimeout(() => { setIsLoading(false); navigate('/userList'); }, 2000);
            })
            .catch((error) => {
                setIsLoading(false);
                console.error('Lỗi khi thay đổi mật khẩu:', error);
                context.setAlertBox({ open: true, error: true, msg: 'Đã xảy ra lỗi khi thay đổi mật khẩu' });
            });


    };

    

    const previewFiles = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
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

    //ok
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formFields.name || !formFields.email || !formFields.phone || !formFields.address) {
            context.setAlertBox({ open: true, error: true, msg: "Vui lòng điền đầy đủ các trường bắt buộc." });
            return;
        }
    
        try {
            // Upload image first (ok)
            let imageUrl = '';
            if (file) {
                // const result = await axios.post("http://localhost:4000/api/uploadImage", { image });
                const result = await uploadImage('/api/uploadImage', { image });
                console.log("result: " + result);
                imageUrl = result.secure_url; // Đảm bảo rằng đây là URL của ảnh
                console.log("imageUrl: " + imageUrl);
            }
            
            // 
            const staffStr = localStorage.getItem("staff");
            let staffRole = "";
            if(staffStr){
                console.log("staffStr: " + staffStr );
                const staffObj = JSON.parse(staffStr)
                staffRole = staffObj.role;
                console.log("staffRole: " + staffRole );
            }
            else{
                context.setAlertBox({ open: true, error: false, msg: "Tài khoản của bạn không thể thực hiện chức năng này" });
                // setTimeout(() => {setIsLoading(false); window.location.href = "/userList"; }, 2000);
            }
            
            console.log("formFields.name: " + formFields.name );

            // Prepare form data with image URLs
            const formDataWithImages = { ...formFields, images: imageUrl ? [imageUrl] : formFields.images };
            
            if (staffRole === 1 &&                                                                                //nếu người thực hiện là Admin (role=1) và các thông tin đều hợp lệ
                formFields.name !== "" && formFields.email !== "" && formFields.phone !== "" && formFields.address !== ""
            ) 
            {   
                setIsLoading(true);                                                                             //Đặt trạng thái isLoading thành true để hiển thị trạng thái đang tải                                       //Lấy thông tin user từ localStorage và gửi yêu cầu cập nhật dữ liệu user qua API bằng hàm editData
                editData(`/api/user/${id}`, formDataWithImages)
                    .then((res) => {
                        setIsLoading(false);                                                                       
                        context.setAlertBox({ open: true, error: false, msg: "Người dùng đã được cập nhật" });
                    });
                setTimeout(() => {setIsLoading(false); navigate('/userList'); }, 2000);
            }
            else {
                context.setAlertBox({ open: true, error: true, msg: 'Vui lòng điền đầy đủ thông tin' });
                return false;
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi khi gửi dữ liệu:', error);
        }
    };

    const removeImg = () => {
        setPreview('');
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
        <section className='content section myAccountPage w-100'>
            <div className='right-content w-100'>
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Cập nhật tài khoản khách hàng</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                    <Tabs value={value} onChange={handleTabChange}>
                        <Tab label="Thông tin khách hàng" component={Link} to={`/userList/userEdit/${id}/change-personal-info`}/>
                        <Tab label="Đổi mật khẩu" component={Link} to={`/userList/userEdit/${id}/change-password`}/>
                    </Tabs>
                </Box>

                <Routes>
                    <Route path="change-personal-info" element={
                        <CustomTabPanel value={value} index={0}>
                            <form onSubmit={handleSubmit}>
                                <div className='row'>
                                    <div className='col-md-4 img-container card shadow border-0 p-3 px-4 py-4'>
                                        <div className='imgUploadBox d-flex align-items-center'>
                                            <div className='uploadBox w-100 d-flex align-items-center justify-content-center' onClick={handleImageClick}>
                                                {preview ? (
                                                    <div className='box d-flex align-items-center justify-content-center'>
                                                        <img alt="preview" effect="blur" className="w-100" src={preview} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {isLoading ? (
                                                            <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                                <CircularProgress />
                                                                <span>Đang tải...</span>
                                                            </div>
                                                        ) : (
                                                            <div className='info'>
                                                                <h5>Tải ảnh lên</h5>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                {/* {preview && (
                                                    <span className="remove" onClick={removeImg}>
                                                        <CiCircleRemove />
                                                    </span>
                                                )} */}
                                                {isLoading || (
                                                    <input type="file" id="file-input" onChange={handleChange} name="image" accept="image/png, image/jpeg, image/jpg, image/jfif" style={{ display: 'none' }} />
                                                )}
                                            </div>
                                        </div>
                                        <br/> <br/>
                                        <div onClick={handleImageClick} className='text-center image-note'>bấm vào ô để tải ảnh</div>
                                    </div>

                                    <div className='col-md-8 card shadow border-0 p-4 px-4'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <TextField label="Tên" variant="outlined" className='w-100' name="name" onChange={changeInput} value={formFields.name} />
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <TextField label="Email" variant="outlined" className='w-100' name="email" value={formFields.email} disabled />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <TextField label="Số điện thoại" variant="outlined" className='w-100' name="phone" onChange={changeInput} value={formFields.phone} />
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <TextField label="Địa chỉ" variant="outlined" className='w-100' name="address" onChange={changeInput} value={formFields.address} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className='row'>
                                            <div className='col-md-6'>
                                                <TextField label="Mật khẩu mới" variant="outlined" className='w-100' name="password" onChange={changeInput} value={formFields.password} />
                                            </div>
                                            <div className='col-md-6'>
                                                <TextField label="Xác nhận mật khẩu mới" variant="outlined" className='w-100' name="confirmpassword" onChange={changeInput} value={formFields.confirmPassword} />
                                            </div>
                                        </div> */}
                                        <div className='form-group'>
                                            <Button variant="contained" className='btn bg-primary' type="submit">
                                                {isLoading ? (
                                                    <CircularProgress className='text-light' />
                                                ) : (
                                                    "Lưu"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CustomTabPanel>
                    }/>

                    <Route path="change-password" element={
                        <CustomTabPanel value={value} index={1}>
                            <form onSubmit={changePassword} className='justify-content-center'>
                                {/* card shadow border-0 p-4 px-4 */}
                                <div className='card shadow border-0 p-4'>
                                    <div className='row gx-3'>
                                        
                                        <div className='col-md-4 col-sm-12 mb-3'>
                                            <PasswordBox
                                                label="Mật khẩu Admin"
                                                name="staffPassword"
                                                inputIndex={0}
                                                setInputIndex={setInputIndex}
                                                changeInput2={changeInput2}
                                            />
                                        </div>

                                        <div className='col-md-4 col-sm-12 mb-3'>
                                            <PasswordBox
                                                label="Mật khẩu mới"
                                                name="password"
                                                inputIndex={1}
                                                setInputIndex={setInputIndex}
                                                changeInput2={changeInput2}
                                            />
                                        </div>

                                        <div className='col-md-4 col-sm-12 mb-3'>
                                            <PasswordBox
                                                label="Xác nhận mật khẩu mới"
                                                name="confirmPassword"
                                                inputIndex={2}
                                                setInputIndex={setInputIndex}
                                                changeInput2={changeInput2}
                                            />
                                        </div>

                                        {/* <input label="Mật khẩu hiện tại" onChange={changeInput2} value={fields.staffPassword} name="staffPassword" />
                                        <input label="Mật khẩu mới" onChange={changeInput2} value={fields.password} name="password" />
                                        <input label="Xác nhận mật khẩu" onChange={changeInput2} value={fields.confirmPassword} name="confirmPassword" /> */}
                                    </div>

                                    <div className='form-group d-flex justify-content-center'>
                                        <Button variant="contained" className='btn bg-primary btn-lg' type="submit">
                                            {isLoading ? (
                                                <CircularProgress className='text-light' />
                                            ) : (
                                                "Lưu"
                                            )}
                                        </Button>
                                    </div>
                                </div>

                            </form>
                        </CustomTabPanel>
                    }/>

                </Routes>
            </div>
        </section>
    );
};

const CustomTabPanel = ({ children, value, index, ...other }) => {
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default UserEdit;