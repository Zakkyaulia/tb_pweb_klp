// Fungsi khusus untuk halaman ajuandiproses
document.addEventListener('DOMContentLoaded', function() {
    // Buka dropdown Permintaan dan tandai "Diproses" sebagai aktif
    openPermintaanDropdown();
    const diprosesLink = document.querySelector('a[href="/admin/requests/diproses"]');
    if (diprosesLink) {
        diprosesLink.classList.add('active');
    }
});

// Fungsi untuk generate PDF khusus halaman diproses
function generatePDFDiproses(event) {
    generatePDF(event, '/admin/requests/diproses/pdf', `permintaan-diproses-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Fungsi khusus untuk komentar
let selectedRequestId = null;

function openKomentarModal(row) {
    selectedRequestId = row.dataset.requestId;
    const currentKomentar = row.querySelector('.komentar-text').textContent.trim();
    document.getElementById('komentarInput').value = currentKomentar === '—' ? '' : currentKomentar;
    document.getElementById('komentarModal').classList.remove('hidden');
}

function closeKomentarModal() {
    document.getElementById('komentarModal').classList.add('hidden');
    selectedRequestId = null;
}

async function simpanKomentar() {
    if (!selectedRequestId) return;

    const komentar = document.getElementById('komentarInput').value.trim();
    
    console.log('Sending comment:', { selectedRequestId, komentar });

    try {
        const response = await fetch(`/admin/requests/comment/${selectedRequestId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ komentar_admin: komentar })
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response result:', result);
        
        if (result.success) {
            window.location.reload();
        } else {
            alert('Gagal menyimpan komentar: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menyimpan komentar.');
    }
} 