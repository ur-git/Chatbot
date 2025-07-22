# Angular Chatbot Application

A modern, responsive chatbot application built with Angular 17 and Ng-Zorro that provides course recommendations through AI-powered conversations.

## Tech Stack

- **Framework**: Angular 17
- **UI Library**: Ng-Zorro (Ant Design)
- **HTTP Client**: Angular HttpClient
- **Styling**: SCSS
- **API**: REST endpoints
- **Build Tool**: Angular CLI

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development Commands

```bash
# Development server
npm run start:dev

# Production build
npm run build:prod

# Development build
npm run build:dev

# Run tests
npm test
```

## Environment Configuration

The application supports multiple environments:

- **Development**: Local development with debug features
- **Production**: Optimized for production deployment

Configuration is managed through:

- `src/environments/environment.*.ts` files
- `src/assets/config/config-prod.json` centralized configuration

## Deployment

### For Databricks:

1. Update the configuration in `config-prod.json`
2. Build for production: `npm run build:prod`
3. Deploy the `dist/` folder to your Databricks environment

### For other environments:

1. Update the appropriate environment configuration
2. Build with the target environment: `npm run build:prod` or `npm run build:dev`
3. Deploy the built files
