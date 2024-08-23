// import React, { useState, useEffect, useContext } from 'react';
// import {Container, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
// import {MyDispatchContext, MyUserContext} from '../../configs/MyContext';
// import moment from 'moment';

// const HoatDong = () => {
//     const user= useContext(MyUserContext);
//     const [dieus, setDieus] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [hocKyList, setHocKyList] = useState([]);
//     const [idhd, setIdhd] = useState("");
//     const [showConfirmation, setShowConfirmation] = useState(false);
    
//     const [hoatDong, setHoatDong] = useState({
//         ten_HD_NgoaiKhoa: "",
//         ngay_to_chuc: "",
//         thong_tin: "",
//         diem_ren_luyen: "",
//         dieu: "",
//         hk_nh: "",
//         tro_ly: ""
//     });

//     const navigate = useNavigate();

//     const change = (field, value) => {
//         setHoatDong(current => ({ ...current, [field]: value }));
//     };

//     useEffect(() => {
//         fetchDieus();
//         fetchHocKy();
//     }, []);

//     const fetchDieus = async () => {
//         try {
//             const response = await APIs.get(endpoints['dieu']);
//             setDieus(response.data);
//         } catch (error) {
//             console.error('Error fetching dieus:', error);
//         }
//     };

//     const fetchHocKy = async () => {
//         setLoading(true);
//         try {
//             const response = await APIs.get(endpoints['hocky']);
//             setHocKyList(response.data);
//         } catch (err) {
//             Alert.alert('Error fetching hoc ky data: ' + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             hoatDong.tro_ly = user.id;
//             const response = await authAPI().post(endpoints['tao_hoat_dong'], hoatDong, {
//                 headers: {
//                     'Content-Type': 'application/json'
                    
//                 }
//             });
//             if (response.status === 201) {
//                 setIdhd(response.data.id);
//                 setShowConfirmation(true);
//             }
//         } catch (error) {
//             console.error('Error creating activity:', error);
//             Alert.alert('Error creating activity:', error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDialogDismiss = () => {
//         setShowConfirmation(false);
//         setHoatDong({
//             ten_HD_NgoaiKhoa: "",
//             ngay_to_chuc: "",
//             thong_tin: "",
//             diem_ren_luyen: "",
//             dieu: "",
//             hk_nh: "",
//             tro_ly: ""
//         });
//     };

//     return (
//         <Container className="my-4">
//             <h2 className="mb-4">Tạo Hoạt Động Ngoại Khóa</h2>
//             {loading && <Spinner animation="border" variant="primary" />}
            
//             <Form>
//                 <Form.Group controlId="ten_HD_NgoaiKhoa">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Tên hoạt động ngoại khóa:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         placeholder="Nhập tên hoạt động ngoại khóa"
//                         value={hoatDong.ten_HD_NgoaiKhoa}
//                         onChange={(e) => change('ten_HD_NgoaiKhoa', e.target.value)}
//                         className="mb-3"
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="ngay_to_chuc">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Ngày tổ chức:</Form.Label>
//                     <Form.Control
//                         type="datetime-local"
//                         value={hoatDong.ngay_to_chuc}
//                         onChange={(e) => change('ngay_to_chuc', e.target.value)}
//                         className="mb-3"
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="thong_tin">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Thông tin:</Form.Label>
//                     <Form.Control
//                         as="textarea"
//                         rows={3}
//                         placeholder="Nhập thông tin cho hoạt động ngoại khóa"
//                         value={hoatDong.thong_tin}
//                         onChange={(e) => change('thong_tin', e.target.value)}
//                         className="mb-3"
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="diem_ren_luyen">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Điểm rèn luyện:</Form.Label>
//                     <Form.Control
//                         type="number"
//                         placeholder="Nhập điểm rèn luyện"
//                         value={hoatDong.diem_ren_luyen}
//                         onChange={(e) => change('diem_ren_luyen', e.target.value)}
//                         className="mb-3"
//                     />
//                 </Form.Group>

//                 <Form.Group controlId="dieu">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Chọn điều:</Form.Label>
//                     <Form.Control
//                         as="select"
//                         value={hoatDong.dieu}
//                         onChange={(e) => change('dieu', e.target.value)}
//                         className="mb-3"
//                     >
//                         <option value="">--Chọn điều--</option>
//                         {dieus.map((dieu) => (
//                             <option key={dieu.ma_dieu} value={dieu.ma_dieu}>{dieu.ma_dieu}</option>
//                         ))}
//                     </Form.Control>
//                 </Form.Group>

//                 <Form.Group controlId="hk_nh">
//                     <Form.Label style={{ fontWeight: 'bold' }}>Chọn học kỳ:</Form.Label>
//                     <Form.Control
//                         as="select"
//                         value={hoatDong.hk_nh}
//                         onChange={(e) => change('hk_nh', e.target.value)}
//                         className="mb-3"
//                     >
//                         <option value="">Chọn học kỳ</option>
//                         {hocKyList.map((hocKyItem, index) => (
//                             <option key={index} value={hocKyItem.id}>
//                                 Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
//                             </option>
//                         ))}
//                     </Form.Control>
//                 </Form.Group>

//                 <Button
//                     variant="primary"
//                     onClick={handleSubmit}
//                     disabled={loading || !hoatDong.ten_HD_NgoaiKhoa || !hoatDong.ngay_to_chuc || !hoatDong.thong_tin || !hoatDong.diem_ren_luyen || !hoatDong.dieu || !hoatDong.hk_nh}
//                 >
//                     {loading ? 'Đang tạo...' : 'Tạo hoạt động'}
//                 </Button>
//             </Form>

