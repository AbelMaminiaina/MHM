# Animation d'accueil moderne

Une animation d'accueil élégante et fluide inspirée du design Apple, avec deux versions disponibles :
- **WelcomeAnimation** : Version complète avec Framer Motion
- **WelcomeAnimationCSS** : Version légère avec CSS keyframes

## Caractéristiques

- Animation en deux parties (gauche/droite)
- Image gauche : effet de zoom-in doux
- Image droite : slide-from-right + fade-in
- Ligne lumineuse au centre avec effet glow
- Style minimaliste inspiré d'Apple
- Durée d'animation personnalisable (1-2s recommandé)
- Responsive : superposition verticale sur mobile
- TypeScript natif

## Installation

```bash
# Pour la version Framer Motion (recommandée)
npm install framer-motion

# Aucune dépendance supplémentaire pour la version CSS
```

## Utilisation

### Version Framer Motion (recommandée)

```tsx
import { WelcomeAnimation } from './components/animations';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation
          leftImage="/images/hero-left.jpg"
          rightImage="/images/hero-right.jpg"
          duration={1.5}
          onAnimationComplete={() => setShowWelcome(false)}
        />
      )}

      {/* Votre contenu principal */}
      <main>
        <h1>Bienvenue</h1>
      </main>
    </>
  );
}
```

### Version CSS pure (bundle plus léger)

```tsx
import { WelcomeAnimationCSS } from './components/animations';

function App() {
  return (
    <>
      <WelcomeAnimationCSS
        leftImage="/images/hero-left.jpg"
        rightImage="/images/hero-right.jpg"
        duration={2}
        onAnimationComplete={() => console.log('Done!')}
      />

      <main>
        <h1>Bienvenue</h1>
      </main>
    </>
  );
}
```

## Props

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `leftImage` | `string` | URL/chemin de l'image de gauche | *requis* |
| `rightImage` | `string` | URL/chemin de l'image de droite | *requis* |
| `duration` | `number` | Durée de l'animation en secondes | `1.5` |
| `onAnimationComplete` | `() => void` | Callback appelé à la fin | `undefined` |

## Animations

### Image gauche
- Fade-in initial (0.3s)
- Zoom-in de 120% à 100% (durée personnalisable)
- Courbe d'accélération : cubic-bezier(0.25, 0.1, 0.25, 1)

### Image droite
- Slide depuis la droite (+100px)
- Fade-in simultané
- Légère mise à l'échelle (105% à 100%)
- Délai de 0.2s pour un effet décalé

### Ligne centrale
- Apparition progressive (scaleY: 0 → 1)
- Effet de glow multi-couches (4 couches)
- Opacité animée : 0 → 1 → 0.7 → 0
- Durée : 80% de la durée principale

## Responsive

### Desktop (> 768px)
- Disposition horizontale (50% / 50%)
- Ligne verticale au centre

### Mobile (≤ 768px)
- Disposition verticale (50% hauteur chacune)
- Ligne horizontale au centre
- Animations adaptées (translateY au lieu de translateX)

## Personnalisation

### Modifier la courbe d'animation

```tsx
// Dans WelcomeAnimation.tsx
transition={{
  duration: duration,
  ease: [0.25, 0.1, 0.25, 1], // Modifier cette courbe
}}
```

### Modifier les couleurs du glow

```css
/* Dans WelcomeAnimation.css */
.glow-core {
  background: rgba(255, 255, 255, 0.6); /* Blanc par défaut */
}
```

### Ajouter un fond différent

```tsx
<div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
```

## Performance

### Bundle Size
- **Avec Framer Motion** : ~50KB (gzipped)
- **CSS pur** : ~2KB (gzipped)

### Optimisations
- Images : utilisez WebP ou AVIF pour de meilleures performances
- Lazy loading : ne chargez l'animation que sur la page d'accueil
- Préchargement : utilisez `<link rel="preload">` pour les images critiques

```html
<!-- Dans votre index.html -->
<link rel="preload" as="image" href="/images/welcome-left.jpg" />
<link rel="preload" as="image" href="/images/welcome-right.jpg" />
```

## Exemples d'images recommandées

- Images hautes résolutions (minimum 1920x1080)
- Format vertical ou carré pour un meilleur rendu
- Contraste élevé entre les deux images
- Évitez les images trop chargées (minimalisme Apple)

### Sources d'images gratuites
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

## Accessibilité

- Les images ont des attributs `alt` appropriés
- L'animation peut être désactivée via `prefers-reduced-motion`
- Contraste suffisant pour la lisibilité

## Support navigateurs

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Licence

MIT
