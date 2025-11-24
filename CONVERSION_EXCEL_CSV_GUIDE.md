# 📊 Conversion Excel → CSV - Guide Complet

## ✅ Conversion Terminée avec Succès !

Les données de la **feuille 2** du fichier Excel "Ekipa Filoha sy Tantsoroka 2021-2022" ont été extraites et converties en CSV.

---

## 📁 Fichiers Créés

### 1. Fichier CSV Brut
**Emplacement :** `backend/templates/ekipa-filoha-tantsoroka-feuil2.csv`

**Contenu :**
- Format : `NOM,Prénom,CIN`
- 120 lignes de données
- Pas d'en-têtes

**Exemple :**
```csv
RANDRIANARISON,Herilaza,103171006562.00
RAZANAMINO,Jaurice Nelda,520012014238.00
RAFALISOA,Samson Alexandre,210011038945.00
```

---

### 2. Fichier CSV Formaté pour Import QR Code ✨
**Emplacement :** `backend/templates/ekipa-filoha-tantsoroka-import-qrcode.csv`

**Contenu :**
- Format : `memberId,name,email,status,validity,cin,lastName,firstName`
- 118 membres valides (2 lignes vides ignorées)
- Prêt pour l'import dans le système

**Exemple :**
```csv
memberId,name,email,status,validity,cin,lastName,firstName
M-2022-0001,"Herilaza RANDRIANARISON",membre0001@mhm.mg,active,2022,103171006562.00,"RANDRIANARISON","Herilaza"
M-2022-0002,"Jaurice Nelda RAZANAMINO",membre0002@mhm.mg,active,2022,520012014238.00,"RAZANAMINO","Jaurice Nelda"
```

---

## 📊 Statistiques de Conversion

| Métrique | Valeur |
|----------|--------|
| **Total lignes Excel** | 120 |
| **Membres valides** | 118 |
| **Lignes avec erreurs** | 2 (lignes vides) |
| **Taux de réussite** | 98.33% |
| **Colonnes ajoutées** | 8 |

---

## 🔧 Transformations Appliquées

### 1. Ajout d'En-Têtes
```
memberId, name, email, status, validity, cin, lastName, firstName
```

### 2. Génération des Numéros de Membre
**Format :** `M-2022-XXXX`

**Exemples :**
- `M-2022-0001` pour Herilaza RANDRIANARISON
- `M-2022-0002` pour Jaurice Nelda RAZANAMINO
- etc.

### 3. Création des Noms Complets
**Format :** `Prénom NOM`

**Exemples :**
- `Herilaza RANDRIANARISON`
- `Jaurice Nelda RAZANAMINO`

### 4. Génération d'Emails Temporaires
**Format :** `membre{XXXX}@mhm.mg`

**⚠️ ATTENTION** : Ces emails sont **fictifs** et doivent être remplacés !

### 5. Ajout de Métadonnées
- **Status** : `active` (tous les membres)
- **Validity** : `2022` (année du fichier source)
- **CIN** : Numéro d'identité conservé

---

## ⚠️ ACTIONS REQUISES AVANT L'IMPORT

### 1. 📧 Compléter les Emails (OBLIGATOIRE)

**Problème :**
```csv
M-2022-0001,"Herilaza RANDRIANARISON",membre0001@mhm.mg,active,2022,...
```

Les emails `membre0001@mhm.mg` sont **fictifs**.

**Solution :**
1. Ouvrir le fichier CSV dans Excel/LibreOffice
2. Remplacer chaque email fictif par le vrai email du membre
3. Sauvegarder le fichier

**Exemple de remplacement :**
```csv
# AVANT
M-2022-0001,"Herilaza RANDRIANARISON",membre0001@mhm.mg,active,2022,...

# APRÈS
M-2022-0001,"Herilaza RANDRIANARISON",herilaza.randrianarison@gmail.com,active,2022,...
```

---

### 2. 🔢 Vérifier les Numéros de Membre (RECOMMANDÉ)

**Numéros générés :** `M-2022-0001` à `M-2022-0118`

