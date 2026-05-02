/**
 * LUMIÈRE — Full E-Commerce JavaScript
 * Features: Product DB, Cart, Wishlist, Quick View,
 * Checkout, Search, Filters, Hero Slider, Animations
 */
"use strict";

/* ════════════════════════════════════════════
   PRODUCT DATABASE
════════════════════════════════════════════ */
const PRODUCTS = [
  { id:1,  name:"Radiance Glow Serum",    cat:"skincare",  emoji:"💧", price:68,  oldPrice:null, rating:4.9, reviews:312, badge:"bestseller", desc:"A lightweight, fast-absorbing serum packed with vitamin C, hyaluronic acid, and wild-harvested rosehip extract. Visibly brightens skin in 2 weeks.", sizes:["15ml","30ml","50ml"], ingredients:"Aqua, Ascorbic Acid, Rosa Canina, Hyaluronic Acid, Niacinamide" },
  { id:2,  name:"Rose Petal Cream",        cat:"skincare",  emoji:"🌹", price:52,  oldPrice:null, rating:4.8, reviews:218, badge:"new",        desc:"A rich, velvety moisturizer infused with Damascene rose extract and ceramides. Deeply nourishes and restores your skin barrier overnight.", sizes:["50ml","100ml"], ingredients:"Rosa Damascena, Ceramide NP, Glycerin, Shea Butter" },
  { id:3,  name:"Luminous Silk Foundation",cat:"skincare",  emoji:"✨", price:44,  oldPrice:55,   rating:4.7, reviews:185, badge:"sale",       desc:"A buildable, skin-like foundation with SPF 20. Blends seamlessly for a luminous, second-skin finish that lasts all day.", sizes:["Fair","Light","Medium","Tan","Deep"], ingredients:"Cyclopentasiloxane, Titanium Dioxide, Niacinamide, Vitamin E" },
  { id:4,  name:"Gold Eye Elixir",         cat:"eyes",      emoji:"✨", price:76,  oldPrice:null, rating:5.0, reviews:98,  badge:"bestseller", desc:"A concentrated eye serum with 24k gold particles, peptides, and caffeine to depuff, brighten, and firm the delicate eye area.", sizes:["10ml","20ml"], ingredients:"Aurum, Palmitoyl Tripeptide-5, Caffeine, Retinol 0.1%" },
  { id:5,  name:"Velvet Lip Elixir",       cat:"lips",      emoji:"💄", price:34,  oldPrice:null, rating:4.8, reviews:276, badge:"new",        desc:"A nourishing lip treatment that delivers a glossy, plumped finish. Infused with rose oil, vitamin E, and peppermint for a kissable pout.", sizes:["Rose Nude","Berry","Coral","Classic Red"], ingredients:"Ricinus Communis, Rosa Canina, Tocopherol, Menthol" },
  { id:6,  name:"Botanic Body Butter",     cat:"body",      emoji:"🌸", price:42,  oldPrice:null, rating:4.6, reviews:144, badge:null,         desc:"A luxurious whipped body butter with shea, mango butter, and jasmine extract. Melts into skin for all-day moisture and radiance.", sizes:["150ml","250ml"], ingredients:"Butyrospermum Parkii, Mangifera Indica, Jasminum Officinale" },
  { id:7,  name:"Damascus Rose Eau de Parfum",cat:"fragrance",emoji:"🌹",price:128,oldPrice:null, rating:4.9, reviews:67,  badge:"luxury",     desc:"A sophisticated floral fragrance opening with fresh bergamot, a heart of Damascene rose, and a warm base of sandalwood and musk.", sizes:["30ml","50ml","100ml"], ingredients:"Alcohol Denat., Rosa Damascena, Citrus Bergamia, Santalum Album" },
  { id:8,  name:"Brightening Eye Palette", cat:"eyes",      emoji:"💫", price:58,  oldPrice:72,   rating:4.7, reviews:203, badge:"sale",       desc:"12 curated shades spanning from silk nudes to deep smoldering plums. Ultra-pigmented, long-wear formula with a buttery texture.", sizes:["1 size"], ingredients:"Mica, Isostearyl Neopentanoate, Dimethicone, Vitamin E" },
  { id:9,  name:"Micellar Cleansing Water",cat:"skincare",  emoji:"💦", price:28,  oldPrice:null, rating:4.7, reviews:331, badge:null,         desc:"A gentle yet effective micellar water that removes even stubborn waterproof makeup without stripping. Formulated for all skin types.", sizes:["150ml","400ml"], ingredients:"Aqua, Poloxamer 184, Glycerin, Chamomilla Recutita Extract" },
  { id:10, name:"Plum Matte Lip Ink",      cat:"lips",      emoji:"💜", price:29,  oldPrice:null, rating:4.5, reviews:189, badge:null,         desc:"A long-lasting liquid lip color with a transfer-proof matte finish. Lightweight formula that never dries out your lips.", sizes:["Plum Noir","Berry Stain","Wine Red","Dusty Rose"], ingredients:"Aqua, PVP, Silica, Trimethylsiloxysilicate, Vitamin C" },
  { id:11, name:"Jasmine Body Scrub",      cat:"body",      emoji:"🌺", price:36,  oldPrice:null, rating:4.6, reviews:112, badge:null,         desc:"A luxurious sugar scrub infused with jasmine oil and pink Himalayan salt. Buffs away dead skin, leaving a silky, radiant glow.", sizes:["200ml"], ingredients:"Sucrose, Sodium Chloride, Jasminum Sambac, Rosa Canina, Glycerin" },
  { id:12, name:"Gold Ritual Gift Set",    cat:"sets",      emoji:"🎁", price:148, oldPrice:180,  rating:5.0, reviews:44,  badge:"sale",       desc:"The ultimate luxury gifting set featuring our Glow Serum, Rose Petal Cream, and Gold Eye Elixir — nestled in a keepsake gold box.", sizes:["1 set"], ingredients:"See individual products" },
];

