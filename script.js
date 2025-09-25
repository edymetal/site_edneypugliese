console.log('Script loaded!');

// Variáveis e funções globais para tradução
let translations = {};

function applyTranslations() {
    console.log('Applying translations...');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        // console.log('Processing element with key:', key, 'Element:', element); // Log para cada elemento
        if (translations[key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[key];
            } else if (element.classList.contains('review-text-content')) {
                // Lógica específica para reviews (mantida)
            } else if (element.classList.contains('review-meta')) {
                // Lógica específica para meta de reviews (mantida)
            } else {
                if (/<[a-z][\s\S]*>/i.test(translations[key])) {
                    element.innerHTML = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        } else {
            console.warn('Missing translation for key:', key, 'on element:', element);
        }
    });
    console.log('Translations applied.');
}

document.addEventListener('DOMContentLoaded', function() {
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

    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => {
            const newLang = event.target.value;
            localStorage.setItem('lang', newLang);
            loadTranslations(newLang);
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

    // etc...
});
