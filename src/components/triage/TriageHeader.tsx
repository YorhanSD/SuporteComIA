import { Headset } from 'lucide-react';

export default function TriageHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Headset className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-base font-extrabold leading-tight text-neutral-900">Triagem de Suporte</p>
            <p className="text-sm leading-normal text-neutral-500">Painel de atendimento</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 sm:inline-flex">
          Operação ao vivo
        </span>
      </div>
    </header>
  );
}
