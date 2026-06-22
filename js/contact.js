document.addEventListener('DOMContentLoaded', () => {
    
    emailjs.init("gIsBW9ocQiTYYnhwp"); 

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
          
            emailjs.sendForm('service_ug22kdd', 'template_ytxquta', contactForm)
                .then(() => {
                    alert('Message sent successfully!');
                    contactForm.reset();
                }, (error) => {
                    console.error('Failed to send:', error);
                    alert('Failed to send the message. Please try again.');
                });
        });
    }
});
