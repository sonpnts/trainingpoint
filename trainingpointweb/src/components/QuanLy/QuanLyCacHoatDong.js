import React, { useState, useEffect } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
import './Styles.css';


const QuanLyHoatDong = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedHocKy, setSelectedHocKy] = useState('');
  const [hocKyList, setHocKyList] = useState([]);
  const navigate = useNavigate();

  const fetchHocKy = async () => {
    try {
      const response = await APIs.get(endpoints['hocky']);
      setHocKyList(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching hoc ky data:', err);
      setLoading(false);
    }
  };

  const fetchActivities = async (hocKyId) => {
    setLoading(true);
    try {
      const response = await authAPI().get(`${endpoints['quan_ly_hoat_dong']}?hoc_ky=${hocKyId}`);
      const allActivities = response.data;
      const postsResponse = await authAPI().get(`${endpoints['hoat_dong_tao_bai_viet']}?hoc_ky=${hocKyId}`);
      console.log('Posts response:', postsResponse.data);
      const activitiesWithPosts = postsResponse.data.map(post => post.id);
      const activitiesWithStatus = allActivities.map(activity => ({
        ...activity,
        hasPost: activitiesWithPosts.includes(activity.id),
      }));

      setActivities(activitiesWithStatus);
      // console.log('Activities:', activitiesWithStatus);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHocKy();
  }, []);

  useEffect(() => {
    if (selectedHocKy) {
      fetchActivities(selectedHocKy);
    }
  }, [selectedHocKy]);

  const editActivity = (activityId) => (e) => {
    e.preventDefault();
    navigate('/sua-hoat-dong', { state: { hoatDongId: activityId } });
  };

  const deleteActivity = async (hoat_dong_id) => {
    try {
      const response = await authAPI().post(`${endpoints['xoa_hoat_dong']}?hd=${hoat_dong_id}`);
      if (response.status === 200) {
        fetchActivities(selectedHocKy);
      } else {
        console.error('Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handlEditPost = (item) => (e)=>{
    e.preventDefault(); // Ngăn chặn hành vi mặc định
    const path = item.hasPost ? "/tao-bai-viet" : null;
    navigate(path, { state: { hoatDongId: item } });
  };

  const confirmDelete = (activityId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      deleteActivity(activityId);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div>
    <div fluid className="registration-background">
    <div style={{ padding: '20px' }}>
      <h2 className='custom-title'>Quản Lý Hoạt Động</h2>

      <div className="mb-3">
        <select
          className="form-select"
          value={selectedHocKy}
          onChange={(e) => setSelectedHocKy(e.target.value)}
        >
          <option value="">Chọn học kỳ</option>
          {hocKyList.map((hocKyItem, index) => (
            <option key={index} value={hocKyItem.id}>
              Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
            </option>
          ))}
        </select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên Hoạt Động</th>
            <th>Ngày Tổ Chức</th>
            <th>Thông Tin</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item) => (
            <tr key={item.id}>
              <td>{item.ten_HD_NgoaiKhoa}</td>
              <td>{formatDate(item.ngay_to_chuc)}</td>
              <td>{item.thong_tin}</td>
              <td>
                <Button variant="warning" onClick={editActivity(item.id)} className="me-2">
                  Chỉnh sửa
                </Button>
                <Button variant="danger" onClick={ () => confirmDelete(item.id)} className="me-2">
                  Xóa
                </Button>
                {item.hasPost && (
                  <Button
                      variant="primary"
                      onClick={() => handlEditPost(item)}
                  >
                      Tạo bài viết
                  </Button>
              )}

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
     
    </div>
      
    </div>
    </div>
  );
};

export default QuanLyHoatDong;
