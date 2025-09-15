document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.getElementById('contact-links');
    const languageSwitcher = document.getElementById('language-switcher');
    let translations = {};

    // Function to load translations
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`./lang/${lang}.json`);
            translations = await response.json();
            applyTranslations();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    // Function to apply translations
    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'TITLE') {
                    document.title = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }

    // Initialize language
    const savedLang = localStorage.getItem('lang') || 'pt';
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
});