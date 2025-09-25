document.addEventListener('DOMContentLoaded', () => {
    const productGallery = document.getElementById('product-gallery');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalPriceElement = document.getElementById('subtotal-price');

    let products = [];
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};
    let currentLang = localStorage.getItem('lang') || 'pt';

    // Carrega os produtos do JSON
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            products = await response.json();
            renderProducts();
            updateCartDisplay();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    // Renderiza os produtos na galeria
    function renderProducts() {
        productGallery.innerHTML = '';
        products.forEach(product => {
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
        applyTranslations(); // Atualiza textos dos botões recém-criados
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
                        <span>€ ${itemTotal.toFixed(2)}</span>
                        <button class="remove-from-cart-btn" data-id="${productId}">X</button>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                }
            }
        }

        subtotalPriceElement.textContent = `€ ${subtotal.toFixed(2)}`;
        renderPayPalButton(subtotal);
    }
    
    // Renderiza o botão do PayPal
    function renderPayPalButton(total) {
        const paypalContainer = document.getElementById('paypal-button-container');
        paypalContainer.innerHTML = ''; // Limpa o botão antigo
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

    // Event Listeners
    productGallery.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });

    // Observador para mudança de idioma
    const langSelect = document.getElementById('lang-select');
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        renderProducts();
        updateCartDisplay();
    });

    // Carregamento inicial
    loadProducts();
});