import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import 'react-lazy-load-image-component/src/effects/blur.css';
import DashboardBox from '../../Components/Dashboard';
import { deleteData } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from "../../App";

const OrderList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    
    const [searchQueryOrderId, setsearchQueryOrderId] = useState("");
    const [searchQueryUserId, setSearchQueryUserId] = useState("");
    const [filteredOrders, setfilteredOrders] = useState([]);

    const { fetchOrderList, orderData } = useContext(MyContext);


    useEffect(() => {
        const loadOrderList = async () => {
            try {
                setIsLoading(true);
                context.setProgress(40);
                await fetchOrderList();
                context.setProgress(100);
                setfilteredOrders(context.orderData.ordersList);

            } catch (error) {
                console.error("Failed to fetch order", error);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to load order data!' });
                context.setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadOrderList();
    }, []);

    useEffect(() => {
        setfilteredOrders(context.orderData.ordersList); 
    }, [context.orderData]);


    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/orderList', label: 'Quản lý hóa đơn' }
    ];

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [context.orderData]);

    const deleteItem = (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này trong giỏ hàng không?");
        if (confirmed) {
            setIsLoading(true);
            deleteData(`/api/orders/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Sản phẩm trong giỏ hàng đã được xóa!' });
                
                fetchOrderList();
                setIsLoading(false);
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: '' }), 2000);
            });
        }
    };

    // search
    const handleSearchChangOrderId = (e) => {
        const query = e.target.value.toLowerCase();
        setsearchQueryOrderId(query);
        applyFilters(query, searchQueryUserId);
    };

    const handleSearchChangeUserId = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryUserId(query);
        applyFilters(searchQueryOrderId, query);
    };

    const applyFilters = (Query1, Query2) => {
        setfilteredOrders(context.orderData.ordersList);
        
        let filtered = context.orderData.ordersList || [];

        if (Query1) {
            filtered = filtered.filter(order => order._id?.toLowerCase().includes(Query1));
        }

        if (Query2) {
            filtered = filtered.filter(order => order.userid?.toLowerCase().includes(Query2));
        }

        setfilteredOrders(filtered);
    };

    


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Quản lý hóa đơn</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số lượng hóa đơn" count={orderData.ordersList ? orderData.ordersList.length : 0} grow={true} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Chi tiết giỏ hàng</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Tìm mã giỏ hàng</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="nhập tại đây..."
                                    value={searchQueryOrderId}
                                    onChange={handleSearchChangOrderId}
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
                                    placeholder="nhập tại đây..."
                                    value={searchQueryUserId}
                                    onChange={handleSearchChangeUserId}
                                />
                            </FormControl>
                        </div>
                    </div>

                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to='/orderList/orderAdd'><Button color="success"><FaPlus /></Button></Link>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>THAO TÁC</th>
                                    <th>MÃ HOÁ ĐƠN</th>
                                    <th>TRẠNG THÁI</th>
                                    <th>MÃ KHÁCH HÀNG</th>
                                    <th>TÊN KHÁCH HÀNG</th>
                                    <th>SĐT</th>
                                    <th>ĐỊA CHỈ</th>
                                    <th>EMAIL</th>
                                    <th>NGÀY ĐẶT HÀNG</th>
                                    <th>TỔNG TIỀN</th>
                                    <th>DANH SÁCH SẢN PHẨM CỦA ĐƠN HÀNG</th>
                                    <th>MÃ THANH TOÁN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders?.map((order) => (
                                    <tr key={order._id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                {/* <Link to={`/orderList/orderEdit/${order._id}`}>
                                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                                </Link> */}
                                                <Button className="error" color="error" onClick={() => deleteItem(order._id)}><MdDelete /></Button>
                                            </div>
                                        </td>
                                        <td>{order._id}</td>
                                        <td>{order.status}</td>
                                        <td>{order.userid}</td>
                                        <td>{order.name}</td>
                                        <td>{order.phoneNumber}</td>
                                        <td>{order.address}</td>
                                        <td>{order.email}</td>                          
                                        <td>{order.date}</td>
                                        <td>{order.amount}</td>
                                        <td>
                                            <ul>
                                                {order.products.map((product) => (
                                                    <li key={product.productId}>
                                                        {product.productTitle} - {product.quantity} x {product.price} = {product.subTotal}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                        </td>
                                        <td>{order.paymentId}</td>
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

export default OrderList;
