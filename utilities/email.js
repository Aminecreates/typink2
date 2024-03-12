const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");
const path = require("path");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Amincreates <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // sendgrid
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject, data) {
    // render HTML based on a ejs template
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "emails",
      `${template}.ejs`
    );
    const html = await ejs.renderFile(templatePath, data); // Pass data to the renderFile method
    //Define email options
    const mailOptions = {
      from: "Amine <hello@amine.io>",
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    // create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to Typink, happy reading!", {
      user: { firstName: this.firstName },
      url: this.url,
    });
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)",
      {
        user: { firstName: this.firstName },
        url: this.url,
      }
    );
  }
};
