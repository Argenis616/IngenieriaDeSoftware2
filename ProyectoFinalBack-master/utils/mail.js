const nodemailer = require("nodemailer");

module.exports = function(User) {
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com", // Gmail Host
      port: 465, // Port
      secure: true, // this is true as port is 465
      auth: {
        user: "team.lua.sac@gmail.com", //Gmail username
        pass: "LUASAC123" // Gmail password
      }
    });

    const mailOptions = {
      from: '"LUA S.A.C." <team.lua.sac@gmail.com>',
      to: User.email, // Recepient email address. Multiple emails can send separated by commas
      subject: "REGISTRO DE USUARIO",
      text:
        "Hola " +
        User.firstName +
        " " +
        User.lastName +
        ", su costraseña es: " +
        User.password
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
  });
};
