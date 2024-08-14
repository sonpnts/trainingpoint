from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class TaiKhoan(AbstractUser):
    avatar = CloudinaryField(null=True)

    class Roles(models.IntegerChoices):
        ADMIN = 1, 'Admin'
        CongTacSinhVien = 2, 'Cộng Tác Sinh Viên'
        TroLySinhVien = 3, 'Trợ Lý Sinh Viên'
        SinhVien = 4, 'Sinh Viên'

    role = models.IntegerField(choices=Roles.choices, null=True)

    def __str__(self):
        return self.username


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Khoa(BaseModel):
    ten_khoa = models.CharField(max_length=255)

    def __str__(self):
        return self.ten_khoa


class Lop(BaseModel):
    ten_lop = models.CharField(max_length=255)
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT)

    def __str__(self):
        return self.ten_lop


class TroLySinhVien_Khoa(BaseModel):
    trolySV = models.ForeignKey(TaiKhoan, on_delete=models.CASCADE, limit_choices_to={'role': TaiKhoan.Roles.TroLySinhVien})
    khoa = models.ForeignKey(Khoa, on_delete=models.PROTECT)


class SinhVien(BaseModel):
    mssv = models.CharField(max_length=10, unique=True)
    ho_ten = models.CharField(max_length=255)
    ngay_sinh = models.DateField()

    class GioiTinh(models.IntegerChoices):
        NAM = 1, 'Nam'
        NU = 2, 'Nữ'

    gioi_tinh = models.IntegerField(choices=GioiTinh)
    email = models.EmailField(null=False, unique=True)
    dia_chi = models.TextField()
    lop = models.ForeignKey(Lop, on_delete=models.CASCADE)

    def __str__(self):
        return self.ho_ten


class HocKy_NamHoc(BaseModel):
    class Meta:
        unique_together = ('hoc_ky', 'nam_hoc')

    class HocKy(models.IntegerChoices):
        MOT = 1, 'Một'
        HAI = 2, 'Hai'
        BA = 3, 'Ba'

    hoc_ky = models.IntegerField(choices=HocKy.choices)
    nam_hoc = models.CharField(max_length=9)

    def __str__(self):
        return f"{self.hoc_ky} - {self.nam_hoc}"


class Dieu(BaseModel):
    ma_dieu = models.CharField(max_length=10, unique=True)
    ten_dieu = models.CharField(max_length=255)
    diem_toi_da = models.IntegerField()
    def __str__(self):
        return self.ten_dieu


class HoatDongNgoaiKhoa(BaseModel):
    ten_HD_NgoaiKhoa = models.TextField()
    ngay_to_chuc = models.DateTimeField()
    thong_tin = RichTextField(null=True)
    diem_ren_luyen = models.IntegerField(default=5)
    dieu = models.ForeignKey(Dieu, on_delete=models.SET_DEFAULT, default=1)
    hk_nh = models.ForeignKey(HocKy_NamHoc, on_delete=models.SET_NULL, null=True)
    sinh_vien = models.ManyToManyField(SinhVien, through='ThamGia')
    tro_ly = models.ForeignKey(TaiKhoan, on_delete=models.PROTECT,
                               limit_choices_to={'role': TaiKhoan.Roles.TroLySinhVien})
    def __str__(self):
        return self.ten_HD_NgoaiKhoa


class ThamGia(models.Model):
    sinh_vien = models.ForeignKey(SinhVien, on_delete=models.CASCADE)
    hd_ngoaikhoa = models.ForeignKey(HoatDongNgoaiKhoa, on_delete=models.CASCADE)

    class TrangThai(models.IntegerChoices):
        DangKy = 0, 'Đăng Ký'
        DiemDanh = 1, 'Điểm Danh'
        BaoThieu = 2, 'Báo Thiếu'
        KhongHopLy= 3, 'Không Hợp Lý'

    trang_thai = models.IntegerField(choices=TrangThai, null=True)
    ngay_dang_ky = models.DateTimeField(auto_now_add=True)
    ngay_diem_danh = models.DateTimeField(default=None, null=True)

    def __str__(self):
        return f"{self.sinh_vien.mssv} - {self.hd_ngoaikhoa.ten_HD_NgoaiKhoa}"


class MinhChung(BaseModel):
    description = RichTextField()
    anh_minh_chung = CloudinaryField()
    tham_gia = models.ForeignKey(ThamGia, on_delete=models.CASCADE)
    phan_hoi = RichTextField(null=True)

class BaiViet(BaseModel):
    title = models.CharField(max_length=255)
    content = RichTextField(null=True)
    image = CloudinaryField()
    tro_ly = models.ForeignKey(TaiKhoan, on_delete=models.PROTECT, limit_choices_to={'role': TaiKhoan.Roles.TroLySinhVien})
    hd_ngoaikhoa = models.ForeignKey(HoatDongNgoaiKhoa, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Interaction(BaseModel):
    tai_khoan = models.ForeignKey(TaiKhoan, on_delete=models.CASCADE)
    bai_viet = models.ForeignKey(BaiViet, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class Comment(Interaction):
    content = models.CharField(max_length=255)


class Like(Interaction):
    class Meta:
        unique_together = ('bai_viet', 'tai_khoan')


class DiemRenLuyen(BaseModel):
    sinh_vien = models.ForeignKey(SinhVien, on_delete=models.CASCADE)
    hk_nh = models.ForeignKey(HocKy_NamHoc, on_delete=models.CASCADE)
    diem_tong = models.IntegerField()

    class XepLoai(models.IntegerChoices):
        XUATSAC = 1, 'Xuất Sắc'
        GIOI = 2, 'Giỏi'
        KHA = 3, 'Khá'
        TB = 4, 'Trung Bình'
        YEU = 5, 'Yếu'
        KEM = 6, 'Kém'

    xep_loai = models.IntegerField(choices=XepLoai.choices, editable=False)

    def save(self, *args, **kwargs):
        if 90 <= self.diem_tong <= 100:
            self.xep_loai = self.XepLoai.XUATSAC
        elif 80 <= self.diem_tong < 90:
            self.xep_loai = self.XepLoai.GIOI
        elif 65 <= self.diem_tong < 80:
            self.xep_loai = self.XepLoai.KHA
        elif 50 <= self.diem_tong < 65:
            self.xep_loai = self.XepLoai.TB
        elif 35 <= self.diem_tong < 50:
            self.xep_loai = self.XepLoai.YEU
        else:
            self.xep_loai = self.XepLoai.KEM

        super().save(*args, **kwargs)