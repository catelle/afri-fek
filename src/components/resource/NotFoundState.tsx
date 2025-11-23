interface NotFoundStateProps {
  language: 'fr' | 'en';
  t: any;
  onBack: () => void;
}

export const NotFoundState = ({ language, t, onBack }: NotFoundStateProps) => (
  <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
    <div className="text-center">
      <p className="text-gray-500 mb-4">{t[language].hero.resourcenotfound}</p>
      <button
        onClick={onBack}
        className="text-orange-500 hover:text-orange-600"
      >
        {t[language].hero.back}
      </button>
    </div>
  </div>
);