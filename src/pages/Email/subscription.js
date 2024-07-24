import { useContext, useEffect, useState } from "react";
import { MdShoppingBag } from "react-icons/md";
import FormControl from '@mui/material/FormControl';
import HomeIcon from '@mui/icons-material/Home';
import TextField from '@mui/material/TextField';
import DashboardBox from '../../Components/Dashboard';
import { fetchDataFromApi } from '../../utils/api';
import Breadcrumb from '../../Components/Breadcrumb';
import { MyContext } from '../../App';

const Subscription = () => {
    const [subsList, setsubsList] = useState([]);


    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMail, setFilteredMail] = useState([]);

    const context = useContext(MyContext);

    const breadcrumbs = [
        { href: '/', label: 'Trang chủ', icon: <HomeIcon fontSize="small" /> },
        { href: '/subscription', label: 'Danh sách Đăng ký nhận bảng tin' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi('/api/news')
            .then((res) => {
                console.log('Fetched Subscription:', res); 
                setsubsList(res);
                setFilteredMail(res?.newsList);
                context.setProgress(100);
            })
            .catch(error => {
                console.error('Error fetching Subscription:', error);
                context.setProgress(100);
            });
    }, []);



    //search 
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = subsList?.newsList?.filter(mail => mail.email.toLowerCase().includes(query));
        setFilteredMail(filtered);
    };



    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 p-3">
                    <h5 className="mb-0">Danh sách Email</h5>
                    <div className="p-2"><Breadcrumb breadcrumbs={breadcrumbs} /></div>
                </div>

                <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2 pt-0">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<MdShoppingBag />} title="Tổng số mail" count={filteredMail.length} grow={true} />
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Danh sách Email</h3>

                    {/* search */}
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>Tìm email</h4>
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
                                    <th>Mã đăng ký</th>
                                    <th>EMAIL</th>
                                    <th>Ngày đăng ký</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMail.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.email}</td>
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

export default Subscription;
