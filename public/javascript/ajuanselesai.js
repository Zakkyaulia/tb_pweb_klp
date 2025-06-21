// Fungsi khusus untuk halaman ajuanselesai
document.addEventListener('DOMContentLoaded', function() {
    // Buka dropdown Permintaan dan tandai "Selesai" sebagai aktif
    openPermintaanDropdown();
    const selesaiLink = document.querySelector('a[href="/admin/requests/selesai"]');
    if (selesaiLink) {
        selesaiLink.classList.add('active');
    }
});

// Fungsi untuk generate PDF khusus halaman selesai
function generatePDFSelesai(event) {
    generatePDF(event, '/admin/requests/selesai/pdf', `permintaan-selesai-${new Date().toISOString().split('T')[0]}.pdf`);
} 