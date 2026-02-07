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
            const response = await fetch(`./lang/${lang}.json?v=${new Date().getTime()}`);
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

    // Definição dos links e ícones SVG
    const socialLinks = {
        'LinkedIn': {
            url: 'https://www.linkedin.com/in/edney-pugliese/',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 53.79-54.3c29.7 0 53.79 24.2 53.79 54.3.01 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>'
        },
        'Instagram': {
            url: 'https://www.instagram.com/edneypugliese/',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9 26.3 26.2 58 34.4 93.9 36.2 37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>'
        },
        'Email': {
            url: 'mailto:contatto@edneypugliese.it',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zM317.1 269.4c-6.3 4.8-13.7 7.2-21.1 7.2s-14.8-2.4-21.1-7.2L48 169.6V128h416v41.6L317.1 269.4z"/></svg>'
        },
        'Facebook': {
            url: 'https://www.facebook.com/edneypugliese',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.11c0-20.66 3.26-38.61 33.97-38.61h54.46V6.8H160.73c-17.75 0-26.74 8.29-26.74 24.41v50.67H80v92.66h53.99V288h-53.99v224h80v-224z"/></svg>'
        }
        // Adicione outros links aqui se necessário
    };

    contactLinks.innerHTML = ''; // Limpa o conteúdo existente

    for (const name in socialLinks) {
        const link = socialLinks[name];
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = link.svg;
        a.setAttribute('aria-label', `Link para ${name}`);
        contactLinks.appendChild(a);
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
        const closeButton = portfolioModal.querySelector('.close-button');

        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => {
                const descriptionKey = item.getAttribute('data-description');
                const detailsKey = item.getAttribute('data-details');
                const titleKey = item.querySelector('.portfolio-title').getAttribute('data-i18n');
                const imageUrl = item.querySelector('img').src;

                modalTitle.textContent = translations[titleKey] || item.querySelector('.portfolio-title').textContent;
                modalProjectImage.src = imageUrl;
                modalDescription.innerHTML = translations[descriptionKey] || '';
                modalDetails.innerHTML = translations[detailsKey] || '';

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
