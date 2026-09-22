
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
  const telHref = phone ? `tel:${phone}` : '';
  const mapHref = court.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`;

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
            ${escapeHTML(court.verificationStatus || (court.verified ? 'Đã xác minh' : 'Cộng đồng cung cấp'))}
          </span>
          <span class="updated-badge">Cập nhật ${escapeHTML(court.lastUpdated || 'chưa rõ')}</span>
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
        <div class="card-actions">
          ${phone ? `<a href="${telHref}" class="btn btn-primary btn-small" aria-label="Gọi ${name}">📞 Gọi</a>` : '<span class="muted small-text">Chưa có SĐT</span>'}
          <a href="${mapHref}" class="btn btn-secondary btn-small" target="_blank" rel="noopener" aria-label="Chỉ đường đến ${name}">🧭 Chỉ đường</a>
        </div>
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
      summary.textContent = list.length === courts.length
        ? `Đang hiển thị ${list.length}/${courts.length} sân.`
        : `Tìm thấy ${list.length}/${courts.length} sân phù hợp.`;
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

    // Cho phép dùng phím Escape để xóa nhanh từ khóa tìm kiếm.
    searchName.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchName.value) {
        searchName.value = '';
        filter();
      }
    });

    const contributeModal = $('#contributeModal');
    const contributeForm = $('#contributeForm');

    function openContribution() {
      if (!contributeModal) return;
      contributeModal.hidden = false;
      document.body.classList.add('modal-open');
      $('#contribName')?.focus();
    }

    function closeContribution() {
      if (!contributeModal) return;
      contributeModal.hidden = true;
      document.body.classList.remove('modal-open');
    }

    $('#contributeBtn')?.addEventListener('click', openContribution);
    $('#closeContributeBtn')?.addEventListener('click', closeContribution);
    $('#cancelContributeBtn')?.addEventListener('click', closeContribution);

    contributeModal?.addEventListener('click', (event) => {
      if (event.target === contributeModal) closeContribution();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && contributeModal && !contributeModal.hidden) {
        closeContribution();
      }
    });

    contributeForm?.addEventListener('submit', (event) => {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(contributeForm).entries());
      const title = `[Đóng góp sân] ${data.name || 'Sân cầu lông mới'}`;

      const body = [
        '## Thông tin sân',
        '',
        `- **Tên sân:** ${data.name || ''}`,
        `- **Địa chỉ:** ${data.address || ''}`,
        `- **Quận / Huyện:** ${data.district || ''}`,
        `- **Số điện thoại:** ${data.phone || 'Chưa cung cấp'}`,
        `- **Quy mô:** ${data.scale ? `${data.scale} sân` : 'Chưa cung cấp'}`,
        `- **Giờ hoạt động:** ${data.hours || 'Chưa cung cấp'}`,
        `- **Giá thấp điểm:** ${data.lowPrice || 'Chưa cung cấp'}`,
        `- **Giá cao điểm:** ${data.highPrice || 'Chưa cung cấp'}`,
        `- **Google Maps:** ${data.map || 'Chưa cung cấp'}`,
        '',
        '## Thông tin thêm',
        '',
        data.note || 'Không có',
        '',
        '## Ý kiến góp ý',
        '',
        data.feedback || 'Không có',
        '',
        '---',
        'Được gửi từ biểu mẫu Đóng góp sân trên SanCauLong.vn.',
        'Vui lòng kiểm tra thông tin trước khi cập nhật vào data/courts.json.'
      ].join('\n');

      const issueUrl =
        'https://github.com/kslonglee2076-alt/Badminton247/issues/new' +
        `?title=${encodeURIComponent(title)}` +
        `&body=${encodeURIComponent(body)}`;

      window.open(issueUrl, '_blank', 'noopener');
      contributeForm.reset();
      closeContribution();
    });

    render(courts);
  } catch (error) {
    grid.innerHTML = `<div class="empty" style="display:block"><strong>Không tải được dữ liệu sân</strong>${escapeHTML(error.message)}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', initHome);
