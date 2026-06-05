// ===== CONFIG =====
const API_KEY = 'd959046e';  // Thay bằng key của bạn
const BASE_URL = 'https://www.omdbapi.com/';

// ===== STATE =====
let currentQuery = '';
let currentPage = 1;
let totalResults = 0;
let currentTab = 'search';       // 'search' | 'favorites'
let favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
let debounceTimer = null;

// ===== DOM ELEMENTS =====
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieGrid = document.getElementById('movie-grid');
const loading = document.getElementById('loading');
const statusMessage = document.getElementById('status-message');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const movieModal = document.getElementById('movie-modal');
const modalClose = document.getElementById('modal-close');
const favCount = document.getElementById('fav-count');
const tabBtns = document.querySelectorAll('.tab-btn');

// ===== SEARCH MOVIES =====
async function searchMovies(query, page = 1) {
    if (!query.trim()) return;

    showLoading(true);
    hideStatus();

    try {
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await response.json();

        if (data.Response === 'True') {
            currentQuery = query;
            currentPage = page;
            totalResults = parseInt(data.totalResults);
            renderMovies(data.Search);
            renderPagination();
        } else {
            showStatus('Không tìm thấy phim nào. Thử từ khóa khác!', 'info');
            movieGrid.innerHTML = '';
            pagination.hidden = true;
        }
    } catch (error) {
        showStatus('Lỗi kết nối. Kiểm tra mạng và thử lại!', 'error');
        console.error('Fetch error:', error);
    } finally {
        showLoading(false);
    }
}

// ===== GET MOVIE DETAIL =====
async function getMovieDetail(imdbID) {
    try {
        const response = await fetch(
            `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
        );
        return await response.json();
    } catch (error) {
        showStatus('Không thể tải chi tiết phim', 'error');
        return null;
    }
}

function renderMovies(movies) {
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const isFav = favorites.some(f => f.imdbID === movie.imdbID);

        card.innerHTML = `
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${movie.imdbID}">
                ${isFav ? '❤️' : '🤍'}
            </button>
            ${movie.Poster !== 'N/A'
                ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">`
                : `<div class="movie-poster-placeholder">🎬</div>`
            }
            <div class="movie-info">
                <div class="movie-title" title="${movie.Title}">${movie.Title}</div>
                <div class="movie-year">📅 ${movie.Year}</div>
                <span class="movie-type">${movie.Type}</span>
            </div>
        `;

        // Click card → open detail
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.fav-btn')) {
                openMovieDetail(movie.imdbID);
            }
        });

        // Favorite button
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
        });

        movieGrid.appendChild(card);
    });
}

function renderPagination() {
    const totalPages = Math.ceil(totalResults / 10);

    if (totalPages <= 1) {
        pagination.hidden = true;
        return;
    }

    pagination.hidden = false;
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

async function openMovieDetail(imdbID) {
    const movie = await getMovieDetail(imdbID);
    if (!movie) return;

    document.getElementById('modal-poster-img').src =
        movie.Poster !== 'N/A' ? movie.Poster : '';
    document.getElementById('modal-title').textContent = movie.Title;
    document.getElementById('modal-year').textContent = `📅 ${movie.Year}`;
    document.getElementById('modal-runtime').textContent = `⏱️ ${movie.Runtime}`;
    document.getElementById('modal-rated').textContent = `🔞 ${movie.Rated}`;
    document.getElementById('modal-rating').textContent = `⭐ ${movie.imdbRating}/10`;
    document.getElementById('modal-genre').textContent = movie.Genre;
    document.getElementById('modal-plot').textContent = movie.Plot;
    document.getElementById('modal-director').textContent = movie.Director;
    document.getElementById('modal-actors').textContent = movie.Actors;

    movieModal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    movieModal.hidden = true;
    document.body.style.overflow = '';
}

function toggleFavorite(movie) {
    const index = favorites.findIndex(f => f.imdbID === movie.imdbID);

    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster,
            Type: movie.Type
        });
    }

    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    updateFavCount();

    // Re-render current tab
    if (currentTab === 'favorites') {
        renderFavorites();
    } else {
        // Update heart icons
        document.querySelectorAll('.fav-btn').forEach(btn => {
            const id = btn.dataset.id;
            const isFav = favorites.some(f => f.imdbID === id);
            btn.classList.toggle('active', isFav);
            btn.textContent = isFav ? '❤️' : '🤍';
        });
    }
}

function renderFavorites() {
    if (favorites.length === 0) {
        movieGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#94a3b8;">Chưa có phim yêu thích nào</p>';
        pagination.hidden = true;
        return;
    }
    renderMovies(favorites);
    pagination.hidden = true;
}

function updateFavCount() {
    favCount.textContent = favorites.length;
}


function debounce(func, delay) {
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedSearch = debounce((query) => {
    if (query.length >= 2) {
        searchMovies(query);
    }
}, 500);

// Search
searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchMovies(searchInput.value);
});

// Debounce auto-search
searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Pagination
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) searchMovies(currentQuery, currentPage - 1);
});
nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalResults / 10);
    if (currentPage < totalPages) searchMovies(currentQuery, currentPage + 1);
});

// Modal
modalClose.addEventListener('click', closeModal);
movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !movieModal.hidden) closeModal();
});

// Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;

        if (currentTab === 'favorites') {
            renderFavorites();
        } else if (currentQuery) {
            searchMovies(currentQuery, currentPage);
        } else {
            movieGrid.innerHTML = '';
            pagination.hidden = true;
        }
    });
});

// Init
updateFavCount();


function showLoading(show) {
    loading.hidden = !show;
    if (show) movieGrid.innerHTML = '';
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.hidden = false;
}

function hideStatus() {
    statusMessage.hidden = true;
}

