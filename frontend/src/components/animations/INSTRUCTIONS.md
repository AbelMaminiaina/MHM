# Instructions d'utilisation

## 🚀 Démarrage rapide

### 1. Tester la démo

Pour voir l'animation en action avec une interface de contrôle interactive :

```tsx
// Dans src/App.tsx
import { Demo } from './components/animations/Demo';

function App() {
  return <Demo />;
}

export default App;
```

Lancez ensuite :
```bash
npm run dev
```

### 2. Intégration dans votre application

#### Option A : Avec Framer Motion (recommandé)

```tsx
import { useState } from 'react';
import { WelcomeAnimation } from './components/animations';
import { HomePage } from './features/home/components/HomePage';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation
          leftImage="/images/welcome-left.jpg"
          rightImage="/images/welcome-right.jpg"
          duration={1.5}
          onAnimationComplete={() => {
            setTimeout(() => setShowWelcome(false), 500);
          }}
        />
      )}

      <HomePage />
    </>
  );
}

export default App;
```

#### Option B : CSS pur (bundle plus léger)

```tsx
import { WelcomeAnimationCSS } from './components/animations';

// Même utilisation, remplacez juste WelcomeAnimation par WelcomeAnimationCSS
```

### 3. N'afficher l'animation qu'une seule fois

```tsx
function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('hasSeenWelcome');
  });

  const handleComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setTimeout(() => setShowWelcome(false), 500);
  };

  return (
    <>
      {showWelcome && (
        <WelcomeAnimation
          leftImage="/images/welcome-left.jpg"
          rightImage="/images/welcome-right.jpg"
          duration={1.5}
          onAnimationComplete={handleComplete}
        />
      )}

      <HomePage />
    </>
  );
}
```

## 📁 Structure des fichiers créés

```
frontend/src/components/animations/
├── WelcomeAnimation.tsx       # Composant principal (Framer Motion)
├── WelcomeAnimationCSS.tsx    # Version CSS pure
├── WelcomeAnimation.css       # Styles CSS
├── Demo.tsx                   # Démo interactive
├── ExampleUsage.tsx           # Exemples d'utilisation
├── index.ts                   # Exports
├── README.md                  # Documentation complète
└── INSTRUCTIONS.md            # Ce fichier
```

## 🎨 Personnalisation

### Changer les couleurs de la ligne lumineuse

Dans `WelcomeAnimation.tsx`, modifiez les classes Tailwind :

```tsx
{/* Ligne centrale */}
<div className="absolute inset-0 bg-blue-500/60" />  {/* Au lieu de bg-white/60 */}

{/* Glow effect */}
<div className="absolute inset-0 bg-blue-400/40 blur-sm w-2 -translate-x-1/2" />
```

### Changer la courbe d'animation

```tsx
// Dans WelcomeAnimation.tsx
const appleEase = [0.4, 0.0, 0.2, 1]; // Plus rapide au début
// ou
const appleEase = [0.0, 0.0, 0.2, 1]; // Linéaire au début
```

### Ajouter un logo au centre

```tsx
{/* Après la ligne lumineuse */}
<motion.div
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, delay: 0.5 }}
>
  <img src="/logo.svg" alt="Logo" className="w-24 h-24" />
</motion.div>
```

## 🖼️ Préparer vos images

### Recommandations

1. **Résolution** : Minimum 1920x1080px (Full HD)
2. **Format** : WebP ou AVIF pour de meilleures performances
3. **Poids** : Optimisez à moins de 200KB par image
4. **Style** : Images minimalistes, contraste élevé

### Outils de conversion

```bash
# Convertir en WebP avec sharp
npm install -g sharp-cli
sharp -i input.jpg -o output.webp --quality 80

# Ou utiliser un service en ligne comme squoosh.app
```

### Précharger les images

Dans `public/index.html` :

```html
<head>
  <link rel="preload" as="image" href="/images/welcome-left.webp" />
  <link rel="preload" as="image" href="/images/welcome-right.webp" />
</head>
```

## 📱 Test responsive

### Desktop
- Les images s'affichent côte à côte (50% / 50%)
- Ligne verticale au centre

### Mobile (≤ 768px)
- Les images se superposent verticalement
- Ligne horizontale au milieu

### Test sur différents appareils

```bash
# Ouvrir en mode réseau local
npm run dev -- --host

# Accéder depuis mobile via :
# http://[votre-ip-locale]:5173
```

## 🔧 Dépannage

### L'animation ne s'affiche pas

1. Vérifiez que Framer Motion est installé :
```bash
npm list framer-motion
```

2. Vérifiez les chemins des images (console du navigateur)

3. Vérifiez que le composant est bien monté :
```tsx
console.log('Animation montée', showWelcome);
```

### Les images ne chargent pas

1. Vérifiez que les images sont dans le bon dossier :
```
public/images/welcome-left.jpg
public/images/welcome-right.jpg
```

2. Utilisez des URLs complètes pour tester :
```tsx
leftImage="https://images.unsplash.com/photo-xxx"
```

### L'animation est saccadée

1. Optimisez les images (réduisez la taille)
2. Vérifiez les performances dans DevTools
3. Essayez la version CSS si Framer Motion est trop lourd

### L'animation ne se termine pas

Vérifiez que `onAnimationComplete` est bien appelé :

```tsx
onAnimationComplete={() => {
  console.log('Animation terminée!');
  setShowWelcome(false);
}}
```

## 🎯 Prochaines étapes

1. **Testez la démo** : `import { Demo } from './components/animations/Demo'`
2. **Préparez vos images** : Placez-les dans `public/images/`
3. **Intégrez dans App.tsx** : Suivez les exemples ci-dessus
4. **Personnalisez** : Ajustez les couleurs, durées, etc.
5. **Testez sur mobile** : Vérifiez le responsive

## 📚 Ressources

- [Documentation Framer Motion](https://www.framer.com/motion/)
- [Guide Tailwind CSS](https://tailwindcss.com/docs)
- [Images gratuites (Unsplash)](https://unsplash.com)
- [Optimisation d'images (Squoosh)](https://squoosh.app)

## 💡 Conseils

- Commencez par tester la démo pour comprendre le comportement
- Utilisez des images de qualité mais optimisées
- Testez sur mobile ET desktop
- Respectez les préférences utilisateur (prefers-reduced-motion)
- N'abusez pas de l'animation (1 fois au chargement suffit)

---

**Besoin d'aide ?** Consultez le README.md pour plus de détails.
