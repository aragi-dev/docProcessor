interface ErrorMessage {
  message: string;
}

export const ErrorMessagesMap: Record<number, ErrorMessage> = {
  401: { message: "Código inválido. Verifica tu código de acceso." },
  404: { message: "Servicio no disponible. Intenta más tarde." },
  500: { message: "Error interno del servidor." },
};