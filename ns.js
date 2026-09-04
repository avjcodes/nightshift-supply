/* NIGHT SHIFT SUPPLY v2: clock, hour pages, bag, list. */
(() => {
  const pad = n => String(n).padStart(2, '0');
  // The night runs 22:00 -> 06:00 across a 200 degree arc, left to right.
  const HOURS = [
    { h: 22, id: 'jacket', name: 'Clock-Out Coach Jacket', price: 148, scene: 'img/look/dez_shutter.jpg', pos: '50% 40%', cap: '22:00. The shutter comes down. The night starts.', cut: 'img/cut/jacket_front.webp', desc: 'Matte black nylon, snap front, ribbed cuffs. A hi-vis strip on the hem so the bus driver sees you at four.', specs: ['2-layer nylon shell, brushed lining', 'Reflective tape, 500-wash rated', 'NIGHT SHIFT embroidery, left chest', 'Boxy. Dez wears L at 6 ft'], sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], out: ['XS'], more: [['img/prod/jacket_front_800.jpg', 'front'], ['img/prod/jacket_back_800.jpg', 'back'], ['img/detail/hem_strip_800.jpg', 'hem strip']] },
    { h: 0, id: 'shirt', name: 'Pass Shirt', price: 96, scene: 'img/look/dez_bar.jpg', pos: '50% 45%', cap: '00:00. Bar is closed. Wiping down.', cut: 'img/cut/shirt_front.webp', desc: 'Night-blue twill, two snap pockets, chalk stitching, and a stitched slot for the pen you keep losing.', specs: ['8 oz cotton twill, night blue', 'Two snap-flap chest pockets', 'Pen slot, left pocket', 'Boxy, cropped a touch. Kit wears M'], sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], out: [], more: [['img/prod/shirt_front_800.jpg', 'front'], ['img/prod/shirt_back_800.jpg', 'back'], ['img/detail/pen_pocket_800.jpg', 'pen slot']] },
    { h: 2, id: 'cap', name: '2AM Cap', price: 42, scene: 'img/look/dez_phone_cap.jpg', pos: '55% 35%', cap: '02:00. The hour the cap is named after.', cut: 'img/cut/cap_front.webp', desc: 'Unstructured six-panel, washed twill. Orange underbrim. A clock on the front, stopped at two.', specs: ['Washed cotton twill', 'Sodium-orange underbrim', 'Embroidered clock face', 'One size, brass slide'], sizes: ['One size'], out: [], more: [['img/prod/cap_front_800.jpg', 'front'], ['img/prod/cap_under_800.jpg', 'underbrim'], ['img/detail/clock_800.jpg', 'clock']] },
    { h: 4, id: 'pant', name: 'Double Apron Pant', price: 128, scene: 'img/look/marisol_kitchen.jpg', pos: '40% 50%', cap: '04:00. Apron off. First time sitting down.', cut: 'img/cut/pant_front.webp', desc: 'Heavyweight black canvas. The half-apron panel snaps across the thighs for the shift and comes off for the train.', specs: ['14 oz cotton canvas, garment washed', 'Detachable apron panel, four snaps', 'Tool loop, right hip', 'Straight leg, mid rise, cuff once'], sizes: ['26', '28', '30', '32', '34', '36'], out: ['36'], more: [['img/prod/pant_front_800.jpg', 'apron on'], ['img/prod/pant_back_800.jpg', 'back'], ['img/detail/snaps_800.jpg', 'snaps']] },
    { h: 6, id: 'tote', name: 'Tip Jar Tote', price: 68, scene: 'img/look/marisol_walk_tote.jpg', pos: '50% 40%', cap: '06:00. Clock out. Everything in one bag.', cut: 'img/cut/tote_front.webp', desc: 'Oversized waxed canvas, hi-vis straps, zip top. Fits a change of clothes, a folded apron, and the night.', specs: ['18 oz waxed cotton canvas', 'Reflective N/S print', 'YKK zip, inside laptop sleeve', '45 x 38 x 15 cm, one size'], sizes: ['One size'], out: [], more: [['img/prod/tote_front_800.jpg', 'front'], ['img/prod/tote_side_800.jpg', 'side'], ['img/detail/ns_print_800.jpg', 'N/S print']] },
  ];
  const angleFor = (mins) => { // 22:00 = -100deg, 06:00 = +100deg (0 = straight up)
    let since = (mins - 22 * 60 + 1440) % 1440; if (since > 480) since = null;
    return since === null ? null : -100 + (since / 480) * 200;
  };
  const now = () => { const d = new Date(); return { h: d.getHours(), m: d.getMinutes(), mins: d.getHours() * 60 + d.getMinutes() }; };

  // Header bag count
  const KEY = 'ns-bag';
  const bag = () => JSON.parse(sessionStorage.getItem(KEY) || '[]');
  document.querySelectorAll('[data-bag]').forEach(el => el.textContent = bag().length);

  // Clock text anywhere
  const tickText = () => {
    const t = now(); const onShift = t.h >= 22 || t.h < 6;
    let toGo = 6 * 60 - t.mins; if (toGo <= 0) toGo += 1440;
    document.querySelectorAll('[data-now]').forEach(el => el.textContent = `${pad(t.h)}:${pad(t.m)}`);
    document.querySelectorAll('[data-togo]').forEach(el => el.textContent = onShift ? `${Math.floor(toGo / 60)}h${pad(toGo % 60)} to clock-out` : 'day shift. we still ship.');
    return t;
  };

  // HOME dial
  const dial = document.querySelector('[data-dial]');
  if (dial) {
    const cx = 440, cy = 460, R = 330;
    const pt = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let svg = '';
    // dashed arc from -100 to 100
    const [ax, ay] = pt(-100, R), [bx, by] = pt(100, R);
    svg += `<path class="arc" d="M${ax} ${ay} A${R} ${R} 0 0 1 ${bx} ${by}"/>`;
    // minute ticks every 15 min (32 ticks), hour ticks heavier
    for (let i = 0; i <= 32; i++) {
      const deg = -100 + (i / 32) * 200; const hour = i % 4 === 0;
      const [x1, y1] = pt(deg, R), [x2, y2] = pt(deg, R - (hour ? 18 : 8));
      svg += `<line class="tick ${hour ? 'tick--h' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    // stops
    HOURS.forEach((s, i) => {
      const deg = -100 + (i / 4) * 200; const [x, y] = pt(deg, R + 46); const [lx, ly] = pt(deg, R + 96);
      const anchor = deg < -20 ? 'end' : deg > 20 ? 'start' : 'middle';
      svg += `<a class="stop" href="hour.html?h=${s.h}" data-h="${s.h}" aria-label="${pad(s.h)}:00, ${s.name}, $${s.price}">
        <circle cx="${x}" cy="${y}" r="9"/>
        <text x="${lx}" y="${ly}" text-anchor="${anchor}">${pad(s.h)}:00</text>
        <text class="name" x="${lx}" y="${ly + 20}" text-anchor="${anchor}">${s.name}</text>
      </a>`;
    });
    // hand
    const [hx, hy] = pt(0, R - 40);
    svg += `<line class="hand" data-hand x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}"/><circle class="hand-dot" cx="${cx}" cy="${cy}" r="5"/>`;
    dial.innerHTML = svg;
    const hand = dial.querySelector('[data-hand]');
    const setHand = () => {
      const t = tickText(); const a = angleFor(t.mins);
      hand.style.transform = `rotate(${a === null ? -100 : a}deg)`;
      hand.style.opacity = a === null ? .35 : 1;
      // mark the nearest stop as now
      dial.querySelectorAll('.stop').forEach(s => s.classList.remove('is-now'));
      if (a !== null) { const idx = Math.round((a + 100) / 50); dial.querySelector(`.stop[data-h="${HOURS[idx].h}"]`)?.classList.add('is-now'); }
    };
    setHand(); setInterval(setHand, 15000);
    // keyboard: number keys 1-5 jump to hours
    document.addEventListener('keydown', e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= 5) location.href = `hour.html?h=${HOURS[n - 1].h}`; });
  } else { tickText(); setInterval(tickText, 15000); }

  // HOUR page
  const page = document.querySelector('[data-hour]');
  if (page) {
    const q = new URLSearchParams(location.search).get('h');
    let idx = HOURS.findIndex(s => String(s.h) === q);
    if (idx < 0) { const a = angleFor(now().mins); idx = a === null ? 0 : Math.round((a + 100) / 50); }
    const s = HOURS[idx], prev = HOURS[(idx + 4) % 5], next = HOURS[(idx + 1) % 5];
    document.title = `${pad(s.h)}:00 · ${s.name} · NIGHT SHIFT SUPPLY`;
    const set = (sel, v) => page.querySelectorAll(sel).forEach(el => el.textContent = v);
    set('[data-stamp]', `${pad(s.h)}:00`); set('[data-name]', s.name); set('[data-price]', `$${s.price}`); set('[data-desc]', s.desc); set('[data-cap]', s.cap);
    set('[data-idx]', `${pad(idx + 1)} / 05`);
    const ph = page.querySelector('[data-scene]'); ph.src = s.scene; ph.style.objectPosition = s.pos; ph.alt = s.cap;
    const cut = page.querySelector('[data-cut]'); cut.src = s.cut; cut.alt = s.name;
    page.querySelector('[data-specs]').innerHTML = s.specs.map(x => `<div>· <span>${x}</span></div>`).join('');
    const sizes = page.querySelector('.sizes');
    s.sizes.forEach((z, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'size'; b.setAttribute('role', 'radio'); b.textContent = z;
      const out = s.out.includes(z); if (out) { b.disabled = true; b.setAttribute('aria-label', `${z}, sold out`); }
      b.setAttribute('aria-checked', String(!out && i === (s.out.includes(s.sizes[0]) ? 1 : 0)));
      b.addEventListener('click', () => { sizes.querySelectorAll('.size').forEach(x => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true'); });
      sizes.appendChild(b);
    });
    page.querySelector('[data-more]').innerHTML = s.more.map(([src, c]) => `<figure><img src="${src}" alt="${s.name}, ${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join('');
    const pv = page.querySelector('[data-prev]'), nx = page.querySelector('[data-next]');
    pv.href = `hour.html?h=${prev.h}`; pv.innerHTML = `← <b>${pad(prev.h)}:00</b> ${prev.name}`;
    nx.href = `hour.html?h=${next.h}`; nx.innerHTML = `${next.name} <b>${pad(next.h)}:00</b> →`;
    document.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') location.href = pv.href; if (e.key === 'ArrowRight') location.href = nx.href; });
    const toast = document.querySelector('.toast');
    page.querySelector('[data-add]').addEventListener('click', () => {
      const size = sizes.querySelector('.size[aria-checked="true"]')?.textContent || s.sizes[0];
      const b = bag(); b.push({ id: s.id, size }); sessionStorage.setItem(KEY, JSON.stringify(b));
      document.querySelectorAll('[data-bag]').forEach(el => el.textContent = b.length);
      toast.textContent = `Punched in: ${s.name}, ${size}. Portfolio demo, no checkout.`; toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 2600);
    });
  }

  // list form
  document.querySelectorAll('form[data-list]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const i = f.querySelector('input'); if (!i.value.trim()) { i.focus(); return; }
    f.querySelector('.ok').hidden = false; i.disabled = true; f.querySelector('button').disabled = true;
  }));
})();
