import React from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../../App';



const ProtectedRoute = ({ element, allowedRoles, ownPage }) => {
  const context = useContext(MyContext);
  const { isLogin, staff } = useContext(MyContext);
  const { id } = useParams(); // Lấy tham số id từ URL
  const location = useLocation();   //lấy location hiện tại


  // console.log("check isLogin: " + isLogin);
  // console.log("check role: " + staff.role);
  // console.log("check staff: " + staff.name );


  // Kiểm tra quyền truy cập
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.includes(context.role) === false) {
    console.log("do not allow to access");
    return <Navigate to="/" />;
  }
  else{
    console.log("allow to access")
  }

  // Kiểm tra xem trang có yêu cầu chỉnh sửa thông tin của chính mình không
  console.log("ownPage, context.role, staff.staffId: " + ownPage + ", " + context.role + ", " + staff.staffId);

  if (ownPage && context.role !== 1 && staff.staffId !== id && location.pathname.includes('/staffList/staffEdit/')) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  
  return element;
};

export default ProtectedRoute;

