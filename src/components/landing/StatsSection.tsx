interface StatsSectionProps {
  stats: {
    total: number;
    countries: number;
    journals: number;
    articles: number;
  };
}

export const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.total}+</div>
            <div className="text-amber-600">Ressources Totales</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.countries}+</div>
            <div className="text-amber-600">Pays Couverts</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.journals}+</div>
            <div className="text-amber-600">Journaux Scientifiques</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.articles}+</div>
            <div className="text-amber-600">Articles de Recherche</div>
          </div>
        </div>
      </div>
    </section>
  );
};