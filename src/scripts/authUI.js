// src/scripts/authUI.js

/**
 * Gerencia a interface do usuário relacionada à autenticação e funcionalidades globais.
 */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    
    // Seletores globais
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const profileBtn = document.getElementById('profileBtn');
    const announceBtn = document.getElementById('announceBtn');
    const chatBtn = document.getElementById('chatBtn');
    const notifyBtn = document.getElementById('notifyBtn');

    // --- 1. INJEÇÃO DE ESTILOS GLOBAIS (POP-UP) ---
    // Adiciona o CSS do pop-up dinamicamente para funcionar em todas as páginas
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-alert-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex; justify-content: center; align-items: center;
            z-index: 9999; opacity: 0; visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        #custom-alert-overlay.show { opacity: 1; visibility: visible; }
        #custom-alert-box {
            background-color: #fff; padding: 2rem; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); text-align: center;
            max-width: 400px; width: 90%; transform: translateY(20px);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: Arial, sans-serif;
        }
        #custom-alert-overlay.show #custom-alert-box { transform: translateY(0); }
        #custom-alert-btn {
            background-color: #3498db; color: white; border: none;
            padding: 0.8rem 2rem; font-size: 1rem; font-weight: bold;
            border-radius: 30px; cursor: pointer; margin-top: 1rem;
            transition: background-color 0.2s, transform 0.2s;
        }
        #custom-alert-btn:hover { background-color: #2980b9; transform: translateY(-2px); }
        #custom-alert-btn:active { transform: translateY(0); }
        #custom-alert-title { color: #2c3e50; margin-bottom: 0.5rem; margin-top: 0; }
        #custom-alert-msg { color: #7f8c8d; font-size: 0.95rem; margin-bottom: 1.5rem; }
    `;
    document.head.appendChild(style);

    // --- 2. FUNÇÃO GLOBAL DE POP-UP ---
    window.showDevelopmentAlert = function(titulo = 'Em Desenvolvimento', mensagem = 'Esta funcionalidade estará disponível em breve.') {
        const existingOverlay = document.getElementById('custom-alert-overlay');
        if (existingOverlay) existingOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'custom-alert-overlay';
        
        overlay.innerHTML = `
            <div id="custom-alert-box">
                <div style="margin-bottom: 1rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h3 id="custom-alert-title">${titulo}</h3>
                <p id="custom-alert-msg">${mensagem}</p>
                <button id="custom-alert-btn">Entendido</button>
            </div>
        `;

        document.body.appendChild(overlay);

        const btn = overlay.querySelector('#custom-alert-btn');
        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };
        btn.onclick = close;
        overlay.onclick = (e) => { if(e.target === overlay) close(); };

        setTimeout(() => overlay.classList.add('show'), 10);
    };

    // --- 3. LÓGICA GERAL DE BOTÕES ---

    // Aplica o pop-up aos botões de "Conversar" (classe .btn-chat)
    const chatButtons = document.querySelectorAll('.btn-chat');
    chatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.showDevelopmentAlert('Chat', 'O sistema de mensagens estará disponível em breve.');
        });
    });

    // Aplica o pop-up aos botões de "Doar Agora" (classe .btn-donate) [NOVO]
    const donateButtons = document.querySelectorAll('.btn-donate');
    donateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o redirecionamento padrão
            window.showDevelopmentAlert('Doação', 'O fluxo de doações estará disponível em breve.');
        });
    });

    // Lógica de Autenticação
    if (token) {
        // --- USUÁRIO LOGADO ---
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        if (profileBtn) profileBtn.style.display = 'flex';
        if (chatBtn) chatBtn.style.display = 'flex';
        if (notifyBtn) notifyBtn.style.display = 'flex';

        if (announceBtn) announceBtn.href = 'anuncio.html';

        // Ação do Botão de Notificação
        if (notifyBtn) {
            notifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.showDevelopmentAlert('Notificações', 'Você não possui novas notificações no momento.');
            });
        }

    } else {
        // --- USUÁRIO DESLOGADO ---
        if (loginBtn) loginBtn.style.display = 'flex';
        if (registerBtn) registerBtn.style.display = 'flex';

        if (profileBtn) profileBtn.style.display = 'none';
        if (chatBtn) chatBtn.style.display = 'none';
        if (notifyBtn) notifyBtn.style.display = 'none';

        if (announceBtn) announceBtn.href = 'login.html';
        
        // Proteção de Rotas
        const currentPath = window.location.pathname;
        const protectedPages = ['perfil.html', 'anuncio.html', 'donate.html', 'chat.html'];
        const isProtectedPage = protectedPages.some(page => currentPath.includes(page));

        if (isProtectedPage) {
            console.warn("Acesso negado: Redirecionando para login.");
            window.location.href = 'login.html';
        }
    }
});
