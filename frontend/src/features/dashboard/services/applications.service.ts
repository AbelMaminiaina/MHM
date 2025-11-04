import axiosInstance from '../../../utils/axiosInstance';
import type {
  PendingApplicationsResponse,
  ApplicationStatsResponse,
  ApproveApplicationData,
  RejectApplicationData,
} from '../types/application.types';
import type { MemberResponse } from '../types/member.types';

const APPLICATIONS_BASE_URL = '/applications';

export const applicationsService = {
  /**
   * Get all pending applications
   */
  getPendingApplications: async (
    page = 1,
    limit = 10
  ): Promise<PendingApplicationsResponse> => {
    const response = await axiosInstance.get<PendingApplicationsResponse>(
      `${APPLICATIONS_BASE_URL}/pending?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get application statistics
   */
  getStats: async (): Promise<ApplicationStatsResponse> => {
    const response = await axiosInstance.get<ApplicationStatsResponse>(
      `${APPLICATIONS_BASE_URL}/stats`
    );
    return response.data;
  },

  /**
   * Approve an application
   */
  approveApplication: async (
    id: string,
    data?: ApproveApplicationData
  ): Promise<MemberResponse> => {
    const response = await axiosInstance.put<MemberResponse>(
      `${APPLICATIONS_BASE_URL}/${id}/approve`,
      data
    );
    return response.data;
  },

  /**
   * Reject an application
   */
  rejectApplication: async (
    id: string,
    data: RejectApplicationData
  ): Promise<MemberResponse> => {
    const response = await axiosInstance.put<MemberResponse>(
      `${APPLICATIONS_BASE_URL}/${id}/reject`,
      data
    );
    return response.data;
  },
};
