import mongoose from 'mongoose';

const qrCodeBatchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
    },
    batchType: {
      type: String,
      enum: ['manual', 'csv-import', 'bulk-regenerate', 'yearly-renewal'],
      default: 'manual',
    },
    validity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
      default: 'pending',
    },
    totalMembers: {
      type: Number,
      required: true,
      default: 0,
    },
    processedMembers: {
      type: Number,
      default: 0,
    },
    successfulSends: {
      type: Number,
      default: 0,
    },
    failedSends: {
      type: Number,
      default: 0,
    },
    results: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Member',
        },
        memberNumber: String,
        name: String,
        email: String,
        status: {
          type: String,
          enum: ['success', 'failed', 'pending'],
        },
        qrGenerated: Boolean,
        emailSent: Boolean,
        emailStatus: String,
        error: String,
        processedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    csvFilename: String,
    startedAt: Date,
    completedAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
qrCodeBatchSchema.index({ status: 1, createdAt: -1 });
qrCodeBatchSchema.index({ batchType: 1, createdAt: -1 });
qrCodeBatchSchema.index({ createdBy: 1, createdAt: -1 });

// Virtual for completion percentage
qrCodeBatchSchema.virtual('completionPercentage').get(function getCompletionPercentage() {
  if (this.totalMembers === 0) return 0;
  return Math.round((this.processedMembers / this.totalMembers) * 100);
});

// Virtual for success rate
qrCodeBatchSchema.virtual('successRate').get(function getSuccessRate() {
  if (this.processedMembers === 0) return 0;
  return Math.round((this.successfulSends / this.processedMembers) * 100);
});

// Include virtuals when converting to JSON
qrCodeBatchSchema.set('toJSON', { virtuals: true });
qrCodeBatchSchema.set('toObject', { virtuals: true });

const QRCodeBatch = mongoose.model('QRCodeBatch', qrCodeBatchSchema);

export default QRCodeBatch;
