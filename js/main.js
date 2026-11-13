// ===================================================================
// MAIN JAVASCRIPT - Paintbrush Cursor Follower, Torn Nav Menu Toggle, Utilities
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Torn Page Menu Toggle (Hover works via CSS, click support for mobile & desktop)
  const navMenuWrapper = document.getElementById('navMenuWrapper');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  if (navMenuWrapper && hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenuWrapper.classList.toggle('is-open');
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navMenuWrapper.contains(e.target)) {
        navMenuWrapper.classList.remove('is-open');
      }
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navMenuWrapper.classList.remove('is-open');
      }
    });
  }

  // 2. Dynamic Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Interactive Growth Playbook Carousel Controller
  setupPlaybookCarousel();

  // 4. Contact Page Interactions (One-Click Copy & Tactile Form Dispatch)
  setupContactInteractions();
});

function setupPlaybookCarousel() {
  const wrapper = document.getElementById('playbookCarouselWrapper');
  const track = document.getElementById('playbookCarouselTrack');
  const prevBtn = document.getElementById('playbookPrevBtn');
  const nextBtn = document.getElementById('playbookNextBtn');
  const dotsContainer = document.getElementById('playbookCarouselDots');
  const counterEl = document.querySelector('.counter-current');

  if (!wrapper || !track) return;

  const cards = track.querySelectorAll('.playbook-card');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
  const totalCards = cards.length;

  function getCardWidth() {
    if (cards.length === 0) return 380;
    const firstCard = cards[0];
    const style = window.getComputedStyle(firstCard);
    const gap = parseFloat(window.getComputedStyle(track).gap) || 26;
    return firstCard.offsetWidth + gap;
  }

  function getActiveIndex() {
    const scrollLeft = wrapper.scrollLeft;
    const cardWidth = getCardWidth();
    return Math.min(totalCards - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
  }

  function updateControls() {
    const currentIndex = getActiveIndex();

    // Update Counter (01 to 06)
    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update Dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Update Prev / Next Buttons
    if (prevBtn) {
      prevBtn.disabled = wrapper.scrollLeft <= 5;
    }
    if (nextBtn) {
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth - 5;
      nextBtn.disabled = wrapper.scrollLeft >= maxScroll;
    }
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Dots click navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      wrapper.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    });
  });

  // Track scroll with throttling for smooth responsive updates
  let scrollTimeout;
  wrapper.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateControls, 40);
  }, { passive: true });

  // Initial update
  setTimeout(updateControls, 100);
  window.addEventListener('resize', updateControls);
}

