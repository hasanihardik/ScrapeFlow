import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-600 animate-pulse",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};
const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <div className={cn("w-2 h-2 rounded-full  ", indicatorColors[status])} />
  );
};
const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-600 animate-pulse",
  FAILED: "text-red-400",
  COMPLETED: "text-emerald-600",
};
export const ExecutionStatusLable = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
};
export default ExecutionStatusIndicator;
