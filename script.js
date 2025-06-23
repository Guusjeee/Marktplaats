
        // Add smooth scrolling and interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth hover effects for buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                });
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

            // Product card hover effects
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Add click functionality to buttons
            document.querySelector('.cta-button').addEventListener('click', function() {
                document.querySelector('.featured-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });

            // Function to show images when they are loaded
            function showImageWhenLoaded(imgElement, placeholderElement) {
                imgElement.onload = function() {
                    this.style.display = 'block';
                    placeholderElement.style.display = 'none';
                };
                imgElement.onerror = function() {
                    this.style.display = 'none';
                    placeholderElement.style.display = 'flex';
                };
            }

            // Initialize image loading for header and footer images
            const topHeaderImg = document.querySelector('.top-header-image img');
            const topHeaderPlaceholder = document.querySelector('.top-header-placeholder');
            const footerImg = document.querySelector('.footer-image img');
            const footerPlaceholder = document.querySelector('.footer-image-placeholder');

            if (topHeaderImg && topHeaderPlaceholder) {
                showImageWhenLoaded(topHeaderImg, topHeaderPlaceholder);
            }

            if (footerImg && footerPlaceholder) {
                showImageWhenLoaded(footerImg, footerPlaceholder);
            }
        });
