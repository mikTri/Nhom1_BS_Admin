//CSS
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';

// 
import LoadingBar from 'react-top-loading-bar'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// 
import ProtectedRoute from './Components/ProtectedRoute';

import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from '../src/pages/SignUp';

import BookList from './pages/Books/bookList.js';
import BookAdd from './pages/Books/bookAdd.js';
import BookEdit from './pages/Books/bookEdit.js';

import AuthorList from './pages/Authors/authorList.js';
import AuthorAdd from './pages/Authors/authorAdd.js';
import AuthorEdit from './pages/Authors/authorEdit.js';

// import ReviewList from './pages/Reviews/reviewList.js';

import CartList from './pages/Cart/cartList.js';
import CartAdd from './pages/Cart/cartAdd.js';
import CartEdit from './pages/Cart/cartEdit.js';

import MyList from './pages/MyList/myList.js';

import OrderList from './pages/Order/orderList.js';
import OrderAdd from './pages/Order/orderAdd.js';

import MailBox from './pages/Email/mailBox.js';
import Subscription from './pages/Email/subscription.js';

import UserList from './pages/Account/userList.js';
import UserAdd from './pages/Account/userAdd.js';
import UserEdit from './pages/Account/userEdit.js';

import StaffList from './pages/Account/staffList.js';
import StaffAdd from './pages/Account/staffAdd.js';
import StaffEdit from './pages/Account/staffEdit.js';

import { fetchDataFromApi } from './utils/api';

const MyContext = createContext();



