// ===============================================
// anuncio.js
// Gerencia a interatividade da página de criar anúncios:
// - Alternar campos baseado no tipo de anúncio
// - Máscaras de entrada (Preço, CEP)
// - Upload e preview de fotos
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ---Lógica de Alternar Preço (Venda/Troca/Doação) ---
    const tipoRadios = document.querySelectorAll('input[name="tipo_anuncio"]');
    const precoGroup = document.getElementById('precoGroup');
    const precoInput = document.getElementById('preco');
    const btnNegociar = document.getElementById('btnNegociar');

    function togglePreco() {
        // Encontra qual radio está checado
        const checkedRadio = document.querySelector('input[name="tipo_anuncio"]:checked');
        if (!checkedRadio) return;

        const selected = checkedRadio.value;

        if (selected === 'venda' || selected === 'troca') {
            if (precoGroup) precoGroup.style.display = 'block';
            if (precoInput) {
                precoInput.required = (selected === 'venda'); 
                precoInput.placeholder = (selected === 'troca') ? 'Valor base (opcional)' : '0,00';
            }
            if (btnNegociar) btnNegociar.style.display = 'block'; 
        } else { 
            // Caso Doação
            if (precoGroup) precoGroup.style.display = 'none';
            if (precoInput) {
                precoInput.required = false;
                precoInput.value = ''; // Limpa o valor
            }
            if (btnNegociar) btnNegociar.style.display = 'none'; 
        }
    }

    if (tipoRadios.length > 0) {
        tipoRadios.forEach(radio => radio.addEventListener('change', togglePreco));
        togglePreco(); // Executa ao carregar para definir o estado inicial
    }

    // --- Máscara de CEP (Visual) ---
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Apenas números
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // --- Máscara de Preço (Moeda) ---
    if (precoInput) {
        precoInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            
            // Converte para formato de moeda (divide por 100 para ter centavos)
            if (value) {
                value = (parseInt(value, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            }
            
            if (value === 'NaN' || value === '0,00') value = ''; 
            e.target.value = value;
        });
    }

    // --- Botão "Negociável" ---
    if (btnNegociar) {
        btnNegociar.addEventListener('click', () => {
            btnNegociar.classList.toggle('active'); 
            // Aqui você poderia adicionar lógica para definir um campo hidden como true/false
        });
    }

    // --- Upload e Preview de Fotos ---
    const fotoDropzone = document.getElementById('fotoDropzone');
    const fotoInput = document.getElementById('fotos');
    const previewContainer = document.getElementById('fotoPreviewContainer');
    const MAX_FOTOS = 5;

    if (fotoDropzone && fotoInput && previewContainer) {
        
        
        fotoDropzone.addEventListener('click', () => fotoInput.click());

        fotoInput.addEventListener('change', (event) => {
            const files = event.target.files;
            let currentCount = previewContainer.children.length;

            for (let i = 0; i < files.length && currentCount < MAX_FOTOS; i++) {
                const file = files[i];
                
                // Validação simples de tipo
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        const imgElement = document.createElement('img');
                        imgElement.src = e.target.result;
                        // Estilos inline para o preview
                        imgElement.style.maxWidth = '80px'; 
                        imgElement.style.maxHeight = '80px';
                        imgElement.style.objectFit = 'cover';
                        imgElement.style.borderRadius = '5px'; // Hardcoded ou use var CSS se disponível
                        imgElement.style.border = '1px solid #ddd';
                        
                        previewContainer.appendChild(imgElement);
                        updateFotoCount();
                    }
                    
                    reader.readAsDataURL(file);
                    currentCount++;
                }
            }
            
            if (currentCount >= MAX_FOTOS) {
                fotoDropzone.style.display = 'none'; // Esconde botão se atingir limite
            }
        });
        
        function updateFotoCount() {
            const count = previewContainer.children.length;
            // Procura o H3 mais próximo dentro do card para atualizar o texto (0/5)
            const countLabel = fotoDropzone.closest('.anuncio-card').querySelector('h3');
            if (countLabel) {
                // Preserva o texto original "Fotos" e atualiza o contador
                countLabel.textContent = `Fotos (${count}/${MAX_FOTOS})`;
            }
        }
        
        // Inicializa contador
        updateFotoCount(); 
    }

    // --- Submissão do Formulário (Simulação) ---
    const anuncioForm = document.getElementById('anuncioForm');
    if (anuncioForm) {
        anuncioForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Validação extra simples
            const titulo = document.getElementById('titulo').value;
            if(!titulo) return;

            alert('Anúncio publicado com sucesso! (Simulação)');
            window.location.href = 'index.html'; 
        });
    }

});
