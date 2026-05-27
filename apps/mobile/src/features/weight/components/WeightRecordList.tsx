import type { WeightRecordDto } from "@weiqing/shared";
import { StyleSheet, View } from "react-native";
import { Button } from "../../../components/base";
import { EmptyState } from "../../../components/feedback";
import { spacing } from "../../../styles";
import { WeightRecordItem } from "./WeightRecordItem";

interface WeightRecordListProps {
  hasMore: boolean;
  isLoadingMore: boolean;
  onDelete: (record: WeightRecordDto) => void;
  onEdit: (record: WeightRecordDto) => void;
  onLoadMore: () => void;
  records: WeightRecordDto[];
}

export function WeightRecordList({
  hasMore,
  isLoadingMore,
  onDelete,
  onEdit,
  onLoadMore,
  records
}: WeightRecordListProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No records yet"
        description="Your history will appear here after your first check-in."
      />
    );
  }

  return (
    <View style={styles.list}>
      {records.map((record) => (
        <WeightRecordItem key={record.id} onDelete={onDelete} onEdit={onEdit} record={record} />
      ))}
      {hasMore ? (
        <Button disabled={isLoadingMore} onPress={onLoadMore} variant="secondary">
          {isLoadingMore ? "Loading..." : "Load more"}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md
  }
});
