const path = require("path");
const nodemailer = require("nodemailer");

const { host, port, user, pass} = require("../config/mailer.json");
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

transport.use("compile", hbs({
      viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve("../Estrutura-e-cadastro/src/resources/mail/"),
      },
      viewPath: path.resolve("../Estrutura-e-cadastro/src/resources/mail/"),
      extName: ".html",
    })
);

// transport.use("compile", hbs({
//   viewEngine: "handlebars",
//   viewPath: path.resolve("../src/resources/mail"),
//   extName: ".html",

// }));

module.exports = transport;
