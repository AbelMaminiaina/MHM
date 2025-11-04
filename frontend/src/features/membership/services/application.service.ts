import axios from 'axios';
import { env } from '../../../lib/config/env';
import type {
  MembershipApplicationData,
  ApplicationResponse,
} from '../types/application.types';

const APPLICATION_BASE_URL = `${env.api.baseUrl}/applications`;

export const applicationService = {
  /**
   * Submit a membership application (Public - no authentication required)
   */
  submitApplication: async (
    applicationData: MembershipApplicationData
  ): Promise<ApplicationResponse> => {
    const response = await axios.post<ApplicationResponse>(
      APPLICATION_BASE_URL,
      applicationData
    );
    return response.data;
  },
};
