import React from 'react';
import { Col } from 'react-bootstrap';
import Notification from './Notification'; // Import the Notification component
import './Sidebar.css'; // Ensure to import the CSS file

const Sidebar = () => {
    const notifications = [
        {
            id: 1,
            title: "Làm thế nào để chọn đúng ngành khi không biết mình thích gì",
            date: "09/01/2015 10:20",
            content: "Em trước giờ không biết mình thích gì và đang băn khoăn chọn trường thi đại học. Em dự định chọn ngành Quản trị khách sạn vì thấy khá phù hợp với tính cách năng động, hòa đồng, giao tiếp tốt của mình. Nhưng em không ",
        },
        {
            id: 2,
            title: "Sinh viên Quản trị kinh doanh nên học thêm kỹ năng gì",
            date: "15/01/2015",
            content: "Em là sinh viên năm 3 ngành Quản trị kinh doanh. Bây giờ em rất bối rối không biết nên làm thế nào để có việc làm. Thật sự, em không có đam mê gì đặc biệt hoặc do em chưa tìm ra được nó. Do đó, em chỉ mong ra trường "
        },
        {
            id: 3,
            title: "Chọn ngành gì cho người dễ thay đổi",
            date: "09/01/2015",
            content: "Chỉ còn hơn tuần nữa bước vào kỳ thi THPT quốc gia, nhưng em vẫn chưa chọn được ngành để gắn bó lâu dài. Em là người biết nhiều thứ nhưng lại chẳng đặc biệt giỏi thứ gì. Em ưa khám phá mạo hiểm và sở thích "
        }
    ];

    return (
        <Col md={4} sm={12} xs={12} className="sidebar-col1">
            <div className="sidebar-content1">
                <div className="centered-text">
                    <h5>Thông Báo</h5>
                </div>
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        id={notification.id}
                        title={notification.title}
                        date={notification.date}
                        content={notification.content}
                    />
                ))}
            </div>
        </Col>
    );
};

export default Sidebar;
