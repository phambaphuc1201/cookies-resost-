export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST' });

  try {
    // LINK GOOGLE APPS SCRIPT CỦA BẠN ĐƯỢC GIẤU KÍN Ở ĐÂY:
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyFIcDKyBAp3EGKTXjs9CUy0Ev4ohr4tIKluApm2JXoT-eecpN-gCYAX9IJGPywAZzL/exec";

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
}