/* ════════════════════════════════════════════
   STATE
════════════════════════════════════════════ */
let cart = [];
let wishlist = [];
let currentCat = "all";
let currentSort = "default";
let currentView = "grid";
let visibleCount = 8;
let currentHeroSlide = 0;
let promoApplied = false;
let annOpen = true;

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = (n) => "$" + n.toFixed(2);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let toastTimer;
function showToast(msg, icon = "✓") {
  const t = document.getElementById("toast");
  document.getElementById("toastIcon").textContent = icon;
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ════════════════════════════════════════════
   LOADER
════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById("loader");
  const prog = document.getElementById("loaderProgress");
  const pct = document.getElementById("loaderPercent");
  document.body.style.overflow = "hidden";
  let w = 0;
  const iv = setInterval(() => {
    w += rand(4, 16);
    if (w >= 100) { w = 100; clearInterval(iv);
      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
        triggerHeroReveal();
      }, 350);
    }
    prog.style.width = w + "%";
    if (pct) pct.textContent = w + "%";
  }, 70);
}

/* ════════════════════════════════════════════
   CURSOR
════════════════════════════════════════════ */
function initCursor() {
  const c = document.getElementById("cursor");
  const f = document.getElementById("cursorFollower");
  if (!c || !f) return;
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + "px"; c.style.top = my + "px";
  });
  (function loop() {
    fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
    f.style.left = fx + "px"; f.style.top = fy + "px";
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    if (e.target.matches("a,button,.cat-pill,.product-card,.testi-card,.insta-tile,.ship-opt,.qv-size-btn,.search-tag,.search-result-item")) {
      c.style.transform = "translate(-50%,-50%) scale(2.5)";
      c.style.background = "var(--rose)";
      f.style.transform = "translate(-50%,-50%) scale(1.5)";
      f.style.borderColor = "var(--rose)";
    } else {
      c.style.transform = "translate(-50%,-50%) scale(1)";
      c.style.background = "var(--gold)";
      f.style.transform = "translate(-50%,-50%) scale(1)";
      f.style.borderColor = "var(--gold)";
    }
  });
  document.addEventListener("mouseleave", () => { c.style.opacity = "0"; f.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { c.style.opacity = "1"; f.style.opacity = "0.6"; });
}

