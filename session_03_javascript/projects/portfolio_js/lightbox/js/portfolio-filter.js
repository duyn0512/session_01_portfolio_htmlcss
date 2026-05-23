document.addEventListener('DOMContentLoaded', () => {
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    console.log('Đã tìm thấy số nút bấm:', filterButtons.length);
    console.log('Đã tìm thấy số item dự án:', portfolioItems.length);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');

            const filterValue = button.dataset.filter;
            console.log('Đang chọn bộ lọc:', filterValue);

            portfolioItems.forEach(item => {
                const itemCategory = item.dataset.category;

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });
});