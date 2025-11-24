export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  full?: string;
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface QRCode {
  code?: string;
  imageUrl?: string;
  generatedAt?: string;
  signature?: string;
  validity?: string;
  emailStatus?: 'sent' | 'pending' | 'failed' | 'not-generated';
  emailSentAt?: string;
  scanCount?: number;
  lastScannedAt?: string;
}

export type MemberStatus = 'pending' | 'active' | 'inactive' | 'rejected' | 'suspended';
export type MemberType = 'regular' | 'student' | 'honorary' | 'family';

export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth: string;
  age?: number;
  address?: Address;
  phone?: string;
  email?: string;
  membershipDate: string;
  status: MemberStatus;
  applicationDate: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectionDate?: string;
  memberType: MemberType;
  emergencyContact?: EmergencyContact;
  occupation?: string;
  interests?: string;
  notes?: string;
  qrCode?: QRCode;
  memberNumber?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembersPagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface MembersResponse {
  success: boolean;
  data: {
    members: Member[];
    pagination: MembersPagination;
  };
}

export interface QRCodeStatus {
  generated: boolean;
  emailSent: boolean;
  emailStatus?: 'sent' | 'pending' | 'failed' | 'not-generated';
}

export interface MemberResponse {
  success: boolean;
  data: Member | {
    member: Member;
    qrCodeStatus?: QRCodeStatus;
  };
  message?: string;
}

export interface MembersFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: MemberStatus;
}
