# Mathe Community Library Management System

React app (Vite + React Router) for managing books, stock and users. Data is saved in the browser's localStorage.

## Run it
```
npm install
npm run dev
```
Open the link shown in the terminal. First login: **username **chere**, password **12345****.

## Features
- Books: add, update, delete (with validation and duplicate ISBN check)
- Transactions: add stock, deduct stock when borrowed, history log
- Users: login, add/update/delete (admin only)
- Dashboard: card view, low stock (fewer than 2 copies) highlighted

## Structure
- `src/App.jsx` - holds the main state and the routes
- `src/hooks/useLocalStorage.js` - custom hook that saves state to localStorage
- `src/pages/` - Dashboard, Books, Transactions, Users
- `src/components/` - Navbar, BookForm, UserForm (reusable)

## Accounts
- People register on the website with name, username and password.
- A member ID (MEM001, MEM002, ...) is generated automatically in order of registration. It is shown on the Profile page; login uses the username.
- Registering does not log you in: after creating an account you go back to the login page.
- Members only see "Borrow" on the Transactions page; staff see "Borrow (deduct stock)".
