import type { Href } from "expo-router";

export const routes = {
  checkIn: "/check-in" as Href,
  home: "/home" as Href,
  launch: "/launch" as Href,
  login: "/auth/login" as Href,
  profile: "/profile" as Href,
  records: "/records" as Href,
  register: "/auth/register" as Href,
  trend: "/trend" as Href
} as const;
