
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

| Data | Atualização |
|------|--------------|
| **10/09/2025** | Estrutura inicial do projeto criada (`index.html`, `index-style.css`, `login.html`). |
| **18/09/2025** | Adição de `authHandler.js` e `authUI.js` com simulação de login local. |
| **26/09/2025** | Implementação do `filter.js` com filtragem por categoria e tipo. |
| **02/10/2025** | Adição do wizard de cadastro de ONGs (`register-ong.html` + `register-ong-wizard.js`). |
| **08/10/2025** | Implementação da integração com API ViaCEP (`viacep-ong.js`). |
| **13/10/2025** | Criação do fluxo de doação (`donate.html` + `donate-wizard.js`). |
| **18/10/2025** | Revisão visual completa do layout principal (`index-style.css` reorganizado e otimizado). |
| **23/10/2025** | Adição da interface de chat (`chat.html` + `chat-style.css`). |
| **25/10/2025** | Correção de responsividade entre **960px e 1180px** (versão atual do layout). |
| **27/10/2025** | README completo atualizado com histórico e documentação técnica. |

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
