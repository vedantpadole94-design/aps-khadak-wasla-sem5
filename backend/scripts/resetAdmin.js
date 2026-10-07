require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    const username = process.env.ADMIN_USERNAME?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!mongodbUri) throw new Error('MONGODB_URI is required');
    if (!username) throw new Error('ADMIN_USERNAME is required');
    if (!password || password.length < 12) {
      throw new Error('ADMIN_PASSWORD must be at least 12 characters');
    }

    console.log('\n🔐 Configuring admin user...\n');
    await mongoose.connect(mongodbUri);
    console.log('✅ MongoDB connected');

    const User = require('../src/models/User');
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      existingUser.password = password;
      existingUser.role = 'admin';
      await existingUser.save();
    } else {
      await User.create({ username, password, role: 'admin' });
    }
    console.log(`✅ Admin account configured for username "${username}".`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed:', err.message);
    process.exit(1);
  }
})();
