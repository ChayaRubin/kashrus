export const contactTemplate = ({ name, email, subject, message }) => `
  <div style="direction: rtl; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #2e7d32; text-align: center;">📬 התקבלה פנייה חדשה</h2>
      <hr />
      <p><strong>שם מלא:</strong> ${name}</p>
      <p><strong>אימייל:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>נושא:</strong> ${subject || 'לא צוין'}</p>
      <p><strong>הודעה:</strong></p>
      <div style="background-color: #f1f1f1; padding: 15px;">${message.replace(/\n/g, '<br>')}</div>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">נשלח אוטומטית מהאתר</p>
    </div>
  </div>
`;

export const meetingRequestTemplate = ({ full_name, email, formattedDate }) => `
  <div style="direction: rtl; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #1565c0; text-align: center;">📩 בקשת פגישה חדשה</h2>
      <hr />
      <p><strong>שם מלא:</strong> ${full_name}</p>
      <p><strong>אימייל:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>תאריך ושעה:</strong> ${formattedDate}</p>
      <p style="margin-top: 30px;">יש להיכנס למערכת לצורך אישור או דחיית הבקשה.</p>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">נשלח אוטומטית ממערכת הפגישות</p>
    </div>
  </div>
`;

export const meetingCanceledTemplate = ({ full_name, email, formattedDate }) => `
  <div style="direction: rtl; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #d32f2f; text-align: center;">❌ פגישה בוטלה</h2>
      <hr />
      <p><strong>שם:</strong> ${full_name}</p>
      <p><strong>אימייל:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>תאריך ושעה:</strong> ${formattedDate}</p>
      <p style="margin-top: 30px;">הפגישה הנ"ל בוטלה. למידע נוסף, ניתן להיכנס למערכת.</p>
      <hr />
      <p style="text-align: center; font-size: 13px; color: #888;">נשלח אוטומטית ממערכת הפגישות</p>
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
}) => `
  <div style="direction: rtl; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 700px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #2e7d32; text-align: center;">📝 בקשה להוספת מסעדה</h2>
      <hr />
      <h3 style="margin-top: 0;">פרטי המסעדה</h3>
      <p><strong>שם מסעדה:</strong> ${restaurantName}</p>
      ${city ? `<p><strong>עיר:</strong> ${city}</p>` : ''}
      ${address ? `<p><strong>כתובת:</strong> ${address}</p>` : ''}
      ${phone ? `<p><strong>טלפון:</strong> ${phone}</p>` : ''}
      ${website ? `<p><strong>אתר:</strong> <a href="${website}">${website}</a></p>` : ''}
      ${kashrus ? `<p><strong>כשרות:</strong> ${kashrus}</p>` : ''}
      ${details ? `<div><strong>פרטים נוספים:</strong><div style="background:#f1f1f1; padding:12px; border-radius:8px;">${details.replace(/\n/g, '<br>')}</div></div>` : ''}
      <hr />
      <h3 style="margin-top: 0;">פרטי הפונה</h3>
      <p><strong>שם הפונה:</strong> ${requesterName}</p>
      <p><strong>אימייל הפונה:</strong> <a href="mailto:${requesterEmail}">${requesterEmail}</a></p>
    </div>
  </div>
`;

export const questionTemplate = ({ name, email, subject, message }) => `
  <div style="direction: rtl; font-family: Arial; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px;">
      <h2 style="color: #1565c0; text-align: center;">❓ שאלה חדשה מהאתר</h2>
      <hr />
      <p><strong>שם:</strong> ${name}</p>
      <p><strong>אימייל:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>נושא:</strong> ${subject || 'לא צוין'}</p>
      <div style="background-color: #f1f1f1; padding: 15px; border-radius:8px;">${message.replace(/\n/g, '<br>')}</div>
    </div>
  </div>
`;


