import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Spinner, Table, Alert, Button } from 'react-bootstrap';
import APIs, { endpoints, authAPI } from '../../configs/APIs';
import { useNavigate } from 'react-router-dom';
import './Styles.css';


const HDNKChuaDiemDanh = () => {
    const [loading, setLoading] = useState(true);
    const [hoatDongChuaDiemDanh, setHoatDongChuaDiemDanh] = useState([]);
    const [sv, setSv] = useState(null);
    const [lops, setLops] = useState([]);
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [hoatDongs, setHoatDongs] = useState([]);
    const navigate = useNavigate();

    const trangThaiMap = {
        0: 'Đăng Ký',
        1: 'Điểm Danh',
        2: 'Báo Thiếu',
        3: 'Báo Thiếu Bị Từ Chối',
    };

    const fetchHocKyNamHocs = async () => {
        try {
            const response = await APIs.get(endpoints['hoc_ky_nam_hoc']);
            if (response.data && Array.isArray(response.data)) {
                setHocKyNamHocs(response.data);
            } else {
                setHocKyNamHocs([]);
                console.error('Dữ liệu trả về không phải là một mảng');
            }
        } catch (error) {
            console.error(error);
            setHocKyNamHocs([]);
            alert('Lỗi', 'Không thể tải dữ liệu học kỳ năm học');
        }
    };

    const fetchUserData = async () => {
        try {
            const reslop = await APIs.get(endpoints['lop']);
            const reshd = await authAPI().get(endpoints['hoatdong']);
            setHoatDongs(reshd.data);
            setLops(reslop.data.results);
            
            const ressv = await authAPI().get(endpoints['current_sinhvien']);
           
            setSv(ressv.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            setLoading(false);
        }
    };

    const handleViewReport = async (id) => {
        if (!id) {
            alert('Lỗi', 'Vui lòng chọn đầy đủ thông tin.');
            return;
        }
        try {
            const reshoatdongchuadiemdanh = await authAPI().get(`/thamgias/hoat-dong-chua-diem-danh/${sv.id}/${id}/`);
            setHoatDongChuaDiemDanh(reshoatdongchuadiemdanh.data);
        } catch (error) {
            console.error(error);
            alert('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu điểm rèn luyện.');
        }
    };
    const handleClick = (id) => (e) => {
        e.preventDefault();
        navigate("/minh-chung", { state: { thamgia_id: id } });
    };
    

    useEffect(() => {
        fetchHocKyNamHocs();
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedHocKyNamHoc) {
            handleViewReport(selectedHocKyNamHoc);
        }
    }, [selectedHocKyNamHoc]);

    const findClassName = (classId) => {
        const foundClass = Array.isArray(lops) && lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : "";
    };

    const findHoatDongName = (hoatdongId) => {
        const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.ten_HD_NgoaiKhoa : "";
    };

    const findHoatDongDRL = (hoatdongId) => {
        const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.diem_ren_luyen : "";
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <div >
            <div fluid className="registration-background">

           
        <Container className='mt-3'>
            {/* <h1 className="my-4">Thông tin sinh viên</h1>
            {sv ? (
                <div className="mb-4">
                    <p><strong>Họ và tên:</strong> {sv.ho_ten}</p>
                    <p><strong>Lớp:</strong> {findClassName(sv.lop)}</p>
                    <p><strong>MSSV:</strong> {sv.mssv}</p>
                </div>
            ) : (
                <Alert variant="danger">Không tìm thấy thông tin sinh viên</Alert>
            )} */}

            <Form.Group controlId="hocKyNamHocSelect" className="mb-4">
                <Form.Label>Chọn học kỳ năm học</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedHocKyNamHoc}
                    onChange={(e) => setSelectedHocKyNamHoc(e.target.value)}
                >
                    <option value="">Chọn học kỳ năm học</option>
                    {hocKyNamHocs.map(hocKyNamHoc => (
                        <option key={hocKyNamHoc.id} value={hocKyNamHoc.id}>
                            {hocKyNamHoc.hoc_ky} - {hocKyNamHoc.nam_hoc}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <h2 className="mb-4">Danh sách hoạt động ngoại khóa chưa điểm danh</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tên hoạt động</th>
                        <th>Điểm rèn luyện</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {hoatDongChuaDiemDanh.map(hd => (
                        <tr key={hd.id} onClick={handleClick(hd.id)}>
                            <td>{findHoatDongName(hd.hd_ngoaikhoa)}</td>
                            <td>{findHoatDongDRL(hd.hd_ngoaikhoa)}</td>
                            <td>{trangThaiMap[hd.trang_thai]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
        </div>

        </div>
    );
};

export default HDNKChuaDiemDanh;
