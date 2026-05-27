import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import { authApi } from "../src/features/auth/auth.api";
import { clearAuthSession, saveAuthSession } from "../src/features/auth/auth.hooks";
import { getRefreshToken } from "../src/services";
import { useAuthStore } from "../src/stores";

export default function LaunchRoute() {
  const router = useRouter();
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);
  const [message, setMessage] = useState("Checking session");

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      setBootstrapping(true);
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        await clearAuthSession();
        router.replace("/auth/login");
        return;
      }

      try {
        setMessage("Restoring session");
        const session = await authApi.refresh({ refreshToken });
        await saveAuthSession(session);

        if (isMounted) {
          router.replace("/");
        }
      } catch {
        await clearAuthSession();

        if (isMounted) {
          router.replace("/auth/login");
        }
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [router, setBootstrapping]);

  return (
    <PageShell title="WeiQing" description="Starting">
      <Loading label={message} />
    </PageShell>
  );
}
