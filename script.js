/* ===== ARVEN GRUP - MAIN JAVASCRIPT ===== */
/* Tüm animasyonlar ve interaktif özellikler */

document.addEventListener('DOMContentLoaded', () => {
    // Reduced motion kontrolü
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial call

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Menü linkine tıklanınca menüyü kapat
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== HERO IMAGE SLIDER =====
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const heroImages = heroSlider.querySelectorAll('.hero-bg-img');
        if (heroImages.length > 1) {
            let currentHeroIndex = 0;

            setInterval(() => {
                heroImages[currentHeroIndex].classList.remove('active');
                currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
                heroImages[currentHeroIndex].classList.add('active');
            }, 8000); // 8 saniyede bir değişir
        }
    }

    // ===== PARALLAX HERO (Hafifletilmiş) =====
    const heroBg = document.querySelector('.hero-bg-img');

    if (heroBg && !prefersReducedMotion) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = document.querySelector('.hero').offsetHeight;

                    if (scrollY < heroHeight) {
                        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== HERO TEXT ANIMATION (GSAP) =====
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero animasyonları
        const heroTimeline = gsap.timeline({ delay: 0.3 });

        heroTimeline
            .to('.hero-label', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            })
            .to('.title-line', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.3')
            .to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4')
            .to('.hero-cta', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, '-=0.2');
    } else {
        // GSAP yoksa basit CSS ile göster
        document.querySelectorAll('.hero-label, .title-line, .hero-subtitle, .hero-cta').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // ===== SCROLL REVEAL ANIMATION =====
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (!prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach((el) => {
            revealObserver.observe(el);
        });
    } else {
        // Reduced motion için hepsini göster
        revealElements.forEach((el) => {
            el.classList.add('revealed');
        });
    }

    // ===== SIMPLE CARD HOVER EFFECT =====
    // 3D tilt kaldırıldı, sadece basit scale efekti
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.count, .stat-number');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (!target) return;

            const duration = 2000; // 2 saniye
            const startTime = performance.now();
            const startValue = 0;

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(startValue + (target - startValue) * easeOut);

                counter.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Counter'ları görünür olduğunda başlat
    const statsRow = document.querySelector('.stats-row');
    const whyUsSection = document.querySelector('.why-us');
    const timeline = document.querySelector('.timeline');

    function triggerCounters() {
        if (!countersAnimated) {
            countersAnimated = true;
            animateCounters();
        }
    }

    function setupCounterObserver(element) {
        if (!element) return;

        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        triggerCounters();
                        counterObserver.disconnect();
                    }
                });
            },
            { threshold: 0.05 }
        );

        counterObserver.observe(element);
    }

    // Her section için observer kur
    setupCounterObserver(statsRow);
    setupCounterObserver(whyUsSection);
    setupCounterObserver(timeline);

    // Sayfa yüklendiğinde element zaten görünürse kontrol et
    setTimeout(() => {
        if (statsRow && !countersAnimated) {
            const rect = statsRow.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                triggerCounters();
            }
        }
    }, 500);

    // ===== TESTIMONIALS SLIDER =====
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function updateSlider() {
        if (testimonialTrack) {
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        updateSlider();
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            updateSlider();
            startAutoSlide();
        });
    });

    // Otomatik slide başlat
    if (testimonialCards.length > 1) {
        startAutoSlide();
    }

    // Touch/Swipe desteği
    if (testimonialTrack) {
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });

        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (diff > swipeThreshold) {
                nextSlide();
            } else if (diff < -swipeThreshold) {
                prevSlide();
            }
        }
    }

    // ===== LIGHTBOX =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            if (lightbox && lightboxImg && imgSrc) {
                lightboxImg.src = imgSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ESC tuşu ile lightbox kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== LAZY LOAD IMAGES =====
    const lazyImages = document.querySelectorAll('.lazy-img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        if (img.complete) {
                            img.classList.add('loaded');
                        } else {
                            img.addEventListener('load', () => {
                                img.classList.add('loaded');
                            });
                        }

                        imageObserver.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px 0px'
            }
        );

        lazyImages.forEach((img) => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback: Hepsini yükle
        lazyImages.forEach((img) => {
            img.classList.add('loaded');
        });
    }

    // ===== ABOUT SECTION IMAGE SLIDER =====
    const imageSliders = document.querySelectorAll('.image-slider');

    imageSliders.forEach((slider, index) => {
        const images = slider.querySelectorAll('.slider-img');
        if (images.length <= 1) return;

        let currentIndex = 0;

        // Her slider farklı zamanda başlasın (0s, 3s, 6s offset)
        const startDelay = index * 3000;
        // Her slider farklı hızda değişsin (10s, 12s, 14s)
        const intervalTime = 10000 + (index * 2000);

        setTimeout(() => {
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, intervalTime);
        }, startDelay);
    });

    // ===== CONTACT FORM - EMAILJS =====
    const contactForm = document.getElementById('contact-form');

    // EmailJS'i başlat
    if (typeof emailjs !== 'undefined') {
        emailjs.init('NzmnjHu-kvMNGxnQq');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form verilerini al
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basit validasyon
            if (!data.name || !data.email || !data.message) {
                alert('Lütfen tüm zorunlu alanları doldurunuz.');
                return;
            }

            // Email validasyonu
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Lütfen geçerli bir e-posta adresi giriniz.');
                return;
            }

            // Gönder butonunu devre dışı bırak
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Gönderiliyor...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // EmailJS ile gönder
            const templateParams = {
                name: data.name,
                email: data.email,
                phone: data.phone || 'Belirtilmedi',
                title: data.subject || 'Genel',
                message: data.message
            };

            emailjs.send('service_xk5bc3l', 'template_5bv8908', templateParams)
                .then(() => {
                    alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    alert('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = newsletterForm.querySelector('input[type="email"]').value;

            if (email) {
                alert('Bültenimize başarıyla abone oldunuz!');
                newsletterForm.reset();
            }
        });
    }

    // ===== FOOTER REVEAL EFFECT =====
    // Footer sticky reveal efekti için body padding ayarla
    const footer = document.querySelector('.footer');
    const mainContent = document.querySelector('main') || document.body;

    if (footer && !prefersReducedMotion) {
        // Footer yüksekliğini hesapla ve body'e margin ekle
        function updateFooterSpacing() {
            const footerHeight = footer.offsetHeight;
            // Bu efekt için footer'ın altında kalmasını sağlıyoruz
            // Ancak basit bir reveal için transform kullanıyoruz
        }

        window.addEventListener('resize', updateFooterSpacing);
        updateFooterSpacing();
    }

    // ===== SCROLL TO TOP BUTTON (Optional) =====
    // Sayfa çok uzunsa kullanışlı olabilir
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        // 500px'den fazla scroll edildiğinde buton gösterilebilir
    });

    // ===== PERFORMANCE OPTIMIZATION =====
    // Scroll event'lerini throttle et
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // İlk yükleme animasyonları tamamlandıktan sonra scroll listener'ı ekle
    setTimeout(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
    }, 1000);

    // ===== CONSOLE WELCOME MESSAGE =====
    console.log(
        '%c🏢 ARVEN GRUP',
        'color: #1A1A2E; font-size: 24px; font-weight: bold;'
    );
    console.log(
        '%cBirlikte, Daha İyiye.',
        'color: #6B7280; font-size: 14px;'
    );
    console.log(
        '%cwww.arvengrup.com | info@arvengrup.com',
        'color: #6B7280; font-size: 12px;'
    );
});

// ===== PAGE VISIBILITY API =====
// Sayfa arka plandayken animasyonları durdur
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Animasyonları durdur (örn: slider)
        const event = new CustomEvent('page-hidden');
        document.dispatchEvent(event);
    } else {
        // Animasyonları devam ettir
        const event = new CustomEvent('page-visible');
        document.dispatchEvent(event);
    }
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Gerekli yeniden hesaplamalar
        const event = new CustomEvent('window-resized');
        document.dispatchEvent(event);
    }, 250);
});
