from django.contrib import admin
from django.utils.safestring import mark_safe
from trainingpoint.models import *
from ckeditor_uploader.widgets import CKEditorUploadingWidget




class TaiKhoanAdmin(admin.ModelAdmin):
    readonly_fields = ['my_avatar']



    def my_avatar(self, taikhoan):
        if taikhoan.avatar:
            return mark_safe(f"<img width='200' src='{taikhoan.avatar.url}' />")


admin.site.register(TaiKhoan)
admin.site.register(Khoa)
admin.site.register(Lop)
admin.site.register(TroLySinhVien_Khoa)
admin.site.register(SinhVien)
admin.site.register(HocKy_NamHoc)
admin.site.register(Dieu)
admin.site.register(HoatDongNgoaiKhoa)
admin.site.register(ThamGia)
admin.site.register(MinhChung)
admin.site.register(BaiViet)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(DiemRenLuyen)
