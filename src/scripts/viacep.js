// ===============================================
// viacep.js
// Busca endereço completo na API ViaCEP a partir do CEP
// digitado no formulário de criação de anúncio (anuncio.html).
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores dos Campos de Endereço (Formulário de Anúncio) ---
    const cepInput = document.getElementById('cep'); // Assumindo que o ID será 'cep' em anuncio.html
    const enderecoInput = document.getElementById('endereco'); // Assumindo ID 'endereco'
    const numeroInput = document.getElementById('numero'); // Assumindo ID 'numero'
    const complementoInput = document.getElementById('complemento'); // Assumindo ID 'complemento'
    const bairroInput = document.getElementById('bairro'); // Assumindo ID 'bairro'
    const cidadeInput = document.getElementById('cidade'); // Assumindo ID 'cidade'
    const estadoInput = document.getElementById('estado'); // Assumindo ID 'estado'
    const hintCep = document.getElementById('hint-cep'); // Assumindo ID 'hint-cep' para feedback

    // Sai se o campo CEP não for encontrado (evita erros se não estiver na página de anúncio).
    if (!cepInput) return; 

    /**
     * Preenche os campos de endereço com os dados retornados pela API ViaCEP.
     * Trava (readonly) os campos preenchidos automaticamente.
     * @param {object} data - O objeto JSON retornado pela API ViaCEP.
     */
    const preencherCampos = (data) => {
        enderecoInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        estadoInput.value = data.uf || '';
        
        // Lista de campos que podem ser preenchidos pela API.
        const camposApi = [enderecoInput, bairroInput, cidadeInput, estadoInput];
        
        // Define como readonly apenas os campos que foram efetivamente preenchidos.
        camposApi.forEach(campo => {
            campo.readOnly = !!campo.value; // Torna readonly se o campo tiver valor.
        });

        // Atualiza o hint e foca no campo "Número".
        if(hintCep) {
            hintCep.textContent = 'Endereço carregado. Preencha o número.';
            hintCep.className = 'hint valido'; // Assume classes CSS para feedback visual.
        }
        if (numeroInput) numeroInput.focus(); 
    };

    /**
     * Limpa os campos de endereço e os libera para edição manual.
     * Exibe uma mensagem de feedback no hint do CEP.
     * @param {string} mensagem - A mensagem a ser exibida no hint.
     */
    const limparCampos = (mensagem) => {
        enderecoInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        estadoInput.value = '';

        // Libera todos os campos para edição.
        [enderecoInput, bairroInput, cidadeInput, estadoInput].forEach(campo => {
            if(campo) campo.readOnly = false;
        });
        
        // Atualiza o hint com a mensagem de erro/aviso.
        if(hintCep) {
            hintCep.textContent = mensagem;
            hintCep.className = 'hint invalido'; // Assume classes CSS para feedback visual.
        }
    };

    /**
     * Função assíncrona que busca o CEP na API ViaCEP quando o usuário sai do campo.
     * Chama `preencherCampos` em caso de sucesso ou `limparCampos` em caso de erro.
     */
    const buscarCep = async () => {
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos.
        
        // Valida o comprimento do CEP.
        if (cep.length !== 8) {
            // Só limpa se o campo não estiver vazio (evita limpar em um blur inicial)
            if (cepInput.value.trim() !== '') { 
                limparCampos('CEP inválido. Deve conter 8 dígitos.');
            }
            return;
        }

        // Feedback visual de busca.
        if(hintCep) {
            hintCep.textContent = 'Buscando CEP...';
            hintCep.className = 'hint verificando'; // Assume classes CSS para feedback visual.
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('Erro na requisição para ViaCEP.');
            }
            
            const data = await response.json();

            if (data.erro) {
                limparCampos('CEP não encontrado.'); // CEP válido, mas não existente na base.
            } else {
                preencherCampos(data); // Sucesso, preenche os campos.
            }
        } catch (error) {
            console.error('Erro ao buscar CEP via ViaCEP:', error);
            limparCampos('Não foi possível buscar o CEP. Tente novamente.'); // Erro de rede ou API.
        }
    };
    
    /**
     * Limpa os campos preenchidos pela API quando o usuário foca no campo CEP,
     * permitindo a correção do CEP.
     */
     const limparCamposParaEdicao = () => {
        // Verifica se algum campo está como readonly antes de limpar
        const algumCampoTravado = [enderecoInput, bairroInput, cidadeInput, estadoInput].some(campo => campo && campo.readOnly);
        if (algumCampoTravado) {
             limparCampos('Digite o novo CEP.'); // Limpa e dá um feedback
             if(hintCep) hintCep.className = 'hint'; // Reseta classe do hint
        }
    };

    // --- Adiciona os Event Listeners ---
    // 'blur' é acionado quando o usuário sai do campo CEP (para buscar).
    cepInput.addEventListener('blur', buscarCep);
    // 'focus' é acionado quando o usuário entra/clica no campo CEP (para limpar e editar).
    cepInput.addEventListener('focus', limparCamposParaEdicao);
    // Garante que apenas números sejam digitados no CEP.
     cepInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
});