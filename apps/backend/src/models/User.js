import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Schema MongoDB untuk User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,      // Wajib diisi
      unique: true,        // Harus unik, tidak boleh duplikat
      lowercase: true,     // Otomatis convert ke lowercase
      trim: true,          // Hapus spasi di awal dan akhir
    },
    password: {
      type: String,
      required: true,      // Wajib diisi
      minlength: 8,        // Minimal 8 karakter
    },
  },
  {
    timestamps: true,      // Otomatis tambah createdAt dan updatedAt
  }
);

// Middleware yang jalan sebelum save ke database
// Fungsi: Hash password sebelum disimpan agar aman
userSchema.pre('save', async function (next) {
  // Hanya hash jika password baru atau diubah
  if (!this.isModified('password')) return next();
  
  // Hash password dengan bcrypt (10 rounds)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method untuk compare password saat login
// Return true jika password cocok, false jika tidak
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Override toJSON untuk tidak expose password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);

