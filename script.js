console.log('Script loaded!');
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.getElementById('contact-links');
    const languageSwitcher = document.getElementById('language-switcher');
    let translations = {};

    // Function to load translations
    async function loadTranslations(lang) {
        console.log('Loading translations for:', lang);
        try {
            const response = await fetch(`./lang/${lang}.json`);
            translations = await response.json();
            console.log('Translations loaded:', translations);
            applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    // Function to apply translations
    function applyTranslations() {
        console.log('Applying translations...');
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'TITLE') {
                    document.title = translations[key];
                } else {
                    // Check if the translation contains HTML tags
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

    // Initialize language
    const savedLang = localStorage.getItem('lang') || 'pt';
    console.log('Initializing language to:', savedLang);
    if (languageSwitcher) {
        languageSwitcher.value = savedLang;
    }
    loadTranslations(savedLang);

    // Event listener for language switcher
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => {
            const newLang = event.target.value;
            localStorage.setItem('lang', newLang);
            loadTranslations(newLang);
        });
    }

    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navUl = document.querySelector('nav ul');

    console.log('Hamburger Menu Element:', hamburgerMenu);
    console.log('Nav UL Element:', navUl);

    if (hamburgerMenu && navUl) {
        hamburgerMenu.addEventListener('click', () => {
            console.log('Hamburger menu clicked!');
            navUl.classList.toggle('active');
            console.log('Nav UL active class toggled. Current classes:', navUl.classList);
        });
    }

    if (contactLinks) { // Adiciona esta verificação
        const socialMedia = {
            'facebook-f': 'https://www.facebook.com/edney.pugleise',
            'instagram': 'https://www.instagram.com/edneypugliese/',
            'linkedin-in': 'https://www.linkedin.com/in/edney-vicente-pugliese-machado-35b0688b/',
            'envelope': 'mailto:edneypugliese@gmail.com'
        };

        for (const [icon, url] of Object.entries(socialMedia)) {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';

            const i = document.createElement('i');
            if (icon === 'envelope') {
                i.className = `fas fa-${icon}`;
            } else {
                i.className = `fab fa-${icon}`;
            }
            
            a.appendChild(i);
            contactLinks.appendChild(a);
        }
    }

    // Fade-in effect for the profile image
    const imageContent = document.querySelector('.image-content');
    if (imageContent) {
        setTimeout(() => {
            imageContent.classList.remove('fade-in');
        }, 100); // Small delay to ensure CSS is applied before removing the class
    }
});