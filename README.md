# VATBRZ Website

Repositório oficial do novo site da VATBRZ (VATSIM Brasil).
Este site foi construído com **Next.js**, **React**, e **TypeScript**, e utiliza requisições à API oficial da VATSIM para renderizar informações de tráfego aéreo e controladores em tempo real no Brasil.

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) 22.13+ ou 24+
- NPM, Yarn, ou pnpm

## Como Iniciar o Projeto Localmente

Siga os passos abaixo para testar o site no seu ambiente de desenvolvimento:

1. **Instale as dependências:**
   Abra o terminal na pasta raiz do projeto e execute:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra o seu navegador e acesse [http://localhost:3000](http://localhost:3000). O site deve estar rodando e os dados ao vivo (eventos e VATSIM) já estarão se conectando à API pública!

## Scripts Adicionais
- `npm run build`: Cria uma versão de produção otimizada do site.
- `npm run start`: Inicia o servidor com a versão de produção gerada (necessita rodar o build antes).
- `npm run lint`: Analisa o código em busca de erros de sintaxe ou boas práticas.

## Portal e modelos de páginas

O portal inclui Início, Pilotos, ATC, Eventos, Recursos, Equipe, Contato e Marca, em português e inglês. Veja [o guia de design](docs/DESIGN.md) para os componentes reutilizáveis, funcionalidades e fontes de dados.

Os dados de staff são demonstrativos e estão identificados na interface. Substitua-os por uma fonte oficial antes da publicação. A área do membro abre My VATSIM.

Os comandos de desenvolvimento e build usam Webpack por compatibilidade com a dependência de sanitização de HTML no Windows/OneDrive. O primeiro build baixa as fontes e precisa de internet.
