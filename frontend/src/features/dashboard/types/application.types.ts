import type { Member } from './member.types';

export interface PendingApplication extends Member {
  applicationDate: string;
}

export interface PendingApplicationsResponse {
  success: boolean;
  data: {
    applications: PendingApplication[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface ApplicationStatsResponse {
  success: boolean;
  data: {
    byStatus: {
      pending: number;
      active: number;
      inactive: number;
      rejected: number;
      suspended: number;
    };
    byType: {
      regular: number;
      student: number;
      honorary: number;
      family: number;
    };
    total: number;
  };
}

export interface ApproveApplicationData {
  notes?: string;
}

export interface RejectApplicationData {
  rejectionReason: string;
}
