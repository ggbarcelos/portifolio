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
        const contactField = document.getElementById('contact');

        // Phone mask: (XX) XXXXX-XXXX
        if (contactField) {
            contactField.addEventListener('input', () => {
                let v = contactField.value.replace(/\D/g, '').slice(0, 11);
                if (v.length <= 2)       contactField.value = v.length ? `(${v}` : '';
                else if (v.length <= 7)  contactField.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
                else if (v.length <= 11) contactField.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
            });
        }

        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const nameField = document.getElementById('name');
            const messageField = document.getElementById('message');

            const rawPhone = (contactField?.value || '').replace(/\D/g, '');

            const values = {
                name: nameField?.value.trim() || '',
                contact: contactField?.value.trim() || '',
                message: messageField?.value.trim() || ''
            };

            const errors = {
                name:    values.name.length < 3 ? 'Informe seu nome completo.' : '',
                contact: rawPhone.length < 10 || rawPhone.length > 11
                            ? 'Informe um número de WhatsApp válido, ex: (51) 98012-0387.' : '',
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
                submitButton.textContent = 'Enviando...';
            }

            showFormStatus('Enviando mensagem...', 'info');

            emailjs.send('service_1u29mnn', 'template_776y0px', {
                name:    values.name,
                contact: values.contact,
                message: values.message,
                // campos extras que o template pode esperar
                email:       'formulario@portifolio.com',
                from_name:   values.name,
                reply_to:    'formulario@portifolio.com',
                to_name:     'Glauber'
            })
                .then(() => {
                    showFormStatus('Mensagem enviada! Vou te chamar no WhatsApp em breve. 🚀', 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS error status:', error?.status);
                    console.error('EmailJS error text:', error?.text);
                    console.error('EmailJS error full:', JSON.stringify(error));
                    showFormStatus(`Erro ao enviar (${error?.status}: ${error?.text}). Tente novamente.`, 'error');
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = submitButton.dataset.originalText || 'Enviar mensagem';
                    }
                });
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
