# Dados e segurança da implementação

[Índice](README.md) · [APIs](API.md) · [Publicação](DEPLOYMENT.md)

Este documento descreve o comportamento técnico do código. Não substitui uma política institucional de privacidade, retenção ou atendimento, que deve ser definida pelos responsáveis pelo serviço.

## Dados tratados

| Dado | Origem e destino | Armazenamento implementado |
| --- | --- | --- |
| Tema e favoritos | Navegador do membro | `localStorage` da mesma origem |
| Checklists | Navegador do membro | `sessionStorage` por perfil |
| Reporte ATC | Formulário → servidor VATBRZ → Google Forms configurado | Estado React até sair da página; sem banco ou arquivo local no código |
| Tráfego | Feed público VATSIM → servidor → navegador | Resultado regional em memória/cache HTTP |
| Eventos | API VATSIM → servidor → página | Cache de fetch e da rota |
| Equipe | Arquivo do projeto → página pública | Modelo demonstrativo versionado |

O reporte inclui nome, CID, e-mail, dados opcionais do controlador, posição, data/hora, avaliação e comentários. O usuário vê o destino antes de enviar. A retenção após recebimento depende do formulário e dos responsáveis externos; não há prazo de exclusão implementado por este repositório.

O handler de reporte não registra o conteúdo em logs. Isso não garante ausência de logs em proxy, plataforma ou ferramentas adicionadas ao deploy: configure esses serviços sem capturar corpos de reportes. Evite dados pessoais em screenshots, issues e fixtures.

## Controles existentes

- Validação compartilhada no cliente e repetida no servidor para o reporte.
- Limite de 20000 caracteres do corpo, verificado após leitura.
- Rejeição do cabeçalho `sec-fetch-site: cross-site` e de Content-Type incompatível.
- Destino externo fixo; o usuário não escolhe uma URL de encaminhamento.
- Uma requisição externa por tentativa; sem reenvio automático.
- Sucesso depende de reconhecer a confirmação do Google; resposta ambígua mantém o rascunho.
- Sanitização de resumos e briefings de eventos com DOMPurify.
- Validação HTTPS de links externos de eventos.
- Links externos de ação abrem com `noopener noreferrer`.

`next.config.mjs` define `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e bloqueia câmera, microfone e geolocalização por `Permissions-Policy`.

## Limites atuais

Não há autenticação própria, rate limiting, CAPTCHA, fila de envio, idempotência persistente, auditoria de reportes ou verificação de identidade pelo CID. A validação de CID confere formato/faixa, não titularidade. O cabeçalho de origem não constitui autenticação.

O código não define CSP ou HSTS. A proteção de tráfego, HTTPS e controles adicionais dependem da hospedagem e das decisões de operação. Se implementar CSP, considere o script de inicialização do tema no layout em vez de bloquear a interface silenciosamente.

A UI bloqueia cliques concorrentes no botão, mas não elimina duplicações entre abas ou após uma tentativa sem confirmação. Uma resposta 502 pode ocorrer depois de o serviço externo ter recebido os dados. Confirme com a equipe antes de repetir.

## Práticas de manutenção

Use mocks nos testes de integração. Não envie amostras pessoais ou reportes fictícios ao destino oficial. Ao trocar formulário, confirme destinatário, campos e tratamento de erros. Examine arquivos em `public` antes de publicar: todos são servidos, inclusive materiais legados.

Não registre segredos em arquivos, issues ou documentação. Se identificar uma vulnerabilidade com impacto em dados, comunique pelos canais privados já estabelecidos com os mantenedores; este repositório não define um endereço específico para esse atendimento.
