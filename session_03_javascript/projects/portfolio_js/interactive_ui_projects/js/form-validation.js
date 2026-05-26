// Chọn các phần tử quản lý form trên giao diện HTML
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success-message');

// Định nghĩa quy tắc và thông báo lỗi tương ứng cho từng ô nhập liệu
const validators = {
    name: {
        // Loại bỏ khoảng trắng thừa ở hai đầu và kiểm tra độ dài chuỗi ký tự
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters'
    },
    email: {
        // Áp dụng biểu thức chính quy (Regex) để kiểm tra cấu trúc định dạng email hợp lệ
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    message: {
        // Đảm bảo nội dung lời nhắn không quá ngắn để thu thập thông tin chất lượng
        validate: (value) => value.trim().length >= 10,
        message: 'Message must be at least 10 characters'
    }
};

// Hàm gán class lỗi 'error' để kích hoạt style viền đỏ trên file CSS
function showError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = message; // Đẩy nội dung thông báo lỗi inline xuống thẻ span
    }
}

// Hàm gán class 'success' để kích hoạt style viền xanh khi dữ liệu hợp lệ
function showSuccess(input) {
    input.classList.add('success');
    input.classList.remove('error');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = ''; // Xóa bỏ dòng thông báo lỗi cũ
    }
}

// Hàm kiểm tra tính hợp lệ của một ô nhập liệu độc lập
function validateField(input) {
    const validator = validators[input.name];
    if (!validator) return true; // Bỏ qua nếu ô này không nằm trong danh sách cần kiểm tra

    // Chạy hàm kiểm tra: Trả về true nếu đạt chuẩn, ngược lại trả về false kèm thông báo lỗi
    if (validator.validate(input.value)) {
        showSuccess(input);
        return true;
    } else {
        showError(input, validator.message);
        return false;
    }
}

// Lắng nghe các sự kiện tương tác của người dùng trên Form
if (form) {
    // 1. Validation real-time: Kiểm tra dữ liệu ngay lập tức trong quá trình người dùng gõ chữ
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                validateField(input);
            });
        }
    });

    // 2. Validation tổng thể khi người dùng thực hiện bấm nút Submit Form
    form.addEventListener('submit', (e) => {
        // ĐƯA LÊN ĐẦU: Ngăn chặn hành vi mặc định của trình duyệt là reload lại trang khi gửi form
        e.preventDefault();

        // Kích hoạt kiểm tra đồng thời cả 3 trường dữ liệu trước khi cho phép gửi đi
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);

        // Chỉ xử lý logic gửi đi khi toàn bộ dữ liệu trên form đã vượt qua bài kiểm tra thành công
        if (isNameValid && isEmailValid && isMessageValid) {
            
            // Giả lập log thông tin thành công ra cửa sổ Console của trình duyệt để kiểm tra dòng dữ liệu
            console.log('Form submitted successfully:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });

            // Hiển thị khung thông báo trạng thái thành công cho người dùng nhìn thấy
            successMessage.hidden = false;
            
            // Làm rỗng toàn bộ dữ liệu đang có trong các ô nhập liệu của form
            form.reset();

            // Xóa bỏ các class trạng thái viền xanh/đỏ cũ để đưa form về trạng thái mặc định ban đầu
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('success', 'error');
            });

            // Tự động ẩn hộp thoại thông báo thành công sau 3 giây để làm sạch giao diện
            setTimeout(() => {
                successMessage.hidden = true;
            }, 3000);
        }
    });
}