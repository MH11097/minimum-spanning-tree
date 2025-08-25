# Demo MST - Mạng lưới Nhà hàng Phố Cổ

## Mô tả Tổng quan

Ứng dụng web Flask demo minh họa thuật toán Minimum Spanning Tree (MST) cho bài toán tối ưu hóa mạng lưới nhà hàng. Ứng dụng phục vụ mục đích giáo dục, giúp sinh viên hiểu rõ thuật toán Kruskal và Prim thông qua visualization trực quan.

## Cài đặt và Chạy ứng dụng

### Yêu cầu hệ thống
- Python 3.8+
- pip (Python package manager)
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)

### Hướng dẫn cài đặt

1. **Clone hoặc tải project về máy**
```bash
# Nếu có git
git clone <repository-url>
cd minimum-spanning-tree

# Hoặc tải ZIP và giải nén
```

2. **Tạo virtual environment (khuyến nghị)**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Cài đặt dependencies**
```bash
pip install -r requirements.txt
```

4. **Chạy ứng dụng**
```bash
python app.py
```

5. **Truy cập ứng dụng**
Mở trình duyệt và truy cập: `http://localhost:5000`

## Cấu trúc Project

```
minimum-spanning-tree/
├── app.py              # Main Flask application
├── algorithms/
│   ├── __init__.py
│   ├── mst.py         # MST algorithms (Kruskal & Prim)
│   └── union_find.py  # Union-Find data structure
├── data/
│   └── restaurants.py # Restaurant data and cost matrix
├── static/
│   ├── css/
│   │   └── style.css  # Custom styles
│   └── js/
│       ├── main.js    # Main frontend logic
│       ├── graph.js   # D3.js graph visualization
│       └── animation.js # Step-by-step animation
├── templates/
│   ├── base.html      # Base template
│   └── index.html     # Main page
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## Hướng dẫn Sử dụng Giao diện

### Giao diện chính
Ứng dụng bao gồm 3 tab chính:

#### **1. Tab "Bài toán" - Thiết lập dữ liệu**
- **Biểu đồ mạng lưới**: Hiển thị 6 cửa hàng (A-F) dưới dạng nodes và các kết nối (edges)
  - Click vào các node để xem thông tin chi tiết
  - Hover để xem tên cửa hàng đầy đủ
- **Ma trận chi phí**: Bảng 6x6 cho phép chỉnh sửa chi phí vận chuyển
  - Click vào ô để chỉnh sửa giá trị
  - Nhấn Enter để confirm thay đổi
  - Biểu đồ sẽ tự động cập nhật khi thay đổi chi phí
- **Buttons điều khiển**:
  - `Reset Data`: Khôi phục về dữ liệu mặc định
  - `Validate`: Kiểm tra tính hợp lệ của dữ liệu

*[Chèn ảnh: Screenshot tab Bài toán với ma trận chi phí và biểu đồ mạng lưới]*

#### **2. Tab "Thuật toán" - Chạy và Xem Animation**
- **Chọn thuật toán**:
  - Radio buttons: Kruskal hoặc Prim
  - Hiển thị độ phức tạp thời gian của mỗi thuật toán
- **Controls Animation**:
  - `▶️ Play`: Chạy animation tự động
  - `⏸️ Pause`: Tạm dừng animation
  - `⏮️ Previous`: Quay lại bước trước
  - `⏭️ Next`: Chuyển bước tiếp theo
  - `Speed slider`: Điều chỉnh tốc độ animation (0.5x - 3x)
- **Visualization Panel**:
  - Biểu đồ hiển thị quá trình chọn edges
  - Edges được thêm vào MST sẽ đổi màu (xanh lá)
  - Edges bị loại bỏ sẽ đổi màu (đỏ)
  - Current step được highlight
- **Pseudocode Panel**:
  - Code thuật toán với dòng hiện tại được highlight
  - Giải thích bước hiện tại bằng tiếng Việt
- **Step Information**:
  - Thông tin chi tiết về edge đang xét
  - Trạng thái Union-Find (cho Kruskal)
  - Priority queue (cho Prim)
  - Chi phí tích lũy

*[Chèn ảnh: Screenshot tab Thuật toán đang chạy animation Kruskal]*
*[Chèn ảnh: Pseudocode panel với highlighting]*

#### **3. Tab "Kết quả" - Phân tích MST**
- **MST Visualization**: Biểu đồ chỉ hiển thị các edge trong MST
  - Layout tối ưu để dễ nhìn
  - Thickness của edge tỷ lệ với chi phí
- **Thông tin tổng hợp**:
  - Tổng chi phí MST
  - Danh sách edges trong MST (từ, đến, chi phí)
  - Số edges được xét và loại bỏ
- **So sánh thuật toán**:
  - Bảng so sánh Kruskal vs Prim
  - Thời gian thực thi
  - Số bước thực hiện
- **Export options**:
  - `Export PNG`: Tải về hình ảnh MST
  - `Export JSON`: Tải về dữ liệu MST
  - `Export Steps`: Tải về chi tiết từng bước

*[Chèn ảnh: Screenshot tab Kết quả với MST final và bảng so sánh]*

### Keyboard Shortcuts
- `Space`: Play/Pause animation
- `←`: Previous step
- `→`: Next step
- `R`: Reset to beginning
- `1,2,3`: Chuyển giữa các tabs
- `+/-`: Tăng/giảm tốc độ animation

### Mobile/Responsive
- Giao diện tự động điều chỉnh cho màn hình nhỏ
- Touch gestures hỗ trợ trên tablet/mobile
- Tabs chuyển thành dropdown menu trên mobile

*[Chèn ảnh: Screenshot giao diện mobile]*

### Tips Sử dụng
1. **Bắt đầu**: Luôn xem tab "Bài toán" trước để hiểu dữ liệu
2. **Thử nghiệm**: Thay đổi một số chi phí để thấy MST khác nhau
3. **Học thuật toán**: Chạy từng bước một để hiểu logic
4. **So sánh**: Chạy cả Kruskal và Prim với cùng dữ liệu
5. **Export**: Lưu kết quả để presentation hoặc báo cáo

## Tính năng chính

### 1. Visualization trực quan
- **Tab Bài toán**: Hiển thị mạng lưới 6 cửa hàng với ma trận chi phí có thể chỉnh sửa
- **Tab Thuật toán**: Chạy step-by-step animation cho Kruskal hoặc Prim với pseudocode
- **Tab Kết quả**: Hiển thị MST cuối cùng với phân tích chi phí

### 2. Thuật toán được hỗ trợ
- **Kruskal**: Sử dụng Union-Find với path compression
- **Prim**: Sử dụng priority queue (min-heap)
- So sánh kết quả giữa hai thuật toán

### 3. Tương tác người dùng
- Chỉnh sửa chi phí vận chuyển real-time
- Controls animation: play/pause, step forward/backward, speed control
- Export kết quả và visualization

## API Endpoints

- `GET /` - Trang chủ
- `POST /api/solve` - Chạy thuật toán MST (Kruskal/Prim)
- `GET /api/step/<step_id>` - Lấy thông tin bước cụ thể
- `POST /api/update_costs` - Cập nhật ma trận chi phí
- `GET /api/reset` - Reset về dữ liệu mặc định
- `GET /api/data` - Lấy dữ liệu nhà hàng và chi phí
- `GET /api/compare` - So sánh kết quả Kruskal vs Prim

## Dữ liệu Demo

### Mạng lưới nhà hàng
- **A (Phở Cổ - Chính)**: Cửa hàng trung tâm phân phối
- **B (Times City)**: Chi nhánh trong TTTM
- **C (Lotte Center)**: Chi nhánh cao cấp  
- **D (Aeon Long Biên)**: Chi nhánh ngoại thành
- **E (Royal City)**: Chi nhánh khu đô thị mới
- **F (BigC Thăng Long)**: Chi nhánh trong siêu thị

### Ma trận chi phí mặc định (triệu VND/tháng)
```
    A    B    C    D    E    F
