export const LandingStyles = () => (
  <style jsx>{`
    .hero-slider {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .hero-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      min-height: 400px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0;
      transition: opacity 2s ease-in-out;
    }
    .hero-slide.active {
      opacity: 1;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    .delay-100 {
      animation-delay: 0.1s;
    }
    .delay-200 {
      animation-delay: 0.2s;
    }
    .delay-300 {
      animation-delay: 0.3s;
    }
    .delay-400 {
      animation-delay: 0.4s;
    }
    .delay-500 {
      animation-delay: 0.5s;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
);