import React, { useContext, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import Button from '@mui/material/Button';
import { BsFiletypeCsv } from 'react-icons/bs';
import Papa from 'papaparse'; 
import { MyContext } from "../../App";
import { postFile } from '../../utils/api';

const UploadCSV = () => {
    const context = useContext(MyContext);
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [modal, setModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggle = () => setModal(!modal);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);

        // Parse CSV locally if needed
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const parsedData = result.data.map(item => ({
                        title: item.title?.toString() || '',
                        author: item.author?.toString() || '',
                        rating: parseFloat(item.rating) || 0,
                        description: item.description?.toString() || '',
                        language: item.language?.toString() || '',
                        genres: item.genres?.toString() || '',
                        pages: Number(item.pages) || 0,
                        basePrice: Number(item.basePrice) || 0,
                        discountPercent: Number(item.discountPercent) || 0,
                        publisher: item.publisher?.toString() || '',
                        cover: item.cover?.toString() || '',
                        isFSale: item.isFSale === '1' ? true : false
                    }));
                    setCsvData(parsedData);
                    setModal(true); // Show preview modal
                },
                error: (error) => {
                    console.error("Error parsing CSV file: ", error);
                    setError('Error parsing CSV file. Please check the file format and try again.');
                }
            });
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setIsLoading(true);
            setError('');

            try {
                const res = await postFile('/api/books/upload', formData);
                console.log('Data uploaded successfully', res);
                context.setAlertBox({ open: true, error: false, msg: 'Data uploaded successfully!' });
                setTimeout(() => {
                    context.setAlertBox({ open: false, error: false, msg: 'Lưu file thành công' }); 
                    }, 2000 );
            } 
            catch (error) {
                console.error('Error uploading data', error);
                setError('Error uploading data. Please try again later.');
                context.setAlertBox({ open: true, error: true, msg: 'Lưu file không thành công!' });
            } 
            finally {
                setIsLoading(false);
                setModal(false);
            }
        }
    };

    return (
        <div>
            <Button color="success" className="position-relative">
                <BsFiletypeCsv />
                <input
                    type="file"
                    name="csv"
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                    onChange={handleFileChange}
                />
            </Button>

            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Xem chi tiết dữ liệu</ModalHeader>
                <ModalBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Table responsive>
                        <thead>
                            <tr>
                                {csvData.length > 0 && Object.keys(csvData[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpload} disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Xác nhận'}
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default UploadCSV;
