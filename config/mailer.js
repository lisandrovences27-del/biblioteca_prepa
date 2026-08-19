const nodemailer = require('nodemailer');

// Configuración del transporter usando variables de entorno
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4, // Fuerza el uso de IPv4 (soluciona error ENETUNREACH en Render)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificar que la configuración funciona
transporter.verify().then(() => {
    console.log('Listo para enviar correos');
}).catch((error) => {
    console.error('Error con la configuración de correos (Asegurate de llenar EMAIL_USER y EMAIL_PASS en .env):', error.message);
});

module.exports = transporter;
