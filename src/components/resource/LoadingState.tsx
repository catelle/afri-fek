interface LoadingStateProps {
  language: 'fr' | 'en';
  t: any;
}

export const LoadingState = ({ language, t }: LoadingStateProps) => (
  <div className="min-h-screen bg-white flex items-center justify-center mt-[112px]">
    <p className="text-gray-500">{t[language].loading}</p>
  </div>
);