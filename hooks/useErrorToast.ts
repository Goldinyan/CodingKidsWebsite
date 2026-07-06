import { useToast } from "@/components/ui/use-toast";

export interface ErrorToastConfig {
  title?: string;
  description?: string;
  showDetails?: boolean;
}

const ERROR_MESSAGES = {
  RATE_LIMIT: {
    title: "Rate-Limit überschritten",
    description:
      "Zu viele Anfragen. Bitte warte ein paar Sekunden und versuche es erneut.",
  },
  NETWORK_ERROR: {
    title: "Netzwerkfehler",
    description:
      "Die Verbindung zum Server ist fehlgeschlagen. Überprüfe deine Internetverbindung.",
  },
  FETCH_ERROR: {
    title: "Fehler beim Laden der Daten",
    description:
      "Es ist ein Fehler beim Laden der Daten aufgetreten. Bitte versuche es später erneut.",
  },
  DELETE_ERROR: {
    title: "Fehler beim Löschen",
    description: "Das Element konnte nicht gelöscht werden.",
  },
  UPDATE_ERROR: {
    title: "Fehler beim Aktualisieren",
    description: "Das Element konnte nicht aktualisiert werden.",
  },
  GENERIC_ERROR: {
    title: "Ein Fehler ist aufgetreten",
    description: "Bitte versuche es später erneut.",
  },
};

export function useErrorToast() {
  const { toast } = useToast();

  const isRateLimitError = (error: unknown): boolean => {
    if (error instanceof Error) {
      return (
        error.message.includes("429") ||
        error.message.includes("rate limit") ||
        error.message.includes("zu viele")
      );
    }
    const errorString = String(error);
    return (
      errorString.includes("429") ||
      errorString.includes("rate limit") ||
      errorString.includes("zu viele")
    );
  };

  const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error) {
      return (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("ECONNREFUSED")
      );
    }
    return String(error).includes("fetch") || String(error).includes("network");
  };

  const showErrorToast = (
    error: unknown,
    type: keyof typeof ERROR_MESSAGES = "GENERIC_ERROR",
    customConfig?: ErrorToastConfig,
  ) => {
    // Auto-detect error type
    if (isRateLimitError(error)) {
      type = "RATE_LIMIT";
    } else if (isNetworkError(error)) {
      type = "NETWORK_ERROR";
    }

    const defaultMessage = ERROR_MESSAGES[type];
    const config = customConfig || {};

    toast({
      variant: "failed",
      title: config.title || defaultMessage.title,
      description: config.description || defaultMessage.description,
    });

    // Log the actual error for debugging
    // console.error(`[${type}]`, error);
  };

  return {
    showErrorToast,
    showFetchError: (error: unknown, customConfig?: ErrorToastConfig) =>
      showErrorToast(error, "FETCH_ERROR", customConfig),
    showRateLimitError: (customConfig?: ErrorToastConfig) =>
      showErrorToast(null, "RATE_LIMIT", customConfig),
    showNetworkError: (customConfig?: ErrorToastConfig) =>
      showErrorToast(null, "NETWORK_ERROR", customConfig),
    showDeleteError: (customConfig?: ErrorToastConfig) =>
      showErrorToast(null, "DELETE_ERROR", customConfig),
    showUpdateError: (customConfig?: ErrorToastConfig) =>
      showErrorToast(null, "UPDATE_ERROR", customConfig),
  };
}
