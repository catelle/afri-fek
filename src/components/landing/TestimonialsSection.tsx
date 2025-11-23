import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Amina Kone",
    role: "Chercheur, Université de Dakar",
    initials: "AK",
    color: "amber",
    quote: "Afri-Fek m'a permis de découvrir des ressources de recherche que je n'aurais jamais trouvées ailleurs."
  },
  {
    name: "Prof. John Mensah",
    role: "Directeur, Institut de Santé Publique",
    initials: "JM",
    color: "blue",
    quote: "Une plateforme indispensable pour tout chercheur en santé travaillant sur l'Afrique."
  },
  {
    name: "Dr. Fatima Al-Rashid",
    role: "Chercheuse, Université du Caire",
    initials: "FA",
    color: "green",
    quote: "Interface intuitive et ressources de qualité. Exactement ce dont nous avions besoin."
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-8xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-600 mb-6">
            Ce que disent nos utilisateurs
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-${testimonial.color}-100 rounded-full mr-4 flex items-center justify-center`}>
                  <span className={`text-${testimonial.color}-600 font-semibold text-lg`}>
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};