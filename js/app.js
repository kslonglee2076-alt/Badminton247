
'use strict';

const $ = (selector) => document.querySelector(selector);
const normalizeText = (value) =>
  String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const escapeHTML = (value) =>
  String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));

const safePhone = (phone) => String(phone ?? '').replace(/[^0-9+]/g, '');

async function loadCourts() {
  try {
    const response = await fetch('./data/courts.json', { cache: 'no-store' });
    if (response.ok) return await response.json();
  } catch (_) {}
  if (Array.isArray(window.BADMINTON_COURTS)) return window.BADMINTON_COURTS;
  throw new Error('Không thể tải dữ liệu sân.');
}

function createCourtCard(court) {
  const name = escapeHTML(court.name);
  const address = escapeHTML(court.address);
  const district = escapeHTML(court.district);
  const phone = safePhone(court.phone);
  const detailUrl = `./pages/court.html?id=${encodeURIComponent(court.id)}`;
  const telHref = phone ? `tel:${phone}` : '#';

  return `
    <article class="court-card">
      <div class="card-body">
        <div class="card-top">
          <span class="district">${district}</span>
          <span class="scale">📏 Quy mô: ${Number(court.scale) || 0} sân</span>
        </div>
        <h3 class="court-name">${name}</h3>
        <p class="address">📍 ${address}</p>
        <div class="meta-row">
          <span class="status ${court.verified ? 'verified' : ''}">
            ${court.verified ? '🟢 Đã xác minh' : '🟡 Cộng đồng cung cấp'}
          </span>
        </div>
        <div class="price-box">
          <div class="price-row low"><span>☀️ Giờ thấp điểm</span><span>${escapeHTML(court.lowPrice)}</span></div>
          <div class="price-time">${escapeHTML(court.lowTime)}</div>
          <div class="price-row high"><span>⚡ Giờ cao điểm</span><span>${escapeHTML(court.highPrice)}</span></div>
          <div class="price-time">${escapeHTML(court.highTime)}</div>
        </div>
      </div>
      <div class="card-footer">
        <a href="${detailUrl}" class="btn btn-secondary">Xem chi tiết</a>
        <a href="${telHref}" class="btn-call" aria-label="Gọi ${name}">📞 Gọi sân</a>
      </div>
    </article>`;
}

async function initHome() {
  const grid = $('#courtGrid');
  if (!grid) return;

  try {
    const courts = await loadCourts();
    const districtFilter = $('#districtFilter');
    const searchName = $('#searchName');
    const count = $('#courtCount');
    const summary = $('#resultSummary');
    const empty = $('#emptyState');

    const districts = [...new Set(courts.map(court => court.district))].sort((a,b) => a.localeCompare(b, 'vi'));
    districts.forEach(district => {
      if (![...districtFilter.options].some(option => option.value === district)) {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtFilter.appendChild(option);
      }
    });

    function render(list) {
      grid.querySelectorAll('.court-card').forEach(card => card.remove());
      empty.style.display = list.length ? 'none' : 'block';
      list.forEach(court => empty.insertAdjacentHTML('beforebegin', createCourtCard(court)));
      count.textContent = list.length;
      summary.textContent = `Đang hiển thị ${list.length}/${courts.length} sân.`;
    }

    function filter() {
      const district = districtFilter.value;
      const keyword = normalizeText(searchName.value);
      const filtered = courts.filter(court => {
        const matchesDistrict = district === 'all' || court.district === district;
        const haystack = normalizeText(`${court.name} ${court.address} ${court.district}`);
        return matchesDistrict && (!keyword || haystack.includes(keyword));
      });
      render(filtered);
    }

    districtFilter.addEventListener('change', filter);
    searchName.addEventListener('input', filter);
    $('#searchForm')?.addEventListener('submit', event => event.preventDefault());

    $('#clearFiltersBtn')?.addEventListener('click', () => {
      districtFilter.value = 'all';
      searchName.value = '';
      filter();
      searchName.focus();
    });

    $('#contributeBtn')?.addEventListener('click', () => {
      alert('Form đóng góp sân sẽ được triển khai ở bước 1.2. Hiện tại dữ liệu được quản lý trong data/courts.json.');
    });

    render(courts);
  } catch (error) {
    grid.innerHTML = `<div class="empty" style="display:block"><strong>Không tải được dữ liệu sân</strong>${escapeHTML(error.message)}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', initHome);
