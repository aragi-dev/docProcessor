import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { header } from "./header";
import { generaInformation } from "./generalInformation";
import { contentEvaluation } from "./contentEvaluation";

export const document: TDocumentDefinitions = {
  content: [
    header,
    generaInformation,
    contentEvaluation
  ],
};