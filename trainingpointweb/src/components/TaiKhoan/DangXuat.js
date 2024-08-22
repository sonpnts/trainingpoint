import { useContext } from "react";
import { Button } from "react-bootstrap"; // Thay thế react-native-paper bằng react-bootstrap hoặc các thư viện UI khác cho ReactJS
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";

const DangXuat = () => {
    // const [user, dispatch, isAuthenticated, setIsAuthenticated, role, setRole] = useContext(MyContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigate();
    const logout = (e) => {
        dispatch({
            type: "logout"
        });
        cookie.save('token', null);
        console.log("Đăng xuất thành công!");
        e.preventDefault();
        nav("/dang-nhap");
        
        
    };

    return (
        <Button variant="outline-danger" onClick={logout} style={{ marginTop: 10 }} className="mx-2">
            Đăng xuất
        </Button>
    );
};

export default DangXuat;
