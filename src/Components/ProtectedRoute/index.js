// import { Navigate, useLocation } from 'react-router-dom';
// import { useContext } from 'react';
// import { MyContext } from '../../App';

// const ProtectedRoute = ({ element, allowedRoles }) => {
//   const { role } = useContext(MyContext);
//   const location = useLocation();

//   if (allowedRoles.includes(role)) {
//     return element;
//   }

//   // Redirect to a page that shows no access permission
//   return <Navigate to="/" state={{ from: location }} />;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../../App';

const ProtectedRoute = ({ element, allowedRoles, ownPage }) => {
  const { isLogin, role, staff } = useContext(MyContext);
  const { id } = useParams(); // Lấy tham số id từ URL

  // Kiểm tra quyền truy cập
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // Kiểm tra xem trang có yêu cầu chỉnh sửa thông tin của chính mình không
  if (ownPage && role !== 1 && staff.staffId !== id) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;

