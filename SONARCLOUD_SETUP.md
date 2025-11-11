# SonarCloud Setup Guide

This guide explains how to set up SonarCloud for code quality analysis in the MHM project.

## Prerequisites

- GitHub account with admin access to the repository
- SonarCloud account (free for open source projects)

## Setup Steps

### 1. Create SonarCloud Account

1. Go to [SonarCloud](https://sonarcloud.io/)
2. Click "Log in" and choose "With GitHub"
3. Authorize SonarCloud to access your GitHub account

### 2. Import Your Repository

1. Click on the "+" icon in the top right
2. Select "Analyze new project"
3. Choose your organization (or create one): `abelmaminiaina`
4. Select the `MHM` repository
5. Click "Set Up"

### 3. Create Two Projects in SonarCloud

You need to create two separate projects for backend and frontend:

#### Backend Project
- **Project Key**: `AbelMaminiaina_MHM-backend`
- **Organization**: `abelmaminiaina`
- **Name**: MHM Backend

#### Frontend Project
- **Project Key**: `AbelMaminiaina_MHM-frontend`
- **Organization**: `abelmaminiaina`
- **Name**: MHM Frontend

### 4. Get Your SonarCloud Token

1. Go to your SonarCloud account settings
2. Navigate to **Security** tab
3. Generate a new token:
   - **Name**: `GitHub Actions MHM`
   - **Type**: `Global Analysis Token` or `Project Analysis Token`
   - **Expiration**: Choose your preferred expiration
4. Copy the generated token (you won't be able to see it again!)

### 5. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `SONAR_TOKEN`
   - **Value**: Paste your SonarCloud token
5. Click **Add secret**

### 6. Verify Configuration

The following files have been configured:

- `backend/sonar-project.properties` - Backend SonarCloud configuration
- `frontend/sonar-project.properties` - Frontend SonarCloud configuration
- `.github/workflows/backend-ci.yml` - Backend CI with SonarCloud scan
- `.github/workflows/frontend-ci.yml` - Frontend CI with SonarCloud scan

### 7. Test the Integration

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add SonarCloud integration"
   git push
   ```

2. Go to **Actions** tab in your GitHub repository
3. Watch the workflows run
4. Check SonarCloud dashboard for analysis results

## SonarCloud Dashboard

After the first successful scan, you can view your code quality metrics at:

- **Backend**: https://sonarcloud.io/project/overview?id=AbelMaminiaina_MHM-backend
- **Frontend**: https://sonarcloud.io/project/overview?id=AbelMaminiaina_MHM-frontend

## What SonarCloud Analyzes

- **Bugs**: Potential runtime errors
- **Vulnerabilities**: Security issues
- **Code Smells**: Maintainability issues
- **Coverage**: Test coverage percentage
- **Duplications**: Duplicate code blocks
- **Security Hotspots**: Security-sensitive code that needs review

## Quality Gates

SonarCloud uses Quality Gates to determine if your code meets quality standards:

- **Default Quality Gate**:
  - Coverage on new code ≥ 80%
  - Duplicated lines on new code ≤ 3%
  - Maintainability rating on new code = A
  - Reliability rating on new code = A
  - Security rating on new code = A

You can customize these thresholds in SonarCloud project settings.

## Badges (Optional)

Add SonarCloud badges to your README.md:

### Backend
```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AbelMaminiaina_MHM-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AbelMaminiaina_MHM-backend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AbelMaminiaina_MHM-backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AbelMaminiaina_MHM-backend)
```

### Frontend
```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AbelMaminiaina_MHM-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AbelMaminiaina_MHM-frontend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AbelMaminiaina_MHM-frontend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=AbelMaminiaina_MHM-frontend)
```

## Troubleshooting

### SonarCloud scan fails with authentication error
- Verify that `SONAR_TOKEN` secret is correctly set in GitHub
- Check that the token hasn't expired
- Regenerate the token if necessary

### Project key mismatch
- Ensure project keys in `sonar-project.properties` match those in SonarCloud
- Project key format: `organization_project_component`

### No coverage data
- Ensure tests generate coverage reports in LCOV format
- Check that `sonar.javascript.lcov.reportPaths` points to correct location
- For backend: `coverage/lcov.info`

## Additional Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarCloud GitHub Action](https://github.com/SonarSource/sonarcloud-github-action)
- [JavaScript/TypeScript Analysis](https://docs.sonarcloud.io/enriching/languages/javascript-typescript-css/)

## Support

For issues or questions:
- Check [SonarCloud Community](https://community.sonarsource.com/)
- Review GitHub Actions logs for detailed error messages
