document.addEventListener('DOMContentLoaded', function() {
    // Carrossel de Fotos
    const carousel = document.getElementById('photo-carousel');
    const images = [
        'base/download (1).png',
        'base/download (2).png',
        'base/download (3).png',
        'base/download (4).png',
        'base/download (5).png',
        'base/download (6).png',
        'base/download (7).png'
    ];

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        carousel.appendChild(img);
    });

    // Links de Contato
    const contactLinks = document.getElementById('contact-links');
    const socialMedia = {
        'Facebook': 'https://www.facebook.com/edney.pugleise',
        'Instagram': 'https://www.instagram.com/edneypugliese/',
        'LinkedIn': 'https://www.linkedin.com/in/edney-vicente-pugliese-machado-35b0688b/',
        'Email': 'mailto:edneypugliese@gmail.com'
    };

    for (const [name, url] of Object.entries(socialMedia)) {
        const a = document.createElement('a');
        a.href = url;
        a.textContent = name;
        a.target = '_blank'; // Abrir em nova aba
        contactLinks.appendChild(a);
    }
});
