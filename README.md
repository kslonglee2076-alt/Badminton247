# SanCauLong.vn / Badminton247 - Phase 3

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
5. Nút "Đóng góp sân" đã có biểu mẫu và tạo GitHub Issue để cộng đồng gửi dữ liệu chờ xác minh.


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


## Phase 2 — Tìm sân nhanh

- Lọc sân theo quận/huyện.
- Tìm theo tên sân, địa chỉ và quận/huyện, không phân biệt dấu tiếng Việt.
- Hiển thị số lượng kết quả theo thời gian thực.
- Nút gọi sân từ danh sách và trang chi tiết.
- Nút Chỉ đường mở Google Maps theo địa chỉ sân.
- Phím Escape xóa nhanh từ khóa tìm kiếm.


## Phase 3 — Đóng góp sân

- Nút **Đóng góp sân** mở biểu mẫu ngay trên trang.
- Có các trường: tên sân, địa chỉ, quận/huyện, số điện thoại, quy mô, giờ hoạt động, giá, Google Maps và ghi chú.
- Khi gửi, website tạo một **GitHub Issue** trong repository để lưu đề xuất và chờ xác minh.
- Dữ liệu chưa được tự động đưa vào danh sách sân; người quản trị cần kiểm tra trước khi cập nhật `data/courts.json`.
- Không cần máy chủ riêng cho bước này; GitHub Issues đóng vai trò nơi tiếp nhận đề xuất.

- Biểu mẫu có thêm trường **Ý kiến góp ý** để người gửi nêu đề xuất hoặc lưu ý riêng.


## Phase 4 — Chất lượng dữ liệu sân

- Chuẩn hóa metadata: `source`, `verificationStatus`, `lastUpdated`, `mapUrl`, `facilities`, `notes`.
- Trang danh sách hiển thị trạng thái và ngày cập nhật.
- Trang chi tiết hiển thị nguồn dữ liệu, trạng thái xác minh, liên hệ, tiện ích và ghi chú.
- Link Google Maps ưu tiên `mapUrl` nếu dữ liệu có sẵn; nếu không sẽ dùng tìm kiếm theo địa chỉ.
- Không tự suy đoán tiện ích hoặc thông tin chưa được cung cấp.