/* ════════════════════════════════════════════
   SCROLL PROGRESS + NAV
════════════════════════════════════════════ */
function initScroll() {
  const bar = document.getElementById("scrollProgressBar");
  const nav = document.getElementById("nav");
  const btt = document.getElementById("backToTop");
  const ann = document.getElementById("announcementBar");
  const annH = ann ? ann.offsetHeight : 0;

  function onScroll() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (scrollTop / docH * 100) + "%";
    if (nav) {
      nav.classList.toggle("scrolled", scrollTop > 60);
      if (annOpen) nav.style.top = Math.max(0, annH - scrollTop) + "px";
    }
    if (btt) btt.classList.toggle("visible", scrollTop > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.getElementById("backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ════════════════════════════════════════════
   ANNOUNCEMENT BAR
════════════════════════════════════════════ */
function initAnnouncement() {
  document.getElementById("annClose")?.addEventListener("click", () => {
    const bar = document.getElementById("announcementBar");
    if (bar) { bar.style.display = "none"; annOpen = false; }
    const nav = document.getElementById("nav");
    if (nav) nav.style.top = "0";
  });
}

/* ════════════════════════════════════════════
   NAV + MOBILE
════════════════════════════════════════════ */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const close = document.getElementById("mobClose");

  const openDrawer = () => { drawer?.classList.add("open"); overlay?.classList.add("active"); toggle?.classList.add("active"); document.body.style.overflow = "hidden"; };
  const closeDrawer = () => { drawer?.classList.remove("open"); overlay?.classList.remove("active"); toggle?.classList.remove("active"); document.body.style.overflow = ""; };

  toggle?.addEventListener("click", () => drawer?.classList.contains("open") ? closeDrawer() : openDrawer());
  close?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", () => { closeDrawer(); closeCart(); closeWishlist(); });

  // Smooth scroll + cat filter from nav
  document.querySelectorAll('a[href^="#"], [data-cat]').forEach(el => {
    el.addEventListener("click", e => {
      const href = el.getAttribute("href");
      const cat = el.dataset.cat;
      if (cat) { e.preventDefault(); filterProducts(cat); closeDrawer(); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }
      else if (href?.startsWith("#")) {
        const tgt = document.querySelector(href);
        if (tgt) { e.preventDefault(); tgt.scrollIntoView({ behavior: "smooth" }); closeDrawer(); }
      }
    });
  });
}


/* ════════════════════════════════════════════
   REVEAL ON SCROLL
════════════════════════════════════════════ */
function initReveal() {
  const items = document.querySelectorAll(".reveal-up");
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add("visible"), d);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(i => obs.observe(i));
}

function triggerHeroReveal() {
  document.querySelectorAll(".hero .reveal-up").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 160));
}

/* ════════════════════════════════════════════
   COUNTERS
════════════════════════════════════════════ */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target, dur = 1800;
      const step = (target / dur) * 16;
      let cur = 0;
      const tick = () => { cur += step; if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(tick); } else el.textContent = target; };
      tick(); obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat-num").forEach(c => obs.observe(c));
}

/* ════════════════════════════════════════════
   PARTICLES
════════════════════════════════════════════ */
function initParticles() {
  const c = document.getElementById("particles"); if (!c) return;
  const cols = ["#c9a96e","#d4788a","#b57a8a","#e8c99a","#f2c4cc"];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    const sz = Math.random() * 6 + 2;
    p.className = "particle";
    Object.assign(p.style, { width: sz+"px", height: sz+"px", left: Math.random()*100+"%", background: cols[rand(0,cols.length-1)], animationDuration: (rand(10,22))+"s", animationDelay: (Math.random()*12)+"s" });
    c.appendChild(p);
  }
}

/* ════════════════════════════════════════════
   HERO SLIDER
════════════════════════════════════════════ */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;
  let timer;
  const go = (n) => {
    slides[currentHeroSlide].classList.remove("active");
    dots[currentHeroSlide].classList.remove("active");
    currentHeroSlide = (n + slides.length) % slides.length;
    slides[currentHeroSlide].classList.add("active");
    dots[currentHeroSlide].classList.add("active");
    // Re-trigger reveals on new slide
    slides[currentHeroSlide].querySelectorAll(".reveal-up").forEach((el, i) => {
      el.classList.remove("visible");
      setTimeout(() => el.classList.add("visible"), i * 160);
    });
  };
  const reset = () => { clearInterval(timer); timer = setInterval(() => go(currentHeroSlide + 1), 6000); };
  document.getElementById("heroPrev")?.addEventListener("click", () => { go(currentHeroSlide - 1); reset(); });
  document.getElementById("heroNext")?.addEventListener("click", () => { go(currentHeroSlide + 1); reset(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { go(i); reset(); }));
  reset();
}