//             <Modal show={showConfirmation} onHide={handleDialogDismiss}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Tạo hoạt động thành công</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>Bạn có muốn tạo bài viết cho hoạt động đã tạo không?</Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleDialogDismiss}>
//                         Không
//                     </Button>
//                     <Button variant="primary" onClick={() => {
//                         handleDialogDismiss();
//                         navigate("CreatePost", { state: { hoatDongId: idhd } });
//                     }}>
//                         Có
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

// export default HoatDong;


import React, { useState, useEffect, useContext } from 'react';
import {Container, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
import {MyDispatchContext, MyUserContext} from '../../configs/MyContext';
import moment from 'moment';

import './Styles.css';


const HoatDong = () => {
    const user= useContext(MyUserContext);
    const [dieus, setDieus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hocKyList, setHocKyList] = useState([]);
    const [idhd, setIdhd] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const [hoatDong, setHoatDong] = useState({
        ten_HD_NgoaiKhoa: "",
        ngay_to_chuc: "",
        thong_tin: "",
        diem_ren_luyen: "",
        dieu: "",
        hk_nh: "",
        tro_ly: ""
    });

    const navigate = useNavigate();

    const change = (field, value) => {
        setHoatDong(current => ({ ...current, [field]: value }));
    };

    useEffect(() => {
        fetchDieus();
        fetchHocKy();
    }, []);

    const fetchDieus = async () => {
        try {
            const response = await APIs.get(endpoints['dieu']);
            setDieus(response.data);
        } catch (error) {
            console.error('Error fetching dieus:', error);
        }
    };

    const fetchHocKy = async () => {
        setLoading(true);
        try {
            const response = await APIs.get(endpoints['hocky']);
            setHocKyList(response.data);
        } catch (err) {
            Alert.alert('Error fetching hoc ky data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            hoatDong.tro_ly = user.id;
            const response = await authAPI().post(endpoints['tao_hoat_dong'], hoatDong, {
                headers: {
                    'Content-Type': 'application/json'
                    
                }
            });
            if (response.status === 201) {
                setIdhd(response.data.id);
                setShowConfirmation(true);
            }
        } catch (error) {
            console.error('Error creating activity:', error);
            Alert.alert('Error creating activity:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogDismiss = () => {
        setShowConfirmation(false);
        setHoatDong({
            ten_HD_NgoaiKhoa: "",
            ngay_to_chuc: "",
            thong_tin: "",
            diem_ren_luyen: "",
            dieu: "",
            hk_nh: "",
            tro_ly: ""
        });
    };

    return (
        <div >
            <div fluid className="registration-background">


        <Container className="my-4 card3">
            <h2 className="mb-4 custom-title">Tạo Hoạt Động Ngoại Khóa</h2>
            {loading && <Spinner animation="border" variant="primary" />}
            
            <Form>
                <Form.Group controlId="ten_HD_NgoaiKhoa">
                    <Form.Label style={{ fontWeight: 'bold' }}>Tên hoạt động ngoại khóa:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên hoạt động ngoại khóa"
                        value={hoatDong.ten_HD_NgoaiKhoa}
                        onChange={(e) => change('ten_HD_NgoaiKhoa', e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>

                <Form.Group controlId="ngay_to_chuc">
                    <Form.Label style={{ fontWeight: 'bold' }}>Ngày tổ chức:</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={hoatDong.ngay_to_chuc}
                        onChange={(e) => change('ngay_to_chuc', e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>

                <Form.Group controlId="thong_tin">
                    <Form.Label style={{ fontWeight: 'bold' }}>Thông tin:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Nhập thông tin cho hoạt động ngoại khóa"
                        value={hoatDong.thong_tin}
                        onChange={(e) => change('thong_tin', e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>

                <Form.Group controlId="diem_ren_luyen">
                    <Form.Label style={{ fontWeight: 'bold' }}>Điểm rèn luyện:</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Nhập điểm rèn luyện"
                        value={hoatDong.diem_ren_luyen}
                        onChange={(e) => change('diem_ren_luyen', e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>

                <Form.Group controlId="dieu">
                    <Form.Label style={{ fontWeight: 'bold' }}>Chọn điều:</Form.Label>
                    <Form.Control
                        as="select"
                        value={hoatDong.dieu}
                        onChange={(e) => change('dieu', e.target.value)}
                        className="mb-3"
                    >
                        <option value="">--Chọn điều--</option>
                        {dieus.map((dieu) => (
                            <option key={dieu.ma_dieu} value={dieu.ma_dieu}>{dieu.ma_dieu}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="hk_nh">
                    <Form.Label style={{ fontWeight: 'bold' }}>Chọn học kỳ:</Form.Label>
                    <Form.Control
                        as="select"
                        value={hoatDong.hk_nh}
                        onChange={(e) => change('hk_nh', e.target.value)}
                        className="mb-3"
                    >
                        <option value="">Chọn học kỳ</option>
                        {hocKyList.map((hocKyItem, index) => (
                            <option key={index} value={hocKyItem.id}>
                                Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading || !hoatDong.ten_HD_NgoaiKhoa || !hoatDong.ngay_to_chuc || !hoatDong.thong_tin || !hoatDong.diem_ren_luyen || !hoatDong.dieu || !hoatDong.hk_nh}
                >
                    {loading ? 'Đang tạo...' : 'Tạo hoạt động'}
                </Button>
            </Form>

            <Modal show={showConfirmation} onHide={handleDialogDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo hoạt động thành công</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn tạo bài viết cho hoạt động đã tạo không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDialogDismiss}>
                        Không
                    </Button>
                    <Button variant="primary" onClick={() => {
                        handleDialogDismiss();
                        navigate("CreatePost", { state: { hoatDongId: idhd } });
                    }}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </div>

        </div>
    );
};

export default HoatDong;