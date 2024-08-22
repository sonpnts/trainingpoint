import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import MyContext from '../../configs/MyContext';
import APIs, { endpoints, authAPI } from '../../configs/APIs';
import cookie from 'react-cookies';

const DangNhapModal = ({ show, handleClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [user, dispatch] = useContext(MyContext);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const login = async (e) => {
        try {
            let res = await APIs.post(endpoints['dang_nhap'], {
                'username': username,
                'password': password,
                'client_id': 'YN17cy35cApl9PUiBuPCO0eTKgEEFtVWTV7I67lV',
                'client_secret': '0LpVpqTQ6fcHCwCSfCqKx0JcEzFfGHnf857IuKgtsf2sl1KX3HdqlpTQBUSGiTUm3CaZeqtYZCMXn59Cqfc79pfKu1LVtNUNbIBbO0JnrfbqvAmB3N9xRCHLhDBJI1YM',
                'grant_type': "password"
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                cookie.save("token", res.data.access_token);
                let user = await authAPI(cookie.load("token")).get(endpoints['current_taikhoan']);
                cookie.save('user', user.data);
                dispatch({
                    "type": "login",
                    "payload": user.data
                });
                let firebase = await APIs.get(endpoints['firebase'], {
                    headers: {
                        Authorization: `Bearer ${cookie.load('token')}`,
                    },
                });
                cookie.save('firebase-token', firebase.data.token);
                console.log("Đăng nhập thành công!");
                handleClose(); // Đóng modal sau khi đăng nhập thành công
                e.preventDefault();
                nav("/main"); // Điều hướng tới trang chính sau khi đăng nhập thành công
            } else {
                setError("Sai tên đăng nhập hoặc mật khẩu");
            }

        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            setError("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    const register = (e) => {
        e.preventDefault();
        nav("/dang-ky");
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Đăng Nhập</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="12">
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group controlId="formBasicUsername" className="mb-3">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                
                                <Form.Group controlId="formShowPassword" className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Hiển thị mật khẩu"
                                        onChange={toggleShowPassword}
                                    />
                                </Form.Group>

                                <Button variant="primary" onClick={login} className="mb-3">
                                    Đăng nhập
                                </Button>
                                <Button variant="secondary" onClick={register}>
                                    Đăng ký
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};
export default DangNhapModal;