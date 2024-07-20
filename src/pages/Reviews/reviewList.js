import { useContext, useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';

import { MdShoppingBag } from "react-icons/md";
import { RxEyeOpen } from "react-icons/rx";
import { TbEyeClosed } from "react-icons/tb";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import DashboardBox from '../../Components/Dashboard';
import { editData, fetchDataFromApi } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';

const ReviewList = () => {

    const navigate = useNavigate();

    const [reviewList, setReviewList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredReviews, setFilteredReviews] = useState([]);

    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        isVisible: false
    });

    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/reviewList', label: 'Danh sách đánh giá của khách hàng' }
    ];


    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi('/api/reviews')
            .then((res) => {
                console.log('Fetched Reviews:', res); 
                setReviewList(res);
                setFilteredReviews(res);
                context.setProgress(100);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                context.setProgress(100);
            });
    }, []);

    const handleToggleReview = (id, isVisible) => {
        const confirmed = window.confirm(
            isVisible === true ? 
                                        'Bạn có chắc chắn muốn tắt hiển thị đánh giá này không?' : 
                                        'Bạn có chắc chắn muốn mở hiển thị đánh giá này không?'
                                        );

        if (confirmed) {
            context.setProgress(100);
            setFormFields({ isVisible: !isVisible });

            setIsLoading(true);
            console.log("id: " + id);
            editData(`/api/reviews/${id}`, { isVisible: !isVisible })
                .then((res) => {
                    // context.setAlertBox({ open: true, error: false, msg: isVisible ? 'Trạng thái của đánh giá đã được tắt' : 'Trạng thái của đánh giá đã được bật' });
                    setReviewList(reviewList.map(review => review.id === id ? { ...review, isVisible: !isVisible } : review));
                    setTimeout(() => {
                        context.setAlertBox({ open: true, error: false, msg: isVisible ? 'Trạng thái của đánh giá đã được tắt' : 'Trạng thái của đánh giá đã được bật' });
                        // navigate('/reviewList'); 
                        navigate(0);
                        setIsLoading(false);}, 2000
                    );
                })
                .catch(error => {
                    setIsLoading(false);
                    console.error('Error updating review:', error);
                });
        }
    };


    //search 
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = reviewList.filter(review => review.productId.toLowerCase().includes(query));
        setFilteredReviews(filtered);
    };


    // expend/collapse review cells
    const [expandedRows, setExpandedRows] = useState({});
    const toggleRowExpansion = (_id) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [_id]: !prevState[_id]
        }));
    };

    const renderDescription = (description, _id) => {
        const isExpanded = expandedRows[_id];
        const shortDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description;
        return (
            <div style={{ width: '300px' }}>
                {isExpanded ? description : shortDescription}
                {description.length > 100 && (
                    <Button color="primary" onClick={() => toggleRowExpansion(_id)}>
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách đánh giá</h5>
                    <div className="p-2"><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số đánh giá" count={filteredReviews.length} grow={true} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Danh sách đánh giá</h3>

                    {/* search by book */}
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Tìm mã sách</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="nhập tại đây..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ĐỔI TRẠNG THÁI</th>
                                    <th>TRẠNG THÁI</th>
                                    <th>MÃ SÁCH</th>
                                    <th>TÊN KHÁCH HÀNG</th>
                                    <th>ID KHÁCH HÀNG</th>
                                    <th>NỘI DUNG</th>
                                    <th>NGÀY ĐÁNH GIÁ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((item) => (
                                    <tr key={item._id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                {item.isVisible ?
                                                     <Button className="success" color="success" onClick={() => handleToggleReview(item._id, item.isVisible)}><TbEyeClosed /></Button> :
                                                     <Button className="error" color="error" onClick={() => handleToggleReview(item._id, item.isVisible)}><RxEyeOpen /></Button>}
                                            </div>
                                        </td>
                                        <td>{item.isVisible === true ? "Có" : "không"}</td>
                                        <td>{item.productId}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.customerId}</td>
                                        <td>{renderDescription(item.review, item._id)}</td>
                                        <td>{item.dateCreated}</td>
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

export default ReviewList;
