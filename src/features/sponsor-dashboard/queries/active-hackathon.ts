import { type Hackathon } from '@prisma/client';
import { queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getURL } from '@/utils/validUrl';

const fetchActiveHackathon = async (): Promise<Hackathon> => {
  const { data } = await api.get(
    `${getURL()}api/sponsor-dashboard/active-hackathon/`,
  );
  return data;
};

export const activeHackathonQuery = () =>
  queryOptions({
    queryKey: ['active-hackathon'],
    queryFn: () => fetchActiveHackathon(),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
