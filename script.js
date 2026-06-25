/* ==========================================================================
   NovaMind Analytics — Main Website Interactions Script
   Theme: AWS Console / PartyRock (Study Diary Style)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Scroll Fade-in Observer ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Smooth Scroll Navbar Highlights ──
  const sections = document.querySelectorAll('section[id], header.hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) {
        current = s.id || 'hero';
      }
    });
    
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === `#${current}`) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  });

  // ── Interactive Toast Notification System ──
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    
    // reset toast custom styles just in case
    toast.style.borderColor = '';
    toast.style.color = '';
    toast.style.boxShadow = '';
    
    toast.classList.add('show');

    // hide the toast after 3.5 seconds
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  // Hook up all email clicks, CTA buttons, and request demo buttons to trigger toast notifications!
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', (e) => {
      const text = el.textContent.toLowerCase();
      const href = el.getAttribute('href');
      
      // Ignore normal navigation back to IT Department portal or external departments website
      if (href === 'index.html' || (href && href.includes('novamind-analytics-departments'))) return;
      
      if (href && href.startsWith('mailto:')) {
        e.preventDefault();
        showToast('✓ Opening mail client to contact NovaMind Analytics...');
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      } else if (text.includes('demo') || text.includes('get started')) {
        // Allow normal anchor scroll to #contact
        setTimeout(() => {
          const firstInput = document.getElementById('fullName');
          if (firstInput) firstInput.focus({ preventScroll: true });
        }, 800);
      } else if (text.includes('explore') || text.includes('discover') || text.includes('solutions')) {
        // scroll is naturally handled if href is anchor, but we display visual feedback
        showToast('✓ Navigating to core services details...');
      }
    });
  });

  // ── Contact Form Handling ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const actionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdTiS63jURQ8v4nCjUU110nvwaKk8XqvWj_dOo41zI5pwCS1A/formResponse';
      
      // Capture UTM parameters from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
      let utmData = [];
      
      utms.forEach(param => {
        if (urlParams.has(param)) {
          utmData.push(`${param}: ${urlParams.get(param)}`);
        }
      });

      // Append UTM data to the message field if any parameters exist
      if (utmData.length > 0) {
        const messageField = document.getElementById('message');
        const currentMessage = messageField ? messageField.value : '';
        const updatedMessage = currentMessage + '\n\n--- Tracking Info ---\n' + utmData.join('\n');
        
        // Update the form data for the message field using its Google Form entry ID
        formData.set('entry.1315468913', updatedMessage);
      }
      
      fetch(actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      }).then(() => {
        // EmailJS Integration
        emailjs.sendForm('service_oykcnju', 'template_t6be8wi', contactForm)
          .then(() => {
            console.log('EmailJS: Email sent successfully!');
          }, (error) => {
            console.error('EmailJS: Failed to send email.', error);
          });
        // ---------------------------

        showToast('✓ Message submitted successfully. Our team will contact you shortly.');
        contactForm.reset();
      }).catch((err) => {
        showToast('⚠ There was an error submitting the form. Please try again later.');
        console.error('Error submitting form:', err);
      });
    });
  }
});
