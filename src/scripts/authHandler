// ===============================================
// authHandler.js
// Gerencia os formulários de login e cadastro.
// ===============================================

// --- Simulação de Tokens JWT ---
// Payload Padrão Usuário: {"sub":"123","name":"Usuário DesapegueFácil","iat":1516239022}
const FAKE_JWT_TOKEN_USER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVXN1w6FyaW8gRGVzYXBlZ3VlRsOhY2lsIiwiaWF0IjoxNTE2MjM5MDIyfQ.N_02-t1m6TppB-1z5Um361nHSNl-iQGjYk6Pqf-c3kY";
// Payload Padrão Instituição: {"sub":"789","name":"ONG Instituição Exemplo","iat":1516239022,"type":"institution"}
const FAKE_JWT_TOKEN_INST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ODkiLCJuYW1lIjoiT05HIEluc3RpdHVpw6fDo28gRXhlbXBsbyIsImlhdCI6MTUxNjIzOTAyMiwidHlwZSI6Imluc3RpdHV0aW9uIn0.kswh-ztjOkx1wY1zLzC-Ld5s-iG9A-aZ-G-P-Y-k_kY";

/**
 * Alterna a visibilidade do campo de senha entre 'password' e 'text'.
 * @param {HTMLInputElement} inputEl - O elemento input da senha.
 * @param {HTMLButtonElement} buttonEl - O botão que aciona a visibilidade.
 */
