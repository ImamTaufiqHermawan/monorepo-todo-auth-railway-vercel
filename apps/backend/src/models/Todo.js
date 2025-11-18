import mongoose from 'mongoose';

// Schema MongoDB untuk Todo
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,      // Wajib diisi
      trim: true,          // Hapus spasi di awal dan akhir
    },
    completed: {
      type: Boolean,
      default: false,      // Default belum selesai
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Relasi ke User collection
      ref: 'User',                           // Reference ke model User
      required: true,                        // Wajib ada (setiap todo punya owner)
    },
  },
  {
    timestamps: true,      // Otomatis tambah createdAt dan updatedAt
  }
);

export default mongoose.model('Todo', todoSchema);

