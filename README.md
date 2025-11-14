# Employee Management System (React + Vite)

Live demo: https://employee-frontend-mauve.vercel.app/

GitHub: https://github.com/RamGopal9491/employee-frontend

A lightweight Employee Management frontend built using React + Vite. This repository contains the UI for:

- Authentication (Sign Up / Sign In)
- Employee management (List, Add, Edit, Delete, View)
- Department dropdowns
- Leave application UI (client-side persistence in localStorage)

The frontend is intended to work with a Spring Boot backend (expected by default at `http://localhost:8083`).

---

## Tech stack

- Frontend: React (Vite)
- HTTP client: axios
- Styling: plain CSS files (per-component)
- Browser storage: `localStorage` for auth and some UI state

---

## Quick start (frontend)

1. Open a terminal in the project root `employee-management`.
2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run dev
```

4. Open the URL shown by Vite (usually `http://localhost:5173`).

Make sure the backend is running (Spring Boot) and available at the configured API URL.

---

## Configuration / Environment

Create a `.env` file in the project root (same folder as `package.json`) with the backend base URL:

```
VITE_API_URL=http://localhost:8083
```

The frontend reads `import.meta.env.VITE_API_URL` in several components. Adjust the value if your backend runs on a different host/port.

---

## LocalStorage keys used

- `token` — JWT token returned from sign-in
- `user` — user object (JSON string)
- `leavesData` — array of leave applications saved client-side

---

## Expected backend endpoints

The frontend expects the backend to expose these endpoints (base = `VITE_API_URL`):

- Auth
  - `POST /users/signin` — sign in; returns JSON with token and user
  - `POST /users/signup` — sign up / create user
- Employees
  - `GET  /api/employees` — list employees
  - `POST /api/employees` — add employee
  - `PUT  /api/employees/{id}` — update employee
  - `DELETE /api/employees/{id}` — delete employee
- Departments
  - `GET /api/departments` — list departments for dropdowns

If your backend uses different paths (for example `/users` vs `/api/employees`), update the frontend files accordingly (see `Addemployee.jsx`, `Employees.jsx`, etc.).

---

## Common issues & troubleshooting

- Employee list shows empty:
  - Verify `GET /api/employees` returns a JSON array (use browser/Postman).
  - Open DevTools → Network and check the GET request/response and status.
  - Ensure `VITE_API_URL` is correct and matches backend host/port.

- New employee saved but not visible:
  - Ensure the Add Employee form `POST` address matches the list `GET` address (both should point to `/api/employees` by convention).
  - The `Employees.jsx` component should fetch the list on mount — make sure `axios.get` is called and `setEmployees(res.data)` is used.

- CORS errors:
  - Allow the frontend origin (for dev: `http://localhost:5173`) in the Spring Boot CORS config.

- Fullname not sent to backend:
  - Backend may expect `fullname` (lowercase). Frontend previously used `fullName`. If the backend prints `U.getFullname()` but receives `undefined`, send `fullname` in the payload: `{ fullname: fullName, email, password, role }`.

---

## Code tips / recommendations

- Attach JWT automatically with axios interceptor in a central file (example):

```js
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;
```

- Use `useLocation` (React Router) in list pages to trigger refetch after navigation back from add/edit pages.
- Initialize client state from `localStorage` on mount and write back on changes to keep persistence across reloads.

---

## Project structure (frontend)

- `src/`
  - `Addemployee.jsx` — add employee form
  - `Employees.jsx` — list / edit / view employees
  - `SignUp.jsx` / `SignIn.jsx` — authentication
  - `Leave.jsx` — leave apply UI (uses `localStorage`)
  - `assets/`, `*.css`, `main.jsx`, `App.jsx`

---

## Deployment

This project is deployed to Vercel at: https://employee-frontend-mauve.vercel.app/

When deploying, set the `VITE_API_URL` environment variable in Vercel to point to your production backend.

---

## Links

- Live demo: https://employee-frontend-mauve.vercel.app/
- GitHub: https://github.com/RamGopal9491/employee-frontend

---

If you'd like, I can:

- Add a `.env.example` file and update the repo with it.
- Patch `Addemployee.jsx` and `Employees.jsx` to ensure both use the same employee endpoint and re-fetch after add/update.
- Add an axios helper with interceptors and replace imports where appropriate.

Report bugs or request specific patches and I will apply them.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