function togglePasswordVisibility(inputEl, buttonEl) {
    if (!inputEl || !buttonEl) return;
    
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    
    const iconEye = buttonEl.querySelector('.icon-eye');
    const iconEyeOff = buttonEl.querySelector('.icon-eye-off');
    if (iconEye) iconEye.style.display = isPassword ? 'none' : 'block';
    if (iconEyeOff) iconEyeOff.style.display = isPassword ? 'block' : 'none';
    buttonEl.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

/**
 * Decodifica o payload de um token JWT de forma segura.
 * @param {string} token - O token JWT.
 * @returns {object|null} O payload decodificado ou null em caso de erro.
 */
function parseJwtPayload(token) {
    // CORREÇÃO DE BUG (Gravidade Alta): Verifica se o token existe antes de tentar dividir
    if (!token || typeof token !== 'string') {
        return null;
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null; // Estrutura inválida

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    
    // --- Lógica de Login ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            
            localStorage.setItem("jwtToken", FAKE_JWT_TOKEN_USER); 
            
            if (!localStorage.getItem('userData')) {
                const fakeUserData = {
                    name: "Usuário (Login)",
                    email: "email-login@exemplo.com",
                    type: "pessoa"
                };
                localStorage.setItem('userData', JSON.stringify(fakeUserData));
            }

            window.location.href = "index.html"; .
        });
        
  
        const loginSenhaInput = loginForm.querySelector("#senha");
        const loginToggleBtn = loginForm.querySelector("#toggleSenhaLogin");
        if (loginToggleBtn) {
            loginToggleBtn.addEventListener('click', () => {
                togglePasswordVisibility(loginSenhaInput, loginToggleBtn);
            });
        }
    }

    // --- Lógica de Cadastro (register.html) ---
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        
        // Seleção dos elementos do formulário de cadastro.
        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const senha = document.getElementById("senha");
        const confirmarSenha = document.getElementById("confirmar-senha");
        const termos = document.getElementById("termos");
        const barraForca = document.getElementById("barra-forca");
        const hintNome = document.getElementById("hint-nome");
        const hintEmail = document.getElementById("hint-email");
        const hintSenha = document.getElementById("hint-senha");
        const hintConfirmarSenha = document.getElementById("hint-confirmar-senha");
        const hintTermos = document.getElementById("hint-termos");
        const btnEnviar = document.getElementById("btn-enviar");
        const toggleSenha = document.getElementById("toggleSenha");
        const toggleConfirmarSenha = document.getElementById("toggleConfirmarSenha");
        const tipoContaRadios = registerForm.querySelectorAll('input[name="tipo_conta"]');

        // Funções de validação 
        const reMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const vNome = val => val.trim().length >= 3;
        const vMail = val => reMail.test(val.trim());
        const vTermos = val => val === true;
        const vConfirmarSenha = (valSenha, valConfirmar) => valSenha === valConfirmar;

        
        function scoreSenha(v) {
            let pontuacao = 0;
            if (v.length >= 8) pontuacao += 30;
            if (/[A-Z]/.test(v)) pontuacao += 20;
            if (/[a-z]/.test(v)) pontuacao += 20;
            if (/\d/.test(v)) pontuacao += 15;
            if (/[^A-Za-z0-9]/.test(v)) pontuacao += 15;
            return Math.min(pontuacao, 100);
        }

        
        function setEstado(campo, hintEl, valido, msgOK, msgERRO) {
            if (!hintEl) return;
            campo.classList.toggle("ok", valido);
            campo.classList.toggle("erro", !valido);
            if(campo.setAttribute) campo.setAttribute("aria-invalid", String(!valido));
            hintEl.textContent = valido ? msgOK : msgERRO;
        }

       
        function setBarra(pct) {
            if (!barraForca) return;
            barraForca.style.width = pct + "%";
            barraForca.className = ""; 
            if (pct < 40) barraForca.classList.add("fraca");
            else if (pct < 80) barraForca.classList.add("media");
            else barraForca.classList.add("forte");
        }

     
        function revalidarRegistro() {
            const nomeValido = vNome(nome.value);
            const emailValido = vMail(email.value);
            const pontuacaoSenha = scoreSenha(senha.value);
            const senhaValida = pontuacaoSenha >= 40; 
            
            // Só valida a confirmação se a senha principal já tiver algo digitado
            const confirmarSenhaValido = senha.value.length > 0 && vConfirmarSenha(senha.value, confirmarSenha.value);
            const termosValidos = vTermos(termos.checked);

            setEstado(nome, hintNome, nomeValido, "Nome válido.", "O nome deve ter no mínimo 3 caracteres.");
            setEstado(email, hintEmail, emailValido, "E-mail válido.", "Formato de e-mail inválido.");
            setBarra(pontuacaoSenha);
            setEstado(senha, hintSenha, senhaValida, "Senha forte o suficiente.", "Use 8+ caracteres, maiúsculas, números e símbolos.");
            
            if (senha.value.length > 0) {
                setEstado(confirmarSenha, hintConfirmarSenha, confirmarSenhaValido, "As senhas coincidem.", "As senhas não coincidem.");
            } else {
                if (hintConfirmarSenha) hintConfirmarSenha.textContent = "";
                confirmarSenha.classList.remove("ok", "erro");
            }
            
            setEstado(termos.parentElement, hintTermos, termosValidos, "", "Você deve aceitar os termos.");

            const tudoOK = nomeValido && emailValido && senhaValida && confirmarSenhaValido && termosValidos;
            btnEnviar.disabled = !tudoOK; // Habilita/desabilita botão de envio
            
            return tudoOK;
        }

        // Adiciona listeners para validar campos em tempo real.
        nome.addEventListener("blur", revalidarRegistro);
        email.addEventListener("blur", revalidarRegistro);
        senha.addEventListener("input", revalidarRegistro);
        confirmarSenha.addEventListener("input", revalidarRegistro); 
        termos.addEventListener("change", revalidarRegistro);

        // Configura botões de visibilidade de senha.
        if (toggleSenha) {
            toggleSenha.addEventListener('click', () => {
                togglePasswordVisibility(senha, toggleSenha);
            });
        }
        if (toggleConfirmarSenha) {
            toggleConfirmarSenha.addEventListener('click', () => {
                togglePasswordVisibility(confirmarSenha, toggleConfirmarSenha);
            });
        }

        // Listener para redirecionar para o cadastro de ONG.
        tipoContaRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'instituicao') {
                    window.location.href = 'register-ong.html'; 
                } 
            });
        });

        // Listener de submissão do formulário (apenas Pessoa Física).
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            
            if (revalidarRegistro()) {
                
                // Salva dados simulados no localStorage.
                const userData = {
                    name: nome.value,
                    email: email.value,
                    type: "pessoa"
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem("jwtToken", FAKE_JWT_TOKEN_USER); // Salva token simulado.
                
                window.location.href = "index.html";
                // Limpa o formulário após o envio (simulado).
                registerForm.reset();
                setBarra(0);
                revalidarRegistro(); // Revalida para resetar estado visual.
            }
        });

        // Executa a validação inicial ao carregar a página.
        revalidarRegistro();
    }
});
