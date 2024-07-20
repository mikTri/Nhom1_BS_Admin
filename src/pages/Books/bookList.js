import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdShoppingBag, MdCategory, MdDelete } from "react-icons/md";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import HomeIcon from '@mui/icons-material/Home';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import DashboardBox from '../../Components/Dashboard';
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';
import UploadCSV from './uploadCSV';
import { MyContext } from "../../App";

const BookList = () => {
    
    const [categoryVal, setCategoryVal] = useState('all');
    const [page, setPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalCategory, setTotalCategory] = useState(0);
    const [bookList, setBookList] = useState({ books: [], totalBooks: 0, booksPerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);


    const breadcrumbs = [
        { href: '/home', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/bookList', label: 'Danh sách sản phẩm' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi("/api/books?page=1&perPage=10").then((res) => {
            setBookList(res);
            setTotalBooks(res.totalBooks);
            context.setProgress(100);
        });

        fetchDataFromApi("/api/books/get/count").then((res) => setTotalBooks(res.booksCount));
        fetchDataFromApi("/api/categories/get/count").then((res) => setTotalCategory(res.categoryCount));
    }, []);

    const deleteBook = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa sách này không?");
        if (confirmed) {
            setIsLoading(true);
            deleteData(`/api/books/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Sách đã được xóa!' });
                fetchDataFromApi(`/api/books?page=${page}&perPage=10`).then((res) => {
                    setBookList(res);
                    setIsLoading(false);
                });
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: '' }), 2000);
            });
        }
    };

    const handleChange = (event, value) => {
        context.setProgress(40);
        setPage(value);
        fetchDataFromApi(`/api/books?page=${value}&perPage=10`).then((res) => {
            setBookList(res);
            context.setProgress(100);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        });
    };


    const handleChangeCategory = (event) => {
        const selectedCategory = event.target.value;
        setCategoryVal(selectedCategory);

        console.log("event: " + event);
        console.log("selectedCategory: " + selectedCategory);
        console.log("event.target.value: " + event.target.value);
        if (selectedCategory !== "all") {
            fetchDataFromApi(`/api/categories/${selectedCategory}`).then((res) => {
                const catName = encodeURIComponent(res.name);
                fetchDataFromApi(`/api/books?genres=${catName}`).then((res) => {
                    setBookList(res);
                    context.setProgress(100);
                });
            });

            // fetchDataFromApi(`/api/categories/${selectedCategory}`).then((res) => {
            //     const catName = encodeURIComponent(res.name);
            //     fetchDataFromApi(`/api/books?genres=${catName}`).then((res) => {
            //         setBookList(res);
            //         context.setProgress(100);
            //     });
            // });
        } else {
            setCategoryVal(selectedCategory);
            fetchDataFromApi(`/api/books?page=${1}&perPage=${20}`).then((res) => {
                setBookList(res);
                context.setProgress(100);
            });
        }
    };



    // thu gọn cột Mô tả sách:
    const [expandedRows, setExpandedRows] = useState({});
    const toggleRowExpansion = (id) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };
    const renderDescription = (description, id) => {
        const isExpanded = expandedRows[id];
        const shortDescription = description.length > 100 ? `${description.substring(0, 100)}...` : description;
        return (
            <div style={{ width: '300px' }}>
                {isExpanded ? description : shortDescription}
                {description.length > 100 && (
                    <Button color="primary" onClick={() => toggleRowExpansion(id)}>
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                )}
            </div>
        );
    };


    // count total page
    const totalPageCount = Math.ceil((bookList.totalBooks || 1) / (bookList.booksPerPage || 1));



    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách sản phẩm</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số lượng sách" count={totalBooks} grow={true} />
                            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<MdCategory />} title="Tổng thể loại sách" count={totalCategory} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Danh sách Sách</h3>

                    {/* Category selection */}
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">

                            <h4>THỂ LOẠI</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={categoryVal || ''}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='w-100'
                                    renderValue={(selected) => {
                                        if (selected === "all") { return <em>Tất cả</em>; }
                                        const selectedCategory = context.catData?.find(cat => cat._id === selected);
                                        return selectedCategory ? selectedCategory.name : <em>Tất cả</em>;
                                    }}
                                >
                                    <MenuItem value="all"><em>Tất cả</em></MenuItem>
                                    {context.catData?.map((cat, index) => (
                                        <MenuItem className="text-capitalize" value={cat._id} key={index}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                        </div>
                    </div>

                    {/* Add button */}
                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to='/bookList/bookAdd'><Button color="success"><FaPlus /></Button></Link>
                            <UploadCSV />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Thao tác</th>
                                    <th>TRANG BÌA</th>
                                    <th>TÊN SÁCH</th>
                                    <th>TÁC GIẢ</th>
                                    <th>THỂ LOẠI</th>
                                    <th>XẾP HẠNG</th>
                                    <th>MÔ TẢ</th>
                                    <th>NGÔN NGỮ</th>
                                    <th>SỐ TRANG</th>
                                    <th>GIÁ GỐC</th>
                                    <th>% GIẢM GIÁ</th>
                                    <th>VND GIẢM GIÁ</th>
                                    <th>NXB</th>
                                    <th>ĐÃ BÁN</th>
                                    <th>FLASHSALE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookList?.books?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/bookList/bookEdit/${item._id}`}>
                                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                                </Link>
                                                <Button className="error" color="error" onClick={() => deleteBook(item._id)}><MdDelete /></Button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img card shadow m-0 w-100">
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            className="w-100"
                                                            src={item.cover || '/img/book.svg'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                        <td>{item.genres}</td>
                                        <td><Rating name="read-only" defaultValue={item.rating ?? 0} precision={0.5} size="small" readOnly /></td>
                                        <td>{renderDescription(item.description, item._id)}</td>
                                        <td>{item.language}</td>
                                        <td>{item.pages}</td>
                                        <td>{item.basePrice}</td>
                                        <td>{item.discountPercent}</td>
                                        <td>{item.discountPrice}</td>
                                        <td>{item.publisher}</td>
                                        <td>{item.salesNum}</td>
                                        <td>{item.isFSale ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center">
                        <Pagination
                            count={totalPageCount}
                            page={page}
                            onChange={handleChange}
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookList;
