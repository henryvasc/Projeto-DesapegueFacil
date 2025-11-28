// 

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos DOM ---
    const searchInput = document.getElementById('search-input');
    const navButtons = document.querySelectorAll('.main-nav .btn-nav');
    const categoryButtons = document.querySelectorAll('.categories .category-btn');
    
    // Elementos da Sidebar
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const filterInputs = document.querySelectorAll('.filter-submenu input'); 

    // Grids e Cards
    const productGrid = document.getElementById('product-grid');
    const institutionGrid = document.getElementById('institution-grid');
    const productCards = productGrid ? Array.from(productGrid.querySelectorAll('.product-card')) : [];
    const institutionCards = institutionGrid ? Array.from(institutionGrid.querySelectorAll('.institution-card')) : [];
    
    // Elementos de Estatística
    const statsTotal = document.getElementById('stats-total');
    const statsDoacoes = document.getElementById('stats-doacoes');
    const statsVendas = document.getElementById('stats-vendas');
    const statsOngs = document.getElementById('stats-ongs');
    const itemsFoundText = document.getElementById('items-found-text'); 

    // Estado Global
    let state = {
        nav: 'todos',
        category: 'todos',
        search: '',
        locations: [],
        priceRange: 'all',
        conditions: []
    };

    // --- Lógica de UI do Acordeão ---
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamento padrão de botão form
            const submenu = btn.nextElementSibling;
            const isOpen = submenu.style.display === 'block';
            submenu.style.display = isOpen ? 'none' : 'block';
            btn.classList.toggle('active', !isOpen);
        });
    });

    // --- Helpers ---

    function parsePrice(priceText) {
        if (!priceText) return 0;
        if (priceText.toLowerCase().includes('grátis')) return 0;
        // Remove "R$", espaços e converte vírgula para ponto
        const clean = priceText.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(clean) || 0;
    }

    function checkPrice(priceValue, range) {
        if (range === 'all') return true;
        if (range === 'free') return priceValue === 0;
        if (range === 'up-to-100') return priceValue > 0 && priceValue <= 100;
        if (range === '100-500') return priceValue > 100 && priceValue <= 500;
        if (range === '500-plus') return priceValue > 500;
        return true;
    }

    function checkCondition(fullText, selectedConditions) {
        if (selectedConditions.length === 0) return true;

        return selectedConditions.some(cond => {
            // Regex para evitar falsos positivos e lidar com gênero
            if (cond === 'novo') {
                // Encontra "novo" ou "nova", mas NÃO se tiver "semi" antes
                return /\b(novo|nova|lacrado)\b/i.test(fullText) && !/seminovo|seminova/i.test(fullText);
            }
            if (cond === 'seminovo') {
                return /seminovo|seminova/i.test(fullText);
            }
            if (cond === 'usado') {
                return /usado|usada/i.test(fullText);
            }
            return fullText.includes(cond);
        });
    }

    function updateStatistics(visibleProducts, visibleInstitutions) {
        const total = visibleProducts.length + visibleInstitutions.length;
        
        if (statsTotal) statsTotal.textContent = total;
        if (statsOngs) statsOngs.textContent = visibleInstitutions.length;

        let vendas = 0;
        let doacoes = 0;

        visibleProducts.forEach(c => {
            const type = c.dataset.type;
            if (type === 'venda') vendas++;
            else if (type === 'doacao' || type === 'troca') doacoes++;
        });

        if (statsVendas) statsVendas.textContent = vendas;
        if (statsDoacoes) statsDoacoes.textContent = doacoes;
    }

    // --- Função Principal de Filtro ---

    function filterItems() {
        const { nav, category, search, locations, priceRange, conditions } = state;
        const searchTerm = search.toLowerCase();

        // Verifica se há filtros ativos que são exclusivos de PRODUTOS
        const isProductFilterActive = (priceRange !== 'all') || (conditions.length > 0);

        // Controle de Grids
        // Se houver filtro de preço/condição ativo, ESCONDE as instituições forçadamente
        let showInstitutionsGrid = (nav === 'instituicoes' || nav === 'todos') && !isProductFilterActive;
        const showProductsGrid = (nav !== 'instituicoes');

        // Aplica display aos containers
        if (institutionGrid) institutionGrid.style.display = showInstitutionsGrid ? 'grid' : 'none';
        if (productGrid) productGrid.style.display = showProductsGrid ? 'grid' : 'none';

        const visibleInstitutions = [];
        const visibleProducts = [];

        // --- Filtrar Instituições ---
        if (showInstitutionsGrid) {
            institutionCards.forEach(card => {
                const textContent = card.innerText.toLowerCase();
                const cardLocation = card.querySelector('.location')?.textContent.toLowerCase() || '';
                const cardCategory = card.dataset.category || 'todos';

                const matchSearch = textContent.includes(searchTerm);
                const matchCategory = (category === 'todos' || cardCategory === category);
                const matchLocation = (locations.length === 0) || locations.some(loc => cardLocation.includes(loc));

                const isVisible = matchSearch && matchCategory && matchLocation;
                
                card.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) visibleInstitutions.push(card);
            });
        } else {
            // Garante que fiquem ocultos se o grid estiver hidden
            institutionCards.forEach(c => c.style.display = 'none');
        }

        // --- Filtrar Produtos ---
        if (showProductsGrid) {
            productCards.forEach(card => {
                const fullText = card.innerText.toLowerCase();
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const cardType = card.dataset.type;
                const cardCategory = card.dataset.category;
                const priceText = card.querySelector('.price')?.textContent || '';
                const locationText = card.querySelector('.location')?.textContent.toLowerCase() || '';
                
                const priceValue = parsePrice(priceText);

                // 1. Navegação
                const matchNav = (nav === 'todos') || (nav === cardType);
                // 2. Categoria
                const matchCategory = (category === 'todos' || cardCategory === category);
                // 3. Busca
                const matchSearch = fullText.includes(searchTerm);
                // 4. Localização
                const matchLocation = (locations.length === 0) || locations.some(loc => locationText.includes(loc));
                // 5. Preço
                const matchPrice = checkPrice(priceValue, priceRange);
                // 6. Condição (com Regex corrigido)
                const matchCondition = checkCondition(fullText, conditions);

                const isVisible = matchNav && matchCategory && matchSearch && matchLocation && matchPrice && matchCondition;

                card.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) visibleProducts.push(card);
            });
        } else {
            productCards.forEach(c => c.style.display = 'none');
        }

        // Atualiza contador de texto
        const totalFound = visibleProducts.length + visibleInstitutions.length;
        if (itemsFoundText) {
            itemsFoundText.textContent = totalFound > 0 
                ? `${totalFound} ${totalFound === 1 ? 'item encontrado' : 'itens encontrados'}`
                : "Nenhum item encontrado com esses filtros";
        }

        updateStatistics(visibleProducts, visibleInstitutions);
    }

    // --- Event Listeners ---

    // Navegação
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.nav = btn.dataset.filter;
            filterItems();
        });
    });

    // Categorias
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.category = btn.dataset.filter;
            filterItems();
        });
    });

    // Busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.search = e.target.value;
            filterItems();
        });
    }

    // Inputs da Sidebar (Checkbox e Radio)
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.name === 'loc') {
                state.locations = Array.from(document.querySelectorAll('input[name="loc"]:checked')).map(el => el.value);
            } else if (input.name === 'price') {
                state.priceRange = document.querySelector('input[name="price"]:checked').value;
            } else if (input.name === 'cond') {
                state.conditions = Array.from(document.querySelectorAll('input[name="cond"]:checked')).map(el => el.value);
            }
            filterItems();
        });
    });

    // Inicialização
    filterItems();
});
