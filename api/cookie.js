// api/cookie.js - Vercel Serverless Function (Bảo mật 100%)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 1. Chặn hoàn toàn GET: Cấm mở xem link hoặc đọc trộm dữ liệu
  if (req.method !== 'POST') {
    return res.status(403).json({ error: '⛔ Cấm đọc: Chỉ chấp nhận đẩy dữ liệu lên qua POST!' });
  }

  // 2. Chặn các lệnh muốn xóa hoặc đọc dữ liệu
  const body = req.body || {};
  const action = String(body.action || '').toLowerCase();
  if (action.includes('delete') || action.includes('clear') || action.includes('remove') || action.includes('read') || action.includes('get')) {
    return res.status(403).json({ error: '⛔ Cấm xóa hoặc đọc dữ liệu!' });
  }

  try {
    // Luôn ép hành vi là ghi nối tiếp vào cuối (append_row)
    body.action = 'append_row';

    // LẤY LINK TỰ ĐỘNG TỪ BIẾN MÔI TRƯỜNG BÍ MẬT CỦA VERCEL (GIẤU KÍN 100%)
    const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL;

    if (!GOOGLE_SHEET_URL) {
      return res.status(500).json({ error: 'Chưa cấu hình biến GOOGLE_SHEET_URL trên Vercel!' });
    }

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // 3. Chỉ trả về thông báo thành công, không trả nội dung nhạy cảm
    return res.status(200).json({
      status: data.status || 'success',
      stt: data.stt || 0,
      message: '✓ Đã ghi nhận thành công'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi ghi nhận dữ liệu' });
  }
}
