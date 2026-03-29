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

export function formatLongDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm");
}

export function formatRelativeHoursFromNow(value?: string | null) {
  if (!value) {
    return "-";
  }

  const diffMs = new Date(value).getTime() - Date.now();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (Math.abs(diffHours) < 1) {
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    if (diffMinutes >= 0) {
      return `em ${diffMinutes} min`;
    }

    return `${Math.abs(diffMinutes)} min atrasado`;
  }

  const roundedHours = Math.round(Math.abs(diffHours));

  if (diffHours >= 0) {
    return `em ${roundedHours}h`;
  }

  return `${roundedHours}h atrasado`;
}

export function formatMinutes(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (hours <= 0) {
    return `${minutes}min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

export function formatDateLabel(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}
