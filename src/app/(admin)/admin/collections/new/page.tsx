import { CollectionForm } from '../_components/CollectionForm';

export default function NewCollectionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">New Journey</div>
        <h1 className="font-display mt-4 text-[42px] font-light tracking-display text-ink">
          Create <span className="font-display-italic text-champagne-600">Collection.</span>
        </h1>
      </div>
      <CollectionForm />
    </div>
  );
}
