import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import APIs, { endpoints, authAPI } from '../../configs/APIs';
import './Styles.css';

const DanhSachSinhVien = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKhoa, setSelectedKhoa] = useState('');
    const [selectedLop, setSelectedLop] = useState('');
    const [khoas, setKhoas] = useState([]);
    const [lops, setLops] = useState([]);
    const [reportType, setReportType] = useState('khoa');
    const [sv, setSv] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchKhoas = async () => {
        try {
            const response = await APIs.get(endpoints['khoa']);
            setKhoas(response.data);
        } catch (error) {
            console.error(error);
            setError('Không thể tải dữ liệu khoa');
        }
    };

    const fetchLops = async (khoaId) => {
        try {
            const response = await APIs.get(`${endpoints['khoa']}${khoaId}/lops/`);
            setLops(response.data);
        } catch (error) {
            console.error(error);
            setError('Không thể tải dữ liệu lớp');
        }
    };

    useEffect(() => {
        fetchKhoas();
    }, []);

    useEffect(() => {
        if (selectedKhoa) {
            fetchLops(selectedKhoa);
        }
    }, [selectedKhoa]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            setSv([]);
            let ressv = null;

            if (!isNaN(searchQuery)) {
                if (reportType === 'khoa') {
                    ressv = await authAPI().get(`/khoas/${selectedKhoa}/sinhviens/?mssv=${searchQuery}`);
                } else if (reportType === 'lop') {
                    ressv = await authAPI().get(`/lops/${selectedLop}/sinhviens/?mssv=${searchQuery}`);
                }
            } else {
                if (reportType === 'khoa') {
                    ressv = await authAPI().get(`/khoas/${selectedKhoa}/sinhviens/?ho_ten=${searchQuery}`);
                } else if (reportType === 'lop') {
                    ressv = await authAPI().get(`/lops/${selectedLop}/sinhviens/?ho_ten=${searchQuery}`);
                }
            }

            if (ressv.data.length > 0) {
                setSv(ressv.data);
            } else {
                setSv(null);
                setError('Không tìm thấy sinh viên');
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Đã xảy ra lỗi khi tìm kiếm sinh viên');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedKhoa || selectedLop) {
            handleViewReport();
        }
    }, [selectedKhoa, selectedLop]);

    const handleViewReport = async () => {
        if (!selectedKhoa || (reportType === 'lop' && !selectedLop)) {
            setError('Vui lòng chọn đầy đủ thông tin.');
            return;
        }

        try {
            let response = null;
            setLoading(true);
            setSv([]);

            if (searchQuery === '') {
                if (reportType === 'khoa') {
                    response = await APIs.get(`/khoas/${selectedKhoa}/sinhviens/`);
                } else if (reportType === 'lop') {
                    response = await APIs.get(`/lops/${selectedLop}/sinhviens/`);
                }

                if (response.data && Array.isArray(response.data)) {
                    setSv(response.data);
                } else {
                    setSv([]);
                    setError('Dữ liệu trả về không hợp lệ');
                }
            } else {
                handleSearch();
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Đã xảy ra lỗi khi tải danh sách sinh viên');
            setLoading(false);
        }
    };
    const handleNavigateToAchievements = (sinhvien)=>(e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định
        navigate('/thanh-tich-ngoai-khoa', { state: { sinhvien_id: sinhvien.id } });
      };

    return (
        <div >
             <div fluid className="registration-background" >
        <Container className='mt-3'>
            <Card className="mb-4 card1">
                    <Card.Header className="mb-4 custom-title">
                        <h1 >Danh sách sinh viên</h1>
                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                    </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Nhập họ tên sinh viên hoặc MSSV..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="">Chọn loại xem</option>
                                <option value="khoa">Theo khoa</option>
                                <option value="lop">Theo lớp</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Form.Select
                                value={selectedKhoa}
                                onChange={(e) => setSelectedKhoa(e.target.value)}
                            >
                                <option value="">Chọn khoa</option>
                                {khoas.map(khoa => (
                                    <option key={khoa.id} value={khoa.id}>{khoa.ten_khoa}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    {reportType === 'lop' && (
                        <Row className="mt-3">
                            <Col>
                                <Form.Select
                                    value={selectedLop}
                                    onChange={(e) => setSelectedLop(e.target.value)}
                                    disabled={!selectedKhoa}
                                >
                                    <option value="">Chọn lớp</option>
                                    {lops.map(lop => (
                                        <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
            <Row className="mt-3">
                <Col>
                    {loading ? (
                        <Spinner animation="border" />
                    ) : (
                        sv && sv.length > 0 ? (
                            sv.map(s => (
                                <Card key={s.id} className="mb-3 card1">
                                    <Card.Body>
                                        <Row>
                                            <Col md={10}>
                                                <h5>Họ tên: {s.ho_ten}</h5>
                                                <p>MSSV: {s.mssv}</p>
                                            </Col>
                                            <Col md={2} className="text-right">
                                                <Button
                                                    variant="info"
                                                    onClick={handleNavigateToAchievements(s)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <Alert variant="warning">Không tìm thấy sinh viên</Alert>
                        )
                    )}
                </Col>
            </Row> 
        </Container>
        </div>
        </div>
    );
};

export default DanhSachSinhVien;
