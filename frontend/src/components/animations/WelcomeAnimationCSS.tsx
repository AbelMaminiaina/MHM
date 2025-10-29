import { useEffect, useState } from 'react';
import './WelcomeAnimation.css';

interface WelcomeAnimationCSSProps {
  leftImage: string;
  rightImage: string;
  onAnimationComplete?: () => void;
  duration?: number;
}

/**
 * Version CSS pure de l'animation d'accueil
 * Alternative sans Framer Motion pour une taille de bundle plus légère
 */
export const WelcomeAnimationCSS = ({
  leftImage,
  rightImage,
  onAnimationComplete,
  duration = 1.5,
}: WelcomeAnimationCSSProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete?.();
    }, duration * 1000 + 500);

    return () => clearTimeout(timer);
  }, [duration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="welcome-animation css-animation">
      <div className="welcome-container">
        {/* Image gauche avec zoom-in */}
        <div className="welcome-image-container left">
          <div className="welcome-image left">
            <img src={leftImage} alt="Welcome Left" />
          </div>
          <div className="welcome-overlay-left" />
        </div>

        {/* Image droite avec slide-from-right */}
        <div className="welcome-image-container right">
          <div className="welcome-image right">
            <img src={rightImage} alt="Welcome Right" />
          </div>
          <div className="welcome-overlay-right" />
        </div>

        {/* Ligne lumineuse au centre */}
        <div className="welcome-glow-line">
          <div className="glow-core" />
          <div className="glow-inner" />
          <div className="glow-middle" />
          <div className="glow-outer" />
        </div>
      </div>

      <style>{`
        .welcome-animation {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .welcome-image.left {
          animation: zoomIn ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }

        .welcome-image.right {
          animation: slideFromRight ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s forwards;
          opacity: 0;
        }

        .welcome-glow-line {
          animation: glowPulse ${duration * 0.8}s ease-out 0.3s forwards;
          opacity: 0;
        }

        @keyframes zoomIn {
          from { transform: scale(1.2); }
          to { transform: scale(1); }
        }

        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes glowPulse {
          0% {
            opacity: 0;
            transform: scaleY(0);
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: scaleY(1);
          }
        }

        @media (max-width: 768px) {
          @keyframes glowPulse {
            0% {
              opacity: 0;
              transform: scaleX(0);
            }
            30% {
              opacity: 1;
            }
            70% {
              opacity: 0.7;
            }
            100% {
              opacity: 0;
              transform: scaleX(1);
            }
          }

          @keyframes slideFromRight {
            from {
              opacity: 0;
              transform: translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
};
