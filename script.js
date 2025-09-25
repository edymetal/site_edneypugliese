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
            console.log('Processing element with key:', key, 'Element:', element); // Log para cada elemento
            if (translations[key]) {
                if (element.tagName === 'TITLE') {
                    document.title = translations[key];
                } else if (element.classList.contains('review-text-content')) {
                    const fullText = translations[key];
                    const maxLength = 150; // Define o limite de caracteres
                    let displayedText = fullText;
                    let needsReadMore = false;

                    // Remove o span class="read-more" do texto completo para evitar duplicação
                    const cleanFullText = fullText.replace(/<span class="read-more">.*?<\/span>/g, '').trim();

                    if (cleanFullText.length > maxLength) {
                        displayedText = cleanFullText.substring(0, maxLength) + '... <span class="read-more" data-i18n="read_more_text">Mais</span>';
                        needsReadMore = true;
                    }

                    element.innerHTML = displayedText;
                    element.setAttribute('data-full-text', cleanFullText); // Armazena o texto completo

                    if (needsReadMore) {
                        const readMoreSpan = element.querySelector('.read-more');
                        if (readMoreSpan) {
                            readMoreSpan.addEventListener('click', (event) => {
                                event.preventDefault();
                                if (element.classList.contains('expanded')) {
                                    element.innerHTML = displayedText; // Volta para o texto truncado
                                    element.classList.remove('expanded');
                                } else {
                                    element.innerHTML = cleanFullText + ' <span class="read-more" data-i18n="read_less_text">Menos</span>'; // Mostra o texto completo
                                    element.classList.add('expanded');
                                }
                                // Re-adiciona o event listener ao novo span "Mais/Menos"
                                const newReadMoreSpan = element.querySelector('.read-more');
                                if (newReadMoreSpan) {
                                    newReadMoreSpan.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        if (element.classList.contains('expanded')) {
                                            element.innerHTML = displayedText;
                                            element.classList.remove('expanded');
                                        } else {
                                            element.innerHTML = cleanFullText + ' <span class="read-more" data-i18n="read_less_text">Menos</span>';
                                            element.classList.add('expanded');
                                        }
                                    });
                                }
                            });
                        }
                    }
                } else if (element.classList.contains('review-meta')) {
                    let translatedText = translations[key];
                    const reviews = element.getAttribute('data-reviews');
                    const photos = element.getAttribute('data-photos');
                    if (reviews) {
                        translatedText = translatedText.replace('{reviews}', reviews);
                    }
                    if (photos) {
                        translatedText = translatedText.replace('{photos}', photos);
                    }
                    element.innerHTML = translatedText;
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
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    if (carouselSlide && carouselImages.length > 0) {
        let counter = 0;
        const totalImages = carouselImages.length;
        let slideInterval;

        function updateSlide() {
            if (carouselImages[0]) {
                carouselSlide.style.transform = 'translateX(' + (-carouselImages[0].clientWidth * counter) + 'px)';
            }
        }

        function startSlideShow() {
            slideInterval = setInterval(() => {
                counter++;
                if (counter === totalImages) {
                    counter = 0;
                }
                updateSlide();
            }, 3000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        function slideNext() {
            stopSlideShow();
            counter++;
            if (counter === totalImages) {
                counter = 0;
            }
            updateSlide();
            startSlideShow();
        }

        function slidePrev() {
            stopSlideShow();
            counter--;
            if (counter < 0) {
                counter = totalImages - 1;
            }
            updateSlide();
            startSlideShow();
        }

        // Event listeners for manual controls
        if (prevBtn) {
            prevBtn.addEventListener('click', slidePrev);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', slideNext);
        }

        startSlideShow(); // Start automatic slideshow

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

    // Portfolio modal logic
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    const closeModal = document.querySelector('.close-button');
    const modalImage = document.getElementById('modal-project-image'); // Alterado para usar o ID
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalDetails = document.querySelector('.modal-details');
    // Lightbox elements
    const imageLightbox = document.getElementById('image-lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (modal) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const title = item.querySelector('.portfolio-title').textContent; // This title is not i18n, it's from the item itself
                const descriptionKey = item.dataset.description;
                const detailsKey = item.dataset.details;
                const description = translations[descriptionKey] || descriptionKey;
                const details = translations[detailsKey] || detailsKey;

                modalImage.src = imgSrc;
                modalTitle.textContent = title; // Keep this as it is the project title

                let detailsHtml = '<h3><i class="fas fa-info-circle"></i> Descrição</h3>';
                detailsHtml += `<p>${description}</p><hr>`;

                const technologies = details.replace('Tecnologia: ', '').split(', ');
                let techHtml = '';
                technologies.forEach(tech => {
                    let icon = '';
                    switch (tech.toLowerCase()) {
                        case 'html5':
                            icon = '<i class="fab fa-html5"></i> ';
                            break;
                        case 'css3':
                            icon = '<i class="fab fa-css3-alt"></i> ';
                            break;
                        case 'php':
                            icon = '<i class="fab fa-php"></i> ';
                            break;
                        case 'laravel':
                            icon = '<i class="fab fa-laravel"></i> ';
                            break;
                        case 'javascript':
                            icon = '<i class="fab fa-js-square"></i> ';
                            break;
                        case 'jquery':
                            icon = '<i class="fab fa-js-square"></i> '; // Using js icon for jquery
                            break;
                    }
                    techHtml += `<li>${icon}${tech}</li>`;
                });

                detailsHtml += '<h3><i class="fas fa-cogs"></i> Tecnologia</h3>';
                detailsHtml += `<ul class="technologies">${techHtml}</ul>`;

                modalDescription.innerHTML = detailsHtml;
                modalDetails.innerHTML = ''; // Clear the old details

                modal.style.display = 'block';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });

        // Lightbox functionality
        modalImage.addEventListener('click', () => {
            imageLightbox.style.display = 'block';
            lightboxImg.src = modalImage.src;
        });

        closeLightbox.addEventListener('click', () => {
            imageLightbox.style.display = 'none';
        });

        imageLightbox.addEventListener('click', (event) => {
            if (event.target === imageLightbox) {
                imageLightbox.style.display = 'none';
            }
        });
    }
}); // Adicionado o '}' de fechamento aqui