'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function EventButton({ 
  id, 
  lang, 
  text, 
  className 
}: { 
  id: number; 
  lang: string; 
  text: string; 
  className: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Procura o contêiner principal e rola até ele de forma suave
    const topElement = document.getElementById('main-event') || document.body;
    topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Delay um pouco maior para garantir que a rolagem termine antes
    // da troca de componentes na tela
    setTimeout(() => {
      startTransition(() => {
        router.push(`/${lang}/events?id=${id}`, { scroll: false });
      });
    }, 600);
  };

  return (
    <button 
      onClick={handleClick} 
      className={className} 
      disabled={isPending}
      style={{ opacity: isPending ? 0.6 : 1, cursor: isPending ? 'wait' : 'pointer' }}
    >
      {isPending ? '...' : text}
    </button>
  );
}
