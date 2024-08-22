// import React, { useState, useRef } from "react";
// import { Form, Button, Container, Row, Col, Alert, Spinner, Modal, Card } from "react-bootstrap";
// import APIs, { endpoints } from "../../configs/APIs";
// import { useNavigate } from "react-router-dom";
// import sendEmail from "./send_mail";

// import './DangKy.css';

// const DangKy = () => {
//     const [user, setUser] = useState({
//         email: "",
//         username: "",
//         password: "",
//         avatar: "",
//         role: "4"
//     });
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const nav = useNavigate();
//     const [otp, setOtp] = useState(['', '', '', '']);
//     const refs = useRef([]);
//     const [randomOTP, setRandomOTP] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const handleClose = () => setShowModal(false);
//     const handleShow = () => setShowModal(true);

//     const [errors, setErrors] = useState({
//         email: "",
//         username: "",
//         password: "",
//         avatar: ""
//     });

//     const generateOTP = () => {
//         const randomNumber = Math.floor(1000 + Math.random() * 9000);
//         const otpNum = randomNumber.toString().padStart(4, '0');
//         setRandomOTP(otpNum);
//         return otpNum;
//     };

//     const handleChangeText = (num, index) => {
//         if (/^\d*$/.test(num) && num.length <= 1) {
//             const newOtp = [...otp];
//             newOtp[index] = num;
//             setOtp(newOtp);

//             if (num.length === 1 && index < otp.length - 1 && refs.current[index + 1]) {
//                 refs.current[index + 1].focus();
//             }
//         }
//     };

//     const change = (field, value) => {
//         setUser(current => ({ ...current, [field]: value }));
//         setErrors(current => ({ ...current, [field]: "" }));
//     };

//     const handleEmailChange = (e) => {
//         change("email", e.target.value);
//     };

//     const handlePasswordChange = (e) => {
//         change('password', e.target.value);
//     };

//     const handleUsernameChange = (e) => {
//         change('username', e.target.value);
//     };

//     const handleChooseAvatar = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             change('avatar', file);
//         }
//     };

//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//         setErrors(current => ({ ...current, confirmPassword: "" }));
//     };

//     const validateEmail = (email) => {
//         const re = /^\d{10}[a-zA-Z]+@ou\.edu\.vn$/;
//         return re.test(email);
//     };

//     const validatePassword = (password) => {
//         return password.length >= 8;
//     };

//     const validateDangKy = async () => {
//         let valid = true;
//         let newErrors = { email: "", username: "", password: "", confirmPassword: "", avatar: "" };

//         if (!validateEmail(user.email)) {
//             newErrors.email = 'Email nhập không hợp lệ! Vui lòng nhập dạng 10 số + tên @ou.edu.vn';
//             valid = false;
//         }
//         if (!validatePassword(user.password)) {
//             newErrors.password = 'Password phải có từ 8 ký tự trở lên';
//             valid = false;
//         }
//         if (user.password !== confirmPassword) {
//             newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
//             valid = false;
//         }
//         if (!user.avatar) {
//             newErrors.avatar = 'Avatar không tồn tại!';
//             valid = false;
//         }
//         if (!user.username) {
//             newErrors.username = 'Username không được để trống!';
//             valid = false;
//         }

//         setErrors(newErrors);

//         if (valid) {
//             let tk_valid = false;
//             try {
//                 const check = await APIs.get(`${endpoints['tai_khoan_is_valid']}?email=${user.email}&username=${user.username}`);
//                 if (check.status === 200) {
//                     const res = check.data.is_valid;
//                     if (res === true) {
//                         tk_valid = true;
//                     }
//                 }
//             } catch (ex) {
//                 setLoading(false);
//                 console.error('Có lỗi gì đó đã xảy ra', 'Tài khoản sinh viên đã tồn tại!');
//             }

//             if (!tk_valid) {
//                 setLoading(true);
//                 try {
//                     const otp = generateOTP();
//                     const body = "Mã OTP của bạn là:" + otp;
//                     const header = "Xác thực mã OTP tạo tài khoản sinh viên";
//                     const res = await sendEmail(user.email, header, body);
//                     if (res.status === 200) {
//                         console.log('Gửi email thành công!', otp);
//                         setLoading(false);
//                         handleShow();
//                     }
//                 } catch (error) {
//                     console.error('Có lỗi xảy ra trong quá trình đăng ký:', error.message);
//                     alert('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.');
//                 }
//             }
//         }
//     };

//     const handleSubmit = () => {
//         const otpString = otp.join('');
//         if (otpString === randomOTP) {
//             handleClose();
//             PostTaiKhoan();
//         } else {
//             alert('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
//         }
//     };

