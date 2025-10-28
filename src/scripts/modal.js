/**
 * Controla a exibição e o preenchimento do modal de detalhes da instituição.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("[MODAL] Script iniciado.");

    // Seleciona os elementos principais do modal e os botões que o acionam.
    const modalOverlay = document.getElementById('institution-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const detailsButtons = document.querySelectorAll('.institution-card .btn-details');

    // Verifica se os elementos essenciais do modal existem.
    if (!modalOverlay || !modalCloseBtn) {
        console.error("[MODAL] Elementos essenciais do modal (overlay ou botão fechar) não encontrados!");
        return;
    }
    if (detailsButtons.length === 0) {
        console.warn("[MODAL] Nenhum botão 'Ver Detalhes' encontrado na página.");
    }

    /**
     * Abre o modal e preenche seu conteúdo com dados do card da instituição clicada.
     * @param {Element} cardElement - O elemento do card da instituição (.institution-card).
     */
    function openModal(cardElement) {
        console.log("[MODAL] Abrindo modal...");
        if (!cardElement) return;

        // --- Coleta dados do card clicado ---
        const imgElement = cardElement.querySelector('.institution-image');
        const nameElement = cardElement.querySelector('h3');
        const locationElement = cardElement.querySelector('.location');
        const descriptionElement = cardElement.querySelector('.description');
        const needsContainer = cardElement.querySelector('.needs-tags');

        // --- Elementos dentro do modal para preencher ---
        const modalImg = document.getElementById('modal-ong-img');
        const modalName = document.getElementById('modal-ong-name');
        const modalLocation = document.getElementById('modal-ong-loc-text');
        const modalDescription = document.getElementById('modal-ong-desc');
        const modalNeeds = document.getElementById('modal-ong-needs');

        // --- Preenche o conteúdo do modal ---
        if (modalImg && imgElement) {
             // Extrai a URL da imagem de fundo do card.
             const bgImage = imgElement.style.backgroundImage;
             const imgUrl = bgImage.slice(5, -2); // Remove 'url("' e '")'
             modalImg.src = imgUrl || 'https://via.placeholder.com/150x100'; // Define um fallback.
             modalImg.alt = `Imagem de ${nameElement?.textContent || 'Instituição'}`;
        }
        if (modalName && nameElement) modalName.textContent = nameElement.textContent;
        if (modalLocation && locationElement) modalLocation.textContent = locationElement.textContent;
        // Assume que a descrição completa viria de uma API; aqui, apenas copia a breve.
        if (modalDescription && descriptionElement) modalDescription.textContent = descriptionElement.textContent; 
        if (modalNeeds && needsContainer) {
            modalNeeds.innerHTML = needsContainer.innerHTML; // Copia as tags de necessidade.
        } else if (modalNeeds) {
            modalNeeds.innerHTML = '<span>Nenhuma necessidade urgente informada.</span>'; // Mensagem padrão.
        }

        // --- Exibe o modal com animação ---
        modalOverlay.classList.add('active');
        console.log("[MODAL] Modal aberto.");
    }

    /**
     * Fecha o modal removendo a classe 'active'.
     */
    function closeModal() {
        console.log("[MODAL] Fechando modal...");
        modalOverlay.classList.remove('active');
    }

    // --- Adiciona Event Listeners ---

    // Adiciona listener a cada botão "Ver Detalhes".
    detailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Previne qualquer ação padrão.
            const card = button.closest('.institution-card'); // Encontra o card pai.
            if (card) {
                openModal(card);
            } else {
                console.error("[MODAL] Não foi possível encontrar o .institution-card pai do botão clicado.");
            }
        });
    });

    // Adiciona listener ao botão de fechar (X).
    modalCloseBtn.addEventListener('click', closeModal);

    // Adiciona listener para fechar o modal ao clicar fora do card (no overlay).
    modalOverlay.addEventListener('click', (e) => {
        // Verifica se o clique foi diretamente no overlay.
        if (e.target === modalOverlay) { 
            closeModal();
        }
    });

     console.log("[MODAL] Listeners adicionados.");

});