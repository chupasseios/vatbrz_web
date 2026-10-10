# Seletores de data e hora

[Índice](README.md) · [Componentes](COMPONENTS.md) · [Design](DESIGN.md)

A biblioteca interna `@/components/ui/date-time` centraliza os seletores visuais do portal. Use estes componentes em vez de criar novos calendários ou campos nativos de data/hora em cada formulário. Não há dependências adicionais.

```tsx
"use client";
import { useState } from "react";
import { DatePicker, TimePicker } from "@/components/ui/date-time";

export default function Example() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  return <>
    <DatePicker label="Data do voo" name="date" value={date}
      onChange={setDate} locale="pt-BR" timeZone="UTC" required />
    <TimePicker label="Horário do voo" name="time" value={time}
      onChange={setTime} locale="pt-BR" timeZone="UTC" zoneLabel="UTC / Zulu" required />
  </>;
}
```

## Contrato compartilhado

- `value` e `onChange`: componentes controlados; limpar retorna uma string vazia.
- Data: string `YYYY-MM-DD`. Hora: string `HH:mm` em 24 horas, sem conversão automática.
- `label`: rótulo visível e acessível; `id` é opcional e gerado quando omitido.
- `name`: adiciona um campo oculto para leitura por `FormData`.
- `locale`: `pt-BR` por padrão; o formulário ATC usa `en-GB` em inglês.
- `timeZone`: `UTC` por padrão. Determina os atalhos Hoje/Agora, sem alterar o valor selecionado.
- `required`, `disabled`, `error`, `description`, `placeholder`, `className`: estados e apresentação do campo. O formulário continua responsável pela validação no cliente e no servidor; `required` indica o requisito para o usuário e tecnologias assistivas.
- `DatePicker`: aceita `min`/`max` no formato ISO, e `weekStartsOn` igual a `0` (domingo, padrão) ou `1` (segunda-feira).
- `TimePicker`: aceita `zoneLabel` para personalizar o texto do fuso. A seleção só é confirmada por Aplicar horário ou Enter; Esc descarta a edição do horário.

## Comportamento

O calendário suporta setas, Home/End, Page Up/Down e Shift + Page Up/Down para navegar por anos. O relógio suporta setas, Home/End e Page Up/Down em cada coluna. Esc fecha e devolve o foco; Tab mantém a navegação normal. Clique fora fecha o seletor.

O painel compartilhado é renderizado fora dos cartões para evitar cortes por `overflow`, ajusta a posição à tela e herda as cores dos temas claro/escuro. Rótulos, valores e IDs independentes permitem múltiplas instâncias na mesma página.

`src/lib/date-time.ts` contém somente utilitários de calendário e fuso; não conhece o formulário ATC. Testes de datas e UTC: `node --test tests/date-time.test.mjs`.

## Limites e erros no consumidor

```tsx
<DatePicker
  id="data-operacao"
  name="operationDate"
  label="Data da operação"
  value={date}
  onChange={setDate}
  min="2026-01-01"
  max="2026-12-31"
  weekStartsOn={1}
  locale="pt-BR"
  timeZone="UTC"
  required
  error={date ? undefined : "Selecione uma data."}
/>
```

O trecho pressupõe o estado `date/setDate` do exemplo anterior; os limites são ilustrativos. Forneça `min <= max`, valores ISO válidos e um identificador de fuso aceito por `Intl`. O componente limita a seleção de dias, mas o servidor deve validar regras do domínio novamente. Um valor externo inválido não deve ser considerado uma data confirmada.

Não confunda `lang="pt-br"` das rotas com a prop `locale`. Para o portal: `locale={lang === "en" ? "en-GB" : "pt-BR"}`. Os rótulos internos têm variantes PT/EN; passar um terceiro locale muda a formatação de datas, mas não adiciona uma tradução completa da biblioteca.

## Prévia

![Calendário](images/calendario.png)
![Seletor de hora](images/horario.png)
