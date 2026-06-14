const { sendPasswordResetEmail } = require('./utils/email');

async function test() {
  console.log('Testing email sending with current .env credentials...');
  try {
    await sendPasswordResetEmail(
      'patraamar187@gmail.com',
      'Amar Test',
      'test-token-123456'
    );
    console.log('SUCCESS! Email sent successfully.');
  } catch (error) {
    console.error('FAILED to send email. Error detail:', error);
  }
}

test();
