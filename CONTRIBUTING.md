# Contribuir com o portal VATBRZ

[README](README.md) · [Documentação](docs/README.md)

## Preparação

Leia [AGENTS.md](AGENTS.md), [arquitetura](docs/ARCHITECTURE.md) e o guia da área alterada. As instruções do repositório pedem consultar a documentação instalada do Next.js em `node_modules/next/dist/docs` antes de modificar comportamentos do framework.

Instale com `npm ci` e execute `npm run dev`. Use uma branch descritiva para a mudança e preserve alterações locais que não pertençam à sua tarefa. Não há uma convenção obrigatória de nome de branch definida pelo projeto.

## Alterações de UI

- Reutilize `PortalUI`, `Icon`, `CareerPage` e a biblioteca de data/hora quando aplicáveis.
- Use tokens de tema e CSS Modules para estilos locais.
- Inclua português e inglês; mantenha o caminho e o vocabulário das ações coerentes.
- Teste teclado, foco, celular, tema escuro e estados vazios/de erro.
- Evite apresentar placeholders como dados oficiais.

Consulte [componentes](docs/COMPONENTS.md) e [design](docs/DESIGN.md) antes de duplicar uma solução existente. Prefira mudanças de escopo claro; refatorações gerais devem explicar o benefício e o impacto.

## Dados e integrações

Mantenha credenciais e dados pessoais fora do repositório. Não envie reportes de teste ao Google Forms oficial; use os mocks da suíte ou um destino de teste acordado. Mudanças em APIs devem incluir contrato, estados de erro e testes correspondentes.

Novas dependências devem ser necessárias, compatíveis com o runtime e registradas no lockfile. A biblioteca de seletores atual não precisa de pacote adicional.

## Verificações antes do PR

```sh
npm run lint
node --test tests/atc-report.test.mjs tests/date-time.test.mjs
npm run build
git diff --check
```

Execute o [roteiro manual](docs/TESTING.md) pertinente à mudança. Para uma alteração apenas de documentação, confira links, caminhos, exemplos e coerência com o código; não é necessário reconstruir o site por uma edição de texto.

## Documentação e pull request

Descreva o problema, o comportamento resultante e como foi validado. Para UI, inclua capturas com dados fictícios e identifique o idioma/tema. Informe limitações, sem afirmar que uma integração externa foi validada por testes que apenas a simulam.

Atualize o índice, catálogo, contratos ou guia de conteúdo afetado. Use links relativos nos Markdown. Modelos de bug e melhoria estão em `.github/ISSUE_TEMPLATE`; o modelo de PR lista os pontos de revisão.

Este repositório não define aprovação automática, proteção de branch ou pipeline de CI. Essas configurações devem ser combinadas e ativadas pelos mantenedores do GitHub.
