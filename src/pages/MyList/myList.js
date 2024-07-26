import { useContext, useEffect, useState } from "react";
import { MdShoppingBag, MdDelete } from "react-icons/md";

import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Rating from '@mui/material/Rating';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import DashboardBox from '../../Components/Dashboard';
import { deleteData } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';

import { MyContext } from "../../App";

const MyList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    
    const [searchQueryUserId, setSearchQueryUserId] = useState("");
    const [searchQueryMyListId, setSearchQueryMyListId] = useState("");
    const [filteredMyList, setFilteredMyList] = useState([]);

    const { fetchMyList, myListData } = useContext(MyContext);

    
    useEffect(() => {
        const loadMyList = async () => {
            try {
                setIsLoading(true);
                context.setProgress(40);
                await fetchMyList();
                context.setProgress(100);
                setFilteredMyList(context.myListData);

            } catch (error) {
                console.error("Failed to fetch mylist", error);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to load mylist data!' });
                context.setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadMyList();
    }, []);

    useEffect(() => {
        setFilteredMyList(context.myListData); // Update FilteredMyList khi myList thay đổi
    }, [context.myListData]);

    

    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/myList', label: 'Danh sách yêu thích' }
    ];


    const deleteItem = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa sản phẩm này trong myList không?");
        if (confirmed) {
            setIsLoading(true);
            deleteData(`/api/my-list/${id}`).then((res) => {
                context.setProgress(100);
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: 'Sản phẩm trong myList đã được xóa!' }), 2000);
                
                // Update the list after deletion
                const updatedMyList = context.myListData.filter((myList) => myList._id !== id);
                fetchMyList(); 
                setFilteredMyList(updatedMyList);
        
                setIsLoading(false);
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: '' }), 2000);
            });
        }
    };


    //search 
    const handleSearchMyListId = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryMyListId(query);
        applyFilters(query, searchQueryUserId);
    };

    const handleSearchUserId = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryUserId(query);
        applyFilters(searchQueryMyListId, query);
    };

    const applyFilters = (Query1, Query2) => {
        setFilteredMyList(context.myListData);
        
        let filtered = context.myListData || [];

        if (Query1) {
            filtered = filtered.filter(mylist => mylist._id?.toLowerCase().includes(Query1));
        }

        if (Query2) {
            filtered = filtered.filter(mylist => mylist.userId?.toLowerCase().includes(Query2));
        }

        setFilteredMyList(filtered);
    };

    
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách sản phẩm yêu thích</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số lượng sản phẩm yêu thích" count={myListData.length} grow={true} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Chi tiết danh sách yêu thích</h3>


                    {/* search*/}
                    <div className="row cardFilters mt-3">
                        {/*<div className="col-md-3">
                            <h4>Tìm mã myList</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="nhập tại đây..."
                                    value={searchQueryMyListId}
                                    onChange={handleSearchMyListId}
                                />
                            </FormControl>
                        </div> */}

                        <div className="col-md-3">
                            <h4>Tìm mã khách hàng</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="y/n..."
                                    value={searchQueryUserId}
                                    onChange={handleSearchUserId}
                                />
                            </FormControl>
                        </div>

                    </div>

                    {/* Table */}
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Thao tác</th>
                                    <th>MÃ KHÁCH HÀNG</th>
                                    {/*<th>MÃ MYLIST</th>*/}
                                    <th>TRANG BÌA</th>
                                    <th>MÃ SÁCH</th>
                                    <th>TÊN SÁCH</th>
                                    <th>ĐÁNH GIÁ</th>
                                    <th>GIÁ BÁN</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMyList.map((item) => (
                                    <tr key={item._id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                <Button className="error" color="error" onClick={() => deleteItem(item._id)}><MdDelete /></Button>
                                            </div>
                                        </td>
                                        <td>{item.userId}</td>
                                        {/*<td>{item._id}</td>*/}
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0 w-100">
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            className="w-100"
                                                            src={item.image || '/img/book.svg'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.productId}</td>
                                        <td>{item.productTitle}</td>
                                        <td><Rating name="read-only" defaultValue={item.rating ?? 0} precision={0.5} size="small" readOnly /></td>
                                        {/* <td>{item.rating}</td> */}
                                        <td>{item.price}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
};

export default MyList;