**Questions à se poser :**
- Ces membres ont-ils déjà un numéro de membre dans le système ?
- Faut-il utiliser `M-2022-XXXX` ou `M-2025-XXXX` ?
- Y a-t-il des conflits avec des numéros existants ?

**Si besoin de changer l'année :**

Option A - Remplacement manuel dans Excel :
1. Ouvrir le fichier CSV
2. Rechercher/Remplacer : `M-2022-` → `M-2025-`
3. Sauvegarder

Option B - Script automatique :
```bash
cd backend
sed -i 's/M-2022-/M-2025-/g' templates/ekipa-filoha-tantsoroka-import-qrcode.csv
```

---

### 3. 📅 Ajuster l'Année de Validité (RECOMMANDÉ)

**Valeur actuelle :** `2022` (année du fichier source)

**Si vous voulez générer des QR Codes pour 2025 :**

Option A - Remplacement manuel dans Excel :
1. Ouvrir le fichier CSV
2. Rechercher/Remplacer : `,2022,` → `,2025,`
3. Sauvegarder

Option B - Script automatique :
```bash
cd backend
sed -i 's/,2022,/,2025,/g' templates/ekipa-filoha-tantsoroka-import-qrcode.csv
```

---

### 4. ✅ Vérifier les Statuts (OPTIONNEL)

**Valeur actuelle :** Tous marqués `active`

**Si certains membres doivent avoir un autre statut :**
- `pending` : En attente de validation
- `inactive` : Membre inactif
- `suspended` : Suspendu

Modifier manuellement dans Excel si nécessaire.

---

## 🚀 Utilisation du Fichier CSV

### Méthode 1 : Import via l'Interface Web (RECOMMANDÉ)

**Étapes :**

1. **Compléter les emails** dans le fichier CSV

2. **Se connecter en tant qu'admin**
   ```
   http://localhost:5173/login
   ```

3. **Accéder à la gestion QR Codes**
   ```
   http://localhost:5173/admin/qrcodes
   ```

4. **Onglet "📤 Import CSV"**

5. **Sélectionner le fichier**
   ```
   backend/templates/ekipa-filoha-tantsoroka-import-qrcode.csv
   ```

6. **Ajuster l'année de validité** (ex: 2025)

7. **Cliquer "Lancer l'envoi en masse"**

8. **Résultat attendu**
   ```
   Import terminé !
   ━━━━━━━━━━━━━━━━
   📊 Résultats :
     • Total : 118 membres
     • ✅ Envoyés : 118
     • ❌ Échecs : 0
     • 📈 Taux : 100%
   ```

---

### Méthode 2 : API Directe

**Endpoint :**
```http
POST http://localhost:5000/api/qrcodes/import-csv
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
  file: ekipa-filoha-tantsoroka-import-qrcode.csv
  validity: 2025
```

---

## 📋 Structure des Colonnes

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| `memberId` | String | Numéro de membre unique | `M-2022-0001` |
| `name` | String | Nom complet (Prénom NOM) | `Herilaza RANDRIANARISON` |
| `email` | String | Email du membre | `herilaza@gmail.com` |
| `status` | String | Statut du membre | `active` |
| `validity` | String | Année de validité | `2025` |
| `cin` | String | Numéro CIN | `103171006562.00` |
| `lastName` | String | Nom de famille | `RANDRIANARISON` |
| `firstName` | String | Prénom | `Herilaza` |

---

## 🔍 Vérification des Données

### Vérifier le fichier CSV

```bash
# Afficher les 10 premières lignes
head -n 10 backend/templates/ekipa-filoha-tantsoroka-import-qrcode.csv

# Compter le nombre de lignes
wc -l backend/templates/ekipa-filoha-tantsoroka-import-qrcode.csv

# Vérifier les emails fictifs restants
grep "membre.*@mhm.mg" backend/templates/ekipa-filoha-tantsoroka-import-qrcode.csv | wc -l
```

---

## 📝 Checklist Avant Import

