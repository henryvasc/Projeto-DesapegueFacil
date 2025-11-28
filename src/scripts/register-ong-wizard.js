// ===============================================
// register-ong-wizard.js
// ===============================================

document.addEventListener('DOMContentLoaded', () => {

    const wizardForm = document.getElementById('ongWizardForm');
    if (!wizardForm) return;

    // --- Elementos de Navegação ---
    const steps = Array.from(wizardForm.querySelectorAll('.wizard-step-content'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const stepSubtitle = document.getElementById('step-subtitle');
    let currentStep = 0;

    const stepData = [
        { subtitle: "Passo 1 de 5 - Informações Básicas", progress: "20%" },
        { subtitle: "Passo 2 de 5 - Contato e Responsável", progress: "40%" },
        { subtitle: "Passo 3 de 5 - Localização", progress: "60%" },
        { subtitle: "Passo 4 de 5 - Documentação", progress: "80%" },
        { subtitle: "Passo 5 de 5 - Finalização", progress: "100%" }
    ];

    // ============================================================
    // MÁSCARAS E VALIDAÇÕES (Telefone e CNPJ)
    // ============================================================

    // Função auxiliar para aplicar máscara de telefone
    const aplicarMascaraTelefone = (event) => {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
        } else {
            value = value.replace(/^(\d*)/, '($1');
        }
        event.target.value = value;
    };

    // Função auxiliar para máscara de CNPJ
    const aplicarMascaraCNPJ = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18);
    };

    // Validar algoritmo do CNPJ
    const validarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj === '' || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
        
        // Validação dos DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;

        return true;
    };

    // Aplica ouvintes de eventos para máscaras
    const telOrg = document.getElementById('telefone-org');
    const telResp = document.getElementById('telefone-resp');
    if (telOrg) telOrg.addEventListener('input', aplicarMascaraTelefone);
    if (telResp) telResp.addEventListener('input', aplicarMascaraTelefone);

    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCNPJ(e.target.value);
        });
        
        // --- API DE CNPJ (BrasilAPI) ---
        cnpjInput.addEventListener('blur', async () => {
            const rawCnpj = cnpjInput.value.replace(/\D/g, '');
            const hintCnpj = document.getElementById('hint-cnpj');
            const nomeOrgInput = document.getElementById('nome-org'); 
            const emailOrgInput = document.getElementById('email-org');
            const cepInput = document.getElementById('cep');

            if (rawCnpj.length === 14) {
                if (!validarCNPJ(rawCnpj)) {
                    if (hintCnpj) {
                        hintCnpj.textContent = "CNPJ inválido (erro de dígito).";
                        hintCnpj.style.color = "red";
                    }
                    return;
                }

                if (hintCnpj) {
                    hintCnpj.textContent = "Buscando dados da empresa...";
                    hintCnpj.style.color = "#3498db";
                }

                try {
                    // Usando BrasilAPI 
                    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`);
                    
                    if (!response.ok) throw new Error('CNPJ não encontrado na base.');
                    
                    const data = await response.json();
                    
                    // Sucesso: Preenche campos
                    if (nomeOrgInput) nomeOrgInput.value = data.razao_social || data.nome_fantasia;
                    if (emailOrgInput && !emailOrgInput.value && data.email) emailOrgInput.value = data.email;
                    
                    // Se o usuário ainda não preencheu o CEP, sugere o do CNPJ
                    if (cepInput && !cepInput.value && data.cep) {
                        cepInput.value = data.cep;
                        cepInput.dispatchEvent(new Event('blur')); // Dispara a busca de CEP
                    }

                    if (hintCnpj) {
                        hintCnpj.textContent = "Empresa localizada: " + (data.nome_fantasia || data.razao_social);
                        hintCnpj.style.color = "green";
                    }

                } catch (error) {
                    console.error(error);
                    if (hintCnpj) {
                        hintCnpj.textContent = "CNPJ válido, mas não foi possível autocompletar os dados.";
                        hintCnpj.style.color = "orange";
                    }
                }
            }
        });
    }


    // ============================================================
    // API DE CEP (ViaCEP)
    // ============================================================
    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const enderecoInput = document.getElementById('endereco');

    if (cepInput) {
        // Máscara CEP
        cepInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if(val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = val;
        });

        // Busca API
        cepInput.addEventListener('blur', async () => {
            const cep = cepInput.value.replace(/\D/g, '');
            const hintCep = document.getElementById('hint-cep');

            if (cep.length === 8) {
                if(hintCep) hintCep.textContent = "Buscando endereço...";
                
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await res.json();
                    
                    if (data.erro) {
                        if(hintCep) hintCep.textContent = "CEP não encontrado.";
                        cidadeInput.readOnly = false;
                        estadoInput.readOnly = false;
                    } else {
                        cidadeInput.value = data.localidade;
                        estadoInput.value = data.uf;
                        if(data.logradouro && enderecoInput) enderecoInput.value = `${data.logradouro}, ${data.bairro}`;
                        
                        // Trava campos para evitar edição incorreta
                        cidadeInput.readOnly = true;
                        estadoInput.readOnly = true;
                        if(hintCep) hintCep.textContent = "Endereço localizado com sucesso.";
                    }
                } catch (err) {
                    if(hintCep) hintCep.textContent = "Erro na busca. Preencha manualmente.";
                    cidadeInput.readOnly = false;
                    estadoInput.readOnly = false;
                }
            }
        });
        
        // Destrava se o usuário voltar para editar o CEP
        cepInput.addEventListener('focus', () => {
            cidadeInput.readOnly = false;
            estadoInput.readOnly = false;
        });
    }

    // ============================================================
    // UPLOAD DE ARQUIVOS (Fotos e Documentos)
    // ============================================================
    
    // Função genérica para tratar uploads
    const setupFileUpload = (dropzoneId, inputId, previewId, maxFiles = 1, isImage = true) => {
        const dropzone = document.getElementById(dropzoneId);
        const input = document.getElementById(inputId);
        const previewContainer = document.getElementById(previewId);
        
        if (!dropzone || !input || !previewContainer) return;

        // Clique na área abre o seletor de arquivo
        dropzone.addEventListener('click', () => input.click());

        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            
            // Verifica limite de arquivos
            const currentFiles = previewContainer.children.length;
            if (currentFiles + files.length > maxFiles) {
                alert(`Máximo de ${maxFiles} arquivos permitidos.`);
                return;
            }

            files.forEach(file => {
                const reader = new FileReader();

                reader.onload = (readerEvent) => {
                    const item = document.createElement('div');
                    // Estilização básica do item de preview
                    item.style.border = "1px solid #ddd";
                    item.style.padding = "5px";
                    item.style.borderRadius = "4px";
                    item.style.display = "flex";
                    item.style.alignItems = "center";
                    item.style.gap = "10px";
                    item.style.backgroundColor = "#fff";

                    if (isImage && file.type.startsWith('image/')) {
                        // Preview de Imagem (Fotos)
                        const img = document.createElement('img');
                        img.src = readerEvent.target.result;
                        img.style.width = "60px";
                        img.style.height = "60px";
                        img.style.objectFit = "cover";
                        item.appendChild(img);
                    } else {
                        // Preview de Documento (Ícone)
                        item.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        `;
                    }

                    // Nome do arquivo e botão remover
                    const info = document.createElement('div');
                    info.innerHTML = `<span style="font-size:0.9rem; display:block;">${file.name}</span><span style="font-size:0.75rem; color:#888;">${(file.size/1024).toFixed(1)} KB</span>`;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.innerText = "X";
                    removeBtn.style.marginLeft = "auto";
                    removeBtn.style.border = "none";
                    removeBtn.style.background = "transparent";
                    removeBtn.style.color = "red";
                    removeBtn.style.cursor = "pointer";
                    removeBtn.style.fontWeight = "bold";
                    removeBtn.onclick = (ev) => {
                        ev.stopPropagation(); // Evita abrir o seletor de novo
                        item.remove();
                    };

                    item.appendChild(info);
                    item.appendChild(removeBtn);
                    previewContainer.appendChild(item);
                };

                reader.readAsDataURL(file);
            });
        });
    };

    
    setupFileUpload('doc-dropzone', 'docs-upload', 'doc-preview-container', 1, false);

    
    setupFileUpload('foto-dropzone-ong', 'fotos-org', 'foto-preview-container', 5, true);


    // ============================================================
    // LÓGICA DO WIZARD (Navegação)
    // ============================================================

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const inputs = currentStepElement.querySelectorAll('[required]');
        let allValid = true;

        inputs.forEach(input => {
            input.style.borderColor = '';
            if (!input.value.trim() && input.type !== 'checkbox') {
                allValid = false;
                input.style.borderColor = 'red';
            }
            if (input.type === 'checkbox' && !input.checked) {
                allValid = false;
                // Highlight checkbox parent/label if possible
            }
        });

        // Validação customizada do passo 4 (Documento)
        if (stepIndex === 3) {
            const hasDoc = document.getElementById('doc-preview-container').children.length > 0;
            if (!hasDoc) {
                const dropzone = document.getElementById('doc-dropzone');
                dropzone.style.borderColor = 'red';
                alert("Por favor, anexe o documento da organização.");
                return false;
            } else {
                document.getElementById('doc-dropzone').style.borderColor = '';
            }
        }

        if (!allValid) alert("Preencha todos os campos obrigatórios.");
        return allValid;
    }

    function showStep(index) {
        steps.forEach((s, i) => s.classList.toggle('active', i === index));
        progressBarFill.style.width = stepData[index].progress;
        stepSubtitle.textContent = stepData[index].subtitle;
        prevBtn.disabled = index === 0;
        nextBtn.style.display = index === steps.length - 1 ? 'none' : 'block';
        submitBtn.style.display = index === steps.length - 1 ? 'block' : 'none';
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Submissão Final
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            const ongName = document.getElementById('nome-org').value;
            const userData = { name: ongName, email: document.getElementById('email-org').value, type: "instituicao" };
            
            // Salva dados no LocalStorage para simular sessão
            localStorage.setItem('userData', JSON.stringify(userData));
            const FAKE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiT05HIiwidHlwZSI6Imluc3RpdHVpY2FvIn0.fake";
            localStorage.setItem("jwtToken", FAKE_JWT);

            alert(`Cadastro(simulado) da ONG "${ongName}" realizado com sucesso!\nVocê será redirecionado.`);
            window.location.href = "index.html";
        }
    });

    // Seleção de Necessidades (Visual)
    const needsCards = document.querySelectorAll('.needs-card');
    needsCards.forEach(card => card.addEventListener('click', () => card.classList.toggle('active')));

    // Inicializa
    showStep(currentStep);
});


