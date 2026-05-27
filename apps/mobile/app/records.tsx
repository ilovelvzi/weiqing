import type { WeightRecordDto } from "@weiqing/shared";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "../src/components/base";
import { EmptyState, ErrorView, Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import {
  DeleteConfirmModal,
  MonthCalendar,
  RecordEditModal,
  RecordsHeader,
  WeightRecordList
} from "../src/features/weight/components";
import {
  useCalendarWeightRecordsQuery,
  useDeleteWeightRecordMutation,
  useUpdateWeightRecordMutation,
  useWeightRecordsQuery
} from "../src/features/weight/weight.hooks";
import { useRecordsStore } from "../src/stores";
import { spacing } from "../src/styles";

export default function RecordsRoute() {
  const viewMode = useRecordsStore((state) => state.viewMode);
  const selectedRecordId = useRecordsStore((state) => state.selectedRecordId);
  const isEditModalOpen = useRecordsStore((state) => state.isEditModalOpen);
  const isDeleteModalOpen = useRecordsStore((state) => state.isDeleteModalOpen);
  const selectedYear = useRecordsStore((state) => state.selectedYear);
  const selectedMonth = useRecordsStore((state) => state.selectedMonth);
  const setViewMode = useRecordsStore((state) => state.setViewMode);
  const openEditModal = useRecordsStore((state) => state.openEditModal);
  const closeEditModal = useRecordsStore((state) => state.closeEditModal);
  const openDeleteModal = useRecordsStore((state) => state.openDeleteModal);
  const closeDeleteModal = useRecordsStore((state) => state.closeDeleteModal);
  const setSelectedMonth = useRecordsStore((state) => state.setSelectedMonth);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<WeightRecordDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recordsQuery = useWeightRecordsQuery({ page, pageSize: 20 });
  const calendarQuery = useCalendarWeightRecordsQuery(selectedYear, selectedMonth);
  const updateMutation = useUpdateWeightRecordMutation();
  const deleteMutation = useDeleteWeightRecordMutation();

  useEffect(() => {
    const response = recordsQuery.data;

    if (!response) {
      return;
    }

    setRecords((current) => {
      if (response.page === 1) {
        return response.items;
      }

      const knownIds = new Set(current.map((record) => record.id));
      const nextItems = response.items.filter((record) => !knownIds.has(record.id));

      return [...current, ...nextItems];
    });
  }, [recordsQuery.data]);

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) ?? null,
    [records, selectedRecordId]
  );
  const hasMore = Boolean(recordsQuery.data && recordsQuery.data.page < recordsQuery.data.totalPages);

  function handleRefreshList() {
    setPage(1);
    setRecords([]);
    void recordsQuery.refetch();
  }

  function handleChangeMonth(delta: number) {
    const next = new Date(selectedYear, selectedMonth - 1 + delta, 1);
    setSelectedMonth(next.getFullYear(), next.getMonth() + 1);
  }

  async function handleUpdateRecord(payload: {
    weightKg: number;
    mood?: WeightRecordDto["mood"];
    note?: string | null;
  }) {
    if (!selectedRecord) {
      return;
    }

    setError(null);

    try {
      await updateMutation.mutateAsync({ id: selectedRecord.id, payload });
      closeEditModal();
      handleRefreshList();
    } catch (updateError) {
      setError(getErrorMessage(updateError, "Could not update this record."));
    }
  }

  async function handleDeleteRecord() {
    if (!selectedRecord) {
      return;
    }

    setError(null);

    try {
      await deleteMutation.mutateAsync(selectedRecord.id);
      setRecords((current) => current.filter((record) => record.id !== selectedRecord.id));
      closeDeleteModal();
      handleRefreshList();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Could not delete this record."));
    }
  }

  return (
    <PageShell title="Records" description="Your history, kept light and readable.">
      <RecordsHeader onChangeViewMode={setViewMode} viewMode={viewMode} />

      {error ? <ErrorView message={error} /> : null}

      {viewMode === "list" ? (
        <View style={styles.section}>
          {recordsQuery.isPending && records.length === 0 ? <Loading label="Loading records" /> : null}

          {recordsQuery.isError ? (
            <View style={styles.section}>
              <ErrorView message="Could not load records." />
              <Button onPress={handleRefreshList} variant="secondary">Try again</Button>
            </View>
          ) : null}

          {!recordsQuery.isPending && !recordsQuery.isError ? (
            <WeightRecordList
              hasMore={hasMore}
              isLoadingMore={recordsQuery.isFetching && page > 1}
              onDelete={(record) => openDeleteModal(record.id)}
              onEdit={(record) => openEditModal(record.id)}
              onLoadMore={() => setPage((current) => current + 1)}
              records={records}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.section}>
          {calendarQuery.isPending ? <Loading label="Loading calendar" /> : null}
          {calendarQuery.isError ? (
            <View style={styles.section}>
              <ErrorView message="Could not load this month." />
              <Button onPress={() => void calendarQuery.refetch()} variant="secondary">Try again</Button>
            </View>
          ) : null}
          {calendarQuery.data ? (
            <MonthCalendar
              month={selectedMonth}
              onNextMonth={() => handleChangeMonth(1)}
              onPreviousMonth={() => handleChangeMonth(-1)}
              records={calendarQuery.data.records}
              year={selectedYear}
            />
          ) : null}
          {calendarQuery.data && calendarQuery.data.records.length === 0 ? (
            <EmptyState
              title="No records this month"
              description="Switch months or add a new check-in when you are ready."
            />
          ) : null}
        </View>
      )}

      <RecordEditModal
        isPending={updateMutation.isPending}
        onClose={closeEditModal}
        onSubmit={handleUpdateRecord}
        record={selectedRecord}
        visible={isEditModalOpen}
      />

      <DeleteConfirmModal
        isPending={deleteMutation.isPending}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteRecord}
        record={selectedRecord}
        visible={isDeleteModalOpen}
      />
    </PageShell>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md
  }
});
