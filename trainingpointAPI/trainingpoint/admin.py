from django.contrib import admin
from django.utils.safestring import mark_safe
from trainingpoint.models import *
from ckeditor_uploader.widgets import CKEditorUploadingWidget

class TaiKhoanAdmin(admin.ModelAdmin):
    readonly_fields = ['my_avatar']



    def my_avatar(self, taikhoan):
        if taikhoan.avatar:
            return mark_safe(f"<img width='200' src='{taikhoan.avatar.url}' />")




