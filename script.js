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
      
      // Ignore normal navigation back to IT Department portal
      if (href === 'index.html') return;
      
      if (href && href.startsWith('mailto:')) {
        e.preventDefault();
        showToast('✓ Opening mail client to contact NovaMind Analytics...');
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      } else if (text.includes('demo') || text.includes('get started')) {
        e.preventDefault();
        showToast('✓ Demo request received! Our analytics team will contact you within 3 hours.');
      } else if (text.includes('explore') || text.includes('discover') || text.includes('solutions')) {
        // scroll is naturally handled if href is anchor, but we display visual feedback
        showToast('✓ Navigating to core services details...');
      }
    });
  });
});
