// Chọn nút bấm chuyển đổi theme dựa vào id đã định nghĩa trong HTML
const themeToggleBtn = document.getElementById('theme-toggle');

/**
 * LOGIC 1: Hàm lấy theme hiện tại từ cấu hình cũ hoặc hệ thống
 * - Đầu tiên: Kiểm tra xem người dùng đã từng chọn dữ liệu lưu trong localStorage chưa.
 * - Thứ hai: Nếu chưa có dữ liệu cũ, tự động kiểm tra chế độ Sáng/Tối của hệ điều hành máy tính (System Preference).
 */
function getCurrentTheme() {
    // Đọc trạng thái giao diện đã lưu từ bộ nhớ trình duyệt
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // Nếu là lần đầu truy cập, kiểm tra cấu hình hệ thống (Sử dụng matchMedia theo gợi ý của bài tập)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
}

/**
 * LOGIC 2: Hàm áp dụng giao diện lên trang web
 * - Thêm thuộc tính [data-theme="dark"] vào thẻ html nếu là giao diện tối để file CSS bắt được màu.
 * - Lưu lại trạng thái lựa chọn mới nhất vào localStorage để giữ giao diện khi reload/chuyển trang.
 */
function applyTheme(theme) {
    // Gán giá trị theme trực tiếp vào thuộc tính data-theme của thẻ <html> nền tảng
    document.documentElement.setAttribute('data-theme', theme);
    
    // Ghi nhớ lựa chọn này vào localStorage cho các lần truy cập sau
    localStorage.setItem('theme', theme);
}

// KHỞI CHẠY BAN ĐẦU: Ngay khi trang web vừa load xong, áp dụng ngay giao diện phù hợp
const activeTheme = getCurrentTheme();
applyTheme(activeTheme);

/**
 * LOGIC 3: Lắng nghe sự kiện Click chuột vào nút thay đổi giao diện ☀️/🌙
 * - Nếu giao diện hiện tại là tối (dark), click vào sẽ chuyển sang sáng (light).
 * - Ngược lại, nếu đang sáng sẽ chuyển sang tối.
 */
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // Kiểm tra thuộc tính data-theme hiện tại của thẻ html để nhận diện trạng thái real-time
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Thực hiện đảo ngược trạng thái giao diện
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Gọi hàm để cập nhật lại giao diện và lưu trữ vào bộ nhớ máy
        applyTheme(newTheme);
    });
}