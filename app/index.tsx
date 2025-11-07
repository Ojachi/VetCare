import { Redirect } from 'expo-router';
export default function Index() {
  // Show the public welcome screen by default
  return <Redirect href="/(auth)" />;
}
