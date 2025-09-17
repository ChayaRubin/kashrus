export const contactTemplate = ({ name, email, subject, message }) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #2e7d32; text-align: center;">📬 New Contact Request Received</h2>
      <hr />
      <p><strong>Full Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f1f1f1; padding: 15px;">${message.replace(/\n/g, '<br>')}</div>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">Sent automatically from the website</p>
    </div>
  </div>
`;

export const meetingRequestTemplate = ({ full_name, email, formattedDate }) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #1565c0; text-align: center;">📩 New Meeting Request</h2>
      <hr />
      <p><strong>Full Name:</strong> ${full_name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Date and Time:</strong> ${formattedDate}</p>
      <p style="margin-top: 30px;">Please log into the system to approve or reject the request.</p>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">Sent automatically from the meeting system</p>
    </div>
  </div>
`;

export const meetingCanceledTemplate = ({ full_name, email, formattedDate }) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #d32f2f; text-align: center;">❌ Meeting Canceled</h2>
      <hr />
      <p><strong>Name:</strong> ${full_name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Date and Time:</strong> ${formattedDate}</p>
      <p style="margin-top: 30px;">The above meeting has been canceled. For more information, please log into the system.</p>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">Sent automatically from the meeting system</p>
    </div>
  </div>
`;

export const addRestaurantRequestTemplate = ({
  requesterName,
  requesterEmail,
  restaurantName,
  city,
  address,
  phone,
  website,
  kashrus,
  details,
  hasImages,
  imageCount,
}) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 700px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #2e7d32; text-align: center;">📝 Request to Add a Restaurant</h2>
      <hr />
      <h3 style="margin-top: 0;">Restaurant Details</h3>
      <p><strong>Restaurant Name:</strong> ${restaurantName}</p>
      ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
      ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${website ? `<p><strong>Website:</strong> <a href="${website}">${website}</a></p>` : ''}
      ${kashrus ? `<p><strong>Kashrus:</strong> ${kashrus}</p>` : ''}
      ${details ? `<div><strong>Additional Details:</strong><div style="background:#f1f1f1; padding:12px; border-radius:8px;">${details.replace(/\n/g, '<br>')}</div></div>` : ''}
      ${hasImages ? `<p><strong>📷 Images:</strong> ${imageCount} image${imageCount > 1 ? 's' : ''} attached to this email</p>` : ''}
      <hr />
      <h3 style="margin-top: 0;">Requester Details</h3>
      <p><strong>Name:</strong> ${requesterName}</p>
      <p><strong>Email:</strong> <a href="mailto:${requesterEmail}">${requesterEmail}</a></p>
    </div>
  </div>
`;

export const questionTemplate = ({ name, email, subject, message, hasImages, imageCount }) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #1565c0; text-align: center;">❓ New Question from the Website</h2>
      <hr />
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius:8px;">${message.replace(/\n/g, '<br>')}</div>
      ${hasImages ? `<p><strong>📷 Images:</strong> ${imageCount} image${imageCount > 1 ? 's' : ''} attached to this email</p>` : ''}
    </div>
  </div>
`;

export const feedbackTemplate = ({ userName, restaurantId, message }) => `
  <div style="direction: ltr; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #2e7d32; text-align: center;">💬 New Feedback Received</h2>
      <hr />
      <p><strong>User:</strong> ${userName || "Guest"}</p>
      ${restaurantId ? `<p><strong>Restaurant ID:</strong> ${restaurantId}</p>` : ""}
      <p><strong>Message:</strong></p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius:8px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">
        Sent automatically from the website
      </p>
    </div>
  </div>
`;
