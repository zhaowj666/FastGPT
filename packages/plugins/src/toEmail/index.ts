import * as nodemailer from 'nodemailer';
import { addLog } from '../../../service/common/system/log';
import config from '../../custom_config.json';
import { result } from 'lodash';

type Props = {
  email: string;
  subject: string;
  content: string;
};
type Response = Promise<{
  result: string;
}>;

const main = async ({ email, subject, content }: Props): Response => {
  let transporter = nodemailer.createTransport({
    service: config.toEmail.service, // 注意：Nodemailer可能不直接支持'qq'作为服务，因此可能需要使用SMTP配置
    // 如果Nodemailer不支持'qq'，则使用以下SMTP配置
    host: config.toEmail.host,
    port: config.toEmail.port, // 或587（如果使用TLS），但QQ邮箱通常使用SSL的465端口
    secure: true, // 设置为true以使用SSL
    auth: {
      user: config.toEmail.sender, // 替换为您的QQ邮箱地址
      pass: config.toEmail.code // 替换为您的QQ邮箱SMTP授权码
    }
  });

  let mailOptions = {
    from: '<' + config.toEmail.sender + '>', // 发送者地址，包括您的名字和邮箱
    to: email, // 接收者邮箱地址  riverzhao888@gmail.com
    subject: subject, // 邮件主题
    text: content, // 纯文本正文
    html: content // HTML正文
  };

  try {
    let response = await transporter.sendMail(mailOptions);
    return {
      result: 'Success：' + response.messageId
    };
  } catch (error) {
    return {
      result: 'Error sending email:' + error
    };
  }
};

export default main;
