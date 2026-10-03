require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    console.log('\n🔐 Admin Password Reset Tool\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    // Load User model
    const User = require('./models/User');

    // Check if user exists
    const existing = await User.findOne({ username: 'admin' });
    
    const newPassword = 'aps123';
    const hash = await bcrypt.hash(newPassword, 12);

    if (existing) {
      console.log('ℹ️  Admin user found. Updating password...');
      await User.updateOne(
        { username: 'admin' },
        { $set: { password: hash, role: 'admin' } }
      );
    } else {
      console.log('ℹ️  Admin user NOT found. Creating new user...');
      await User.create({
        username: 'admin',
        password: hash,
        role: 'admin'
      });
    }

    console.log('\n✅ SUCCESS!\n');
    console.log('═══════════════════════════════');
    console.log('   Username: admin');
    console.log('   Password: aps123');
    console.log('═══════════════════════════════\n');
    console.log('Now login at: http://localhost:5173/admin/login\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('\nCheck that:');
    console.error('  1. MongoDB is running');
    console.error('  2. MONGODB_URI is set in .env');
    console.error('  3. User model exists at ./models/User.js\n');
    process.exit(1);
  }
})();
