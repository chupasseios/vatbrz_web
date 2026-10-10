# APIs e integrações

[Índice](README.md) · [Arquitetura](ARCHITECTURE.md) · [Dados e segurança](DATA_AND_SECURITY.md)

Os endpoints locais não usam prefixo de idioma. Não há chave de API ou autenticação própria. Exemplos de payload neste documento são fictícios e não devem ser enviados ao formulário oficial para testar.

## GET /api/live-stats

Fonte: `https://data.vatsim.net/v3/vatsim-data.json`. Implementação: [route.ts](../src/app/api/live-stats/route.ts).

Resposta HTTP 200:

```json
{
  "pilotCount": 1,
  "atcCount": 1,
  "pilots": [{ "callsign": "TEST123", "latitude": -23.4, "longitude": -46.4, "heading": 90 }],
  "controllers": [{ "callsign": "SBGR_APP", "frequency": "129.000", "name": "Nome de exemplo" }],
  "updatedAt": "2026-10-10T12:00:00Z"
}
```

O servidor baixa o feed global sem fetch cache e aplica um recorte regional. Pilotos devem estar dentro da caixa geográfica definida no código e ter plano relacionado ao Brasil ou estar no polígono aproximado. ATC é filtrado por prefixos brasileiros e `facility > 0`. Não representa uma delimitação operacional oficial de FIRs.

| Comportamento | Valor |
| --- | --- |
| Timeout externo | 10 segundos |
| Cache em memória | Resultado regional por 60 segundos, por processo |
| Cache HTTP | `s-maxage=60, stale-while-revalidate=30` |
| Atualização no navegador | 60 segundos |
| Data inválida/erro HTTP da origem | 502 |
| Exceção de rede/timeout | 500 |

O corpo de erro não tem um único formato: pode conter `error` ou os campos legados `pilotCount`, `atcCount`, `pilots`. Verifique sempre o status HTTP; os zeros em um corpo de erro não são uma contagem válida. A UI faz essa distinção.

O cache em memória não é compartilhado entre instâncias e pode desaparecer em reinícios/serverless. Os cabeçalhos de cache dependem do suporte da hospedagem.

## GET /api/events

Fonte: `https://my.vatsim.net/api/v1/events/all`. Código: [serviço](../src/services/vatsim.ts) e [rota](../src/app/api/events/route.ts).

Retorna HTTP 200 com `VatsimEvent[]`. Campos: `id`, `name`, `link`, `organisers[]`, `airports[]`, `start_time`, `end_time`, `short_description`, `description` e `banner` (string ou null). Organizadores incluem região, divisão e subdivisão; aeroportos incluem `icao`.

O filtro mantém eventos não encerrados com divisão `BRZ` ou aeroporto de prefixo brasileiro, ordenados pelo início. O fetch externo tem timeout de 10 segundos e `revalidate: 300`. A rota define `s-maxage=3600, stale-while-revalidate=300`.

**Limite do contrato:** a rota pública retorna `[]` também quando o serviço falha. Para distinguir indisponibilidade de ausência de eventos, a página usa diretamente `getBrazilianEventsResult()`, que retorna `{ events, unavailable, referenceTime }`.

`getBrazilianEvents()` retorna apenas a lista. `getNextBrazilianEvent()` retorna o primeiro item ou null. A classificação “em andamento/próximo” usa o `referenceTime` da carga inicial.

## POST /api/atc-report

Código: [rota](../src/app/api/atc-report/route.ts), [validação](../src/lib/atc-report.ts) e [entrega](../src/lib/atc-report-delivery.ts).

O usuário revisa o reporte antes de enviar. O navegador faz um POST local, o servidor valida e faz **uma** requisição ao Google Forms configurado. Não há envio paralelo por iframe nem repetição automática.

### Requisição

`Content-Type: application/json`.

```json
{
  "cid": "1234567",
  "name": "Membro de exemplo",
  "email": "membro@example.com",
  "controllerName": "",
  "controllerCid": "",
  "position": "SBGR_APP",
  "date": "2026-10-10",
  "time": "18:30",
  "rating": "Bom / Good",
  "comments": "Exemplo de conteúdo para documentação. Não transmitir."
}
```

