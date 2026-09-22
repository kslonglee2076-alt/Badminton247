
'use strict';

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) =>
  String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[char]));
const safePhone = (phone) => String(phone ?? '').replace(/[^0-9+]/g, '');

async function initDetail() {
  const container = $('#courtDetail');
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    container.innerHTML = '<div class="detail-card"><strong>Không tìm thấy mã sân.</strong><p class="muted">Hãy quay lại danh sách sân.</p></div>';
    return;
  }

  try {
    let courts;
    try {
      const response = await fetch('../data/courts.json', { cache: 'no-store' });
      if (response.ok) courts = await response.json();
    } catch (_) {}
    if (!Array.isArray(courts)) courts = window.BADMINTON_COURTS;
    if (!Array.isArray(courts)) throw new Error('Không thể tải dữ liệu sân.');
    const court = courts.find(item => String(item.id) === String(id));

    if (!court) {
      container.innerHTML = '<div class="detail-card"><strong>Không tìm thấy sân.</strong><p class="muted">Sân có thể chưa tồn tại hoặc mã sân không đúng.</p></div>';
      return;
    }

    const name = escapeHTML(court.name);
    const phone = safePhone(court.phone);
    const mapHref = court.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`;
    const statusText = court.verificationStatus || (court.verified ? 'Đã xác minh' : 'Cộng đồng cung cấp');
    const sourceText = court.source || 'Chưa xác định';
    const facilities = Array.isArray(court.facilities) ? court.facilities : [];
    const facilitiesHTML = facilities.length
      ? facilities.map(item => `<span class="facility-chip">✓ ${escapeHTML(item)}</span>`).join('')
      : '<span class="muted">Chưa có dữ liệu tiện ích.</span>';
    document.title = `${court.name} - SanCauLong.vn`;

    container.innerHTML = `
      <div class="breadcrumb"><a href="../index.html">Trang chủ</a> / ${name}</div>
      <article class="detail-card">
        <div class="detail-head">
          <div>
            <span class="district">${escapeHTML(court.district)}</span>
            <h1 class="detail-title">${name}</h1>
            <p class="detail-address">📍 ${escapeHTML(court.address)}</p>
          </div>
          <div class="detail-actions">
            <a class="btn btn-primary" href="${phone ? `tel:${phone}` : '#'}">📞 Gọi sân</a>
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="${mapHref}">🧭 Chỉ đường</a>
          </div>
        </div>

        <div class="info-grid">
          <div class="info"><div class="info-label">Quy mô</div><div class="info-value">${Number(court.scale) || 0} sân</div></div>
          <div class="info"><div class="info-label">Giờ hoạt động</div><div class="info-value">${escapeHTML(court.openingHours || 'Liên hệ sân')}</div></div>
          <div class="info"><div class="info-label">Giờ thấp điểm</div><div class="info-value">${escapeHTML(court.lowPrice)}</div><p class="muted">${escapeHTML(court.lowTime)}</p></div>
          <div class="info"><div class="info-label">Giờ cao điểm</div><div class="info-value">${escapeHTML(court.highPrice)}</div><p class="muted">${escapeHTML(court.highTime)}</p></div>
          <div class="info"><div class="info-label">Trạng thái dữ liệu</div><div class="info-value">${court.verified ? '🟢' : '🟡'} ${escapeHTML(statusText)}</div></div>
          <div class="info"><div class="info-label">Cập nhật lần cuối</div><div class="info-value">${escapeHTML(court.lastUpdated || 'Chưa rõ')}</div></div>
          <div class="info"><div class="info-label">Nguồn dữ liệu</div><div class="info-value">${escapeHTML(sourceText)}</div></div>
          <div class="info"><div class="info-label">Liên hệ</div><div class="info-value">${phone ? escapeHTML(court.phone) : 'Chưa có số điện thoại'}</div></div>
        </div>

        <div class="detail-extra">
          <div class="extra-block">
            <h2>Tiện ích</h2>
            <div class="facility-list">${facilitiesHTML}</div>
          </div>
          <div class="extra-block">
            <h2>Ghi chú</h2>
            <p class="detail-note">${escapeHTML(court.notes || 'Chưa có ghi chú.')}</p>
          </div>
        </div>

        <div class="notice">
          ℹ️ Giá và giờ hoạt động có thể thay đổi. Hãy liên hệ sân trước khi đến. Dữ liệu trên trang được gắn nguồn và trạng thái để dễ kiểm tra, nhưng vẫn nên xác minh thực tế trước khi sử dụng.
        </div>
        <div class="back-row"><a class="btn btn-secondary" href="../index.html">← Quay lại danh sách sân</a></div>
      </article>`;
  } catch (error) {
    container.innerHTML = `<div class="detail-card"><strong>Có lỗi khi tải sân</strong><p class="muted">${escapeHTML(error.message)}</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', initDetail);
