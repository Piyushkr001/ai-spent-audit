"use client";

import { Trash, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOLS } from "@/lib/audit/pricing";
import type { ToolRow, ToolId, ToolPlan } from "@/lib/audit/types";
import type { CurrencyConfig } from "@/lib/audit/currency";
import { cn } from "@/lib/utils";

interface Props {
  row: ToolRow;
  index: number;
  canRemove: boolean;
  currency: CurrencyConfig;
  onChange: (updated: ToolRow) => void;
  onRemove: () => void;
}

export function ToolSpendRow({ row, index, canRemove, currency, onChange, onRemove }: Props) {
  const toolMeta = TOOLS.find((t) => t.id === row.toolId);

  function handleToolChange(toolId: string | null) {
    if (!toolId) return;
    onChange({
      ...row,
      toolId: toolId as ToolId,
      plan: "",
    });
  }

  function handlePlanChange(plan: string | null) {
    if (!plan) return;
    onChange({ ...row, plan: plan as ToolPlan });
  }

  function handleSeatsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    onChange({ ...row, seats: isNaN(val) || val < 1 ? 1 : val });
  }

  function handleSpendChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    onChange({ ...row, monthlySpend: isNaN(val) || val < 0 ? 0 : val });
  }

  // Clamp symbol width: short symbols ($ £ €) get a tight prefix, longer ones (CA$ HK$) get more room
  const symbolWidth = currency.symbol.length > 2 ? "w-9 text-[10px]" : "w-5";

  return (
    <div
      className={cn(
        "group relative grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200",
        "sm:grid-cols-[1fr_1fr_120px_130px_auto]",
        "hover:border-blue-500/40 hover:shadow-sm hover:shadow-blue-500/10"
      )}
    >
      {/* Row number badge */}
      <span className="absolute -top-2.5 left-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
        {index + 1}
      </span>

      {/* Tool selector */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          AI Tool
        </label>
        <Select value={row.toolId} onValueChange={handleToolChange}>
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder="Select tool…" />
          </SelectTrigger>
          <SelectContent>
            {TOOLS.map((tool) => (
              <SelectItem key={tool.id} value={tool.id}>
                {tool.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan selector */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Plan
        </label>
        <Select
          value={row.plan}
          onValueChange={handlePlanChange}
          disabled={!row.toolId}
        >
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder={row.toolId ? "Select plan…" : "Pick tool first"} />
          </SelectTrigger>
          <SelectContent>
            {toolMeta?.plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seats */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Seats
        </label>
        <Input
          type="number"
          min={1}
          max={9999}
          value={row.seats}
          onChange={handleSeatsChange}
          className="h-9 text-xs"
          placeholder="1"
        />
      </div>

      {/* Monthly spend */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {currency.code}/Month
        </label>
        <div className="relative">
          <span
            className={cn(
              "pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground leading-none",
              symbolWidth
            )}
          >
            {currency.symbol}
          </span>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={row.monthlySpend || ""}
            onChange={handleSpendChange}
            className={cn("h-9 text-xs", currency.symbol.length > 2 ? "pl-10" : "pl-6")}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Remove button */}
      <div className="flex items-end justify-end sm:justify-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove tool row ${index + 1}`}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
        >
          <Trash size={15} />
        </Button>
      </div>
    </div>
  );
}

// ─── Add Row Button ────────────────────────────────────────────────────────────
interface AddRowButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddRowButton({ onClick, disabled }: AddRowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-blue-500/60 hover:bg-blue-50/50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Plus size={14} weight="bold" />
      Add another tool
    </button>
  );
}
