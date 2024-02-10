import { useAuthContext } from '../context/auth-context';

export function useAuth() {
  const { getToken } = useAuthContext();
  console.log({ token: Boolean(getToken()) });
  return Boolean(getToken());
}
