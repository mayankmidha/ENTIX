'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Save, Trash2, ImagePlus, 
  Sparkles, Info, Globe, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ImageUpload } from './ImageUpload';
import { cn, slugify } from '@/lib/utils';
import { createProduct, updateProduct, deleteProduct } from '@/app/(admin)/admin/products/actions';

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>(initialData?.images.map((i: any) => i.url) || []);
  const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [relatedProducts, setRelatedProducts] = useState<string[]>(initialData?.relatedProducts || []);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    priceInr: initialData?.priceInr || 0,
    compareAtInr: initialData?.compareAtInr || 0,
    sku: initialData?.sku || '',
    material: initialData?.material || '',
    occasion: initialData?.occasion || '',
    isActive: initialData?.isActive ?? true,
    isBestseller: initialData?.isBestseller ?? false,
    isNewArrival: initialData?.isNewArrival ?? false,
  });

  const addVariant = () => {
    setVariants([...variants, { title: '', sku: '', priceInr: formData.priceInr, stockQty: 0, compareAtInr: 0, barcode: '', weight: 0, dimensions: '' }]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addRelatedProduct = () => {
    setRelatedProducts([...relatedProducts, '']);
  };

  const updateRelatedProduct = (index: number, value: string) => {
    const newRelatedProducts = [...relatedProducts];
    newRelatedProducts[index] = value;
    setRelatedProducts(newRelatedProducts);
  };

  const removeRelatedProduct = (index: number) => {
    setRelatedProducts(relatedProducts.filter((_, i) => i !== index));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('At least one atelier photo is required');

    startTransition(async () => {
      try {
        const payload = { ...formData, images, variants, seoTitle, seoDescription, relatedProducts };
        if (initialData) {
          await updateProduct(initialData.id, payload);
          toast.success('Piece details refined');
        } else {
          await createProduct(payload);
          toast.success('New heirloom added to collection');
        }
        router.push('/admin/products');
        router.refresh();
      } catch (error) {
        toast.error('An error occurred in the atelier');
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="h-10 w-10 rounded-full border border-ink/5 bg-white flex items-center justify-center text-ink/40 hover:text-ink transition-colors shadow-sm">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-[32px] font-medium text-ink">
              {initialData ? 'Refine Selection' : 'New Acquisition'}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Cataloging a unique heirloom piece</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {initialData && (
            <button 
              type="button" 
              onClick={() => {
                if (confirm('Are you sure you wish to remove this piece from the atelier?')) {
                  startTransition(async () => {
                    await deleteProduct(initialData.id);
                    router.push('/admin/products');
                  });
                }
              }}
              className="px-6 py-3 rounded-full border border-oxblood/10 text-oxblood font-mono text-[10px] uppercase tracking-widest hover:bg-oxblood/5 transition-all"
            >
              Exhaust
            </button>
          )}
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95 disabled:opacity-50"
          >
            <Save size={14} /> {initialData ? 'Update Archive' : 'Add to Collection'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-display text-[22px] font-medium tracking-display text-ink mb-8">Acquisition Details</h2>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 group-focus-within:text-ink transition-colors">Piece Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Polki Cascade Choker"
                  className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 font-display text-[20px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                />
              </div>
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 group-focus-within:text-ink transition-colors">Brief Narrative</label>
                <input 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. A study in weightless light and champagne gold"
                  className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                />
              </div>
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 group-focus-within:text-ink transition-colors">Atelier Description</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="The story behind the piece, the craft, and the materials..."
                  className="w-full bg-ivory-2/40 border-none rounded-[24px] p-6 font-mono text-[13px] leading-relaxed focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Product Variants */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[22px] font-medium tracking-display text-ink">Product Variants</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">Sizes, colors, or material variations</p>
              </div>
              <button 
                type="button" 
                onClick={addVariant}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink/10 font-mono text-[10px] uppercase tracking-widest hover:bg-ivory-2 transition-all"
              >
                <Sparkles size={12} /> Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-ink/5 rounded-[24px] flex flex-col items-center justify-center text-ink/20">
                  <Info size={24} className="mb-2" />
                  <p className="font-mono text-[10px] uppercase tracking-widest">No variants defined for this piece</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-6 bg-ivory-2/40 rounded-[24px] relative group">
                      <div className="col-span-3">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Title</label>
                        <input 
                          value={variant.title}
                          onChange={(e) => updateVariant(index, 'title', e.target.value)}
                          placeholder="e.g. Size 12 / Rose Gold"
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">SKU</label>
                        <input 
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          placeholder="SKU-VAR-1"
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none uppercase"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Price (INR)</label>
                        <input 
                          type="number"
                          value={variant.priceInr}
                          onChange={(e) => updateVariant(index, 'priceInr', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Compare At</label>
                        <input 
                          type="number"
                          value={variant.compareAtInr}
                          onChange={(e) => updateVariant(index, 'compareAtInr', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Stock Qty</label>
                        <input 
                          type="number"
                          value={variant.stockQty}
                          onChange={(e) => updateVariant(index, 'stockQty', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Barcode</label>
                        <input 
                          value={variant.barcode}
                          onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                          placeholder="BARCODE"
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none uppercase"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Weight (gm)</label>
                        <input 
                          type="number"
                          value={variant.weight}
                          onChange={(e) => updateVariant(index, 'weight', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <div className="col-span-6">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Dimensions (cm)</label>
                        <input 
                          value={variant.dimensions}
                          onChange={(e) => updateVariant(index, 'dimensions', e.target.value)}
                          placeholder="L x W x H"
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-ink/40 hover:text-oxblood"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Media Section */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-display text-[22px] font-medium tracking-display text-ink mb-2">Visual Showcase</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mb-8">High-fidelity atelier photography</p>
            <ImageUpload 
              value={images}
              onChange={(urls) => setImages(urls)}
              onRemove={(url) => setImages(images.filter(i => i !== url))}
            />
          </section>
        </div>

        <div className="space-y-8">
          {/* Pricing Section */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6 text-center">Market Valuation</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Retail Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink/20">₹</span>
                  <input 
                    type="number"
                    required
                    value={formData.priceInr}
                    onChange={(e) => setFormData({ ...formData, priceInr: parseInt(e.target.value) || 0 })}
                    className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 pl-10 font-mono text-[16px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Comparison Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink/20">₹</span>
                  <input 
                    type="number"
                    value={formData.compareAtInr}
                    onChange={(e) => setFormData({ ...formData, compareAtInr: parseInt(e.target.value) || 0 })}
                    className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 pl-10 font-mono text-[16px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-ink/5 flex items-center justify-between text-jade/60 italic font-mono text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} /> Tax follows checkout settings
              </div>
            </div>
          </section>

          {/* Inventory & Status */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6 text-center">Atelier Tracking</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Unique SKU</label>
                <input 
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="EN-CH-001"
                  className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 font-mono text-[14px] focus:ring-1 focus:ring-ink/10 outline-none transition-all uppercase"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Core Material</label>
                <select 
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 font-mono text-[12px] uppercase tracking-widest focus:ring-1 focus:ring-ink/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Material</option>
                  <option value="Gold Vermeil">Gold Vermeil</option>
                  <option value="Sterling Silver">Sterling Silver</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-ink/5">
                <Toggle 
                  label="Visible in Boutique" 
                  description="Product will be shoppable live"
                  active={formData.isActive}
                  onChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
                />
                <Toggle 
                  label="Featured Bestseller" 
                  description="Highlight in homepage editorial"
                  active={formData.isBestseller}
                  onChange={() => setFormData({ ...formData, isBestseller: !formData.isBestseller })}
                />
                <Toggle 
                  label="New Arrival" 
                  description="Add 'New' badge and sort first"
                  active={formData.isNewArrival}
                  onChange={() => setFormData({ ...formData, isNewArrival: !formData.isNewArrival })}
                />
              </div>
            </div>
          </section>

          {/* SEO & Discovery */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-display text-[22px] font-medium tracking-display text-ink mb-8">Search & Discovery</h2>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 group-focus-within:text-ink transition-colors">SEO Title</label>
                <input 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Polki Cascade Choker | Luxury Jewellery"
                  className="w-full bg-ivory-2/40 border-none rounded-[20px] p-4 font-mono text-[13px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                />
              </div>
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 group-focus-within:text-ink transition-colors">SEO Description</label>
                <textarea 
                  rows={4}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Describe the piece for search engines..."
                  className="w-full bg-ivory-2/40 border-none rounded-[24px] p-6 font-mono text-[13px] leading-relaxed focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Related Products */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[22px] font-medium tracking-display text-ink">Related Pieces</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">Suggest complementary items</p>
              </div>
              <button 
                type="button" 
                onClick={addRelatedProduct}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink/10 font-mono text-[10px] uppercase tracking-widest hover:bg-ivory-2 transition-all"
              >
                <Sparkles size={12} /> Add Related
              </button>
            </div>
            
            <div className="space-y-4">
              {relatedProducts.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-ink/5 rounded-[24px] flex flex-col items-center justify-center text-ink/20">
                  <Info size={24} className="mb-2" />
                  <p className="font-mono text-[10px] uppercase tracking-widest">No related pieces defined</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {relatedProducts.map((productId, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-ivory-2/40 rounded-[20px] relative group">
                      <div className="col-span-10">
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Product ID or Title</label>
                        <input 
                          value={productId}
                          onChange={(e) => updateRelatedProduct(index, e.target.value)}
                          placeholder="Product ID or search by title"
                          className="w-full bg-white border-none rounded-[12px] p-3 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeRelatedProduct(index)}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity text-ink/40 hover:text-oxblood"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

function Toggle({ label, description, active, onChange }: { label: string, description: string, active: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-mono text-[11px] font-medium text-ink uppercase tracking-widest">{label}</div>
        <div className="font-mono text-[9px] text-ink/40 uppercase tracking-caps">{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
          active ? "bg-jade" : "bg-ink/10"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
            active ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
