export interface QRCodeBatchResult {
  member?: string;
  memberNumber: string;
  name: string;
  email: string;
  status: 'success' | 'failed' | 'pending';
  qrGenerated: boolean;
  emailSent: boolean;
  emailStatus?: string;
  error?: string;
  processedAt: string;
}

export interface QRCodeBatch {
  _id: string;
  batchName: string;
  batchType: 'manual' | 'csv-import' | 'bulk-regenerate' | 'yearly-renewal';
  validity: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'partial';
  totalMembers: number;
  processedMembers: number;
  successfulSends: number;
  failedSends: number;
  results: QRCodeBatchResult[];
  csvFilename?: string;
  startedAt?: string;
  completedAt?: string;
  createdBy?: string;
  retryCount: number;
  lastRetryAt?: string;
  completionPercentage: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeBatchesResponse {
  success: boolean;
  data: {
    batches: QRCodeBatch[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  };
}

export interface QRCodeBatchResponse {
  success: boolean;
  data: QRCodeBatch;
  message?: string;
}

export interface QRCodeBatchStatsResponse {
  success: boolean;
  data: {
    totalBatches: number;
    completedBatches: number;
    failedBatches: number;
    processingBatches: number;
    totalSends: number;
    totalFails: number;
    totalProcessed: number;
    successRate: string;
  };
}

export interface ImportCSVResponse {
  success: boolean;
  data: QRCodeBatch;
  message: string;
}

export interface RetryBatchResponse {
  success: boolean;
  data: {
    batch: QRCodeBatch;
    retriedSuccess: number;
    retriedFailed: number;
  };
  message: string;
}
