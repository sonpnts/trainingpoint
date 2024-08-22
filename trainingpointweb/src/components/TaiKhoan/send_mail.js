import APIs, { endpoints } from '../../configs/APIs';

const sendEmail = async (email, header, body) => {
    try {
        const response = await APIs.post(endpoints.send_mail, {
            subject: header,
            message: body,
            recipient: email,
        });
        return response; // Trả về dữ liệu từ response nếu cần thiết
    } catch (error) {
        console.error('Có lỗi xảy ra khi gửi email:', error);
        throw error; // Ném lỗi để xử lý ở phần gọi hàm này
    }
};
export default sendEmail;
