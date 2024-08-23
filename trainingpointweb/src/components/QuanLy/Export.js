import React, { useState, useEffect } from 'react';
import { Button, Alert, Form, Col, Row, Container, Card, Spinner } from 'react-bootstrap';
import APIs, { endpoints, BASE_URL, authAPI } from '../../configs/APIs';
import axios from 'axios';
import { saveAs } from 'file-saver';
import cookie from 'react-cookies';

import './Styles.css';


const ExportBaoCao = () => {
    const [selectedKhoa, setSelectedKhoa] = useState('');
    const [selectedLop, setSelectedLop] = useState('');
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [khoas, setKhoas] = useState([]);
    const [lops, setLops] = useState([]);
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [reportType, setReportType] = useState('khoa');
    const [diemrenluyens, setDiemrenluyens] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchKhoas = async () => {
        try {
            setLoading(true);
            const response = await APIs.get(endpoints['khoa']);
            setKhoas(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Không thể tải dữ liệu khoa');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchLops = async (khoaId) => {
        try {
            setLoading(true);
            const response = await APIs.get(`${endpoints['khoa']}${khoaId}/lops/`);
            setLops(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Không thể tải dữ liệu lớp');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    const fetchHocKyNamHocs = async () => {
        try {
            setLoading(true);
            const response = await APIs.get(endpoints['hocky']);
            setHocKyNamHocs(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Không thể tải dữ liệu học kỳ năm học');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKhoas();
        fetchHocKyNamHocs();
    }, []);

    useEffect(() => {
        if (selectedKhoa) {
            fetchLops(selectedKhoa);
        }
    }, [selectedKhoa]);

    const handleViewReport = async () => {
        if (!selectedHocKyNamHoc || !selectedKhoa || (reportType === 'lop' && !selectedLop)) {
            setAlertMessage('Vui lòng chọn đầy đủ thông tin.');
            setAlertVariant('danger');
            return;
        }

        try {
            setLoading(true);
            let response;
            if (reportType === 'khoa') {
                response = await authAPI().get(`/thong-ke-khoa/${selectedKhoa}/${selectedHocKyNamHoc}/`);
            } else {
                response = await authAPI().get(`/thong-ke-lop/${selectedLop}/${selectedHocKyNamHoc}/`);
            }

            setDiemrenluyens(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Đã xảy ra lỗi khi tải dữ liệu điểm rèn luyện.');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format) => {
        try {
            setLoading(true);
            const formatValue = format === 'csv' ? 1 : 2;
            let url;

            if (reportType === 'khoa') {
                if (!selectedKhoa || !selectedHocKyNamHoc) {
                    setAlertMessage('Vui lòng chọn khoa và học kỳ năm học.');
                    setAlertVariant('danger');
                    return;
                }
                url = `${BASE_URL}bao-cao-khoa/${selectedKhoa}/${selectedHocKyNamHoc}/${formatValue}/`;
            } else {
                if (!selectedLop || !selectedHocKyNamHoc) {
                    setAlertMessage('Vui lòng chọn lớp và học kỳ năm học.');
                    setAlertVariant('danger');
                    return;
                }
                url = `${BASE_URL}bao-cao-lop/${selectedLop}/${selectedHocKyNamHoc}/${formatValue}/`;
            }

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${cookie.load("token")}` },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
            saveAs(blob, `bao_cao.${format}`);

            setAlertMessage(`Đã lưu báo cáo dưới dạng ${format}`);
            setAlertVariant('success');
        } catch (error) {
            console.error(error);
            setAlertMessage('Không thể tải xuống báo cáo');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
            <div fluid className="registration-background">
    <Card className='card5'>
        <Container className="my-4">
            {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                    {alertMessage}
                </Alert>
            )}

            {loading && (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {!loading && (
                <Form>
                    <Form.Group as={Row} controlId="formHocKyNamHoc">
                        <Form.Label column sm="3" className="fw-bold" style={{ fontSize: '20px' }}>Học kỳ năm học</Form.Label>
                        <Col sm="9">
                            <Form.Control 
                                as="select" 
                                value={selectedHocKyNamHoc} 
                                onChange={(e) => setSelectedHocKyNamHoc(e.target.value)} 
                                className="mb-3"
                            >
                                <option value="">Chọn học kỳ năm học</option>
                                {hocKyNamHocs.map(hocKyNamHoc => (
                                    <option key={hocKyNamHoc.id} value={hocKyNamHoc.id}>
                                        {hocKyNamHoc.hoc_ky} - {hocKyNamHoc.nam_hoc}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formReportType">
                        <Form.Label column sm="3" className="fw-bold" style={{ fontSize: '20px' }}>Loại báo cáo</Form.Label>
                        <Col sm="9">
                            <Form.Control 
                                as="select" 
                                value={reportType} 
                                onChange={(e) => setReportType(e.target.value)} 
                                className="mb-3"
                            >
                                <option value="">Chọn loại báo cáo</option>
                                <option value="khoa">Báo cáo theo khoa</option>
                                <option value="lop">Báo cáo theo lớp</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formKhoa">
                        <Form.Label column sm="3" className="fw-bold" style={{ fontSize: '20px' }}>Khoa</Form.Label>
                        <Col sm="9">
                            <Form.Control 
                                as="select" 
                                value={selectedKhoa} 
                                onChange={(e) => setSelectedKhoa(e.target.value)} 
                                className="mb-3"
                            >
                                <option value="">Chọn khoa</option>
                                {khoas.map(khoa => (
                                    <option key={khoa.id} value={khoa.id}>
                                        {khoa.ten_khoa}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    {reportType === 'lop' && (
                        <Form.Group as={Row} controlId="formLop">
                            <Form.Label column sm="3" className="fw-bold" style={{ fontSize: '20px' }}>Lớp</Form.Label>
                            <Col sm="9">
                                <Form.Control 
                                    as="select" 
                                    value={selectedLop} 
                                    onChange={(e) => setSelectedLop(e.target.value)} 
                                    disabled={!selectedKhoa} 
                                    className="mb-3"
                                >
                                    <option value="">Chọn lớp</option>
                                    {lops.map(lop => (
                                        <option key={lop.id} value={lop.id}>
                                            {lop.ten_lop}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    )}

                    <Row className="mb-3">
                        <Col>
                            <Button variant="primary" onClick={handleViewReport}>Xem Báo Cáo</Button>
                        </Col>
                    </Row>

                    <Container className="mt-3">
                        {diemrenluyens.length > 0 ? (
                            diemrenluyens.map(drl => (
                                <Card key={drl.id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>Sinh viên: {drl.sinh_vien}</Card.Title>
                                    <Card.Text>
                                        Điểm tổng: {drl.diem_tong}
                                    </Card.Text>
                                    <Card.Text>
                                        Xếp loại: {drl.xep_loai}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <Alert variant="info">Không có dữ liệu</Alert>
                    )}
                    </Container>

                    <Row className="mt-3">
                        <Col md="6">
                            <Button variant="success" className="w-100" onClick={() => exportReport('csv')}>Xuất CSV</Button>
                        </Col>
                        <Col md="6">
                            <Button variant="danger" className="w-100" onClick={() => exportReport('pdf')}>Xuất PDF</Button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Container>
    </Card>
            </div>

            </div>
    );
};

export default ExportBaoCao;    
