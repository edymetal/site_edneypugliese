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
            imageContent.classList.add('is-visible');
        }, 100); // Small delay to ensure CSS is applied before adding the class
    }

    // Carousel logic (moved from fotos.html)
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');

    if (carouselSlide && carouselImages.length > 0) {
        let counter = 0;
        const totalImages = carouselImages.length;

        function slideNext() {
            counter++;
            if (counter === totalImages) {
                counter = 0;
            }
            // Ensure carouselImages[0] exists before accessing clientWidth
            if (carouselImages[0]) {
                carouselSlide.style.transform = 'translateX(' + (-carouselImages[0].clientWidth * counter) + 'px)';
            }
        }

        setInterval(slideNext, 3000); // Change image every 3 seconds

        // Optional: Adjust slide on window resize
        window.addEventListener('resize', () => {
            if (carouselImages[0]) {
                carouselSlide.style.transition = "none"; // Disable transition during resize
                carouselSlide.style.transform = 'translateX(' + (-carouselImages[0].clientWidth * counter) + 'px)';
                // Re-enable transition after a short delay
                setTimeout(() => {
                    carouselSlide.style.transition = "transform 0.5s ease-in-out";
                }, 50);
            }
        });
    }

    // Lógica para o modal de projetos
    const projectItems = document.querySelectorAll('.project-item');
    // Certifique-se de que bootstrap está carregado antes de tentar usar bootstrap.Modal
    if (typeof bootstrap !== 'undefined' && projectItems.length > 0) {
        const projectDetailModal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
        const modalProjectImage = document.getElementById('modalProjectImage');
        const modalProjectTitle = document.getElementById('projectDetailModalLabel');
        const modalProjectDescription = document.getElementById('modalProjectDescription');
        const modalProjectTech = document.getElementById('modalProjectTech');
        const modalProjectDate = document.getElementById('modalProjectDate');
        const modalProjectUrl = document.getElementById('modalProjectUrl');
        const socialShareIcons = document.querySelector('.social-share-icons');

        // Dados dos projetos (para preencher o modal)
        const projectsData = {
            "death_cat_grocery_store": {
                "image": "img/portfolio/death_cat_grocery_store.png",
                "title_key": "project_death_cat_grocery_store_title",
                "description_key": "project_death_cat_grocery_store_description",
                "tech_key": "project_death_cat_grocery_store_tech",
                "date_key": "project_death_cat_grocery_store_date",
                "url_key": "project_death_cat_grocery_store_url"
            },
            "agencia_auto_web": {
                "image": "img/portfolio/agencia_auto_web.png",
                "title_key": "project_agencia_auto_web_title",
                "description_key": "project_agencia_auto_web_description",
                "tech_key": "project_agencia_auto_web_tech",
                "date_key": "project_agencia_auto_web_date",
                "url_key": "project_agencia_auto_web_url"
            }
        };

        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.dataset.projectId;
                const project = projectsData[projectId];

                if (project) {
                    modalProjectImage.src = project.image;
                    modalProjectTitle.textContent = translations[project.title_key] || project.title_key;
                    modalProjectDescription.textContent = translations[project.description_key] || project.description_key;
                    modalProjectTech.textContent = translations[project.tech_key] || project.tech_key;
                    modalProjectDate.textContent = translations[project.date_key] || project.date_key;
                    modalProjectUrl.href = translations[project.url_key] || project.url_key;
                    modalProjectUrl.textContent = translations[project.url_key] || project.url_key;

                    // Lógica de compartilhamento
                    const currentUrl = encodeURIComponent(window.location.href);
                    const projectTitle = encodeURIComponent(translations[project.title_key] || project.title_key);

                    // Atualizar URLs de compartilhamento
                    if (socialShareIcons) {
                        const facebookShare = socialShareIcons.querySelector('[data-share-platform="facebook"]');
                        if (facebookShare) facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;

                        const twitterShare = socialShareIcons.querySelector('[data-share-platform="twitter"]');
                        if (twitterShare) twitterShare.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${projectTitle}`;

                        // Google+ está desativado, pode ser removido ou substituído
                        const googleShare = socialShareIcons.querySelector('[data-share-platform="google"]');
                        if (googleShare) googleShare.href = `https://plus.google.com/share?url=${currentUrl}`;

                        // Instagram não tem API de compartilhamento direto para URL
                        const instagramShare = socialShareIcons.querySelector('[data-share-platform="instagram"]');
                        if (instagramShare) instagramShare.href = `https://www.instagram.com/share?url=${currentUrl}`;

                        const emailShare = socialShareIcons.querySelector('[data-share-platform="email"]');
                        if (emailShare) emailShare.href = `mailto:?subject=${projectTitle}&body=${currentUrl}`;
                    }

                    projectDetailModal.show();
                }
            });
        });
    }
});