// modal.js - implementação robusta para o modal de instituições

(function () {
  // elementos do modal (deve bater com os IDs do seu HTML)
  const overlay = document.getElementById('institution-modal-overlay');
  const modalCard = document.getElementById('institution-modal-card');
  const btnClose = document.getElementById('modal-close-btn');

  // campos dentro do modal
  const modalImg = document.getElementById('modal-ong-img');
  const modalName = document.getElementById('modal-ong-name');
  const modalLocText = document.getElementById('modal-ong-loc-text');
  const modalDesc = document.getElementById('modal-ong-desc');
  const modalNeeds = document.getElementById('modal-ong-needs');

  // se algum desses não existir, abortamos com mensagem no console (ajuda no debug)
  if (!overlay || !modalCard || !btnClose || !modalName || !modalDesc || !modalNeeds) {
    console.warn('Modal: elementos esperados não foram encontrados no DOM. Verifique IDs em index.html.');
    return;
  }

  // Helper: extrai url de background-image css (se existir)
  function extractBgUrl(el) {
    if (!el) return '';
    const bg = window.getComputedStyle(el).backgroundImage || '';
    // bg tem formato: url("...") ou none
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  }

  // Preenche e abre o modal com os dados do card passado
  function openModalFromCard(card) {
    try {
      const imgEl = card.querySelector('.institution-image');
      const nameEl = card.querySelector('.institution-info h3');
      const descEl = card.querySelector('.description');
      const locEl = card.querySelector('.location');
      const needsEls = card.querySelectorAll('.needs-tags span');

      // imagem (tenta pegar src do background, se não usar placeholder)
      const imgUrl = extractBgUrl(imgEl) || modalImg.getAttribute('src') || 'https://via.placeholder.com/300x180';
      modalImg.src = imgUrl;

      modalName.textContent = nameEl ? nameEl.textContent.trim() : 'Instituição';
      modalDesc.textContent = descEl ? descEl.textContent.trim() : '';
      modalLocText.textContent = locEl ? locEl.textContent.trim() : '';

      // limpa lista de necessidades e adiciona do card
      modalNeeds.innerHTML = '';
      if (needsEls && needsEls.length) {
        needsEls.forEach(n => {
          const span = document.createElement('span');
          span.textContent = n.textContent.trim();
          span.className = 'modal-need-tag';
          modalNeeds.appendChild(span);
        });
      } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhuma necessidade informada.';
        emptyMessage.style.margin = '0';
        modalNeeds.appendChild(emptyMessage);
      }

      // mostra overlay (usar flex para centralizar)
      overlay.style.display = 'flex';
      // Prevent page scroll while modal open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // focus no modal para acessibilidade
      modalCard.setAttribute('tabindex', '-1');
      modalCard.focus();
    } catch (err) {
      console.error('Erro ao abrir modal:', err);
    }
  }

  // fecha modal (restaura scroll)
  function closeModal() {
    overlay.style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  // Fechar ao clicar no X
  btnClose.addEventListener('click', closeModal);

  // Fechar ao clicar fora do card (overlay)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Fechar com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display && overlay.style.display !== 'none') {
      closeModal();
    }
  });

  // Conectar botões "Ver Detalhes" existentes (se houver)
  function attachDetailButtons() {
    const detailBtns = document.querySelectorAll('.btn-details');
    if (!detailBtns || detailBtns.length === 0) {
      // nada para conectar (talvez os botões sejam gerados dinamicamente)
      return;
    }

    detailBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // procura o cartão pai mais próximo (.institution-card)
        const card = btn.closest('.institution-card');
        if (!card) {
          console.warn('Botão Ver Detalhes sem .institution-card pai.');
          return;
        }
        openModalFromCard(card);
      });
    });
  }

  // Chamamos no carregamento
  attachDetailButtons();

  // Se seus cards forem inseridos dinamicamente depois, você pode expor uma função para re-reattach:
  window.modalReattachDetails = attachDetailButtons;

})();
