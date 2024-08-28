import React, { useState, useEffect } from 'react';
import { Button, Alert, Form, Spinner, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import moment from 'moment';

import './Styles.css';

const SuaHoatDong = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hoatDongId = location.state?.hoatDongId;
  const [hoatDong, setHoatDong] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [dieus, setDieus] = useState([]);
  const [hocKyList, setHocKyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchHoatDongDetail();
    fetchDieus();
    fetchHocKy();
  }, []);

  const fetchHocKy = async () => {
    try {
      const response = await APIs.get(endpoints['hocky']);
      setHocKyList(response.data);
      setLoading(false);
    } catch (err) {
      setShowAlert({ message: 'Error fetching hoc ky data: ' + err.message, type: 'danger' });
      setLoading(false);
    }
  };

  const fetchDieus = async () => {
    try {
      const response = await APIs.get(endpoints['dieu']);
      setDieus(response.data);
    } catch (error) {
      console.error('Error fetching dieus:', error);
    }
  };

  const fetchHoatDongDetail = async () => {
    try {
      const response = await APIs.get(endpoints['hoat_dong'](hoatDongId));
      setHoatDong(response.data);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      setShowAlert({ message: 'Error fetching activity details', type: 'danger' });
    }
  };

  const handleChange = (field, value) => {
    setHoatDong((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setIsModified(true);
  };

  const handleSaveChanges = async (e) => {
    try {
      const response = await authAPI().put(endpoints['hoat_dong'](hoatDongId), hoatDong, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setShowAlert({ message: 'Activity updated successfully', type: 'success' });
        e.preventDefault();
        navigate(-1);
        setIsModified(false);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      setShowAlert({ message: 'Error updating activity', type: 'danger' });
    }
  };

  const formatDate = (date) => {
    return moment(date).format('HH:mm - DD/MM/YYYY');
  };

  if (!hoatDong) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div fluid className="registration-background">
      <Container className="my-4">
        <h2 className="mb-4 custom-title">Sửa Hoạt Động Ngoại Khóa</h2>
        {showAlert.message && (
          <Alert variant={showAlert.type} onClose={() => setShowAlert({ message: '', type: '' })} dismissible>
            {showAlert.message}
          </Alert>
        )}
        <Form className="scrollable-form">
          <Form.Group controlId="formTenHoatDong">
            <Form.Label style={{ fontWeight: 'bold' }}>Tên hoạt động ngoại khóa:</Form.Label>
            <Form.Control
              type="text"
              value={hoatDong.ten_HD_NgoaiKhoa}
              onChange={(e) => handleChange('ten_HD_NgoaiKhoa', e.target.value)}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formNgayToChuc">
            <Form.Label style={{ fontWeight: 'bold' }}>Ngày tổ chức:</Form.Label>
            <Form.Control
              type="date"
              value={moment(hoatDong.ngay_to_chuc).format('YYYY-MM-DD')}
              onChange={(e) => handleChange('ngay_to_chuc', e.target.value)}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formThongTin">
            <Form.Label style={{ fontWeight: 'bold' }}>Thông tin:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={hoatDong.thong_tin}
              onChange={(e) => handleChange('thong_tin', e.target.value)}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formDiemRenLuyen">
            <Form.Label style={{ fontWeight: 'bold' }}>Điểm rèn luyện:</Form.Label>
            <Form.Control
              type="number"
              value={hoatDong.diem_ren_luyen}
              onChange={(e) => handleChange('diem_ren_luyen', e.target.value)}
              className="mb-3"
            />
            
          </Form.Group>

          <Form.Group controlId="formHocKy">
            <Form.Label style={{ fontWeight: 'bold' }}>Chọn học kỳ:</Form.Label>
            <Form.Select
              value={hoatDong.hk_nh}
              onChange={(e) => handleChange('hk_nh', e.target.value)}
              className="mb-3"
            >
              <option value="">Chọn học kỳ</option>
              {hocKyList.map((hocKyItem) => (
                <option key={hocKyItem.id} value={hocKyItem.id}>
                  Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formDieu">
            <Form.Label style={{ fontWeight: 'bold' }}>Chọn điều:</Form.Label>
            <Form.Select
              value={hoatDong.dieu}
              onChange={(e) => handleChange('dieu', e.target.value)}
              className="mb-3"
            >
              <option value="">--Chọn điều--</option>
              {dieus.map((dieu) => (
                <option key={dieu.ma_dieu} value={dieu.ma_dieu}>
                  {dieu.ten_dieu}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {isModified && (
            <Button
              variant="primary"
              onClick={handleSaveChanges}
            >
              Lưu thay đổi
            </Button>
          )}
        </Form>
      </Container>
    </div>
  );
};

export default SuaHoatDong;
