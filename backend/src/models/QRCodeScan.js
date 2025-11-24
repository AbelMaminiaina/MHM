import mongoose from 'mongoose';

const qrCodeScanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    memberNumber: {
      type: String,
      required: true,
    },
    scanStatus: {
      type: String,
      enum: ['valid', 'expired', 'forged', 'invalid', 'disabled', 'not-found'],
      required: true,
    },
    scanMessage: {
      type: String,
      required: true,
    },
    emailStatus: {
      type: String,
      enum: ['sent', 'pending', 'failed', 'not-found'],
    },
    qrData: {
      type: mongoose.Schema.Types.Mixed,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    deviceInfo: {
      userAgent: String,
      ipAddress: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
qrCodeScanSchema.index({ member: 1, scannedAt: -1 });
qrCodeScanSchema.index({ memberNumber: 1, scannedAt: -1 });
qrCodeScanSchema.index({ scanStatus: 1, scannedAt: -1 });
qrCodeScanSchema.index({ scannedAt: -1 });

const QRCodeScan = mongoose.model('QRCodeScan', qrCodeScanSchema);

export default QRCodeScan;
