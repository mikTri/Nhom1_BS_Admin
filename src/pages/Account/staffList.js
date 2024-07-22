import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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



const StaffList = () => {

    const [page, setPage] = useState(1);
    const [totalStaffs, setTotalStaffs] = useState();
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);


    // title + link:
    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/staffList', label: 'Tài khoản nhân viên' }
    ];


    // 
    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi("/api/staff?page=1&perPage=10").then((res) => {
            setStaffList(res);
            context.setProgress(100);
        })

        fetchDataFromApi("/api/staff/get/count").then((res) => { setTotalStaffs(res.staffCount); })
    }, []);


    // 
    const deleteStaff = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa tài khoản này không?");
        if(confirmed){
            setIsLoading(true);
            context.setProgress(40);
            deleteData(`/api/staff/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Tài khoản nhân viên đã được xóa!' });
                
                fetchDataFromApi(`/api/staff?page=${page}&perPage=10`).then((res) => { setStaffList(res); });
                setTimeout(() => {
                    context.setAlertBox({ open: false, error: false, msg: '' }); 
                    setIsLoading(false);}, 2000
                );
                // setTimeout(() => { setIsLoading(false); window.location.href = "#"; }, 2000);
            })
        }   
    }

    // 
    const handleChange = (event, value) => {
        context.setProgress(40);
        setPage(value)
        fetchDataFromApi(`/api/staff?page=${value}&perPage=10`).then((res) => {
            setStaffList(res);
            context.setProgress(100);
            window.scrollTo({ top: 200, behavior: 'smooth', })
        })
    };


    return (
        <>
            <div className="right-content w-100">
                {/* Title + link */}
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách tài khoản nhân viên</h5>
                    <br/>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs}/></div>
                </div>


                <div className="card shadow border-0 p-3 mt-4">
                    {/* <h3 className="hd">Account list</h3> */}
                    {/* Add */}
                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to={'/staffList/staffListAdd'}>
                                <Button color="success"><IoPersonAdd /></Button>
                            </Link>
                        </div>
                    </div>


                    {/* table + edit + delete */}
                    <div className="table-responsive mt-3">
                        
                        {/* staff list */}
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Ảnh đại diện</th>
                                    <th>Phân quyền</th>
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
                                    staffList?.staffs?.length !== 0 && staffList?.staffs?.map((item, index) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0">
                                                                <LazyLoadImage
                                                                    alt={"image"}
                                                                    effect="blur"
                                                                    className="w-100"
                                                                    src={item.images[0]} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* role */}
                                                <td>
                                                    {
                                                        item?.role === 1 ? "Admin" :
                                                            item?.role === 2 ? "Supervisor" :
                                                                "Staff"
                                                    }
                                                </td>
                                                <td>{item?.name}</td>
                                                <td>{item?.phone}</td>
                                                <td>{item?.address}</td>
                                                <td>{item?.email}</td>
                                                <td>{item?.createdDate}</td>

                                                <td className="align-center">
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/staffList/staffEdit/${item.id}/change-personal-info`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link>
                                                        <Button className="error" color="error" onClick={() => deleteStaff(item?.id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>


                        {/* Pagination */}
                        {
                            staffList?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                <Pagination count={staffList?.totalPages} 
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

export default StaffList;