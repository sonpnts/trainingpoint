import React, { useEffect, useState, useContext } from 'react';
import { MyUserContext } from '../../configs/MyContext';
import { Button, Spinner, Form, Table, Alert } from 'react-bootstrap';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import './Styles.css';


const HDNKDiemDanh = () => {
    const [loading, setLoading] = useState(true);
    const [hoatDongDiemDanhLoading, setHoatDongDiemDanhLoading] = useState(false);
    const [hoatDongDiemDanh, setHoatDongDiemDanh] = useState([]);
    const [sv, setSv] = useState(null);
    const [lops, setLops] = useState([]);
    const [dieus, setDieus] = useState([]);
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [diemRenLuyen, setDiemRenLuyen] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const user = useContext(MyUserContext);

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
            if (response.data && Array.isArray(response.data)) {
                setHocKyNamHocs(response.data);
            } else {
                setHocKyNamHocs([]);
                console.error('Dữ liệu trả về không phải là một mảng');
            }
        } catch (error) {
            console.error(error);
            setHocKyNamHocs([]);
            setAlertMessage('Không thể tải dữ liệu học kỳ năm học');
        }
    };

    const fetchDieus = async () => {
        try {
            const response = await APIs.get(endpoints['dieu']);
            setDieus(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Đã xảy ra lỗi khi tải dữ liệu Dieus.');
        }
    };

    useEffect(() => {
        fetchHocKyNamHocs();
        fetchDieus();

        const fetchUserData = async () => {
            try {
                const reslop = await APIs.get(endpoints['lop']);
                setLops(reslop.data.results);
                const ressv = await authAPI().get(endpoints['current_sinhvien']);
                setSv(ressv.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                setLoading(false);
                setAlertMessage('Lỗi khi lấy thông tin người dùng');
            }
        };

        fetchUserData();
    }, []);

    const handleViewReport = async (id) => {
        setHoatDongDiemDanhLoading(true);
        try {
            const res = await authAPI().get(`/thamgias/hoat-dong-diem-danh/${sv.id}/${id}/`);
            if (res.status === 200) {
                setHoatDongDiemDanh(res.data);
                setHoatDongDiemDanhLoading(false);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage('Đã xảy ra lỗi khi tải dữ liệu điểm rèn luyện.');
            setHoatDongDiemDanhLoading(false);
        }
    };

    const fetchDiemRenLuyen = async (svId, hocKyId) => {
        try {
            const restongDRL = await APIs.get(`/diemrenluyens/${svId}/${hocKyId}/`);
            if (restongDRL.status === 200) {
                setDiemRenLuyen(restongDRL.data);
            }
        } catch {
            setAlertMessage("Sinh viên không có điểm ở kỳ này");
        }
    };

    useEffect(() => {
        if (selectedHocKyNamHoc) {
            handleViewReport(selectedHocKyNamHoc);
            setDiemRenLuyen('');
        }
    }, [selectedHocKyNamHoc]);

    useEffect(() => {
        if (hoatDongDiemDanh.length > 0 && selectedHocKyNamHoc) {
            fetchDiemRenLuyen(sv.id, selectedHocKyNamHoc);
        }
    }, [hoatDongDiemDanh]);

    const findClassName = (classId) => {
        const foundClass = Array.isArray(lops) && lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : "";
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
        <div fluid className="registration-background">
        <div className="p-4 mb-4 bg-primary1 text-dark1">
            <div className="p-2 mb-4 bg-primary1">
                <h3 className="text-center custom-title">XEM THÀNH TÍCH</h3>
            </div>
            {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
            {sv ? (
                <div className="mb-4">
                    <p><strong>Họ và tên:</strong> {sv.ho_ten}</p>
                    <p><strong>Lớp:</strong> {findClassName(sv.lop)}</p>
                    <p><strong>MSSV:</strong> {sv.mssv}</p>
                </div>
            ) : (
                <p>Không tìm thấy thông tin sinh viên</p>
            )}

            <Form.Group controlId="hocKyNamHoc" className="mb-4">
                <Form.Label>Chọn học kỳ năm học</Form.Label>
                <Form.Control as="select" value={selectedHocKyNamHoc} onChange={(e) => setSelectedHocKyNamHoc(e.target.value)}>
                    <option value="">Chọn học kỳ năm học</option>
                    {hocKyNamHocs.map(hocKyNamHoc => (
                        <option key={hocKyNamHoc.id} value={hocKyNamHoc.id}>
                            {hocKyNamHoc.hoc_ky} - {hocKyNamHoc.nam_hoc}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

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
            <div className="mt-4">
                <h4>Tổng điểm rèn luyện: <span className="text-danger">{diemRenLuyen?.diem_tong || 0}</span></h4>
                <h4>Xếp loại: <span className="text-danger">{xepLoaiMap[diemRenLuyen?.xep_loai] || "Chưa có"}</span></h4>
            </div>
        </div>
        
        </div>

        </div>
    );
};

export default HDNKDiemDanh;

