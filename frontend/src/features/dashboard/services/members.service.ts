import axiosInstance from '../../../utils/axiosInstance';
import type {
  Member,
  MembersResponse,
  MemberResponse,
  MembersFilters
} from '../types/member.types';

const MEMBERS_BASE_URL = '/members';

export const membersService = {
  /**
   * Get all members with pagination and filters
   */
  getMembers: async (filters?: MembersFilters): Promise<MembersResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    const response = await axiosInstance.get<MembersResponse>(
      `${MEMBERS_BASE_URL}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single member by ID
   */
  getMember: async (id: string): Promise<MemberResponse> => {
    const response = await axiosInstance.get<MemberResponse>(
      `${MEMBERS_BASE_URL}/${id}`
    );
    return response.data;
  },

  /**
   * Create a new member
   */
  createMember: async (memberData: Partial<Member>): Promise<MemberResponse> => {
    const response = await axiosInstance.post<MemberResponse>(
      MEMBERS_BASE_URL,
      memberData
    );
    return response.data;
  },

  /**
   * Update an existing member
   */
  updateMember: async (
    id: string,
    memberData: Partial<Member>
  ): Promise<MemberResponse> => {
    const response = await axiosInstance.put<MemberResponse>(
      `${MEMBERS_BASE_URL}/${id}`,
      memberData
    );
    return response.data;
  },

  /**
   * Delete a member
   */
  deleteMember: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete<{ success: boolean; message: string }>(
      `${MEMBERS_BASE_URL}/${id}`
    );
    return response.data;
  },

  /**
   * Export members to Excel
   */
  exportMembers: async (): Promise<Blob> => {
    const response = await axiosInstance.get(`${MEMBERS_BASE_URL}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get member statistics
   */
  getMemberStats: async (): Promise<{
    success: boolean;
    data: {
      total: number;
      active: number;
      inactive: number;
      pending: number;
      averageAge: number;
    };
  }> => {
    const response = await axiosInstance.get(`${MEMBERS_BASE_URL}/stats`);
    return response.data;
  },
};
