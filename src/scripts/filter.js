/* =================================== */
/* 1. Variáveis Globais (Root)
/* =================================== */
:root {
  --color-primary: #3498db;
  --color-secondary: #2c3e50;
  --color-text-primary: #333;
  --color-text-secondary: #555;
  --color-text-light: #777;
  --color-text-muted: #999;
  --color-background: #f4f4f9;
  --color-white: #ffffff;
  --color-border: #e0e0e0;
  --color-success: #2ecc71;
  --color-danger: #e74c3c;
  --font-family-sans: Arial, sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.2rem;
  --font-size-xl: 1.5rem;
  --font-size-sm: 0.9rem;
  --font-size-xs: 0.8rem;
  --border-radius-md: 8px;
  --border-radius-sm: 5px;
  --main-border: 1px solid var(--color-border);
  
  /* Cores de Validação */
  --cor-fundo-sucesso: #ecffef;
  --cor-fundo-erro: #ffecec;
  --cor-fundo-meter: #eee;
  --cor-senha-fraca: #f66;
  --cor-senha-media: #fc3;
}

/* =================================== */
/* 2. Reset e Estilos Globais
/* =================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family-sans);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: var(--color-text-secondary);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

:focus {
  outline: 3px solid rgba(52, 152, 219, 0.4);
  outline-offset: 2px;
}

/* =================================== */
/* 4. Componentes Comuns (Header/Footer)
/* =================================== */
.main-header {
  background-color: var(--color-white);
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-bottom: var(--main-border);
}

.logo {
  width: 100%;
  text-align: center;
}

.main-nav ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.main-nav a {
  font-weight: bold;
  padding-bottom: 5px;
}

.main-nav a.active,
.main-nav a:hover {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

/* Container dos botões de ação no Header */
.search-and-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Espaçamento uniforme */
  align-items: center;
  justify-content: center;
  width: 100%;
}

.search-and-actions input {
  font-size: var(--font-size-base);
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: var(--border-radius-sm);
  min-width: 0;
  width: 100%;
}

.search-and-actions input:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  outline: none;
}

/* Botão Principal (+ Anunciar) */
.btn-announce {
  flex-grow: 1;
  text-align: center;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: bold;
  border: none;
  background-color: var(--color-primary);
  color: var(--color-white);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* Altura fixa para alinhar com os ícones */
}

.btn-announce:hover {
  transform: translateY(-1px); 
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
  background-color: #2980b9;
  color: var(--color-white); /* Garante texto branco no hover */
}

/* --- CORREÇÃO DO DESIGN DOS BOTÕES DE ÍCONE --- */

.btn-icon,
.btn-profile {
    display: flex; /* Flex para centralizar o ícone SVG */
    align-items: center;
    justify-content: center;
    width: 40px;  /* Largura fixa */
    height: 40px; /* Altura fixa igual ao botão anunciar */
    background-color: #f4f6f8; /* Fundo cinza claro sutil */
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none; /* Remove sublinhado se for link */
    box-sizing: border-box;
}

/* Botões Chat e Notificação (Quadrados arredondados) */
.btn-icon {
    border-radius: var(--border-radius-sm); 
}

/* Botão Perfil (Redondo) */
.btn-profile {
    border-radius: 50%; 
}

/* Efeito Hover Unificado */
.btn-icon:hover,
.btn-profile:hover {
    background-color: #eaf5fd; /* Fundo azul claro */
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateY(-1px);
}

/* Tamanho dos Ícones SVG */
.btn-icon svg,
.btn-profile svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
}

/* --- FIM DA CORREÇÃO --- */

.main-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--color-secondary);
  color: var(--color-white);
  margin-top: 2rem;
}

/* =================================== */
/* 5. Responsividade (Tablet)
/* =================================== */
@media (min-width: 768px) {
  .main-header {
    justify-content: space-between;
  }

  .logo {
    width: auto;
    text-align: left;
  }

  .main-nav ul {
    width: auto;
  }

  .search-and-actions {
    width: auto; /* Deixa o container ocupar apenas o necessário */
  }

  .search-and-actions input {
    width: auto;
    flex-grow: 1;
  }

  .btn-announce {
    flex-grow: 0;
  }
}

/* =================================== */
/* 6. Responsividade (Desktop)
/* =================================== */
@media (min-width: 960px) {
  .main-header {
    flex-wrap: nowrap;
    padding: 1rem 2rem;
  }

  .search-and-actions {
    width: auto;
    gap: 1rem;
  }

  .search-and-actions input {
    min-width: 250px;
  }
}

/* =================================== */
/* 7. Estilos Base (Layout do Card)
/* =================================== */

.login-container {
  display: grid;
  place-items: center; 
  flex-grow: 1; 
  padding: 2rem 1rem;
}

/* =================================== */
/* 9. Estilos dos Botões de Ação (Logout)
/* =================================== */

.btn-logout {
    flex-grow: 1;
    text-align: center;
    padding: 0.8rem;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: bold;
    border: none;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    /* Estilo específico de "perigo" (logout) */
    background-color: var(--color-danger);
    color: var(--color-white);
    font-size: var(--font-size-base);
    width: 100%; 
}

.btn-logout:hover {
    transform: translateY(-1px); 
    box-shadow: 0 4px 12px rgba(44, 62, 80, 0.5); 
}

