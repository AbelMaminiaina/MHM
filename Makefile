# Makefile for MHM Project Docker Commands

.PHONY: help dev prod up down logs build clean restart test

# Colors for output
YELLOW := \033[1;33m
GREEN := \033[1;32m
RED := \033[1;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "$(GREEN)MHM Project - Docker Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Usage:$(NC)"
	@echo "  make [command]"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	@echo "$(YELLOW)Starting development environment...$(NC)"
	docker compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@echo "Frontend: http://localhost:5173"
	@echo "Backend: http://localhost:5000"
	@echo "API Docs: http://localhost:5000/api-docs"

dev-build: ## Build and start development environment
	@echo "$(YELLOW)Building and starting development environment...$(NC)"
	docker compose -f docker-compose.dev.yml up -d --build

dev-down: ## Stop development environment
	@echo "$(YELLOW)Stopping development environment...$(NC)"
	docker compose -f docker-compose.dev.yml down
	@echo "$(GREEN)Development environment stopped!$(NC)"

dev-logs: ## Show development logs
	docker compose -f docker-compose.dev.yml logs -f

# Production commands
prod: ## Start production environment
	@echo "$(YELLOW)Starting production environment...$(NC)"
	docker compose up -d
	@echo "$(GREEN)Production environment started!$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"

prod-build: ## Build and start production environment
	@echo "$(YELLOW)Building and starting production environment...$(NC)"
	docker compose up -d --build

prod-down: ## Stop production environment
	@echo "$(YELLOW)Stopping production environment...$(NC)"
	docker compose down
	@echo "$(GREEN)Production environment stopped!$(NC)"

prod-logs: ## Show production logs
	docker compose logs -f

# General commands
up: dev ## Alias for dev (start development)

down: dev-down ## Alias for dev-down (stop development)

logs: dev-logs ## Alias for dev-logs (show development logs)

build: dev-build ## Alias for dev-build (build development)

# Service-specific logs
logs-backend: ## Show backend logs
	docker compose logs -f backend

logs-frontend: ## Show frontend logs
	docker compose logs -f frontend

logs-mongodb: ## Show MongoDB logs
	docker compose logs -f mongodb

# Service management
restart: ## Restart all services
	@echo "$(YELLOW)Restarting all services...$(NC)"
	docker compose restart
	@echo "$(GREEN)Services restarted!$(NC)"

restart-backend: ## Restart backend service
	docker compose restart backend

restart-frontend: ## Restart frontend service
	docker compose restart frontend

restart-mongodb: ## Restart MongoDB service
	docker compose restart mongodb

# Status
ps: ## Show running containers
	docker compose ps

status: ps ## Alias for ps

# Shell access
shell-backend: ## Access backend container shell
	docker compose exec backend sh

shell-frontend: ## Access frontend container shell
	docker compose exec frontend sh

shell-mongodb: ## Access MongoDB shell
	docker compose exec mongodb mongosh -u admin -p password123

# Testing
test: ## Run backend tests
	docker compose exec backend npm test

test-coverage: ## Run backend tests with coverage
	docker compose exec backend npm run test:coverage

lint-backend: ## Run backend linter
	docker compose exec backend npm run lint

lint-frontend: ## Run frontend linter
	docker compose exec frontend npm run lint

# Database
db-backup: ## Backup MongoDB database
	@echo "$(YELLOW)Backing up MongoDB...$(NC)"
	docker compose exec mongodb mongodump --out /backup
	docker cp mhm-mongodb:/backup ./mongodb-backup-$$(date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)Backup completed!$(NC)"

db-restore: ## Restore MongoDB database (requires BACKUP_DIR variable)
	@if [ -z "$(BACKUP_DIR)" ]; then \
		echo "$(RED)Error: BACKUP_DIR not specified$(NC)"; \
		echo "Usage: make db-restore BACKUP_DIR=./mongodb-backup-20240101"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring MongoDB from $(BACKUP_DIR)...$(NC)"
	docker cp $(BACKUP_DIR) mhm-mongodb:/backup
	docker compose exec mongodb mongorestore /backup
	@echo "$(GREEN)Restore completed!$(NC)"

# Cleanup
clean: ## Remove stopped containers and unused images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	docker compose down
	docker system prune -f
	@echo "$(GREEN)Cleanup completed!$(NC)"

clean-all: ## Remove everything including volumes (⚠️ DESTRUCTIVE)
	@echo "$(RED)⚠️  WARNING: This will remove all data!$(NC)"
	@read -p "Are you sure? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker compose down -v; \
		docker system prune -af --volumes; \
		echo "$(GREEN)Complete cleanup done!$(NC)"; \
	else \
		echo "$(YELLOW)Cleanup cancelled$(NC)"; \
	fi

clean-logs: ## Remove log files
	rm -rf backend/logs/*.log

# Health checks
health: ## Check health status of all services
	@echo "$(YELLOW)Checking service health...$(NC)"
	@docker compose ps
	@echo ""
	@echo "$(YELLOW)Backend health:$(NC)"
	@curl -s http://localhost:5000/health | json_pp || echo "$(RED)Backend not responding$(NC)"

# Update
pull: ## Pull latest images
	@echo "$(YELLOW)Pulling latest images...$(NC)"
	docker compose pull
	@echo "$(GREEN)Images updated!$(NC)"

update: pull prod-down prod ## Update and restart production

# Install
install: ## Initial setup (copy env file and start dev)
	@if [ ! -f .env.docker ]; then \
		echo "$(YELLOW)Creating .env.docker from example...$(NC)"; \
		cp .env.docker.example .env.docker; \
		echo "$(GREEN)Created .env.docker - please edit it with your values$(NC)"; \
		echo "$(YELLOW)Opening .env.docker for editing...$(NC)"; \
		$$EDITOR .env.docker || nano .env.docker || vim .env.docker; \
	fi
	@echo "$(YELLOW)Starting development environment...$(NC)"
	@make dev
