import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Image, Modal , Card, Container} from 'react-bootstrap';
import APIs, { endpoints, authAPI, formatDate } from '../../configs/APIs';
import './Styles.css';

const MinhChung = () => {
  const location = useLocation();
  const thamgia_id = location.state?.thamgia_id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [hoatDongs, setHoatDongs] = useState([]);
  const [thamGia, setThamGia] = useState(null);
  const [minhchung, setMinhChung] = useState({
    description: "",
    anh_minh_chung: null,
    tham_gia: thamgia_id,
    phan_hoi: ""
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("danger");

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const change = (field, value) => {
    setMinhChung(current => ({ ...current, [field]: value }));
  };

  const trangThaiMap = {
    0: 'Đăng Ký',
    1: 'Điểm Danh',
    2: 'Báo Thiếu',
    3: 'Báo Thiếu Bị Từ Chối',
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const reshd = await APIs.get(endpoints['hoatdong']);
        setHoatDongs(reshd.data);

        const restg = await APIs.get(`/thamgias/${thamgia_id}/`);
        setThamGia(restg.data);

        if (restg.data.trang_thai === 2 || restg.data.trang_thai === 3) {
          const resmc = await APIs.get(`/thamgias/${thamgia_id}/minhchungs/`);
          if (resmc.data.length > 0) {
            const minhChungData = resmc.data[0];
            setMinhChung({
              description: minhChungData.description,
              anh_minh_chung: minhChungData.anh_minh_chung,
              tham_gia: thamgia_id,
              phan_hoi: minhChungData.phan_hoi,
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setAlertMessage("Lỗi khi lấy thông tin người dùng");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [thamgia_id]);

  const findHoatDongInfo = (hoatdongId) => {
    const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
    if (foundHoatDong) {
      return {
        name: foundHoatDong.ten_HD_NgoaiKhoa,
        drl: foundHoatDong.diem_ren_luyen,
        thongTin: foundHoatDong.thong_tin,
        ngayTC: foundHoatDong.ngay_to_chuc,
        dieu: foundHoatDong.dieu
      };
    }
    return {
      name: "",
      drl: "",
      thongTin: "",
      ngayTC: "",
      dieu: ""
    };
  };

  const handleDescriptionChange = (e) => {
    change('description', e.target.value);
  };

  const handleChooseImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      change('anh_minh_chung', file);
    }
  };

  const handleSubmit = async () => {
    if (!minhchung.description || !minhchung.anh_minh_chung) {
      setAlertMessage("Vui lòng nhập đầy đủ thông tin và chọn hình ảnh.");
      setAlertVariant("danger");
      return;
    }

    if (thamGia.trang_thai === 0) {
      await updateTrangThai();
      await PostMinhChung();
    } else if (thamGia.trang_thai === 2) {
      await PatchMinhChung();
    }
  };

  const updateTrangThai = async () => {
    try {
      const updatedThamGia = { ...thamGia, trang_thai: 2 };
      const res = await authAPI().patch(`/thamgias/${thamgia_id}/`, updatedThamGia);
      if (res.status === 200) {
        setThamGia(updatedThamGia);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setAlertMessage("Đã xảy ra lỗi khi cập nhật trạng thái.");
      setAlertVariant("danger");
    }
  };

  const PostMinhChung = async () => {
    try {
      setLoading(true);
      let form = new FormData();
      for (let key in minhchung) {
        if (key === "anh_minh_chung") {
          form.append(key, minhchung[key]);
        } else {
          form.append(key, minhchung[key]);
        }
      }

      let res = await authAPI().post(endpoints['minh_chung'], form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      if (res.status === 201) {
        setAlertMessage('Tạo minh chứng thành công!');
        setAlertVariant("success");
        navigate(-1);
      }
    } catch (ex) {
      console.log(ex);
      setAlertMessage('Có lỗi gì đó đã xảy ra trong lúc tạo minh chứng! ' + ex.message);
      setAlertVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const PatchMinhChung = async () => {
    try {
      setLoading(true);
      let form = new FormData();
      for (let key in minhchung) {
        if (key === "anh_minh_chung") {
          form.append(key, minhchung[key]);
        } else {
          form.append(key, minhchung[key]);
        }
      }

      let res = await APIs.patch((`/thamgias/${thamgia_id}/capnhat/`), form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      if (res.status === 200) {
        setAlertMessage('Cập nhật minh chứng thành công!');
        setAlertVariant("success");
        navigate(-1);
      }
    } catch (ex) {
      console.log(ex);
      setAlertMessage('Có lỗi gì đó đã xảy ra trong lúc cập nhật minh chứng! ' + ex.message);
      setAlertVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSize = () => {
    setIsImageEnlarged(!isImageEnlarged);
    setShowModal(!showModal);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const hoatdongInfo = findHoatDongInfo(thamGia.hd_ngoaikhoa);

  return (
    <div>
      <div className="registration-background">
      <Container> 
        <Card className="mt-3 card5" >
        <div className="container mt-5 ">
          <h2 className='text-center custom-title '>Báo thiếu hoạt động</h2>
          {alertMessage && (
            <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
              {alertMessage}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Hoạt động ngoại khóa:</Form.Label>
              <Form.Control type="text" value={hoatdongInfo.name} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Điểm rèn luyện:</Form.Label>
              <Form.Control type="text" value={hoatdongInfo.drl} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chi tiết:</Form.Label>
              <Form.Control type="text" value={hoatdongInfo.thongTin} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày tổ chức:</Form.Label>
              <Form.Control type="text" value={hoatdongInfo.ngayTC} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Điều:</Form.Label>
              <Form.Control type="text" value={hoatdongInfo.dieu} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả:</Form.Label>
              <Form.Control
                as="textarea"
                value={minhchung.description}
                onChange={handleDescriptionChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ảnh minh chứng:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleChooseImg}
              />
            </Form.Group>

            {minhchung.anh_minh_chung && minhchung.anh_minh_chung instanceof File && (
              <div>
                <Image
                  src={URL.createObjectURL(minhchung.anh_minh_chung)}
                  thumbnail
                  className={`minhchung-image ${isImageEnlarged ? 'enlarged' : ''}`}
                  onClick={toggleImageSize}
                  alt="Minh chứng"
                />
                <Modal show={showModal} onHide={toggleImageSize} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Ảnh minh chứng</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Image src={URL.createObjectURL(minhchung.anh_minh_chung)} fluid alt="Minh chứng" />
                  </Modal.Body>
                </Modal>
              </div>
            )}


            {thamGia && thamGia.trang_thai === 3 && (
              <Form.Group className="mb-3">
                <Form.Label>Phản hồi:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={minhchung.phan_hoi}
                  readOnly
                />
              </Form.Group>
            )}

              <div className="container">
                    <div className="row justify-content-center mt-3">
                      <div className="col-12 col-md-6">
                        <div className="d-flex justify-content-center">
                          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Lưu'}
                          </Button>
                          <Button variant="secondary" className="ml-3" onClick={() => navigate(-1)} disabled={loading}>
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
          </Form>
        </div>
        </Card>
      </Container>
      </div>
    </div>
  );
};

export default MinhChung;
