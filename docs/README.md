# Documentação do portal VATBRZ

[Voltar ao repositório](../README.md)

Esta documentação descreve a implementação presente no repositório. Exemplos são orientações de uso; recursos ausentes não são apresentados como disponíveis. Atualize o guia correspondente quando uma mudança alterar a interface, um contrato ou o modo de operação.

## Por onde começar

| Objetivo | Leitura |
| --- | --- |
| Rodar o projeto | [Desenvolvimento](DEVELOPMENT.md) |
| Conhecer o produto | [Páginas e jornadas](PAGES.md) |
| Alterar a aparência | [Design](DESIGN.md) → [Componentes](COMPONENTS.md) |
| Reutilizar calendário/relógio | [Seletores de data e hora](DATE_TIME_PICKERS.md) |
| Adicionar página ou funcionalidade | [Arquitetura](ARCHITECTURE.md) → [Contribuição](../CONTRIBUTING.md) |
| Atualizar staff, links ou textos | [Manutenção de conteúdo](CONTENT.md) |
| Entender uma integração | [APIs](API.md) → [Dados e segurança](DATA_AND_SECURITY.md) |
| Conferir uma entrega | [Testes](TESTING.md) |
| Publicar e operar | [Publicação](DEPLOYMENT.md) |

## Responsabilidades

- `src/app/[lang]`: páginas públicas e layout por idioma.
- `src/components`: componentes compartilhados do portal.
- `src/components/ui/date-time`: biblioteca interna de seletores.
- `src/lib`: recursos, validação, conversões e contratos auxiliares.
- `src/services`: consultas VATSIM e modelo de staff.
- `src/app/api`: endpoints servidos pelo próprio portal.
- `tests`: testes executáveis após `npm ci`.
- `public`: arquivos públicos servidos diretamente.

As imagens em [images](images) são capturas ilustrativas da interface. Contagens, relógios e eventos nelas não são dados atuais. Os arquivos de documentação não são rotas do site.

## Atualização

Alterações de componentes devem atualizar propriedades e exemplos; alterações de API devem atualizar contratos e testes; novas páginas devem entrar no mapa de rotas. Preserve links relativos para leitura no GitHub e em um clone local.
