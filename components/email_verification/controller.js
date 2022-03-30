import EmailVerificationService from "./service.js";


const EmailVerificationController = {
    verifyEmail: async (req, res)=>{
        try{
            const {hash} = req.params;
            await EmailVerificationService.activateUserAccount(hash);
            res.status(200).end("account activated");
        }catch(e){
            res.status(404).end("something went wrong");
        }
      

    }
};

export default EmailVerificationController;