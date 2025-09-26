console.log('script.js version: ' + '1.155' + ' loaded at ' + new Date().toLocaleTimeString());

// Variáveis e funções globais para tradução
let translations = {};

function applyTranslations() {
    console.log('Applying translations...');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[key];
            } else if (element.tagName === 'A' || element.classList.contains('logo') || /<[a-z][\s\S]*>/i.test(translations[key])) {
                element.innerHTML = translations[key];
            } else {
                element.textContent = translations[key];
            }
        } else {
            console.warn('Missing translation for key:', key, 'on element:', element);
        }
    });
    console.log('Translations applied.');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired!');
    const contactLinks = document.getElementById('contact-links');
    const languageSwitcher = document.getElementById('language-switcher');

    async function loadTranslations(lang) {
        console.log('Loading translations for:', lang);
        try {
            const response = await fetch(`./lang/${lang}.json`);
            translations = await response.json();
            console.log('Translations loaded:');
            applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    const savedLang = localStorage.getItem('lang') || 'pt';
    console.log('Initializing language to:', savedLang);
    if (languageSwitcher) {
        languageSwitcher.value = savedLang;
    }
    loadTranslations(savedLang);
    applyTranslations(); // Adicionar chamada explícita para aplicar traduções ao menu após o carregamento inicial

    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => {
            const newLang = event.target.value;
            localStorage.setItem('lang', newLang);
            loadTranslations(newLang);
            applyTranslations(); // Adicionar chamada explícita para aplicar traduções ao menu após a mudança de idioma
        });
    }

    // O restante do seu código original de script.js (hamburger, social-media, etc.) continua aqui...
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navUl = document.querySelector('nav ul');

    if (hamburgerMenu && navUl) {
        hamburgerMenu.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    const imageContent = document.querySelector('.image-content');
    if (imageContent) {
        imageContent.classList.add('is-visible');
    }

    async function loadSocialMediaLinks() {
        if (!contactLinks) return;

        try {
            const response = await fetch('base/redes.txt');
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');

            contactLinks.innerHTML = ''; // Clear existing content

            const socialMediaMap = {
                'Facebook': 'fab fa-facebook-f',
                'Instagram': 'fab fa-instagram',
                'LinkedIn': 'fab fa-linkedin-in',
                'Email': 'fas fa-envelope'
            };

            for (let i = 0; i < lines.length; i += 2) {
                const name = lines[i].trim();
                const url = lines[i + 1].trim();

                const iconClass = socialMediaMap[name];
                if (iconClass) {
                    const a = document.createElement('a');
                    a.href = name === 'Email' ? `mailto:${url}` : url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.innerHTML = `<i class="${iconClass}"></i>`;
                    contactLinks.appendChild(a);
                }
            }
        } catch (error) {
            console.error('Error loading social media links:', error);
        }
    }

    // Call this function after translations are loaded or when DOM is ready
    loadSocialMediaLinks();

    // Portfolio Modal Logic
    const portfolioModal = document.getElementById('portfolio-modal');
    if (portfolioModal) {
        const modalTitle = portfolioModal.querySelector('.modal-title');
        const modalProjectImage = document.getElementById('modal-project-image');
        const modalDescription = portfolioModal.querySelector('.modal-description');
        const modalDetails = portfolioModal.querySelector('.modal-details');
        const modalTechnology = portfolioModal.querySelector('.modal-technology');
        const closeButton = portfolioModal.querySelector('.close-button');

        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => {
                const descriptionKey = item.getAttribute('data-description');
                const detailsKey = item.getAttribute('data-details');
                const technologyKey = item.getAttribute('data-technology'); // Adicionado
                const titleKey = item.querySelector('.portfolio-title').getAttribute('data-i18n');
                const imageUrl = item.querySelector('img').src;

                modalTitle.textContent = translations[titleKey] || item.querySelector('.portfolio-title').textContent;
                modalProjectImage.src = imageUrl;
                modalDescription.innerHTML = translations[descriptionKey] || '';
                modalDetails.innerHTML = translations[detailsKey] || '';
                if (modalTechnology) { // Adicionado: Verificação de nulidade
                    modalTechnology.innerHTML = translations[technologyKey] || ''; // Adicionado
                }

                portfolioModal.style.display = 'block';
            });
        });

        closeButton.addEventListener('click', () => {
            portfolioModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === portfolioModal) {
                portfolioModal.style.display = 'none';
            }
        });
    }

    // Carousel Logic for fotos.html
    console.log('Attempting to get element with id "carousel-slide":', document.getElementById('carousel-slide'));
    const carouselSlide = document.getElementById('carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    console.log('carouselSlide:', carouselSlide);
    console.log('carouselImages:', carouselImages);

    if (carouselSlide && carouselImages.length > 0) {
        let counter = 0;
        const totalImages = carouselImages.length;
        const size = carouselImages[0].clientWidth; // Assuming all images have the same width

        // Function to update carousel position
        function updateCarousel() {
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }

        // Manual Navigation
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (counter < totalImages - 1) {
                    counter++;
                    updateCarousel();
                } else {
                    counter = 0; // Loop back to the first image
                    updateCarousel();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (counter > 0) {
                    counter--;
                    updateCarousel();
                } else {
                    counter = totalImages - 1; // Loop back to the last image
                    updateCarousel();
                }
            });
        }

        // Automatic sliding
        setInterval(() => {
            if (counter < totalImages - 1) {
                counter++;
            } else {
                counter = 0; // Loop back to the first image
            }
            updateCarousel();
        }, 3000); // Change image every 3 seconds
    }

    // etc...
});
