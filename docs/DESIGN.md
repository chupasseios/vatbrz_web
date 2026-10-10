# Portal VATBRZ

[Índice](README.md) · [Catálogo de componentes](COMPONENTS.md) · [Páginas](PAGES.md)

## Direção visual

O portal combina o azul aeronáutico com superfícies claras e um destaque amarelo discreto. A fotografia de simulação, o mapa do Brasil e as referências de frequência dão contexto sem simular instrumentos operacionais.

- Títulos: Barlow Condensed, pesos 500–700.
- Texto e navegação: Manrope.
- Dados e referências: fonte monoespaçada do sistema.
- Tokens de cor, espaçamento e estados: início de src/app/globals.css.
- Tema escuro: o mesmo sistema, com contraste próprio e preferência salva no navegador.

As cores da interface são independentes da paleta institucional disponível na página Marca. Os logotipos originais foram preservados.

## Modelos reutilizáveis

PortalUI.tsx contém PageHeading, SectionHeading, ActionLink e HelpBanner. CareerPage.tsx é o modelo compartilhado de Pilotos e ATC. Para criar uma nova área:

1. Crie uma página dentro de src/app/[lang].
2. Use PageHeading para contexto e caminho de navegação.
3. Organize ações frequentes antes do conteúdo introdutório.
4. Use links reais ou estados vazios explícitos.
5. Inclua textos em português e inglês por meio de t().
6. Teste navegação por teclado, tema escuro e largura de 390 px.

## Funcionalidades

- Recursos: busca sem distinção de acentos, filtros e favoritos em localStorage.
- Preparação de voo/ATC: checklist independente por área, salvo em sessionStorage.
- Staff: pesquisa e filtros por departamento; cargos demonstrativos explicitamente identificados.
- Eventos: consulta à API VATSIM, filtros, UTC/Brasília, briefing sanitizado e arquivo iCalendar.
- Rede: atualização a cada 60 segundos, frequências reais retornadas pela API e tratamento de indisponibilidade.
- Marca: downloads SVG/PNG e cópia dos códigos de cor.
- Reporte ATC: acesso em Recursos → ATC, campos equivalentes ao projeto vatbrz_forms, atalhos de posição, preenchimento de data/hora UTC e revisão dos dados. Disponível em /[lang]/resources/atc-report. Após autorização do responsável, o envio foi habilitado por /api/atc-report para o mesmo Google Forms. O servidor valida os campos, faz uma única requisição e só confirma sucesso ao reconhecer a mensagem de recebimento do formulário. Falhas preservam o rascunho na página, sem reenvio automático. Não há gravação local nem registro dos dados em logs. Validações e mapeamento seguem o formulário oficial verificado em 10/10/2026. Se o Google alterar os campos ou a mensagem de confirmação, atualize src/lib/atc-report-delivery.ts. Testes da integração usam respostas simuladas e não criam reportes oficiais: node --test tests/atc-report.test.mjs.

## Fontes e limites dos dados

src/services/staff.ts ainda é um modelo de dados. Troque a função por uma fonte oficial, preencha nomes, fotos e cargos e altere STAFF_DATA_IS_DEMO para false apenas após validação. Contagens indicam posições, incluindo as não preenchidas; não são apresentadas como número de voluntários.

A área do membro abre My VATSIM. Não há autenticação própria nem painel administrativo privado neste projeto.

Os endereços de departamentos foram mantidos nos dicionários existentes. Os recursos externos são centralizados em src/lib/portal.ts. A identidade visual usa exclusivamente os arquivos disponíveis em public/logos.

O mapa do Brasil é ilustrativo. A contagem de pilotos é regional e aproximada, conforme o filtro geográfico existente, e não substitui um mapa de tráfego.

## Compatibilidade

O projeto usa a convenção proxy.ts do Next.js 16. A configuração está em next.config.mjs. Os comandos padrão usam Webpack para evitar o erro de criação de junctions do Turbopack/jsdom encontrado neste ambiente Windows/OneDrive.

As fontes são hospedadas pelo próprio Next.js após a compilação; o primeiro build precisa de acesso ao Google Fonts. As APIs de rede e eventos também precisam de acesso externo.

## Tokens de interface

