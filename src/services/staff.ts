export const STAFF_DATA_IS_DEMO = true;

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  vacant: boolean;
}

export interface StaffDepartment {
  id: string;
  name: string;
  members: StaffMember[];
  subDepartments?: StaffDepartment[];
}

// Dados demonstrativos de estrutura. Substitua por uma fonte oficial antes de publicar.
// No futuro, você pode substituir o conteúdo
// desta função por um fetch() real para a sua API de Staff.
export async function getStaffData(): Promise<StaffDepartment[]> {
  return [
    {
      id: "diretoria",
      name: "Diretoria",
      members: [
        {
          id: "1",
          role: "Diretor",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "2",
          role: "Vice Diretor",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
      ],
    },
    {
      id: "tecnologia",
      name: "Tecnologia",
      members: [
        {
          id: "3",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "4",
          role: "Vice Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "5",
          role: "Assistente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
      ],
    },
    {
      id: "operacoes",
      name: "Operações",
      members: [
        {
          id: "6",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "7",
          role: "Vice Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "8",
          role: "Assistente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
      ],
    },
    {
      id: "instrucao",
      name: "Departamento de Instrução",
      members: [
        {
          id: "9",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "9b",
          role: "Vice Gerente",
          name: "Vago",
          photoUrl: null,
          vacant: true,
        },
      ],
      subDepartments: [
        {
          id: "instrucao-atc",
          name: "Sub departamento de Instrução ATC",
          members: [
            {
              id: "10",
              role: "Líder",
              name: "Responsável a confirmar",
              photoUrl: null,
              vacant: false,
            },
            {
              id: "11",
              role: "Vice Líder",
              name: "Responsável a confirmar",
              photoUrl: null,
              vacant: false,
            },
            {
              id: "12",
              role: "Examinador",
              name: "Vago",
              photoUrl: null,
              vacant: true,
            },
            {
              id: "13",
              role: "Mentor",
              name: "Vago",
              photoUrl: null,
              vacant: true,
            },
          ],
        },
        {
          id: "instrucao-voo",
          name: "Sub departamento de Instrução de Voo",
          members: [
            {
              id: "14",
              role: "Líder",
              name: "Responsável a confirmar",
              photoUrl: null,
              vacant: false,
            },
            {
              id: "15",
              role: "Vice Líder",
              name: "Responsável a confirmar",
              photoUrl: null,
              vacant: false,
            },
            {
              id: "16",
              role: "Examinador",
              name: "Responsável a confirmar",
              photoUrl: null,
              vacant: false,
            },
            {
              id: "17",
              role: "Mentor",
              name: "Vago",
              photoUrl: null,
              vacant: true,
            },
          ],
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing, Comunicação e Relações Públicas",
      members: [
        {
          id: "18",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "19",
          role: "Vice Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "20",
          role: "Assistente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
      ],
    },
    {
      id: "eventos",
      name: "Eventos",
      members: [
        {
          id: "21",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "22",
          role: "Vice Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "23",
          role: "Assistente",
          name: "Vago",
          photoUrl: null,
          vacant: true,
        },
      ],
    },
    {
      id: "membros",
      name: "Membros e Engajamento",
      members: [
        {
          id: "24",
          role: "Gerente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
        {
          id: "25",
          role: "Vice Gerente",
          name: "Vago",
          photoUrl: null,
          vacant: true,
        },
        {
          id: "26",
          role: "Assistente",
          name: "Responsável a confirmar",
          photoUrl: null,
          vacant: false,
        },
      ],
    },
  ];
}
