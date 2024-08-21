import axios from "axios";
import moment from "moment";
import cookie from "react-cookies";

// export const BASE_URL = 'http://192.168.96.1:8000/';

export const formatNS= (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };


export const formatDate = (date)=>{
    return moment(date).format(' HH:mm - DD/MM/YYYY');
};

export const BASE_URL = 'https://sonpnts.pythonanywhere.com/'

export const endpoints = {
    'bao-cao': '/bao-cao/',
    'bai_viet': '/baiviets/',
    'baiviet_like': (bai_viet_id) => `/baiviets/${bai_viet_id}/like/`,
    'baiviet_liked': (bai_viet_id) => `/baiviets/${bai_viet_id}/liked/`,
    'baiviet_tag': (bai_viet_id) => `/baiviets/${bai_viet_id}/tags/`,
    'binh_luan': (bai_viet_id) => `/baiviets/${bai_viet_id}/comment/`,
    'current_sinhvien': '/sinhviens/current-sinhvien/',
    'current_taikhoan': '/taikhoans/current-taikhoan/',
    'dang_ky': '/taikhoans/',
    'dang_ky_hoat_dong': (hoat_dong_id) => `/thamgias/${hoat_dong_id}/dang-ky-hoat-dong/`,
    'dang_nhap': '/o/token/',
    'diemdanh': (hd_ngoaikhoa_id, id_hoc_ky) => `/upload-diem-danh/${hd_ngoaikhoa_id}/${id_hoc_ky}/`,
    'dieu': '/dieus/',
    'hocky': '/hockinamhocs/',
    'hoat_dong': (hoat_dong_id) => `/hoatdongs/${hoat_dong_id}/`,
    'hd':'/hoatdongs/',
    'upload_diem_danh': '/hoatdongs/diemdanh/',
    'quan_ly_hoat_dong': '/hoatdongs/quanly/',
    'hoat_dong_tao_bai_viet':'hoatdongs/chua-co-bai-viet/',
    'kiem_tra_dang_ky': (hoat_dong_id) => `/thamgias/${hoat_dong_id}/kiem-tra-dang-ky/`,
    'khoa': '/khoas/',
    'lay_binh_luan': (bai_viet_id, page) => `/baiviets/${bai_viet_id}/comments/?page=${page}`,
    'lop': '/lops/',
    'owner_binh_luan': (com_id) => `/comments/${com_id}/tac_gia/`,
    'send_mail': '/send_mail/',
    'xoa_hoat_dong': '/hoatdongs/delete-hoat-dong/',
    'sinh_vien': '/sinhviens/',
    'sinh_vien_is_valid': '/sinhviens/is_valid/',
    'tac_gia': (bai_viet_id) => `/baiviets/${bai_viet_id}/tac_gia/`,
    'tai_khoan_is_valid': '/taikhoans/is_valid/',
    'tao_hoat_dong': '/hoatdongs/',
    'tro_ly': '/trolysinhviens/',
    'firebase':'taikhoans/firebase/',
    'get_khoa':'/taikhoans/khoa/',



    'sinh_vien_khoa': (khoa_id) => `/khoas/${khoa_id}/sinhviens/`,
    'sinh_vien_lop': (lop_id) => `/lops/${lop_id}/sinhviens/`,
    'diemrenluyens': '/diemrenluyens/',
    'thong_ke_lop': (id_lop, id_hoc_ky) => `/thong-ke-lop/${id_lop}/${id_hoc_ky}/`,
    'thong_ke_khoa': (id_khoa, id_hoc_ky) => `/thong-ke-khoa/${id_khoa}/${id_hoc_ky}/`,
    'hoc_ky_nam_hoc': '/hockinamhocs/',
    'hockinamhoc_detail': (id) => `/hockinamhocs/${id}/`,
    'hoatdong': '/hoatdongs/',
    'hoat_dong_diem_danh': (sinhvien_id, hk_id) => `/thamgias/hoat-dong-diem-danh/${sinhvien_id}/${hk_id}/`,
    'hoat_dong_chua_diem_danh': (sinhvien_id, hk_id) => `/thamgias/hoat-dong-chua-diem-danh/${sinhvien_id}/${hk_id}/`,
    // 'tinh_diem_ren_luyen': (sinhvien_id, hk_id) => `/diemrenluyens/calculate/${sinhvien_id}/${hk_id}/`,
    'tinh_diem' : `/diemrenluyens/calculate/`,
    'tham_gia': (thamgia_id) => `/thamgias/${thamgia_id}/`,
    'tham_gia_bao_thieu': '/thamgias/baothieu/',
    'minh_chung' : '/minhchungs/',

}



export const authAPI = () => {
    const token = cookie.load('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}


export default axios.create({
    baseURL: BASE_URL
});