import { format } from "date-fns";

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return format(new Date(value), "dd/MM/yyyy");
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

