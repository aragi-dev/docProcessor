import JSZip from "jszip"
import { XMLParser } from "fast-xml-parser"


export async function getInfo(file: File) {
    const result: any = {};
    // Leer el archivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Descomprimir el docx
    const zip = await JSZip.loadAsync(arrayBuffer);
    // Leer el documento principal XML
    const documentXml = await zip.file("word/document.xml")?.async("string");
    if (!documentXml) {
        throw new Error("No se pudo encontrar document.xml en el archivo docx");
    }
    // Parsear el XML
    const parser = new XMLParser({ ignoreAttributes: false });
    const doc = parser.parse(documentXml);

    // Extraer texto plano y estructura básica
    const lines: string[] = [];

    // Extrae texto de un nodo w:r (run)
    const extractTextFromRun = (r: any) => {
        if (!r) return '';
        if (typeof r["w:t"] === "string") return r["w:t"];
        if (Array.isArray(r["w:t"])) return r["w:t"].join('');
        return '';
    };

    // Extrae texto de un párrafo w:p
    const extractParagraph = (p: any) => {
        if (!p) return;
        const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
        const text = runs.map(extractTextFromRun).join('');
        if (text.trim()) lines.push(text);
    };

    // Extrae texto de una tabla w:tbl
    const extractTable = (tbl: any) => {
        if (!tbl) return;
        const rows = Array.isArray(tbl["w:tr"]) ? tbl["w:tr"] : [tbl["w:tr"]];
        rows.forEach((tr: any) => {
            if (!tr) return;
            const cells = Array.isArray(tr["w:tc"]) ? tr["w:tc"] : [tr["w:tc"]];
            const rowText = cells.map((tc: any) => {
                if (!tc) return '';
                // Cada celda puede tener varios párrafos
                const cellPs = Array.isArray(tc["w:p"]) ? tc["w:p"] : [tc["w:p"]];
                return cellPs.map((p: any) => {
                    const runs = Array.isArray(p["w:r"]) ? p["w:r"] : [p["w:r"]];
                    return runs.map(extractTextFromRun).join('');
                }).join(' ');
            });
            lines.push(rowText.join('\t'));
        });
        // Línea vacía después de cada tabla
        lines.push('');
    };

    // Procesa el body del documento
    const processBody = (body: any) => {
        if (!body) return;
        // Mezcla de w:p (párrafos) y w:tbl (tablas)
        const elements = [];
        if (Array.isArray(body["w:p"])) elements.push(...body["w:p"]);
        else if (body["w:p"]) elements.push(body["w:p"]);
        if (Array.isArray(body["w:tbl"])) elements.push(...body["w:tbl"]);
        else if (body["w:tbl"]) elements.push(body["w:tbl"]);
        // También puede venir como array de objetos
        Object.entries(body).forEach(([key, value]) => {
            if (key === "w:p") {
                if (Array.isArray(value)) value.forEach(extractParagraph);
                else extractParagraph(value);
            } else if (key === "w:tbl") {
                if (Array.isArray(value)) value.forEach(extractTable);
                else extractTable(value);
            }
        });
    };

    // Buscar los párrafos y tablas en el XML
    if (doc["w:document"] && doc["w:document"]["w:body"]) {
        processBody(doc["w:document"]["w:body"]);
    }

    // Retornar como JSON
    return JSON.stringify({
        text: lines.join("\n"),
        lines,
        raw: doc,
    });
}

