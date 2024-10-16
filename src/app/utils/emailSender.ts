import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const ReadFile = promisify(fs.readFile);

const sendEmail = async (email: string, html: string, subject: string) => {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const res = await transporter.sendMail({
    from: '"FurrfectCare" <mdshohed170@gmail.com>', // sender address
    to: email, // list of receivers
    subject, // Subject line.
    //text: "Hello world?", // plain text body
    html, // html body
  });
  console.log("result", res);
  
};

const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `src/views/${templateType}.template.hbs`
    );
    const content = await ReadFile(templatePath, 'utf8');

    const template = Handlebars.compile(content);

    return template(data);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};



// import nodemailer from 'nodemailer'
// import config from '../config';


// export const sendEmail = async ( email: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com.',
//     port: 587,
//     secure: config.node_env === 'production',
//     auth: {
//       user: config.sender_email,
//       pass: config.sender_app_password,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   const ok = await transporter.sendMail({
//     from: 'mdshohed170@gmail.com', 
//     to: email,
//     subject: 'Reset your password within 10 mins!',
//     text: '', 
//     html, // html body
//   });
//   console.log("sendEmail",ok);
// };
