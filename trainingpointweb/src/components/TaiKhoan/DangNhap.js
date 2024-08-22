// import React, { useState, useContext } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
// import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
// import APIs, { endpoints, authAPI } from "../../configs/APIs";
// import cookie from "react-cookies";
// import './DangNhap.css';

// const DangNhap = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const nav = useNavigate();
//     const [showPassword, setShowPassword] = useState(false);
//     const dispatch = useContext(MyDispatchContext);

//     const toggleShowPassword = () => {
//         setShowPassword(!showPassword);
//     };
    
//     const login = async (e) => {
//         setLoading(true);
//         try {
//             let res = await APIs.post(endpoints['dang_nhap'], {
//                 'username': username,
//                 'password': password,
//                 'client_id': "sdUIX9LsM0sEZH8ipS6op9WPiNjEK8mGU2wV1v8u",
//                 'client_secret': "rUygoi2fiap7rBvHjOULOulzYWDItVEQ8xC2QkPgn8iD0xIuSNB6gFvUhtHMtJFxg8GGveIkIYK7JDClKknom3ETDZop5Le8BRezqehWcRywwGHTxb6xjtio5xwRLAq7",
//                 'grant_type': "password"
//             }, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             if (res.status === 200) {
//                 cookie.save("token", res.data.access_token);
//                 let userdata = await authAPI(cookie.load("token")).get(endpoints['current_taikhoan']);
//                 cookie.save('user', userdata.data);
               
//                 dispatch({
//                     "type": "login",
//                     "payload": userdata.data
//                 });
                
//                 console.log("Đăng nhập thành công!");
//                 setLoading(false);
//                 e.preventDefault();
//                 nav("/"); 
//             } else {
//                 setError("Sai tên đăng nhập hoặc mật khẩu");
//             }

//         } catch (ex) {
//             console.error("Lỗi tại màn hình đăng nhập:", ex);
//             setError("Sai tên hoặc mật khẩu, vui lòng thử lại.");
//             setLoading(false);
//         }
//     };
    
//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter') {
//             event.preventDefault(); 
//             login();
//         }
//     };

//     const register = (e) => {
//         e.preventDefault();
//         nav("/dang-ky");
//     };

//     return (
//         <div className="registration-background1">
//         <div className="form-container">
//             <section>
//                 <div className="container-fluid h-custom">
//                     <div className="row d-flex justify-content-center align-items-center h-100">
//                         <div className="col-md-9 col-lg-6 col-xl-5">
//                             <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
//                                 className="img-fluid" alt="Sample image" />
//                         </div>
//                         <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
//                             <Form onKeyDown={handleKeyDown}>
//                                 <h2 className="mb-4 text-center">Đăng Nhập</h2>
//                                 {error && <Alert variant="danger">{error}</Alert>}
//                                 <Form.Group controlId="formBasicUsername" className="form-outline mb-4">
//                                     <Form.Label>Tên đăng nhập</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Nhập tên đăng nhập"
//                                         value={username}
//                                         onChange={(e) => setUsername(e.target.value)}
//                                         className="form-control form-control-lg"
//                                     />
//                                 </Form.Group>
    
//                                 <Form.Group controlId="formPassword" className="form-outline mb-3">
//                                     <Form.Label>Mật khẩu</Form.Label>
//                                     <Form.Control
//                                         type={showPassword ? "text" : "password"}
//                                         placeholder="Nhập mật khẩu"
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="form-control form-control-lg"
//                                     />
//                                 </Form.Group>
                                
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div className="form-check mb-0">
//                                         <input 
//                                             className="form-check-input me-2" 
//                                             type="checkbox" 
//                                             value="" 
//                                             id="form2Example3" 
//                                             onChange={toggleShowPassword} 
//                                         />
//                                         <label className="form-check-label" htmlFor="form2Example3">
//                                             Hiển thị mật khẩu
//                                         </label>
//                                     </div>
//                                 </div>

    
//                                 <div className="text-center text-lg-start mt-4 pt-2">
//                                     {loading ? 
//                                         <div className="d-flex justify-content-center mb-3">
//                                             <Spinner animation="border" />
//                                         </div> : 
//                                         <Button 
//                                             variant="primary" 
//                                             onClick={login} 
//                                             className="btn btn-primary btn-lg"
//                                             style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}
//                                         >
//                                             Đăng nhập
//                                         </Button>
//                                     }
//                                     <p className="small fw-bold mt-2 pt-1 mb-0">
//                                         Không có tài khoản? <a href="#!" className="link-danger" onClick={register}>Đăng ký</a>
//                                     </p>
//                                 </div>
//                             </Form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     </div>
    
