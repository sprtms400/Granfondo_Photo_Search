/**
 * @file mailer.ts
 * @description This file contains the methods to handle the email sending operations.
 */

import nodemailer from 'nodemailer';
import config from '../config';

// Configure SMTP server and create instance -> Singleton pattern
const transporter = nodemailer.createTransport({
    service: config.mailer.service,
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass,
    }
});

export const sendEmailVerificationMail = (desEmail: string) => {
    const mailOptions = {
        from: config.mailer.options.from, // 발송자 주소
        to: desEmail, // 수신자 주소
        subject: 'Hello', // 메일 제목
        // text: 'Hello world', // 메일 본문 (텍스트)
        html: '<b>Hello world</b>' // 메일 본문 (HTML)
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};