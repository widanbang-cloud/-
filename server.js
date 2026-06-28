const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Gmail 앱 비밀번호로 발송
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'widanbang@gmail.com',
    pass: 'vqezwmlcqxsgsgwb' // 앱 비밀번호 (공백 제거)
  }
});

// 이메일 발송 API
app.post('/send-code', async (req, res) => {
  const { to_email, code } = req.body;

  if (!to_email || !code) {
    return res.status(400).json({ error: '이메일과 코드가 필요합니다.' });
  }

  const mailOptions = {
    from: '"오렌지 샵" <widanbang@gmail.com>',
    to: to_email,
    subject: '오렌지 샵 메일 인증 코드',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
        <p>안녕하세요!</p>
        <h1 style="font-size:2rem;">인증 코드: <strong>${code}</strong></h1>
        <p>이 코드는 5분간 유효합니다.</p>
        <br>
        <p style="font-size:1.1rem;">만약 로그인 한적없는데 보내진다면 무시부탁드리거나<br>비밀번호를 변경부탁드립니다</p>
        <p>디스코드 서버에 가입하고 싶다면 <a href="https://discord.gg/WBRuZs5wGp">https://discord.gg/WBRuZs5wGp</a></p>
        <p style="font-size:0.8rem;">참고로 방위단 서버입니다 (테러 방지 봇운영중)</p>
        <br>
        <p>오렌지 샵 드림</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('이메일 발송 실패:', err);
    res.status(500).json({ error: '이메일 발송 실패' });
  }
});

// 서버 상태 확인용
app.get('/', (req, res) => {
  res.send('오렌지 샵 서버 작동중 ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행중: 포트 ${PORT}`);
});
