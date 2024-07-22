import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';

import DashboardBox from '../../Components/Dashboard';
import { deleteData } from "../../utils/api";
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from "../../App";


const AuthorList = () => {

    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAuthors, setFilteredAuthors] = useState([]);

    const [nominatedSearchQuery, setNominatedSearchQuery] = useState("");

    const { fetchAuthorList, authorData } = useContext(MyContext);



    useEffect(() => {
        const loadAuthors = async () => {
            try {
                setIsLoading(true);
                context.setProgress(40);
                await fetchAuthorList();
                context.setProgress(100);
                setFilteredAuthors(context.authorData);

            } catch (error) {
                console.error("Failed to fetch author list", error);
                context.setAlertBox({ open: true, error: true, msg: 'Failed to load author data!' });
                context.setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadAuthors();
    }, []);

    useEffect(() => {
        setFilteredAuthors(context.authorData); // Update filteredAuthors khi author thay đổi
    }, [context.authorData]);
    
    

    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/authorList', label: 'Danh sách tác giả' }
    ];


    const deleteBook = (id) => {
        const confirmed = window.confirm("Bạn có chắn muốn xóa tác giả này không?");
        if (confirmed) {
            setIsLoading(true);
            deleteData(`/api/authors/${id}`).then((res) => {
                context.setProgress(100);
                context.setAlertBox({ open: true, error: false, msg: 'Tác giả đã được xóa!' });

                // Update the author list after deletion
                const updatedAuthorList = context.authorData.filter((author) => author._id !== id);
                fetchAuthorList(); 
                setFilteredAuthors(updatedAuthorList);

                setIsLoading(false);
                setTimeout(() => context.setAlertBox({ open: false, error: false, msg: '' }), 2000);
            });
        }
    }; 

    //search 
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const handleSearchChangeNominated = (e) => {
        const query = e.target.value.toLowerCase();
        console.log("handleSearchChangeNominated: " + query);
        setNominatedSearchQuery(query);
    };

    useEffect(() => {
        if (context.authorData) {
            applyFilters(searchQuery, nominatedSearchQuery);
        }
    }, [searchQuery, nominatedSearchQuery]);


    const applyFilters = (searchQuery, nominatedSearchQuery) => {
        let filtered = context.authorData || [];
    
        if (searchQuery) {
            filtered = filtered.filter(author => author.name.toLowerCase().includes(searchQuery));
        }
    
        if (nominatedSearchQuery) {
            if (nominatedSearchQuery === "n") {
                filtered = filtered.filter(author => author.isNominated === false);
            } 
            else if (nominatedSearchQuery === "y") {
                filtered = filtered.filter(author => author.isNominated === true);
            }
        }
    
        setFilteredAuthors(filtered);
    };


    // count nominated:
    const nominatedCount = context.authorData?.filter(author => author.isNominated).length;


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách tác giả</h5>
                    <div className='p-2'><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<IoPersonSharp />} title="Tổng số tác giả" count={context.authorData?.length}/>
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<IoPersonSharp />} title="Tổng số tác giả được đề cử" count={nominatedCount}/>
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<IoPersonSharp />} title="Tổng số tác giả theo tìm kiếm" count={filteredAuthors?.length || 0}/>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Danh sách tác giả</h3>


                    {/* search by author */}
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Tìm Tên tác giả</h4>
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

                        <div className="col-md-3">
                            <h4>Tìm để cử</h4>
                            <FormControl size="small" className="w-100">
                                <TextField 
                                    size="small"
                                    className="w-100"
                                    variant="outlined"
                                    placeholder="y/n..."
                                    value={nominatedSearchQuery}
                                    onChange={handleSearchChangeNominated}
                                />
                            </FormControl>
                        </div>

                    </div>


                    {/* Add button */}
                    <div className="add-row mt-3">
                        <div className="actions d-flex align-items-center">
                            <Link to='/authorList/authorAdd'><Button color="success"><FaPlus /></Button></Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>THAO TÁC</th>
                                    <th>TÊN TÁC GIẢ</th>
                                    <th>ID</th>
                                    <th>CTN BOOK</th>
                                    <th>ĐỀ CỬ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAuthors?.map((item) =>(
                                // {/* {context.authorData?.map((item) => ( */}
                                    <tr key={item._id}>
                                        <td className="align-center">
                                            <div className="actions d-flex align-items-center">
                                                <Link to={`/authorList/authorEdit/${item._id}`}>
                                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                                </Link>
                                                <Button className="error" color="error" onClick={() => deleteBook(item._id)}><MdDelete /></Button>
                                            </div>
                                        </td>

                                        <td>{item.name}</td>
                                        <td>{item._id}</td>
                                        <td>{item.ctnBook}</td>
                                        <td>{item.isNominated === false || item.isNominated === undefined ? "Không" : "Có"}</td>
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

export default AuthorList;
