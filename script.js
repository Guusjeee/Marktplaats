// Global variables
        let cart = [];
        let cartCount = 0;

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeWebsite();
            loadCartFromStorage();
            setupEventListeners();
        });

        function initializeWebsite() {
            // Add smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Header scroll effect
            window.addEventListener('scroll', function() {
                const header = document.querySelector('.main-header');
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'white';
                    header.style.backdropFilter = 'none';
                }
            });

            // Animate elements on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all cards
            document.querySelectorAll('.category-card, .product-card, .blog-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        }

        function setupEventListeners() {
            // Newsletter form
            document.getElementById('newsletterForm').addEventListener('submit', handleNewsletterSubmit);

            // Search functionality
            document.getElementById('searchInput').addEventListener('input', handleSearch);

            // Modal close
            document.querySelector('.close').addEventListener('click', closeModal);
            window.addEventListener('click', function(event) {
                const modal = document.getElementById('productModal');
                if (event.target === modal) {
                    closeModal();
                }
            });

            // Mobile menu toggle
            document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
        }

        // Cart functionality
        function addToCart(productName, price) {
            const item = {
                id: Date.now(),
                name: productName,
                price: price,
                quantity: 1
            };

            cart.push(item);
            cartCount++;
            updateCartUI();
            saveCartToStorage();
            showNotification(`${productName} added to cart!`);
        }

        function updateCartUI() {
            document.querySelector('.cart-count').textContent = cartCount;
            
            // Add animation to cart icon
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }

        function saveCartToStorage() {
            // Note: Using sessionStorage instead of localStorage for Claude.ai compatibility
            try {
                sessionStorage.setItem('luxuryCart', JSON.stringify(cart));
                sessionStorage.setItem('luxuryCartCount', cartCount.toString());
            } catch (e) {
                console.log('Storage not available, using memory only');
            }
        }

        function loadCartFromStorage() {
            try {
                const savedCart = sessionStorage.getItem('luxuryCart');
                const savedCount = sessionStorage.getItem('luxuryCartCount');
                
                if (savedCart) {
                    cart = JSON.parse(savedCart);
                }
                if (savedCount) {
                    cartCount = parseInt(savedCount);
                    updateCartUI();
                }
            } catch (e) {
                console.log('Storage not available, starting fresh');
            }
        }

        // Category functionality
        function showCategory(category) {
            const categoryData = {
                vehicles: {
                    title: 'Luxury Vehicles',
                    items: ['Ferrari 488 GTB', 'Lamborghini Huracán', 'Rolls-Royce Phantom', 'Bentley Continental GT']
                },
                watches: {
                    title: 'Luxury Timepieces',
                    items: ['Rolex Submariner', 'Patek Philippe Nautilus', 'Audemars Piguet Royal Oak', 'Omega Speedmaster']
                },
                jewelry: {
                    title: 'Fine Jewelry',
                    items: ['Diamond Engagement Ring', 'Emerald Necklace', 'Ruby Earrings', 'Sapphire Bracelet']
                },
                'real-estate': {
                    title: 'Luxury Real Estate',
                    items: ['Manhattan Penthouse', 'Malibu Beach House', 'Swiss Chalet', 'Dubai Marina Apartment']
                },
                yachts: {
                    title: 'Luxury Yachts',
                    items: ['Superyacht Paradise', 'Ocean Explorer', 'Sea Dream', 'Aquatic Luxury']
                },
                art: {
                    title: 'Art & Collectibles',
                    items: ['Contemporary Painting', 'Vintage Sculpture', 'Rare Manuscript', 'Collectible Timepiece']
                }
            };

            const data = categoryData[category];
            if (data) {
                showModal(`
                    <h2>${data.title}</h2>
                    <p>Explore our curated collection of ${data.title.toLowerCase()}</p>
                    <ul style="margin: 20px 0; padding-left: 20px;">
                        ${data.items.map(item => `<li style="margin: 10px 0;">${item}</li>`).join('')}
                    </ul>
                    <button onclick="closeModal()" style="background: #2d5f3f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
                `);
            }
        }

        // Modal functionality
        function showModal(content) {
            document.getElementById('modalContent').innerHTML = content;
            document.getElementById('productModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Search functionality
        function handleSearch(event) {
            const query = event.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productName = product.querySelector('.product-name').textContent.toLowerCase();
                if (productName.includes(query) || query === '') {
                    product.style.display = 'block';
                    product.style.opacity = '1';
                } else {
                    product.style.display = 'none';
                }
            });

            // Show search results count
            const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
            if (query && visibleProducts.length === 0) {
                showNotification('No products found matching your search.');
            }
        }

        // Newsletter functionality
        function handleNewsletterSubmit(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            
            // Simulate API call
            const button = event.target.querySelector('button');
            const originalText = button.textContent;
            button.innerHTML = '<div class="loading"></div>';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                event.target.reset();
                showNotification('Thank you for subscribing to our newsletter!');
            }, 2000);
        }

        // Mobile menu functionality
        function toggleMobileMenu() {
            const nav = document.querySelector('.main-nav');
            const isVisible = nav.style.display === 'block';
            
            if (isVisible) {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'block';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.background = 'white';
                nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                nav.style.padding = '1rem';
                nav.style.zIndex = '1001';
            }
        }

        // Utility functions
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #2d5f3f;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 2001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Advanced features for future PHP integration
        function simulateAPICall(endpoint, data) {
            return new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    console.log(`API Call to ${endpoint}:`, data);
                    resolve({ success: true, data: data });
                }, 1000 + Math.random() * 1000);
            });
        }

        // Product management functions (for future database integration)
        async function loadProducts(category = 'all') {
            try {
                const response = await simulateAPICall('/api/products', { category });
                console.log('Products loaded:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error loading products:', error);
                showNotification('Error loading products. Please try again.');
            }
        }

        async function saveProduct(productData) {
            try {
                const response = await simulateAPICall('/api/products/save', productData);
                console.log('Product saved:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error saving product:', error);
                showNotification('Error saving product. Please try again.');
            }
        }

        // Blog management functions
        async function loadBlogPosts(limit = 10) {
            try {
                const response = await simulateAPICall('/api/blog/posts', { limit });
                console.log('Blog posts loaded:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error loading blog posts:', error);
                showNotification('Error loading blog posts. Please try again.');
            }
        }

        // User management functions
        async function registerUser(userData) {
            try {
                const response = await simulateAPICall('/api/users/register', userData);
                console.log('User registered:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error registering user:', error);
                showNotification('Error creating account. Please try again.');
            }
        }

        // Enhanced responsive behavior
        window.addEventListener('resize', function() {
            const nav = document.querySelector('.main-nav');
            if (window.innerWidth > 768) {
                nav.style.display = '';
                nav.style.position = '';
                nav.style.background = '';
                nav.style.boxShadow = '';
                nav.style.padding = '';
            }
        });

        // Performance optimization
        let ticking = false;
        function updateOnScroll() {
            // Throttle scroll events for better performance
            if (!ticking) {
                requestAnimationFrame(function() {
                    // Add scroll-based animations here
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', updateOnScroll);

        // Preload critical resources
        function preloadResources() {
            const criticalImages = [
                // Add image URLs here when available
            ];

            criticalImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }

        // Initialize preloading
        preloadResources();

        console.log('Global Market luxury platform initialized successfully!');