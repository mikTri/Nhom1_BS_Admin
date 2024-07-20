import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../../App';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { role } = useContext(MyContext);
  const location = useLocation();

  if (allowedRoles.includes(role)) {
    return element;
  }

  // Redirect to a page that shows no access permission
  return <Navigate to="/home" state={{ from: location }} />;
};

export default ProtectedRoute;
