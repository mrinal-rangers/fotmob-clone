import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFollows, followEntity, unfollowEntity } from "@/lib/api";

export function useFollows() {
  return useQuery({
    queryKey: ["follows"],
    queryFn: fetchFollows,
  });
}

export function useFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ entityType, entityId }: { entityType: string; entityId: string }) =>
      followEntity(entityType, entityId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follows"] }),
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (followId: string) => unfollowEntity(followId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["follows"] }),
  });
}