//     const PostTaiKhoan = async (e) => {
//         try {
//             setLoading(true);
//             let form = new FormData();
//             for (let key in user) {
//                 if (key === "avatar") {
//                     form.append(key, user.avatar);
//                 } else {
//                     form.append(key, user[key]);
//                 }
//             }
//             let res = await APIs.post(endpoints['dang_ky'], form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.log(res.data);
//             setLoading(false);
//             if (res.status === 201) {
//                 console.error('Tạo tài khoản thành công!');
//                 e.preventDefault();
//                 nav("/sinh-vien-dang-ky", {state: { email: user.email }});
//             }
//         } catch (ex) {
//             console.error('Có lỗi gì đó đã xảy ra trong lúc tạo tài khoản!', ex.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = (e) => {
//         e.preventDefault();
//         nav("/dang-nhap");
//     };

//     return (
//         <div>
//         <Container fluid className="registration-background">
//             <Row className="justify-content-md-center">
//                 <Col md="8" lg="6">
//                     <Card className="p-4 shadow-sm">
//                         <Card.Body>
//                             <h2 className="mb-4 text-center">Đăng Ký</h2>
//                             {errors.avatar && <Alert variant="danger">{errors.avatar}</Alert>}
//                             <Form>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Ảnh đại diện</Form.Label>
//                                     <Form.Control type="file" onChange={handleChooseAvatar} />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formBasicEmail">
//                                     <Form.Label>Email</Form.Label>
//                                     <Form.Control
//                                         type="email"
//                                         placeholder="Nhập email"
//                                         value={user.email}
//                                         onChange={handleEmailChange}
//                                     />
//                                     {errors.email && <Alert variant="danger">{errors.email}</Alert>}
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formBasicUsername">
//                                     <Form.Label>Username</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Nhập username"
//                                         value={user.username}
//                                         onChange={handleUsernameChange}
//                                     />
//                                     {errors.username && <Alert variant="danger">{errors.username}</Alert>}
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formBasicPassword">
//                                     <Form.Label>Mật khẩu</Form.Label>
//                                     <Form.Control
//                                         type={showPassword ? "text" : "password"}
//                                         placeholder="Nhập mật khẩu"
//                                         value={user.password}
//                                         onChange={handlePasswordChange}
//                                     />
//                                     {errors.password && <Alert variant="danger">{errors.password}</Alert>}
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
//                                     <Form.Label>Xác nhận mật khẩu</Form.Label>
//                                     <Form.Control
//                                         type={showPassword ? "text" : "password"}
//                                         placeholder="Nhập lại mật khẩu"
//                                         value={confirmPassword}
//                                         onChange={handleConfirmPasswordChange}
//                                     />
//                                     {errors.confirmPassword && <Alert variant="danger">{errors.confirmPassword}</Alert>}
//                                 </Form.Group>
//                                 <Form.Group className="mb-3" controlId="formBasicCheckbox">
//                                     <Form.Check
//                                         type="checkbox"
//                                         label="Hiển thị mật khẩu"
//                                         checked={showPassword}
//                                         onChange={() => setShowPassword(!showPassword)}
//                                     />
//                                 </Form.Group>
//                                 <div className="button-container">
//                                     <Button variant="primary" type="button" onClick={validateDangKy} className="btn-lg" disabled={loading}>
//                                         {loading ? <Spinner animation="border" size="sm" /> : "Đăng ký"}
//                                     </Button>
//                                 </div>
//                             </Form>
//                             <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                 <p style={{ margin: 0 }}>Đã có tài khoản? <Button variant="link" className="p-0" onClick={login}> Đăng nhập</Button></p>
//                             </div>
//                             <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
//                                 <Modal.Header closeButton>
//                                     <Modal.Title>Nhập mã OTP</Modal.Title>
//                                 </Modal.Header>
//                                 <Modal.Body>
//                                     <div className="d-flex justify-content-center">
//                                         {otp.map((o, index) => (
//                                             <input
//                                                 key={index}
//                                                 type="text"
//                                                 value={o}
//                                                 onChange={(e) => handleChangeText(e.target.value, index)}
//                                                 ref={(el) => refs.current[index] = el}
//                                                 className="otp-input mx-2"
//                                             />
//                                         ))}
//                                     </div>
//                                 </Modal.Body>
//                                 <Modal.Footer>
//                                     <Button variant="secondary" onClick={handleClose}>
//                                         Đóng
//                                     </Button>
//                                     <Button variant="primary" onClick={handleSubmit}>
//                                         Xác nhận
//                                     </Button>
//                                 </Modal.Footer>
//                             </Modal>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>

//     </div>
//     );
// };

