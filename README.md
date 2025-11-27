# ♻️ DesapegueFácil

O **DesapegueFácil** é uma plataforma de marketplace focada na economia circular e solidariedade, conectando pessoas que desejam vender, trocar ou doar itens com quem precisa, incluindo o suporte direto a Organizações Não Governamentais (ONGs).

---

## 🎨 Protótipo e Design

🔗 [Acessar o protótipo completo no Figma](https://www.figma.com/make/FDE1V2hPRp0vSg6WVeEJS6/Marketplace-de-Troca-de-Produtos-e-Doações?node-id=0-7&t=eVI47M9O4BC4jYGN-1)

---

## 👥 Integrantes da Equipe

| Nome | RA | Função |
|------|----|---------|
| **Enzo Bittencourt Massarelli** | 25009182 | Front-end |
| **Henry Coura Antunes de Vasconcellos** | 25002702 | Front-end |
| **Felipe Staut** | 25000741 | Design |
| **Thomaz Soares Masutti** | 25003246 | Design / Documentação |
| **Arthur Santos Pereira** | 25001490 | Documentação |

---

## 🚀 Funcionalidades Implementadas

### 🏠 Marketplace e Navegação (`index.html`)
- **Listagem Híbrida:** Exibição unificada de produtos (venda/troca/doação) e instituições parceiras.
- **Filtros Avançados:** Sidebar com acordeões para filtrar por Localização, Preço e Condição.
- **Categorias:** Navegação rápida por categorias (Eletrônicos, Veículos, Casa, etc.).
- **Modal de Detalhes:** Visualização rápida de informações das ONGs e necessidades urgentes sem sair da página (`modal.js`).

### 📢 Gestão de Anúncios (`anuncio.html`)
- **Criação de Anúncios:** Formulário completo para Venda, Troca ou Doação.
- **Lógica Dinâmica:** Campos adaptáveis (ex: o campo de preço é ocultado se for "Doação").
- **Máscaras de Input:** Formatação automática de moeda (R$) e CEP.
- **Upload de Fotos:** Área de "drag-and-drop" com pré-visualização de imagens.
- **Localização:** Preenchimento automático de endereço via API (`viacep.js`).

### 🔐 Autenticação e Perfil
- **Login e Registro:** Suporte a contas de Pessoa Física e Instituição (ONG).
- **Simulação de Backend:** Utilização de `localStorage` para persistir sessão, tokens JWT simulados e dados do utilizador.
- **Painel de Controlo (`perfil.html`):** Visualização dos dados do utilizador e histórico de atividades.
- **Proteção de Rotas:** Redirecionamento automático de páginas privadas caso o utilizador não esteja logado (`authHandler.js`).

### 🏢 Cadastro de ONGs (`register-ong.html`)
- **Wizard Passo-a-Passo:** Formulário dividido em 5 etapas para melhor experiência do utilizador.
- **Verificação de CNPJ:** Integração com **BrasilAPI** para preenchimento automático de dados da empresa.
- **Upload de Documentos:** Interface para envio de comprovativos e fotos da instituição.

### 💬 Comunicação
- **Chat (`chat.html`):** Interface apenas visual.
- **Feedback Visual:** Sistema global de alertas e pop-ups (`authUI.js`) para funcionalidades em desenvolvimento.

---

## 🛠️ Tecnologias e APIs Utilizadas

Este projeto foi desenvolvido utilizando tecnologias Web Standard (Vanilla), sem dependência de frameworks pesados, garantindo performance e compatibilidade.

* **HTML5** (Semântico e Acessível)
* **CSS** (Variáveis CSS, Flexbox, Grid Layout e Design Responsivo)
* **JavaScript** (Módulos, Async/Await, Manipulação de DOM)
* **APIs Externas:**
    * [ViaCEP](https://viacep.com.br/): Para autocompletar endereços através do CEP.
    * [BrasilAPI](https://brasilapi.com.br/): Para consulta e validação de dados de CNPJ.

---

## 📂 Estrutura do Projeto

```text
Projeto-DesapegueFacil/
│
├── src/
│   ├── pages/          # Ficheiros HTML (index, login, perfil, anuncio, etc.)
│   ├── styles/         # Folhas de estilo CSS modulares
│   └── scripts/        # Lógica JavaScript (auth, filters, masks, api)
│
├── assets/             # Imagens e ícones estáticos
└── README.md           # Documentação do projeto
