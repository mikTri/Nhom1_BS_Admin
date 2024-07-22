import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';

// image
// import Logo from '../../assets/images/no-user.jpg';
import Logo from '../../assets/images/bookStoreLogo.png';
import patern from '../../assets/images/bookStoreLogo.png';
import googleIcon from '../../assets/images/googleImg.png';


import { MyContext } from '../../App';



const Login = () => {

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    
    const navigate = useNavigate();
    const context = useContext(MyContext);

    const [formfields, setFormfields] = useState({
        email: "",
        password: "",
        isAdmin: true
    })

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);

        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
            navigate('/'); 
        }
        else {
            navigate('/login'); 
        }
    }, [navigate, context]);

    const focusInput = (index) => { setInputIndex(index); }

    const onchangeInput = (e) => {
        setFormfields(() => ({ ...formfields,
                                [e.target.name]: e.target.value
                            }))
    }

    const signIn = (e) => {
        e.preventDefault();

        if (formfields.email === "") {
            context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm email!" })
            return false;
        }

        if (formfields.password === "") {
            context.setAlertBox({ open: true, error: true, msg: "Vui lòng thêm mật khẩu!" })
            return false;
        }

        setIsLoading(true);

        postData("/api/staff/signin", formfields).then((res) => {
            try {
                if (res.error !== true) {
                    localStorage.setItem("token", res.token);
                    const staff = {name: res.staff?.name,
                                email: res.staff?.email,
                                staffId: res.staff?.id,
                                role: res.staff?.role
                                }
                    console.log("staff info: " + staff)

                    localStorage.setItem("staff", JSON.stringify(staff));

                    
                    setTimeout(() => { 
                        setIsLoading(false); 
                        context.setAlertBox({ open: false, error: false, msg: "Bạn đã đăng nhập thành công!" });
                        navigate('/'); 
                    }, 2000);
    
                }
                else {
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        })
    }



    return (
        <>
            <img src={patern} className='loginPatern' alt=''/>
            
            <section className="loginSection">
                <div className="loginBox">
                    <br/>
                    <div className='logo text-center'>
                        <img src={Logo} width="60px" alt=''/>
                        <h5 className='font-weight-bold'>Đăng nhập tài khoản Admin</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={signIn}>
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input type='text' 
                                    className='form-control' 
                                    placeholder='Email' 
                                    onFocus={() => focusInput(0)} 
                                    onBlur={() => setInputIndex(null)} 
                                    autoFocus name="email" 
                                    onChange={onchangeInput} />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} 
                                    className='form-control' 
                                    placeholder='Mật khẩu'
                                    onFocus={() => focusInput(1)} 
                                    onBlur={() => setInputIndex(null)} 
                                    name="password" 
                                    onChange={onchangeInput} />

                                <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                    { isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye /> }
                                </span>
                            </div>


                            <div className='form-group'>
                                <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                    { isLoading === true ? <CircularProgress /> : 'Đăng nhập' }
                                </Button>
                            </div>
                            
                            {/* Quên mật khẩu: tạm bỏ */}
                            {/* <div className='form-group text-center mb-0'>
                                <Link to={'/forgot-password'} className="link">Bạn đã quên mật khẩu?</Link>
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='txt'>hoặc</span>
                                    <span className='line'></span>
                                </div>

                                <Button variant="outlined" className='w-100 btn-lg btn-big loginWithGoogle'>
                                    <img src={googleIcon} width="25px" alt=''/> &nbsp; Đăng nhập với Google
                                </Button>

                            </div> */}

                        </form>
                    </div>
                    
                    {/* Sign up: đưa mục này vào Sidebar */}
                    {/* <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Bạn chưa có tài khoản?&nbsp;
                            <Link to={'/signUp'} className='link color ml-2'>Đăng ký</Link>
                        </span>
                    </div> */}
                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Vui lòng liên hệ admin nếu bạn chưa có tài khoản
                        </span>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Login;

