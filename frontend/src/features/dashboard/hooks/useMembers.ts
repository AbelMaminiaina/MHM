import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersService } from '../services/members.service';
import type { MembersFilters, Member } from '../types/member.types';

// Query keys
export const membersKeys = {
  all: ['members'] as const,
  lists: () => [...membersKeys.all, 'list'] as const,
  list: (filters?: MembersFilters) => [...membersKeys.lists(), filters] as const,
  details: () => [...membersKeys.all, 'detail'] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
  stats: () => [...membersKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch members list with pagination and filters
 */
export const useMembers = (filters?: MembersFilters) => {
  return useQuery({
    queryKey: membersKeys.list(filters),
    queryFn: () => membersService.getMembers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single member
 */
export const useMember = (id: string) => {
  return useQuery({
    queryKey: membersKeys.detail(id),
    queryFn: () => membersService.getMember(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch member statistics
 */
export const useMemberStats = () => {
  return useQuery({
    queryKey: membersKeys.stats(),
    queryFn: () => membersService.getMemberStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to create a new member
 */
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberData: Partial<Member>) =>
      membersService.createMember(memberData),
    onSuccess: () => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membersKeys.stats() });
    },
  });
};

/**
 * Hook to update a member
 */
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) =>
      membersService.updateMember(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific member and the list
      queryClient.invalidateQueries({ queryKey: membersKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membersKeys.stats() });
    },
  });
};

/**
 * Hook to delete a member
 */
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => membersService.deleteMember(id),
    onSuccess: () => {
      // Invalidate members list
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membersKeys.stats() });
    },
  });
};
