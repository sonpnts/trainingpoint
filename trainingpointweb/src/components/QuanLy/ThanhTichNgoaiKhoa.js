import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Container, Row, Col, Form, Table, Alert, Card, Spinner } from 'react-bootstrap';
import APIs, { endpoints, BASE_URL, authAPI } from '../../configs/APIs';
import FileSaver from 'file-saver';

import './Styles.css';

const ThanhTichNgoaiKhoa = () => {
    const location = useLocation();
    const sinhvien_id = location.state?.sinhvien_id;
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [sv, setSv] = useState(null);
    const [hoatDongDiemDanh, setHoatDongDiemDanh] = useState([]);
    const [dieus, setDieus] = useState([]);
    const [diemRenLuyen, setDiemRenLuyen] = useState('');
    const [lops, setLops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const xepLoaiMap = {
        1: 'Xuất Sắc',
        2: 'Giỏi',
        3: 'Khá',
        4: 'Trung Bình',
        5: 'Yếu',
        6: 'Kém'
    };

    const fetchHocKyNamHocs = async () => {
        try {
            const response = await APIs.get(endpoints['hoc_ky_nam_hoc']);
            setHocKyNamHocs(response.data);
        } catch (error) {
            setError('Không thể tải dữ liệu học kỳ năm học');
            console.error(error);
        }
    };

    const fetchDieus = async () => {
        try {
            const response = await APIs.get(endpoints['dieu']);
            setDieus(response.data);
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu Dieus.');
            console.error(error);
        }
    };

    const fetchLops = async () => {
        try {
            const resLop = await APIs.get(endpoints['lop']);
            setLops(resLop.data.results);
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu Lớp.');
            console.error(error);
        }
    };

    const fetchSinhVien = async (sinhvien_id) => {
        try {
            const response = await authAPI().get(`${endpoints['sinh_vien']}${sinhvien_id}/`); 
            setSv(response.data);
            setLoading(false);
        } catch (error) {
            setError('Không thể tải thông tin sinh viên');
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHocKyNamHocs();
        fetchDieus();
        fetchLops();
        fetchSinhVien(sinhvien_id);
    }, [sinhvien_id]);

    const handleViewReport = async (id) => {
        if (!selectedHocKyNamHoc || !sv) {
            setError('Vui lòng chọn đầy đủ thông tin');
            return;
        }
        try {
            const resHoatDongDiemDanh = await APIs.get(`/thamgias/hoat-dong-diem-danh/${sv.id}/${id}/`);
            setHoatDongDiemDanh(resHoatDongDiemDanh.data);

            try {
                const resDiemRenLuyen = await APIs.get(`/diemrenluyens/${sv.id}/${id}/`);
                if (resDiemRenLuyen.status === 200)
                    setDiemRenLuyen(resDiemRenLuyen.data);
            } catch {
                setError('Sinh viên không có điểm ở kỳ này');
            }
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu điểm rèn luyện');
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedHocKyNamHoc)
            handleViewReport(selectedHocKyNamHoc);
        setDiemRenLuyen('');
    }, [selectedHocKyNamHoc]);

    const findClassName = (classId) => {
        const foundClass = Array.isArray(lops) && lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : "";
    };

    const handleExportReport = async (format) => {
        try {
            const formatValue = format === 'csv' ? 1 : 2;

            let url = `${BASE_URL}bao-cao-chi-tiet/${sv.id}/${selectedHocKyNamHoc}/${formatValue}/`;

            const response = await authAPI().get(url, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            FileSaver.saveAs(blob, `bao_cao_${format}.${format}`);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    const groupedHoatDongDiemDanh = () => {
        const grouped = {};

        hoatDongDiemDanh.forEach((hoatDong) => {
            const dieu = dieus.find(d => d.id === hoatDong.dieu);
            if (dieu) {
                if (!grouped[dieu.id]) {
                    grouped[dieu.id] = {
                        dieu: dieu.ten_dieu,
                        diemToiDa: dieu.diem_toi_da,
                        activities: [],
                        totalDiem: 0
                    };
                }
                grouped[dieu.id].activities.push(hoatDong);
                grouped[dieu.id].totalDiem += hoatDong.diem_ren_luyen;
            }
        });

        return grouped;
    };
    let globalIndex = 1;

    return (
            <div>
            <div fluid className="registration-background">
            <div>
        <Container>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {loading ? (
                <Spinner animation="border" className="d-block mx-auto my-4" />
            ) : (
                <>
                    <Row className="mt-4">
                        <Col>
                            <Form.Group>
                                <Form.Label style={{ fontSize: '1.5rem' }}><strong>Chọn học kỳ năm học</strong></Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedHocKyNamHoc}
                                    onChange={(e) => setSelectedHocKyNamHoc(e.target.value)}
                                    custom
                                >
                                    <option value="">Chọn học kỳ năm học</option>
                                    {hocKyNamHocs.map(hocKyNamHoc => (
                                        <option key={hocKyNamHoc.id} value={hocKyNamHoc.id}>
                                            {hocKyNamHoc.hoc_ky} - {hocKyNamHoc.nam_hoc}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <Card className="card1">
                                <Card.Body>
                                    <Card.Title className="text-danger mb-4 card1" style={{ fontSize: '2rem' }}>Thông tin sinh viên</Card.Title>
                                    {sv ? (
                                        <>
                                            <Card.Text><strong className='card1'>Họ và tên:</strong> {sv.ho_ten}</Card.Text>
                                            <Card.Text><strong>Lớp:</strong> {findClassName(sv.lop)}</Card.Text>
                                            <Card.Text><strong>MSSV:</strong> {sv.mssv}</Card.Text>
                                        </>
                                    ) : (
                                        <Card.Text>Không tìm thấy thông tin sinh viên</Card.Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className=" mt-4 card1">
                                <Card.Body>
                                    <Card.Title className="text-primary mb-4 card1" style={{ fontSize: '2rem' }}>DS hoạt động ngoại khóa đã tham gia</Card.Title>
                                    <Table striped bordered hover className="table-bordered">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Minh chứng</th>
                                                <th>Điểm SV</th>
                                                <th>Điểm tối đa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(groupedHoatDongDiemDanh()).map(([dieuId, group], index) => (
                                                <>
                                                    <tr key={`header-${dieuId}`} className="table-primary">
                                                        <td colSpan="2"><strong>Điều {dieuId}: {group.dieu}</strong></td>
                                                        <td>{group.totalDiem}</td>
                                                        <td>{group.diemToiDa}</td>
                                                    </tr>
                                                    {group.activities.map((activity, idx) => (
                                                        <tr key={activity.id}>
                                                            <td>{globalIndex++}</td>
                                                            <td>{activity.ten_HD_NgoaiKhoa}</td>
                                                            <td>{activity.diem_ren_luyen}</td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-4 card2">
                        <Col  className="card2">
                            <Button variant="primary" onClick={() => handleExportReport('pdf')}>Xuất PDF</Button>{' '}
                            <Button variant="secondary" onClick={() => handleExportReport('csv')}>Xuất CSV</Button>
                        </Col>
                    </Row>
                              
                    <Row className="mt-4 card1">
                        <Col>
                            <Card>
                                <Card.Body className="card1">
                                    <Card.Title className="text-danger mb-4 card1" style={{ fontSize: '2rem' }}>Tổng kết</Card.Title>
                                    <Card.Text><strong>Tổng điểm rèn luyện:</strong> {diemRenLuyen?.diem_tong || 0}</Card.Text>
                                    <Card.Text><strong>Xếp loại:</strong> {xepLoaiMap[diemRenLuyen?.xep_loai] || "Chưa có"}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
                </div>
        <br></br>
        </div>
        </div>
    );
};

export default ThanhTichNgoaiKhoa;
