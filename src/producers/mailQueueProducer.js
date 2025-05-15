
import '../processors/mailProcessor.js'

import mailQueue from "../queues/mailQueue.js"

export const addEmailToMailQueue= async (emailData)=>{
    console.log("Initiating email sending process.")
    try{
         await mailQueue.add(emailData);
         console.log("Mail added to the queue.")

    }catch(error){
        console.log(error,"Error comes from add mail to queue.")
        throw error
    }

}