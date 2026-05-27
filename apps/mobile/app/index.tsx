import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import { routes } from "../src/services";
import { useAuthStore } from "../src/stores";

export default function HomeRoute() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(routes.home);
    }
  }, [isAuthenticated, router]);

  return (
    <PageShell title="WeiQing" description="Starting">
      <Loading label="Checking session" />
    </PageShell>
  );
}
