interface Quote {
  scientist: string;
  field: string;
  quote: string;
}

interface ScientistsSectionProps {
  quotes: Quote[];
}

export const ScientistsSection = ({ quotes }: ScientistsSectionProps) => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
            Scientifiques Africains Inspirants
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les pionniers qui façonnent la recherche africaine
          </p>
        </div>

        <div className="space-y-12">
          {quotes.map((quote, index) => (
            <div key={index} className={`flex ${
              index % 2 === 0 ? 'justify-start' : 'justify-end'
            }`}>
              <div className={`relative p-6 rounded-xl shadow-lg transition-shadow hover:shadow-2xl max-w-2xl w-full
                ${index % 2 === 0 ? 'bg-amber-50 border-l-4 border-amber-500' : 'bg-gray-50 border-r-4 border-gray-600'}
              `}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    index % 4 === 0 ? 'bg-amber-500' :
                    index % 4 === 1 ? 'bg-blue-500' :
                    index % 4 === 2 ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {quote.scientist.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{quote.scientist}</h3>
                    <p className={`text-sm font-medium ${
                      index % 4 === 0 ? 'text-amber-600' :
                      index % 4 === 1 ? 'text-blue-600' :
                      index % 4 === 2 ? 'text-green-600' : 'text-purple-600'
                    }`}>{quote.field}</p>
                    <p className="text-gray-700 italic mt-2">{quote.quote}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};