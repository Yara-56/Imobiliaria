import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Imobiliária" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log(`✅ E-mail enviado para: ${email}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Não foi possível enviar o e-mail.');
  }
};

export default sendEmail;
