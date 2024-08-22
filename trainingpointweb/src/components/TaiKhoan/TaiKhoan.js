import React, { useState, useEffect, useContext, useRef } from 'react';
import { Form, Card,Container, Button,Row, Alert, Image } from 'react-bootstrap';
import { authAPI, endpoints } from '../../configs/APIs';
import './TaiKhoan.css'; // Make sure to adjust the path to your CSS file accordingly
import { auth } from '../../configs/Firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MyDispatchContext, MyUserContext } from '../../configs/MyContext';
import moment from 'moment';
import './Styles.css';


const UserInfo = () => {
    // const user = useContext(MyUserContext);
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [sv, setSv] = useState(null);
    const fileInputRef = useRef(null);
    const [lops, setLops] = useState([]);
    const [changedFields, setChangedFields] = useState([]);
    const [errors, setErrors] = useState({
        avatar: ""
    });

    const roles = {
        1: 'Admin',
        2: 'Cộng Tác Sinh Viên',
        3: 'Trợ Lý Sinh Viên',
        4: 'Sinh Viên'
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const reslop = await authAPI().get(endpoints['lop']);
                const response = await authAPI().get(endpoints['current_taikhoan']);
                setLops(reslop.data.results);
                setUser(response.data);

                // If the user is a student, fetch student information
                if (response.data.role === 4) {
                    const ressv = await authAPI().get(endpoints['current_sinhvien']);
                    setSv(ressv.data);
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const findClassName = (classId) => {
        const foundClass = Array.isArray(lops) && lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : "";
    };
  

    const handleConfirm = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        // change("ngay_sinh", formattedDate);
        changesv("ngay_sinh", formattedDate);
    };

    const change = (field, value) => {
        setUser(current => ({ ...current, [field]: value }));
        if (!changedFields.includes(field)) {
            setChangedFields([...changedFields, field]);
        }
        setErrors(current => ({ ...current, [field]: "" })); // Clear error message when the field changes
    };

    const changesv = (field, value) => {
        setSv(current => ({ ...current, [field]: value }));
        if (!changedFields.includes(field)) {
            setChangedFields([...changedFields, field]);
        }
    };

    const handleChooseAvatar = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        change('avatar', file);
    };


    const changinfo = async () => {
        try {
            const form = new FormData();
            changedFields.forEach(field => {
                if (field === 'avatar') {
                    // Add image data to FormData
                    form.append('avatar', user.avatar);
                } else {
                    // Update other data fields
                    form.append(field, user[field]);
                }
            });
            console.log(form);
            if (form) {
                const response = await authAPI().patch(endpoints['current_taikhoan'], form, {
                    headers: {
                        'Content-Type': 'application/form-data'
                    }
                });
                if(user.role===2){
                    if (response.status === 200) {
                        alert('Cập nhật thông tin tài khoản thành công!');
                        setChangedFields([]); 
                    }
                }
            }
            if (user.role === 4 && sv) {
                const updatedSvData = {};
                changedFields.forEach(field => {
                    updatedSvData[field] = sv[field];
                });
                console.log(updatedSvData);
                if (updatedSvData.ngay_sinh){
                    const ressv = await authAPI().patch(endpoints['current_sinhvien'], updatedSvData);
                    if (ressv.status === 200) {
                        alert('Cập nhật thông tin sinh viên thành công!');
                        setChangedFields([]); 
                    }
                }
            
            }
           
        } catch (error) {
            console.error("Error updating information:", error);
        }
    };

    if (!user) {
        return (
            <div className="container1" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div>
        <div fluid className="registration-background">
    <Container >
        <div className="container2">
            <Card className="my-4">
                <Card.Body>
                <div className="text-center mb-4">
                        <Image
                            src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || 'placeholder-image-url'}
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            roundedCircle
                            className="mb-3"
                            onClick={() => fileInputRef.current.click()}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleChooseAvatar}
                        />
                        {/* <Form.Group className="mb-3">
                            <Form.Label>Ảnh đại diện</Form.Label>
                            <Form.Control type="file" onChange={handleChooseAvatar} />
                        </Form.Group> */}
                        { errors.avatar ? <p className="text-danger">{errors.avatar}</p> : null}
                    </div>
                    <Form>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={user.username}
                                onChange={(e) => change("username", e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={user.email}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Label>Loại tài khoản</Form.Label>
                            <Form.Control
                                type="text"
                                value={roles[user.role]}
                                disabled
                            />
                        </Form.Group>
                        {user.role === 4 && sv && (
                            <>
                                <Form.Group controlId="ho_ten">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sv.ho_ten}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group controlId="dia_chi">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sv.dia_chi}
                                        onChange={(e) => changesv("dia_chi", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="gioi_tinh">
                                    <Form.Label>Giới tính</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sv.gioi_tinh === 1 ? 'Nam' : 'Nữ'}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group controlId="lop">
                                    <Form.Label>Lớp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={findClassName(sv.lop)}
                                        disabled
                                    />
                                </Form.Group>
                                {/* <Form.Group controlId="ngay_sinh">
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <button onClick={showDatePicker}>
                                        <p>{sv.ngay_sinh}</p>
                                    </button>
                                    {isDatePickerVisible && (
                                        <DatePicker
                                            selected={new Date(sv.ngay_sinh)}
                                            onChange={handleConfirm}
                                            dateFormat="dd/MM/yyyy"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                        />
                                    )}
                                </Form.Group> */}

                                <Form.Group controlId="formNgaySinh">
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <div></div>
                                    <DatePicker
                                        selected={sv.ngay_sinh}
                                        onChange={handleConfirm}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Card.Body>
                <Button 
                variant="contained" 
                className="my-3"
                onClick={changinfo}
                disabled={!changedFields.length} // Disable button when no information is changed
            >
                Chỉnh sửa thông tin
            </Button>
            </Card>
            </div>
    </Container>
    </div>
    </div>
    
        </div>
        
    );
};

export default UserInfo;
