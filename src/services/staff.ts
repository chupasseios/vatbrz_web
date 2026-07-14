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

// Emulação de chamada de API. No futuro, você pode substituir o conteúdo
// desta função por um fetch() real para a sua API de Staff.
export async function getStaffData(): Promise<StaffDepartment[]> {
  return [
    {
      id: "diretoria",
      name: "Diretoria",
      members: [
        { id: "1", role: "Diretor", name: "Filipe Fonseca", photoUrl: null, vacant: false },
        { id: "2", role: "Vice Diretor", name: "Rafel Castelo", photoUrl: null, vacant: false },
      ]
    },
    {
      id: "tecnologia",
      name: "Tecnologia",
      members: [
        { id: "3", role: "Gerente", name: "Kiwi Ferreira", photoUrl: null, vacant: false },
        { id: "4", role: "Vice Gerente", name: "Velho Arrombado", photoUrl: null, vacant: false },
        { id: "5", role: "Assistente", name: "São Bernardo Dos Santos", photoUrl: null, vacant: false },
      ]
    },
    {
      id: "operacoes",
      name: "Operações",
      members: [
        { id: "6", role: "Gerente", name: "Filipe Fonseca", photoUrl: null, vacant: false },
        { id: "7", role: "Vice Gerente", name: "Lucas Campos", photoUrl: null, vacant: false },
        { id: "8", role: "Assistente", name: "Lambari de botas", photoUrl: null, vacant: false },
      ]
    },
    {
      id: "instrucao",
      name: "Departamento de Instrução",
      members: [
        { id: "9", role: "Gerente", name: "Prieto Camargo", photoUrl: null, vacant: false },
        { id: "9b", role: "Vice Gerente", name: "Vago", photoUrl: null, vacant: true },
      ],
      subDepartments: [
        {
          id: "instrucao-atc",
          name: "Sub departamento de Instrução ATC",
          members: [
            { id: "10", role: "Líder", name: "Sérgio Luiz", photoUrl: null, vacant: false },
            { id: "11", role: "Vice Líder", name: "Suzuki", photoUrl: null, vacant: false },
            { id: "12", role: "Examinador", name: "Vago", photoUrl: null, vacant: true },
            { id: "13", role: "Mentor", name: "Vago", photoUrl: null, vacant: true },
          ]
        },
        {
          id: "instrucao-voo",
          name: "Sub departamento de Instrução de Voo",
          members: [
            { id: "14", role: "Líder", name: "Vitinho painel 2D", photoUrl: null, vacant: false },
            { id: "15", role: "Vice Líder", name: "Ruy Monteiro", photoUrl: null, vacant: false },
            { id: "16", role: "Examinador", name: "Nagol", photoUrl: null, vacant: false },
            { id: "17", role: "Mentor", name: "Vago", photoUrl: null, vacant: true },
          ]
        }
      ]
    },
    {
      id: "marketing",
      name: "Marketing, Comunicação e Relações Públicas",
      members: [
        { id: "18", role: "Gerente", name: "Lucas Germano", photoUrl: null, vacant: false },
        { id: "19", role: "Vice Gerente", name: "Lucas Martins", photoUrl: null, vacant: false },
        { id: "20", role: "Assistente", name: "Gordela", photoUrl: null, vacant: false },
      ]
    },
    {
      id: "eventos",
      name: "Eventos",
      members: [
        { id: "21", role: "Gerente", name: "Reginaldo deixa comigo", photoUrl: null, vacant: false },
        { id: "22", role: "Vice Gerente", name: "Carlos Bandeira", photoUrl: null, vacant: false },
        { id: "23", role: "Assistente", name: "Vago", photoUrl: null, vacant: true },
      ]
    },
    {
      id: "membros",
      name: "Membros e Engajamento",
      members: [
        { id: "24", role: "Gerente", name: "Flavio Perna do vento", photoUrl: null, vacant: false },
        { id: "25", role: "Vice Gerente", name: "Vago", photoUrl: null, vacant: true },
        { id: "26", role: "Assistente", name: "Guilherme", photoUrl: null, vacant: false },
      ]
    }
  ];
}
