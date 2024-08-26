import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../configs/Firebase';
import {MyDispatchContext, MyUserContext} from '../../configs/MyContext';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import './StylesChatScreen.css';
import './Styles.css';


const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sv, setSv] = useState();
  const [khoa, setKhoa] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const getRoom = async () => {
    const unsubscribe = onSnapshot(collection(db, 'chatRooms'), (snapshot) => {
      let rooms = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (user.role === 4 && Array.isArray(data.participants) && data.participants.includes(user.id)) {
          rooms.push({ ...data, id: doc.id });
          setChatRooms(rooms);
        }
      });
      if (user.role === 4) {
        if (rooms.length > 0) {
          setSelectedRoom(rooms[0].id); // Chọn phòng đầu tiên mà sinh viên có thể tham gia
        } else {
          createChatRoomForStudent(); // Tạo phòng mới nếu không có phòng nào
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const svres = await authAPI().get(endpoints['current_sinhvien']);
        setSv(svres.data);
        
        const response = await authAPI().get(endpoints['get_khoa']);
        if (response.status === 200) {
          setKhoa(response.data);
        } else {
          alert('Lỗi khi lấy khoa');
        }
      } catch (error) {
        console.error('Lỗi khi lấy khoa:', error);
        alert('Lỗi khi lấy khoa');
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (khoa) {
      getRoom();
    }
  }, [khoa]);

  useEffect(() => {
    if (selectedRoom) {
      const q = query(collection(db, `chatRooms/${selectedRoom}/messages`), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let msgs = [];
        snapshot.forEach(doc => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgs);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [selectedRoom]);

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
    } 
    else if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    }
    else {
      return 'Vừa xong';
    }
  };

  const createChatRoomForStudent = async () => {
    try {
      const newRoom = await addDoc(collection(db, 'chatRooms'), {
        createdAt: Timestamp.now(),
        participants: [user.id],
        mssv: sv.mssv,
        ten_sv: sv.ho_ten,
        khoa: khoa.id,
      });
      setSelectedRoom(newRoom.id);
    } catch (error) {
      console.error('Lỗi khi tạo phòng chat:', error);
      alert('Lỗi khi tạo phòng chat');
    }
  }

  const sendMessage = async () => {
    if (message.trim() && selectedRoom) {
      await addDoc(collection(db, `chatRooms/${selectedRoom}/messages`), {
        text: message,
        createdAt: Timestamp.now(),
        userId: user.id,
        role: user.role,
        email: user.email,
        ten: sv.ho_ten,
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

  const renderItem = (item) => {
    const isSentByCurrentUser = item.userId === user.id;
    const fullDate = item.createdAt ? (item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : new Date(item.createdAt).toLocaleString()) : "Unknown time";

    const createdAt = item.createdAt ? calculateTimeDifference(item.createdAt) : "Unknown time"; 
    return (
      <div className={`message ${isSentByCurrentUser ? 'message-sent' : 'message-received'}`} key={item.id} title={fullDate}>
        <p className="message-time">{createdAt}</p>
        <p className="message-username">{renderUsername(item.ten, item.userId, item.role)}:</p>
        <p className="message-text">{item.text}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
        <div fluid className="registration-background">
    <div className="text-black">
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
          
          }
          }
        />
        <button className="send-button" onClick={sendMessage}>Gửi</button>
      </div>
    </div>
            </div>

            </div>
  );
};

export default ChatScreen;
