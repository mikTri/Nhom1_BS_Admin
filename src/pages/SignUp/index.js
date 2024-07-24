import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// images
import Logo from '../../assets/images/googleImg.png';
import patern from '../../assets/images/googleImg.png';

// api
import { postData } from '../../utils/api';

import { MyContext } from '../../App';



const SignUp = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formfields, setFormfields] = useState({
                                                name: "",
                                                email: "",
                                                phone: "",
                                                address: "",
                                                password: "",
                                                confirmPassword: "",
                                                role: 3,
                                                createdDate: Date.now()
                                            })
    const history = useNavigate();
    const context = useContext(MyContext);

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, []);

    const focusInput = (index) => { setInputIndex(index); }

    const onchangeInput = (e) => {
        setFormfields(() => ({
                            ...formfields,
                            [e.target.name]: e.target.value
                            }))
    }

    const signUp = (e) => {
        e.preventDefault();
        try {
            if (formfields.name === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm đầy đủ họ tên!" })
                return false;
            }

            if (formfields.email === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm email!" })
                return false;
            }

            if (formfields.phone === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm số điện thoại!" })
                return false;
            }

            if (formfields.address === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm địa chỉ!" })
                return false;
            }

            if (formfields.password === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm mật khẩu!" })
                return false;
            }

            if (formfields.confirmPassword === "") {
                context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm xác nhận mật khẩu!" })
                return false;
            }

            if (formfields.confirmPassword !== formfields.password) {
                context.setAlertBox({ open: true, error: true, msg: "Mật khẩu không khớp!" })
                return false;
            }

            setIsLoading(true);

            postData("/api/staff/signup", formfields).then((res) => {
                console.log(res)

                if (res.error !== true) {
                    context.setAlertBox({ open: true, error: false, msg: "Tài khoản đã được đăng ký thành công!" });
                   
                    setTimeout(() => { setIsLoading(true); history("/login"); }, 2000);
                }
                else {
                    setIsLoading(false);
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            }).catch(error => {
                setIsLoading(false);
                console.error('Error posting data:', error);
            });
        } catch (error) {
            console.log(error)
        }
    }




    return (
        <>
            <img src={patern} className='loginPatern' alt=''/>
            <section className="loginSection signUpSection">

                <div className='row'>
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1><span className='text-sky'>TRANG WEB</span> ADMIN</h1>
                        <p>Quản lý ứng dụng web bookstore.com</p>
                        <br/>
                        <br/>

                        {/* <Link to={'/dashboard'}> <Button className="btn-blue btn-lg btn-big"><IoMdHome /> &nbsp;Đi đến trang chủ</Button></Link> */}
                        {/* <div className='w-100 mt-4'>
                            <Link to={'/dashboard'}> <Button className="btn-blue btn-lg btn-big"><IoMdHome /> Đi đến trang chủ</Button></Link>
                        </div> */}
                    </div>


                    <div className='col-md-4 pr-0'> 
                        <div className="loginBox">

                            <div className='logo text-center'>
                                <img src={Logo} width="60px" alt=''/>
                                <h5 className='font-weight-bold'>Đăng ký tài khoản</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>
                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input type='text' className='form-control' placeholder='Họ tên' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="name" onChange={onchangeInput} />
                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input type='text' className='form-control' placeholder='Email' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="email" onChange={onchangeInput} />
                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt /></span>
                                        <input type='text' className='form-control' placeholder='Số điện thoại' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} name="phone" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><FaLocationDot /></span>
                                        <input type='text' className='form-control' placeholder='Địa chỉ' onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} name="address" onChange={onchangeInput} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='Mật khẩu' onFocus={() => focusInput(4)} onBlur={() => setInputIndex(null)} name="password" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }
                                        </span>

                                    </div>


                                    {/*  */}
                                    <div className={`form-group position-relative ${inputIndex === 5 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='Xác nhận mật khẩu' onFocus={() => focusInput(5)} onBlur={() => setInputIndex(null)} name="confirmPassword" onChange={onchangeInput} />

                                        <span className='toggleShowPassword' onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
                                            {
                                                isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }
                                        </span>
                                    </div>

                                    <FormControlLabel control={<Checkbox />} label="Tôi đồng ý với mọi điều kiện và điều khoản" />
                                    <br/> <br/>

                                    <div className='form-group'>
                                        <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                        { isLoading===true ? <CircularProgress /> : 'Đăng ký' }
                                        </Button>
                                    </div>

                                    {/* <div className='form-group text-center mb-0'>
                                        <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                            <span className='line'></span>
                                            <span className='txt'>or</span>
                                            <span className='line'></span>
                                        </div>

                                        <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                            <img src={googleIcon} width="25px" alt='' /> &nbsp; Sign In with Google
                                        </Button>

                                    </div> */}

                                </form>

                                <span className='text-center d-block mt-3'>
                                    Bạn đã có tài khoản?
                                    <Link to={'/login'} className='link color ml-2'>&nbsp; Đăng nhập</Link>
                                </span>

                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </>
    )

}

export default SignUp;