function App() {

  const [role, setRole] = useState(null);

  const [alertBox, setAlertBox] = useState({ msg: '', error: false, open: false })
  const [progress, setProgress] = useState(0);

  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [staff, setStaff] = useState({ name:"", email:"", staffId:"" })
  const [catData, setCatData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const [baseUrl, setBaseUrl] = process.env.REACT_APP_BASE_URL;
 


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setAlertBox({ open: false });
  };


  useEffect(()=>{
    const token = localStorage.getItem("token");

    if(token!=="" && token!==undefined  && token!==null){
      setIsLogin(true);
      const staffData = JSON.parse(localStorage.getItem("staff"));
      setStaff(staffData);
      setRole(staffData?.role);
    }
    else{
      setIsLogin(false);
    }
  },[]);

  

  useEffect(() => {
    setProgress(20);
    fetchCategory();
    fetchBookList();
    fetchAuthorList();
    fetchCartList();
    fetchOrderList();
    fetchMyList();
  }, []);


  const fetchCategory=()=>{
    fetchDataFromApi('/api/categories/all').then((res) => {
      setCatData(res);
      setProgress(100);
      // console.log("Fetch categories: ", res); // Log ra giá trị res từ API

    })
  }

  const fetchBookList=()=>{
    fetchDataFromApi('/api/books/all').then((res) => {
      setBookData(res);
      setProgress(100);
      // console.log("fetch book list: " + res);
    })
  }
  
  const fetchAuthorList=()=>{
    fetchDataFromApi('/api/authors/all').then((res) => {
      setAuthorData(res);
      setProgress(100);
      // console.log("total author from very first: " + res.authorList?.length);
    })
  }

  const fetchCartList=()=>{
    fetchDataFromApi('/api/cart').then((res) => {
      setCartData(res);
      setProgress(100);
    })
  }

  const fetchMyList=()=>{
    fetchDataFromApi('/api/my-list').then((res) => {
      setMyListData(res);
      setProgress(100);
    })
  }

  const fetchOrderList=()=>{
    fetchDataFromApi('/api/orders/all').then((res) => {
      setOrderData(res);
      setProgress(100);
    })
  }



  const values = {

    alertBox,
    setAlertBox,

    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,

    isToggleSidebar,
    setIsToggleSidebar,

    isLogin,
    setIsLogin,  
    
    
    setStaff,
    staff,

    setRole,
    role,
    
   
    setProgress,
    baseUrl,

    catData,
    fetchCategory,

    bookData,
    fetchBookList,

    authorData,
    fetchAuthorList,

    cartData,
    fetchCartList,

    myListData,
    fetchMyList,

    orderData,
    fetchOrderList,

  }



  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>

        <LoadingBar color='#f11946'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                    className='topLoadingBar'
        />


        <Snackbar open={alertBox.open} autohideduration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            autohideduration={6000}
            severity={alertBox.error === false ? "success" : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>


        {/* Header */}
        {
          isHideSidebarAndHeader !== true && <Header />
        }


        <div className='main d-flex'>
          {/* Sidebar */}
          {
            isHideSidebarAndHeader !== true &&
            <div className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}`}>
              <Sidebar />
            </div>
          }


            {/*  */}

          <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
            <Routes>

              {/* <Route path="/login" exact element={<ProtectedRoute element={<Login />} allowedRoles={[1, 2, 3]} />} /> */}
              {/* <Route path="/signUp" exact element={<ProtectedRoute element={<SignUp />} allowedRoles={[1, 2, 3]} />} /> */}
              <Route path="/login" exact={true} element={<Login />} />
              <Route path="/signUp" exact={true} element={<SignUp />} />
              <Route path="/" exact={true} element={<Home />} />

              {/* <Route path="/home" exact element={<ProtectedRoute element={<Home />} allowedRoles={[1, 2, 3]} />} /> */}

              <Route path="/dashboard" exact={true} element={<ProtectedRoute element={<Dashboard />} allowedRoles={[1, 2]} ownPage={true} />} />


              <Route path="/bookList" exact element={<ProtectedRoute element={<BookList />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/bookList/bookAdd" exact element={<ProtectedRoute element={<BookAdd />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/bookList/bookEdit/:id" exact element={<ProtectedRoute element={<BookEdit />} allowedRoles={[1, 2, 3]} ownPage={true} />} />


              <Route path="/authorList" exact element={<ProtectedRoute element={<AuthorList />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/authorList/authorAdd" exact element={<ProtectedRoute element={<AuthorAdd />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/authorList/authorEdit/:id" exact element={<ProtectedRoute element={<AuthorEdit />} allowedRoles={[1, 2, 3]} ownPage={true} />} />

              {/* <Route path="/reviewList" exact element={<ProtectedRoute element={<ReviewList />} allowedRoles={[1, 2, 3]} ownPage={true} />} /> */}

              <Route path="/mailBox" exact element={<ProtectedRoute element={<MailBox />} allowedRoles={[1, 2, 3]} />} ownPage={true} />
              <Route path="/subscription" exact element={<ProtectedRoute element={<Subscription />} allowedRoles={[1, 2, 3]} ownPage={true} />} />

              <Route path="/cartList" exact element={<ProtectedRoute element={<CartList />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/cartList/cartAdd" exact element={<ProtectedRoute element={<CartAdd />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              <Route path="/cartList/cartEdit/:id" exact element={<ProtectedRoute element={<CartEdit />} allowedRoles={[1, 2, 3]} ownPage={true} />} />

              <Route path="/myList" exact element={<ProtectedRoute element={<MyList />} allowedRoles={[1, 2, 3]} ownPage={true} />} />

              <Route path="/orderList" exact element={<ProtectedRoute element={<OrderList />} allowedRoles={[1, 2, 3]} />} ownPage={true} />
              <Route path="/orderList/orderAdd" exact element={<ProtectedRoute element={<OrderAdd />} allowedRoles={[1, 2, 3]} ownPage={true} />} />
              {/* <Route path="/orderList/orderEdit/:id" exact element={<ProtectedRoute element={<OrderEdit />} allowedRoles={[1, 2, 3]} />} /> */}

              <Route path="/userList" exact element={<ProtectedRoute element={<UserList />} allowedRoles={[1]} />} />
              <Route path="/userList/userListAdd" exact element={<ProtectedRoute element={<UserAdd />} allowedRoles={[1]} ownPage={true} />} />
              <Route path="/userList/userEdit/:id/*" element={<ProtectedRoute element={<UserEdit />} allowedRoles={[1]} ownPage={true} />} />

              <Route path="/staffList" exact element={<ProtectedRoute element={<StaffList />} allowedRoles={[1]} />} />
              <Route path="/staffList/staffListAdd" exact element={<ProtectedRoute element={<StaffAdd />} allowedRoles={[1]} ownPage={true} />} />
              <Route path="/staffList/staffEdit/:id/*" element={<ProtectedRoute element={<StaffEdit />} allowedRoles={[1, 2, 3]} ownPage={true} />} />

              
            </Routes> 
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext }



