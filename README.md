
---

## 🎨 Protótipo no Figma

🔗 [Acessar o protótipo completo no Figma](https://www.figma.com/make/FDE1V2hPRp0vSg6WVeEJS6/Marketplace-de-Troca-de-Produtos-e-Doações?node-id=0-7&t=eVI47M9O4BC4jYGN-1)

---

## 👥 Integrantes da Equipe

| Nome | Função |
|------|---------|
| Fulano | Front-end Developer |
| Ciclano | Back-end Developer |
| Beltrano | Design e Documentação |

---

## 🧩 Principais Funcionalidades

### 🏠 Página Inicial (`index.html`)
- Grids dinâmicos de produtos e instituições.
- Filtro por categoria, tipo e busca em tempo real (`filter.js`).
- Layout responsivo ajustado entre **320px e 1400px**.

### 🔐 Sistema de Autenticação
- `authHandler.js`: trata login e registro (com simulação JWT).
- `authUI.js`: atualiza o layout conforme estado de login.
- Armazena dados no `localStorage` para persistência local.
- Redirecionamento automático para `login.html` em rotas protegidas.

### 🏢 Cadastro de Instituições
- Wizard de 5 etapas com validação progressiva.
- Integração com API ViaCEP.
- Exibição dinâmica dos dados no resumo final.

### ❤️ Doações
- Wizard de 3 etapas com lógica condicional.
- Resumo final antes da confirmação.
- Máscara automática de telefone (`phoneMask.js`).

### 💬 Chat
- Layout funcional e estático para simulação de mensagens.
- Mostra como será a futura integração com backend.

---

## 🛠️ Histórico de Desenvolvimento

## 🗓 Histórico de Desenvolvimento

Este projeto foi desenvolvido em **três sprints principais**, com entregas progressivas que evoluíram do protótipo inicial até o sistema completo com integração e layout responsivo.

---

### 🚀 **Sprints e Entregas**

#### 🟢 **1ª Sprint – Protótipo Inicial**
**Data:** 18/08/2025  
**Objetivo:** Criação do protótipo navegável e definição da estrutura conceitual.  
**Principais entregas:**
- Wireframe e layout conceitual do projeto.
- Estrutura base de navegação.
- Primeira visão do fluxo de interação (prototipagem visual).

---

#### 🟡 **2ª Sprint – Estrutura Base (HTML e CSS)**
**Data:** 24/09/2025  
**Objetivo:** Construção da base do site em HTML e CSS.  
**Principais entregas:**
- Páginas `index.html` e `index-style.css` criadas.
- Layout inicial do marketplace implementado.
- Estrutura semântica e responsiva definida.

---

#### 🔵 **3ª Sprint – Entrega Final e Integração Completa**
**Data:** 28/10/2025  
**Objetivo:** Finalizar o sistema com todas as funcionalidades integradas e revisão visual completa.  
**Principais entregas:**
- Funcionalidade de login local (`authHandler.js` + `authUI.js`).
- Sistema de filtragem (`filter.js`).
- Cadastro de ONGs com wizard (`register-ong.html` + `register-ong-wizard.js`).
- Integração com **API ViaCEP** (`viacep-ong.js`).
- Fluxo de doações (`donate.html` + `donate-wizard.js`).
- Interface de chat (`chat.html` + `chat-style.css`).
- Correções de responsividade (960–1180px).
- Modal funcional e integração de todos os módulos.
- README completo e documentação final.

---

### 📅 **Linha do Tempo Detalhada**

| Data | Descrição |
|------|------------|
| **18/08/2025** | 🧩 1ª Sprint – Entrega do protótipo inicial. |
| **24/09/2025** | 💻 2ª Sprint – Entrega da estrutura base (`index.html`, `index-style.css`). |
| **30/09/2025** | Estrutura inicial do projeto criada (organização de diretórios e arquivos principais). |
| **05/10/2025** | Adição de `authHandler.js` e `authUI.js` com simulação de login local. |
| **10/10/2025** | Implementação do `filter.js` com filtragem por categoria e tipo. |
| **14/10/2025** | Adição do wizard de cadastro de ONGs (`register-ong.html` + `register-ong-wizard.js`). |
| **18/10/2025** | Integração com API ViaCEP (`viacep-ong.js`). |
| **21/10/2025** | Criação do fluxo de doação (`donate.html` + `donate-wizard.js`). |
| **24/10/2025** | Revisão visual completa do layout principal (`index-style.css` reorganizado e otimizado). |
| **26/10/2025** | Adição da interface de chat (`chat.html` + `chat-style.css`). |
| **27/10/2025** | Correção de responsividade entre **960px e 1180px**. |
| **28/10/2025** | 🚀 3ª Sprint – Entrega final com integração completa e modais funcionais. |

---

## 🚧 Status do Projeto

> **Em desenvolvimento**  
> Mvp estimada para **Dezembro de 2025**

Planeja-se, em breve:
1. **Implementar o Formulário de "Anunciar" (anuncio.html)** * Construir o formulário principal que falta no arquivo anuncio.html. * Adicionar campos (Título, Descrição, Preço, Fotos) e reutilizar o script viacep.js para o preenchimento de endereço, assim como foi feito no cadastro da ONG.
2.  **Dinamizar o Perfil do Usuário (perfil.html)** * Ir além de mostrar apenas o nome/email. * Usar o localStorage para simular uma "lista de anúncios" e "histórico de doações". * Fazer o perfil.js ler esses dados e preencher dinamicamente as seções "Minhas Doações" e "Meus Anúncios", que hoje são estáticas.
3. **Melhorar a Validação do Wizard de Doação** * Atualmente, o usuário pode avançar do Passo 1 do donate-wizard.js sem adicionar itens. * A sugestão é desabilitar o botão "Continuar" por padrão e só habilitá-lo (via JavaScript) após o usuário adicionar pelo menos um item à lista de doação.
4. **Ativar os Filtros da Sidebar na Home** * Expandir o filter.js para que ele também leia os botões da sidebar de filtros (index.html) de "Localização", "Preço" e "Condição". * Isso completaria a funcionalidade de filtragem da página inicial.

---

## ⚙️ Como Executar o Projeto

Este projeto é **100% front-end**.  
Para visualizar:

1. Clone ou baixe o repositório.
2. Abra o arquivo `index.html` no navegador.
3. Navegue livremente entre as páginas.

Não é necessário servidor local