// export default DangKy;

import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner, Modal } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigate } from "react-router-dom";
import sendEmail from "./send_mail";
import "./Styles.css";  // Đảm bảo rằng bạn có file Styles.css để import
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup , createUserWithEmailAndPassword} from '../../configs/Firebase'; // Thay đổi đường dẫn nếu cần
import { Last } from "react-bootstrap/esm/PageItem";



const DangKy = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
        avatar: "",
        role: "4"
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const refs = useRef([]);
    const [randomOTP, setRandomOTP] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [error, setError] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        username: "",
        password: "",
        avatar: ""
    });

    const generateOTP = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const otpNum = randomNumber.toString().padStart(4, '0');
        setRandomOTP(otpNum);
        return otpNum;
    };

    const handleChangeText = (num, index) => {
        if (/^\d*$/.test(num) && num.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = num;
            setOtp(newOtp);

            if (num.length === 1 && index < otp.length - 1 && refs.current[index + 1]) {
                refs.current[index + 1].focus();
            }
        }
    };

    const change = (field, value) => {
        setUser(current => ({ ...current, [field]: value }));
        setErrors(current => ({ ...current, [field]: "" }));
    };

    const handleEmailChange = (e) => {
        change("email", e.target.value);
    };

    const handlePasswordChange = (e) => {
        change('password', e.target.value);
    };

    const handleUsernameChange = (e) => {
        change('username', e.target.value);
    };

    const handleChooseAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            change('avatar', file);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setErrors(current => ({ ...current, confirmPassword: "" }));
    };

    const validateEmail = (email) => {
        const re = /^\d{10}[a-zA-Z]+@ou\.edu\.vn$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const uploadImageToForm = async (form, imageUrl) => {
        const response = await fetch(imageUrl);
       
        const blob = await response.blob();

        const file = new File([blob], 'avatar.jpg', { type: blob.type });
        form.append('avatar', file);
    };


    const registerWithEmailAndPassword = async () => {
        try {
            setLoading(true);
            console.log(user);
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const userdata = userCredential.user;
            const token = await userdata.getIdToken();
            let form = new FormData();
            console.log(form);
            for (let key in user) {
                form.append(key, user[key]);
            }
            let res = await APIs.post(endpoints['dang_ky'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false)
            return {
                
                success: true,
                user,
                token
            };


        } catch (error) {
            let errorMessage = "Đăng ký không thành công. Vui lòng thử lại.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email đã được sử dụng.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Địa chỉ email không hợp lệ.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Mật khẩu quá yếu. Vui lòng chọn mật khẩu khác.";
            }
    
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const registergg = async (e) => {

        const result = await signInWithPopup(auth, googleProvider);
        console.log(result);
        const user = result._tokenResponse;

        // _____Lấy ngày sinh và giới tính đối với tài khoản thường____
        
        // google.addScope('https://www.googleapis.com/auth/user.birthday.read');
        // google.addScope('https://www.googleapis.com/auth/user.gender.read');
        // const tokengg = result._tokenResponse.oauthAccessToken;
        // console.log(tokengg);
        // const response = await fetch("https://people.googleapis.com/v1/people/me?personFields=birthdays,genders", {
        //     method: "GET",
        //     headers: {
        //         'Authorization': `Bearer ${tokengg}`,
        //         "Content-Type": "application/json",
               
        //     },
        // });
        // console.log(response.json());

        if (user.email.endsWith("@ou.edu.vn")) {
            let form = new FormData();
            console.log(user);
            form.append('email', user.email);
            form.append('first_name', user.firstName);
            form.append('last_name', user.lastName);
            form.append('role', "4");
            form.append('uid', result.user.uid); // UID từ Firebase
            form.append('username', user.email);
            await uploadImageToForm(form, user.photoUrl);
            // console.log(form['username']);
            let res = await APIs.post(endpoints['dang_ky'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(res.status ===400){
                setError("Tài khoản đã tồn tại");
            }
            else{
                // console.log(`${user.lastName} ${user.firstName}`);
                e.preventDefault();
                nav("/");
                // nav("/sinh-vien-dang-ky", { state: { 
                //     email: user.email, 
                //     hoten: `${user.lastName} ${user.firstName}`, 
                // }});
            } 
        } else {
            setError("Chỉ chấp nhận email thuộc miền @ou.edu.vn.");
            setLoading(false);
            // Đăng xuất nếu email không hợp lệ
            await auth.currentUser.delete();      
        }

    }

    const validateDangKy = async () => {
        let valid = true;
        let newErrors = { email: "", username: "", password: "", confirmPassword: "", avatar: "" };

        if (!validateEmail(user.email)) {
            newErrors.email = 'Email nhập không hợp lệ! Vui lòng nhập dạng 10 số + tên @ou.edu.vn';
            valid = false;
        }
        if (!validatePassword(user.password)) {
            newErrors.password = 'Password phải có từ 8 ký tự trở lên';
            valid = false;
        }
        if (user.password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
            valid = false;
        }
        if (!user.avatar) {
            newErrors.avatar = 'Avatar không tồn tại!';
            valid = false;
        }
        if (!user.username) {
            newErrors.username = 'Username không được để trống!';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            let tk_valid = false;
            try {
                const check = await APIs.get(`${endpoints['tai_khoan_is_valid']}?email=${user.email}&username=${user.username}`);
                if (check.status === 200) {
                    const res = check.data.is_valid;
                    if (res === true) {
                        tk_valid= true;
                    }
                }
            } catch (ex) {
                setLoading(false);
                console.error('Có lỗi gì đó đã xảy ra', 'Tài khoản sinh viên đã tồn tại!');
            }
            console.log(tk_valid);
            if (!tk_valid) {
                setLoading(true);
                try {
                    const otp = generateOTP(); 
                    const body = "Mã OTP của bạn là:" + otp;
                    const header = "Xác thực mã OTP tạo tài khoản sinh viên";
                    const res = await sendEmail(user.email, header, body); 
                    if (res.status === 200) {
                        console.log('Gửi email thành công!', otp);
                        setLoading(false);
                        handleShow();
                    }
                } catch (error) {
                    console.error('Có lỗi xảy ra trong quá trình đăng ký:', error.message);
                    alert('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.');
                }
            }
        }
    };

    const handleSubmit = () => {
        const otpString = otp.join('');
        if (otpString === randomOTP) {
            handleClose(); 
            PostTaiKhoan();
        } else {
            alert('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
        }
    };

    const PostTaiKhoan = async () => {
        try {
            setLoading(true);
            let form = new FormData();
            console.log(user);
            for (let key in user) {
                if (key === "avatar") {
                    form.append(key, user.avatar);
                } else {
                    form.append(key, user[key]);
                }
            }
            console.log("FormData:", form);
            let res = await APIs.post(endpoints['dang_ky'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            if (res.status === 201) {
                console.error('Tạo tài khoản thành công!');
                // nav("/sinh-vien-dang-ky", {state: { email: user.email }});
            }

        } catch (ex) {
            console.error('Có lỗi gì đó đã xảy ra trong lúc tạo tài khoản!', ex.message);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        nav("/dang-nhap");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h2 className="mb-4">Đăng Ký</h2>
                    {errors.avatar && <Alert variant="danger">{errors.avatar}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh đại diện</Form.Label>
                            <Form.Control type="file" onChange={handleChooseAvatar} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email"
                                value={user.email}
                                onChange={handleEmailChange}
                            />
                            {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={user.username}
                                onChange={handleUsernameChange}
                            />
                            {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                        </Form.Group>
                        <Form.Group className="mb-3 position-relative" controlId="formBasicPasswordInput">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={user.password}
                                onChange={handlePasswordChange}
                            />
                            <div className="position-absolute end-0 bottom-50 translate-middle-y">
                                <Form.Check
                                    id="formBasicShowPasswordCheckbox"
                                    type="checkbox"
                                    className="cursor-pointer"
                                    label={<i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                            </div>                      
                            {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative" controlId="formConfirmPassword">
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <div className="position-absolute end-0 bottom-50 translate-middle-y">
                                <Form.Check
                                    id="formConfirmShowPasswordCheckbox"
                                    type="checkbox"
                                    className="cursor-pointer"
                                    label={<i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            {errors.confirmPassword && <Alert variant="danger">{errors.confirmPassword}</Alert>}
                        </Form.Group>

                        {loading ? <Spinner animation="border" /> : 
                            <>
                                <Button variant="outline-primary" className="mb-3" onClick={registerWithEmailAndPassword}>
                                    Đăng ký
                                </Button>
                                <Button variant="outline-primary" className="mb-3" onClick={registergg}>
                                    Đăng ký gg
                                </Button>
                            </>
                        }
                        <Button variant="outline-secondary" className="mb-3" onClick={login}>
                            Đã có tài khoản? Đăng nhập
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập mã OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="d-flex justify-content-center">
                        {otp.map((value, index) => (
                            <Form.Control
                                key={index}
                                ref={ref => refs.current[index] = ref}
                                className="otp-input mx-1 text-center"
                                value={value}
                                onChange={(e) => handleChangeText(e.target.value, index)}
                                type="text"
                                maxLength={1}
                            />
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DangKy;
