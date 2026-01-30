const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mind-diary');

const createUser = async () => {
  try {
    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('✅ Usuario ya existe:');
      console.log('Email: test@example.com');
      console.log('Password: 123456');
      console.log('ID:', existingUser._id);
      return;
    }

    // Crear nuevo usuario
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });

    await user.save();
    
    console.log('✅ Usuario creado exitosamente:');
    console.log('Email: test@example.com');
    console.log('Password: 123456');
    console.log('ID:', user._id);
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    mongoose.connection.close();
  }
};

createUser();
