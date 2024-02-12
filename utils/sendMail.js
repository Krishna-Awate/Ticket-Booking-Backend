const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const sendMail = (data) => {
  const source = fs.readFileSync(
    path.join(__dirname, `../templates/${data.templateName}.hbs`),
    "utf8"
  );
  const template = handlebars.compile(source);

  const msg = {
    to: data.to,
    from: "krushnaawate8@gmail.com",
    subject: data.subject,
    html: template(data),
  };
  sgMail
    .send(msg)
    .then((response) => {
      //   console.log("HERE 1", response[0].statusCode);
      //   console.log("HERE 2", response[0].headers);
    })
    .catch((error) => {
      console.error("Error", error.response.body);
    });
};

module.exports = sendMail;
