// Global cart data
        let cart = [];
        let cartCount = 0;
        let discountApplied = false;
        let discountAmount = 0;

        // Product data with icons
        const productIcons = {
            'motorcycle': 'fas fa-motorcycle',
            'watch': 'fas fa-clock',
            'necklace': 'fas fa-gem',
            'yacht': 'fas fa-ship',
            'villa': 'fas fa-home',
            'art': 'fas fa-palette'
        };

        const productDescriptions = {
            'motorcycle': 'Exclusieve luxe motorfiets met topkwaliteit afwerking',
            'watch': 'Zwitsers precision timepiece met luxe details',
            'necklace': 'Handgemaakte diamanten halsketting van topkwaliteit',
            'yacht': 'Luxe superjacht voor de ultieme zeevaart ervaring',
            'villa': 'Exclusieve villa met alle moderne luxe voorzieningen',
            'art': 'Origineel kunstwerk van gerenommeerde kunstenaar'
        };

        // Initialize cart on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadCartData();
            renderCart();
            setupEventListeners();
        });

        function setupEventListeners() {
            // Checkout form submission
            document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);

            // Modal close events
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('checkoutModal');
                if (event.target === modal) {
                    closeCheckout();
                }
            });

            // Escape key to close modal
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeCheckout();
                }
            });
        }

        function loadCartData() {
            // Demo data - in a real application this would come from storage or API
            cart = [
                {
                    id: 1,
                    name: 'Luxury Motorcycle',
                    type: 'motorcycle',
                    price: 85000,
                    quantity: 1
                },
                {
                    id: 2,
                    name: 'Swiss Timepiece',
                    type: 'watch',
                    price: 25000,
                    quantity: 2
                },
                {
                    id: 3,
                    name: 'Diamond Necklace',
                    type: 'necklace',
                    price: 150000,
                    quantity: 1
                }
            ];
            
            cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        function renderCart() {
            const container = document.getElementById('cartItemsContainer');
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Uw winkelmandje is leeg</h3>
                        <p>Voeg enkele luxe artikelen toe om te beginnen met winkelen</p>
                        <a href="#" class="continue-shopping" onclick="goBack()">Verder winkelen</a>
                    </div>
                `;
                updateSummary();
                return;
            }

            container.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <i class="${productIcons[item.type] || 'fas fa-cube'}"></i>
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${productDescriptions[item.type] || 'Luxe artikel van topkwaliteit'}</div>
                        <div class="item-price">€${item.price.toLocaleString('nl-NL')}</div>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id})">
                            <i class="fas fa-trash"></i> Verwijderen
                        </button>
                    </div>
                </div>
            `).join('');

            updateSummary();
        }

        function updateQuantity(itemId, newQuantity) {
            if (newQuantity <= 0) {
                removeItem(itemId);
                return;
            }

            const item = cart.find(item => item.id === itemId);
            if (item) {
                const oldQuantity = item.quantity;
                item.quantity = newQuantity;
                cartCount = cartCount - oldQuantity + newQuantity;
                
                renderCart();
                showNotification(`Aantal bijgewerkt naar ${newQuantity}`, 'success');
            }
        }

        function removeItem(itemId) {
            const itemIndex = cart.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                const item = cart[itemIndex];
                cartCount -= item.quantity;
                cart.splice(itemIndex, 1);
                
                renderCart();
                showNotification(`${item.name} verwijderd uit winkelmandje`, 'success');
            }
        }

        function updateSummary() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.21; // 21% BTW
            const discount = discountApplied ? discountAmount : 0;
            const total = subtotal + tax - discount;

            document.getElementById('subtotal').textContent = `€${subtotal.toLocaleString('nl-NL')}`;
            document.getElementById('tax').textContent = `€${Math.round(tax).toLocaleString('nl-NL')}`;
            document.getElementById('total').textContent = `€${Math.round(total).toLocaleString('nl-NL')}`;

            // Update checkout button state
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (cart.length === 0) {
                checkoutBtn.disabled = true;
                checkoutBtn.textContent = 'Winkelmandje is leeg';
            } else {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Bestelling plaatsen';
            }
        }

        function applyDiscount() {
            const discountCode = document.getElementById('discountInput').value.toUpperCase();
            const validCodes = {
                'LUXURY10': 0.10,
                'VIP20': 0.20,
                'WELCOME': 0.05,
                'GLOBAL25': 0.25
            };

            if (validCodes[discountCode]) {
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                discountAmount = subtotal * validCodes[discountCode];
                discountApplied = true;
                
                // Add discount row to summary
                const summaryContainer = document.querySelector('.cart-summary');
                const totalRow = summaryContainer.querySelector('.summary-row.total');
                
                // Remove existing discount row if any
                const existingDiscount = summaryContainer.querySelector('.discount-row');
                if (existingDiscount) {
                    existingDiscount.remove();
                }

                // Add new discount row
                const discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount-row';
                discountRow.innerHTML = `
                    <span>Korting (${discountCode}):</span>
                    <span style="color: #27ae60;">-€${Math.round(discountAmount).toLocaleString('nl-NL')}</span>
                `;
                totalRow.parentNode.insertBefore(discountRow, totalRow);

                updateSummary();
                showNotification(`Kortingscode ${discountCode} toegepast! ${Math.round(validCodes[discountCode] * 100)}% korting`, 'success');
                document.getElementById('discountInput').value = '';
            } else {
                showNotification('Ongeldige kortingscode. Probeer: LUXURY10, VIP20, WELCOME, GLOBAL25', 'error');
            }
        }

        function openCheckout() {
            if (cart.length === 0) {
                showNotification('Winkelmandje is leeg', 'error');
                return;
            }

            document.getElementById('checkoutModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeCheckout() {
            document.getElementById('checkoutModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function handleCheckout(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            const orderData = {};
            
            // Collect form data
            for (let [key, value] of formData.entries()) {
                orderData[key] = value;
            }

            // Add cart data
            orderData.items = cart;
            orderData.subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            orderData.tax = orderData.subtotal * 0.21;
            orderData.discount = discountApplied ? discountAmount : 0;
            orderData.total = orderData.subtotal + orderData.tax - orderData.discount;
            orderData.orderNumber = 'GM-' + Date.now();
            orderData.orderDate = new Date().toLocaleString('nl-NL');

            // Simulate order processing
            const submitBtn = form.querySelector('.submit-order');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<div class="loading"></div> Bestelling verwerken...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                document.getElementById('checkoutContent').innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Bestelling succesvol geplaatst!</h3>
                        <p><strong>Bestelnummer:</strong> ${orderData.orderNumber}</p>
                        <p><strong>Totaalbedrag:</strong> €${Math.round(orderData.total).toLocaleString('nl-NL')}</p>
                        <p>Bedankt voor uw bestelling, ${orderData.firstName} ${orderData.lastName}!</p>
                        <p>U ontvangt een bevestiging per e-mail op <strong>${orderData.email}</strong></p>
                        <p>Uw bestelling wordt binnen 3-5 werkdagen bezorgd op het opgegeven adres.</p>
                        <br>
                        <button class="continue-shopping" onclick="finishOrder
                        <button class="continue-shopping" onclick="finishOrder()">
                            <i class="fas fa-home"></i> Terug naar winkel
                        </button>
                    </div>
                `;
            }, 2000);
        }

        function finishOrder() {
            // Clear cart
            cart = [];
            cartCount = 0;
            discountApplied = false;
            discountAmount = 0;
            
            // Close modal
            closeCheckout();
            
            // Show success notification
            showNotification('Bestelling voltooid! Bedankt voor uw aankoop.', 'success');
            
            // Redirect back to main shop after a short delay
            setTimeout(() => {
                goBack();
            }, 2000);
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }

        function goBack() {
            // In a real application, this would navigate back to the main shop
            window.history.back();
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            // Press 'C' to open checkout
            if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.altKey) {
                const modal = document.getElementById('checkoutModal');
                if (modal.style.display !== 'block' && cart.length > 0) {
                    openCheckout();
                }
            }
        });

        // Auto-save cart changes (in a real app, this would save to localStorage or send to server)
        function saveCartState() {
            // This would typically save to localStorage or send to server
            console.log('Cart state saved:', cart);
        }

        // Call saveCartState whenever cart changes
        const originalUpdateQuantity = updateQuantity;
        const originalRemoveItem = removeItem;

        updateQuantity = function(itemId, newQuantity) {
            originalUpdateQuantity(itemId, newQuantity);
            saveCartState();
        };

        removeItem = function(itemId) {
            originalRemoveItem(itemId);
            saveCartState();
        };

        // Add smooth scroll behavior for better UX
        document.documentElement.style.scrollBehavior = 'smooth';

        // Add loading states for better UX
        function addLoadingState(element) {
            element.disabled = true;
            element.style.opacity = '0.7';
            element.style.cursor = 'not-allowed';
        }

        function removeLoadingState(element) {
            element.disabled = false;
            element.style.opacity = '1';
            element.style.cursor = 'pointer';
        }

        // Enhanced form validation
        function validateCheckoutForm(formData) {
            const errors = [];
            
            // Required fields validation
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
            requiredFields.forEach(field => {
                if (!formData.get(field) || formData.get(field).trim() === '') {
                    errors.push(`${field} is verplicht`);
                }
            });

            // Email validation
            const email = formData.get('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                errors.push('Ongeldig e-mailadres');
            }

            // Phone validation (basic)
            const phone = formData.get('phone');
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (phone && !phoneRegex.test(phone)) {
                errors.push('Ongeldig telefoonnummer');
            }

            // Postal code validation for Netherlands
            const zipCode = formData.get('zipCode');
            const country = formData.get('country');
            if (country === 'NL' && zipCode) {
                const nlZipRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i;
                if (!nlZipRegex.test(zipCode)) {
                    errors.push('Ongeldige Nederlandse postcode (bijv. 1234 AB)');
                }
            }

            return errors;
        }

        // Update the handleCheckout function to include validation
        const originalHandleCheckout = handleCheckout;
        handleCheckout = function(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            
            // Validate form
            const errors = validateCheckoutForm(formData);
            if (errors.length > 0) {
                showNotification('Formulier bevat fouten: ' + errors.join(', '), 'error');
                return;
            }
            
            // Continue with original checkout process
            originalHandleCheckout(event);
        };

        // Add animation to cart items when they change
        function animateCartItem(itemId) {
            const itemElement = document.querySelector(`[data-id="${itemId}"]`);
            if (itemElement) {
                itemElement.style.transform = 'scale(1.05)';
                itemElement.style.transition = 'transform 0.2s ease';
                setTimeout(() => {
                    itemElement.style.transform = 'scale(1)';
                }, 200);
            }
        }

        // Enhanced discount system with more codes
        const discountCodes = {
            'LUXURY10': { discount: 0.10, description: '10% korting op alle artikelen' },
            'VIP20': { discount: 0.20, description: '20% VIP korting' },
            'WELCOME': { discount: 0.05, description: '5% welkomstkorting' },
            'GLOBAL25': { discount: 0.25, description: '25% speciale korting' },
            'NEWCUSTOMER': { discount: 0.15, description: '15% nieuwe klant korting' },
            'LUXURY50': { discount: 0.50, description: '50% mega korting!' }
        };

        // Update applyDiscount function to use enhanced system
        applyDiscount = function() {
            const discountCode = document.getElementById('discountInput').value.toUpperCase();
            
            if (discountCodes[discountCode]) {
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const discountInfo = discountCodes[discountCode];
                discountAmount = subtotal * discountInfo.discount;
                discountApplied = true;
                
                // Add discount row to summary
                const summaryContainer = document.querySelector('.cart-summary');
                const totalRow = summaryContainer.querySelector('.summary-row.total');
                
                // Remove existing discount row if any
                const existingDiscount = summaryContainer.querySelector('.discount-row');
                if (existingDiscount) {
                    existingDiscount.remove();
                }

                // Add new discount row
                const discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount-row';
                discountRow.innerHTML = `
                    <span>Korting (${discountCode}):</span>
                    <span style="color: #27ae60;">-€${Math.round(discountAmount).toLocaleString('nl-NL')}</span>
                `;
                totalRow.parentNode.insertBefore(discountRow, totalRow);

                updateSummary();
                showNotification(`${discountInfo.description} toegepast!`, 'success');
                document.getElementById('discountInput').value = '';
            } else {
                showNotification('Ongeldige kortingscode. Probeer: LUXURY10, VIP20, WELCOME, GLOBAL25, NEWCUSTOMER', 'error');
            }
        };

        // Add print functionality for orders
        function printOrder(orderData) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Bestelling ${orderData.orderNumber}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .order-details { margin-bottom: 20px; }
                        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        .items-table th { background-color: #f2f2f2; }
                        .total-section { margin-top: 20px; text-align: right; }
                        .total { font-weight: bold; font-size: 1.2em; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Global Market</h1>
                        <h2>Bestelbevestiging</h2>
                    </div>
                    <div class="order-details">
                        <p><strong>Bestelnummer:</strong> ${orderData.orderNumber}</p>
                        <p><strong>Datum:</strong> ${orderData.orderDate}</p>
                        <p><strong>Klant:</strong> ${orderData.firstName} ${orderData.lastName}</p>
                        <p><strong>E-mail:</strong> ${orderData.email}</p>
                        <p><strong>Adres:</strong> ${orderData.address}, ${orderData.city} ${orderData.zipCode}</p>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Artikel</th>
                                <th>Aantal</th>
                                <th>Prijs per stuk</th>
                                <th>Totaal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>€${item.price.toLocaleString('nl-NL')}</td>
                                    <td>€${(item.price * item.quantity).toLocaleString('nl-NL')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total-section">
                        <p>Subtotaal: €${orderData.subtotal.toLocaleString('nl-NL')}</p>
                        <p>BTW (21%): €${Math.round(orderData.tax).toLocaleString('nl-NL')}</p>
                        ${orderData.discount > 0 ? `<p>Korting: -€${Math.round(orderData.discount).toLocaleString('nl-NL')}</p>` : ''}
                        <p class="total">Totaal: €${Math.round(orderData.total).toLocaleString('nl-NL')}</p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }

        // Console log for debugging
        console.log('Global Market Shopping Cart initialized');
        console.log('Available discount codes:', Object.keys(discountCodes));