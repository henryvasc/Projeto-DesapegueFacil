// ===============================================
// perfil.js
// Gerencia a exibição de dados na página de perfil (perfil.html)
// e a funcionalidade de logout.
// ===============================================

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Decodifica o payload de um token JWT (sem verificar assinatura).
     * @param {string} token - O token JWT.
     * @returns {object|null} O payload decodificado ou null em caso de erro.
     */
    function parseJwtPayload(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Erro ao decodificar o JWT:", e);
            return null;
        }
    }

    // --- Lógica da Página de Perfil ---
    // Verifica se estamos na página de perfil procurando por um elemento específico dela.
    const profilePageIdentifier = document.querySelector(".profile-card.info-card"); 
    if (profilePageIdentifier) {
        
        // --- Seleção dos Elementos da Página ---
        const profileNameEl = document.getElementById("profile-name");
        const profileEmailEl = document.getElementById("profile-email");
        const profileIdEl = document.getElementById("profile-id");
        const logoutBtn = document.getElementById("logoutBtn");

        // --- Obtenção dos Dados de Autenticação ---
        const token = localStorage.getItem("jwtToken");
        // 'userData' é salvo durante o login/cadastro (em authHandler.js)
        const userDataString = localStorage.getItem("userData"); 
        
        if (token && userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                const payload = parseJwtPayload(token); // Decodifica o token para pegar o ID (sub)

                // --- Preenchimento das Informações do Perfil ---
                // Usa os dados do 'userData' (mais confiáveis, salvos no registro) para nome e email.
                if (profileNameEl) profileNameEl.textContent = userData.name || "Não informado";
                if (profileEmailEl) profileEmailEl.textContent = userData.email || "Não informado";
                
                // Usa o 'sub' (subject/ID) do payload do token para o ID do usuário.
                if (profileIdEl && payload) profileIdEl.textContent = payload.sub || "Não informado";

            } catch (error) {
                 console.error("Erro ao processar dados do usuário ou token:", error);
                 // Trata o caso de dados inválidos no localStorage como não autenticado.
                 window.location.href = "login.html";
                 return;
            }
            
        } else {
            // Se não há token ou userData, o usuário não deveria estar nesta página.
            // A proteção de rota em authUI.js geralmente cuida disso, mas é uma segurança adicional.
            console.error("Dados de usuário ou token não encontrados no localStorage. Redirecionando para login.");
            window.location.href = "login.html";
            return;
        }

        // --- Funcionalidade do Botão "Sair" (Logout) ---
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("jwtToken"); // Remove o token.
                localStorage.removeItem("userData"); // Remove os dados do usuário.
                window.location.href = "index.html"; // Redireciona para a página inicial.
            });
        } else {
             console.warn("Botão de logout #logoutBtn não encontrado na página de perfil.");
        }
    }
    // Se profilePageIdentifier não for encontrado, o script simplesmente não faz nada (não está na página de perfil).
});