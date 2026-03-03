<p align="center">
  <a href="#" target="blank"><img src="./assets/logo.png" width="200" alt="SIC Logo" /></a>
</p>

<h1 align="center">SIC Backend — Student Information Club</h1>

<p align="center">
  RESTful API backend cho hệ thống quản lý câu lạc bộ sinh viên (SIC - TLU), được xây dựng bằng NestJS.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-5.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-7.2-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

---

## 📖 Giới thiệu

**SIC (Student Information Club)** là hệ thống backend phục vụ quản lý câu lạc bộ sinh viên tại Trường Đại học Thủy Lợi (TLU). Dự án cung cấp các API để quản lý thành viên, bài viết, lịch trình hoạt động, phòng ban, và nhiều tính năng khác, giúp ban chủ nhiệm và thành viên CLB dễ dàng tổ chức và vận hành.

### ✨ Tính năng chính

- 🔐 **Xác thực & Phân quyền** — Đăng nhập bằng JWT, refresh token, hỗ trợ nhiều vai trò (User, Club Member, Club Committee, Admin, Super Admin)
- 👥 **Quản lý người dùng & thành viên** — CRUD đầy đủ, phân vai trò theo cấp bậc trong CLB
- 🏛️ **Quản lý phòng ban** — Tổ chức thành viên theo từng ban/bộ phận của CLB
- 📝 **Quản lý bài viết** — Đăng bài, duyệt bài, phân loại bài viết
- 📅 **Quản lý lịch trình** — Tạo và theo dõi các hoạt động, sự kiện CLB
- 🔔 **Thông báo (Push Notification)** — Gửi thông báo qua Firebase Cloud Messaging
- 📧 **Gửi Email** — Hỗ trợ gửi mail tự động qua Nodemailer
- 🖼️ **Upload ảnh** — Tích hợp Cloudinary để lưu trữ và quản lý media
- ⚡ **Cache với Redis** — Tối ưu hiệu năng truy vấn
- 📚 **Tài liệu API tự động** — Swagger UI tích hợp sẵn

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| **NestJS 10** | Framework chính (Node.js) |
| **TypeScript 5** | Ngôn ngữ lập trình |
| **MongoDB 5** + Mongoose | Cơ sở dữ liệu NoSQL |
| **Redis 7** + ioredis | Caching & session |
| **Passport.js** + JWT | Xác thực & bảo mật |
| **Swagger / OpenAPI** | Tài liệu API tự động |
| **Cloudinary** | Lưu trữ và quản lý ảnh |
| **Firebase Admin SDK** | Push notification |
| **Nodemailer** | Gửi email |
| **Docker Compose** | Môi trường phát triển |
| **PM2** | Triển khai production |

---

## 🚀 Bắt đầu

### Yêu cầu hệ thống

Đảm bảo bạn đã cài đặt các công cụ sau:

