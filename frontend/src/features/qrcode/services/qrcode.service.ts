import axiosInstance from '../../../utils/axiosInstance';
import type {
  QRCodeBatchesResponse,
  QRCodeBatchResponse,
  QRCodeBatchStatsResponse,
  ImportCSVResponse,
  RetryBatchResponse,
} from '../types/qrcode.types';

const QRCODE_BASE_URL = '/qrcodes';

export const qrcodeService = {
  /**
   * Import CSV and send QR codes in bulk
   */
  importCSV: async (file: File, validity?: string): Promise<ImportCSVResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (validity) {
      formData.append('validity', validity);
    }

    const response = await axiosInstance.post<ImportCSVResponse>(
      `${QRCODE_BASE_URL}/import-csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Retry failed sends from a batch
   */
  retryBatch: async (batchId: string): Promise<RetryBatchResponse> => {
    const response = await axiosInstance.post<RetryBatchResponse>(
      `${QRCODE_BASE_URL}/batch/${batchId}/retry`
    );
    return response.data;
  },

  /**
   * Get all batches
   */
  getBatches: async (params?: {
    status?: string;
    batchType?: string;
    limit?: number;
    skip?: number;
  }): Promise<QRCodeBatchesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.batchType) queryParams.append('batchType', params.batchType);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());

    const response = await axiosInstance.get<QRCodeBatchesResponse>(
      `${QRCODE_BASE_URL}/batches?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get single batch details
   */
  getBatchDetails: async (batchId: string): Promise<QRCodeBatchResponse> => {
    const response = await axiosInstance.get<QRCodeBatchResponse>(
      `${QRCODE_BASE_URL}/batch/${batchId}`
    );
    return response.data;
  },

  /**
   * Get batch statistics
   */
  getBatchStats: async (): Promise<QRCodeBatchStatsResponse> => {
    const response = await axiosInstance.get<QRCodeBatchStatsResponse>(
      `${QRCODE_BASE_URL}/batches/stats`
    );
    return response.data;
  },
};
