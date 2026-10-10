# Manutenção de conteúdo

[Índice](README.md) · [Páginas](PAGES.md) · [Contribuição](../CONTRIBUTING.md)

Não há CMS nesta versão. Conteúdo é alterado nos arquivos de origem e publicado com um novo build.

## Mapa de edição

| Conteúdo | Local |
| --- | --- |
| Textos gerais e FAQ existente | `src/dictionaries/pt-br.json`, `en.json` e `t()` nas páginas |
| E-mails dos departamentos | Chaves de `contact` nos dois dicionários |
| Recursos e destinos principais | `src/lib/portal.ts` |
| Navegação | `NavBar.tsx`, `Footer.tsx` |
| Passos e conteúdo piloto/ATC | `CareerPage.tsx` |
| Itens de checklist | `FlightChecklist.tsx` |
| Equipe e departamentos | `src/services/staff.ts`; traduções de cargos em `StaffClient.tsx` |
| Eventos | API VATSIM; regras em `services/vatsim.ts` |
| Marca e cores institucionais | `public/logos`, página branding e `BrandPalette.tsx` |
| Metadados e imagem social | Layout e `generateMetadata` das páginas |
| Campos/regras do reporte | `lib/atc-report.ts`, `lib/atc-report-delivery.ts`, `AtcReportForm.tsx` |

## Adicionar um recurso

Inclua um item no retorno de `getResources(lang)` seguindo `Resource`:

```tsx
{
  id: "guia-local",
  title: t(lang, "Guia local", "Local guide"),
  description: t(lang, "Orientações da divisão.", "Division guidance."),
  provider: "VATBRZ",
  category: "atc",
  icon: "book",
  href: "/" + lang + "/atc",
}
```

O exemplo aponta para uma rota existente. Categorias de catálogo: `pilot`, `atc`, `community`; `all` e `favorites` são filtros da UI, não categorias de itens. Use IDs únicos e estáveis, pois os favoritos guardam esses IDs. Links externos devem usar HTTPS.

Verifique título/descrição nos dois idiomas, busca sem acentos, categoria, favoritos e destino. Os destaques de `CareerPage` usam uma seleção de IDs; adicionar ao catálogo não adiciona automaticamente a todos os destaques.

## Atualizar a equipe

`getStaffData()` retorna `StaffDepartment[]`:

```ts
type StaffMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  vacant: boolean;
};
type StaffDepartment = {
  id: string;
  name: string;
  members: StaffMember[];
  subDepartments?: StaffDepartment[];
};
```

Confirme nomes, cargos e autorização de uso das fotos na fonte institucional. Substitua os dados demonstrativos e só então altere `STAFF_DATA_IS_DEMO` para `false`. `vacant` representa vaga; mantenha `photoUrl: null` quando não houver imagem. A UI trata departamentos e um nível de subdepartamentos; não presuma uma árvore de profundidade ilimitada.

As tabelas de tradução em `StaffClient` mapeiam IDs/cargos conhecidos. Atualize-as junto com novos departamentos. Fotos remotas otimizadas precisam de domínio permitido em `next.config.mjs`, ou use assets locais adequados.

## Idiomas e novos textos

Mantenha o sentido equivalente entre PT/EN. Não traduza valores de protocolo como IDs, nomes de propriedades, valores oficiais de avaliação ou caminhos de rota. O rótulo pode mudar; `rating` enviado ao Google deve continuar exatamente em um dos valores oficiais.

Alterações no seletor de idioma devem considerar query strings e rascunhos, que não são preservados pelo mecanismo atual. Não mova um import de `getDictionary` para componentes de cliente.

## Imagens, downloads e marca

Arquivos em `public` são públicos. Use nomes descritivos, dimensões conhecidas e texto alternativo quando a imagem transmite informação. Para elementos decorativos, use `alt=""`. A página Marca oferece seis downloads: três variantes em dois formatos.

Não altere a paleta institucional para resolver contraste da UI: ajuste os tokens de interface. Os SVG/PNG distribuídos devem permanecer coerentes. Confira os direitos de uso antes de adicionar materiais de terceiros; não inclua capturas contendo dados reais de reportes.

## Checklists, eventos e contatos

Checklists possuem quatro itens e guardam índices. Se mudar quantidade/ordem, atualize validação do armazenamento, progresso e migração/limpeza das chaves, para não reaproveitar um índice com outro significado.

Eventos não são cadastrados localmente. Ajustes editoriais devem ser feitos na fonte responsável; o site apenas consulta, filtra e apresenta. Para contatos, mantenha os mesmos destinos corretos nos dois dicionários e confira cada link `mailto:`.

## Criar uma página

Use o [modelo de componentes](COMPONENTS.md), gere metadados por idioma, forneça `main-content` e reutilize layout/títulos. Adicione a rota a esta documentação e aos menus quando fizer sentido. Rode os testes aplicáveis e confira temas, teclado e celular antes do commit.
