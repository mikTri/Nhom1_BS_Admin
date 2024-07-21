import React from 'react';
import { useContext, useEffect, useState } from "react";

import HomeIcon from '@mui/icons-material/Home';

import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Chart } from "react-google-charts";

import { fetchDataFromApi } from "../../utils/api";
import DashboardBox from '../../Components/Dashboard';
import Breadcrumb from '../../Components/Breadcrumb';

import { MyContext } from "../../App";

const Dashboard = () => {
    const context = useContext(MyContext);

    const [userList, setUserList] = useState([]);
    const [totalUsers, setTotalUsers] = useState();

    const [staffList, setStaffList] = useState([]);
    const [totalStaffs, setTotalStaffs] = useState();

    const [reviewList, setReviewList] = useState([]);


    const { fetchBookList, bookData } = useContext(MyContext);
    const { fetchOrderList, orderData } = useContext(MyContext);
    const { fetchAuthorList, authorData } = useContext(MyContext);

    // chart data
    const [userChartData, setUserChartData] = useState([["Date", "Users"]]);
    const [userAddressData, setUserAddressData] = useState([["Address", "Users"]]);

    const [staffChartData, setStaffChartData] = useState([["Date", "Staffs"]]);
    const [staffRoleData, setStaffRoleData] = useState([["Role", "Staffs"]]);

    const [bookGenresData, setBookGenresData] = useState([["Genres", "Books"]]);
    
    const [orderChartData, setOrderChartData] = useState([["Date", "Pending", "Paid", "Cancelled"]]);
    
    const [reviewChartData, setReviewChartData] = useState([["Date", "Reviews"]]);


    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '#', label: 'Báo cáo thống kê' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchBookList();
        fetchOrderList();
        fetchAuthorList();
    }, []);

    // fetch data
    useEffect(() => {
        fetchDataFromApi("/api/user").then((res) => { setUserList(res); context.setProgress(100); });
        fetchDataFromApi("/api/user/get/count").then((res) => { setTotalUsers(res.userCount); });

        fetchDataFromApi("/api/staff").then((res) => { setStaffList(res); context.setProgress(100); });
        fetchDataFromApi("/api/staff/get/count").then((res) => { setTotalStaffs(res.staffCount); });

        fetchDataFromApi("/api/reviews").then((res) => { setReviewList(res); context.setProgress(100); });

    }, []);

    // users
    useEffect(() => {
        if (userList?.users) {
            const dateCounts = userList?.users?.reduce((acc, user) => {
                const date = new Date(user.createdDate).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const chartData = [["Date", "Users"], ...Object.entries(dateCounts)];
            setUserChartData(chartData);

            const addressCounts = userList?.users?.reduce((acc, user) => {
                const address = user.address || "Unknown";
                acc[address] = (acc[address] || 0) + 1;
                return acc;
            }, {});

            const addressData = [["Address", "Users"], ...Object.entries(addressCounts)];
            setUserAddressData(addressData);
        }
    }, [userList]);

    // staff
    useEffect(() => {
        if (staffList?.staffs) {
            const dateCounts = staffList?.staffs?.reduce((acc, staff) => {
                const date = new Date(staff.createdDate).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const chartData = [["Date", "Staffs"], ...Object.entries(dateCounts)];
            setStaffChartData(chartData);

            const roleCounts = staffList?.staffs?.reduce((acc, staff) => {
                const role = staff.role || "Unknown";
                acc[role] = (acc[role] || 0) + 1;
                return acc;
            }, {});

            const roleData = [["Role", "Staffs"], ...Object.entries(roleCounts)];
            setStaffRoleData(roleData);
        }
    }, [staffList]);

    // book
    useEffect(() => {
        if (context.bookData) {
            const genresCounts = context.bookData?.reduce((acc, book) => {
                const genres = book.genres || "Unknown";
                acc[genres] = (acc[genres] || 0) + 1;
                return acc;
            }, {});

            const genresData = [["Genres", "Books"], ...Object.entries(genresCounts)];
            setBookGenresData(genresData);
        }
    }, [context.bookData]);

    // orders
    useEffect(() => {
        if (context.orderData?.ordersList) {
            const data = {};
            context.orderData.ordersList.forEach(order => {
                const date = new Date(order.date).toLocaleDateString();
                const status = order.status;
                const amount = parseFloat(order.amount);
                
                if (!data[date]) { data[date] = { pending: 0, paid: 0, cancelled: 0 }; }
                
                data[date][status] += amount;
            });

            const chartData = [["Date", "Pending", "Paid", "Cancelled"]];
            Object.keys(data).forEach(date => {
                chartData.push([date, data[date].pending, data[date].paid, data[date].cancelled]);
            });

            setOrderChartData(chartData);
        }
    }, [context.orderData]);

    // reviews
    useEffect(() => {
        if (reviewList) {
            const dateCounts = reviewList?.reduce((acc, review) => {
                const date = new Date(review.createdDate).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const chartData = [["Date", "Reviews"], ...Object.entries(dateCounts)];
            setReviewChartData(chartData);
        }
    }, [reviewList]);


    const totalOrders = context.orderData?.ordersList?.length || 0;
    
    const totalRevenue = (context.orderData?.ordersList || [])
                        .filter(order => order.status === 'paid')
                        .reduce((total, order) => total + (order.amount || 0), '');

    const totalUnpaid = (context.orderData?.ordersList || [])
                        .filter(order => order.status !== 'paid')
                        .reduce((total, order) => total + (order.amount || 0), '');

    const totalBooks = context.bookData?.length || 0;
    const totalFSaleBooks = context.bookData?.filter((book) => book.isFSale).length || 0;
    const totalAuthor = context.authorData?.length || 0;
    const totalAuthorIsNominated = context.authorData?.filter((author) => author.isNominated).length || 0;
    
    // Lấy danh sách các nhà xuất bản và loại bỏ các giá trị trùng lặp
    const uniquePublishers = new Set(
        (bookData || []).map(book => book.publisher ? book.publisher.trim() : '')
        .filter(publisher => publisher.length > 0)
    );
    const totalPublisher = uniquePublishers.size; //count distinct

    const totalReview = reviewList?.length;



    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 p-3">
                <h5 className="mb-0">Báo cáo thống kê</h5>
                <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
            </div>

            <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
                <div className="col-md-12">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} title="Tổng Khách hàng" count={totalUsers} />
                        <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} grow={true} title="Tổng nhân viên" count={totalStaffs} />
                        <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<FaUserCircle />} grow={true} title="Tổng lượt đánh giá" count={totalReview} />
                       

                        <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} grow={true} title="Tổng sản phẩm" count={totalBooks} />
                        <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} grow={true} title="Tổng đơn hàng" count={totalOrders} />
                        <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<GiStarsStack />} grow={true} title="Tổng doanh thu (Paid)" count={totalRevenue} />
                        <DashboardBox color={["#1da256", "#48d483"]} icon={<GiStarsStack />} grow={true} title="Tổng doanh thu (cancelled)" count={totalUnpaid} />
                    </div>
                </div>
            </div>

            <br />

            <div className="row dashboardBoxWrapperRow ">

                {/* user charts */}
                <div className='row'>

                    <h5>Người dùng KHÁCH HÀNG</h5>
                    <div className='col-md-12'>
                        <div className='card p-4 mt-0'>
                            <div className='col'>
                                <div className='row'>

                                    {/* box 1: user line chart */}
                                    <div className='col-md-8'>
                                        <div className='card p-4 mt-0 mb-0 mt-0'>Số lượng đăng ký theo ngày</div>
                                        <Chart className='w-100'
                                            chartType="LineChart"
                                            height="200px"
                                            data={userChartData}
                                            options={{
                                                hAxis: { title: 'Ngày' },
                                                vAxis: { title: 'SL khách hàng' },
                                                legend: 'none',
                                                backgroundColor: 'transparent',
                                                colors: ['#e1950e']
                                            }}
                                        />
                                    </div>

                                    {/* box 2: user pine chart*/}
                                    <div className='col-md-4'>
                                        <div className='card p-4 mb-0 mt-0'>Số lượng theo Quận</div>
                                        <Chart
                                            chartType="PieChart"
                                            width="100%"
                                            height="200px"
                                            data={userAddressData}
                                            options={{
                                                legend: { position: 'bottom', textStyle: { color: 'black', fontSize: 12 } },
                                                colors: ['#1da256', '#c012e2', '#2c78e5', '#e1950e', '#f3cd29']
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                
                {/* Staff charts */}
                <div className='row'>
                    <h5>Người dùng NHÂN VIÊN</h5>
                    <div className='col-md-12'>
                        <div className='card p-4 mt-0 mb-0 mt-0'>
                            <div className='col'>
                                <div className='row'>

                                    {/* box 3: staff line chart */}
                                    <div className='col-md-8'>
                                        <div className='card p-4 mt-0 mb-0'>Số lượng đăng ký theo ngày</div>
                                        <Chart className='w-100'
                                            chartType="LineChart"
                                            height="200px"
                                            data={staffChartData}
                                            options={{
                                                hAxis: { title: 'Ngày' },
                                                vAxis: { title: 'SL nhân viên' },
                                                legend: 'none',
                                                backgroundColor: 'transparent',
                                                colors: ['#e1950e']
                                            }}
                                        />
                                    </div>

                                    {/* box 2: staff pie chart */}
                                    <div className='col-md-4'>
                                        <div className='card p-4 mb-0 mt-0'>Số lượng theo Phân quyền</div>
                                        <Chart
                                            chartType="PieChart"
                                            width="100%"
                                            height="200px"
                                            data={staffRoleData}
                                            options={{
                                                legend: { position: 'bottom', textStyle: { color: 'black', fontSize: 12 } },
                                                colors: ['#1da256', '#c012e2', '#2c78e5', '#e1950e', '#f3cd29']
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />


                {/* Books */}                
                <div className='row'>
                
                    <h5>Sách</h5>
                    <div className='col-md-12'>
                        <div className='card p-4 mt-0 mb-0 mt-0'>
                            <div className='col'>
                                <div className='row'>

                                    {/* box 1 */}
                                    <div className='col-md-8'>
                                        <div className='card p-4 mt-0 mb-0'>Số lượng theo thể loại</div>
                                        <Chart
                                            chartType="PieChart"
                                            width="100%"
                                            height="200px"
                                            data={bookGenresData}
                                            options={{
                                                legend: { position: 'bottom', textStyle: { color: 'black', fontSize: 12 } },
                                                colors: ['#1da256', '#c012e2', '#2c78e5', '#e1950e', '#f3cd29']
                                            }}
                                        />
                                    </div>

                                    {/* author */}
                                    <div className='col-md-4'>
                                        <div className='card p-4 mb-0 mt-0'>Số tác giả: {totalAuthor}</div>
                                        <div className='card p-4 mb-0 mt-0'>Số tác giả được đề cử: {totalAuthorIsNominated}</div>
                                        <div className='card p-4 mb-0 mt-0'>Số sách flash sale: {totalFSaleBooks}</div>
                                        <div className='card p-4 mb-0 mt-0'>Số lượng NXB: {totalPublisher}</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />


                {/* Orders */}
                <div className='row'>
                    <h5>Đơn hàng</h5>
                    <div className='col-md-12'>
                        <div className='card p-4 mt-0 mb-0 mt-0'>
                            <div className='col'>
                                <div className='row'>

                                    {/* box 1 */}
                                    <div className='col-md-12'>
                                        <div className='card p-4 mt-0 mb-0'>Doanh thu theo trạng thái thanh toán</div>
                                        <Chart
                                            chartType="LineChart"
                                            width="100%"
                                            height="300px"
                                            data={orderChartData}
                                            options={{
                                                hAxis: { title: 'Ngày' },
                                                vAxis: { title: 'Doanh thu' },
                                                legend: { position: 'top' },
                                                backgroundColor: 'transparent',
                                                colors: ['#e1950e', '#48d483', '#2c78e5']
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>







            </div>
        </div>
    );
};

export default Dashboard;
