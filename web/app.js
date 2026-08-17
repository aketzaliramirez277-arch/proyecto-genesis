const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function showToast(title, detail = '') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<strong>${title}</strong>${detail ? `<small>${detail}</small>` : ''}`;
  $('#toast-region').append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function openModal(title, content, kicker = 'SISTEMA') {
  $('#modal-title').textContent = title;
  $('#modal-kicker').textContent = kicker;
  $('#modal-content').innerHTML = content;
  $('#modal').classList.add('open');
  $('#modal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  $('#modal').classList.remove('open');
  $('#modal').setAttribute('aria-hidden', 'true');
}

$$('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

const menuToggle = $('.menu-toggle');
const nav = $('#primary-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.primary-nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

$$('.tab').forEach((tab) => tab.addEventListener('click', () => {
  $$('.tab').forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  $$('.tab-panel').forEach((panel) => { panel.classList.remove('active'); panel.hidden = true; });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const target = $('#' + tab.dataset.tab);
  target.hidden = false;
  target.classList.add('active');
}));

const missionData = { m1: 'mission-m1', m2: 'mission-m2', m3: 'mission-m3' };
$$('.map-point').forEach((point) => point.addEventListener('click', () => {
  $$('.map-point').forEach((item) => item.classList.remove('active'));
  $$('.mission-copy').forEach((copy) => { copy.hidden = true; copy.classList.remove('active'); });
  point.classList.add('active');
  const target = $('#' + missionData[point.dataset.mission]);
  target.hidden = false;
  target.classList.add('active');
  showToast('Misión seleccionada', target.querySelector('h3').textContent);
}));
$('#mission-cta').addEventListener('click', () => showToast('Archivo abierto', 'La misión está lista para jugar en el build descargado.'));

const characterCarousel = $('#character-carousel');
function moveCharacter(direction) {
  const card = $('.character-card', characterCarousel);
  if (window.innerWidth <= 720) characterCarousel.scrollBy({ left: direction * (card.offsetWidth + 18), behavior: 'smooth' });
  else characterCarousel.append(...(direction > 0 ? [characterCarousel.firstElementChild] : [characterCarousel.lastElementChild]));
  $$('.carousel-dots button').forEach((dot) => dot.classList.toggle('active', dot.dataset.dot === (direction > 0 ? '1' : '0')));
}
$$('[data-carousel]').forEach((button) => button.addEventListener('click', () => moveCharacter(button.dataset.carousel === 'next' ? 1 : -1)));
$$('.carousel-dots button').forEach((dot) => dot.addEventListener('click', () => {
  const cards = $$('.character-card', characterCarousel);
  if (window.innerWidth <= 720) characterCarousel.scrollTo({ left: Number(dot.dataset.dot) * (cards[0].offsetWidth + 18), behavior: 'smooth' });
  $$('.carousel-dots button').forEach((item) => item.classList.toggle('active', item === dot));
}));

const galleryThumbs = $$('.gallery-thumb');
let galleryIndex = 0;
function renderGallery(index) {
  galleryIndex = (index + galleryThumbs.length) % galleryThumbs.length;
  const thumb = galleryThumbs[galleryIndex];
  $('#gallery-main').src = thumb.dataset.image;
  $('#gallery-main').alt = thumb.querySelector('img').alt;
  $('#gallery-title').textContent = thumb.dataset.title;
  $('#gallery-counter').textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryThumbs.length).padStart(2, '0')}`;
  galleryThumbs.forEach((item) => item.classList.toggle('active', item === thumb));
}
galleryThumbs.forEach((thumb, index) => thumb.addEventListener('click', () => renderGallery(index)));
$('#gallery-prev').addEventListener('click', () => renderGallery(galleryIndex - 1));
$('#gallery-next').addEventListener('click', () => renderGallery(galleryIndex + 1));
$('#gallery-main').addEventListener('click', () => openModal($('#gallery-title').textContent, `<img src="${$('#gallery-main').src}" alt="${$('#gallery-main').alt}" style="width:100%;border-radius:10px">`, 'LIGHTBOX'));

$('#refresh-archive').addEventListener('click', () => showToast('Archivo actualizado', '78% de los registros están indexados.'));
$('#transmission-alert').addEventListener('click', () => showToast('Escaneo completado', 'Se detectó una coordenada oculta en el video.'));
$('#back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
$('#open-video').addEventListener('click', () => {
  const video = $('#story-video');
  if (video.requestFullscreen) video.requestFullscreen();
  else openModal('Transmisión 001', '<p>Reproduce el videoclip de inicio desde el panel de transmisión.</p>');
});
$('#search-button').addEventListener('click', () => openModal('Buscar en el archivo', '<label class="field-label">Consulta<input id="modal-search" type="search" placeholder="Ej. núcleo, misión, personaje..."></label><button class="button button-primary full-width" id="modal-search-button" type="button">ESCANEAR</button>', 'BÚSQUEDA'));
$('#profile-button').addEventListener('click', () => openModal('Perfil del operador', '<p class="muted">Operador DR · Acceso público autorizado.</p><div class="tag-list"><span class="tag">VISITANTE</span><span class="tag tag-pink">ARCHIVO V1.0</span></div><hr style="border-color:var(--line);margin:22px 0"><p>Tu progreso se conserva localmente en este dispositivo.</p>', 'IDENTIDAD'));

$('#checkout-form').addEventListener('submit', (event) => { event.preventDefault(); showToast('Registro completado', 'Elige Windows o macOS en la sección de descargas.'); });

$('#archive-search').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  $$('.character-card, .download-card, .mission-details').forEach((card) => { card.style.opacity = !query || card.textContent.toLowerCase().includes(query) ? '1' : '.3'; });
});

// Scrollspy para que el navbar refleje la sección visible.
const navLinks = $$('.primary-nav a');
const observedSections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`)); }), { rootMargin: '-35% 0px -55% 0px' });
observedSections.forEach((section) => observer.observe(section));
