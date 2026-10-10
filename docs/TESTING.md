# Testes e verificação

[Índice](README.md) · [Contribuição](../CONTRIBUTING.md) · [Publicação](DEPLOYMENT.md)

## Verificações reproduzíveis

Após `npm ci`, na raiz do projeto:

```sh
npm run lint
node --test tests/atc-report.test.mjs tests/date-time.test.mjs
npm run build
```

Para conferir apenas os tipos: `npx tsc --noEmit`. Não há scripts `npm test` ou `npm run typecheck` no `package.json`; use os comandos acima.

## Suíte automatizada

Os dois arquivos de teste usam `node:test`, `assert`, TypeScript e módulos executados em contexto isolado. Eles não dependem de um servidor Next em execução. Não são testes de DOM ou de navegador.

| Arquivo | Cobertura |
| --- | --- |
| [atc-report.test.mjs](../tests/atc-report.test.mjs) | Limites dos campos, datas, mapeamento de todas as entradas do Google, falsa confirmação em scripts, rejeições HTTP, envio único e falhas externas sem reenvio |
| [date-time.test.mjs](../tests/date-time.test.mjs) | Datas inválidas, anos bissextos, mudança de mês/ano, limites, início da semana e meia-noite em UTC/Brasília |

Há dez casos na suíte atual. O transporte externo do reporte é substituído por mocks; nenhum teste deve criar um registro no Google Forms. Esses testes não comprovam disponibilidade nem gravação real no destino externo.

## Roteiro manual da interface

Execute `npm run dev`, abra `/pt-br` e repita as verificações relevantes em `/en`. Use temas claro/escuro e larguras de 320, 390, 768 e 1440 px. Não há uma suíte Playwright/Cypress versionada nem workflow de CI configurado neste repositório.

| Área | Ação | Resultado esperado |
| --- | --- | --- |
| Navegação | Percorrer páginas, abrir menu móvel, pressionar Esc | Links corretos, menu fecha e foco continua utilizável |
| Idioma | Trocar PT/EN em uma subpágina | Mesmo caminho com outro prefixo |
| Tema | Alternar e recarregar | Preferência preservada |
| Recursos | Buscar com/sem acentos, filtrar e favoritar | Resultados corretos, favorito após recarga, estado vazio claro |
| Retorno do reporte | Voltar aos recursos ATC | Categoria ATC selecionada |
| Checklist | Marcar, recarregar a aba e reiniciar | Progresso preservado na sessão; piloto/ATC independentes |
| Equipe | Buscar cargo, filtrar departamento e limpar | Resultado coerente e identificação de dados demonstrativos |
| Eventos | Trocar Brasília/UTC e expandir briefing | Horário muda, HTML não aparece literalmente, descrição legível |
| Calendário de eventos | Gerar `.ics` e importar em ambiente de teste | Datas UTC, título e descrição corretos |
| Rede | Inspecionar carregamento e indisponibilidade | Traços no erro, possibilidade de tentar novamente |
| Marca | Baixar os seis arquivos e copiar uma cor | SVG/PNG válidos; confirmação ou erro de Clipboard |
| Contato | Conferir destinos dos links | E-mail/departamento correto, sem enviar mensagem durante QA |

## Reporte ATC

Verifique campos obrigatórios, foco no primeiro erro, CIDs fora da faixa, data/hora inválida, atalhos de posição, preenchimento UTC e revisão/edição sem perda de dados. Teste envio com transporte interceptado ou um formulário de testes:

1. Simule uma resposta demorada e clique repetidamente: uma única requisição deve ser disparada.
2. Simule 502/timeout: o relato permanece e nenhuma confirmação de sucesso aparece.
3. Simule `{ "ok": true, "receivedAt": "2026-10-10T18:30:00Z" }`: aparece recibo e ação de criar outro reporte.
4. Crie outro reporte: campos devem reiniciar.

Não use a produção como destino para esse roteiro sem acordo prévio com os responsáveis. Evite capturar reportes reais em screenshots.

## Seletores reutilizáveis

Abra o calendário pelo mouse e por Enter/Espaço/Seta para baixo. Navegue com setas, Home/End e Page Up/Down; confira anos bissextos, troca de ano, Hoje, Limpar e os limites `min`/`max` em um consumidor configurado para isso.

Na hora, teste 00:00 e 23:59, seleção das duas colunas, Agora, Aplicar, Limpar e Esc. A edição não deve alterar o valor confirmado antes de Aplicar ou Enter. Esc descarta a edição temporária. Confira foco, múltiplas instâncias e ausência de IDs duplicados.

Verifique abertura perto das bordas da tela, com rolagem e em celular. O popover não deve ser cortado pelo cartão; Tab deve sair do diálogo não modal, e clique externo deve fechá-lo.

## Acessibilidade e qualidade visual

Confirme um `h1` por página, sequência lógica de títulos, link de salto, foco visível, rótulos dos campos e nomes de botões com ícones. Verifique zoom, contraste, mensagens de erro e preferência de movimento reduzido. Uma passagem visual não equivale a uma certificação de acessibilidade.

## Registros da entrega

Registre no PR os comandos executados e qualquer limitação. Capturas de `docs/images` documentam a aparência, não substituem testes nem comprovam disponibilidade das APIs. Não há relatório de cobertura percentual mantido nesta versão.