//     );
// };

// export default DangNhap;



import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { MyDispatchContext } from "../../configs/MyContext";
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import cookie from "react-cookies";
import {getAdditionalUserInfo} from "firebase/auth";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../../configs/Firebase';
import firebase from 'firebase/compat/app';

const DangNhap = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useContext(MyDispatchContext);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const loginnormal = async () => {
        setLoading(true); // Đặt trạng thái loading là true khi bắt đầu
        try {
            // Đăng nhập bằng email và mật khẩu
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            // Lấy thông tin người dùng và token
            const user = userCredential.user;
            console.log('User:', user);
            const token = await user.getIdToken();
            cookie.save('token', token);

            let userdata = await authAPI(token).get(endpoints['current_taikhoan']);
            cookie.save('user', userdata.data);
            if(userdata.status === 200){
                dispatch({
                    type: 'login',
                    payload: userdata.data
                });
                nav("/");
            }else
            {
                setError("Đăng nhập không thành công. Vui lòng thử lại.");
            }
            

            // Trả về thông tin thành công
            // return {
            //     success: true,
            //     user,
            //     token
            // };
        } catch (error) {
            // Xử lý lỗi và trả về thông báo lỗi cụ thể
            let errorMessage = "Đăng nhập không thành công. Vui lòng thử lại.";
    
            if (error.code === 'auth/invalid-email') {
                errorMessage = "Địa chỉ email không hợp lệ.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "Người dùng không tồn tại.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Mật khẩu không chính xác.";
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = "Tài khoản của bạn đã bị vô hiệu hóa.";
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Kết nối mạng bị lỗi. Vui lòng kiểm tra lại kết nối.";
            }
    
            // Trả về thông tin lỗi
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false); // Đặt trạng thái loading là false khi kết thúc
        }
    };
    const uploadImageToForm = async (form, imageUrl) => {
        const response = await fetch(imageUrl);
       
        const blob = await response.blob();

        const file = new File([blob], 'avatar.jpg', { type: blob.type });
        form.append('avatar', file);
    };

    const logingg = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const {isNewUser}  = getAdditionalUserInfo(result)    
            const user = result._tokenResponse;
            const token = await user.idToken;
            console.log('Token:', token);
            cookie.save('token', token);
            if(isNewUser == true){
                if (user.email.endsWith("@ou.edu.vn")) {
                    let form = new FormData();
                    form.append('email', user.email);
                    form.append('first_name', user.firstName);
                    form.append('last_name', user.lastName);
                    form.append('role', "4");
                    form.append('uid', result.user.uid); // UID từ Firebase
                    form.append('username', user.email);
                    await uploadImageToForm(form, user.photoUrl);
                    let res = await APIs.post(endpoints['dang_ky'], form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    let userdata = await authAPI(token).get(endpoints['current_taikhoan']);
                    cookie.save('user', userdata.data);
                    dispatch({
                        type: 'login',
                        payload: userdata.data
                    });
                
                    nav("/");
                    // nav("/sinh-vien-dang-ky", { state: { 
                    //     email: user.email, 
                    //     hoten: `${user.lastName} ${user.firstName}`, 
                    // }});
                    
                } else {
                    setError("Chỉ chấp nhận email thuộc miền @ou.edu.vn.");
                    setLoading(false);
                    await auth.currentUser.delete();      
                }
            }else{
                let userdata = await authAPI(token).get(endpoints['current_taikhoan']);
                cookie.save('user', userdata.data);
                dispatch({
                    type: 'login',
                    payload: userdata.data
                });
                console.log("Đăng nhập thành công!");
            nav("/");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setError("Đăng nhập không thành công. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // const register = () => {
    //     nav("/dang-ky");
    // };

    const forgotPassword = () => {
        nav("/forgot-password");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6} xl={4}>
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h2 className="mb-4 text-center">Đăng Nhập</h2>
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

                            {loading ? <Spinner animation="border" variant="primary" /> : 
                                <>
                                    <Button variant="primary" onClick={loginnormal} className="w-100 mb-3">
                                        Đăng nhập
                                    </Button>
                                    <Button variant="outline-primary" onClick={forgotPassword} className="w-100 mb-3">
                                        Quên mật khẩu?
                                    </Button>
                                    <Button variant="outline-success" onClick={logingg} className="w-100 mt-2">
                                        Sinh viên đăng nhập với Google
                                    </Button>
                                </>
                            }
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DangNhap;
