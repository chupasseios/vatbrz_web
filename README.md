# VATBRZ · Portal da divisão brasileira

Portal para a comunidade brasileira da VATSIM: orientação para pilotos e controladores, recursos de voo, eventos, equipe e reporte ATC. Interface em português e inglês, com temas claro e escuro.

![Página inicial do portal VATBRZ](docs/images/inicio.png)

## Começar

Requisitos: Node.js **22.13+ na linha 22 ou 24+** e npm. Esses valores atendem às dependências registradas no lockfile, incluindo a sanitização de HTML.

Na pasta do repositório:

```sh
npm ci
npm run dev
```

Abra [localhost:3000/pt-br](http://localhost:3000/pt-br). A versão em inglês fica em `/en`.

Não há variáveis de ambiente próprias obrigatórias, banco de dados ou credenciais de API para iniciar a versão atual. O build das fontes e as integrações com VATSIM/Google Forms precisam de internet. [Instalação e solução de problemas](docs/DEVELOPMENT.md).

## Funcionalidades

- Nove páginas em cada idioma: Início, Pilotos, ATC, Eventos, Recursos, Reporte ATC, Equipe, Contato e Marca.
- Atalhos para cartas, meteorologia, plano de voo, radar e portal de controle.
- Recursos com busca, filtros e favoritos locais.
- Checklists separados para pilotos e controladores.
- Eventos brasileiros, horários Brasília/UTC, briefing e arquivo de calendário.
- Indicadores regionais da rede com atualização periódica e tratamento de indisponibilidade.
- Reporte ATC com validação, revisão, envio ao Google Forms e confirmação de recebimento.
- Biblioteca reutilizável de seletores de data/hora, navegação por teclado e layout para celular.

## Documentação

| Guia | Conteúdo |
| --- | --- |
| [Índice completo](docs/README.md) | Roteiros de leitura e mapa da documentação |
| [Desenvolvimento](docs/DEVELOPMENT.md) | Instalação, comandos e ambiente local |
| [Arquitetura](docs/ARCHITECTURE.md) | Organização, renderização, idiomas e estado |
| [Páginas e jornadas](docs/PAGES.md) | Rotas, funcionalidades e telas |
| [Design da UI](docs/DESIGN.md) | Cores, tipografia, temas, layout e acessibilidade |
| [Componentes](docs/COMPONENTS.md) | Catálogo, propriedades e exemplos de reutilização |
| [Data e hora](docs/DATE_TIME_PICKERS.md) | API dos seletores, teclado e valores ISO |
| [APIs e integrações](docs/API.md) | Contratos HTTP, cache e mapeamento Google Forms |
| [Conteúdo](docs/CONTENT.md) | Como editar recursos, equipe, textos, links e marca |
| [Dados e segurança](docs/DATA_AND_SECURITY.md) | Fluxos de dados, armazenamento e limites atuais |
| [Testes](docs/TESTING.md) | Suíte automatizada e verificação manual |
| [Publicação](docs/DEPLOYMENT.md) | Build, hospedagem, domínio e entrega |
| [Contribuição](CONTRIBUTING.md) | Fluxo de mudanças, revisão e pull requests |

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento com Webpack |
| `npm run build` | Compilação de produção e verificação de tipos |
| `npm run start` | Servidor de produção após o build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Verificação de tipos sem gerar JavaScript |
| `node --test tests/atc-report.test.mjs tests/date-time.test.mjs` | Testes de reporte, calendário e UTC |

Os scripts usam Webpack por compatibilidade com Windows/OneDrive e a dependência de sanitização. Não existe um script `npm test` nesta versão.

## Estado atual

Os dados da equipe são **demonstrativos**, identificados na interface por `STAFF_DATA_IS_DEMO`. Devem ser substituídos por dados oficiais antes da publicação institucional. A área do membro abre o My VATSIM; este projeto não implementa autenticação própria, painel administrativo privado ou CMS.

O mapa da página inicial é ilustrativo, e a contagem de pilotos é regional e aproximada. As informações destinam-se à simulação de voo.

O endpoint de reporte está habilitado e encaminha dados ao formulário externo configurado. Os testes automatizados simulam as respostas e não criam reportes oficiais. [Detalhes das integrações](docs/API.md).

## Stack

Next.js 16.2.10 · React 19.2.4 · TypeScript 5.9.3 no lockfile · CSS global e CSS Modules · DOMPurify · Node.js.

As versões reproduzíveis estão no [package-lock.json](package-lock.json). Não há Tailwind, biblioteca externa de seletores ou framework de componentes na versão atual.

## Contribuição e identidade

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de propor mudanças. Há modelos de issue e pull request em `.github/`.

Nenhuma licença de distribuição do projeto foi definida em um arquivo `LICENSE`. Logotipos, fotografias e materiais institucionais mantêm seus respectivos direitos; uma política de reutilização deve ser definida pelos responsáveis. O campo `private` do npm evita publicação acidental do pacote e não configura a visibilidade do GitHub.
