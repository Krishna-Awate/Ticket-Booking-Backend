const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Node mailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_SECRET,
  },
});

const sendMail = (data) => {
  const source = fs.readFileSync(
    path.join(__dirname, `../templates/${data.templateName}.hbs`),
    "utf8"
  );
  const template = handlebars.compile(source);

  // FOR SENDGRID
  // const msg = {
  //   to: data.to,
  //   from: "krushnaawate8@gmail.com",
  //   subject: data.subject,
  //   html: template(data),
  // };
  // sgMail
  //   .send(msg)
  //   .then((response) => {
  //     //   console.log("HERE 1", response[0].statusCode);
  //     //   console.log("HERE 2", response[0].headers);
  //   })
  //   .catch((error) => {
  //     console.error("Error", error.response.body);
  //   });

  // Nodemailer
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: data.to,
    subject: data.subject,
    html: template(data),
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error:", error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports = sendMail;
