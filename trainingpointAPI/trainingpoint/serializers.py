from rest_framework import serializers
from trainingpoint.models import *
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser

from .models import TaiKhoan, SinhVien, Lop
from django.core.files.base import ContentFile
from cloudinary.uploader import upload

import requests


class KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoa
        fields = '__all__'


class LopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lop
        fields = '__all__'



class TaiKhoanSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaiKhoan
        fields = ['id', 'email', 'username', 'password', 'avatar', 'role', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['avatar'] = instance.avatar.url
        return req

    def create(self, validated_data):
        data=validated_data.copy();
        taiKhoan = TaiKhoan(**data)
        taiKhoan.set_password(taiKhoan.password)
        taiKhoan.save()
        return taiKhoan


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep



class HockyNamhocSerializer(serializers.ModelSerializer):
    class Meta:
        model = HocKy_NamHoc
        fields = '__all__'


class DieuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dieu
        fields = '__all__'


class HoatDongNgoaiKhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoatDongNgoaiKhoa
        fields = '__all__'


class BaoCaoSerializer(serializers.ModelSerializer):
    sinh_vien = serializers.CharField(source='sinh_vien.ho_ten')
    mssv= serializers.CharField(source='sinh_vien.mssv')
    lop = serializers.CharField(source='sinh_vien.lop.ten_lop')
    khoa = serializers.CharField(source='sinh_vien.lop.khoa.ten_khoa')
    xep_loai = serializers.SerializerMethodField()

    class Meta:
        model = DiemRenLuyen
        fields = ['sinh_vien','mssv', 'lop', 'khoa', 'diem_tong', 'xep_loai']

    def get_xep_loai(self, obj):
        return obj.get_xep_loai_display()

class ThamGiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThamGia
        fields = '__all__'


class MinhChungSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['anh_minh_chung'] = instance.anh_minh_chung.url
        return req

    class Meta:
        model = MinhChung
        fields = '__all__'


class BaiVietSerializer(serializers.ModelSerializer):

    class Meta:
        model = BaiViet
        fields = ['id', 'title', 'image', 'tro_ly', 'hd_ngoaikhoa', 'content']

    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['image'] = instance.image.url
        return req


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class DiemRenLuyenSerializer(serializers.ModelSerializer):

    class Meta:
        model = DiemRenLuyen
        fields = '__all__'



class SinhVienSerializer(serializers.ModelSerializer):

    class Meta:
        model = SinhVien
        fields = ['id','mssv', 'email', 'ho_ten', 'ngay_sinh', 'lop', 'dia_chi', 'gioi_tinh']

class AuthenticatedBaiVietTagSerializer(BaiVietSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, bai_viet):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return bai_viet.like_set.filter(tai_khoan=request.user, active=True).exists()

    class Meta:
        model = BaiVietSerializer.Meta.model
        fields = BaiVietSerializer.Meta.fields + ['liked']


class UploadFileDiemDanhSerializer(serializers.Serializer):
    file = serializers.FileField()


class TroLySinhVien_KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TroLySinhVien_Khoa
        fields = '__all__'