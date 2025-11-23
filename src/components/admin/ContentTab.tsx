import RichTextEditor from '@/components/RichTextEditor';

interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
  visionTitle: string;
  visionTexts: string[];
  quotes: Array<{
    scientist: string;
    field: string;
    quote: string;
  }>;
}

interface ContentTabProps {
  landingContent: LandingContent;
  saving: boolean;
  onLandingContentChange: (content: LandingContent) => void;
  onSave: () => void;
}

export default function ContentTab({
  landingContent,
  saving,
  onLandingContentChange,
  onSave,
}: ContentTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Modifier le contenu de la page d'accueil
        </h2>

        {/* Hero Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Section Héro
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre principal
              </label>
              <RichTextEditor
                value={landingContent.heroTitle}
                onChange={(value) =>
                  onLandingContentChange({
                    ...landingContent,
                    heroTitle: value
                  })
                }
                placeholder="Sélectionnez du texte et utilisez les boutons pour le formater"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre
              </label>
              <textarea
                value={landingContent.heroSubtitle}
                onChange={(e) =>
                  onLandingContentChange({
                    ...landingContent,
                    heroSubtitle: e.target.value
                  })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Section Vision
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre Vision
              </label>
              <input
                type="text"
                value={landingContent.visionTitle}
                onChange={(e) =>
                  onLandingContentChange({
                    ...landingContent,
                    visionTitle: e.target.value
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Textes Vision (3 paragraphes - HTML autorisé)
              </label>
              {landingContent.visionTexts.map((text, index) => (
                <div key={index}>
                  <label className="block text-xs text-gray-500 mb-1">
                    Paragraphe {index + 1}
                  </label>
                  <RichTextEditor
                    value={text}
                    onChange={(value) => {
                      const newTexts = [...landingContent.visionTexts];
                      newTexts[index] = value;
                      onLandingContentChange({ ...landingContent, visionTexts: newTexts });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Citations des Scientifiques</h3>
          <div className="space-y-6">
            {landingContent.quotes.map((quote, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Citation {index + 1}</h4>
                  {landingContent.quotes.length > 1 && (
                    <button
                      onClick={() => {
                        const newQuotes = landingContent.quotes.filter((_, i) => i !== index);
                        onLandingContentChange({ ...landingContent, quotes: newQuotes });
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scientifique</label>
                    <input
                      type="text"
                      value={quote.scientist}
                      onChange={(e) => {
                        const newQuotes = [...landingContent.quotes];
                        newQuotes[index].scientist = e.target.value;
                        onLandingContentChange({ ...landingContent, quotes: newQuotes });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                    <input
                      type="text"
                      value={quote.field}
                      onChange={(e) => {
                        const newQuotes = [...landingContent.quotes];
                        newQuotes[index].field = e.target.value;
                        onLandingContentChange({ ...landingContent, quotes: newQuotes });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                    <textarea
                      value={quote.quote}
                      onChange={(e) => {
                        const newQuotes = [...landingContent.quotes];
                        newQuotes[index].quote = e.target.value;
                        onLandingContentChange({ ...landingContent, quotes: newQuotes });
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newQuote = { scientist: '', field: '', quote: '' };
                onLandingContentChange({ ...landingContent, quotes: [...landingContent.quotes, newQuote] });
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-amber-500 hover:text-amber-600 transition"
            >
              + Ajouter une citation
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Aperçu</h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <h1
                className="text-2xl font-bold"
                dangerouslySetInnerHTML={{ __html: landingContent.heroTitle }}
              />
              <p className="text-gray-600 mt-2">{landingContent.heroSubtitle}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {landingContent.visionTitle}
              </h2>
              <div className="space-y-3">
                {landingContent.visionTexts.map((text, index) => (
                  <div key={index} className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Citations:</h3>
              {landingContent.quotes.map((quote, index) => (
                <div key={index} className="italic text-gray-600 border-l-2 border-amber-500 pl-3">
                  "{quote.quote}" - <strong>{quote.scientist}</strong> ({quote.field})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
