/* NIGHT SHIFT SUPPLY behaviour: the shift clock, dawn drift, bag count, newsletter, product page. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shift clock: local time, time to clock-out (06:00). Hero drifts from sodium to dawn between 22:00 and 06:00.
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    const h = d.getHours(), m = d.getMinutes();
    const mins = h * 60 + m;
    const clockOut = 6 * 60;
    let toGo = clockOut - mins; if (toGo <= 0) toGo += 24 * 60;
    const onShift = h >= 22 || h < 6;
    document.querySelectorAll('[data-clock]').forEach(el => el.textContent = `${pad(h)}:${pad(m)}`);
    document.querySelectorAll('[data-togo]').forEach(el => el.textContent = onShift ? `${Math.floor(toGo / 60)}h${pad(toGo % 60)} to clock-out` : 'day shift, we still ship');
    // dawn: 0 at 22:00, 1 at 06:00; daytime sits at .7 so the hero reads as morning
    let dawn = .7;
    if (onShift) { const since = (mins - 22 * 60 + 24 * 60) % (24 * 60); dawn = Math.min(1, Math.max(0, since / (8 * 60))); }
    document.documentElement.style.setProperty('--dawn', dawn.toFixed(3));
  };
  tick(); setInterval(tick, 15000);

  // Bag count (session only, demo)
  const KEY = 'ns-bag';
  const bag = () => JSON.parse(sessionStorage.getItem(KEY) || '[]');
  const renderBag = () => { const n = bag().length; document.querySelectorAll('[data-bag-count]').forEach(el => { el.textContent = n; el.hidden = n === 0; }); };
  renderBag();

  // Video: pause when hidden, respect reduced motion
  document.querySelectorAll('video[data-loop]').forEach(v => {
    if (reduced) { v.removeAttribute('autoplay'); v.pause(); return; }
    new IntersectionObserver(en => en.forEach(e => e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: .1 }).observe(v);
  });

  // Newsletter (demo)
  document.querySelectorAll('form[data-list]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const v = f.querySelector('input').value.trim(); if (!v) { f.querySelector('input').focus(); return; }
    f.querySelector('.ok').hidden = false; f.querySelector('input').disabled = true; f.querySelector('button').disabled = true;
  }));

  // Product page
  const pdp = document.querySelector('[data-pdp]');
  if (pdp) {
    const P = {
      jacket: { name: 'The Clock-Out Coach Jacket', price: 148, lede: 'Matte black nylon, snap front, a hi-vis strip on the hem so the bus driver sees you at 4 a.m.', imgs: ['img/prod/jacket_front.jpg', 'img/prod/jacket_back.jpg', 'img/detail/hem_strip.jpg', 'img/look/dez_shutter.jpg', 'img/look/dez_kit_rain.jpg', 'img/look/kit_subway.jpg'], worn: ['img/look/dez_shutter_800.jpg', 'img/look/dez_kit_laugh_800.jpg', 'img/look/marisol_diner_800.jpg'], fabric: 'Matte 2-layer nylon shell, brushed tricot lining, ribbed cotton cuffs and collar. Reflective tape rated for 500 washes. Small NIGHT SHIFT embroidery, left chest.', fit: 'Boxy through the body, drops just below the belt. Dez wears an L at 6 foot. Size up for layering over a hoodie.', care: 'Machine wash cold, hang dry. The reflective strip does not go in the dryer.', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], out: ['XS'] },
      pant: { name: 'The Double Apron Pant', price: 128, lede: 'Heavyweight black canvas with a half-apron panel that snaps off when the shift ends.', imgs: ['img/prod/pant_front.jpg', 'img/prod/pant_back.jpg', 'img/detail/snaps.jpg', 'img/look/marisol_kitchen.jpg', 'img/look/kit_laundromat.jpg', 'img/look/group_dock.jpg'], worn: ['img/look/marisol_kitchen_800.jpg', 'img/look/kit_laundromat_800.jpg', 'img/look/group_dock_800.jpg'], fabric: '14 oz cotton canvas, garment washed. Detachable apron panel in the same cloth, four black snaps. Tool loop on the right hip.', fit: 'Straight leg, mid rise, meant to be cuffed once. Marisol wears a 28 at 5 foot 6.', care: 'Wash cold inside out. Panel off. It softens fast and keeps the shape.', sizes: ['26', '28', '30', '32', '34', '36'], out: ['36'] },
      shirt: { name: 'The Pass Shirt', price: 96, lede: 'Night-blue twill, two snap pockets, a pen slot, because you will lose the pen otherwise.', imgs: ['img/prod/shirt_front.jpg', 'img/prod/shirt_back.jpg', 'img/detail/pen_pocket.jpg', 'img/look/dez_bar.jpg', 'img/look/crosswalk_pair.jpg', 'img/look/marisol_kitchen.jpg'], worn: ['img/look/dez_bar_800.jpg', 'img/look/crosswalk_pair_800.jpg', 'img/look/kit_laundromat_800.jpg'], fabric: '8 oz cotton twill in night blue, chalk contrast stitching, two chest pockets with snap flaps, stitched pen slot on the left.', fit: 'Boxy, cropped a touch. Wear it open over a tee or tucked. Kit wears an M.', care: 'Wash cold, tumble low. The stitching stays white if you skip bleach.', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'], out: [] },
      tote: { name: 'The Tip Jar Tote', price: 68, lede: 'Oversized waxed canvas, hi-vis straps, zip top. Carries a change of clothes and the night.', imgs: ['img/prod/tote_front.jpg', 'img/prod/tote_side.jpg', 'img/detail/ns_print.jpg', 'img/look/marisol_walk_tote.jpg', 'img/look/walk_tote_street.jpg', 'img/look/kit_subway.jpg'], worn: ['img/look/marisol_walk_tote_800.jpg', 'img/look/walk_tote_street_800.jpg', 'img/look/kit_subway_800.jpg'], fabric: '18 oz waxed cotton canvas, hi-vis polyester webbing, YKK zip. Reflective N/S print. Inside sleeve fits a 15-inch laptop or a folded apron.', fit: 'One size. 45 by 38 by 15 cm. Straps sit at the shoulder on most people.', care: 'Wipe clean. Re-wax once a year if you like it dark.', sizes: ['One size'], out: [] },
      cap: { name: 'The 2AM Cap', price: 42, lede: 'Unstructured six-panel, orange underbrim, a clock on the front stuck at two.', imgs: ['img/prod/cap_front.jpg', 'img/prod/cap_under.jpg', 'img/detail/clock.jpg', 'img/look/dez_phone_cap.jpg', 'img/look/kit_subway.jpg', 'img/look/group_dock.jpg'], worn: ['img/look/dez_phone_cap_800.jpg', 'img/look/kit_subway_800.jpg', 'img/look/group_dock_800.jpg'], fabric: 'Washed cotton twill, unstructured crown, sodium-orange underbrim, embroidered clock face, brass slide buckle.', fit: 'One size, adjustable. Low profile.', care: 'Hand wash. Do not machine dry.', sizes: ['One size'], out: [] },
    };
    const id = new URLSearchParams(location.search).get('p');
    const p = P[id] || P.jacket;
    document.title = `${p.name} · NIGHT SHIFT SUPPLY`;
    pdp.querySelector('[data-name]').textContent = p.name;
    pdp.querySelector('[data-price]').textContent = `$${p.price}`;
    pdp.querySelector('[data-lede]').textContent = p.lede;
    pdp.querySelector('[data-fabric]').textContent = p.fabric;
    pdp.querySelector('[data-fit]').textContent = p.fit;
    pdp.querySelector('[data-care]').textContent = p.care;
    document.querySelectorAll('[data-crumb]').forEach(el => el.textContent = p.name);
    const main = pdp.querySelector('.gal__main'), thumbs = pdp.querySelector('.gal__thumbs');
    p.imgs.forEach((src, i) => {
      const im = new Image(); im.src = src; im.alt = ''; if (i === 0) im.classList.add('on'); main.appendChild(im);
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Photo ${i + 1}`); b.setAttribute('aria-selected', String(i === 0));
      const t = new Image(); t.src = src.replace('.jpg', '_800.jpg'); t.alt = ''; b.appendChild(t);
      b.addEventListener('click', () => { main.querySelectorAll('img').forEach((x, j) => x.classList.toggle('on', j === i)); thumbs.querySelectorAll('button').forEach((x, j) => x.setAttribute('aria-selected', String(j === i))); });
      thumbs.appendChild(b);
    });
    const sizes = pdp.querySelector('.sizes');
    p.sizes.forEach((s, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'size'; b.role = 'radio'; b.textContent = s;
      const out = p.out.includes(s); if (out) { b.disabled = true; b.setAttribute('aria-label', `${s}, sold out`); }
      b.setAttribute('aria-checked', String(!out && (i === (p.out.includes(p.sizes[0]) ? 1 : 0))));
      b.addEventListener('click', () => { sizes.querySelectorAll('.size').forEach(x => x.setAttribute('aria-checked', 'false')); b.setAttribute('aria-checked', 'true'); });
      sizes.appendChild(b);
    });
    const worn = document.querySelector('.worn__grid');
    p.worn.forEach(src => { const im = new Image(); im.src = src; im.alt = ''; im.loading = 'lazy'; worn.appendChild(im); });
    const toast = document.querySelector('.toast');
    pdp.querySelector('[data-add]').addEventListener('click', () => {
      const size = sizes.querySelector('.size[aria-checked="true"]')?.textContent || p.sizes[0];
      const b = bag(); b.push({ id, size }); sessionStorage.setItem(KEY, JSON.stringify(b)); renderBag();
      toast.textContent = `In the bag: ${p.name}, ${size}. Portfolio demo, no checkout.`; toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 2600);
    });
  }
})();
