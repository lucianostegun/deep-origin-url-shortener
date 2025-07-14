.PHONY: start stop

MAKEPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PWD := $(dir $(MAKEPATH))

TTY_PARAM := $(shell tty > /dev/null && echo "" || echo "-T")
WINPTY := $(shell command -v winpty && echo "winpty " ||  echo "")
COMPOSE_NETWORK := $(shell docker network ls | grep default | grep deeporigin | awk '{print $$2}' | tail -n 1)

ifneq ($(wildcard ./api/.env),)
	include ./api/.env
	export
endif

delete-network:
	docker network rm deeporigin_network

create-network:
	docker network create deeporigin_network

setup:
	make delete-network
	make create-network
	make build
	make start
	# Wait for services to be ready instead of arbitrary sleep
	@echo "Waiting for services to be ready..."
	@while ! docker-compose exec api curl -f http://localhost:3000/health 2>/dev/null; do \
			echo "Waiting for API..."; \
			sleep 5; \
	done
	make init-db

build: stop
	@echo "Building for $(ENV)..."
ifeq ($(ENV), production)
	docker-compose -f docker-compose-prod.yml build
else
	docker-compose build
endif

start: stop
	@echo "Starting for $(ENV)..."
ifeq ($(ENV), production)
	docker-compose -f docker-compose-prod.yml up -d
else
	docker-compose up -d
endif

stop:
	@echo "Stopping for $(ENV)..."
ifeq ($(ENV), production)
	docker-compose -f docker-compose-prod.yml down
else
	docker-compose down
endif

init-db:
	docker-compose exec api bash -c "npm run migration:run"
	docker-compose exec api bash -c "npm run seed:run"

init-testdb:
	docker-compose exec database bash -c "psql -U postgres -c 'DROP DATABASE IF EXISTS ${DATABASE_NAME}_test'"
	docker-compose exec database bash -c "psql -U postgres -c 'CREATE DATABASE ${DATABASE_NAME}_test'"
	docker-compose exec api bash -c "npm run test:migration:run"

bash:
	@echo "Bashing $(ENV)..."
	$(WINPTY)docker-compose exec $(TTY_PARAM) api bash

status:
	docker-compose ps
