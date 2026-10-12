import Icon from "../components/Icon";
import { useState } from "react";
import BookForm from "../components/BookForm";

export default function Books({ books, addBook, updateBook, deleteBook, currentUser }) {
  const canManage = currentUser.role !== "member"; // members can only look
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const handleAdd = (data) => {
    const digits = data.isbn.replace(/-/g, "");
    if (books.some((b) => b.isbn.replace(/-/g, "") === digits)) {
      setMessage("A book with this ISBN already exists.");
      return false;
    }
    addBook(data);
    setMessage(`Added "${data.title}".`);
  };

  const handleUpdate = (id, data) => {
    updateBook(id, data);
    setEditingId(null);
    setMessage(`Updated "${data.title}".`);
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"?`)) {
      deleteBook(book.id);
      setMessage(`Deleted "${book.title}".`);
    }
  };

  return (
    <section>
      <h2><Icon name="books" /> Books</h2>
      {message && <p className="notice">{message}</p>}

      {canManage && (
        <>
          <h3>Add a new book</h3>
          <BookForm submitLabel="Add book" onSubmit={handleAdd} />
        </>
      )}

      <h3>All books</h3>
      {books.length === 0 ? (
        <p className="empty">No books yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ISBN</th><th>Genre</th><th>Title</th><th>Qty</th><th>Author</th>{canManage && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {books.map((b) =>
                editingId === b.id ? (
                  <tr key={b.id}>
                    <td colSpan="6">
                      <BookForm
                        initial={b}
                        submitLabel="Save changes"
                        onSubmit={(data) => handleUpdate(b.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={b.id}>
                    <td>{b.isbn}</td><td>{b.genre}</td><td>{b.title}</td><td>{b.quantity}</td><td>{b.author}</td>
                    {canManage && <td className="row">
                      <button className="btn small" onClick={() => setEditingId(b.id)}><Icon name="edit" size={14} /> Update</button>
                      <button className="btn small danger" onClick={() => handleDelete(b)}><Icon name="trash" size={14} /> Delete</button>
                    </td>}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
