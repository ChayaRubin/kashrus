# מדריך פריסה - חיבור Prisma ל-Clever Cloud

## סקירה כללית
הפרויקט שלך משתמש ב-Prisma עם PostgreSQL. כדי לחבר את Prisma ל-Clever Cloud, צריך להגדיר את `DATABASE_URL` ב-Render.

## שלבים לחיבור Prisma ל-Clever Cloud

### 1. קבלת Connection String מ-Clever Cloud

1. היכנס ל-Clever Cloud Dashboard
2. בחר את ה-PostgreSQL database שלך
3. לחץ על "Environment variables" או "Connection strings"
4. העתק את ה-Connection String (נראה כך):
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

### 2. הגדרת DATABASE_URL ב-Render

1. היכנס ל-Render Dashboard
2. בחר את ה-Web Service שלך (השרת)
3. לחץ על "Environment" בתפריט הצד
4. הוסף משתנה סביבה חדש:
   - **Key**: `DATABASE_URL`
   - **Value**: הדבק את ה-Connection String מ-Clever Cloud
5. שמור את השינויים

### 3. הרצת Migrations ב-Render

כדי ש-Prisma יעבוד נכון, צריך להריץ migrations בעת הפריסה.

#### אופציה 1: הוספת Build Command (מומלץ)

ב-Render, בעת יצירת/עריכת ה-Web Service:

1. בחר "Build Command":
   ```bash
   npm install && npm run db:generate && npm run db:migrate deploy
   ```

2. בחר "Start Command":
   ```bash
   npm start
   ```

#### אופציה 2: הוספת Script ב-package.json

אם עדיין לא קיים, הוסף ל-`server/package.json`:

```json
{
  "scripts": {
    "deploy": "prisma migrate deploy --schema=../db/prisma/schema.prisma",
    "postinstall": "prisma generate --schema=../db/prisma/schema.prisma && prisma migrate deploy --schema=../db/prisma/schema.prisma"
  }
}
```

### 4. הגדרת משתני סביבה נוספים

**חובה להגדיר ב-Render:**

- `DATABASE_URL` - Connection String מ-Clever Cloud (כבר הגדרנו)
- `FRONTEND_URL` - כתובת ה-frontend (Netlify), למשל: `https://your-app.netlify.app`
- `JWT_SECRET` - מפתח להצפנת JWT (צור מפתח אקראי חזק)
- `PORT` - Render מגדיר את זה אוטומטית, אבל אם צריך - השאר ריק או `5000`

**אופציונלי (תלוי בפיצ'רים שפעילים):**

- `EMAIL_USER` - כתובת אימייל לשליחת הודעות
- `EMAIL_PASS` - סיסמת האימייל
- `COMPANY_EMAIL` - כתובת אימייל של החברה
- `CLOUDINARY_CLOUD_NAME` - אם משתמש ב-Cloudinary להעלאת תמונות
- `CLOUDINARY_API_KEY` - API Key של Cloudinary
- `CLOUDINARY_API_SECRET` - API Secret של Cloudinary
- `GOOGLE_CLIENT_ID` - אם משתמש ב-Google OAuth (כרגע מושבת)
- `GOOGLE_CLIENT_SECRET` - אם משתמש ב-Google OAuth (כרגע מושבת)

**איך ליצור JWT_SECRET:**
```bash
# ב-Terminal, הרץ:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
העתק את התוצאה והדבק ב-Render כ-`JWT_SECRET`.

### 5. בדיקת החיבור

לאחר הפריסה:

1. בדוק את ה-Logs ב-Render - אמור לראות שהחיבור ל-database הצליח
2. נסה לגשת ל-API endpoints שלך
3. אם יש שגיאות, בדוק שה-`DATABASE_URL` נכון וכולל את כל הפרמטרים

## פתרון בעיות נפוצות

### שגיאת "Can't reach database server"
- ודא שה-Connection String נכון
- ודא ש-Clever Cloud מאפשר חיבורים מ-Render (whitelist IPs אם נדרש)

### שגיאת "Migration failed"
- ודא ש-migrations רצים ב-Build Command
- בדוק שה-schema.prisma מעודכן

### שגיאת "Prisma Client not generated"
- ודא ש-`prisma generate` רץ ב-postinstall או ב-Build Command

## מבנה הפרויקט

```
client-site/
├── db/
│   └── prisma/
│       └── schema.prisma    # Schema של Prisma
├── server/
│   ├── src/
│   │   └── lib/
│   │       └── prisma.js    # Prisma Client
│   └── package.json
└── package.json
```

## קישורים שימושיים

- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Clever Cloud PostgreSQL](https://www.clever-cloud.com/doc/addons/postgresql/)
