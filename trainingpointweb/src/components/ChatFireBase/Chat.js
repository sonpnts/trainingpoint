import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../configs/Firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, doc} from 'firebase/firestore';
import { MyDispatchContext, MyUserContext } from '../../configs/MyContext';
import APIs, { endpoints } from '../../configs/APIs';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './StylesChatScreen.css';

const ChatDetailScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [khoa, setKhoa] = useState('');
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    if (roomId) {
    const roomRef = doc(db, `chatRooms/${roomId}`);
    const unsubscribeRoom = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
        setRoomInfo(doc.data()); // Lưu thông tin phòng chat vào state
        }
    });


      const q = query(collection(db, `chatRooms/${roomId}/messages`), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let msgs = [];
        snapshot.forEach(doc => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgs);
      });
      setLoading(false);
    //   getDatRoom();
   
    return () =>{
        unsubscribeRoom();
        unsubscribe();
    }


    

    }
  }, [roomId]);

   
  const sendMessage = async () => {
    if (message.trim() && roomId) {
      await addDoc(collection(db, `chatRooms/${roomId}/messages`), {
        text: message,
        createdAt: Timestamp.now(),
        userId: user.id,
        ten: user.first_name + ' ' + user.last_name,
        role: user.role,
        email: user.email,
      });
      setMessage('');
    }
  };

  const renderUsername = (userName, userId, userRole) => {
    let displayName = userName;
    if (userRole === 3 && userId !== user.id) {
      displayName += " - Trợ lý sinh viên khoa " + khoa.ten_khoa;
    }
    if (userId === user.id) {
      displayName = "Bạn";
    }
    return displayName;
  };

  const calculateTimeDifference = (timestamp) => {
    const now = new Date();
    const createdAt = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMs = now - createdAt;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const renderItem = (item) => {
    const isSentByCurrentUser = item.userId === user.id;
    const createdAt = item.createdAt ? calculateTimeDifference(item.createdAt) : "Unknown time"; 
    return (
      <div className={`message ${isSentByCurrentUser ? 'message-sent' : 'message-received'}`} key={item.id}>
        <p className="message-time">{createdAt}</p>
        <p className="message-username">{renderUsername(item.ten, item.userId, item.role)}:</p>
        <p className="message-text">{item.text}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="chat-container" >
        {roomInfo && (
        <div className="chat-header text-center p-1 bg-light border-bottom bg-primary text-black rounded">
            <h5 className="mb-0">{roomInfo.mssv} - {roomInfo.ten_sv}</h5>
        </div>
        )}

      <div className="message-list">
        {messages.map(renderItem)}
      </div>
      <div className="input-container">
        <input
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button className="send-button" onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatDetailScreen;