// 4. Contact Page Interactive Features
function setupContactInteractions() {
  // A. One-Click Email Copy
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    const emailToCopy = '048.ankitamishra@gmail.com';
    const labelSpan = copyEmailBtn.querySelector('.copy-btn-label');

    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = emailToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        // Visual feedback
        copyEmailBtn.classList.add('is-copied');
        if (labelSpan) labelSpan.textContent = 'Copied! ✓';

        setTimeout(() => {
          copyEmailBtn.classList.remove('is-copied');
          if (labelSpan) labelSpan.textContent = 'Copy';
        }, 2200);
      } catch (err) {
        console.warn('Could not copy text: ', err);
      }
    });
  }

  // B. Real-Time Email Verification & Tactile Form Dispatch
  const contactForm = document.getElementById('contact-form');
  const emailInput = document.getElementById('email');
  const emailStatusIcon = document.getElementById('emailStatusIcon');
  const emailValidationMsg = document.getElementById('emailValidationMsg');
  const successBanner = document.getElementById('formSuccessBanner');
  const senderNameSpan = document.getElementById('successSenderName');
  const submitBtn = document.getElementById('submitContactBtn');

  // Strict email syntax & format validator
  function validateEmail(email) {
    if (!email || email.trim() === '') {
      return { isValid: false, message: 'Work email is required.' };
    }
    const cleanEmail = email.trim();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!cleanEmail.includes('@')) {
      return { isValid: false, message: 'Missing "@" in email address.' };
    }
    const parts = cleanEmail.split('@');
    if (parts.length > 2) {
      return { isValid: false, message: 'Invalid email: too many "@" symbols.' };
    }
    const domain = parts[1];
    if (!domain || !domain.includes('.')) {
      return { isValid: false, message: 'Please enter a complete domain (e.g. name@company.com).' };
    }
    const tld = domain.split('.').pop();
    if (tld.length < 2) {
      return { isValid: false, message: 'Domain extension is too short (e.g. .com, .in).' };
    }
    if (!emailRegex.test(cleanEmail)) {
      return { isValid: false, message: 'Please enter a valid email format (e.g. name@company.com).' };
    }
    return { isValid: true, message: '✓ Valid email address' };
  }

  function checkEmailValidity(showErrors = true) {
    if (!emailInput) return true;
    const value = emailInput.value.trim();

    if (value === '') {
      emailInput.classList.remove('is-valid', 'is-invalid');
      if (emailStatusIcon) emailStatusIcon.textContent = '';
      if (emailValidationMsg) {
        emailValidationMsg.textContent = showErrors ? 'Please enter your email address.' : '';
        emailValidationMsg.className = showErrors ? 'email-validation-msg error-msg' : 'email-validation-msg';
      }
      return false;
    }

    const { isValid, message } = validateEmail(value);

    if (isValid) {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
      if (emailStatusIcon) {
        emailStatusIcon.textContent = '✓';
        emailStatusIcon.style.color = '#2E7D32';
      }
      if (emailValidationMsg) {
        emailValidationMsg.textContent = message;
        emailValidationMsg.className = 'email-validation-msg success-msg';
      }
      return true;
    } else {
      emailInput.classList.remove('is-valid');
      emailInput.classList.add('is-invalid');
      if (emailStatusIcon) {
        emailStatusIcon.textContent = '⚠️';
        emailStatusIcon.style.color = '#D32F2F';
      }
      if (emailValidationMsg) {
        emailValidationMsg.textContent = message;
        emailValidationMsg.className = 'email-validation-msg error-msg';
      }
      return false;
    }
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value.length >= 4) {
        checkEmailValidity(true);
      } else {
        emailInput.classList.remove('is-valid', 'is-invalid');
        if (emailStatusIcon) emailStatusIcon.textContent = '';
        if (emailValidationMsg) {
          emailValidationMsg.textContent = '';
          emailValidationMsg.className = 'email-validation-msg';
        }
      }
    });
    emailInput.addEventListener('blur', () => {
      if (emailInput.value.trim() !== '') {
        checkEmailValidity(true);
      }
    });
  }

  // Handle Form Submit
  if (contactForm && successBanner) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 1. Verify Email First
      const isEmailValid = checkEmailValidity(true);
      if (!isEmailValid) {
        if (emailInput) {
          const wrapper = emailInput.closest('.input-with-status') || emailInput;
          wrapper.classList.add('shake-animation');
          setTimeout(() => wrapper.classList.remove('shake-animation'), 400);
          emailInput.focus();
        }
        return;
      }

      const nameVal = document.getElementById('name')?.value.trim() || 'Guest';
      const emailVal = emailInput?.value.trim() || '';
      const serviceVal = document.getElementById('service')?.value || 'General Growth Inquiry';
      const messageVal = document.getElementById('message')?.value.trim() || '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Opening Gmail...</span>';
      }

      // 2. Format Direct Email Details
      const recipient = '048.ankitamishra@gmail.com';
      const emailSubject = `Portfolio Inquiry: ${nameVal} - ${serviceVal}`;
      const emailBody = `Hi Ankita,

My Name: ${nameVal}
My Work Email: ${emailVal}
Area of Collaboration: ${serviceVal}

Project Details & Objectives:
${messageVal}

--------------------------------------------------
Sent directly via Ankita Mishra Portfolio Website`;

      // Web Gmail URL with pre-filled fields (Opens mail.google.com in browser directly!)
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // 3. Connect fallback buttons in confirmation banner
      const gmailBtn = document.getElementById('directGmailLink');
      const defaultMailBtn = document.getElementById('directDefaultMailLink');
      const copyMsgBtn = document.getElementById('copyMessageTextBtn');

      if (gmailBtn) gmailBtn.href = gmailWebUrl;
      if (defaultMailBtn) defaultMailBtn.href = mailtoUrl;

      if (copyMsgBtn) {
        copyMsgBtn.onclick = () => {
          navigator.clipboard.writeText(emailBody);
          copyMsgBtn.textContent = 'Copied! ✓';
          setTimeout(() => { copyMsgBtn.textContent = 'Copy Message Text'; }, 2200);
        };
      }

      // 4. By Default: Open Gmail Web in a new tab!
      const gmailTab = window.open(gmailWebUrl, '_blank');
      if (!gmailTab || gmailTab.closed || typeof gmailTab.closed === 'undefined') {
        // Fallback if browser blocked popup: redirect to Gmail URL
        window.location.href = gmailWebUrl;
      }

      // 5. Show on-screen confirmation card
      successBanner.style.display = 'flex';
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Gmail Opened ✓</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span> <span class="submit-arrow">&rarr;</span>';
        }
      }, 3500);
    });
  }
}


