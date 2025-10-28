// ===============================================
// viacep-ong.js
// Busca endereço (cidade/estado) na API ViaCEP 
// a partir do CEP digitado no formulário de cadastro de ONG.
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores dos Campos de Endereço ---
    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');

    // Sai se algum campo essencial não for encontrado (evita erros no console).
    if (!cepInput || !cidadeInput || !estadoInput) {
        return;
    }

    // Garante que o campo CEP aceite apenas números.
    cepInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    /**
     * Busca o endereço na API ViaCEP quando o usuário sai do campo CEP.
     * Preenche e trava os campos de cidade e estado se a busca for bem-sucedida.
     * Libera os campos para edição manual em caso de erro ou CEP não encontrado.
     */
    const buscarCep = async () => {
        const cep = cepInput.value; // Já está limpo (só números) devido ao listener 'input'.
        const hintCep = wizardForm.querySelector('#cep + .hint'); // Seleciona o hint associado ao CEP

        // Reseta os campos e mostra feedback de busca.
        cidadeInput.value = '';
        estadoInput.value = '';
        cidadeInput.placeholder = 'Buscando...';
        estadoInput.placeholder = '...';
        if (hintCep) hintCep.textContent = 'Buscando CEP...';
        
        // Valida o comprimento do CEP.
        if (cep.length !== 8) {
            cidadeInput.readOnly = false;
            estadoInput.readOnly = false;
            cidadeInput.placeholder = 'CEP inválido';
            estadoInput.placeholder = 'UF';
            if (hintCep) hintCep.textContent = 'CEP inválido. Digite 8 números.';
            return;
        }

        const url = `https://viacep.com.br/ws/${cep}/json/`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            const data = await response.json();

            if (data.erro) {
                // CEP não encontrado pela API.
                cidadeInput.readOnly = false;
                estadoInput.readOnly = false;
                cidadeInput.placeholder = 'Não encontrado';
                estadoInput.placeholder = 'UF';
                 if (hintCep) hintCep.textContent = 'CEP não encontrado. Verifique ou preencha manualmente.';
            } else {
                // Sucesso: preenche e trava os campos.
                cidadeInput.value = data.localidade || '';
                estadoInput.value = data.uf || '';
                cidadeInput.readOnly = true;
                estadoInput.readOnly = true;
                if (hintCep) hintCep.textContent = 'Cidade e Estado preenchidos.';
                 // Opcional: Focar no próximo campo, por exemplo, o de endereço completo.
                 const enderecoInput = document.getElementById('endereco');
                 if(enderecoInput) enderecoInput.focus();
            }
        } catch (error) {
            // Erro de rede ou na requisição.
            console.error('Erro ao buscar CEP:', error);
            cidadeInput.readOnly = false;
            estadoInput.readOnly = false;
            cidadeInput.placeholder = 'Erro na busca';
            estadoInput.placeholder = 'UF';
            if (hintCep) hintCep.textContent = 'Erro ao buscar CEP. Tente novamente ou preencha manualmente.';
        }
    };

    /**
     * Limpa e libera os campos de cidade e estado quando o usuário foca no campo CEP,
     * permitindo que ele corrija o CEP ou preencha manualmente.
     */
    const limparCamposParaEdicao = () => {
        // Só limpa se os campos estiverem como readonly (preenchidos pela API).
        if (cidadeInput.readOnly || estadoInput.readOnly) {
            cidadeInput.value = '';
            estadoInput.value = '';
            cidadeInput.readOnly = false;
            estadoInput.readOnly = false;
            cidadeInput.placeholder = 'Cidade'; // Placeholder padrão
            estadoInput.placeholder = 'UF';    // Placeholder padrão
            const hintCep = wizardForm.querySelector('#cep + .hint');
            if (hintCep) hintCep.textContent = 'Digite o CEP para preencher a cidade e estado.';
        }
    };

    // --- Adiciona os Event Listeners ---
    // 'blur' é acionado quando o usuário sai do campo CEP (para buscar).
    cepInput.addEventListener('blur', buscarCep);   
    // 'focus' é acionado quando o usuário entra/clica no campo CEP (para limpar e editar).
    cepInput.addEventListener('focus', limparCamposParaEdicao); 
});