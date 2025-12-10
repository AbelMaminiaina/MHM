# Guide d'importation des membres HFM

Ce guide vous explique comment importer votre liste de membres depuis un fichier Excel.

## Format du fichier Excel

### Colonnes requises

Les colonnes suivantes sont **obligatoires** :

1. **Prénom** (ou `firstName` en anglais)
2. **Nom** (ou `lastName` en anglais)
3. **Date de naissance** (ou `dateOfBirth` en anglais)

### Colonnes optionnelles

Vous pouvez également inclure ces colonnes :

- **Adresse** (ou `address`) - Adresse complète
- **Rue** (ou `street`) - Nom de la rue
- **Ville** (ou `city`)
- **Code postal** (ou `postalCode`)
- **Pays** (ou `country`) - Par défaut : France
- **Téléphone** (ou `phone`)
- **Email** (ou `email`)
- **Notes** (ou `notes`)

## Format des dates

Les dates de naissance peuvent être dans l'un des formats suivants :
- Format Excel (nombre de jours depuis 1900)
- Format texte : `15/03/1985` ou `15-03-1985`
- Format ISO : `1985-03-15`

## Fichier template

Utilisez le fichier `template-import-membres.csv` comme modèle. Voici un exemple :

```csv
Prénom,Nom,Date de naissance,Adresse,Ville,Code postal,Pays,Téléphone,Email,Notes
Jean,Dupont,15/03/1985,12 Rue de la Paix,Paris,75001,France,0601020304,jean.dupont@email.com,Membre actif
Marie,Martin,22/07/1990,5 Avenue des Champs,Lyon,69001,France,0602030405,marie.martin@email.com,
```

## Étapes d'importation

### 1. Préparez votre fichier Excel

- Ouvrez votre fichier Excel avec la liste des membres
- Assurez-vous que la première ligne contient les en-têtes de colonnes
- Vérifiez que les colonnes obligatoires sont présentes
- Sauvegardez le fichier au format `.xlsx`, `.xls` ou `.csv`

### 2. Connectez-vous à l'API

Obtenez votre token JWT en vous connectant :

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre@email.com",
    "password": "VotreMotDePasse123"
  }'
```

Sauvegardez le `token` retourné.

### 3. Importez le fichier

Utilisez l'endpoint d'importation avec votre fichier :

```bash
curl -X POST http://localhost:5000/api/members/import \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -F "file=@chemin/vers/votre/fichier.xlsx"
```

### 4. Vérifiez le résultat

L'API retournera un rapport détaillé :

```json
{
  "success": true,
  "message": "Import terminé: 45 réussis, 2 erreurs",
  "data": {
    "total": 47,
    "success": [
      {
        "row": 2,
        "member": {
          "firstName": "Jean",
          "lastName": "Dupont",
          "email": "jean.dupont@email.com"
        }
      }
    ],
    "errors": [
      {
        "row": 10,
        "data": {...},
        "error": "Prénom, nom et date de naissance sont requis"
      }
    ]
  }
}
```

## Erreurs courantes

### "Le fichier Excel est vide"
- Vérifiez que votre fichier contient des données (pas seulement les en-têtes)

### "Prénom, nom et date de naissance sont requis"
- Assurez-vous que ces trois colonnes sont présentes et remplies pour chaque ligne

### "Format de fichier non valide"
- Seuls les formats `.xlsx`, `.xls` et `.csv` sont acceptés
- Vérifiez l'extension de votre fichier

### "Fichier trop volumineux"
- La taille maximale est de 10 MB
- Divisez votre fichier en plusieurs parties si nécessaire

## Conseils

1. **Testez avec un petit fichier** : Commencez par importer 5-10 membres pour vérifier le format
2. **Sauvegardez vos données** : Gardez une copie de votre fichier Excel original
3. **Vérifiez les dates** : Les dates doivent être dans le passé
4. **Nettoyez vos données** : Supprimez les lignes vides et les doublons avant l'import
5. **Encodage UTF-8** : Si vous avez des caractères spéciaux, sauvegardez en UTF-8

## Exporter les membres

Vous pouvez également exporter tous les membres vers Excel :

```bash
curl -X GET http://localhost:5000/api/members/export \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  --output membres-HFM.xlsx
```

Cela créera un fichier Excel avec tous les membres actuels de la base de données.

## Support

En cas de problème :

1. Vérifiez que le serveur backend est démarré
2. Vérifiez votre token JWT (il expire après 30 jours)
3. Consultez les logs du serveur pour plus de détails
4. Vérifiez le format de votre fichier Excel

Pour plus d'aide, consultez le fichier `README.md` ou contactez l'administrateur système.
