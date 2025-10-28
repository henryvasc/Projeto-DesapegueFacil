/**
 * Controla a lógica do formulário de doação em múltiplas etapas (wizard).
 * Gerencia a navegação entre passos, validação, atualização do resumo
 * e o envio final (simulado).
 */

/**
 * Decodifica o payload de um token JWT (sem verificar a assinatura).
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
    } catch (e) { console.error("Erro ao decodificar o JWT:", e); return null; }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[DONATE WIZARD] Script iniciado.");

    // --- VERIFICAÇÃO DE LOGIN ---
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.warn("[DONATE WIZARD] Usuário não logado. Redirecionando para login.");
        alert("Você precisa estar logado para fazer uma doação.");
        // Redireciona para login se não houver token.
        window.location.href = 'login.html';
        return; // Interrompe a execução do script.
    }
    console.log("[DONATE WIZARD] Usuário logado encontrado.");

    const wizardForm = document.getElementById('donationWizardForm');
    if (!wizardForm) {
        console.error("[DONATE WIZARD] Formulário #donationWizardForm não encontrado!");
        return;
    }

    // --- Seletores de Elementos ---
    const steps = Array.from(wizardForm.querySelectorAll('.wizard-step-content'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const confirmBtn = document.getElementById('confirmBtn'); // Botão Confirmar Doação
    const progressBarFill = document.getElementById('progress-bar-fill');
    const stepSubtitle = document.getElementById('step-subtitle');
    const deliveryOptions = wizardForm.querySelectorAll('input[name="delivery_option"]');
    const donorAddressGroup = document.getElementById('donor-address-group');
    const donorAddressInput = document.getElementById('donor-address');
    const itemsListContainer = document.getElementById('added-items-list'); // Lista de itens adicionados

    // Validação da existência dos elementos essenciais.
    if (!prevBtn || !nextBtn || !confirmBtn || !donorAddressGroup || !donorAddressInput || !itemsListContainer) {
        console.error("[DONATE WIZARD] Elementos essenciais (botões, grupo de endereço ou lista de itens) não encontrados!");
        return;
    }

    let currentStep = 0; // Índice do passo atual (0-based).
    const stepData = [ // Metadados para cada passo.
        { subtitle: "Passo 1 de 3 - Itens para Doação", progress: "33.3%" },
        { subtitle: "Passo 2 de 3 - Seus Dados e Entrega", progress: "66.6%" },
        { subtitle: "Passo 3 de 3 - Confirmar Doação", progress: "100%" }
    ];
    let itemsAdded = itemsListContainer.querySelectorAll('.item-summary-line').length > 0; // Verifica se já há itens (exemplo inicial)

    /**
     * Valida os campos obrigatórios ([required]) do passo atual.
     * @param {number} stepIndex - O índice do passo a ser validado.
     * @returns {boolean} True se o passo for válido, False caso contrário.
     */
    function validateStep(stepIndex) {
        console.log(`[DONATE WIZARD] Validando passo ${stepIndex + 1}`);
        const currentStepElement = steps[stepIndex];
        if (!currentStepElement) return false;
        
        const inputs = currentStepElement.querySelectorAll('[required]');
        let allValid = true;

        inputs.forEach(input => {
            input.style.borderColor = ''; // Limpa validação visual anterior.
            const label = wizardForm.querySelector(`label[for="${input.id}"]`);
            if (label) label.style.borderColor = ''; // Limpa borda do label (para radios)

            let isValid = true;
            if (input.type === 'checkbox') {
                isValid = input.checked;
            } else if (input.type === 'radio' && input.name) {
                // Valida se alguma opção do grupo de radio foi selecionada.
                const radioGroup = wizardForm.querySelectorAll(`input[name="${input.name}"]`);
                isValid = Array.from(radioGroup).some(radio => radio.checked);
                // Marca borda de todos os labels do grupo se nenhum for válido.
                if (!isValid) {
                    radioGroup.forEach(radio => {
                        const radioLabel = wizardForm.querySelector(`label[for="${radio.id}"]`);
                        if (radioLabel && radioLabel.classList.contains('option-card')) { // Aplica só aos cards
                             radioLabel.style.borderColor = 'red';
                        }
                    });
                }
            } else { // Inputs de texto, select, etc.
                isValid = input.value.trim() !== '';
            }

            // Aplica estilo de erro se inválido (exceto para radios individuais).
            if (!isValid && input.type !== 'radio') {
                allValid = false;
                input.style.borderColor = 'red';
                console.warn(`[DONATE WIZARD] Campo inválido:`, input.id || input.name || input);
            }
        });

        // Validação específica do Passo 1: Pelo menos um item adicionado.
        if (stepIndex === 0 && !itemsAdded) {
            console.warn("[DONATE WIZARD] Validação passo 1: Nenhum item adicionado.");
            alert('Adicione pelo menos um item para doar antes de continuar.');
            allValid = false;
        }

        if (!allValid && stepIndex !== 0) { // Evita alerta duplicado no passo 1.
            alert('Por favor, preencha todos os campos obrigatórios marcados com (*).');
        } else if (allValid) {
             console.log("[DONATE WIZARD] Validação OK.");
        }
        
        return allValid;
    }

    /**
     * Atualiza o resumo dos dados no passo de confirmação.
     */
    function updateConfirmationSummary() {
        console.log("[DONATE WIZARD] Atualizando resumo da confirmação...");
        const name = document.getElementById('donor-name')?.value || 'Não informado';
        const email = document.getElementById('donor-email')?.value || 'Não informado';
        const phone = document.getElementById('donor-phone')?.value || 'Não informado';
        const deliveryOption = wizardForm.querySelector('input[name="delivery_option"]:checked');
        const deliveryText = deliveryOption?.value === 'entrega' ? 'Entrega na instituição' : 'Retirada no local';
        const dateInput = document.getElementById('preferred-date');
        const address = document.getElementById('donor-address')?.value || 'Não aplicável';
        let dateText = 'Não informada';

        if (dateInput && dateInput.value) {
            try { // Formata a data AAAA-MM-DD para DD/MM/AAAA
                 const [year, month, day] = dateInput.value.split('-');
                 dateText = `${day}/${month}/${year}`;
            } catch (e) {
                console.warn("Erro ao formatar data:", e);
                dateText = dateInput.value; // Usa o valor original em caso de erro.
            }
        }

        // Atualiza os elementos <span> no HTML do passo 3.
        const confirmNameEl = document.getElementById('confirm-name');
        const confirmEmailEl = document.getElementById('confirm-email');
        const confirmPhoneEl = document.getElementById('confirm-phone');
        const confirmDeliveryEl = document.getElementById('confirm-delivery');
        const confirmDateEl = document.getElementById('confirm-date');
        const confirmAddressEl = document.getElementById('confirm-address'); // Elemento para endereço

        if (confirmNameEl) confirmNameEl.textContent = name;
        if (confirmEmailEl) confirmEmailEl.textContent = email;
        if (confirmPhoneEl) confirmPhoneEl.textContent = phone;
        if (confirmDeliveryEl) confirmDeliveryEl.textContent = deliveryText;
        if (confirmDateEl) confirmDateEl.textContent = dateText;
        // Atualiza o endereço, mostrando apenas se for retirada
        if (confirmAddressEl) {
             confirmAddressEl.textContent = (deliveryOption?.value === 'retirada') ? address : 'Não aplicável';
             // Opcional: esconder/mostrar o parágrafo inteiro
             confirmAddressEl.closest('p').style.display = (deliveryOption?.value === 'retirada') ? 'block' : 'none';
        }


        // TODO: Atualizar a lista de itens no resumo dinamicamente.
        // Isso exigiria armazenar os itens adicionados (ex: em um array)
        // e gerar o HTML da lista <ul> aqui.
    }

    /**
     * Exibe o passo especificado e atualiza a UI (barra de progresso, botões).
     * @param {number} stepIndex - O índice do passo a ser exibido.
     */
    function showStep(stepIndex) {
         console.log(`[DONATE WIZARD] Mostrando passo ${stepIndex + 1}`);
        // Alterna a classe 'active' entre os fieldsets.
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        // Atualiza a barra de progresso e o subtítulo.
        progressBarFill.style.width = stepData[stepIndex].progress;
        stepSubtitle.textContent = stepData[stepIndex].subtitle;
        // Habilita/desabilita botões de navegação.
        prevBtn.disabled = (stepIndex === 0);
        nextBtn.style.display = (stepIndex === steps.length - 1) ? 'none' : 'block';
        confirmBtn.style.display = (stepIndex === steps.length - 1) ? 'block' : 'none';

        // Atualiza o resumo se estiver no último passo.
        if (stepIndex === steps.length - 1) {
            updateConfirmationSummary();
        }
    }

    /**
     * Controla a visibilidade e o status 'required' do campo de endereço
     * com base na opção de entrega selecionada.
     */
    function handleDeliveryChange() {
        const selectedOption = wizardForm.querySelector('input[name="delivery_option"]:checked');
        if (!selectedOption) return;

        if (selectedOption.value === 'retirada') {
            donorAddressGroup.style.display = 'block'; // Mostra grupo do endereço.
            donorAddressInput.required = true;         // Torna o input obrigatório.
            console.log("[DONATE WIZARD] Opção Retirada selecionada, endereço é obrigatório.");
        } else {
            donorAddressGroup.style.display = 'none'; // Esconde grupo do endereço.
            donorAddressInput.required = false;       // Não é mais obrigatório.
            donorAddressInput.value = '';             // Limpa o campo.
            donorAddressInput.style.borderColor = ''; // Limpa validação visual.
            console.log("[DONATE WIZARD] Opção Entrega selecionada, endereço oculto.");
        }
    }

    /**
     * Simula a adição de um item à lista de doações no Passo 1.
     */
    function addItemToList() {
         console.log("[DONATE WIZARD] Botão + Adicionar Item clicado (simulação).");
            
            // Obtém valores dos campos do formulário de item.
            const categorySelect = document.getElementById('item-category');
            const descriptionInput = document.getElementById('item-description');
            const conditionSelect = document.getElementById('item-condition');
            const quantityInput = document.getElementById('item-quantity');

            // Validação simples dos campos obrigatórios do item.
            if (!categorySelect.value || !descriptionInput.value.trim() || !conditionSelect.value || !quantityInput.value) {
                alert("Por favor, preencha Categoria, Descrição, Condição e Quantidade do item.");
                return;
            }

            const category = categorySelect.options[categorySelect.selectedIndex].text;
            const condition = conditionSelect.options[conditionSelect.selectedIndex].text;
            const quantity = quantityInput.value;

            // Cria o elemento HTML para a linha do item.
            const newItemLine = document.createElement('div');
            newItemLine.className = 'item-summary-line';
            newItemLine.innerHTML = `<span>${quantity}x ${category}</span><span>${condition}</span>`;
            
            // Adiciona o item à lista visual.
            itemsListContainer.appendChild(newItemLine);
            itemsAdded = true; // Marca que pelo menos um item foi adicionado.

             // Limpa os campos do formulário do item.
             descriptionInput.value = '';
             quantityInput.value = 1;
             categorySelect.selectedIndex = 0; // Volta para "Selecione a categoria"
             conditionSelect.selectedIndex = 1; // Volta para "Seminovo"
    }

    // --- Adição dos Event Listeners ---
    console.log("[DONATE WIZARD] Adicionando event listeners...");

    nextBtn.addEventListener('click', () => {
        console.log("[DONATE WIZARD] Botão Continuar clicado.");
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        console.log("[DONATE WIZARD] Botão Voltar clicado.");
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Listeners para as opções de entrega (radio buttons).
    deliveryOptions.forEach(radio => {
        radio.addEventListener('change', handleDeliveryChange);
    });

    // Listener para o botão "Adicionar Item".
    const btnAddItem = wizardForm.querySelector('.btn-add-item');
    if (btnAddItem) {
        btnAddItem.addEventListener('click', addItemToList);
    }

    // Listener para o envio do formulário (botão "Confirmar Doação").
    wizardForm.addEventListener('submit', (e) => {
        console.log("[DONATE WIZARD] Evento de submit do formulário capturado.");
        e.preventDefault(); // Impede o envio padrão do formulário.

        console.log("[DONATE WIZARD] Verificando validação final...");
        // Valida o último passo antes de simular o envio.
        if (validateStep(currentStep)) {
            console.log("[DONATE WIZARD] Validação final OK.");

            // Simulação de envio para backend.
            console.log("[DONATE WIZARD] (Simulação) Enviando dados da doação...");
            alert("Doação confirmada com sucesso! Obrigado pela sua generosidade.");

            console.log("[DONATE WIZARD] Redirecionando para index.html...");
            window.location.href = "index.html"; // Redireciona para a página inicial.

        } else {
            console.log("[DONATE WIZARD] Validação final falhou. Submit bloqueado.");
        }
    });
    console.log("[DONATE WIZARD] Listener de submit adicionado ao formulário.");

    // --- Inicialização ---
    handleDeliveryChange(); // Define o estado inicial da seção de endereço.
    showStep(currentStep); // Exibe o primeiro passo.

}); // Fim do DOMContentLoaded