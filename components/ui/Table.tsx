import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-700/50">
      <table
        className={cn(
          "w-full min-w-[640px] border-collapse text-left text-sm",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("border-b border-surface-700/50 bg-surface-900/50", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-surface-800", className)} {...props} />;
}

function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-surface-800/50",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-4 font-semibold text-surface-300",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-6 py-4 text-gray-200",
        className
      )}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
