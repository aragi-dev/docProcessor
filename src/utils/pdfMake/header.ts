import { logoUTC } from "@/assets/imgBase64";
import type { Content } from "pdfmake/interfaces";

export const header: Content = {
  table: {
    widths: ['25%', '50%', '25%'],
    body: [
      [
        {
          image: logoUTC,
          width: 90,
          alignment: 'center',
          margin: [0, 5, 0, 5],
          colSpan: 3
        },
        {},
        {}
      ],
      [
        { text: 'Código', alignment: 'center', fontSize: 9 },
        {
          text: 'INSTRUMENTO DE EVALUACIÓN',
          bold: true,
          alignment: 'center',
          fontSize: 11,
          color: '#000080',
          rowSpan: 2,
          margin: [0, 6, 0, 0]
        },
        { text: 'Revisión:', alignment: 'center', fontSize: 9 }
      ],
      [
        { text: 'F-SGC-033', bold: true, alignment: 'center', fontSize: 9 },
        {},
        { text: '00', bold: true, alignment: 'center', fontSize: 9 }
      ]
    ]
  },
  layout: {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => '#1f1f1f',
    vLineColor: () => '#1f1f1f'
  }
};
