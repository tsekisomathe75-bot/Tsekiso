import { useState } from "react";

const empty = { name: "", username: "", role: "member", password: "" };

// Used for registering (hideRole) and for the admin add/update forms.
// The member ID is NOT typed in, it is generated automatically in App.jsx.
export default function UserForm({ initial = empty, submitLabel, onSubmit, onCancel, hideRole }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Name is required.";
    if (!(form.username || "").trim()) err.username = "Username is required.";
    if (form.password.length < 4) err.password = "Password needs at least 4 characters.";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    const ok = onSubmit(form);
    if (ok !== false && !onCancel) setForm(empty);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label>Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>
      <label>Username
        <input name="username" value={form.username || ""} onChange={handleChange} />
        {errors.username && <span className="error">{errors.username}</span>}
      </label>
      {!hideRole && (
        <label>Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      )}
      <label>Password
        <input name="password" type="text" value={form.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>
      <div className="row">
        <button className="btn primary" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
