import { Redirect } from 'expo-router';
import { useSession } from '../data/session';

export default function Index() {
  const session = useSession();
  return <Redirect href={session ? '/overview' : '/sign-in'} />;
}