/* ════════════════════════════════════════════
   RENDER PRODUCTS
════════════════════════════════════════════ */
function getFilteredSorted() {
  let list = currentCat === "all" ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === currentCat);
  const s = document.getElementById("sortSelect")?.value || "default";
  if (s === "price-asc")  list.sort((a,b) => a.price - b.price);
  if (s === "price-desc") list.sort((a,b) => b.price - a.price);
  if (s === "rating")     list.sort((a,b) => b.rating - a.rating);
  if (s === "newest")     list.sort((a,b) => b.id - a.id);
  return list;
}

function getBadgeHtml(badge) {
  if (!badge) return "";
  const map = { bestseller: ["","Best Seller"], new: ["badge-new","New"], sale: ["badge-sale","Sale"], luxury: ["","Luxury"], hot: ["badge-hot","🔥 Hot"] };
  const [cls, label] = map[badge] || ["", badge];
  return `<div class="product-badge ${cls}">${label}</div>`;
}

function renderStars(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5 ? "½" : "";
  return "★".repeat(full) + half;
}

function productCardHTML(p) {
  const wishlisted = wishlist.some(w => w.id === p.id);
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-image c-${p.cat}">
      ${getBadgeHtml(p.badge)}
      <div class="product-actions">
        <button class="p-btn ${wishlisted?"wishlisted":""} wishlist-btn" data-id="${p.id}" title="Wishlist">${wishlisted?"♥":"♡"}</button>
        <button class="p-btn quick-view-btn-icon" data-id="${p.id}" title="Quick View">⊕</button>
      </div>
      <div class="product-emoji">${p.emoji}</div>
      <button class="quick-view-btn" data-id="${p.id}">Quick View</button>
    </div>
    <div class="product-info">
      <div class="product-category">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</div>
      <h4>${p.name}</h4>
      <div class="product-stars">${renderStars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
      <div class="product-footer">
        <span class="price">${fmt(p.price)}${p.oldPrice?` <del>${fmt(p.oldPrice)}</del>`:""}</span>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function renderProducts() {
  const grid = document.getElementById("productsGrid"); if (!grid) return;
  const filtered = getFilteredSorted();
  const visible = filtered.slice(0, visibleCount);
  grid.innerHTML = visible.map(productCardHTML).join("");

  const count = document.getElementById("productCount");
  if (count) count.textContent = `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;

  const lmb = document.getElementById("loadMoreBtn");
  if (lmb) lmb.style.display = filtered.length > visibleCount ? "inline-block" : "none";

  bindProductCards(grid);
  // trigger reveal for new cards
  grid.querySelectorAll(".product-card").forEach((c, i) => {
    c.style.opacity = "0"; c.style.transform = "translateY(20px)"; c.style.transition = `opacity .5s ${i * 0.05}s, transform .5s ${i * 0.05}s`;
    setTimeout(() => { c.style.opacity = "1"; c.style.transform = ""; }, 50 + i * 50);
  });
}

function renderBestsellers() {
  const grid = document.getElementById("bestsellersSlider"); if (!grid) return;
  const bs = PRODUCTS.filter(p => p.badge === "bestseller" || p.rating >= 4.8).slice(0, 8);
  grid.innerHTML = bs.map(productCardHTML).join("");
  bindProductCards(grid);
}

function bindProductCards(ctx) {
  ctx.querySelectorAll(".add-to-cart").forEach(btn => btn.addEventListener("click", e => { e.stopPropagation(); addToCart(+btn.dataset.id); }));
  ctx.querySelectorAll(".wishlist-btn").forEach(btn => btn.addEventListener("click", e => { e.stopPropagation(); toggleWishlist(+btn.dataset.id); }));
  ctx.querySelectorAll(".quick-view-btn, .quick-view-btn-icon").forEach(btn => btn.addEventListener("click", e => { e.stopPropagation(); openQuickView(+btn.dataset.id); }));
}

/* ════════════════════════════════════════════
   CATEGORY FILTER + SORT + VIEW
════════════════════════════════════════════ */
function filterProducts(cat) {
  currentCat = cat; visibleCount = 8;
  document.querySelectorAll(".cat-pill").forEach(p => p.classList.toggle("active", p.dataset.cat === cat));
  const title = document.getElementById("shopTitle");
  if (title) title.textContent = cat === "all" ? "All Products" : cat.charAt(0).toUpperCase() + cat.slice(1);
  renderProducts();
}

function initFilters() {
  document.querySelectorAll(".cat-pill").forEach(pill => pill.addEventListener("click", () => filterProducts(pill.dataset.cat)));
  document.getElementById("sortSelect")?.addEventListener("change", () => renderProducts());
  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", () => {
    currentView = btn.dataset.view;
    document.querySelectorAll(".view-btn").forEach(b => b.classList.toggle("active", b === btn));
    const grid = document.getElementById("productsGrid");
    grid?.classList.toggle("list-view", currentView === "list");
  }));
  document.getElementById("loadMoreBtn")?.addEventListener("click", () => { visibleCount += 4; renderProducts(); });
}

/* ════════════════════════════════════════════
   CART
════════════════════════════════════════════ */
function addToCart(id, qty = 1) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ ...p, qty });
  updateCartUI();
  showToast(`${p.name} added to bag ✓`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function getCartCount() {
  return cart.reduce((s, c) => s + c.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const badge = document.getElementById("cartBadge");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "flex" : "none"; }
  document.getElementById("cartCountLabel").textContent = `(${count})`;

  const items = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");

  if (cart.length === 0) {
    items.innerHTML = ""; empty.style.display = "flex"; footer.style.display = "none"; return;
  }
  empty.style.display = "none"; footer.style.display = "flex";

  items.innerHTML = cart.map(c => `
    <div class="cart-item" data-id="${c.id}">
      <div class="ci-img" style="background:${catColor(c.cat)}">${c.emoji}</div>
      <div class="ci-info">
        <strong>${c.name}</strong>
        <span>${c.cat.charAt(0).toUpperCase()+c.cat.slice(1)}</span>
        <div class="ci-qty">
          <button onclick="updateCartQty(${c.id},-1)">−</button>
          <span>${c.qty}</span>
          <button onclick="updateCartQty(${c.id},+1)">+</button>
        </div>
      </div>
      <div>
        <div class="ci-price">${fmt(c.price * c.qty)}</div>
        <button class="ci-remove" onclick="removeFromCart(${c.id})">Remove</button>
      </div>
    </div>`).join("");

  const total = getCartTotal();
  const disc = promoApplied ? total * 0.15 : 0;
  const final = total - disc;
  document.getElementById("cartSubtotal").textContent = fmt(final);

  const freeThresh = 75;
  const note = document.getElementById("shippingNote");
  if (note) {
    const rem = freeThresh - final;
    note.textContent = rem <= 0 ? "🎉 You qualify for free shipping!" : `🚚 Add ${fmt(rem)} more for free shipping`;
  }
}

function catColor(cat) {
  const m = { skincare:"linear-gradient(135deg,#fce8f0,#f5d0e0)", lips:"linear-gradient(135deg,#fde8f8,#e8d4f8)", eyes:"linear-gradient(135deg,#e8f4f8,#d4e8f5)", body:"linear-gradient(135deg,#f8f4e8,#f0e8d0)", fragrance:"linear-gradient(135deg,#e8eef8,#d4dff5)", sets:"linear-gradient(135deg,#e8f8e8,#d0f0d0)" };
  return m[cat] || "#fdf8f3";
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("drawerOverlay")?.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("drawerOverlay")?.classList.remove("active");
  if (!document.getElementById("wishlistDrawer")?.classList.contains("open")) document.body.style.overflow = "";
}
window.closeCart = closeCart;

function applyCartPromo() {
  const v = document.getElementById("cartPromoInput")?.value.trim().toUpperCase();
  if (v === "GLOW3" || v === "LUMIERE15") {
    promoApplied = true; updateCartUI();
    showToast("Promo code applied! 15% off ✓", "🎉");
  } else showToast("Invalid promo code", "✕");
}
window.applyCartPromo = applyCartPromo;

/* ════════════════════════════════════════════
   WISHLIST
════════════════════════════════════════════ */
function toggleWishlist(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast(`${p.name} removed from wishlist`, "♡"); }
  else { wishlist.push({ ...p }); showToast(`${p.name} saved to wishlist ♡`); }
  updateWishlistUI();
  // Refresh product cards to update heart state
  renderProducts(); renderBestsellers();
}

function updateWishlistUI() {
  const count = wishlist.length;
  const badge = document.getElementById("wishlistBadge");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "flex" : "none"; }
  document.getElementById("wishlistCountLabel").textContent = `(${count})`;

  const items = document.getElementById("wishlistItems");
  const empty = document.getElementById("wishlistEmpty");

  if (wishlist.length === 0) { items.innerHTML = ""; empty.style.display = "flex"; return; }
  empty.style.display = "none";

  items.innerHTML = wishlist.map(w => `
    <div class="wishlist-item">
      <div class="wi-img" style="background:${catColor(w.cat)}">${w.emoji}</div>
      <div class="wi-info">
        <strong>${w.name}</strong>
        <span>${fmt(w.price)}</span>
        <div class="wi-actions">
          <button class="wi-btn" onclick="addToCart(${w.id});closeWishlist()">Add to Cart</button>
          <button class="wi-btn remove" onclick="toggleWishlist(${w.id})">Remove</button>
        </div>
      </div>
    </div>`).join("");
}

function openWishlist() {
  document.getElementById("wishlistDrawer")?.classList.add("open");
  document.getElementById("drawerOverlay")?.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeWishlist() {
  document.getElementById("wishlistDrawer")?.classList.remove("open");
  document.getElementById("drawerOverlay")?.classList.remove("active");
  if (!document.getElementById("cartDrawer")?.classList.contains("open")) document.body.style.overflow = "";
}
window.closeWishlist = closeWishlist;

/* ════════════════════════════════════════════
   QUICK VIEW MODAL
════════════════════════════════════════════ */
function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const overlay = document.getElementById("modalOverlay");
  const img = document.getElementById("qvImage");
  const info = document.getElementById("qvInfo");

  img.style.background = catColor(p.cat);
  img.innerHTML = `<span style="font-size:5rem;filter:drop-shadow(0 8px 24px rgba(0,0,0,.15))">${p.emoji}</span>`;

  info.innerHTML = `
    <div class="product-category">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</div>
    <h3>${p.name}</h3>
    <div class="product-stars" style="margin-bottom:.75rem">${renderStars(p.rating)} <span style="color:var(--text-muted);font-size:.8rem">${p.rating} · ${p.reviews} reviews</span></div>
    <div class="qv-price">${fmt(p.price)}${p.oldPrice?` <del style="font-size:1.1rem;color:var(--text-muted)">${fmt(p.oldPrice)}</del>`:""}</div>
    <p class="qv-desc">${p.desc}</p>
    <div class="qv-size-label">${p.cat === "lips" || p.cat === "eyes" ? "Shade" : "Size"}</div>
    <div class="qv-sizes">${p.sizes.map((s,i) => `<button class="qv-size-btn${i===0?" active":""}" onclick="this.closest('.qv-sizes').querySelectorAll('.qv-size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">${s}</button>`).join("")}</div>
    <div class="qv-actions">
      <button class="btn-primary" onclick="addToCart(${p.id});closeQuickView()">Add to Bag</button>
      <button class="btn-ghost" onclick="toggleWishlist(${p.id});updateWishlistUI()">♡ Wishlist</button>
    </div>
    <div class="qv-ingredients"><strong>Key Ingredients</strong>${p.ingredients}</div>`;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeQuickView() {
  document.getElementById("modalOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
}
window.closeQuickView = closeQuickView;

/* ════════════════════════════════════════════
   SEARCH
════════════════════════════════════════════ */
function initSearch() {
  const trigger = document.getElementById("searchTrigger");
  const overlay = document.getElementById("searchOverlay");
  const close = document.getElementById("searchClose");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  trigger?.addEventListener("click", () => { overlay?.classList.add("open"); setTimeout(() => input?.focus(), 200); });
  close?.addEventListener("click", () => overlay?.classList.remove("open"));
  document.addEventListener("keydown", e => { if (e.key === "Escape") { overlay?.classList.remove("open"); closeQuickView(); closeCheckout(); } });

  document.querySelectorAll(".search-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      if (tag.dataset.cat) filterProducts(tag.dataset.cat);
      overlay?.classList.remove("open");
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  input?.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const found = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)).slice(0, 5);
    if (!found.length) { results.innerHTML = `<p style="color:var(--text-muted);font-size:.85rem">No results for "${q}"</p>`; return; }
    results.innerHTML = found.map(p => `
      <div class="search-result-item" onclick="openQuickView(${p.id});document.getElementById('searchOverlay').classList.remove('open')">
        <div class="sri-img" style="background:${catColor(p.cat)}">${p.emoji}</div>
        <div class="sri-info"><strong>${p.name}</strong><span>${p.cat}</span></div>
        <div class="sri-price">${fmt(p.price)}</div>
      </div>`).join("");
  });
}

/* ════════════════════════════════════════════
   CHECKOUT
════════════════════════════════════════════ */
function openCheckout() {
  closeCart();
  const overlay = document.getElementById("checkoutOverlay");
  if (overlay) { overlay.style.display = "flex"; setTimeout(() => overlay.classList.add("open"), 10); }
  document.body.style.overflow = "hidden";
  renderCheckoutSidebar();
  checkoutNext(1);
}
window.openCheckout = openCheckout;

function closeCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  if (overlay) { overlay.classList.remove("open"); setTimeout(() => { overlay.style.display = "none"; }, 400); }
  document.body.style.overflow = "";
}
window.closeCheckout = closeCheckout;

function checkoutNext(step) {
  [1,2,3,"Success"].forEach(s => {
    const el = document.getElementById("checkoutStep" + s);
    if (el) el.classList.toggle("hidden", s !== step);
  });
  document.querySelectorAll(".co-step").forEach(el => {
    const n = +el.dataset.step;
    el.classList.toggle("active", n === step);
    el.classList.toggle("done", n < step);
  });
  if (step === 3) renderOrderSummaryMini();
}
window.checkoutNext = checkoutNext;

function renderCheckoutSidebar() {
  const itemsEl = document.getElementById("checkoutCartItems");
  const totalsEl = document.getElementById("checkoutTotals");
  if (!itemsEl || !totalsEl) return;

  itemsEl.innerHTML = cart.map(c => `
    <div class="cco-item">
      <div class="cco-img">${c.emoji}</div>
      <div class="cco-info"><strong>${c.name}</strong><span>Qty: ${c.qty}</span></div>
      <div class="cco-price">${fmt(c.price * c.qty)}</div>
    </div>`).join("") || `<p style="color:rgba(255,255,255,.4);font-size:.82rem">Cart is empty</p>`;

  const sub = getCartTotal();
  const disc = promoApplied ? sub * 0.15 : 0;
  const ship = sub >= 75 ? 0 : 8;
  const total = sub - disc + ship;

  totalsEl.innerHTML = `
    <div class="ct-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    ${disc > 0 ? `<div class="ct-row discount"><span>Promo (15%)</span><span>−${fmt(disc)}</span></div>` : ""}
    <div class="ct-row"><span>Shipping</span><span>${ship === 0 ? "Free" : fmt(ship)}</span></div>
    <div class="ct-row total"><span>Total</span><span>${fmt(total)}</span></div>`;
}

function renderOrderSummaryMini() {
  const el = document.getElementById("orderSummaryMini"); if (!el) return;
  const sub = getCartTotal();
  const disc = promoApplied ? sub * 0.15 : 0;
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:.3rem"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    ${disc > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:.3rem;color:#2d6a4f"><span>Discount</span><span>−${fmt(disc)}</span></div>` : ""}
    <div style="display:flex;justify-content:space-between;font-weight:600;color:var(--plum);border-top:1px solid var(--border-light);padding-top:.5rem;margin-top:.3rem"><span>Total</span><span>${fmt(sub - disc)}</span></div>`;
}

function applyPromo() {
  const v = document.getElementById("promoInput")?.value.trim().toUpperCase();
  if (v === "GLOW3" || v === "LUMIERE15") {
    promoApplied = true; renderOrderSummaryMini(); renderCheckoutSidebar();
    showToast("Promo applied! 15% off ✓", "🎉");
  } else showToast("Invalid promo code", "✕");
}
window.applyPromo = applyPromo;

function placeOrder() {
  const num = Math.floor(Math.random() * 90000) + 10000;
  document.getElementById("orderNum").textContent = num;
  document.getElementById("checkoutStep3")?.classList.add("hidden");
  document.getElementById("checkoutSuccess")?.classList.remove("hidden");
  document.querySelectorAll(".co-step").forEach(el => el.classList.add("done"));
  cart = []; updateCartUI();
  promoApplied = false;
}
window.placeOrder = placeOrder;

/* ════════════════════════════════════════════
   NEWSLETTER
════════════════════════════════════════════ */
function initNewsletter() {
  const form = document.getElementById("nlForm"); if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const input = form.querySelector("input");
    btn.textContent = "You're in! ✓";
    btn.style.background = "linear-gradient(135deg,#2d6a4f,#1b4332)";
    btn.style.color = "#b7e4c7";
    input.value = "";
    showToast("Welcome to the Inner Circle! Check your inbox 💌", "✓");
    setTimeout(() => { btn.textContent = "Get 10% Off"; btn.style.background = ""; btn.style.color = ""; }, 4000);
  });
}

/* ════════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * 0.3;
      const y = (e.clientY - r.top - r.height/2) * 0.3;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

/* ════════════════════════════════════════════
   CARD TILT
════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll(".testi-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -6;
      card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

/* ════════════════════════════════════════════
   PARALLAX ORBS
════════════════════════════════════════════ */
function initParallax() {
  const orbs = document.querySelectorAll(".orb");
  window.addEventListener("mousemove", e => {
    const xR = (e.clientX / window.innerWidth - 0.5) * 2;
    const yR = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((o, i) => { const f = (i+1)*14; o.style.transform = `translate(${xR*f}px,${yR*f}px)`; });
  });
}

/* ════════════════════════════════════════════
   WIRE UP DRAWERS & MODALS
════════════════════════════════════════════ */
function initDrawers() {
  document.getElementById("cartTrigger")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  document.getElementById("wishlistToggleBtn")?.addEventListener("click", openWishlist);
  document.getElementById("wishlistClose")?.addEventListener("click", closeWishlist);
  document.getElementById("modalClose")?.addEventListener("click", closeQuickView);
  document.getElementById("checkoutClose")?.addEventListener("click", closeCheckout);
  document.getElementById("modalOverlay")?.addEventListener("click", e => { if (e.target === e.currentTarget) closeQuickView(); });
  document.getElementById("checkoutOverlay")?.addEventListener("click", e => { if (e.target === e.currentTarget) closeCheckout(); });
}

/* ════════════════════════════════════════════
   BESTSELLERS SLIDER ARROWS
════════════════════════════════════════════ */
function initBsSlider() {
  let bsOffset = 0;
  const slider = document.getElementById("bestsellersSlider"); if (!slider) return;
  document.getElementById("bsPrev")?.addEventListener("click", () => { bsOffset = Math.max(0, bsOffset - 1); slider.style.transform = `translateX(-${bsOffset * 25}%)`; });
  document.getElementById("bsNext")?.addEventListener("click", () => { const max = Math.max(0, slider.children.length - 4); bsOffset = Math.min(max, bsOffset + 1); slider.style.transform = `translateX(-${bsOffset * 25}%)`; });
  slider.style.transition = "transform .4s cubic-bezier(0.16,1,0.3,1)";
}

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initCursor();
  initScroll();
  initAnnouncement();
  initNav();
  initReveal();
  initCounters();
  initParticles();
  initHeroSlider();
  renderProducts();
  renderBestsellers();
  initFilters();
  initSearch();
  initDrawers();
  initNewsletter();
  initMagnetic();
  initTilt();
  initParallax();
  initBsSlider();
  updateCartUI();
  updateWishlistUI();

  // Card format on menu links
  document.querySelectorAll(".mega-col a[data-cat], .mob-nav a[data-cat]").forEach(a => {
    a.addEventListener("click", e => { e.preventDefault(); filterProducts(a.dataset.cat); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); });
  });
});


// API Base URL
const API_BASE = 'https://valkyo.onrender.com/api';

// Login/Register
async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// Place Order
async function placeOrder(orderData, token) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return res.json();
}