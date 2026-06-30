const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const BREVO_API_KEY = process.env.BREVO_API_KEY;

app.post('/send-code', async (req, res) => {
  const { to_email, code } = req.body;
  if (!to_email || !code) {
    return res.status(400).json({ error: '이메일과 코드가 필요합니다.' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: '오렌지 샵', email: 'orangesho123@gmail.com' },
        to: [{ email: to_email }],
        subject: '오렌지 샵 메일 인증 코드',
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
            <p>안녕하세요!</p>
            <h1 style="font-size:2rem;">인증 코드: <strong>${code}</strong></h1>
            <p>이 코드는 5분간 유효합니다.</p>
            <br>
            <p style="font-size:1.1rem;">만약 로그인 한적없는데 보내진다면 무시부탁드리거나<br>비밀번호를 변경부탁드립니다</p>
            <p>디스코드: <a href="https://discord.gg/WBRuZs5wGp">https://discord.gg/WBRuZs5wGp</a></p>
            <p style="font-size:0.8rem;">참고로 방위단 서버입니다 (테러 방지 봇운영중)</p>
            <br>
            <p>오렌지 샵 드림</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('❌ Brevo 발송 실패:', JSON.stringify(data));
      return res.status(500).json({ error: '발송 실패', detail: data });
    }

    console.log(`✅ 이메일 발송 성공: ${to_email}`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ 오류:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('오렌지 샵 서버 작동중 ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행중: 포트 ${PORT}`);
  setInterval(() => {
    fetch('https://roshop-server.onrender.com')
      .then(() => console.log('서버 깨어있음 ✅'))
      .catch(() => console.log('핑 실패'));
  }, 5 * 60 * 1000);
});
