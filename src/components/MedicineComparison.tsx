import { useMemo, useRef, useCallback } from 'react';
import type { Medicine } from '../types';
import { calculateSavings, getAverageBrandedPrice, formatCurrency } from '../utils/search';
import { logShareSavings } from '../utils/analytics';

interface MedicineComparisonProps {
  medicine: Medicine;
  onShare?: () => void;
}

export function MedicineComparison({ medicine, onShare }: MedicineComparisonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const savings = useMemo(() => calculateSavings(medicine), [medicine]);
  const avgBrandedPrice = useMemo(() => getAverageBrandedPrice(medicine), [medicine]);

  const generateShareImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (optimized for social media)
    canvas.width = 1200;
    canvas.height = 630;

    // Background - warm cream
    ctx.fillStyle = '#fff8f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative elements - saffron accent
    ctx.fillStyle = '#ff9933';
    ctx.beginPath();
    ctx.arc(100, 100, 150, 0, Math.PI * 2);
    ctx.fill();

    // Header
    ctx.fillStyle = '#231a13';
    ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Jan Aushadhi Savings', canvas.width / 2, 120);

    // Medicine name
    ctx.fillStyle = '#8f4e00';
    ctx.font = 'bold 56px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(medicine.genericName, canvas.width / 2, 220);

    // Savings amount
    ctx.fillStyle = '#056e00';
    ctx.font = 'bold 120px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`₹${Math.round(savings.amount)}`, canvas.width / 2, 380);

    // Savings label
    ctx.fillStyle = '#554336';
    ctx.font = '36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`SAVED (${Math.round(savings.percentage)}%)`, canvas.width / 2, 440);

    // Comparison
    ctx.fillStyle = '#887364';
    ctx.font = '32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Branded: ${formatCurrency(avgBrandedPrice)} → Jan Aushadhi: ${formatCurrency(medicine.janAushadhiPrice)}`,
      canvas.width / 2,
      520
    );

    // Footer
    ctx.fillStyle = '#ff9933';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('#JanAushadhi #AffordableHealthcare', canvas.width / 2, 590);

    // Log analytics
    logShareSavings(medicine.id, savings.amount);

    // Convert to blob and download/share
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jan-aushadhi-savings-${medicine.genericName.toLowerCase().replace(/\s+/g, '-')}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

    if (onShare) onShare();
  }, [medicine, savings, avgBrandedPrice, onShare]);

  return (
    <div className="w-full">
      {/* Hidden canvas for generating share image */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
        {/* Left Panel: Branded Medicine */}
        <div className="md:col-span-5 bg-white rounded-xl md:rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 md:p-8 flex-1">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">
                BRANDED DRUG
              </span>
              <span className="material-symbols-outlined text-outline">medication</span>
            </div>

            <div className="w-full h-32 md:h-48 bg-surface-container-high rounded-lg mb-4 md:mb-6 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl md:text-6xl text-outline-variant">
                medical_services
              </span>
            </div>

            <h2 className="font-headline-md text-headline-md mb-2">
              {medicine.brandedEquivalents[0]?.name || 'Branded Equivalent'}
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant mb-4 md:mb-6">
              {medicine.genericName} ({medicine.packSize}). Same active ingredient, established brand premium.
            </p>

            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">
                {formatCurrency(avgBrandedPrice)}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">/ pack</span>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant">
              <p className="font-label-sm text-on-surface-variant mb-2">Also known as:</p>
              <div className="flex flex-wrap gap-2">
                {medicine.brandedEquivalents.slice(1, 4).map((brand) => (
                  <span
                    key={brand.name}
                    className="bg-surface-container-low px-2 py-1 rounded-full font-label-sm text-on-surface-variant"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container px-4 md:px-8 py-4 border-t border-outline-variant">
            <button className="w-full py-3 bg-white border border-outline text-on-surface font-label-lg text-label-lg rounded-xl hover:bg-surface transition-colors">
              View Branded Options
            </button>
          </div>
        </div>

        {/* VS Divider */}
        <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center relative py-4">
          <div className="w-px h-full bg-outline-variant"></div>
          <div className="absolute bg-primary-container text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg text-label-lg">
            VS
          </div>
        </div>

        {/* Mobile VS Badge */}
        <div className="md:hidden flex justify-center py-2">
          <div className="bg-primary-container text-white px-4 py-2 rounded-full font-bold text-label-lg">
            VS
          </div>
        </div>

        {/* Right Panel: Generic (The Highlight) */}
        <div className="md:col-span-5 bg-surface-container-low rounded-xl md:rounded-2xl border-2 border-primary-container shadow-[0_8px_40px_-10px_rgba(255,153,51,0.2)] overflow-hidden flex flex-col transform hover:scale-[1.01] transition-transform duration-300">
          <div className="p-4 md:p-8 flex-1 relative">
            <div className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-4">
              <div className="bg-secondary text-on-secondary font-label-lg text-label-lg px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md">
                {Math.round(savings.percentage)}% SAVINGS
              </div>
            </div>

            <div className="flex justify-between items-start mb-4 md:mb-6">
              <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full">
                GENERIC CHOICE
              </span>
              <span className="material-symbols-outlined text-primary material-symbols-filled">
                verified
              </span>
            </div>

            <div className="w-full h-32 md:h-48 bg-primary-container/10 rounded-lg mb-4 md:mb-6 flex items-center justify-center border-2 border-dashed border-primary-container/30">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-primary mb-2">
                  local_pharmacy
                </span>
                <p className="font-label-sm text-primary">Jan Aushadhi</p>
              </div>
            </div>

            <h2 className="font-headline-md text-headline-md mb-2">{medicine.genericName} (Generic)</h2>

            <p className="font-body-md text-body-md text-on-surface-variant mb-4 md:mb-6">
              {medicine.genericName} {medicine.packSize}. Government quality assured, identical therapeutic value.
            </p>

            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-secondary">
                {formatCurrency(medicine.janAushadhiPrice)}
              </span>
              <span className="font-label-lg text-label-lg text-on-surface-variant">/ pack</span>
            </div>

            {/* Savings Highlight */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-secondary-container rounded-xl">
              <p className="font-label-sm text-on-secondary-container mb-1">You Save:</p>
              <p className="font-headline-lg text-headline-lg text-secondary">
                {formatCurrency(savings.amount)} ({Math.round(savings.percentage)}%)
              </p>
            </div>
          </div>

          <div className="bg-primary-container px-4 md:px-8 py-4">
            <div className="flex gap-3">
              <button
                onClick={generateShareImage}
                className="flex-1 py-3 bg-on-primary-fixed text-white font-label-lg text-label-lg rounded-xl hover:opacity-90 transition-opacity shadow-[0_2px_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">share</span>
                Share Savings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
