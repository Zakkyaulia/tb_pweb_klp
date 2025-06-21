// Fungsi khusus untuk halaman ajuandiajukan
document.addEventListener('DOMContentLoaded', function() {
    // Buka dropdown Permintaan dan tandai "Diajukan" sebagai aktif
    openPermintaanDropdown();
    const diajukanLink = document.querySelector('a[href="/admin/requests/diajukan"]');
    if (diajukanLink) {
        diajukanLink.classList.add('active');
    }
});

// Fungsi untuk generate PDF khusus halaman diajukan
function generatePDFDiajukan(event) {
    generatePDF(event, '/admin/requests/diajukan/pdf', `permintaan-diajukan-${new Date().toISOString().split('T')[0]}.pdf`);
} 