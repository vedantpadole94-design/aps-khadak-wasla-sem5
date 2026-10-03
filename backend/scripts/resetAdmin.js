require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    console.log('\n🔐 Resetting admin user...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const User = require('../src/models/User');
    await User.deleteMany({ username: 'admin' });

    const hash = await bcrypt.hash('aps123', 12);
    await User.create({
      username: 'admin',
      password: hash,
      role: 'admin'
    });

    console.log('\n✅ Admin reset successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('   Username : admin');
    console.log('   Password : aps123');
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
  }
})();
