# Desenvolvimento local

[Índice](README.md) · [Arquitetura](ARCHITECTURE.md) · [Testes](TESTING.md)

## Ambiente

Use Node.js 22.13+ na linha 22 ou 24+ e npm. O Next.js isoladamente aceita versões anteriores, mas `jsdom` e `isomorphic-dompurify` impõem requisitos adicionais. Confira os campos `engines` quando atualizar o lockfile.

```sh
node --version
npm --version
npm ci
npm run dev
```

Execute na pasta que contém `package.json`. `npm ci` instala o lockfile; mudanças intencionais de dependências devem atualizar e versionar `package-lock.json`.

O servidor usa a porta 3000 por padrão. Para outra porta:

```sh
npm run dev -- --port 3001
```

## Configuração existente

| Arquivo | Responsabilidade |
| --- | --- |
| [package.json](../package.json) | Dependências e scripts |
| [next.config.mjs](../next.config.mjs) | Imagens remotas, cabeçalhos HTTP e raiz Turbopack |
| [tsconfig.json](../tsconfig.json) | TypeScript estrito; alias `@/*` → `src/*` |
| [eslint.config.mjs](../eslint.config.mjs) | Regras Next.js/TypeScript |
| [src/proxy.ts](../src/proxy.ts) | Idioma e redirecionamento |
| [layout.tsx](../src/app/%5Blang%5D/layout.tsx) | Fontes, metadados, tema, cabeçalho e rodapé |

Não há variáveis próprias lidas por `process.env` em `src` ou na configuração Next atual. Não é necessário criar um `.env` vazio. Destinos externos ficam nos arquivos descritos em [APIs](API.md) e [Conteúdo](CONTENT.md).

As fontes Manrope e Barlow Condensed são obtidas pelo `next/font/google` durante o build e depois servidas pelo aplicativo. Permita o acesso ao Google Fonts na compilação. Consultas VATSIM e envio de reportes exigem saída HTTPS no servidor em execução.

## Produção local

```sh
npm run lint
node --test tests/atc-report.test.mjs tests/date-time.test.mjs
npm run build
npm run start
```

`start` requer um build concluído. Para conferir apenas os tipos, execute `npx tsc --noEmit`.

## Arquivos gerados

`.next/`, `node_modules/`, `*.tsbuildinfo`, `next-env.d.ts` e arquivos de ambiente estão no `.gitignore`. Não inclua dependências ou caches no commit. O lockfile deve ser versionado. Pastas locais auxiliares que não são importadas pelo projeto não constituem requisitos de execução.

## Problemas frequentes

| Sintoma | Verificação e ação |
| --- | --- |
| Versão de Node incompatível | Confira a versão efetiva do terminal e os requisitos do lockfile |
| Junction/symlink com Turbopack | Use os scripts do projeto, que selecionam `--webpack` |
| `EPERM` em `.next` no Windows/OneDrive | Encerre processos que usam a pasta e confira permissões/sincronização. Se persistir, use um clone fora do OneDrive |
| Porta ocupada | Encerre o servidor anterior ou use `--port 3001` |
| Fontes não carregam no build | Confira rede, proxy e acesso ao Google Fonts |
| Sem eventos ou tráfego | Consulte os estados de erro e [APIs](API.md); dados indisponíveis não confirmam ausência de tráfego |
| Cópia de cor recusada | Clipboard depende do contexto do navegador; use HTTPS ou localhost |
| Preferências não persistem | Confira se armazenamento local está bloqueado |
| Reporte sem confirmação | Não repita automaticamente; consulte [APIs](API.md) |

Não remova dados ou arquivos do repositório para resolver um cache. Se descartar arquivos gerados, confira primeiro o caminho e preserve o trabalho local.
