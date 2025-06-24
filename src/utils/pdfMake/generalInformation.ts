import type { GeneralInformation } from "@/interfaces/GeneralInformation";
import type { Content } from "pdfmake/interfaces";

export const generaInformation = (form: GeneralInformation): Content[] => [
  {
    text: 'DATOS GENERALES DEL INSTRUMENTO.',
    margin: [0, 30, 0, 8],
    alignment: 'center',
    color: '#1f497d',
    bold: true
  },
  {
    columns: [
      { width: '16%', text: 'División:', margin: [0, 0, 0, 5], fontSize: 10 },
      {
        width: '84%',
        stack: [
          { text: form.division, bold: true, fontSize: 10 },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 432, y2: 0,
                lineWidth: 0.2
              }
            ],
          }
        ]
      }
    ]
  },
  {
    columns: [
      { width: '16%', text: 'FDC*/Carrera:', margin: [0, 0, 0, 5], fontSize: 10 },
      {
        width: '84%',
        stack: [
          { text: form.race, bold: true, fontSize: 10 },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 432, y2: 0,
                lineWidth: 0.2
              }
            ],
          }
        ]
      }
    ]
  },
  {
    columns: [
      { width: '16%', text: 'Asignatura:', margin: [0, 0, 0, 5], fontSize: 10 },
      {
        width: '84%',
        stack: [
          { text: form.subject, bold: true, fontSize: 10 },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 432, y2: 0,
                lineWidth: 0.2
              }
            ],
          }
        ]
      }
    ]
  },
  {
    columns: [
      {
        width: '65%',
        columns: [
          { width: '24.5%', text: 'Cuat.-Gpo(s):', fontSize: 10 },
          {
            width: '76.5%',
            stack: [
              { text: form.grup, bold: true, fontSize: 10 },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 228, y2: 0,
                    lineWidth: 0.2
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        width: '35%',
        columns: [
          { width: '60%', text: 'Fecha de aplicación:', margin: [-15, 0, 0, 0], fontSize: 10 },
          {
            width: '40%', margin: [-25, 0, 0, 0],
            stack: [
              { text: form.date, bold: true, fontSize: 10 },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 96, y2: 0,
                    lineWidth: 0.2
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    text: 'Unidad(es) de aprendizaje y/o tema(s) a evaluar.',
    margin: [0, 6, 1, 0],
    fontSize: 10
  },
  {
    table: {
      widths: ['100%'],
      body: [
        [
          {
            text: 'Unidad 1: Introducción a los modelos de negocios.',
            fontSize: 10,
            margin: [5, 5, 5, 5]
          }
        ]
      ]
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#000000',
      vLineColor: () => '#000000'
    },
    margin: [0, 6, 1, 0]
  },
  {
    columns: [
      { width: '30%', text: 'Profesor(es) de la asignatura:', margin: [0, 5, 0, 4], fontSize: 10 },
      {
        width: '70%',
        margin: [0, 5, 0, 4],
        stack: [
          { text: form.professor, bold: true, fontSize: 10 },
          {
            canvas: [
              {
                type: 'line',
                x1: 0, y1: 0,
                x2: 360, y2: 0,
                lineWidth: 0.2
              }
            ],
          }
        ]
      }
    ]
  },
  {
    columns: [
      {
        width: '70%',
        margin: [0, 0, 0, 5],
        columns: [
          { width: '28%', text: 'Nombre del alumno:', fontSize: 10 },
          {
            width: '72%',
            margin: [0, 11, 0, 0],
            stack: [
              { text: '', bold: true, fontSize: 10 },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 228, y2: 0,
                    lineWidth: 0.2
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        width: '30%',
        margin: [0, 0, 0, 5],
        columns: [
          { width: '60%', text: 'Calificación (puntaje):', margin: [-25, 0, 0, 0], fontSize: 10 },
          {
            width: '40%', margin: [-18, 11, 0, 0],
            stack: [
              { text: '', bold: true, fontSize: 10 },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 79, y2: 0,
                    lineWidth: 0.2
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
];
