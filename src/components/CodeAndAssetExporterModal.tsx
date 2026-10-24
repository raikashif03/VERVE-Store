import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  RotateCcw, 
  FileCode, 
  Terminal,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Product } from '../types';

interface CodeAndAssetExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductImage: (productId: string, newImageUrl: string) => void;
  heroImage: string;
  onUpdateHeroImage: (newHeroUrl: string) => void;
  onResetAllImages: () => void;
}

// Curated built-in studio image presets that the user can immediately select
const PRESET_IMAGES = [
  {
    category: 'Audio & Acoustics',
    name: 'Obsidian Studio Headphones',
    url: '/src/assets/images/product_studio_headphones_1792727416273.jpg',
  },
  {
    category: 'Horology',
    name: 'Titanium Chronometer (Atelier)',
    url: '/src/assets/images/product_mechanical_watch_1792727416074.jpg',
  },
  {
    category: 'Home & Brew',
    name: 'Precision Gooseneck Kettle',
    url: '/src/assets/images/product_artisan_kettle_1792727415831.jpg',
  },
  {
    category: 'Everyday Carry',
    name: 'Nomad Commuter Ballistic Pack',
    url: '/src/assets/images/product_tech_backpack_1792727416582.jpg',
  },
  {
    category: 'Flagship Showroom',
    name: 'Atelier Flagship Collection',
    url: '/src/assets/images/hero_lumen_flagship_1792727414810.jpg',
  },
];

