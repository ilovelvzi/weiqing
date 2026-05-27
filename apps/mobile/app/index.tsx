import { Text } from "react-native";
import { PageShell } from "../src/components/layout";

export default function HomeRoute() {
  return (
    <PageShell title="Home" description="Overview placeholder.">
      <Text>Home cards will use the overview API in the next mobile phase.</Text>
    </PageShell>
  );
}
