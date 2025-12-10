import { describe, test, expect, jest } from '@jest/globals';
import { generateMemberNumber } from '../qrCodeGenerator.js';

describe('QR Code Generator Utils', () => {
  describe('generateMemberNumber', () => {
    test('should generate member number with correct format', async () => {
      const MockMember = {
        countDocuments: jest.fn().mockResolvedValue(5),
      };

      const memberNumber = await generateMemberNumber(MockMember);

      const year = new Date().getFullYear();
      const expectedPattern = new RegExp(`^HFM-${year}-\\d{5}$`);

      expect(memberNumber).toMatch(expectedPattern);
      expect(memberNumber).toBe(`HFM-${year}-00006`);
    });

    test('should generate sequential member numbers', async () => {
      const MockMember = {
        countDocuments: jest.fn().mockResolvedValue(99),
      };

      const memberNumber = await generateMemberNumber(MockMember);

      const year = new Date().getFullYear();
      expect(memberNumber).toBe(`HFM-${year}-00100`);
    });

    test('should pad numbers correctly', async () => {
      const testCases = [
        { count: 0, expected: '00001' },
        { count: 9, expected: '00010' },
        { count: 99, expected: '00100' },
        { count: 999, expected: '01000' },
        { count: 9999, expected: '10000' },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const testCase of testCases) {
        const MockMember = {
          countDocuments: jest.fn().mockResolvedValue(testCase.count),
        };

        // eslint-disable-next-line no-await-in-loop
        const memberNumber = await generateMemberNumber(MockMember);
        const year = new Date().getFullYear();

        expect(memberNumber).toBe(`HFM-${year}-${testCase.expected}`);
      }
    });
  });
});
