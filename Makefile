DOCKER_DEV=docker-compose.dev.yaml
DOCKER_PROD=docker-compose.prod.yaml

clean:
	docker-compose -f $(DOCKER_DEV) down
	docker-compose -f $(DOCKER_PROD) down

dev: clean
	docker-compose -f $(DOCKER_DEV) up --build	

prod: clean
	docker-compose -f $(DOCKER_PROD) up --build
