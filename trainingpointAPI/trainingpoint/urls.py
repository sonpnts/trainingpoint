from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import routers
from trainingpoint import views
from trainingpoint import send_mail
r = routers.DefaultRouter()

r.register('khoas', views.KhoaViewSet, basename='Khoa')
r.register('lops', views.LopViewSet, basename='Lớp')
r.register('taikhoans', views.TaiKhoanViewSet, basename='Tài Khoản')
r.register('sinhviens', views.SinhVienViewSet, basename='Sinh Viên')
r.register('dieus', views.DieuViewSet, basename='Điều')
r.register('hoatdongs', views.HoatDongNgoaiKhoaViewSet, basename='Hoạt Động Ngoại Khóa')
r.register('baiviets', views.BaiVietViewSet, basename="Bài Viết")
r.register('comments', views.CommentViewset, basename="Comment")
r.register('diemrenluyens', views.DiemRenLuyenViewset, basename='Điểm Rèn Luyện')
r.register('thamgias', views.ThamGiaViewSet, basename='Tham Gia')
r.register('minhchungs', views.MinhChungViewSet, basename='Minh Chứng')
r.register('send_mail', send_mail.SendEmailViewSet, basename='send_mail')
r.register('hockinamhocs', views.HocKyNamHocViewset, basename='hockinamhocs')
r.register('trolysinhviens', views.TroLySinhVienKhoaViewset, basename='TroLySinhViens')
urlpatterns = [
    path('bao-cao-lop/<int:id_lop>/<int:id_hoc_ky>/<int:id_format>/', views.ExportBaoCaoViewLop.as_view(), name='Báo cáo theo lớp xuất file'),
    path('bao-cao-khoa/<int:id_khoa>/<int:id_hoc_ky>/<int:id_format>/', views.ExportBaoCaoViewKhoa.as_view(), name='Báo cáo theo khoa xuất file'),
    path('bao-cao-chi-tiet/<int:sinh_vien_id>/<int:hoc_ky_id>/<int:id_format>/', views.BaoCaoChiTietSinhVien.as_view(), name='Báo cáo chi tiết sinh viên xuất file'),
    path('thong-ke-lop/<int:id_lop>/<int:id_hoc_ky>/', views.BaoCaoViewLop.as_view(), name='Thống kê theo lớp'),
    path('thong-ke-khoa/<int:id_khoa>/<int:id_hoc_ky>/', views.BaoCaoViewKhoa.as_view(), name='Thống kê theo khoa'),
    path('upload-diem-danh/<int:hd_ngoaikhoa_id>/<int:hk_id>/', views.UploadFileDiemDanh.as_view(), name='Upload điểm danh'),

    path('', include(r.urls))
]
