import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Icons
import { IoPersonAdd } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// Material-UI
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import HomeIcon from '@mui/icons-material/Home';

// Lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// API and components
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from "../../App";



const UserList = () => {
    
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState();
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);

    
    // title + link:
    const breadcrumbs = [
        { href: '#', label: 'Quản lý tài khoản', icon: <HomeIcon fontSize="small" /> },
        { href: '/userList', label: 'Tài khoản khách hàng' }
    ];


    // 
    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi("/api/user?page=1&perPage=10").then((res) => {
            setUserList(res);
            context.setProgress(100);
        })

        fetchDataFromApi("/api/user/get/count").then((res) => { setTotalUsers(res.userCount); })
    }, []);


    // 
    const deleteUser = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa tài khoản này không?");   
        if(confirmed){
            setIsLoading(true);
            // setTimeout(() => { setIsLoading(false); window.location.href = "/userList"; }, 2000);
            deleteData(`/api/user/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Tài khoản khách hàng đã được xóa!' });
                
                fetchDataFromApi(`/api/user?page=${page}&perPage=10`).then((res) => { setUserList(res); });
                setTimeout(() => {
                    context.setAlertBox({ open: false, error: false, msg: '' }); 
                    setIsLoading(false);}, 2000
                );
                // setTimeout(() => { setIsLoading(false); window.location.href = "/userList"; }, 2000);
            })
        }   
    }

    // 
    const handleChange = (event, value) => {
        context.setProgress(40);
        setPage(value)
        fetchDataFromApi(`/api/user?page=${value}&perPage=10`).then((res) => {
            setUserList(res);
            context.setProgress(100);
            window.scrollTo({ top: 200, behavior: 'smooth', })
        })
    };


    return (
        <>
            <div className="right-content w-100">
                {/* Title + link */}
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách tài khoản </h5>
                    {/* <br/> */}
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs}/></div>
                </div>


                <div className="card shadow border-0 p-3 mt-4">
                    {/* <h3 className="hd">Account list</h3> */}
                    {/* Add */}
                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to={'/userList/userListAdd'}>
                                <Button color="success"><IoPersonAdd /></Button>
                            </Link>
                        </div>
                    </div>

                    {/* table + edit + delete */}
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Ảnh đại diện</th>
                                    <th>Tên</th>
                                    <th>SĐT</th>
                                    <th>Địa chỉ</th>
                                    <th>Email</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    userList?.users?.length !== 0 && userList?.users?.map((item, index) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0 w-100">
                                                                <LazyLoadImage
                                                                    alt={"image"}
                                                                    effect="blur"
                                                                    className="w-100"
                                                                    src={item.images[0]} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item?.name}</td>
                                                <td>{item?.phone}</td>
                                                <td>{item?.address}</td>
                                                <td>{item?.email}</td>
                                                <td>{item?.createdDate}</td>

                                                <td className="align-center">
                                                    <div className="actions d-flex align-items-center">
                                                    <Link to={`/userList/userEdit/${item.id}/change-personal-info`}>
                                                        <Button className="success" color="success"><FaPencilAlt /></Button>
                                                    </Link>
                                                    
                                                    <Button className="error" color="error" onClick={() => deleteUser(item?.id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>


                        {
                            userList?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                <Pagination count={userList?.totalPages} 
                                            color="primary" 
                                            className="pagination" 
                                            showFirstButton 
                                            showLastButton 
                                            onChange={handleChange} />
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default UserList;