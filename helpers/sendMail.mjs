import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "vpsmacker@gmail.com",
    pass: "xujttttplvxodpoa",
  },
});

async function sendMail(title, subheading, changes) {
  const info = await transporter.sendMail({
    from: "vpsmacker@gmail.com", 
    to: "vpatle@parkar.digital", 
    subject: "New Updates", 
    html: `
      <h1>${title}</h1>
      <p>${subheading}</p>
      <p>${changes}</p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
}


export default sendMail;
