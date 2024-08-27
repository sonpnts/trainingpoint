import React from 'react';
import { Link } from 'react-router-dom'; 
import './Notification.css'; 

const Notification = ({ id, title, date, content }) => {
    return (
        <div className="notification">
            <h6>{title}</h6>
            <p><strong>Ngày:</strong> {date}</p>
            <p>{content}</p>
            <Link to={`/notification/${id}`}>Xem tiếp »</Link>
        </div>
    );
};

export default Notification;
