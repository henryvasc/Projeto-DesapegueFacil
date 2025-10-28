// ===============================================
// register-ong-wizard.js
// Lógica do formulário de cadastro de ONG em etapas (wizard).
// Controla a navegação, validação e submissão final.
// ===============================================

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

document.addEventListener('DOMContentLoaded', () => {

    const wizardForm = document.getElementById('ongWizardForm');
    if (!wizardForm) {
        console.error("ERRO CRÍTICO: Formulário #ongWizardForm não encontrado!");
        return;
    }

    // --- Constantes e Variáveis ---
    // Token JWT falso para simular autenticação da instituição após cadastro.
    const FAKE_JWT_TOKEN_INST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ODkiLCJuYW1lIjoiT05HIEluc3RpdHVpw6fDo28gRXhlbXBsbyIsImlhdCI6MTUxNjIzOTAyMiwidHlwZSI6Imluc3RpdHV0aW9uIn0.kswh-ztjOkx1wY1zLzC-Ld5s-iG9A-aZ-G-P-Y-k_kY";
    
    // Seletores dos Elementos do Wizard
    const steps = Array.from(wizardForm.querySelectorAll('.wizard-step-content'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn'); // Botão "Finalizar Cadastro"
    const progressBarFill = document.getElementById('progress-bar-fill');
    const stepSubtitle = document.getElementById('step-subtitle');
    let currentStep = 0; // Índice do passo atual (0-based).

    if (!prevBtn || !nextBtn || !submitBtn) {
        console.error("ERRO CRÍTICO: Botões de navegação (prevBtn, nextBtn, submitBtn) não encontrados!");
        return;
    }

    // Dados de configuração para cada passo (subtítulo e progresso).
    const stepData = [
        { subtitle: "Passo 1 de 5 - Informações Básicas da ONG", progress: "20%" },
        { subtitle: "Passo 2 de 5 - Contato e Responsável", progress: "40%" },
        { subtitle: "Passo 3 de 5 - Localização", progress: "60%" },
        { subtitle: "Passo 4 de 5 - Documentação e Verificação", progress: "80%" },
        { subtitle: "Passo 5 de 5 - Necessidades e Finalização", progress: "100%" }
    ];

    // --- Funções do Wizard ---

    /**
     * Valida os campos obrigatórios ('required') do passo especificado.
     * @param {number} stepIndex - O índice do passo a ser validado.
     * @returns {boolean} True se o passo for válido, False caso contrário.
     */
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        if (!currentStepElement) return false;
        
        const inputs = currentStepElement.querySelectorAll('[required]');
        let allValid = true;

        inputs.forEach(input => {
            input.style.borderColor = ''; // Limpa validação visual anterior.
            let isValid = true;
            if (input.type === 'checkbox') {
                isValid = input.checked;
            } else {
                isValid = input.value.trim() !== '';
            }

            if (!isValid) {
                allValid = false;
                input.style.borderColor = 'red'; // Marca campo inválido.
            }
        });

        // Validação específica do Passo 4: Simular que um documento foi "enviado".
        if (stepIndex === 3) { // Índice 3 corresponde ao Passo 4
             const docPreview = document.getElementById('doc-preview-container');
             if (docPreview && !docPreview.querySelector('.doc-preview-item')) {
                 alert('É necessário enviar pelo menos um documento (simulado).');
                 // Encontra o dropzone e adiciona borda vermelha (opcional)
                 const dropzone = document.getElementById('doc-dropzone');
                 if(dropzone) dropzone.style.borderColor = 'red';
                 allValid = false;
             } else {
                 // Limpa borda do dropzone se válido (opcional)
                 const dropzone = document.getElementById('doc-dropzone');
                 if(dropzone) dropzone.style.borderColor = '';
             }
        }

        if (!allValid && !(stepIndex === 3 && !docPreviewContainer.querySelector('.doc-preview-item'))) {
            // Evita alert duplicado no passo 4 se o problema for a falta de documento.
            alert('Por favor, preencha todos os campos obrigatórios (*).');
        }
        return allValid;
    }

    /** Exibe o passo especificado e atualiza a UI (barra de progresso, botões). */
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        progressBarFill.style.width = stepData[stepIndex].progress;
        stepSubtitle.textContent = stepData[stepIndex].subtitle;
        prevBtn.disabled = (stepIndex === 0);
        nextBtn.style.display = (stepIndex === steps.length - 1) ? 'none' : 'block';
        submitBtn.style.display = (stepIndex === steps.length - 1) ? 'block' : 'none';
    }

    /** Aplica máscara de telefone (delegado para phoneMask.js). */
    function formatPhone(e) {
        // A lógica de formatação agora está centralizada em phoneMask.js
        // Apenas chamamos a função global `formatPhone` se ela existir.
        if (typeof window.formatPhone === 'function') {
            window.formatPhone(e); 
        } else {
            // Fallback simples se phoneMask.js não carregar
             let value = e.target.value.replace(/\D/g, '');
             if (value.length > 11) value = value.substring(0, 11);
             e.target.value = value;
        }
    }

    // --- Event Listeners ---

    // Botão "Próximo"
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    // Botão "Anterior"
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Botão "Finalizar Cadastro" (Submit)
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário.

        // Valida o último passo antes de finalizar.
        if (validateStep(currentStep)) {
            // Simulação de cadastro bem-sucedido.
            
            // Coleta nome e email para salvar no localStorage.
            const ongName = wizardForm.querySelector('#nome-org')?.value || "ONG Cadastrada";
            const ongEmail = wizardForm.querySelector('#email-org')?.value || "ong@email.com";
            const userData = { name: ongName, email: ongEmail, type: "instituicao" };

            try {
                // Salva dados e token simulado no localStorage.
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem("jwtToken", FAKE_JWT_TOKEN_INST);

                alert("Cadastro da organização finalizado com sucesso! (Simulação)");
                window.location.href = "index.html"; // Redireciona para a página inicial.

            } catch (error) {
                console.error("Erro ao salvar dados ou redirecionar:", error);
                alert("Ocorreu um erro ao finalizar o cadastro.");
            }
        }
    });


    // --- Lógicas Específicas dos Passos ---

    // Aplica máscara aos campos de telefone.
    const telefoneOrgInput = document.getElementById('telefone-org');
    if (telefoneOrgInput) telefoneOrgInput.addEventListener('input', formatPhone);
    const telefoneRespInput = document.getElementById('telefone-resp');
    if (telefoneRespInput) telefoneRespInput.addEventListener('input', formatPhone);

    // Simulação de Dropzone de Documentos (Passo 4)
    const docDropzone = document.getElementById('doc-dropzone');
    const docPreviewContainer = document.getElementById('doc-preview-container');
    if (docDropzone && docPreviewContainer) {
        docDropzone.addEventListener('click', () => {
            // Permite adicionar apenas um documento simulado.
            if (docPreviewContainer.querySelector('.doc-preview-item')) return; 
            
            const docPreview = document.createElement('div');
            docPreview.className = 'doc-preview-item';
            docPreview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> <span>Documento_Simulado.pdf</span>`;
            docPreviewContainer.appendChild(docPreview);
            docDropzone.style.borderColor = ''; // Limpa borda vermelha se houver
        });
    }

    // Seleção de Cards de Necessidades (Passo 5)
    const needsCards = wizardForm.querySelectorAll('.needs-card');
    needsCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active'); // Adiciona/remove a classe 'active' ao clicar.
        });
    });

    // Simulação de Dropzone de Fotos da ONG (Passo 5)
    const fotoDropzone = document.getElementById('foto-dropzone-ong');
    const fotoPreviewContainer = document.getElementById('foto-preview-container');
    if (fotoDropzone && fotoPreviewContainer) {
        fotoDropzone.addEventListener('click', () => {
            // Permite adicionar apenas uma foto simulada.
            if (fotoPreviewContainer.querySelector('img')) return; 
            
            const img = document.createElement('img');
            // URL de imagem placeholder.
            img.src = "https://via.placeholder.com/200x150/cccccc/888888?text=Foto+ONG"; 
            img.alt = "Preview da foto da ONG";
            fotoPreviewContainer.appendChild(img);
        });
    }


    // --- Inicialização ---
    showStep(currentStep); // Exibe o primeiro passo ao carregar a página.

});