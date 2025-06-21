// Fungsi khusus untuk halaman ajuansemua
document.addEventListener('DOMContentLoaded', function() {
    // Buka dropdown Permintaan tanpa animasi dan tandai "Semua" sebagai aktif
    openPermintaanDropdownNoAnimation();
    const semuaLink = document.querySelector('a[href="/admin/requests/semua"]');
    if (semuaLink) {
        semuaLink.classList.add('active');
    }

    // Reset button functionality
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            window.location.href = '/admin/requests/semua';
        });
    }
});

// Fungsi khusus untuk komentar (versi sederhana untuk halaman semua)
let selectedRow = null;

function openKomentarModal(row) {
    selectedRow = row;
    const currentKomentar = row.querySelector('.komentar-cell').innerText;
    document.getElementById('komentarInput').value = currentKomentar === '—' ? '' : currentKomentar;
    document.getElementById('komentarModal').classList.remove('hidden');
}

function closeKomentarModal() {
    document.getElementById('komentarModal').classList.add('hidden');
    selectedRow = null;
}

function simpanKomentar() {
    const komentar = document.getElementById('komentarInput').value.trim();
    if (selectedRow) {
        selectedRow.querySelector('.komentar-cell').innerText = komentar || '—';
    }
    closeKomentarModal();
} 