- [Node.js](https://nodejs.org/) >= 18.x
- [Yarn](https://yarnpkg.com/) >= 1.x
- [Docker](https://www.docker.com/) & Docker Compose (để chạy MongoDB & Redis local)

### 1. Clone dự án

```bash
git clone https://github.com/SIC-TLU/sic-backend.git
cd sic-backend
```

### 2. Cài đặt dependencies

```bash
yarn install
```

### 3. Cấu hình biến môi trường

Sao chép file `.env.example` thành `.env` và điền vào các giá trị tương ứng:

```bash
cp .env.example .env
```

Xem chi tiết các biến môi trường ở mục [⚙️ Biến môi trường](#️-biến-môi-trường) bên dưới.

### 4. Khởi động cơ sở dữ liệu (Docker)

Chạy MongoDB và Redis bằng Docker Compose:

```bash
docker compose -p sic up -d
```

> Lệnh này sẽ khởi động:
> - **MongoDB** tại `localhost:27017`
> - **Redis** tại `localhost:6379`

### 5. Seed tài khoản Admin

Tạo tài khoản admin mặc định từ các biến trong `.env`:

```bash
yarn seed:admin
```

### 6. Chạy ứng dụng

```bash
# Chế độ development (có hot-reload)
yarn start:dev

# Chế độ bình thường
yarn start

# Chế độ debug
yarn start:debug
```

Ứng dụng sẽ khởi động tại: `http://localhost:{PORT}`

---

## ⚙️ Biến môi trường

Tạo file `.env` tại thư mục gốc và cấu hình theo bảng dưới đây:

```env
# ========================
# Server
# ========================
PORT=8080
HOST=http://localhost

# ========================
# Frontend
# ========================
FRONTEND_URL=http://localhost:3000

# ========================
# Tài khoản Admin mặc định
# ========================
ADMIN_EMAIL=admin@sic.com
ADMIN_USERNAME=admin
ADMIN_PHONE=0123456789
ADMIN_PASSWORD=Admin@123

# ========================
# Roles (giá trị định danh vai trò)
# ========================
ROLE_USER=USER
ROLE_CLUBMEMBER=CLUB_MEMBER
ROLE_CLUBCOMMITTEHEADS=CLUB_COMMITTEE_HEADS
ROLE_ADMIN=ADMIN
ROLE_SUPERADMIN=SUPER_ADMIN

# ========================
# Database (MongoDB)
# ========================
MONGODB_URI=mongodb://root:123456@localhost:27017/sic?authSource=admin

# ========================
# JWT
# ========================
JWT_SECRET=your_super_secret_key
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# ========================
# Email (Gmail hoặc SMTP)
# ========================
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# ========================
# Redis
# ========================
REDIS_HOST=localhost
REDIS_PORT=6379

# ========================
# Cloudinary (Upload ảnh)
# ========================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📚 Tài liệu API (Swagger)

Sau khi khởi động ứng dụng, truy cập vào Swagger UI để xem và test API:

```
http://localhost:{PORT}/api-docs
```

Tất cả các endpoint đều có prefix `/api/v1`.

---

## 📁 Cấu trúc dự án

```
sic-backend/
├── src/
│   ├── auth/                # Xác thực (login, register, refresh token,...)
│   ├── modules/
│   │   ├── admins/          # Quản lý admin
│   │   ├── users/           # Quản lý người dùng
│   │   ├── departments/     # Quản lý phòng ban
│   │   ├── post/            # Quản lý bài viết
│   │   ├── schedule/        # Quản lý lịch trình / sự kiện
│   │   ├── token/           # Quản lý refresh token
│   │   └── redis/           # Module Redis cache
│   ├── notifications/       # Push notifications (Firebase)
│   ├── mail/                # Gửi email
│   ├── common/              # Guards, pipes, interceptors dùng chung
│   ├── decorator/           # Custom decorators
│   ├── helpers/             # Các hàm tiện ích
│   ├── utils/               # Utilities
│   ├── constant/            # Hằng số toàn cục
│   ├── core/                # Cấu hình core
│   ├── seed-admin.ts        # Script tạo admin mặc định
│   ├── app.module.ts        # Module gốc
│   └── main.ts              # Entry point
├── assets/                  # Tài nguyên tĩnh (logo,...)
├── .env.example             # Mẫu biến môi trường
├── docker-compose.yml       # Cấu hình Docker (MongoDB + Redis)
├── ecosystem.config.js      # Cấu hình PM2 (production)
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## 🧪 Kiểm thử

```bash
# Unit tests
yarn test

# Watch mode
yarn test:watch

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

---

## 🚢 Triển khai Production

### Build ứng dụng

```bash
yarn build
```

### Chạy với PM2

Dự án đã được cấu hình sẵn với [PM2](https://pm2.keymetrics.io/):

```bash
# Cài PM2 (nếu chưa có)
npm install -g pm2

# Khởi động ứng dụng
pm2 start ecosystem.config.js --env production

# Xem logs
pm2 logs sic-backend

# Dừng ứng dụng
pm2 stop sic-backend
```

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request nếu bạn muốn cải thiện dự án.

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/ten-tinh-nang`)
3. Commit thay đổi (`git commit -m 'feat: thêm tính năng X'`)
4. Push lên branch (`git push origin feature/ten-tinh-nang`)
5. Mở Pull Request

---

## 📬 Liên hệ

- **Tác giả:** Lò Văn Bằng
- **Email:** lovanbangbox9@gmail.com
- **LinkedIn:** [lo-van-bang-389698289](https://www.linkedin.com/in/lo-van-bang-389698289/)

---

## 📄 License

Dự án này được phân phối dưới giấy phép [MIT](LICENSE).
