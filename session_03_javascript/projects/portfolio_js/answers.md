# JavaScript

## Exercise 0 — Hello JavaScript! (Làm quen với JavaScript)

### Bài 0.1 — Chào thế giới

#### So sánh `console.log()` và `document.write()` trong JavaScript

Hai hàm này phục vụ hai mục đích hoàn toàn khác nhau trong JavaScript: `console.log()` dùng để **kiểm tra, sửa lỗi** (debugging), còn `document.write()` dùng để **ghi trực tiếp nội dung lên trang web**.

#### Bảng so sánh nhanh

| Đặc điểm | `console.log()` | `document.write()` |
| :--- | :--- | :--- |
| **Vị trí hiển thị** | Trong tab **Console** của Công cụ nhà phát triển (F12). | Hiển thị trực tiếp trên **giao diện trang web** (DOM). |
| **Đối tượng nhìn thấy** | Lập trình viên (người dùng bình thường không thấy). | Tất cả mọi người truy cập trang web. |
| **Ảnh hưởng đến DOM** | Không làm thay đổi hay ảnh hưởng đến cấu trúc HTML. | Ghi trực tiếp vào luồng HTML, có thể can thiệp DOM. |
| **Mức độ sử dụng** | **Rất phổ biến** và là công cụ debug không thể thiếu. | **Bị hạn chế / Lỗi thời**, hầu như không dùng trong thực tế. |

#### Bài 0.2 — Khai báo biến

| Câu hỏi | `let` | `const` | `var` |
|---------|-------|---------|-------|
| Có thể thay đổi giá trị? | ✅ Có | ❌ Không | ✅ Có |
| Có thể khai báo lại? | ❌ Không | ❌ Không | ✅ Có |
| Nên dùng trong code mới? | ✅ | ✅ | ❌ Tránh |

## Exercise 0C — Events Basics (Làm quen với Events)

### Bài 0C.2 — Input Event 

1. Sự khác biệt giữa event `input` và `change`:

- `input`: Kích hoạt ngay lập tức và liên tục mỗi khi giá trị thay đổi. Gõ 1 ký tự, xoá 1 ký tự, hoặc nhích thanh trượt đi 1mm thì hàm chạy ngay lập tức. Phù hợp cho tìm kiếm realtime, đếm ký tự.

- `change`: Chỉ kích hoạt khi kết thúc quá trình chỉnh sửa và rời con trỏ chuột ra ngoài(ô input bị blur), hoặc khi thả chuột ra khỏi thanh kéo slider. Phù hợp khi cần validation form sau khi người dùng nhập xong hẳn.

2. Dùng `e.target.value` thay vì `searchInput.value` để:

- `e.target.value` giúp code của linh hoạt và có tính tái sử dụng cao hơn. `e.target.value` là phần tử bị tác động.

- Nếu sau này đổi tên biến `searchInput` thành tên khác, hoặc muốn gom nhiều ô input dùng chung một hàm xử lý, sẽ không cần phải sửa lại đoạn code lấy giá trị bên trong hàm nữa.

### Bài 0C.5 — Event Delegation

- Dùng cách này tối ưu hơn vì:
    - Cách cũ-Gắn cho từng con: 
        - Phải dùng `querySelector('Li')` rồi lặp qua từng phần tử để gắn sự kiện.
        - Nếu danh sách có 1000 phần tử, trình duyệt phải quản lý 1000 hàm lắng nghe sự kiện.
        - nếu bạn dùng JavaScript để bấm "Thêm dòng mới", dòng mới đó sẽ không có sự kiện click và bạn phải mất công viết code gán lại.
    - Cách mới(Uỷ quyền-Delegation):
        - Bạn chỉ tạo đúng 1 sự kiện ở thẻ `<ul>`. Khi bạn click vào bất kỳ thẻ `<li>` nào, nhờ cơ chế nổi bọt (Event Bubbling), sự kiện sẽ tự động bay lên thẻ `<ul>` và kích hoạt hàm xử lý.
        - Sau này bạn có thêm bao nhiêu `<li>` mới vào đi chăng nữa, chúng vẫn hoạt động bình thường mà không cần viết thêm một dòng code nào.

    

