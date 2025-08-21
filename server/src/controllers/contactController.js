import { sendEmail } from '../utils/email.js';
import { contactTemplate, meetingCanceledTemplate, meetingRequestTemplate } from '../templates/emailTemplates.js';
import { addRestaurantRequestTemplate, questionTemplate } from '../templates/emailTemplates.js';

const contactController = {
  sendContactEmail: async (req, res) => {
    const { type } = req.body || {};

    try {
      if (type === 'add_restaurant') {
        const {
          requesterName,
          requesterEmail,
          restaurantName,
          city,
          address,
          phone,
          website,
          kashrus,
          details,
        } = req.body || {};

        if (!requesterName || !requesterEmail || !restaurantName) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        await sendEmail({
          from: `"Add Restaurant Request" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `New restaurant addition request: ${restaurantName}`,
          html: addRestaurantRequestTemplate({
            requesterName,
            requesterEmail,
            restaurantName,
            city,
            address,
            phone,
            website,
            kashrus,
            details,
          }),
        });

        return res.sendStatus(200);
      }

      // default: general question
      const { name, email, subject, message } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'שדות חסרים' });
      }

      await sendEmail({
        from: `"טופס יצירת קשר" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: subject ? `שאלה חדשה: ${subject}` : `שאלה חדשה מהאתר מאת ${name}`,
        html: questionTemplate({ name, email, subject, message }),
      });

      res.sendStatus(200);
    } catch (err) {
      console.error('contactController error', err);
      res.status(500).json({ error: 'there was an error sending the email' });
    }
  },
};

export default contactController;
