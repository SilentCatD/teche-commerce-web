import cryptoRandomString from "crypto-random-string";
import transporter from "../../config/mail_transporter.js";
import User from "../user/model.js";
import UserService from "../user/service.js";
import {UnactivatedAccount, ResetPasswordRequest} from "./model.js";


const EmailVerificationService = {

  verifyHasResetPwd: async (hash)=>{
    const request = await ResetPasswordRequest.findOne({hash: hash});
    if(request){
      return true;
    }
    return false;
  },

  verifyHashActiveEmail: async (hash)=>{
    const na_account = await UnactivatedAccount.findOne({hash: hash});
    if(na_account){
      return true;
    }
    return false;

  },

  sendResetPasswordEmail: async (email) => {
    const user = await User.findOne({email: email});
    const hash = cryptoRandomString({ length: 128, type: "url-safe" });
    const request = new ResetPasswordRequest({userId: user.id, hash: hash});
    await request.save();
    await transporter.sendMail({
      from: `"TechEcommerce" <${process.env.SERVICE_MAIL}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "PASSWORD RESET", // Subject line
      text: "Click the link bellow to reset your email, this link will expire after 7 days", // plain text body
      html: `<b>Click this shit: ${process.env.HOST_URL}/reset-password/${hash}</b>`, // html body, should send link to html front end, this is direct api link
    });
  },

  sendVerificationEmail: async (email) => {
    const user = await User.findOne({email: email});
    const hash = cryptoRandomString({ length: 128, type: "url-safe" });
    const account = new UnactivatedAccount({userId: user.id, hash: hash});
    await account.save();
    let res = await transporter.sendMail({
      from: `"TechEcommerce" <${process.env.SERVICE_MAIL}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "ACCOUNT VERIFICATION", // Subject line
      text: "Click the link bellow to activate your email, this link will expire after 7 days", // plain text body
      html: `<b>Click this shit: ${process.env.HOST_URL}/active/${hash}</b>`, // html body, should send link to html front end, this is direct api link
    });
    console.log(res);
  },

  activateUserAccount: async (hash) => {
    try {
    const na_account = await UnactivatedAccount.findOne({hash: hash});
    if(!na_account) {
      throw new Error("Document not found");
    }
    const userId = na_account.userId;
    await UserService.activeUserAccount(userId);
    await na_account.remove();
    await UnactivatedAccount.deleteMany({userId: userId});
  } catch (e) {
    throw e;
  }
  },

  resetUserPassword: async (hash, password)=>{
    try {
    const request = await ResetPasswordRequest.findOne({hash: hash});
    if(!request) {
      throw new Error("Document not found");
    }
    const userId = request.userId;
    await UserService.resetUserPassword(userId, password);
    await request.remove();
    } catch (e) {
      throw e;
    }
  }

};

export default EmailVerificationService;
