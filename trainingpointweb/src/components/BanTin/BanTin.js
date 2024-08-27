
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import BaiViet from './BaiViet';
import Sidebar from './Sidebar';
import { isCloseToBottom } from '../Utils/Tobottom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import debounce from 'lodash.debounce';
import './Styles.css'; 

const BanTin = () => {
    const [q, setQ] = useState('');
    const [baiViets, setBaiViets] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef(null);

    const loadBaiViets = useCallback(async () => {
        console.log("Page", page);
        try {
            setLoading(true);
            let baiviets = await authAPI().get(`${endpoints['bai_viet']}?page=${page}`);

            if (baiviets.data.next === null) {
                setPage(0);
            }
            if (page === 1) {
                setBaiViets(baiviets.data.results);
            } else {
                setBaiViets(current => [...current, ...baiviets.data.results]);
            }

        } catch (ex) {
            console.log("Lỗi", ex);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleSearch = useCallback(
        debounce(async (query) => {
            setPage(1);
            try {
                setLoading(true);
                let baiviets = await authAPI().get(`${endpoints['bai_viet']}?q=${query}`);
                console.log(baiviets.data);
                if (baiviets.data.count === 0) {
                    setBaiViets([]);
                } else {
                    setBaiViets(baiviets.data.results);
                }
            } catch (ex) {
                console.log("Lỗi", ex);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        handleSearch(q);
    }, [q, handleSearch]);

    useEffect(() => {
        loadBaiViets();
    }, [loadBaiViets, page]);

    const loadMore = () => {
        if (!loading && page > 0 && scrollContainerRef.current && isCloseToBottom(scrollContainerRef.current)) {
            setPage(page + 1);
        }
    };

    const handleTextChange = (event) => {
        setQ(event.target.value);
    };

    // Generate random colors
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="app-container">
            <div className="background-image">
                <div className="background-overlay"></div>
                <Container onScroll={loadMore} ref={scrollContainerRef} className="content-container">
                    <header className="menu">
                        <Form className="search-form">
                            <Form.Control 
                                type="text" 
                                placeholder="Nhập từ khóa..." 
                                onChange={handleTextChange} 
                                value={q} 
                                className="search-input" 
                            />
                            <Button onClick={() => handleSearch(q)} className="search-button">
                                Tìm kiếm
                            </Button>
                        </Form>
                    </header>
                    <Row className="mt-3 mb-6">
                        <Col md={8} sm={12} xs={12} className="content-col">
                            <Row className="mt-4 mb-4">
                                {baiViets.length === 0 ? (
                                    <Col className="text-center">
                                        <p>Không có bài viết nào</p>
                                    </Col>
                                ) : (
                                    baiViets.map((b) => (
                                        <Col key={b.id} md={12} className="bai-viet">
                                            <BaiViet 
                                                baiviet={b} 
                                                className="card-body1" 
                                                style={{ backgroundColor: getRandomColor() }} 
                                            />
                                        </Col>
                                    ))
                                )}
                                {loading && page > 1 && (
                                    <Col className="text-center">
                                        <Spinner animation="border" />
                                        <span className="ml-2">Đang tải...</span>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        <Sidebar />
                    </Row>
                </Container>
            </div>
   
        </div>
    );
};

export default BanTin;
