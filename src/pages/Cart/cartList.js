import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import DashboardBox from '../../Components/Dashboard';
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';

import { MyContext } from "../../App";

const CartList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    
    const [searchQueryCartId, setSearchQueryCartId] = useState("");
    const [searchQueryUserId, setSearchQueryUserId] = useState("");
    const [filteredCarts, setFilteredCarts] = useState([]);

    const { fetchCartList, cartData } = useContext(MyContext);

    // useEffect(() => {
    //     fetchCartList();
    // }, []);

    // useEffect(() => {
    //     setFilteredCarts(context.cartData);
    // }, []);
    
    useEffect(() => {
        const loadCarts = async () => {
            try {
                setIsLoading(true);
                context.setProgress(40);
                await fetchCartList();
                context.setProgress(100);
                setFilteredCarts(context.cartData);

            } catch (error) {
                console.error("Failed to fetch cart list", error);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to load cart data!' });
                context.setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadCarts();
    }, []);

    useEffect(() => {
        setFilteredCarts(context.cartData); // Update ilteredCarts khi cart thay đổi
    }, [context.cartData]);

    

    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/cartList', label: 'Danh sách giỏ hàng' }
    ];


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [context.cartData]);


    const deleteItem = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa sản phẩm này trong giỏ hàng không?");
        if (confirmed) {
            setIsLoading(true);
            deleteData(`/api/cart/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Sản phẩm trong giỏ hàng đã được xóa!' });
                
                // Update the cart list after deletion
                const updatedCartList = context.cartData.filter((cart) => cart._id !== id);
                fetchCartList(); 
                setFilteredCarts(updatedCartList);
        
                setIsLoading(false);
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: '' }), 2000);
            });
        }
    };



    
    //search 
    const handleSearchChangCartId = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryCartId(query);
        applyFilters(query, searchQueryUserId);
    };

    const handleSearchChangeUserId = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryUserId(query);
        applyFilters(searchQueryCartId, query);
    };

    const applyFilters = (Query1, Query2) => {
        setFilteredCarts(context.cartData);
        
        let filtered = context.cartData || [];

        if (Query1) {
            filtered = filtered.filter(cart => cart._id?.toLowerCase().includes(Query1));
        }

        if (Query2) {
            filtered = filtered.filter(cart => cart.userId?.toLowerCase().includes(Query2));
        }

        setFilteredCarts(filtered);

        console.log("filtered.length: " + filtered.length);
    };

    
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách sản phẩm trong giỏ hàng</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số lượng giỏ hàng" count={cartData.length} grow={true} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Chi tiết giỏ hàng</h3>


                    {/* search by cart */}
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Tìm mã giỏ hàng</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="nhập tại đây..."
                                    value={searchQueryCartId}
                                    onChange={handleSearchChangCartId}
                                />
                            </FormControl>
                        </div>

                        <div className="col-md-3">
                            <h4>Tìm mã khách hàng</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="y/n..."
                                    value={searchQueryUserId}
                                    onChange={handleSearchChangeUserId}
                                />
                            </FormControl>
                        </div>

                    </div>



                    {/* Add button */}
                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to='/cartList/cartAdd'><Button color="success"><FaPlus /></Button></Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Thao tác</th>
                                    <th>MÃ GIỎ HÀNG</th>
                                    <th>TRANG BÌA</th>
                                    <th>TÊN SÁCH</th>
                                    <th>GIÁ BÁN</th>
                                    <th>SỐ LƯỢNG</th>
                                    <th>TỔNG TIỀN</th>
                                    <th>MÃ SÁCH</th>
                                    <th>MÃ KHÁCH HÀNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCarts.map((item) => (
                                    <tr key={item.id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/cartList/cartEdit/${item.id}`}>
                                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                                </Link>
                                                <Button className="error" color="error" onClick={() => deleteItem(item.id)}><MdDelete /></Button>
                                            </div>
                                        </td>
                                        <td>{item._id}</td>
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
                                        <td>{item.productTitle}</td>
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.subTotal}</td>
                                        <td>{item.productId}</td>
                                        <td>{item.userId}</td>
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

export default CartList;
