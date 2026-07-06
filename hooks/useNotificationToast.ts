import { useToast } from "@/components/ui/use-toast";

export interface ToastConfig {
  title?: string;
  description?: string;
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

const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: {
    title: "Erfolgreich gespeichert",
    description: "Die Daten wurden erfolgreich gesichert.",
  },
  DELETE_SUCCESS: {
    title: "Erfolgreich gelöscht",
    description: "Das Element wurde permanent entfernt.",
  },
  UPDATE_SUCCESS: {
    title: "Erfolgreich aktualisiert",
    description: "Die Änderungen wurden sauber übernommen.",
  },
  GENERIC_SUCCESS: {
    title: "Aktion erfolgreich",
    description: "Der Vorgang wurde erfolgreich abgeschlossen.",
  },
};

const INFO_MESSAGES = {
  SESSION_EXPIRED: {
    title: "Sitzung abgelaufen",
    description: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
  },
  MAINTENANCE: {
    title: "Wartungsarbeiten",
    description:
      "Das System wird derzeit optimiert. Es kann zu Verzögerungen kommen.",
  },
  GENERIC_INFO: {
    title: "Information",
    description: "Es gibt eine neue Benachrichtigung für dich.",
  },
};

export function useNotificationToast() {
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
    customConfig?: ToastConfig,
  ) => {
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
  };

  const showSuccessToast = (
    type: keyof typeof SUCCESS_MESSAGES = "GENERIC_SUCCESS",
    customConfig?: ToastConfig,
  ) => {
    const defaultMessage = SUCCESS_MESSAGES[type];
    const config = customConfig || {};

    toast({
      variant: "success",
      title: config.title || defaultMessage.title,
      description: config.description || defaultMessage.description,
    });
  };

  const showInfoToast = (
    type: keyof typeof INFO_MESSAGES = "GENERIC_INFO",
    customConfig?: ToastConfig,
  ) => {
    const defaultMessage = INFO_MESSAGES[type];
    const config = customConfig || {};

    toast({
      variant: "info",
      title: config.title || defaultMessage.title,
      description: config.description || defaultMessage.description,
    });
  };

  return {
    showErrorToast,
    showSuccessToast,
    showInfoToast,

    // Error Shortcuts
    showFetchError: (error: unknown, customConfig?: ToastConfig) =>
      showErrorToast(error, "FETCH_ERROR", customConfig),
    showRateLimitError: (customConfig?: ToastConfig) =>
      showErrorToast(null, "RATE_LIMIT", customConfig),
    showNetworkError: (customConfig?: ToastConfig) =>
      showErrorToast(null, "NETWORK_ERROR", customConfig),
    showDeleteError: (customConfig?: ToastConfig) =>
      showErrorToast(null, "DELETE_ERROR", customConfig),
    showUpdateError: (customConfig?: ToastConfig) =>
      showErrorToast(null, "UPDATE_ERROR", customConfig),

    // Success Shortcuts
    showSaveSuccess: (customConfig?: ToastConfig) =>
      showSuccessToast("SAVE_SUCCESS", customConfig),
    showDeleteSuccess: (customConfig?: ToastConfig) =>
      showSuccessToast("DELETE_SUCCESS", customConfig),
    showUpdateSuccess: (customConfig?: ToastConfig) =>
      showSuccessToast("UPDATE_SUCCESS", customConfig),

    // Info Shortcuts
    showSessionExpired: (customConfig?: ToastConfig) =>
      showInfoToast("SESSION_EXPIRED", customConfig),
    showMaintenanceInfo: (customConfig?: ToastConfig) =>
      showInfoToast("MAINTENANCE", customConfig),
  };
}
