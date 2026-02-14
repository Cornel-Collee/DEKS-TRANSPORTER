// script.js – fixed scroll locking issue, mobile menu & modal optimized
(function() {
  // ---------- Dark mode sync ----------
  const root = document.documentElement;
  function setDarkIcon(btn, isDark) {
    if (btn) btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  const toggles = ['darkToggle', 'darkToggleMobile', 'mobileDarkToggle'];
  toggles.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        root.classList.toggle('dark');
        const isDark = root.classList.contains('dark');
        toggles.forEach(tid => {
          const b = document.getElementById(tid);
          if (b) setDarkIcon(b, isDark);
        });
      });
    }
  });

  // ---------- Mobile Menu Overlay (fixed scroll lock) ----------
  const overlay = document.getElementById('mobileMenuOverlay');
  const panel = document.getElementById('mobileMenuPanel');
  const hamburger = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('closeMobileMenu');
  const body = document.body;

  function disableBodyScroll() {
    body.classList.add('no-scroll');
  }
  function enableBodyScroll() {
    body.classList.remove('no-scroll');
  }

  function openMenu() {
    overlay.classList.remove('hidden');
    disableBodyScroll();
    // small delay to trigger transition
    setTimeout(() => {
      overlay.classList.add('show'); // for opacity
      if (panel) panel.style.transform = 'translateX(0)';
    }, 10);
  }
  
  function closeMenu() {
    if (panel) panel.style.transform = 'translateX(100%)';
    overlay.classList.remove('show');
    enableBodyScroll();
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300); // match transition duration
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // close menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ---------- Scroll animations ----------
  const faders = document.querySelectorAll('.fade-up');
  const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('show', e.isIntersecting));
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  faders.forEach(f => appearOnScroll.observe(f));

  // ---------- Tracking simulation ----------
  const trackBtn = document.getElementById('trackBtn');
  const trackResult = document.getElementById('trackResult');
  const trackInput = document.getElementById('trackInput');
  if (trackBtn && trackResult) {
    trackBtn.addEventListener('click', () => {
      if (trackInput.value.trim().length > 3) {
        trackResult.innerHTML = `<div class="p-4">Shipment ${escapeHTML(trackInput.value)} <span class="text-[#34A853]">In transit</span></div>`;
        trackResult.classList.remove('hidden');
      } else {
        trackResult.classList.add('hidden');
        alert('Enter valid number');
      }
    });
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, function(m) {
      if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; if (m === '"') return '&quot;';
      return m;
    });
  }

  // ---------- FLEET MODAL (with proper scroll lock) ----------
  const modal = document.getElementById('hireModal');
  const modalImage = document.getElementById('modalImage');
  const modalName = document.getElementById('modalVehicleName');
  const modalPrice = document.getElementById('modalPrice');
  const modalPriceVAT = document.getElementById('modalPriceVAT');
  const modalPriceExcl = document.getElementById('modalPriceExcl');
  const modalReg = document.getElementById('modalReg');
  const modalMake = document.getElementById('modalMake');
  const modalModel = document.getElementById('modalModel');
  const modalYear = document.getElementById('modalYear');
  const closeModalBtn = document.querySelector('.modal-close');
  const submitBooking = document.getElementById('submitBooking');
  const bookingSuccess = document.getElementById('bookingSuccess');

  // Helper functions for modal scroll lock
  function openModal() {
    modal.classList.remove('hidden');
    disableBodyScroll(); // use same scroll lock class
  }
  
  function closeModal() {
    modal.classList.add('hidden');
    enableBodyScroll();
    // reset form
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const emailAddress = document.getElementById('emailAddress');
    const pickupLocation = document.getElementById('pickupLocation');
    const destination = document.getElementById('destination');
    const hireDate = document.getElementById('hireDate');
    const returnDate = document.getElementById('returnDate');
    const notes = document.getElementById('notes');
    
    if (fullName) fullName.value = '';
    if (phoneNumber) phoneNumber.value = '';
    if (emailAddress) emailAddress.value = '';
    if (pickupLocation) pickupLocation.value = '';
    if (destination) destination.value = '';
    if (hireDate) hireDate.value = '';
    if (returnDate) returnDate.value = '';
    if (notes) notes.value = '';
    if (bookingSuccess) bookingSuccess.classList.add('hidden');
  }

  document.querySelectorAll('.fleet-card .btn-fleet').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.fleet-card');
      if (!card) return;
      const dataStr = card.dataset.vehicle;
      if (!dataStr) return;
      try {
        const v = JSON.parse(dataStr);
        populateModal(v);
        openModal(); // use modal open with scroll lock
      } catch (err) {
        console.error('invalid vehicle data', err);
      }
    });
  });

  function populateModal(v) {
    if (modalName) modalName.innerText = v.name;
    if (modalImage) modalImage.src = `https://placehold.co/600x300/1A73E8/white?text=${encodeURIComponent(v.image || v.name)}`;
    if (modalPrice) modalPrice.innerText = `KSh ${v.price}/day`.replace('/day', v.name.includes('truck') ? '/trip' : '/day');
    if (modalPriceVAT) modalPriceVAT.innerText = `KSh ${v.priceVAT}`;
    if (modalPriceExcl) modalPriceExcl.innerText = `KSh ${v.priceExcl}`;
    if (modalReg) modalReg.innerText = v.reg || 'KDG 123A';
    if (modalMake) modalMake.innerText = v.make || 'Toyota';
    if (modalModel) modalModel.innerText = v.model || v.name;
    if (modalYear) modalYear.innerText = v.year || '2022';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (submitBooking) {
    submitBooking.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName')?.value.trim();
      const phone = document.getElementById('phoneNumber')?.value.trim();
      const email = document.getElementById('emailAddress')?.value.trim();
      const pickup = document.getElementById('pickupLocation')?.value.trim();
      const dest = document.getElementById('destination')?.value.trim();
      const hire = document.getElementById('hireDate')?.value;
      const ret = document.getElementById('returnDate')?.value;

      if (!name || !phone || !email || !pickup || !dest || !hire || !ret) {
        alert('Please fill all required fields');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Enter a valid email');
        return;
      }
      if (bookingSuccess) bookingSuccess.classList.remove('hidden');
      setTimeout(() => {
        if (bookingSuccess) bookingSuccess.classList.add('hidden');
        closeModal();
      }, 2000);
    });
  }

  // ---------- Smooth scroll for anchor links (no scroll lock interaction) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, href);
      }
    });
  });

  // ---------- Ensure no accidental global scroll lock ----------
  // Remove any leftover no-scroll class on page load (safety)
  window.addEventListener('load', () => {
    body.classList.remove('no-scroll');
  });

  console.log('Deks Transporter: scroll lock fixed (only applied when menu/modal open)');
})();
