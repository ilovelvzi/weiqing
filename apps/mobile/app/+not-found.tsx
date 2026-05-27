import { Link } from "expo-router";
import { Text } from "react-native";
import { PageShell } from "../src/components/layout";

export default function NotFoundRoute() {
  return (
    <PageShell title="Not found" description="This route does not exist.">
      <Link href="/">
        <Text>Return home</Text>
      </Link>
    </PageShell>
  );
}
