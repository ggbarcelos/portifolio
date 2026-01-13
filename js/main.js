// ===================================
// MAIN JAVASCRIPT
// ===================================

// Inicializar AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
});

// ===================================
// NAVBAR SCROLLING EFFECT
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar-custom');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// ===================================
// SMOOTH SCROLLING FOR NAVIGATION
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// FILTER PROJECTS
// ===================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // Filter projects with animation
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in-out';
                // Reinitialize AOS for newly visible elements
                AOS.refresh();
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===================================
// EMAILJS CONFIGURATION
// ===================================
// IMPORTANTE: Configure suas credenciais do EmailJS em https://www.emailjs.com/
// 1. Crie uma conta gratuita
// 2. Adicione um serviço de email (Gmail, Outlook, etc.)
// 3. Crie um template de email
// 4. Substitua as credenciais abaixo:
const EMAILJS_CONFIG = {
    publicKey: 'xAtMa5JUwZUvcGnXw',  // Obtenha em Account > API Keys
    serviceId: 'service_bxjx29y',       // ID do serviço de email configurado
    templateId: 'template_776y0px'      // ID do template criado
};

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');

function setFieldState(field, message) {
    if (!field) return;
    const formGroup = field.closest('.form-group');
    let errorEl = formGroup ? formGroup.querySelector('.field-error') : null;

    if (!errorEl && formGroup) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        formGroup.appendChild(errorEl);
    }

    if (message) {
        field.classList.add('is-invalid');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    } else {
        field.classList.remove('is-invalid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }
}

function showFormStatus(message, type = 'info') {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
}

if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');

        const values = {
            name: nameField?.value.trim() || '',
            email: emailField?.value.trim() || '',
            phone: phoneField?.value.trim() || '',
            subject: subjectField?.value.trim() || '',
            message: messageField?.value.trim() || ''
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        const errors = {
            name: !values.name ? 'Informe seu nome completo.' : values.name.length < 3 ? 'Use ao menos 3 caracteres.' : '',
            email: !values.email ? 'Informe seu e-mail profissional.' : !emailRegex.test(values.email) ? 'Use um e-mail válido (ex: nome@empresa.com).' : '',
            phone: !values.phone ? 'Informe seu telefone.' : !phoneRegex.test(values.phone) ? 'Use um formato válido (ex: (51) 98012-0387).' : '',
            subject: !values.subject ? 'Defina o assunto da conversa.' : values.subject.length < 5 ? 'O assunto precisa de pelo menos 5 caracteres.' : '',
            message: !values.message ? 'Conte rapidamente sobre o projeto.' : values.message.length < 10 ? 'A mensagem precisa de mais detalhes (mínimo 10 caracteres).' : ''
        };

        let hasErrors = false;
        setFieldState(nameField, errors.name);
        setFieldState(emailField, errors.email);
        setFieldState(phoneField, errors.phone);
        setFieldState(subjectField, errors.subject);
        setFieldState(messageField, errors.message);

        Object.values(errors).forEach(msg => {
            if (msg) hasErrors = true;
        });

        if (hasErrors) {
            showFormStatus('Revise os campos destacados e tente novamente.', 'error');
            return;
        }

        // Desabilitar botão durante envio
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset.originalText = submitButton.dataset.originalText || submitButton.textContent;
            submitButton.textContent = 'Enviando...';
        }

        showFormStatus('Enviando sua mensagem...', 'info');

        // Verificar se EmailJS está configurado
        if (typeof emailjs === 'undefined' || EMAILJS_CONFIG.publicKey === 'SEU_PUBLIC_KEY_AQUI') {
            // Fallback: usar mailto se EmailJS não estiver configurado
            console.warn('EmailJS não configurado. Usando mailto como fallback.');
            const mailtoSubject = `[Contato Portfólio] ${values.subject}`;
            const mailtoBody = `Nome: ${values.name}\nE-mail: ${values.email}\nTelefone: ${values.phone}\n\nMensagem:\n${values.message}`;
            const mailtoLink = `mailto:glauberbarcelos@outlook.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
            
            window.location.href = mailtoLink;
            
            setTimeout(() => {
                showFormStatus('Abrimos seu app de e-mail para concluir o envio. Configure o EmailJS para envio automático.', 'info');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Enviar Mensagem';
                }
            }, 600);
            return;
        }

        // Enviar email via EmailJS
        // IMPORTANTE: No template do EmailJS, use {{subject}} no campo "Subject" do email
        const templateParams = {
            to_email: 'glauberbarcelos@outlook.com',
            from_name: values.name,
            from_email: values.email,
            from_phone: values.phone,
            subject: values.subject,  // Será usado como assunto do email
            message: values.message
        };

        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
            .then(function(response) {
                console.log('Email enviado com sucesso!', response.status, response.text);
                showFormStatus('✓ Mensagem enviada com sucesso! Responderemos em breve.', 'success');
                
                // Limpar formulário
                contactForm.reset();
                setFieldState(nameField, '');
                setFieldState(emailField, '');
                setFieldState(phoneField, '');
                setFieldState(subjectField, '');
                setFieldState(messageField, '');
                
                // Reabilitar botão
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Enviar Mensagem';
                }
                
                // Ocultar mensagem de sucesso após 5 segundos
                setTimeout(function() {
                    const formStatus = document.getElementById('formStatus');
                    if (formStatus) {
                        formStatus.style.transition = 'opacity 0.5s ease-out';
                        formStatus.style.opacity = '0';
                        setTimeout(function() {
                            formStatus.style.display = 'none';
                            formStatus.style.opacity = '1';
                        }, 500);
                    }
                }, 5000);
            }, function(error) {
                console.error('Erro ao enviar email:', error);
                showFormStatus('✗ Erro ao enviar mensagem. Tente novamente ou envie direto para glauberbarcelos@outlook.com', 'error');
                
                // Reabilitar botão
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Enviar Mensagem';
                }
            });
    });
}

// ===================================
// PARALLAX EFFECT ON HERO BACKGROUND
// ===================================
window.addEventListener('scroll', function() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrollPosition = window.scrollY;
        heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ===================================
// COUNTER ANIMATION (OPTIONAL)
// ===================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// ACTIVE NAVIGATION LINK ON SCROLL
// ===================================
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================================
// MOBILE MENU CLOSE ON LINK CLICK
// ===================================
document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show')) {
            const toggler = document.querySelector('.navbar-toggler');
            toggler.click();
        }
    });
});

// ===================================
// LAZY LOADING FOR IMAGES (OPTIONAL)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        imageObserver.observe(img);
    });
}

// ===================================
// PAGE LOAD ANIMATION
// ===================================
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// PODCASTS CAROUSEL CONTROLS
// ===================================
// Removido - agora usando grid layout

console.log('✨ Portfólio de Glauber carregado com sucesso!');
