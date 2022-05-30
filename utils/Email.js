const nodemailer = require("nodemailer");
class Email {
  constructor(template = "") {
    this.subject = "";
    this.body = "";
    this.cc = [];
  }
  setSubject(subject) {
    this.subject = subject;
  }
  setRawBody(body) {
    this.body = body;
  }
  setBody(data) {
    this.body = data;
  }
  setCC(email) {
    this.cc = email;
  }
  async send(email) {
    if (!email) {
      throw new Error("email not set");
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = transporter.sendMail({
      from: `"company" <${process.env.EMAIL_USERNAME}`,
      to: email,
      subject: this.subject,
      html: this.body,
    });
    return info;
  }
  static sendEmail(data, email, cc = []) {
    const emailClient = new Email();
    emailClient.setBody(data);
    emailClient.setSubject(subject);
    emailClient.setCC(cc);
    return emailClient.send(email);
  }
}
module.exports = { Email };