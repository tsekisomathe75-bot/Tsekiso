import Icon from "../components/Icon";
const LOW_STOCK = 2; // fewer than 2 copies = low

export default function Dashboard({ books }) {
  const lowCount = books.filter((b) => b.quantity < LOW_STOCK).length;

  return (
    <section>
      <h2><Icon name="dashboard" /> Dashboard</h2>
      <p>{books.length} titles in the library. {lowCount > 0 ? `${lowCount} need restocking.` : "All titles are well stocked."}</p>
      {books.length === 0 ? (
        <p className="empty">No books yet. Add your first book on the Books page.</p>
      ) : (
        <div className="grid">
          {books.map((b) => (
            <article key={b.id} className={"card" + (b.quantity < LOW_STOCK ? " low" : "")}>
              <h3>{b.title}</h3>
              <p>{b.author} · {b.genre}</p>
              <p className="isbn">ISBN {b.isbn}</p>
              <strong>{b.quantity} in stock</strong>
              {b.quantity < LOW_STOCK && <span className="tag">Low stock</span>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
