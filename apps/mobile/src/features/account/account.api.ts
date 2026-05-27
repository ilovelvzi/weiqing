import type { AccountDeletionStatus } from "@weiqing/shared";
import { apiClient } from "../../services";

export interface RequestDeleteAccountPayload {
  reason?: string;
  confirmText: "DELETE";
}

export interface DeleteAccountResponse {
  status: AccountDeletionStatus;
  requestedAt: string;
  scheduledDeleteAt: string | null;
}

export const accountApi = {
  requestDelete: (payload: RequestDeleteAccountPayload) =>
    apiClient.post<DeleteAccountResponse, RequestDeleteAccountPayload>(
      "/account/delete-request",
      payload
    ),
  cancelDelete: () => apiClient.post<{ cancelled: true }>("/account/delete-request/cancel")
};
