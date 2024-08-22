// ForgotPassword.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { auth, sendPasswordResetEmail } from '../../configs/Firebase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Email đặt lại mật khẩu đã được gửi!');
            setError('');
        } catch (error) {
            setError('Lỗi khi gửi email đặt lại mật khẩu: ' + error.message);
            setMessage('');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h2 className="mb-4">Quên mật khẩu</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handlePasswordReset}>
                            Gửi email đặt lại mật khẩu
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
