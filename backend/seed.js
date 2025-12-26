const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Database');

    // 1. Define the Super Admin details
    const adminEmail = 'admin@example.com';
    const adminRole = 'admin'; // <--- CHECK THIS: Change to 'SuperAdmin' or 'Manager' if your app uses different names

    // 2. Check if user already exists
    const exists = await User.findOne({ where: { email: adminEmail } });
    if (exists) {
      console.log('⚠️ Admin user already exists. Skipping creation.');
      process.exit();
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 4. Create the User with the correct Role
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: adminRole, // Critical for your RBAC system
      // active: true, // Uncomment if you have an 'active' status column
    });

    console.log('🎉 Success! Admin User Created:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: password123`);
    console.log(`   Role: ${adminRole}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();