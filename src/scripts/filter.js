/**
 * Controla a filtragem de itens (produtos e instituições) na página inicial
 * com base na navegação principal, categorias e barra de busca.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos relevantes do DOM.
    const searchInput = document.getElementById('search-input');
    const navButtons = document.querySelectorAll('.main-nav .btn-nav');
    const categoryButtons = document.querySelectorAll('.categories .category-btn');
    
    // Seleciona os grids e os cards dentro deles.
    const productGrid = document.getElementById('product-grid');
    const institutionGrid = document.getElementById('institution-grid');
    const productCards = productGrid ? Array.from(productGrid.querySelectorAll('.product-card')) : [];
    const institutionCards = institutionGrid ? Array.from(institutionGrid.querySelectorAll('.institution-card')) : [];
    
    // Elemento para exibir a contagem de itens encontrados.
    const itemsFoundText = document.getElementById('items-found-text'); 

    // Objeto para armazenar os filtros ativos.
    let activeFilters = {
        nav: 'todos',     // Filtro da navegação principal (venda, doacao, instituicoes).
        category: 'todos', // Filtro das categorias (eletronicos, casa, etc.).
        search: ''        // Termo da busca textual.
    };

    /**
     * Filtra os cards (Produtos ou Instituições) com base nos filtros ativos
     * e atualiza a visibilidade dos grids e a contagem de itens.
     */
    function filterItems() {
        let itemsFound = 0;
        const searchTerm = activeFilters.search.toLowerCase();
        const activeNav = activeFilters.nav;
        const activeCategory = activeFilters.category;

        // Decide qual grid mostrar com base no filtro de navegação.
        const showInstitutions = (activeNav === 'instituicoes');
        
        if (productGrid) productGrid.style.display = showInstitutions ? 'none' : 'grid';
        if (institutionGrid) institutionGrid.style.display = showInstitutions ? 'grid' : 'none';

        if (showInstitutions) {
            // --- Filtra Instituições ---
            institutionCards.forEach(card => {
                // Extrai informações relevantes do card para comparação.
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p.description')?.textContent.toLowerCase() || '';
                const location = card.querySelector('p.location')?.textContent.toLowerCase() || '';
                const needsElements = card.querySelectorAll('.needs-tags span');
                let needsText = '';
                needsElements.forEach(span => needsText += (span.textContent.toLowerCase() + ' '));
                
                // Obtém a categoria da instituição do atributo data-category.
                const category = card.dataset.category || 'todos'; 

                // Verifica se o card corresponde ao termo de busca.
                const matchesSearch = (
                    name.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    location.includes(searchTerm) ||
                    needsText.includes(searchTerm)
                );
                
                // Verifica se o card corresponde à categoria selecionada.
                const matchesCategory = (activeCategory === 'todos' || activeCategory === category);

                // Define a visibilidade do card.
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'flex'; // ou 'block', dependendo do CSS base.
                    itemsFound++;
                } else {
                    card.style.display = 'none';
                }
            });
            // Atualiza o texto de contagem para instituições.
             if (itemsFoundText) itemsFoundText.textContent = `${itemsFound} ${itemsFound === 1 ? 'instituição encontrada' : 'instituições encontradas'}`;

        } else {
            // --- Filtra Produtos ---
            productCards.forEach(card => {
                // Extrai informações relevantes do card.
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const type = card.dataset.type; // 'venda', 'doacao', 'troca'
                const category = card.dataset.category; // 'eletronicos', 'casa', etc.

                // Verifica se o card corresponde aos filtros ativos.
                const matchesNav = (activeNav === 'todos' || activeNav === type);
                const matchesCategory = (activeCategory === 'todos' || activeCategory === category);
                const matchesSearch = (title.includes(searchTerm));

                // Define a visibilidade do card.
                if (matchesNav && matchesCategory && matchesSearch) {
                    card.style.display = 'flex';
                    itemsFound++;
                } else {
                    card.style.display = 'none';
                }
            });
            // Atualiza o texto de contagem para produtos.
             if (itemsFoundText) itemsFoundText.textContent = `${itemsFound} ${itemsFound === 1 ? 'item encontrado' : 'itens encontrados'}`;
        }
    }

    /**
     * Atualiza a classe 'active' para um grupo de botões,
     * destacando visualmente o botão que foi clicado.
     * @param {NodeListOf<Element>} buttonGroup - A coleção de botões.
     * @param {Element} activeButton - O botão que deve ser marcado como ativo.
     */
    function updateActiveButton(buttonGroup, activeButton) {
        buttonGroup.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    // --- Adiciona os Event Listeners ---

    // 1. Filtro da Navegação Principal.
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateActiveButton(navButtons, button);
            activeFilters.nav = button.dataset.filter;
            // Opcional: Resetar categoria ao mudar navegação principal?
            // activeFilters.category = 'todos'; 
            // updateActiveButton(categoryButtons, categoryButtons[0]); // Ativa 'Todos'
            filterItems(); // Reaplica os filtros.
        });
    });

    // 2. Filtro de Categorias.
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateActiveButton(categoryButtons, button);
            activeFilters.category = button.dataset.filter;
            filterItems(); // Reaplica os filtros.
        });
    });

    // 3. Barra de Pesquisa.
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase();
            filterItems(); // Reaplica os filtros a cada caractere digitado.
        });
    }
    
    // Aplica os filtros iniciais ao carregar a página.
    if (productCards.length > 0 || institutionCards.length > 0) {
        filterItems();
    } else {
        // Atualiza o texto se não houver itens na página.
        if(itemsFoundText) itemsFoundText.textContent = "Nenhum item encontrado";
    }
});