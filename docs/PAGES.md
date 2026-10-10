# Páginas e jornadas

[Índice](README.md) · [Componentes](COMPONENTS.md) · [Conteúdo](CONTENT.md)

## Mapa de rotas

Substitua `{lang}` por `pt-br` ou `en`. Os nomes das rotas permanecem iguais nos dois idiomas, inclusive `piloto`.

| Rota | Objetivo | Implementação principal | Prévia |
| --- | --- | --- | --- |
| `/{lang}` | Apresentar a divisão e encaminhar às ações frequentes | [Início](../src/app/%5Blang%5D/page.tsx) | [Tela](images/inicio.png) |
| `/{lang}/piloto` | Orientar a preparação do piloto | [Pilotos](../src/app/%5Blang%5D/piloto/page.tsx), `CareerPage` | [Tela](images/pilotos.png) |
| `/{lang}/atc` | Orientar ingresso e preparação ATC | [ATC](../src/app/%5Blang%5D/atc/page.tsx), `CareerPage` | [Tela](images/atc.png) |
| `/{lang}/events` | Consultar agenda brasileira | [Eventos](../src/app/%5Blang%5D/events/page.tsx), `EventsClient` | [Tela](images/eventos.png) |
| `/{lang}/resources` | Encontrar ferramentas e favoritos | [Recursos](../src/app/%5Blang%5D/resources/page.tsx), `ResourceDirectory` | [Tela](images/recursos.png) |
| `/{lang}/resources/atc-report` | Avaliar o serviço ATC | [Reporte](../src/app/%5Blang%5D/resources/atc-report/page.tsx), `AtcReportForm` | [Tela](images/reporte-atc.png) |
| `/{lang}/staff` | Consultar departamentos e cargos | [Equipe](../src/app/%5Blang%5D/staff/page.tsx), `StaffClient` | [Tela](images/equipe.png) |
| `/{lang}/contact` | Encontrar o canal de contato | [Contato](../src/app/%5Blang%5D/contact/page.tsx) | [Tela](images/contato.png) |
| `/{lang}/branding` | Obter arquivos da identidade visual | [Marca](../src/app/%5Blang%5D/branding/page.tsx), `BrandPalette` | [Tela](images/marca.png) |

Capturas são exemplos da interface; eventos e indicadores podem mudar. Não há rota administrativa privada.

## Elementos comuns

O cabeçalho inclui marca, navegação, hora UTC, alternância de tema/idioma e link para My VATSIM. No celular, o menu abre por botão e fecha por seleção ou Esc. O rodapé reúne navegação institucional, comunidade e indicação de uso em simulação.

O link “Pular para o conteúdo” aponta para o `main` de cada página. A troca de idioma mantém o caminho atual; preferências de tema e favoritos permanecem no navegador.

## Início

Apresentação com fotografia de cabine, chamadas para pilotos/controladores e quatro atalhos: cartas, meteorologia, plano de voo e portal ATC. Abaixo ficam os caminhos de participação, painel de rede, conteúdo de comunidade e perguntas frequentes em elementos `details`.

O painel consulta dados a cada 60 segundos. Durante carregamento ou falha mostra traços, sem apresentar indisponibilidade como zero. A ilustração do Brasil não desenha posições reais de aeronaves; o link de radar abre um serviço externo.

## Pilotos e ATC

As duas páginas reutilizam `CareerPage`; a prop `atc` troca textos, imagem, passos, atalhos e checklist. Cada checklist tem quatro itens e armazenamento de sessão independente. Os caminhos de formação abrem materiais e portais externos; não há matrícula ou gerenciamento de treinamento local.

## Recursos

Categorias: Todos, Pilotos, ATC, Comunidade e Meus favoritos. A busca ignora acentos e considera título, descrição e provedor. A estrela salva IDs dos recursos no navegador.

Parâmetros iniciais aceitos:

```text
/pt-br/resources?category=atc
/pt-br/resources?q=meteorologia
/en/resources?category=pilot&q=charts
```

Categorias válidas no parâmetro: `all`, `pilot`, `atc`, `community`, `favorites`. Valores não reconhecidos usam `all`. Alterações feitas nos filtros da interface não reescrevem a URL. O acesso ao reporte está na categoria ATC e também aparece em Todos.

## Reporte ATC

1. Preencher identificação, posição, data/hora UTC, avaliação e relato.
2. Revisar todas as informações e, se necessário, voltar para editar.
3. Enviar para o formulário oficial configurado e aguardar a confirmação.

Nome e CID do controlador são opcionais. Os demais campos são obrigatórios. Os seletores visuais seguem o [contrato de data e hora](DATE_TIME_PICKERS.md), e “Usar data e hora atuais” preenche UTC.

Enquanto envia, os botões de enviar/editar ficam desabilitados. Sucesso apresenta posição, avaliação e horário de confirmação. Falha preserva o relato e orienta consultar a equipe antes de repetir. Não há salvamento de rascunho após sair/recarregar a página. Não são aceitos anexos nesta versão.

## Eventos

Exibe eventos ainda não encerrados relacionados ao Brasil, ordenados pelo início. Filtros: todos, em andamento e próximos. O instante usado para classificar os eventos é fornecido pelo servidor; a página não reclassifica continuamente por um relógio em tempo real.

O usuário alterna Brasília/UTC, expande o briefing, abre a página externa e gera um `.ics`. O resumo e a descrição recebidos são sanitizados. O calendário usa timestamps UTC, texto simples e linhas dobradas conforme o formato iCalendar.

Estado vazio e indisponibilidade têm mensagens diferentes. Na falha, há ação para recarregar e acesso à agenda global. O carregamento de imagens externas depende da disponibilidade da origem.

## Equipe

Busca por nome/cargo e filtro por departamento. A interface representa departamentos, subdepartamentos, posições preenchidas e vagas. Contagens são de posições, incluindo vagas.

Com `STAFF_DATA_IS_DEMO = true`, os dados são identificados como modelo. A tela não faz edição de staff nem representa uma área autenticada. Veja [como substituir os dados](CONTENT.md).

## Contato e marca

Contato apresenta e-mails de atendimento, treinamento, operações e diretoria a partir dos dicionários; os links abrem o cliente de e-mail. Não há um formulário próprio de contato geral.

Marca disponibiliza três versões do logotipo, cada uma em SVG e PNG, e cinco cores institucionais copiáveis. As cores institucionais não são necessariamente os tokens usados no design da interface.
