const { User, RequestSurat } = require('./src/models');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test User model
    const users = await User.findAll();
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log(`User ID: ${user.user_id}, Nama: ${user.nama}, NIM: ${user.nim}, Jurusan: ${user.jurusan}`);
    });
    
    // Test RequestSurat model
    const requests = await RequestSurat.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['nama', 'nim', 'jurusan']
      }]
    });
    console.log('Requests found:', requests.length);
    requests.forEach(req => {
      console.log(`Request ID: ${req.id}, User: ${req.user ? req.user.nama : 'N/A'}, Status: ${req.status}`);
    });
    
  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabase(); 