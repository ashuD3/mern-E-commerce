const nodemailer = require("nodemailer");

exports.sendEmail = ({ sendTo, sub, msg,htmlMsg }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "dhakneashwini6@gmail.com",
      pass: "vyxiicupyekagzjv",
    },
  }); //end
  transporter.sendMail(
    {
      to: sendTo,
      from: "dhakneashwini6@gmail.com",
      subject: sub,
      text: msg,
      html:htmlMsg,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("EMAIL SEND SUCCESSFULLY");
      }
    }
  );
};
