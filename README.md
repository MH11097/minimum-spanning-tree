# 🔬 Phòng Thí Nghiệm Thuật Toán MST

> **Nền Tảng Phân Tích Cây Khung Tối Thiểu**  
> Ứng dụng web hiện đại để học và trực quan hóa thuật toán Minimum Spanning Tree

![MST Algorithm Lab](https://img.shields.io/badge/Thuật%20Toán-MST-blue?style=for-the-badge) ![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)

---

## 🎮 Hướng Dẫn Sử Dụng Nhanh

### 🚀 Bắt Đầu Trong 3 Bước

#### **Bước 1: Mở Ứng Dụng**
Truy cập ứng dụng qua trình duyệt web. Giao diện sẽ hiển thị bản đồ Hà Nội với các điểm nhà hàng.

> 📷 **[CHÈN ẢNH: Giao diện chính khi mở ứng dụng]**  
> 📝 **Ghi chú:** *Bạn có thể thêm ảnh chụp màn hình giao diện chính ở đây*

#### **Bước 2: Chọn Thuật Toán**
Trong panel bên trái, chọn một trong hai thuật toán:
- 🔵 **Kruskal** - Phù hợp với đồ thị thưa
- 🟢 **Prim** - Phù hợp với đồ thị dày đặc

> 📷 **[CHÈN ẢNH: Panel chọn thuật toán]**  
> 📝 **Ghi chú:** *Chụp màn hình phần Algorithm Selection để minh họa*

#### **Bước 3: Chạy Phân Tích** 
Nhấn nút **"Execute MST Analysis"** để bắt đầu. Kết quả sẽ hiển thị:
- 📊 Thống kê realtime (header)
- 🗺️ Cây MST trên bản đồ
- 📋 Chi tiết kết quả (panel phải)

> 📷 **[CHÈN ẢNH: Kết quả MST sau khi chạy thuật toán]**  
> 📝 **Ghi chú:** *Ảnh showing MST được highlight trên bản đồ với kết quả*

---

### ⚡ **Tính Năng Nâng Cao**

#### 🎬 **Animation Từng Bước**
Sau khi chạy thuật toán, sử dụng các nút điều khiển để xem từng bước:

| Nút | Chức năng | Phím tắt |
|-----|-----------|----------|
| ▶️ | Phát/Tạm dừng | `Space` |
| ⏮️ | Bước trước | `←` |
| ⏭️ | Bước tiếp | `→` |
| ⚡ | Tốc độ (0.5x-2x) | - |

> 📷 **[CHÈN ẢNH: Animation controls và step-by-step visualization]**  
> 📝 **Ghi chú:** *Chụp màn hình panel animation controls và current step display*

#### 🖱️ **Tương Tác Với Bản Đồ**
- **Kéo thả nút**: Di chuyển các điểm để thay đổi đồ thị
- **Tự động tính lại**: Khoảng cách cập nhật theo tọa độ mới
- **Zoom & Pan**: Phóng to/thu nhỏ và di chuyển bản đồ

> 📷 **[CHÈN ẢNH: Ví dụ kéo thả một nút trên bản đồ]**  
> 📝 **Ghi chú:** *Screenshot showing before/after khi drag một node*

#### 📊 **Đọc Kết Quả**
Panel kết quả hiển thị:
- 💰 **Total Cost**: Tổng trọng số MST
- 🔗 **Edge List**: Danh sách các cạnh được chọn  
- 📈 **Step Count**: Số bước thực hiện
- 📝 **Execution Log**: Chi tiết từng bước với giải thích

> 📷 **[CHÈN ẢNH: Results panel với đầy đủ thông tin]**  
> 📝 **Ghi chú:** *Chụp results panel showing complete analysis*

---

### 💡 **Mẹo Sử Dụng Hiệu Quả**

#### ✨ **Thực Hành Tốt**
- 🎯 **So sánh thuật toán**: Chạy cả Kruskal và Prim trên cùng dữ liệu
- 🔄 **Thử nghiệm**: Di chuyển các nút để tạo đồ thị khác nhau
- 📚 **Học tập**: Xem animation chậm (0.5x) để hiểu rõ từng bước
- 📱 **Mobile**: App responsive, có thể dùng trên tablet/phone

> 📝 **Ghi chú người dùng:**  
> *Bạn có thể thêm những kinh nghiệm sử dụng của mình ở đây*

#### 🚨 **Xử Lý Sự Cố Nhanh**
- **Bản đồ không tải**: Kiểm tra internet, refresh trang
- **Animation lag**: Giảm tốc độ, đóng tab khác
- **Nút không kéo được**: Đảm bảo page đã load xong

> 📷 **[CHÈN ẢNH: Ví dụ error message hoặc loading state]**  
> 📝 **Ghi chú:** *Screenshot của các trạng thái lỗi phổ biến*

---

### 🎓 **Dành Cho Giáo Viên & Sinh Viên**

#### 👨‍🏫 **Sử Dụng Trong Lớp Học**
- **Demo trực tiếp**: Chiếu màn hình để giảng thuật toán MST
- **Bài tập tương tác**: Học sinh thực hành trên máy cá nhân
- **So sánh thuật toán**: Phân tích ưu/nhược điểm Kruskal vs Prim
- **Ứng dụng thực tế**: Kết nối với bài toán quy hoạch mạng

> 📝 **Ghi chú giáo viên:**  
> *Có thể thêm kế hoạch bài giảng hoặc worksheet ở đây*

> 📷 **[CHÈN ẢNH: Lớp học sử dụng ứng dụng]**  
> 📝 **Ghi chú:** *Hình ảnh lớp học IT sử dụng app để học thuật toán*

#### 🎯 **Mục Tiêu Học Tập**
✅ Hiểu nguyên lý hoạt động của MST  
✅ Phân biệt được Kruskal và Prim  
✅ Tính toán độ phức tạp thuật toán  
✅ Ứng dụng vào bài toán thực tế  

> 📝 **Bài tập mẫu:**  
> *1. Chạy Kruskal trên đồ thị mẫu và ghi lại các bước*  
> *2. So sánh kết quả với Prim algorithm*  
> *3. Di chuyển 2-3 nút và quan sát sự thay đổi MST*

---

## 🛠️ **Thông Tin Kỹ Thuật**

### **Công Nghệ Sử Dụng**
- **Frontend**: JavaScript ES6+, HTML5, CSS3, Leaflet.js
- **Backend**: Python 3.8+, Flask
- **Algorithms**: Kruskal (Union-Find), Prim (Priority Queue)
- **Map**: OpenStreetMap với tọa độ thực Hà Nội

### **Tương Thích**
- ✅ Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+
- ✅ Desktop, Tablet, Mobile responsive
- ✅ Keyboard navigation support

---

## 📞 **Hỗ Trợ & Liên Hệ**

- 🐛 **Báo lỗi**: Tạo issue trên GitHub repo
- 💡 **Đề xuất tính năng**: Pull request hoặc feature request  
- 🎓 **Hỗ trợ giáo dục**: Email để được tư vấn sử dụng trong lớp học
- 📖 **Tài liệu**: Wiki và documentation chi tiết

---

**🔬 Phòng Thí Nghiệm Thuật Toán MST** - *Học thuật toán một cách trực quan và thú vị*

> Được phát triển với ❤️ cho cộng đồng giáo dục Việt Nam

*Cập nhật: Tháng 12, 2024*