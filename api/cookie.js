// api/cookie.js - Vercel Serverless Function (Write-Only Gateway)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 1. CHẶN HOÀN TOÀN GET: Cấm mở xem link hoặc đọc trộm dữ liệu
  if (req.method !== 'POST') {
    return res.status(403).json({ error: '⛔ Cấm đọc: Chỉ chấp nhận đẩy dữ liệu lên qua POST!' });
  }

  // 2. CHẶN CÁC LỆNH MUỐN XÓA HOẶC ĐỌC TỪ CLIENT
  const body = req.body || {};
  const action = String(body.action || '').toLowerCase();
  if (action.includes('delete') || action.includes('clear') || action.includes('remove') || action.includes('read') || action.includes('get')) {
    return res.status(403).json({ error: '⛔ Cấm xóa hoặc đọc dữ liệu!' });
  }

  try {
    // Luôn ép hành vi là thêm mới vào đuôi bảng (append_row)
    body.action = 'append_row';

    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyN0dPhI7om7LZrfTFKgbVZ_otfElBqJV8WPokkt0ZvHDFgs6ooehtd0VHY93E-K5hX/exec";

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // 3. CHỈ TRẢ VỀ THÔNG BÁO THÀNH CÔNG (Không trả lại danh sách hay cookie của ai khác)
    return res.status(200).json({
      status: data.status || 'success',
      stt: data.stt || 0,
      message: '✓ Đã ghi nhận thành công'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi ghi nhận dữ liệu' });
  }
}