Fonte de verdade: [globals.css](../src/app/globals.css). O tema é selecionado por `html[data-theme="dark"]`; o padrão é claro. O sistema não troca automaticamente conforme o tema do sistema operacional.

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--background` | `#f4f7f9` | `#101f2b` | Fundo da página |
| `--surface` | `#ffffff` | `#172a38` | Cartões e painéis |
| `--surface-alt` | `#eaf1f5` | `#1d3445` | Superfícies secundárias |
| `--foreground` | `#152f43` | `#edf3f6` | Texto principal |
| `--muted` | `#586e7e` | `#a7bbc9` | Texto auxiliar |
| `--line` | `#dce5eb` | `#2d4557` | Bordas e divisores |
| `--blue` | `#075da8` | `#70b6ed` | Ações e seleção |
| `--blue-hover` | `#064b88` | `#97c9ef` | Ação em hover |
| `--teal` | `#087c73` | `#76d0bf` | Rótulos e apoio |
| `--navy` | `#0b2c43` | Mesmo valor | Painéis aeronáuticos |
| `--yellow` | `#f4c65b` | Mesmo valor | Destaques |
| `--radius` | `12px` | Mesmo valor | Raio principal |

As famílias são injetadas por `next/font` em `--font-body` e `--font-display`. `--font-mono` usa Cascadia Code, SFMono-Regular ou Consolas. O corpo parte de 14 px; títulos `h1` usam `clamp(45px, 5vw, 66px)` e `h2` usam `clamp(32px, 3.1vw, 43px)`, com ajustes específicos nas seções.

## Layout e responsividade

`.container` tem largura máxima de 1280 px e margens laterais adaptadas por breakpoint. O CSS global possui ajustes em 1180, 1100, 800 e 560 px. O formulário adiciona ajustes em 1100, 850 e 560 px; os seletores têm ajuste em 380 px e cálculo da posição em relação à janela.

O espaçamento é definido nas classes de layout e componentes, com valores recorrentes como 8, 12, 16, 20, 24 e 32 px. Não existe um conjunto de tokens de espaçamento exportado: preserve a escala existente sem inventar uma API de tokens inexistente.

| Classe compartilhada | Função |
| --- | --- |
| `.container`, `.page-body` | Limites e área de conteúdo |
| `.panel` | Superfície com borda |
| `.button`, `.button-secondary` | Ações principal e secundária |
| `.icon-button`, `.text-button` | Ações compactas |
| `.eyebrow`, `.mono`, `.muted`, `.small` | Hierarquia de texto |
| `.section-heading`, `.page-heading` | Cabeçalhos padronizados |
| `.filter-row`, `.search-input`, `.empty-state` | Busca, filtros e ausência de resultados |
| `.sr-only`, `.skip-link` | Apoio à acessibilidade |

Use CSS Modules para comportamentos/estilos isolados, como o reporte e os seletores. Mantenha padrões de todo o portal no CSS global. Não duplique um calendário ou botão visualmente equivalente dentro de uma página.

## Estados e movimento

Interações devem distinguir padrão, foco, hover, seleção, desabilitado, carregamento, erro e sucesso. A seleção de filtros usa `aria-pressed`; feedback de operações usa `role="status"` ou `role="alert"` conforme o caso. Erros devem explicar o próximo passo e preservar dados quando possível.

O easing compartilhado é `cubic-bezier(0.23, 1, 0.32, 1)`. O CSS global reduz animações e rolagem suave com `prefers-reduced-motion`. Os seletores abrem sem animação de entrada: o foco e a resposta ao teclado são imediatos.

## Acessibilidade

Preserve o link de salto, um `h1` por página, títulos hierárquicos, rótulos associados a campos e foco visível. Ícones decorativos são ocultos da árvore acessível; botões sem texto precisam de nome acessível.

Os seletores expõem combobox e diálogo não modal. O calendário usa grid, e as colunas de hora usam listbox. O painel fecha por Esc/clique externo e devolve foco quando apropriado. Não há uma certificação de conformidade ou suíte automatizada completa de acessibilidade; use o [roteiro de testes](TESTING.md) para novas alterações.

## Identidade institucional

`BrandPalette` apresenta `#050A2D`, `#010EDB`, `#0054DB`, `#0DDB6E` e `#FEDF00`. Esses valores representam os materiais da marca; não substitua automaticamente os tokens de contraste da UI por eles. Preserve os arquivos originais de `public/logos` e valide legibilidade em ambos os temas.
