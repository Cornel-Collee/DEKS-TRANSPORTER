// script.js – with dynamic modal for vehicle hire

(function() {
  // ---------- Dark mode ----------
  const root = document.documentElement;
  const toggles = ['darkToggle', 'darkToggleMobile'];
  toggles.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        root.classList.toggle('dark');
        btn.innerHTML = root.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });
    }
  });

  // ---------- Mobile menu ----------
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        hamburger.classList.remove('open');
      });
    });
  }

  // ---------- Scroll animations ----------
  const faders = document.querySelectorAll('.fade-up');
  const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(e => e.target.classList.toggle('show', e.isIntersecting));
  }, { threshold: 0.15 });
  faders.forEach(f => appearOnScroll.observe(f));

  // ---------- Tracking simulation ----------
  const trackBtn = document.getElementById('trackBtn');
  const trackResult = document.getElementById('trackResult');
  const trackInput = document.getElementById('trackInput');
  if (trackBtn && trackResult) {
    trackBtn.addEventListener('click', () => {
      if (trackInput.value.trim().length > 3) {
        trackResult.innerHTML = `<div>Shipment ${escapeHTML(trackInput.value)} in transit</div>`;
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

  // ---------- FLEET MODAL ----------
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
  const closeBtn = document.querySelector('.modal-close');
  const submitBooking = document.getElementById('submitBooking');
  const bookingSuccess = document.getElementById('bookingSuccess');

  // data for each vehicle stored in data-vehicle attribute
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
        modal.classList.remove('hidden');
      } catch (err) {
        console.error('invalid vehicle data', err);
      }
    });
  });

  function populateModal(v) {
    modalName.innerText = v.name;
    // image placeholder (dynamic based on vehicle image key)
    modalImage.src = `https://placehold.co/600x300/1A73E8/white?text=${encodeURIComponent(v.image || v.name)}`;
    modalPrice.innerText = `KSh ${v.price}/day`.replace('/day', v.name.includes('truck') ? '/trip' : '/day');
    modalPriceVAT.innerText = `KSh ${v.priceVAT}`;
    modalPriceExcl.innerText = `KSh ${v.priceExcl}`;
    modalReg.innerText = v.reg || 'KDG 123A';
    modalMake.innerText = v.make || 'Toyota';
    modalModel.innerText = v.model || v.name;
    modalYear.innerText = v.year || '2022';
  }

  // close modal
  function closeModal() {
    modal.classList.add('hidden');
    // reset form
    document.getElementById('fullName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('pickupLocation').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('hireDate').value = '';
    document.getElementById('returnDate').value = '';
    document.getElementById('notes').value = '';
    bookingSuccess.classList.add('hidden');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // booking validation & success
  if (submitBooking) {
    submitBooking.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const pickup = document.getElementById('pickupLocation').value.trim();
      const dest = document.getElementById('destination').value.trim();
      const hire = document.getElementById('hireDate').value;
      const ret = document.getElementById('returnDate').value;

      if (!name || !phone || !email || !pickup || !dest || !hire || !ret) {
        alert('Please fill all required fields');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Enter a valid email');
        return;
      }
      bookingSuccess.classList.remove('hidden');
      setTimeout(() => {
        bookingSuccess.classList.add('hidden');
        closeModal();
      }, 2000);
    });
  }

  // smooth scroll for internal links
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

  console.log('Deks Transporter: modal ready, WhatsApp button removed.');
})();