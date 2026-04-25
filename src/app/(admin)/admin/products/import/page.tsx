'use client';

import { useState, useTransition } from 'react';
import { 
  ChevronLeft, Upload, FileUp, CheckCircle2, 
  AlertCircle, Loader2, Info 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { importProducts } from '../actions';
import { cn } from '@/lib/utils';

export default function ImportPage() {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const onImport = async () => {
    if (!file) return;

    startTransition(async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          const res = await importProducts(text);
          setResults(res);
          if (res.failed === 0) {
            toast.success(`Successfully cataloged ${res.success} heirloom pieces`);
          } else {
            toast.error(`Import completed with ${res.failed} discrepancies`);
          }
        };
        reader.readAsText(file);
      } catch (error) {
        toast.error('An error occurred during the import process');
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin/products" className="h-10 w-10 rounded-full border border-ink/5 bg-white flex items-center justify-center text-ink/40 hover:text-ink transition-colors shadow-sm">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-[32px] font-medium text-ink">Bulk Acquisition</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Importing multiple pieces to the archive</p>
        </div>
      </div>

      <div className="grid gap-8">
        <section className="rounded-[32px] border border-ink/5 bg-white p-12 shadow-sm flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20 mb-6">
            <Upload size={32} />
          </div>
          <h2 className="font-display text-[24px] font-medium text-ink mb-2">Upload Collection CSV</h2>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 max-w-sm mb-8">
            Ensure your file follows the atelier's standardized formatting for seamless cataloging.
          </p>

          <div className="w-full max-w-md">
            <label className={cn(
              "relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[24px] cursor-pointer transition-all",
              file ? "border-jade/20 bg-jade/5" : "border-ink/5 bg-ivory-2/20 hover:bg-ivory-2/40"
            )}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className={cn("w-8 h-8 mb-3", file ? "text-jade" : "text-ink/20")} />
                <p className="mb-2 text-sm font-mono uppercase tracking-widest text-ink">
                  {file ? file.name : <span className="text-ink/40">Click to select or drag & drop</span>}
                </p>
                <p className="text-[10px] font-mono text-ink/30 uppercase tracking-widest">CSV (max. 10MB)</p>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={onFileChange} disabled={isPending} />
            </label>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={onImport}
              disabled={!file || isPending}
              className="flex items-center gap-3 px-12 py-4 rounded-full bg-ink text-ivory font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Cataloging Pieces...
                </>
              ) : (
                'Initiate Import'
              )}
            </button>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40">
              <Info size={12} /> Format: Title, Subtitle, Description, SKU, Material, Price, CompareAtPrice, Images, VariantTitle, VariantSKU, VariantPrice, VariantStock
            </p>
          </div>
        </section>

        {results && (
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-display text-[20px] font-medium text-ink mb-6">Import Summary</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-[24px] bg-jade/5 border border-jade/10">
                <div className="flex items-center gap-3 text-jade mb-2">
                  <CheckCircle2 size={20} />
                  <span className="font-mono text-[11px] uppercase tracking-widest font-medium">Archived</span>
                </div>
                <div className="font-display text-[32px] text-jade">{results.success}</div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-jade/60">Pieces successfully added</p>
              </div>
              <div className={cn(
                "p-6 rounded-[24px]",
                results.failed > 0 ? "bg-oxblood/5 border border-oxblood/10" : "bg-ivory-2 border border-ink/5"
              )}>
                <div className={cn("flex items-center gap-3 mb-2", results.failed > 0 ? "text-oxblood" : "text-ink/20")}>
                  <AlertCircle size={20} />
                  <span className="font-mono text-[11px] uppercase tracking-widest font-medium">Discrepancies</span>
                </div>
                <div className={cn("font-display text-[32px]", results.failed > 0 ? "text-oxblood" : "text-ink/20")}>
                  {results.failed}
                </div>
                <p className={cn("font-mono text-[10px] uppercase tracking-widest", results.failed > 0 ? "text-oxblood/60" : "text-ink/20")}>
                  Entries requiring refinement
                </p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Error Log</h4>
                <div className="max-h-60 overflow-y-auto rounded-[20px] bg-oxblood/[0.02] border border-oxblood/5 p-4 space-y-2">
                  {results.errors.map((error, i) => (
                    <div key={i} className="font-mono text-[11px] text-oxblood/70 flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
