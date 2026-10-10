export default function Loading() {
  return (
    <main id="main-content" className="container page-body" aria-busy="true">
      <div className="empty-state">
        <span className="eyebrow">VATBRZ</span>
        <p role="status">Carregando / Loading…</p>
      </div>
    </main>
  );
}
