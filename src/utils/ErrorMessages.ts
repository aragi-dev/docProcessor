interface ErrorMessage {
  message: string;
}

export const ErrorMessagesMap: Record<number, ErrorMessage> = {
  401: { message: "Código inválido. Verifica tu código de acceso." },
  404: { message: "Informacion Invalida." },
  500: { message: "Error interno del servidor." },
};