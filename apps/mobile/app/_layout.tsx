import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { hasRefreshToken, queryClient, routes } from "../src/services";
import { useAuthStore } from "../src/stores";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteGuard />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#f9f9ff"
          }
        }}
      />
    </QueryClientProvider>
  );
}

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);
  const firstSegment = segments[0];

  useEffect(() => {
    let isMounted = true;
    const isAuthRoute = firstSegment === "auth";
    const isLaunchRoute = firstSegment === "launch";

    async function guardRoute() {
      if (isAuthenticated) {
        setBootstrapping(false);

        if (isAuthRoute || isLaunchRoute) {
          router.replace(routes.home);
        }

        return;
      }

      const hasStoredRefreshToken = await hasRefreshToken();

      if (!isMounted) {
        return;
      }

      if (hasStoredRefreshToken) {
        if (!isLaunchRoute) {
          router.replace(routes.launch);
        }

        return;
      }

      setBootstrapping(false);

      if (!isAuthRoute) {
        router.replace(routes.login);
      }
    }

    void guardRoute();

    return () => {
      isMounted = false;
    };
  }, [firstSegment, isAuthenticated, router, setBootstrapping]);

  return null;
}
