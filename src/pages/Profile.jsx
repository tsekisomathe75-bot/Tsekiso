import Icon from "../components/Icon";
export default function Profile({ currentUser, onLogout }) {
  return (
    <section>
      <h2><Icon name="profile" /> My profile</h2>
      <div className="card profile">
        <p><strong>Name:</strong> {currentUser.name}</p>
        <p><strong>Username:</strong> {currentUser.username || currentUser.membershipId}</p>
        <p><strong>Member ID:</strong> {currentUser.membershipId}</p>
        <p><strong>Role:</strong> {currentUser.role}</p>
        <button className="btn danger" onClick={onLogout}><Icon name="logout" size={16} /> Log out</button>
      </div>
    </section>
  );
}
