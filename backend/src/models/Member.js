import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères'],
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'La date de naissance est requise'],
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: 'France',
      },
      full: {
        type: String,
        trim: true,
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide'],
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'rejected', 'suspended'],
      default: 'pending',
    },
    // Membership application workflow
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionDate: {
      type: Date,
    },
    // Member type
    memberType: {
      type: String,
      enum: ['regular', 'student', 'honorary', 'family'],
      default: 'regular',
    },
    // Emergency contact
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },
    // Additional info
    occupation: {
      type: String,
      trim: true,
    },
    interests: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    // QR Code information
    qrCode: {
      code: {
        type: String,
        unique: true,
        sparse: true, // Allow null values while maintaining uniqueness
      },
      imageUrl: {
        type: String,
      },
      generatedAt: {
        type: Date,
      },
      signature: {
        type: String,
      },
      validity: {
        type: String, // Year format: "2025"
      },
      emailStatus: {
        type: String,
        enum: ['sent', 'pending', 'failed', 'not-generated'],
        default: 'not-generated',
      },
      emailSentAt: {
        type: Date,
      },
      scanCount: {
        type: Number,
        default: 0,
      },
      lastScannedAt: {
        type: Date,
      },
    },
    memberNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
memberSchema.virtual('fullName').get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
memberSchema.virtual('age').get(function getAge() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
});

// Include virtuals when converting to JSON
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

// Index for search
memberSchema.index({ firstName: 'text', lastName: 'text' });

const Member = mongoose.model('Member', memberSchema);

export default Member;