A   -   3.2  2.8  4.5  3.6  4.1
B  3.2   -   2.1  1.9  1.5  3.8
C  2.8  2.1   -   3.4  2.6  1.8
D  4.5  1.9  3.4   -   2.9  2.3
E  3.6  1.5  2.6  2.9   -   2.7
F  4.1  3.8  1.8  2.3  2.7   -
```

## Tech Stack

### Backend
- **Flask 2.3.3**: Web framework
- **Python 3.8+**: Programming language
- **Jinja2**: Template engine

### Frontend  
- **Bootstrap 5**: CSS framework
- **D3.js v7**: Data visualization
- **JavaScript ES6+**: Interactive features
- **HTML5 & CSS3**: Markup and styling

## Troubleshooting

### Lỗi thường gặp

1. **ModuleNotFoundError**: Đảm bảo đã cài đặt requirements.txt
```bash
pip install -r requirements.txt
```

2. **Port 5000 đã được sử dụng**: Thay đổi port trong app.py
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

3. **Lỗi hiển thị graph**: Kiểm tra kết nối internet (cần tải D3.js, Bootstrap từ CDN)

### Performance
- Response time < 100ms cho API calls
- Hỗ trợ animation 60fps
- Tương thích với 10+ concurrent users

## Mở rộng

### Tính năng có thể thêm
- Import/export custom graph data (CSV, JSON)
- Dark mode toggle
- Multiple language support (English/Vietnamese)
- Real-time collaboration với WebSocket
- Integration với Google Maps cho vị trí thực tế
- Export animation thành GIF
- Unit tests cho algorithms
- Database persistence cho custom data

### Educational enhancements
- Interactive quiz về MST concepts
- Tooltips giải thích thuật ngữ kỹ thuật
- Step-by-step explanation panels
- Comparison với các thuật toán khác (Borůvka)
- Complexity analysis visualization

## Đóng góp

Để đóng góp vào project:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/yourusername/minimum-spanning-tree](https://github.com/yourusername/minimum-spanning-tree)

---

**Lưu ý**: Ứng dụng này được thiết kế cho mục đích giáo dục. Dữ liệu và chi phí chỉ mang tính chất minh họa.