export const CodeAndAssetExporterModal: React.FC<CodeAndAssetExporterModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductImage,
  heroImage,
  onUpdateHeroImage,
  onResetAllImages,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'images' | 'code' | 'json' | 'github'>('images');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customUrlInput, setCustomUrlInput] = useState('');

  const currentSelectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Generate live exportable TypeScript code reflecting the user's selected images
  const generateExportableTypeScript = () => {
    return `import { Product, Order, SavedAddress, SavedPaymentMethod } from '../types';

export const HERO_BANNER_IMAGE = '${heroImage}';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;
  };

  const generateExportableJson = () => {
    return JSON.stringify({
      heroBanner: heroImage,
      catalog: products,
      exportedAt: new Date().toISOString(),
      platform: "VERVE Storefront",
    }, null, 2);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportableTypeScript());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generateExportableJson());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle local file upload (converted to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isHero) {
        onUpdateHeroImage(result);
      } else if (currentSelectedProduct) {
        onUpdateProductImage(currentSelectedProduct.id, result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-7 py-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-slate-950" />
            <div>
              <h2 className="text-base font-extrabold text-slate-950 uppercase tracking-wide">
                Image Manager & Code Exporter Studio
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Select custom project images, upload assets, and export production code for GitHub.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-950 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-7 border-b border-slate-200 flex items-center gap-3 overflow-x-auto text-sm font-bold bg-white">
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'images'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select & Upload Images</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Export `mockData.ts`</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Export Catalog JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Push to GitHub Guide</span>
          </button>

          {/* Quick Reset All */}
          <button
            onClick={onResetAllImages}
            title="Reset all image paths back to default photography"
            className="ml-auto py-1 px-2.5 text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: Image Selector & Uploader */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Top Banner Control */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">
                    Hero Showcase Banner Asset
                  </div>
                  <label className="cursor-pointer px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-800 font-medium flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Hero Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-48 h-24 rounded overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <img
                      src={heroImage}
                      alt="Hero Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="text-slate-500 text-[11px]">Current Hero Banner Path / URL:</div>
                    <div className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 truncate select-all">
                      {heroImage}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Target Selector */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Product List (5 cols) */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Product to Swap Image
                  </label>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setCustomUrlInput('');
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                          selectedProductId === p.id
                            ? 'border-slate-950 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs truncate">{p.name}</div>
                          <div className={`text-[10px] truncate ${selectedProductId === p.id ? 'text-slate-300' : 'text-slate-500'}`}>
                            {p.brand} · ${p.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Swap Controls & Preset Library (7 cols) */}
                <div className="md:col-span-7 bg-slate-50/70 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="font-bold text-slate-950 text-xs">
                      Editing: {currentSelectedProduct.name}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{currentSelectedProduct.id}</span>
                  </div>

                  {/* Active Preview */}
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <img
                        src={currentSelectedProduct.image}
                        alt="Current selection"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="font-semibold text-slate-900">Choose New Image Source:</div>
                      
                      {/* Local File Upload Button */}
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, false)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <label className="block text-[11px] font-medium text-slate-600">
                      Or Paste Image URL / Asset Path:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://... or /src/assets/images/my_photo.jpg"
                        className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <button
                        onClick={() => {
                          if (customUrlInput.trim()) {
                            onUpdateProductImage(currentSelectedProduct.id, customUrlInput.trim());
                            setCustomUrlInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded transition-colors whitespace-nowrap"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>

                  {/* Preset Studio Gallery */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Or Choose Studio Presets:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => onUpdateProductImage(currentSelectedProduct.id, preset.url)}
                          className={`p-1.5 rounded border text-left bg-white hover:border-slate-400 transition-all flex flex-col gap-1 ${
                            currentSelectedProduct.image === preset.url ? 'border-slate-950 ring-1 ring-slate-950' : 'border-slate-200'
                          }`}
                        >
                          <div className="w-full h-14 bg-slate-100 rounded overflow-hidden">
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] font-medium text-slate-900 truncate">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Export TypeScript mockData.ts */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">Export `src/data/mockData.ts`</h3>
                  <p className="text-slate-500 text-xs">
                    This file contains your complete product catalog, hero image, and test orders ready for direct drop-in.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile(generateExportableTypeScript(), 'mockData.ts', 'text/typescript')}
                    className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download mockData.ts</span>
                  </button>
                </div>
              </div>

              {/* Code Display Area */}
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 p-4 font-mono text-xs max-h-96 overflow-y-auto">
                <pre>{generateExportableTypeScript()}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: Export Catalog JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">Export Catalog JSON</h3>
                  <p className="text-slate-500 text-xs">
                    Standard JSON schema with all products, specs, and current image selections for headless CMS or external databases.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded flex items-center gap-1.5 transition-colors border border-slate-200"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile(generateExportableJson(), 'catalog.json', 'application/json')}
                    className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download catalog.json</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-emerald-400 p-4 font-mono text-xs max-h-96 overflow-y-auto">
                <pre>{generateExportableJson()}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Push Instructions */}
          {activeTab === 'github' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="font-bold text-slate-950 text-sm">Push Code & Custom Images to GitHub</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Follow these terminal steps to link and publish your repository to GitHub.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900">1. Adding your custom images to project assets</div>
                  <p className="text-slate-600">
                    Place any of your own product photography into the <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">src/assets/images/</code> folder in your project repository.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900">2. Git commands to push your project</div>
                  <div className="bg-slate-950 text-slate-100 p-4 rounded-lg font-mono text-xs space-y-2 border border-slate-800 select-all">
                    <div className="text-slate-400"># 1. Initialize and add files</div>
                    <div>git add .</div>
                    <div>git commit -m "feat: customize project images and catalog"</div>
                    <div className="text-slate-400 pt-1"># 2. Add your GitHub remote repository (replace with your repo URL)</div>
                    <div>git remote add origin https://github.com/&lt;your-username&gt;/&lt;your-repo&gt;.git</div>
                    <div className="text-slate-400 pt-1"># 3. Push to main branch</div>
                    <div>git push -u origin main</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900">3. Running locally on any machine</div>
                  <div className="bg-slate-100 text-slate-900 p-3 rounded font-mono text-xs border border-slate-200">
                    <div>npm install</div>
                    <div>npm run dev</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Selected images update instantly in the live catalog and save to browser storage.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-950 text-white font-semibold rounded hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
