// ===== FUNCIONES DE VALIDACIÓN Y UTILIDAD =====

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== NAVBAR Y SCROLL EFFECTS =====

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Actualiza el enlace activo
    highlightActiveNavLink();
});

// Highlight active nav link on scroll
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.scrollY >= (sectionTop - navbarHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLL UNIFICADO =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX EFFECT =====

window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image img');
    if(heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImage.style.transform = `perspective(1000px) rotateY(-10deg) translateY(${rate}px)`;
    }
});

// ===== NEWSLETTER FORM =====

const newsletterForm = document.querySelector('.newsletter-form');
if(newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if(email && validateEmail(email)) {
            // Mostrar feedback visual
            const button = this.querySelector('button');
            const originalHTML = button.innerHTML;
            const originalBg = button.style.background;
            
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = originalBg;
                emailInput.value = '';
                
                // Mostrar notificación
                showNotification('¡Gracias por suscribirte! Te mantendremos informado.');
            }, 2000);
        } else {
            showNotification('Por favor ingresa un email válido.', 'error');
            emailInput.focus();
        }
    });
}

// ===== ANIMACIÓN DE STATS (MEJORADA) =====

const stats = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const stat = entry.target;
            const originalText = stat.textContent.trim();
            
            // Verificar qué tipo de stat es
            if (originalText.includes('K+')) {
                // Es como "10K+" - animar solo el número
                animateKNumber(stat, originalText);
            } else if (originalText.includes('+') || originalText.includes('%') || /^\d+$/.test(originalText.replace(/[+%K]/g, ''))) {
                // Es número con símbolo
                const numericPart = originalText.replace(/[^0-9]/g, '');
                if (numericPart) {
                    const targetNumber = parseInt(numericPart);
                    animateNumber(stat, 0, targetNumber, originalText, 1500);
                }
            }
            
            observer.unobserve(stat);
        }
    });
}, observerOptions);

stats.forEach(stat => observer.observe(stat));

function animateNumber(element, start, end, originalText, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentNumber = Math.floor(progress * (end - start) + start);
        
        // Mantener el símbolo original
        if (originalText.includes('+')) {
            element.textContent = currentNumber + '+';
        } else if (originalText.includes('%')) {
            element.textContent = currentNumber + '%';
        } else {
            element.textContent = currentNumber;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function animateKNumber(element, originalText) {
    const numericPart = parseInt(originalText.replace(/[^0-9]/g, ''));
    let current = 0;
    const increment = Math.ceil(numericPart / 50);
    const duration = 1000;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericPart) {
            current = numericPart;
            clearInterval(timer);
        }
        element.textContent = current + 'K+';
    }, duration / 50);
}

// ===== SIMULACIÓN DE DESCARGA =====

const downloadBtn = document.querySelector('.download .btn-primary');
if(downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        if(this.getAttribute('href') === '#') {
            e.preventDefault();
            
            // Mostrar notificación de descarga
            showNotification('Iniciando descarga de GameHub...', 'info');
            
            // Simular progreso de descarga
            setTimeout(() => {
                showNotification('¡Descarga completada!', 'success');
            }, 2000);
        }
    });
}

// ===== EFECTOS INTERACTIVOS =====

// Hover effect for logo
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.05)';
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'scale(1)';
    });
}

// Click effect for buttons
document.querySelectorAll('.navbar .btn-primary, .nav-links a').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// ===== SISTEMA DE NOTIFICACIONES =====

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#10b981'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    `;
    
    // Add close button styles
    notification.querySelector('button').style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    // Añadir clase activa al cargar
    highlightActiveNavLink();
    
    // Ya tenemos el smooth scroll arriba, no necesita duplicarse
    
    console.log('GameHub website loaded successfully!');
});