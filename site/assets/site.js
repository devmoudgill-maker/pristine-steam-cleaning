// Pristine Steam Cleaning: menu, estimate calculator, quote form.
(() => {
  const PHONE = '+13466666223';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- full-screen menu ----------
  const menu = $('#menu');
  if (menu) {
    const close = () => { menu.close(); };
    $$('[data-menu-open]').forEach((b) => b.addEventListener('click', () => {
      menu.showModal();
      document.documentElement.classList.add('menu-open');
    }));
    $$('[data-menu-close]').forEach((b) => b.addEventListener('click', close));
    menu.addEventListener('close', () => document.documentElement.classList.remove('menu-open'));
    $$('a', menu).forEach((a) => a.addEventListener('click', close));
    matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches && menu.open) close(); });
  }

  // ---------- estimate calculator ----------
  const calc = $('#calc');
  let estimateText = '';
  if (calc) {
    const special = +calc.dataset.special;
    const specialRooms = +calc.dataset.specialRooms;
    const minimum = +calc.dataset.min;
    const inputs = $$('[data-calc]', calc);
    const fmt = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
    const val = (k) => Math.max(0, Math.min(+($(`[data-calc="${k}"]`, calc).max || 9999), Math.floor(+$(`[data-calc="${k}"]`, calc).value || 0)));
    const price = (k) => +$(`[data-calc="${k}"]`, calc).dataset.price;
    const totalEl = $('#calc-total');
    const linesEl = $('#calc-lines');
    const noteEl = $('#calc-note');
    let shown = 0;

    const animateTo = (target) => {
      const from = shown;
      shown = target;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { totalEl.textContent = fmt(target); return; }
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / 380);
        const e = 1 - Math.pow(1 - p, 4);
        const v = from + (target - from) * e;
        totalEl.textContent = fmt(p < 1 ? Math.round(v) : target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const update = () => {
      const rooms = val('rooms'), sofas = val('sofas'), chairs = val('chairs'), tile = val('tile');
      const lines = [];
      let sub = 0;
      const useSpecial = rooms >= specialRooms;
      if (useSpecial) {
        lines.push([`${specialRooms} Room Special`, special]);
        sub += special;
        if (rooms > specialRooms) {
          const extra = (rooms - specialRooms) * price('rooms');
          lines.push([`${rooms - specialRooms} extra room${rooms - specialRooms > 1 ? 's' : ''}`, extra]);
          sub += extra;
        }
      } else if (rooms > 0) {
        const c = rooms * price('rooms');
        lines.push([`${rooms} room${rooms > 1 ? 's' : ''}`, c]);
        sub += c;
      }
      if (sofas) { const c = sofas * price('sofas'); lines.push([`${sofas} sofa${sofas > 1 ? 's' : ''}`, c]); sub += c; }
      if (chairs) { const c = chairs * price('chairs'); lines.push([`${chairs} chair${chairs > 1 ? 's' : ''} / ottoman${chairs > 1 ? 's' : ''}`, c]); sub += c; }
      if (tile) { const c = Math.round(tile * price('tile') * 100) / 100; lines.push([`${tile} sq ft tile & grout`, c]); sub += c; }

      let total = sub;
      let note = '';
      if (sub > 0 && !useSpecial && sub < minimum) {
        total = minimum;
        note = `Visits have a ${fmt(minimum)} minimum. Add a room to get the ${specialRooms} Room Special.`;
      } else if (useSpecial) {
        note = 'Walk-in closets are included with your rooms.';
      }
      if (rooms > 0 && rooms < specialRooms) note = `Tip: ${specialRooms} rooms are only ${fmt(special)} with the special.`;

      linesEl.innerHTML = lines.length
        ? lines.map(([l, c]) => `<li><span>${l}</span><span>${fmt(c)}</span></li>`).join('')
        : '<li class="is-empty"><span>Nothing added yet</span><span>$0</span></li>';
      noteEl.textContent = note;
      animateTo(Math.round(total * 100) / 100);

      estimateText = lines.length
        ? `Estimate: ${lines.map(([l, c]) => `${l} ${fmt(c)}`).join(', ')}. Total about ${fmt(total)}.`
        : '';
    };

    $$('[data-step]', calc).forEach((b) => b.addEventListener('click', () => {
      const input = $(`[data-calc="${b.dataset.step}"]`, calc);
      input.value = Math.max(0, Math.min(+input.max, (+input.value || 0) + +b.dataset.dir));
      update();
    }));
    inputs.forEach((i) => i.addEventListener('input', update));
    inputs.forEach((i) => i.addEventListener('blur', () => { i.value = Math.max(0, Math.floor(+i.value || 0)); update(); }));
    shown = +totalEl.textContent.replace(/[^0-9.]/g, '') || 0;
    update();
  }

  // ---------- quote form (text-message fallback until Jobber embed is added) ----------
  const form = $('#quote-form');
  if (form) {
    const done = $('#quote-done');
    const sms = $('#quote-sms');
    const copyBtn = $('#quote-copy');
    let message = '';

    const rules = {
      name: (v) => v.trim().length >= 2 || 'Please enter your name.',
      phone: (v) => v.replace(/\D/g, '').replace(/^1/, '').length === 10 || 'Please enter a 10-digit phone number.',
      zip: (v) => /^\d{5}$/.test(v.trim()) || 'Please enter a 5-digit ZIP code.',
    };
    const check = (name) => {
      const input = form.elements[name];
      const ok = rules[name](input.value);
      const err = $(`#${input.id}-err`);
      if (ok === true) { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); err.textContent = ''; return true; }
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
      err.textContent = ok;
      return false;
    };
    Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', () => { if (form.elements[n].value) check(n); }));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).filter((n) => !check(n));
      if (bad.length) { form.elements[bad[0]].focus(); return; }
      const f = form.elements;
      message = [
        'Hi Pristine Steam Cleaning, I would like a quote.',
        `Name: ${f.name.value.trim()}`,
        `Phone: ${f.phone.value.trim()}`,
        `ZIP: ${f.zip.value.trim()}`,
        f.notes.value.trim() && `Details: ${f.notes.value.trim()}`,
        estimateText,
      ].filter(Boolean).join('\n');
      const sep = /iPhone|iPad|Mac/.test(navigator.userAgent) ? '&' : '?';
      sms.href = `sms:${PHONE}${sep}body=${encodeURIComponent(message)}`;
      done.hidden = false;
      done.focus();
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(message);
        copyBtn.textContent = 'Copied';
      } catch {
        copyBtn.textContent = 'Copy failed, please call us';
      }
      setTimeout(() => { copyBtn.textContent = 'Copy request'; }, 2500);
    });
  }
})();
