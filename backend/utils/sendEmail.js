// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Cria conta temporária de teste
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"Imobiliária Lacerda" <${testAccount.user}>`,
      to: email,
      subject,
      text: message,
    });

    console.log('Mensagem enviada: %s', info.messageId);
    console.log('URL de visualização do e-mail: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Não foi possível enviar o e-mail.');
  }
};

export default sendEmail;
