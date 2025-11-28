// src/scripts/perfil.js

document.addEventListener('DOMContentLoaded', () => {

    // Função auxiliar para decodificar JWT (mantida do original)
    function parseJwtPayload(token) {
         if (!token) return null;
         try { return JSON.parse(atob(token.split('.')[1])); } catch(e) { return null; }
    }

    // --- Função para criar e mostrar o popup personalizado ---
    function showDevelopmentAlert() {
        //  Remove popup anterior se houver (limpeza)
        const existingOverlay = document.getElementById('custom-alert-overlay');
        if (existingOverlay) existingOverlay.remove();

        // Cria os elementos HTML do popup dinamicamente
        
        // O fundo escuro transparente
        const overlay = document.createElement('div');
        overlay.id = 'custom-alert-overlay';

        // A caixa branca do popup
        const box = document.createElement('div');
        box.id = 'custom-alert-box';

        // Ícone de "Construção/Aviso" (SVG)
        const iconContainer = document.createElement('div');
        iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        iconContainer.style.marginBottom = '1rem';

        // Título Principal
        const title = document.createElement('h3');
        title.innerText = 'Em Desenvolvimento';
        title.style.color = '#2c3e50';
        title.style.marginBottom = '0.5rem';

        // Mensagem secundária
        const message = document.createElement('p');
        message.innerText = 'A funcionalidade de edição estará disponível em breve.';
        message.style.color = '#7f8c8d';
        message.style.fontSize = '0.95rem';
        message.style.marginBottom = '1.5rem';

        // Botão "Entendido"
        const button = document.createElement('button');
        button.innerText = 'Entendido';
        button.id = 'custom-alert-btn';
        
        // Ação de fechar o popup
        button.onclick = () => {
            overlay.classList.remove('show'); // Inicia animação de saída
            setTimeout(() => overlay.remove(), 300); // Remove do HTML após a animação
        };

        //  Monta a estrutura e adiciona ao corpo da página
        box.appendChild(iconContainer);
        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(button);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Força um pequeno delay para ativar a animação CSS (classe 'show')
        setTimeout(() => overlay.classList.add('show'), 10);
    }
    


    const profilePageIdentifier = document.querySelector(".profile-card.info-card"); 
    if (profilePageIdentifier) {
        
        
        const profileNameEl = document.getElementById("profile-name");
        const profileEmailEl = document.getElementById("profile-email");
        const logoutBtn = document.getElementById("logoutBtn");

        const token = localStorage.getItem("jwtToken");
        const userDataString = localStorage.getItem("userData");
        
        if (token && userDataString) {
            const userData = JSON.parse(userDataString);
            if (profileNameEl) profileNameEl.textContent = userData.name || "Não informado";
            if (profileEmailEl) profileEmailEl.textContent = userData.email || "Não informado";
        } else {
            
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("userData");
                window.location.href = "index.html";
            });
        }

        // --- LÓGICA DOS BOTÕES ATUALIZADA ---
        const actionButtons = document.querySelectorAll('.listing-actions button');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase();
                const card = this.closest('.listing-item-card');
                const statusBadge = card.querySelector('.listing-status');

                if (action === 'editar') {
                    
                    
                    // Em vez de alert(), chamamos nossa nova função:
                    showDevelopmentAlert();

                } else if (action === 'desativar') {
                    if(confirm(`Pausar este anúncio?`)) {
                        statusBadge.textContent = 'Pausado';
                        statusBadge.style.backgroundColor = '#7f8c8d';
                        this.textContent = 'Ativar';
                    }
                } else if (action === 'ativar') {
                    statusBadge.textContent = 'Venda Ativa';
                    statusBadge.style.backgroundColor = ''; 
                    this.textContent = 'Desativar';
                }
            });
        });
    }
});

