document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar-custom');
    const contactForm = document.getElementById('contactForm');
    const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

    const setFieldState = (field, message) => {
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
            return;
        }

        field.classList.remove('is-invalid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    };

    const showFormStatus = (message, type = 'info') => {
        const formStatus = document.getElementById('formStatus');
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    };

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const nameField = document.getElementById('name');
            const contactField = document.getElementById('contact');
            const messageField = document.getElementById('message');

            const values = {
                name: nameField?.value.trim() || '',
                contact: contactField?.value.trim() || '',
                message: messageField?.value.trim() || ''
            };

            const errors = {
                name: values.name.length < 3 ? 'Informe seu nome completo.' : '',
                contact: values.contact.length < 5 ? 'Informe seu WhatsApp ou e-mail.' : '',
                message: values.message.length < 10 ? 'Conte um pouco mais sobre a sua ideia.' : ''
            };

            setFieldState(nameField, errors.name);
            setFieldState(contactField, errors.contact);
            setFieldState(messageField, errors.message);

            const hasErrors = Object.values(errors).some(Boolean);
            if (hasErrors) {
                showFormStatus('Revise os campos destacados e tente novamente.', 'error');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.dataset.originalText = submitButton.dataset.originalText || submitButton.textContent;
                submitButton.textContent = 'Abrindo e-mail...';
            }

            showFormStatus('Abrindo seu aplicativo de e-mail...', 'info');

            const subject = 'Contato pelo site - projeto digital';
            const body = `Nome: ${values.name}\nContato: ${values.contact}\n\nProjeto:\n${values.message}`;
            window.location.href = `mailto:glauberbarcelos@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = submitButton.dataset.originalText || 'Enviar mensagem';
                }
            }, 800);
        });
    }

    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id], header[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 220) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const toggler = document.querySelector('.navbar-toggler');
            if (navbarCollapse && navbarCollapse.classList.contains('show') && toggler) {
                toggler.click();
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        if (!img.closest('.hero-image')) {
            img.loading = img.loading || 'lazy';
            img.decoding = img.decoding || 'async';
        }
    });
});

console.log('✨ Portfólio de Glauber carregado com foco em conversão.');
