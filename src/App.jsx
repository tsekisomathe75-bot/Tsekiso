import { Routes, Route, Navigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";
import Brand from "./components/Brand";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

const seedUsers = [
  { id: 1, name: "Head Librarian", username: "chere", membershipId: "ADMIN", role: "admin", password: "12345" },
];

export default function App() {
  const [books, setBooks] = useLocalStorage("lib_books", []);
  const [users, setUsers] = useLocalStorage("lib_users", seedUsers);
  const [transactions, setTransactions] = useLocalStorage("lib_transactions", []);
  const [currentUser, setCurrentUser] = useLocalStorage("lib_current_user", null, window.sessionStorage);
  // counts every registration so member IDs are in order and never reused
  const [memberCount, setMemberCount] = useLocalStorage("lib_member_count", 0);

  // ---------- Books ----------
  const addBook = (book) => setBooks([...books, { ...book, id: Date.now() }]);
  const updateBook = (id, data) => setBooks(books.map((b) => (b.id === id ? { ...b, ...data } : b)));
  const deleteBook = (id) => setBooks(books.filter((b) => b.id !== id));

  // ---------- Transactions: type is "add", "borrow" or "return" ----------
  // returns an error message (string) or null if everything worked
  const recordTransaction = (bookId, type, qty) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return "Please choose a book.";
    if (type === "borrow" && qty > book.quantity) return `Only ${book.quantity} copies in stock.`;
    // borrowing takes copies out, adding and returning put copies back
    const newQty = type === "borrow" ? book.quantity - qty : book.quantity + qty;
    updateBook(bookId, { quantity: newQty });
    setTransactions([
      ...transactions,
      {
        id: Date.now(), bookId, title: book.title, type, qty,
        userId: currentUser.id, by: currentUser.name, date: new Date().toLocaleString(),
      },
    ]);
    return null;
  };

  // ---------- Users ----------
  const addUser = (u) => {
    const number = memberCount + 1;
    setMemberCount(number);
    // member ID is made automatically: MEM001, MEM002, MEM003 ...
    const newUser = { ...u, id: Date.now(), membershipId: "MEM" + String(number).padStart(3, "0") };
    setUsers([...users, newUser]);
    return newUser; // returned so registration can log the new user in
  };
  const updateUser = (id, data) => setUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
  const deleteUser = (id) => setUsers(users.filter((u) => u.id !== id));

  const guard = (page) => (currentUser ? page : <Navigate to="/users" />);

  return (
    <div className={currentUser ? "layout" : "layout solo"}>
      {currentUser && <Navbar currentUser={currentUser} />}
      <main className="container">
        {!currentUser && <h1 className="auth-title"><Brand /></h1>}
        <Routes>
          <Route path="/" element={guard(<Dashboard books={books} />)} />
          <Route
            path="/books"
            element={guard(<Books books={books} addBook={addBook} updateBook={updateBook} deleteBook={deleteBook} currentUser={currentUser} />)}
          />
          <Route
            path="/transactions"
            element={guard(<Transactions books={books} transactions={transactions} recordTransaction={recordTransaction} currentUser={currentUser} />)}
          />
          <Route path="/profile" element={guard(<Profile currentUser={currentUser} onLogout={() => setCurrentUser(null)} />)} />
          <Route
            path="/users"
            element={
              <Users users={users} currentUser={currentUser} setCurrentUser={setCurrentUser}
                addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
