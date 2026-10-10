# Publicação e operação

[Índice](README.md) · [Desenvolvimento](DEVELOPMENT.md) · [Dados e segurança](DATA_AND_SECURITY.md)

## Requisitos da hospedagem

O portal precisa de um ambiente capaz de executar Next.js com rotas de servidor. Não é um site exportado somente como HTML: `/api/atc-report`, `/api/live-stats`, consultas de eventos e o proxy de idiomas dependem do runtime.

GitHub hospeda o repositório e a documentação. GitHub Pages, por si só, não executa este backend. Use uma hospedagem compatível com Next.js ou um servidor Node configurado pela equipe. Nenhum provedor ou pipeline de deploy está provisionado no código atual.

| Configuração | Valor |
| --- | --- |
| Runtime | Node.js compatível com o lockfile: linha 22 a partir de 22.13, ou 24+ |
| Instalação | `npm ci` |
| Build | `npm run build` |
| Inicialização em servidor Node | `npm run start` |
| Diretório de build | `.next` |
| Variáveis próprias obrigatórias | Nenhuma atualmente |

O projeto não habilita `output: "standalone"`. Para publicação em Node tradicional, mantenha as dependências necessárias, `.next`, `public` e a configuração do aplicativo no ambiente de execução. Plataformas integradas podem gerenciar esse empacotamento.

## Rede e domínio

Durante a compilação, permita os downloads usados por `next/font/google`. Em execução, o servidor precisa acessar `my.vatsim.net`, `data.vatsim.net` e `docs.google.com`. O navegador também carrega banners de eventos e abre os destinos externos de recursos.

Configure HTTPS no domínio público. Revise `metadataBase` em `src/app/[lang]/layout.tsx`, atualmente `https://vatbrz.net`. A configuração não cria DNS, certificado ou domínio. Revise metadados por idioma e a necessidade de sitemap/robots/canonical, ainda não implementados especificamente.

## Antes da publicação institucional

- Preencher os dados oficiais da equipe e revisar `STAFF_DATA_IS_DEMO`.
- Conferir e-mails, links sociais, logotipos e recursos externos.
- Validar o destino do reporte, acesso dos responsáveis às respostas e procedimentos de atendimento.
- Conferir imagens/arquivos públicos, incluindo arquivos legados em `public/assets`.
- Executar [testes](TESTING.md) e verificar mobile, idiomas, temas e estados de falha.
- Confirmar build e inicialização no ambiente de destino.
- Definir, com os responsáveis, políticas institucionais e controles operacionais ainda ausentes no código.

## Preparar para o GitHub

Confira `git status` e revise o diff. Versione documentação, código, testes e assets necessários à mesma versão; um guia que referencia um componente novo exige que esse componente também esteja incluído no envio.

Não versione `.next`, `node_modules`, arquivos de ambiente, caches, reportes ou capturas com dados pessoais. Use os modelos de [contribuição](../CONTRIBUTING.md) e PR. A documentação usa links e imagens relativos, sem depender da pasta local de quem a produziu.

O push do repositório e a publicação do site são ações diferentes. Um push só causa deploy automático se a equipe configurar essa integração. Este guia não configura automações nem publica alterações.

## Depois do deploy

1. Abra `/`, `/pt-br` e `/en`; confirme redirecionamento e navegação.
2. Verifique as nove páginas, arquivos de marca e fontes.
3. Confira status HTTP e comportamento de `/api/live-stats` e `/api/events`.
4. Confira o formulário até a revisão. Qualquer teste de envio real deve ser acordado e identificável para os responsáveis.
5. Inspecione logs de erros sem registrar corpos de reportes.

O cache regional em memória é por instância; os cabeçalhos HTTP dependem do provedor. Não trate a ausência de um erro no log como comprovação de entrega de um reporte.

## Rollback e incidentes

Guarde a referência da versão publicada e utilize o mecanismo de rollback do provedor ou faça novo build da revisão anterior. Como os reportes são externos, um rollback não remove respostas já registradas no Google Forms.

Se a integração de reporte ficar instável, suspenda temporariamente o envio na interface/rota de forma explícita, investigue mapeamento e confirmação e evite reenvios em lote. Para incidentes de rede ou fontes, consulte [desenvolvimento](DEVELOPMENT.md) e [contratos de API](API.md).
