// Fungsi umum untuk semua halaman admin
document.addEventListener('DOMContentLoaded', function() {
    initializeUserMenu();
    initializeSearchInput();
    initializeNavLinks();
    initializeSubmenuLinks();
    initializeLogoutConfirmation();
});

// Inisialisasi menu user dropdown
function initializeUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function(event) {
            event.stopPropagation();
            userMenu.classList.toggle('hidden');
        });

        // Sembunyikan menu jika klik di luar
        window.addEventListener('click', function(event) {
            if (!userMenu.classList.contains('hidden') && !userMenuButton.contains(event.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }
}

// Inisialisasi search input
function initializeSearchInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log('Mencari:', e.target.value);
        });
    }
}

// Inisialisasi nav links dengan hover effect
function initializeNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(4px)';
        });
        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Inisialisasi submenu links
function initializeSubmenuLinks() {
    const submenuLinks = document.querySelectorAll('.submenu-link');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            submenuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const text = this.textContent.trim();
            const routes = {
                'Diajukan': '/admin/requests/diajukan',
                'Diproses': '/admin/requests/diproses',
                'Selesai': '/admin/requests/selesai',
                'Semua': '/admin/requests/semua'
            };
            
            if (routes[text]) {
                window.location.href = routes[text];
            }
        });

        link.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.background = 'linear-gradient(90deg, rgba(247, 115, 22, 0.1), rgba(234, 88, 12, 0.1))';
                this.style.color = '#f97316';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.background = '';
                this.style.color = '';
            }
        });
    });
}

// Fungsi umum untuk generate PDF
async function generatePDF(event, endpoint, filename) {
    const button = event.currentTarget;
    const originalContent = button.innerHTML;

    try {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Generating PDF...</span>';
        button.disabled = true;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `laporan-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('Gagal generate PDF');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Terjadi kesalahan saat generate PDF');
    } finally {
        if (button) {
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }
}

// Fungsi umum untuk update status
async function updateStatus(selectElement, requestId) {
    const newStatus = selectElement.value;
    try {
        const response = await fetch(`/admin/requests/update/${requestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();
        if (result.success) {
            window.location.reload();
        } else {
            alert('Gagal memperbarui status');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memperbarui status');
    }
}

// Fungsi untuk toggle submenu
function toggleSubmenu(header) {
    const submenu = header.parentElement;
    const submenuList = submenu.querySelector('.submenu-list');
    const chevron = header.querySelector('i');

    submenu.classList.toggle('active');

    if (submenu.classList.contains('active')) {
        submenuList.style.maxHeight = submenuList.scrollHeight + 'px';
        chevron.style.transform = 'rotate(180deg)';
    } else {
        submenuList.style.maxHeight = '0';
        chevron.style.transform = 'rotate(0deg)';
    }
}

// Fungsi untuk membuka dropdown Permintaan secara otomatis
function openPermintaanDropdown() {
    const submenu = document.querySelector('.nav-submenu');
    if (!submenu) return;
    
    const submenuList = submenu.querySelector('.submenu-list');
    const chevron = submenu.querySelector('.submenu-header i');
    
    // Buka dropdown
    submenu.classList.add('active');
    submenuList.style.maxHeight = submenuList.scrollHeight + 'px';
    if (chevron) {
        chevron.style.transform = 'rotate(180deg)';
    }
}

// Fungsi untuk membuka dropdown tanpa animasi (untuk halaman yang sudah aktif)
function openPermintaanDropdownNoAnimation() {
    const submenu = document.querySelector('.nav-submenu');
    if (!submenu) return;
    
    const submenuList = submenu.querySelector('.submenu-list');
    const chevron = submenu.querySelector('.submenu-header i');

    // 1. Matikan animasi untuk sementara
    submenuList.style.transition = 'none';
    if (chevron) chevron.style.transition = 'none';

    // 2. Buka submenu
    submenu.classList.add('active');
    submenuList.style.maxHeight = submenuList.scrollHeight + 'px';
    if (chevron) {
        chevron.style.transform = 'rotate(180deg)';
    }

    // 3. Paksa browser menggambar ulang
    void submenuList.offsetHeight;

    // 4. Nyalakan kembali animasi
    submenuList.style.transition = 'max-height 0.3s ease-in-out';
    if (chevron) chevron.style.transition = 'transform 0.3s ease-in-out';
}

function initializeLogoutConfirmation() {
    const logoutModal = document.getElementById('logout-modal');
    const logoutModalContent = document.getElementById('logout-modal-content');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');

    // Fungsi untuk menampilkan modal
    const showLogoutModal = () => {
        if (!logoutModal) return;
        logoutModal.classList.remove('hidden');
        setTimeout(() => {
            logoutModal.classList.add('opacity-100');
            logoutModalContent.classList.remove('scale-95', 'opacity-0');
            logoutModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    // Fungsi untuk menyembunyikan modal
    const hideLogoutModal = () => {
        if (!logoutModal) return;
        logoutModal.classList.remove('opacity-100');
        logoutModalContent.classList.remove('scale-100', 'opacity-100');
        logoutModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            logoutModal.classList.add('hidden');
        }, 300);
    };
    
    // Gunakan event delegation untuk menangani klik pada link logout
    document.body.addEventListener('click', (event) => {
        // Cek jika yang diklik adalah link logout di dalam menu user
        if (event.target.closest('#user-menu a[href="/logout"]')) {
            event.preventDefault(); // Hentikan aksi default link
            showLogoutModal();
        }
    });

    // Event listener untuk tombol batal
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', hideLogoutModal);
    }
    
    // Event listener untuk menutup modal jika klik di luar area kontennya
    if (logoutModal) {
        logoutModal.addEventListener('click', (event) => {
            if (event.target === logoutModal) {
                hideLogoutModal();
            }
        });
    }
} 