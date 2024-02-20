/**
 * @file mailer.ts
 * @description This file contains the methods to handle the email sending operations.
 */

import nodemailer from 'nodemailer';
import config from '../config';

// Configure SMTP server and create instance -> Singleton pattern
// refers to https://iamiet.tistory.com/entry/Nodemailer-Gmail-OAuth20%EC%9C%BC%EB%A1%9C-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EB%B0%9C%EC%86%A1%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
const transporter = nodemailer.createTransport({
    service: config.mailer.service,
    host: config.mailer.host,
    port: config.mailer.port,
    secure: config.mailer.secure,
    auth: {
        type: config.mailer.oauth.type,
        user: config.mailer.oauth.user,
        clientId: config.mailer.oauth.clientId,
        clientSecret: config.mailer.oauth.clientSecret,
        refreshToken: config.mailer.oauth.refreshToken,
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