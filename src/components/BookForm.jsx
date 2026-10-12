import { useState } from "react";

const empty = { title: "", author: "", genre: "", isbn: "", quantity: "" };

// Reusable form: used for adding a new book AND for editing an existing one
export default function BookForm({ initial = empty, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  // Controlled inputs: the value always comes from state
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Title is required.";
    if (!form.author.trim()) err.author = "Author is required.";
    if (!form.genre.trim()) err.genre = "Genre is required.";
    const digits = String(form.isbn).replace(/-/g, "");
    if (!/^\d{10}(\d{3})?$/.test(digits)) err.isbn = "ISBN must be 10 or 13 digits.";
    const qty = Number(form.quantity);
    if (form.quantity === "" || !Number.isInteger(qty) || qty < 0) err.quantity = "Enter a whole number, 0 or more.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    const ok = onSubmit({ ...form, quantity: Number(form.quantity) });
    if (ok !== false && !onCancel) setForm(empty); // clear the form after adding
  };

  const field = (name, label, type = "text") => (
    <label>
      {label}
      <input name={name} type={type} value={form[name]} onChange={handleChange} min={type === "number" ? 0 : undefined} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </label>
  );

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {field("isbn", "ISBN")}
      {field("genre", "Genre")}
      {field("title", "Title")}
      {field("quantity", "Quantity", "number")}
      {field("author", "Author")}
      <div className="row">
        <button className="btn primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
