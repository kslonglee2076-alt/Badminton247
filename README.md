# SanCauLong.vn / Badminton247 - Giai đoạn 1.1

Phiên bản này tách website thành các phần dễ quản lý hơn:

- `index.html`: trang chủ.
- `css/style.css`: toàn bộ giao diện.
- `js/app.js`: tìm kiếm, lọc và render danh sách.
- `data/courts.json`: dữ liệu sân.
- `pages/court.html`: trang chi tiết sân.
- `js/court-detail.js`: logic trang chi tiết.

## Chạy trên GitHub Pages

Repository cần có cấu trúc ở thư mục gốc như trên.

Vào:

`Settings → Pages → Deploy from a branch → main → / (root) → Save`

## Lưu ý

1. Dữ liệu hiện tại kế thừa 6 sân từ phiên bản trước và chưa được xác minh thực tế.
2. Không sửa dữ liệu trong `app.js`; hãy sửa `data/courts.json`.
3. Khi thêm sân, copy một object trong `courts.json`, đổi `id` thành duy nhất.
4. Trang chi tiết dùng URL dạng:
   `pages/court.html?id=1`
5. Nút "Đóng góp sân" và hệ thống "Báo giá sai" sẽ được triển khai ở giai đoạn 1.2 khi có nơi lưu dữ liệu.


## Bản đóng gói hoàn chỉnh

- Đã bổ sung `assets/` với logo và favicon SVG local.
- Đã bổ sung `js/data.js` làm dữ liệu dự phòng để website vẫn chạy khi mở `index.html` trực tiếp bằng `file://`.
- Vẫn giữ `data/courts.json` làm nguồn dữ liệu chính khi chạy qua web server.


## Branding

- Tên hiển thị trên website: **SanCauLong.vn**
- Logo sử dụng hình ảnh thương hiệu do chủ dự án cung cấp.
- `assets/logo-sancaulong.png`: logo đầy đủ.
- `assets/logo-mark.png`: biểu tượng dùng ở thanh đầu trang.
- `assets/favicon.png`: favicon của website.

> Tên repo GitHub vẫn có thể giữ là `Badminton247`. Đổi tên thương hiệu trên website không bắt buộc phải đổi tên repo.
