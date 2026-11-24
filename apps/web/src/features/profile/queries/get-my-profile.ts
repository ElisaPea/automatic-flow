import 'server-only';
import { serverApi } from '@/lib/api/server-api';

export const getMyProfile = async () => (await serverApi()).profile.me();
