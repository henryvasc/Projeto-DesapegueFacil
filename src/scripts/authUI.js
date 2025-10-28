/**
 * Gerencia a interface do usuário relacionada à autenticação.
 * Mostra/esconde botões (Login, Cadastro, Perfil, Chat, etc.)
 * e protege rotas baseando-se na presença de um token JWT no localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    
    // Seleciona botões de autenticação no header.
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    // Seleciona botões de ação no header.
    const announceBtn = document.getElementById('announceBtn');
    const chatBtn = document.getElementById('chatBtn');
    const notifyBtn = document.getElementById('notifyBtn');

    if (token) {
        // --- CENÁRIO: USUÁRIO LOGADO ---

        // Esconde "Entrar" e "Cadastrar".
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        // Mostra "Perfil", "Chat" e "Notificações".
        if (profileBtn) profileBtn.style.display = 'flex';
        if (chatBtn) chatBtn.style.display = 'flex';
        if (notifyBtn) notifyBtn.style.display = 'flex';

        // Botão "Anunciar" leva para a página de criar anúncio.
        if (announceBtn) {
            announceBtn.href = 'anuncio.html';
        }

        // A lógica de preenchimento da página de perfil foi movida para perfil.js
        // A lógica de logout foi movida para perfil.js

    } else {
        // --- CENÁRIO: USUÁRIO DESLOGADO ---

        // Mostra "Entrar" e "Cadastrar".
        if (loginBtn) loginBtn.style.display = 'flex';
        if (registerBtn) registerBtn.style.display = 'flex';

        // Esconde "Perfil", "Chat" e "Notificações".
        if (profileBtn) profileBtn.style.display = 'none';
        if (chatBtn) chatBtn.style.display = 'none';
        if (notifyBtn) notifyBtn.style.display = 'none';

        // Botão "Anunciar" leva para a página de login.
        if (announceBtn) {
            announceBtn.href = 'login.html';
        }
        
        // Protege páginas que exigem login, redirecionando para login.html.
        const path = window.location.pathname;
        const protectedPaths = ['/perfil.html', '/anuncio.html', '/donate.html']; // Adicionado donate.html
        if (protectedPaths.some(p => path.endsWith(p))) {
             // A verificação de login para donate.html também está em donate-wizard.js
            console.warn("Usuário deslogado tentou acessar página protegida. Redirecionando para login.");
            window.location.href = 'login.html';
        }
    }
});