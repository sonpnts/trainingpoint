import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Table, Alert, Card, Spinner } from 'react-bootstrap';
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import axios from "axios";
import { auth, createUserWithEmailAndPassword } from '../../configs/Firebase';
import './Styles.css';


const ThemTroLySinhVien = () => {
    const [assistant, setAssistant] = useState({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        avatar: "",
        role: "3",
        uid:"",
        khoa: null
    });

    const [khoa, setKhoa] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        avatar: "",
        khoa: ""
    });
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

    const change = (field, value) => {
        setAssistant(current => ({ ...current, [field]: value }));
        setErrors(current => ({ ...current, [field]: "" })); 
    };

    const handleChooseAvatar = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                change('avatar', {
                    file,
                    preview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const validateForm = async () => {
        let valid = true;
        let newErrors = {  username: "", firstname: "", lastname: "", password: "", avatar: "", khoa: "" };

        if (!validatePassword(assistant.password)) {
            newErrors.password = 'Password phải có từ 8 ký tự trở lên';
            valid = false;
        }
        if (!assistant.avatar) {
            newErrors.avatar = 'Avatar không tồn tại!';
            valid = false;
        }
        if (!assistant.username) {
            newErrors.username = 'Username không được để trống!';
            valid = false;
        }
        if (!assistant.firstname) {
            newErrors.firstname = 'Firstname không được để trống!';
            valid = false;
        }
        if (!assistant.lastname) {
            newErrors.lastname = 'Lastname không được để trống!';
            valid = false;
        }
        if (!assistant.khoa) {
            newErrors.khoa = 'Khoa không được để trống!';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const postAssistant = async () => {
        // if (await validateForm()) {
            try {
                let check = await APIs.get(`${endpoints['tai_khoan_is_valid']}?email=${assistant.email}`);
                if (check.data.is_valid === "False") {
                    setLoading(true);

                    const firebaseUserCredential = await createUserWithEmailAndPassword(auth, assistant.email, assistant.password);
                    const firebaseUser = firebaseUserCredential.user;
                    // const token = await firebaseUser.getIdToken();
                    // console.log(firebaseUser);
                    let form = new FormData();
                    for (let key in assistant) {
                        if (key === "avatar") {
                            form.append(key, assistant.avatar.file, assistant.avatar.file.name);
                        } else if (key === "username") {
                            form.append(key, assistant.email); // Sử dụng email làm username
                        } else if(key === "uid") {
                            form.append(key, firebaseUser.uid);
                        }
                        else {
                            form.append(key, assistant[key]);
                        }
                    }
                    for (let pair of form.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }
                    const resdk = await authAPI().post(endpoints['dang_ky'], form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    let formtroly = new FormData();
                    formtroly.append('trolySV', resdk.data.id);
                    formtroly.append('khoa', assistant.khoa);
                    let trolycreate = await authAPI().post(endpoints['tro_ly'], formtroly, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (resdk.status ===  201 && trolycreate.status === 201) {
                        setAlert({ show: true, message: 'Thêm trợ lý sinh viên thành công!', variant: 'success' });
                        setAssistant({
                            email: "",
                            username: "",
                            first_name: "",
                            last_name: "",
                            password: "",
                            avatar: "",
                            role: "3",
                            uid:"",
                            khoa: null
                        });
                        
                        setErrors({
                            email: "",
                            username: "",
                            firstname: "",
                            lastname: "",
                            password: "",
                            avatar: "",
                            khoa: ""
                        });
                    }
                    
                } else {
                    setAlert({ show: true, message: 'Email hoặc username đã tồn tại!', variant: 'danger' });
                }
            } catch (ex) {
                setLoading(false);
                setAlert({ show: true, message: 'Có lỗi gì đó đã xảy ra: ' + ex.message, variant: 'danger' });
            } finally {
                setLoading(false);
            }
        // }
    };

    const getKhoas = async () => {
        try {
            const khoas = await APIs.get(endpoints['khoa']);
            setKhoa(khoas.data);
        } catch (ex) {
            setAlert({ show: true, message: 'Có lỗi gì đó đã xảy ra khi lấy dữ liệu khoa: ' + ex.message, variant: 'danger' });
        }
    };

    useEffect(() => {
        getKhoas();
    }, []);

    return (
        <div className="registration-background">
            <Card className="card4"> 
                <h2 className="mt-4 custom-title">Thêm Trợ Lý Sinh Viên</h2>
                {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
                {assistant.avatar && (
                    <div className=" text-center">
                        <img
                            src={assistant.avatar.preview}
                            alt="Avatar"
                            style={styles.avatar}
                        />
                    </div>
                )}
                <Form>
                    <Form.Group controlId="avatar">
                        <Form.Label>Chọn ảnh đại diện</Form.Label>
                        <Form.Control type="file" onChange={handleChooseAvatar} />
                        {errors.avatar && <Alert variant="danger">{errors.avatar}</Alert>}
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={assistant.email}
                            onChange={(e) => change("email", e.target.value)}
                        />
                        {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                    </Form.Group>
                    <Form.Group controlId="firstname">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control
                            type="text"
                            value={assistant.first_name}
                            onChange={(e) => change("first_name", e.target.value)}
                        />
                        {errors.first_name && <Alert variant="danger">{errors.first_name}</Alert>}
                    </Form.Group>
                    <Form.Group controlId="lastname">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control
                            type="text"
                            value={assistant.last_name}
                            onChange={(e) => change("last_name", e.target.value)}
                        />
                        {errors.last_name && <Alert variant="danger">{errors.last_name}</Alert>}
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={assistant.password}
                            onChange={(e) => change("password", e.target.value)}
                        />
                        {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                    </Form.Group>
                    <Form.Group controlId="khoa">
                        <Form.Label>Khoa</Form.Label>
                        <Form.Control
                            as="select"
                            value={assistant.khoa}
                            onChange={(e) => change("khoa", e.target.value)}
                        >
                            <option value="">Chọn khoa</option>
                            {khoa.map(k => (
                                <option key={k.id} value={k.id}>{k.ten_khoa}</option>
                            ))}
                        </Form.Control>
                        {errors.khoa && <Alert variant="danger">{errors.khoa}</Alert>}
                    </Form.Group>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <Button onClick={postAssistant} className="mt-2" variant="primary">Thêm trợ lý sinh viên</Button>
                    )}
                </Form>
            </Card>
        </div>
    );
};

const styles = {
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        margin: '0 auto'
    }
};

export default ThemTroLySinhVien;
