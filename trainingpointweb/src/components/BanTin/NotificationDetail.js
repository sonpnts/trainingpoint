import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NotificationDetail.css'; // Đảm bảo tệp này tồn tại hoặc điều chỉnh đường dẫn

const notifications = [
    // Dữ liệu thông báo như trước
];

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Thêm hook useNavigate
    const notification = notifications.find(n => n.id === parseInt(id));
    const [showMore, setShowMore] = useState(false);

    if (!notification) {
        return <p>Thông báo không tìm thấy.</p>;
    }

    // Tìm các tin cùng chuyên mục (trừ tin hiện tại)
    const relatedNotifications = notifications.filter(n => n.id !== notification.id);

    return (
        <div className="notification-detail">
            <h1>{notification.title}</h1>
            <p><strong>Ngày:</strong> {notification.date}</p>
            <p>{showMore ? notification.content : `${notification.content.substring(0, 200)}...`}</p>
            <button 
                className="view-more-button" 
                onClick={() => setShowMore(!showMore)}
            >
                {showMore ? "Thu gọn" : "Xem tiếp"}
            </button>
            {showMore && (
                <div className="notification-author">
                    <p><strong>Người gửi:</strong> {notification.author}</p>
                </div>
            )}
            {showMore && (
                <div className="related-notifications">
                    <h2>Tin cùng chuyên mục</h2>
                    <ul>
                        {relatedNotifications.map((n) => (
                            <li key={n.id}>
                                <a 
                                    href={`/notifications/${n.id}`}
                                    onClick={(e) => {
                                        e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
                                        navigate(`/thong-tin/${n.id}`); // Chuyển hướng đến ThongTin1
                                    }}
                                >
                                    {n.title} (Ngày: {n.date})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationDetail;
