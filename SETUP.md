# Local Setup

## Prerequisites

- Node.js 18+
- MySQL running locally (or a remote connection string)

---

## 1. Clone and install

```bash
git clone https://github.com/krishx06/DropVault.git
cd DropVault

cd backend && npm install
cd ../frontend && npm install
```

---

## 2. Environment variables

Create `backend/.env`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/dropvault"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Database

```bash
cd backend
npx prisma db push
npx prisma generate
```

---

## 4. Run

Backend (port 5000):

```bash
cd backend
npm run dev
```

Frontend (port 5173):

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 5. Tests

```bash
cd backend && npm test
cd frontend && npm test
```

---

## Default roles

Register with `role: "SELLER"` to get a seller account (requires admin approval before the seller dashboard is accessible). Any other registration defaults to `CUSTOMER`.

To create an admin, update a user's role directly in the database or via Prisma Studio:

```bash
cd backend && npx prisma studio
```
