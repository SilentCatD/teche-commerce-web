import cryptoRandomString from "crypto-random-string";
import transporter from "../../config/mail_transporter.js";
import UserService from "../user/service.js";
import UnactivatedAccount from "./model.js";


const EmailVerificationService = {
  sendVerificationEmail: async (email, userId) => {
    const hash = cryptoRandomString({ length: 128, type: "url-safe" });
    const account = new UnactivatedAccount({userId: userId, hash: hash});
    await account.save();
    await transporter.sendMail({
      from: `"TechEcommerce" <${process.env.SERVICE_MAIL}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "ACCOUNT VERIFICATION", // Subject line
      text: "Click the link bellow to activate your email", // plain text body
      html: `<b>Click this shit: ${process.env.HOST_URL}/api/v1/auth/active/${hash}</b>`, // html body
    });
  },

  activateUserAccount: async (hash) => {
    const na_account = await UnactivatedAccount.findOne({hash: hash});
    if(!na_account){
        throw new Error("Unactivated entries not found");
    }
    const userId = na_account.userId;
    await UserService.activeUserAccount(userId);
    await na_account.remove();
  },
};

export default EmailVerificationService;
