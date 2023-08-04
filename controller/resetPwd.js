const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.sendEmail = async (req, res, next) => {
    try {
        const sender = {
            email: 'saurabhpawar71100@gmail.com'
        };
        
        const receivers = [
            {
                email: req.body.email
            }
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'reset your password',
            textContent: 'you can reset your password by clicking here.'
        })
        return res.status(200).json({message: 'reset password link sent to your email'});

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error sending email' });
    }
}