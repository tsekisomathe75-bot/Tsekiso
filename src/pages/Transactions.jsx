import Icon from "../components/Icon";
import { useState } from "react";

const labels = { add: "Stock added", borrow: "Borrowed", return: "Returned" };

export default function Transactions({ books, transactions, recordTransaction, currentUser }) {
  const isMember = currentUser.role === "member";
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("borrow");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  // Members only see their own history, admins/librarians see everything
  const mine = transactions.filter((t) => t.userId === currentUser.id);
  const history = isMember ? mine : transactions;

  // Books this user still has = borrowed minus returned
  const outstanding = books
    .map((b) => {
      const sum = (kind) => mine.filter((t) => t.bookId === b.id && t.type === kind).reduce((n, t) => n + t.qty, 0);
      return { book: b, qty: sum("borrow") - sum("return") };
    })
    .filter((o) => o.qty > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(qty);
    if (!bookId) return setError("Please choose a book.");
    if (!Number.isInteger(amount) || amount < 1) return setError("Quantity must be 1 or more.");
    const result = recordTransaction(Number(bookId), type, amount);
    setError(result || "");
    if (!result) setQty(1);
  };

  return (
    <section>
      <h2><Icon name="transactions" /> Transactions</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label>Book
          <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
            <option value="">-- choose a book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>
            ))}
          </select>
        </label>
        <label>Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="borrow">{isMember ? "Borrow" : "Borrow (deduct stock)"}</option>
            {!isMember && <option value="add">Add stock (new arrival)</option>}
          </select>
        </label>
        <label>Quantity
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
        {error && <span className="error">{error}</span>}
        <button className="btn primary" type="submit">Record transaction</button>
      </form>

      {outstanding.length > 0 && (
        <>
          <h3>Books you have borrowed</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Book</th><th>Copies borrowed</th><th></th></tr></thead>
              <tbody>
                {outstanding.map((o) => (
                  <tr key={o.book.id}>
                    <td>{o.book.title}</td>
                    <td>{o.qty}</td>
                    <td><button className="btn small" onClick={() => recordTransaction(o.book.id, "return", 1)}><Icon name="return" size={14} /> Return book</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h3>{isMember ? "My history" : "History (all users)"}</h3>
      {history.length === 0 ? (
        <p className="empty">No transactions recorded yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>User</th></tr></thead>
            <tbody>
              {[...history].reverse().map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td><td>{t.title}</td><td>{labels[t.type]}</td><td>{t.qty}</td><td>{t.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
