document.addEventListener('DOMContentLoaded', () => {

    const exploreBtn = document.getElementById('exploreBtn');
    const wishesSection = document.getElementById('wishes');
    const heroSection = document.getElementById('hero');
    const particleContainer = document.querySelector('.particle-container');
    const confettiContainerWishes = document.querySelector('.confetti-container-wishes');

    // >>>>>>>>>> START OF CAROUSEL JS ELEMENTS (UPDATED) <<<<<<<<<<
    const wishesCarousel = document.getElementById('wishesCarousel');
    const carouselPrevBtn = document.getElementById('carouselPrev');
    const carouselNextBtn = document.getElementById('carouselNext');
    const carouselPagination = document.getElementById('carouselPagination');
    const wishItems = document.querySelectorAll('.wish-item');
    let currentIndex = 0;
    let autoPlayInterval;

    function initializeCarousel() {
        if (wishItems.length === 0) return;

        // Ensure only the first item is active/visible initially
        wishItems.forEach((item, index) => {
            item.classList.remove('active');
            item.style.opacity = '0'; // Ensure it's truly invisible
            item.style.pointerEvents = 'none'; // Make it unclickable
        });
        wishItems[0].classList.add('active'); // Make first item active
        wishItems[0].style.opacity = '1'; // Make first item visible
        wishItems[0].style.pointerEvents = 'auto'; // Make first item clickable

        updatePagination();
        startAutoPlay();
    }

    function updateCarousel() {
        const offset = -currentIndex * 100;
        wishesCarousel.style.transform = `translateX(${offset}%)`;

        // Manage active class, opacity, and pointer-events for smooth transitions
        wishItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            } else {
                item.classList.remove('active');
                item.style.opacity = '0';
                item.style.pointerEvents = 'none';
            }
        });
        updatePagination();
    }

    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % wishItems.length;
        updateCarousel();
        resetAutoPlay();
    }

    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + wishItems.length) % wishItems.length;
        updateCarousel();
        resetAutoPlay();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    function updatePagination() {
        carouselPagination.innerHTML = '';
        wishItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToSlide(index));
            carouselPagination.appendChild(dot);
        });
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(goToNextSlide, 8000); // Change slide every 8 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    carouselPrevBtn.addEventListener('click', goToPrevSlide);
    carouselNextBtn.addEventListener('click', goToNextSlide);
    // >>>>>>>>>> END OF CAROUSEL JS ELEMENTS <<<<<<<<<<


    let particleInterval;
    let wishesConfettiInterval;

    // --- Particle Animation for Hero Section ---
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particleContainer.appendChild(particle);

        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;

        const duration = Math.random() * 10 + 5;
        const offsetX = (Math.random() - 0.5) * 200;

        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--offset-x', `${offsetX}px`);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!particleInterval) {
                    particleInterval = setInterval(createParticle, 300);
                }
            } else {
                clearInterval(particleInterval);
                particleInterval = null;
            }
        });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);


    // --- Explore Button "Crazy" Effect & Transition ---
    exploreBtn.addEventListener('click', () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti-container');
        document.body.appendChild(confettiContainer);

        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#4f3e6f', '#f9a825'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `${Math.random() * 100}vh`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confettiContainer.appendChild(confetti);
        }

        const clickSound = new Audio('click-sound.mp3');
        clickSound.play();

        setTimeout(() => {
            confettiContainer.remove();

            document.body.classList.add('scroll-enabled');

            window.scrollTo({
                top: heroSection.offsetHeight,
                behavior: 'smooth'
            });

            wishesSection.classList.add('active');
            startWishesConfetti();
            clearInterval(particleInterval);
            particleInterval = null;

            // NEW: Initialize carousel after wishes section is active
            initializeCarousel(); // Call this to set up the first slide
        }, 1000);
    });

    // --- Continuous Confetti for Wishes Section ---
    function createWishesConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-wishes');
        confettiContainerWishes.appendChild(confetti);

        const size = Math.random() * 6 + 3;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.setProperty('--x-start', `${(Math.random() - 0.5) * 200}px`);
        confetti.style.setProperty('--x-end', `${(Math.random() - 0.5) * 200}px`);
        confetti.style.setProperty('--duration', `${Math.random() * 6 + 4}s`);
        confetti.style.setProperty('--rotate-end', `${Math.random() * 720 + 360}deg`);

        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }

    function startWishesConfetti() {
        if (!wishesConfettiInterval) {
            wishesConfettiInterval = setInterval(createWishesConfetti, 150);
        }
    }

    function stopWishesConfetti() {
        clearInterval(wishesConfettiInterval);
        wishesConfettiInterval = null;
    }

    const wishesSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startWishesConfetti();
            } else {
                stopWishesConfetti();
            }
        });
    }, { threshold: 0.1 });
    wishesSectionObserver.observe(wishesSection);

    // --- Music Toggle ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleBtn = document.getElementById('musicToggle');
    const playIcon = document.querySelector('.icon-play');
    const pauseIcon = document.querySelector('.icon-pause');

    if (musicToggleBtn && backgroundMusic) {
        let isPlaying = false;

        backgroundMusic.play().then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
        }).catch(e => {
            console.warn("Autoplay blocked, user interaction required for music.", e);
            isPlaying = false;
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
        });

        backgroundMusic.addEventListener('ended', () => {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play();
        });

        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                backgroundMusic.pause();
                isPlaying = false;
                playIcon.style.display = 'inline-block';
                pauseIcon.style.display = 'none';
            } else {
                backgroundMusic.play().then(() => {
                    isPlaying = true;
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'inline-block';
                }).catch(e => console.error("Could not play music:", e));
            }
        });
    }
});