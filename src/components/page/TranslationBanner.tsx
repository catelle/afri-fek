interface TranslationBannerProps {
  showBanner: boolean;
}

export const TranslationBanner = ({ showBanner }: TranslationBannerProps) => {
  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="translation-spinner border-orange-500 border-t-orange-200"></div>
        <span className="text-sm font-medium">...</span>
      </div>
    </div>
  );
};