document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxLink = document.getElementById('lightbox-link'); // Lấy thẻ link mới thêm
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // 2. Thêm thuộc tính url trỏ đúng đến các file HTML chi tiết của bạn
    const portfolioItems = [
        { 
            src: 'images/dormitory-management-system.jpg', 
            title: 'Dormitory Management System',
            url: 'dormitory-management.html' // Liên kết tương ứng
        },
        { 
            src: 'images/green-campus.jpg', 
            title: 'Green Campus System Diagram',
            url: 'green-campus.html' // Liên kết tương ứng
        },
        { 
            src: 'images/coffee-management.jpg', 
            title: 'Coffee Management System',
            url: 'coffee-management.html' // Liên kết tương ứng
        }
    ];
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 5. Cập nhật nội dung bao gồm cả đường dẫn động
    function updateLightboxContent() {
        const item = portfolioItems[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
        lightboxTitle.textContent = item.title;
        
        // Đổi thuộc tính href của nút thành trang HTML tương ứng
        lightboxLink.href = item.url; 
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % portfolioItems.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
        updateLightboxContent();
    }

    document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            openLightbox(parseInt(trigger.dataset.index));
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
});