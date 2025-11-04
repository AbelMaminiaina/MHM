export interface MembershipApplicationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city: string;
    postalCode: string;
    country?: string;
    full?: string;
  };
  memberType?: 'regular' | 'student' | 'honorary' | 'family';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  occupation?: string;
  interests?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    fullName: string;
    email: string;
    status: string;
    applicationDate: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
