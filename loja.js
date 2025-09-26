document.addEventListener('DOMContentLoaded', () => {
    const productGallery = document.getElementById('product-gallery');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalPriceElement = document.getElementById('subtotal-price');
    const SHIPPING_COST = 14.30; // Fixed shipping cost

    // Filter elements
    const filterCategorySelect = document.getElementById('filter-category');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // Price range slider elements
    const priceMinSlider = document.getElementById('price-min-slider');
    const priceMaxSlider = document.getElementById('price-max-slider');
    const minPriceDisplay = document.getElementById('min-price-display');
    const maxPriceDisplay = document.getElementById('max-price-display');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    let currentLang = localStorage.getItem('lang') || 'pt';

    // Carrega os produtos do JSON
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            products = await response.json();
            populateCategories();
            renderProducts(products); // Render all products initially
            updateCartDisplay();
            initializePriceSliders(); // Initialize sliders after products are loaded
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    // Popula o dropdown de categorias
    function populateCategories() {
        const categories = [...new Set(products.map(product => product.category))];
        filterCategorySelect.innerHTML = '<option value="all" data-i18n="all_categories">Todas</option>'; // Keep "Todas" option
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category; // For now, category name is text content
            filterCategorySelect.appendChild(option);
        });
        applyTranslations();
    }

    // Renderiza os produtos na galeria
    function renderProducts(productsToRender) { // Accept products to render as argument
        productGallery.innerHTML = '';
        productsToRender.forEach(product => {
            const productDetails = product.details[currentLang];
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${productDetails.name}">
                <h3>${productDetails.name}</h3>
                <p>${productDetails.description}</p>
                <p class="price">€ ${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}" data-i18n="addToCart">Adicionar ao Carrinho</button>
            `;
            productGallery.appendChild(productElement);
        });
        applyTranslations();
    }

    // Adiciona um item ao carrinho
    function addToCart(productId) {
        if (cart[productId]) {
            cart[productId]++;
        } else {
            cart[productId] = 1;
        }
        saveCart();
        updateCartDisplay();
    }

    // Remove um item do carrinho
    function removeFromCart(productId) {
        if (cart[productId] && cart[productId] > 1) {
            cart[productId]--;
        } else {
            delete cart[productId];
        }
        saveCart();
        updateCartDisplay();
    }

    // Salva o carrinho no localStorage
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Atualiza a exibição do carrinho
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = `<p data-i18n="emptyCart">Seu carrinho está vazio.</p>`;
            applyTranslations();
            subtotalPriceElement.textContent = `€ 0.00`;
            renderPayPalButton(0);
            return;
        } else {
            for (const productId in cart) {
                const product = products.find(p => p.id == productId);
                if (product) {
                    const quantity = cart[productId];
                    const itemTotal = product.price * quantity;
                    subtotal += itemTotal;

                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <span>${product.details[currentLang].name} (x${quantity})</span>
                        <div class="cart-item-actions">
                            <span class="cart-item-price">€ ${itemTotal.toFixed(2)}</span>
                            <button class="remove-from-cart-btn" data-id="${productId}"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                }
            }
        }

        // Display shipping cost
        const shippingElement = document.createElement('div');
        shippingElement.classList.add('cart-summary-shipping');
        shippingElement.innerHTML = `<p>Envio: <span id="shipping-price">€ ${SHIPPING_COST.toFixed(2)}</span></p>`;
        cartItemsContainer.appendChild(shippingElement);

        let total = subtotal + SHIPPING_COST;
        subtotalPriceElement.textContent = `€ ${total.toFixed(2)}`;
        renderPayPalButton(total);
    }
    
    // Renderiza o botão do PayPal
    function renderPayPalButton(total) {
        const paypalContainer = document.getElementById('paypal-button-container');
        paypalContainer.innerHTML = '';
        if (total > 0) {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: total.toFixed(2),
                                currency_code: 'EUR'
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Pagamento concluído por ' + details.payer.name.given_name);
                        // Limpa o carrinho após a compra
                        cart = {};
                        saveCart();
                        updateCartDisplay();
                    });
                },
                onError: function(err) {
                    console.error('Erro no pagamento PayPal:', err);
                }
            }).render('#paypal-button-container');
        }
    }

    // Filter products function
    function filterProducts() {
        const selectedCategory = filterCategorySelect.value;
        const priceMin = parseFloat(priceMinSlider.value); // Get from slider
        const priceMax = parseFloat(priceMaxSlider.value); // Get from slider

        let filtered = products.filter(product => {
            const productCategory = product.category;
            const productPrice = product.price;

            const matchesCategory = (selectedCategory === 'all' || productCategory === selectedCategory);
            const matchesPrice = (productPrice >= priceMin && productPrice <= priceMax);

            return matchesCategory && matchesPrice;
        });
        renderProducts(filtered);
    }

    // Initialize price sliders
    function initializePriceSliders() {
        // Set initial display values
        minPriceDisplay.textContent = `€ ${priceMinSlider.value}`;
        maxPriceDisplay.textContent = `€ ${priceMaxSlider.value}`;

        // Event listeners for sliders
        priceMinSlider.addEventListener('input', () => {
            if (parseFloat(priceMinSlider.value) > parseFloat(priceMaxSlider.value)) {
                priceMinSlider.value = priceMaxSlider.value;
            }
            minPriceDisplay.textContent = `€ ${priceMinSlider.value}`;
            filterProducts();
        });

        priceMaxSlider.addEventListener('input', () => {
            if (parseFloat(priceMaxSlider.value) < parseFloat(priceMinSlider.value)) {
                priceMaxSlider.value = priceMinSlider.value;
            }
            maxPriceDisplay.textContent = `€ ${priceMaxSlider.value}`;
            filterProducts();
        });
    }

    // Clear filters function
    function clearFilters() {
        filterCategorySelect.value = 'all';
        priceMinSlider.value = priceMinSlider.min; // Reset slider to min
        priceMaxSlider.value = priceMaxSlider.max; // Reset slider to max
        minPriceDisplay.textContent = `€ ${priceMinSlider.min}`;
        maxPriceDisplay.textContent = `€ ${priceMaxSlider.max}`;
        renderProducts(products); // Render all products
    }

    // Event Listeners for filters
    clearFiltersBtn.addEventListener('click', clearFilters);
    filterCategorySelect.addEventListener('change', filterProducts);

    // Event Listeners for price filter modal
    // Removed price filter modal event listeners as it's replaced by slider

    productGallery.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.remove-from-cart-btn');
        if (removeButton) {
            const productId = removeButton.getAttribute('data-id');
            removeFromCart(productId);
        }
    });

    // Observador para mudança de idioma
    const langSelect = document.getElementById('language-switcher');
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        renderProducts(products); // Re-render all products with new language
        updateCartDisplay();
    });

    // Carregamento inicial
    loadProducts();
});