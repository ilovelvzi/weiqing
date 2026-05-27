import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "./settings.api";

export function useUpdateSettingsMutation() {
  return useMutation({ mutationFn: settingsApi.updateSettings });
}
