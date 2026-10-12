import Icon from "../components/Icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";

// Older saved accounts have no username, so fall back to their old membershipId
const loginName = (u) => (u.username || u.membershipId).toLowerCase();

export default function Users({ users, currentUser, setCurrentUser, addUser, updateUser, deleteUser }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState(""); // shown on the login page after registering
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const usernameTaken = (name, exceptId) =>
    users.some((u) => u.id !== exceptId && loginName(u) === name.trim().toLowerCase());

  // Login uses the USERNAME (not the member ID)
  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find((u) => loginName(u) === loginId.trim().toLowerCase() && u.password === loginPass);
    if (!found) return setAuthError("Wrong username or password.");
    setCurrentUser(found);
    navigate("/"); // dashboard
  };

  // Register: name, username, password. The member ID is created automatically.
  const handleRegister = (data) => {
    if (usernameTaken(data.username)) {
      setAuthError("That username is already taken.");
      return false;
    }
    addUser({ ...data, username: data.username.trim(), role: "member" });
    // do NOT log in automatically: go back to the login page instead
    setAuthError("");
    setLoginId(data.username.trim());
    setLoginPass("");
    setNotice(`Account created for ${data.name}. Please log in.`);
    setMode("login");
  };

  // ---- Not logged in ----
  if (!currentUser) {
    return (
      <section>
        <h2>{mode === "login" ? "Log in" : "Register"}</h2>
        {authError && <p className="error">{authError}</p>}
        {notice && <p className="notice">{notice}</p>}
        {mode === "login" ? (
          <form className="form" onSubmit={handleLogin}>
            <label>Username
              <input value={loginId} onChange={(e) => setLoginId(e.target.value)} />
            </label>
            <label>Password
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
            </label>
            <button className="btn primary" type="submit">Log in</button>
          </form>
        ) : (
          <UserForm hideRole submitLabel="Create account" onSubmit={handleRegister} />
        )}
        <p>
          {mode === "login" ? "No account yet? " : "Already registered? "}
          <button className="btn small" onClick={() => { setAuthError(""); setNotice(""); setMode(mode === "login" ? "register" : "login"); }}>
            {mode === "login" ? "Register" : "Back to log in"}
          </button>
        </p>
      </section>
    );
  }

  if (currentUser.role !== "admin") {
    return <section><h2>Users</h2><p>Only admins can manage users.</p></section>;
  }

  const handleAdd = (data) => {
    if (usernameTaken(data.username)) {
      setMessage("That username is already taken.");
      return false;
    }
    const created = addUser({ ...data, username: data.username.trim() });
    setMessage(`Added ${created.name} (${created.membershipId}).`);
  };

  const handleUpdate = (id, data) => {
    if (usernameTaken(data.username, id)) return setMessage("That username is already taken.");
    updateUser(id, data);
    if (id === currentUser.id) setCurrentUser({ ...currentUser, ...data });
    setEditingId(null);
    setMessage(`Updated ${data.name}.`);
  };

  const handleDelete = (u) => {
    if (u.id === currentUser.id) return setMessage("You cannot delete the account you are using.");
    if (window.confirm(`Delete ${u.name}?`)) {
      deleteUser(u.id);
      setMessage(`Deleted ${u.name}.`);
    }
  };

  return (
    <section>
      <h2><Icon name="users" /> User management ({users.length} users)</h2>
      {message && <p className="notice">{message}</p>}
      <h3>Add a user</h3>
      <UserForm submitLabel="Add user" onSubmit={handleAdd} />
      <h3>All users</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Member ID</th><th>Name</th><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) =>
              editingId === u.id ? (
                <tr key={u.id}>
                  <td colSpan="5">
                    <UserForm initial={u} submitLabel="Save changes"
                      onSubmit={(data) => handleUpdate(u.id, data)} onCancel={() => setEditingId(null)} />
                  </td>
                </tr>
              ) : (
                <tr key={u.id}>
                  <td>{u.membershipId}</td><td>{u.name}</td><td>{u.username || u.membershipId}</td><td>{u.role}</td>
                  <td className="row">
                    <button className="btn small" onClick={() => setEditingId(u.id)}><Icon name="edit" size={14} /> Update</button>
                    <button className="btn small danger" onClick={() => handleDelete(u)}><Icon name="trash" size={14} /> Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
