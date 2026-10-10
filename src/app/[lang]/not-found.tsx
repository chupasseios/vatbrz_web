import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="container page-body">
      <div className="empty-state">
        <span className="eyebrow">404 · VATBRZ</span>
        <h1>Fora da rota.</h1>
        <p>Esta página não foi encontrada. / This page could not be found.</p>
        <Link className="button" href="/pt-br">
          Voltar ao início / Home
        </Link>
      </div>
    </main>
  );
}