| Campo | Validação atual |
| --- | --- |
| `cid` | Dígitos; valor entre 800000 e 3000000 |
| `name` | 2–120 caracteres após trim |
| `email` | Formato validado por expressão regular; até 254 caracteres |
| `controllerName` | Opcional; até 120 caracteres |
| `controllerCid` | Opcional; quando preenchido, entre 800000 e 2100000 |
| `position` | Deve conter `_`, até 40 caracteres; convertido para maiúsculas |
| `date` | Data existente no formato `YYYY-MM-DD` |
| `time` | `HH:mm`, de 00:00 a 23:59; UTC no formulário ATC |
| `rating` | `Excelente / Excellent`, `Bom / Good`, `Regular` ou `Ruim / Bad` |
| `comments` | 3–5000 caracteres após trim |

Os limites diferentes das CIDs refletem o formulário externo verificado em 10/10/2026; não são uma regra universal da VATSIM. Entradas não string são normalizadas para string vazia. O corpo acima de 20000 caracteres é rejeitado após a leitura.

### Respostas

| HTTP | Corpo | Significado |
| --- | --- | --- |
| 200 | `{ "ok": true, "receivedAt": "...ISO..." }` | Mensagem de confirmação reconhecida |
| 400 | `{ "error": "invalid_request" }` | JSON não interpretável |
| 400 | `{ "error": "validation", "fields": ["cid"] }` | Campos inválidos |
| 403 | `{ "error": "forbidden" }` | Cabeçalho `sec-fetch-site: cross-site` |
| 413 | `{ "error": "too_large" }` | Corpo acima do limite |
| 415 | `{ "error": "invalid_request" }` | Content-Type não contém `application/json` |
| 502 | `{ "error": "unconfirmed" }` | Falha externa, timeout ou recebimento não confirmado |

Todas as respostas da rota usam `Cache-Control: no-store`. `receivedAt` é gerado pelo servidor local depois de reconhecer a confirmação; não é um protocolo ou ID emitido pelo Google. O timeout externo é 15 segundos, e o navegador aguarda até 25 segundos.

### Destino e campos externos

Formulário: [Feedback ATC - VATSIM Brasil](https://docs.google.com/forms/d/e/1FAIpQLSfg3W9ivSToH9wdz8RXPb082jBUBxnTP4vGq2tz0lsipvsm_w/viewform). O código envia para o mesmo identificador, em `/formResponse?hl=en`.

| Dado | Parâmetro |
| --- | --- |
| CID do membro | `entry.1781118946` |
| Nome | `entry.420586714` |
| E-mail | `entry.1326481568` |
| Nome do controlador | `entry.1304941585` |
| CID do controlador | `entry.258151617` |
| Posição | `entry.641875680` |
| Ano/mês/dia | `entry.158787368_year`, `_month`, `_day` |
| Hora/minuto | `entry.1751532403_hour`, `_minute` |
| Avaliação | `entry.548207857` |
| Relato | `entry.1270383311` |

O corpo externo usa `URLSearchParams`. A confirmação remove blocos `script`/`style`, rejeita uma resposta contendo formulário e procura a mensagem configurada de recebimento em português ou inglês. Um HTTP 200 isolado não é tratado como sucesso.

Mudanças no formulário ou na mensagem podem interromper o reconhecimento. A integração não é uma API oficial estável de escrita do Google Forms. Se houver falha após o envio, a resposta pode ter sido gravada: **não reenvie automaticamente**. A prevenção atual cobre cliques concorrentes na página; não há idempotência durável entre abas, instâncias ou recargas.

Para manutenção, confira o formulário em modo de leitura, atualize o mapeamento/validações e execute os testes com transporte simulado. Um teste real de gravação só deve ocorrer em destino de teste ou por acordo explícito com os responsáveis.

## Serviços abertos por link

AISWEB, REDEMET, My VATSIM, VATSIM Radar, Portal ATC e comunidade são atalhos definidos em `src/lib/portal.ts`. O portal não importa seus conteúdos nem fornece autenticação nesses serviços. Links sociais e materiais institucionais também aparecem nos componentes e dicionários; veja [Conteúdo](CONTENT.md).
