import { Text } from "react-native";
import { Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import { useAuthStore } from "../src/stores";

export default function HomeRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Loading label="Checking session" />;
  }

  return (
    <PageShell title="WeiQing" description="Home placeholder">
      <Text>You are signed in. Home overview cards will be added in Phase 7B.</Text>
    </PageShell>
  );
}
