# VATBRZ Website

Repositório oficial do novo site da VATBRZ (VATSIM Brasil).
Este site foi construído com **Next.js**, **React**, e **TypeScript**, e utiliza requisições à API oficial da VATSIM para renderizar informações de tráfego aéreo e controladores em tempo real no Brasil.

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
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
