# ÁN TRONG SƯƠNG

Ứng dụng web React + Vite cho trải nghiệm chọn thẻ nhân vật của board game lịch sử trinh thám Việt Nam.

## Yêu cầu
- Node.js 18 trở lên
- npm

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở URL local do Vite hiển thị trong Terminal (thường là `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview
```

## Đưa lên GitHub

Thư mục `node_modules` và `dist` đã được loại khỏi Git bằng `.gitignore`. Hãy upload/push toàn bộ thư mục project này, không upload `node_modules`.

```bash
git init
git add .
git commit -m "Initial commit - An Trong Suong"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Thay URL ví dụ bằng URL repository GitHub của bạn.

## Cấu trúc

```text
an-trong-suong/
├── .gitattributes
├── .gitignore
├── index.html
├── package.json
├── package-lock.json (được tạo sau npm install)
├── public/
│   └── assets/
│       ├── brand/
│       ├── cards/
│       └── characters/
└── src/
    ├── main.jsx
    └── styles.css
```

## Tài nguyên hình ảnh

- `public/assets/brand/`: logo và họa tiết thương hiệu.
- `public/assets/cards/`: mặt sau thẻ.
- `public/assets/characters/`: sáu minh họa nhân vật.

Có thể thay PNG nhân vật bằng cách giữ nguyên tên file trong `public/assets/characters/`.
