import os
from pathlib import Path
import pymysql

pymysql.install_as_MySQLdb()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = '%s/trainingpoint/static/' % BASE_DIR

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3g%$w&of#)smi#wfjx**j+9tq0k9!0fs_lxq-2ofp++kfv&sx2'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['192.168.1.218','localhost']

import cloudinary

cloudinary.config(
    cloud_name="sonpnts",
    api_key="752187729553174",
    api_secret="LPw7aj9WseIgRmVct7bdppxfa5g",
    # api_proxy="http://proxy.server:8081/"
)

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'trainingpoint.apps.TrainingpointConfig',
    'ckeditor',
    'ckeditor_uploader',
    'rest_framework',
    'oauth2_provider',
    'cloudinary',
    'drf_yasg',

]

CKEDITOR_UPLOAD_PATH = "ckeditors/images"

AUTH_USER_MODEL = 'trainingpoint.TaiKhoan'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'trainingpointAPI.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

            ],
        },
    },
]
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    )
}

WSGI_APPLICATION = 'trainingpointAPI.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'trainingpointdb',
        'USER': 'root',
        # 'PASSWORD': 'Nhatcuong123@',  #mk mysql
        'PASSWORD': 'Son1010@',  # mk mysql
        'HOST': ''  # mặc định localhost
    }
}
SITE_ID=1

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'phamngoctruongson2003@gmail.com'  # Thay bằng email của bạn
EMAIL_HOST_PASSWORD = 'twefshdqocjlrxkh'  # Thay bằng mật khẩu của bạn

CLIENT_ID = '95720794006-utnmng1hghrq7df9s5386e1dbstbsb33.apps.googleusercontent.com'
CLIENT_SECRET = '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'

client_id: "nBF09WIbpiMhXA0AC1CyUtmZ4UrapK9C2T73CM8v"
client_secret: "flUMi37JgPmzr3rQMqbpRozri4lVdhzJ33ffXAl47cVoJqnShG8gfPCuTVvPsGFmYstjovkzTG9yY2IFGxWlGD2I0Q0f5yxx5NEYMgfGtdnxDHaEhd60MU43cQlV6kyx"


# FIREBASE_ADMIN_PATH = os.path.join(BASE_DIR, 'trainingpoint/firebase/qldrl-77e59-firebase-adminsdk-6tt21-9c80f40850.json')


import firebase_admin
from firebase_admin import credentials
firebase_credentials_path = os.path.join(BASE_DIR, 'trainingpoint/firebase/qldrl-77e59-firebase-adminsdk-6tt21-9c80f40850.json')


if not firebase_credentials_path:
    raise ValueError('Missing FIREBASE_ADMINSDK_JSON environment variable.')

# Khởi tạo Firebase Admin SDK với tệp JSON khóa dịch vụ
cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred)

