import { sendEmail } from '../utils/email.js';
import { contactTemplate, meetingCanceledTemplate, meetingRequestTemplate } from '../templates/emailTemplates.js';
import { addRestaurantRequestTemplate, questionTemplate } from '../templates/emailTemplates.js';

const contactController = {
  sendContactEmail: async (req, res) => {
    const { type } = req.body || {};
    const images = req.files || [];

    // Debug logging
    console.log('Contact request received:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Type:', type);

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

        console.log('Validation check:');
        console.log('requesterName:', requesterName);
        console.log('requesterEmail:', requesterEmail);
        console.log('restaurantName:', restaurantName);

        if (!requesterName || !requesterEmail || !restaurantName) {
          console.log('Validation failed - missing required fields');
          return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!kashrus || !String(kashrus).trim()) {
          return res.status(400).json({ error: 'Hechsher is required. Please select one from the list.' });
        }

        // Prepare email with attachments if images exist
        const emailOptions = {
          from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
          to: process.env.CONTACT_TO_EMAIL || process.env.EMAIL_REPLY_TO || process.env.RESEND_FROM_EMAIL,
          reply_to: requesterEmail,
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
            hasImages: images.length > 0,
            imageCount: images.length,
          }),
        };

        // Add image attachments if any
        if (images.length > 0) {
          emailOptions.attachments = images.map((file, index) => ({
            filename: `restaurant_image_${index + 1}.${file.originalname.split('.').pop()}`,
            path: file.path,
            cid: `image_${index + 1}` // Content ID for embedding in HTML
          }));
          console.log('Attachments added:', emailOptions.attachments);
        }

        await sendEmail(emailOptions);

        return res.sendStatus(200);
      }

      // default: general question
      const { name, email, subject, message } = req.body || {};
      
      console.log('Question validation check:');
      console.log('name:', name);
      console.log('email:', email);
      console.log('message:', message);
      
      if (!name || !email || !message) {
        console.log('Question validation failed - missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Prepare email with attachments if images exist
      const emailOptions = {
        from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL || process.env.EMAIL_REPLY_TO || process.env.RESEND_FROM_EMAIL,
        reply_to: email,
        subject: subject ? `New Question: ${subject}` : `New Question from Website by ${name}`,
        html: questionTemplate({ 
          name, 
          email, 
          subject, 
          message,
          hasImages: images.length > 0,
          imageCount: images.length,
        }),
      };

      // Add image attachments if any
      if (images.length > 0) {
        emailOptions.attachments = images.map((file, index) => ({
          filename: `question_image_${index + 1}.${file.originalname.split('.').pop()}`,
          path: file.path,
          cid: `image_${index + 1}` // Content ID for embedding in HTML
        }));
        console.log('Question attachments added:', emailOptions.attachments);
      }

      await sendEmail(emailOptions);

      res.sendStatus(200);
    } catch (err) {
      const message = err?.message || 'there was an error sending the email';
      console.error('contactController error', err);
      res.status(500).json({ error: message });
    }
  },
};

export default contactController;