/* =================================== */
/* 12. Estilos da Página de Perfil
/* =================================== */

/* Container principal da página de perfil */
.profile-container {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 2rem; 
  flex-grow: 1;
  padding: 2rem 1rem;
}

/* Card base */
.profile-card {
  background-color: var(--color-white);
  padding: 2.5rem;
  border-radius: var(--border-radius-md);
  border: var(--main-border);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 700px; 
}

/* Card de Informações */
.info-card {
   text-align: center; 
   max-width: 500px; 
}
.info-card h2 {
  font-size: var(--font-size-xl);
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}
.info-card p {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.profile-info { 
    text-align: left;
    margin-bottom: 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
}
.profile-info .info-item {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
}
.profile-info .info-item:last-child {
    border-bottom: none;
}
.profile-info .info-item strong {
    display: block;
    font-size: 0.9rem;
    color: var(--color-text-light);
    margin-bottom: 0.25rem;
}
.profile-info .info-item span {
    font-size: 1.1rem;
    color: var(--color-text-primary);
    word-break: break-all;
}

.btn-logout { 
    padding: 0.8rem 1.5rem; 
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: bold;
    border: none;
    transition: all 0.2s ease-in-out;
    background-color: var(--color-danger);
    color: var(--color-white);
    font-size: var(--font-size-base);
    display: inline-block; 
    width: auto;
}
.btn-logout:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}


/* --- Estilos para Seção de Atividades --- */
.activity-card h2, .listings-card h2 {
    font-size: var(--font-size-lg);
    color: var(--color-secondary);
    margin-bottom: 0.5rem;
}
.activity-card p, .listings-card p {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
    font-size: var(--font-size-sm);
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.activity-item {
    display: flex;
    flex-wrap: wrap; 
    gap: 0.5rem 1rem; 
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    align-items: center;
}
.activity-type {
    padding: 2px 8px;
    border-radius: 10px;
    color: var(--color-white);
    font-weight: bold;
    font-size: var(--font-size-xs);
    flex-shrink: 0;
}
.activity-type.donation { background-color: var(--color-primary); }
.activity-type.sale { background-color: var(--color-danger); }

.activity-desc {
    font-weight: 500;
    color: var(--color-text-primary);
    flex-grow: 1; 
}
.activity-recipient {
    color: var(--color-text-light);
}
.activity-status {
    font-style: italic;
    color: var(--color-text-secondary);
    margin-left: auto; 
    flex-shrink: 0;
}

/* Placeholder para listas vazias */
.placeholder-text {
    text-align: center;
    color: var(--color-text-muted);
    font-style: italic;
    margin-top: 1rem;
    font-size: var(--font-size-sm) !important; 
}


/* --- Estilos para Seção de Anúncios --- */
.listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
    gap: 1rem;
}

.listing-item-card {
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.listing-item-card img {
    width: 100%;
    height: 120px; 
    object-fit: cover;
}
.listing-info {
    padding: 0.75rem;
}
.listing-info h3 {
    font-size: var(--font-size-sm);
    margin: 0 0 0.3rem 0;
}
.listing-status {
    font-size: var(--font-size-xs);
    font-weight: bold;
    padding: 2px 6px;
    border-radius: var(--border-radius-sm);
    color: var(--color-white);
}
.listing-status.sale { background-color: var(--color-danger); }
.listing-status.donation { background-color: var(--color-primary); }

.listing-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0 0.75rem 0.75rem 0.75rem;
    margin-top: auto; 
}
.listing-actions button {
    flex-grow: 1;
    padding: 0.4rem 0.8rem;
    font-size: var(--font-size-xs);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text-secondary);
}
.listing-actions button:hover {
    background-color: var(--color-border);
    color: var(--color-text-primary);
}


/* Ajustes responsivos */
@media (min-width: 768px) {
    .btn-logout {
        flex-grow: 0; 
    }
}
/* =================================== */
/* Estilos do Pop-up Personalizado (Novo)
/* =================================== */

/* O fundo escuro que cobre a tela inteira */
#custom-alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Preto com 50% de transparência */
    display: flex;
    justify-content: center; /* Centraliza horizontalmente */
    align-items: center; /* Centraliza verticalmente */
    z-index: 9999; /* Garante que fique por cima de tudo */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* Classe adicionada via JS para mostrar o popup com animação */
#custom-alert-overlay.show {
    opacity: 1;
    visibility: visible;
}

/* A caixa branca do popup */
#custom-alert-box {
    background-color: var(--color-white, #fff);
    padding: 2rem;
    border-radius: 12px; /* Bordas bem arredondadas */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Sombra suave */
    text-align: center;
    max-width: 400px;
    width: 90%;
    transform: translateY(20px); /* Começa um pouco mais para baixo */
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efeito de "pulo" suave */
}

/* Anima a caixa subindo quando o overlay aparece */
#custom-alert-overlay.show #custom-alert-box {
    transform: translateY(0);
}

/* O botão "Entendido" dentro do popup */
#custom-alert-btn {
    background-color: var(--color-primary, #3498db);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 30px; /* Botão estilo pílula */
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
}

#custom-alert-btn:hover {
    background-color: #2980b9; /* Cor um pouco mais escura no hover */
    transform: translateY(-2px);
}

#custom-alert-btn:active {
    transform: translateY(0);
}