| Tâche | Statut | Priorité |
|-------|--------|----------|
| ✅ Fichier CSV créé | ✅ | - |
| 📧 Emails complétés | ⬜ | **OBLIGATOIRE** |
| 🔢 Numéros de membre vérifiés | ⬜ | Recommandé |
| 📅 Année de validité ajustée | ⬜ | Recommandé |
| ✅ Statuts vérifiés | ⬜ | Optionnel |
| 🔒 SMTP configuré | ⬜ | **OBLIGATOIRE** |
| 🧪 Test avec 2-3 membres | ⬜ | Recommandé |

---

## 🛠️ Scripts Créés

### 1. `backend/scripts/convert-excel-to-csv.js`
**Fonction :** Extraire la feuille 2 de l'Excel et créer un CSV brut

**Usage :**
```bash
cd backend
node scripts/convert-excel-to-csv.js
```

### 2. `backend/scripts/prepare-qrcode-import.js`
**Fonction :** Transformer le CSV brut en format compatible avec l'import QR Code

**Usage :**
```bash
cd backend
node scripts/prepare-qrcode-import.js
```

---

## 🎯 Exemple Complet

### Avant l'Import

**Fichier original :** `ekipa-filoha-tantsoroka-import-qrcode.csv`
```csv
memberId,name,email,status,validity,cin,lastName,firstName
M-2022-0001,"Herilaza RANDRIANARISON",membre0001@mhm.mg,active,2022,103171006562.00,"RANDRIANARISON","Herilaza"
M-2022-0002,"Jaurice Nelda RAZANAMINO",membre0002@mhm.mg,active,2022,520012014238.00,"RAZANAMINO","Jaurice Nelda"
```

### Après Modifications

**Fichier modifié :**
```csv
memberId,name,email,status,validity,cin,lastName,firstName
M-2025-0001,"Herilaza RANDRIANARISON",herilaza.randrianarison@gmail.com,active,2025,103171006562.00,"RANDRIANARISON","Herilaza"
M-2025-0002,"Jaurice Nelda RAZANAMINO",jaurice.razanamino@yahoo.fr,active,2025,520012014238.00,"RAZANAMINO","Jaurice Nelda"
```

**Changements :**
- ✅ `M-2022-` → `M-2025-`
- ✅ Emails fictifs → Emails réels
- ✅ `2022` → `2025`

---

## 🚨 Erreurs Communes

### Erreur 1 : "Membre non trouvé dans la base de données"

**Cause :** Le `memberId` n'existe pas dans la base

**Solutions :**
1. Vérifier que les membres ont été créés dans le système
2. Utiliser les vrais numéros de membre existants
3. Ou créer d'abord les membres via l'interface

---

### Erreur 2 : "Email invalide"

**Cause :** Email au format incorrect

**Solution :**
```csv
# ❌ MAUVAIS
membre0001@mhm.mg

# ✅ BON
herilaza.randrianarison@gmail.com
```

---

### Erreur 3 : "Envoi d'email échoué"

**Cause :** SMTP mal configuré

**Solution :**
Vérifier `backend/.env` :
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application
```

---

## 📚 Documentation Associée

- **Guide QR Code** : `GUIDE_QRCODE_UTILISATION.md`
- **Flux d'emails** : `FLUX_EMAILS_ADHESION.md`
- **Test SMTP** : Exécuter `node backend/test-smtp.js`

---

## ✅ Résumé

**Ce qui a été fait :**
- ✅ Extraction de la feuille 2 du fichier Excel
- ✅ Conversion en CSV brut (120 lignes)
- ✅ Transformation en format import QR Code (118 membres valides)
- ✅ Génération des numéros de membre (M-2022-0001 à M-2022-0118)
- ✅ Création de la structure complète avec 8 colonnes

**Ce qu'il reste à faire :**
- ⬜ Compléter les emails réels des membres
- ⬜ Ajuster l'année de validité (2022 → 2025)
- ⬜ Vérifier les numéros de membre
- ⬜ Importer le fichier via l'interface
- ⬜ Lancer l'envoi en masse des QR Codes

---

**Date de création :** 2025-11-24
**Fichier source :** Ekipa Filoha sy Tantsoroka 2021-2022.xlsx (Feuille 2)
**Membres traités :** 118/120
**Statut :** ✅ Prêt pour modification et import
