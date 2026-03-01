# הוראות להרצת פקודות Prisma

## מיקום ה-Schema
ה-Prisma schema נמצא ב: `db/prisma/schema.prisma`

## איפה להריץ פקודות Prisma

### אופציה 1: מהתיקייה הראשית (Root) - מומלץ
```bash
# מהתיקייה: C:\Users\Owner\Desktop\client-site
npx prisma db push --schema=db/prisma/schema.prisma
```

### אופציה 2: מתיקיית db
```bash
# מהתיקייה: C:\Users\Owner\Desktop\client-site\db
npx prisma db push --schema=prisma/schema.prisma
```

### אופציה 3: מתיקיית db/prisma
```bash
# מהתיקייה: C:\Users\Owner\Desktop\client-site\db\prisma
npx prisma db push
```

## פקודות Prisma שימושיות

### db push - דוחף את ה-schema ל-database (ללא migrations)
```bash
npx prisma db push --schema=db/prisma/schema.prisma
```

### migrate dev - יוצר migration חדש (לפיתוח)
```bash
npx prisma migrate dev --schema=db/prisma/schema.prisma
```

### migrate deploy - מריץ migrations ב-production
```bash
npx prisma migrate deploy --schema=db/prisma/schema.prisma
```

### generate - מייצר את Prisma Client
```bash
npx prisma generate --schema=db/prisma/schema.prisma
```

### studio - פותח Prisma Studio (GUI)
```bash
npx prisma studio --schema=db/prisma/schema.prisma
```

## חשוב!
לפני הרצת `db push`, ודא ש:
1. ה-`DATABASE_URL` מוגדר ב-`.env` או במשתני הסביבה
2. יש לך גישה ל-database (Clever Cloud)
3. אתה יודע מה אתה עושה - `db push` משנה את ה-database ישירות!

## הבדל בין db push ו-migrate
- **db push**: דוחף שינויים ישירות ל-database (מהיר, לא שומר היסטוריה)
- **migrate**: יוצר migration files (שומר היסטוריה, מומלץ ל-production)
