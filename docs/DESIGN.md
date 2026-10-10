# Portal VATBRZ

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
