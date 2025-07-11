.PHONY: start stop

MAKEPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PWD := $(dir $(MAKEPATH))

TTY_PARAM := $(shell tty > /dev/null && echo "" || echo "-T")
WINPTY := $(shell command -v winpty && echo "winpty " ||  echo "")
COMPOSE_NETWORK := $(shell docker network ls | grep default | grep deeporigin | awk '{print $$2}' | tail -n 1)

create-network:
	docker network create deeporigin_network

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

bash:
	@echo "Bashing $(ENV)..."
	$(WINPTY)docker-compose exec $(TTY_PARAM) newzzer-app bash

status:
	docker-compose ps
