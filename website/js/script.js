// Smooth scroll behavior for the entire page
document.documentElement.style.scrollBehavior = 'smooth';

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode from localStorage or system preference
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (darkModeToggle) {
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            darkModeToggle.checked = false;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (darkModeToggle) darkModeToggle.checked = true;
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                if (darkModeToggle) darkModeToggle.checked = false;
            }
        }
    });
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Contact Form Handling with Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Validation functions
        function validateName(name) {
            const nameError = document.getElementById('nameError');
            if (name.trim().length < 2) {
                nameError.textContent = 'Name must be at least 2 characters long';
                nameInput.classList.add('error');
                return false;
            } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
                nameError.textContent = 'Name can only contain letters and spaces';
                nameInput.classList.add('error');
                return false;
            } else {
                nameError.textContent = '';
                nameInput.classList.remove('error');
                return true;
            }
        }
        
        function validateEmail(email) {
            const emailError = document.getElementById('emailError');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.classList.add('error');
                return false;
            } else {
                emailError.textContent = '';
                emailInput.classList.remove('error');
                return true;
            }
        }
        
        function validateMessage(message) {
            const messageError = document.getElementById('messageError');
            if (message.trim().length < 10) {
                messageError.textContent = 'Message must be at least 10 characters long';
                messageInput.classList.add('error');
                return false;
            } else {
                messageError.textContent = '';
                messageInput.classList.remove('error');
                return true;
            }
        }
        
        // Real-time validation listeners
        nameInput.addEventListener('blur', () => validateName(nameInput.value));
        emailInput.addEventListener('blur', () => validateEmail(emailInput.value));
        messageInput.addEventListener('blur', () => validateMessage(messageInput.value));
        
        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            // Validate all fields
            const isNameValid = validateName(name);
            const isEmailValid = validateEmail(email);
            const isMessageValid = validateMessage(message);
            
            if (!isNameValid || !isEmailValid || !isMessageValid) {
                const formMessage = document.getElementById('formMessage');
                formMessage.textContent = 'Please fix the errors in the form before submitting.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Get UI elements
            const formMessage = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            formMessage.className = 'form-message';
            formMessage.textContent = '';
            
            try {
                // Send to backend
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        timestamp: new Date().toISOString()
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    formMessage.textContent = `Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`;
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                    
                    // Clear error states
                    nameInput.classList.remove('error');
                    emailInput.classList.remove('error');
                    messageInput.classList.remove('error');
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.className = 'form-message';
                    }, 5000);
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                formMessage.className = 'form-message error';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }

    // Smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add animation on scroll (optional enhancement)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .use-case-card, .info-card, .service-model');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

