DOCKER_DEV=docker-compose.dev.yaml

clean:
	docker-compose -f $(DOCKER_DEV) down

dev: clean
	docker-compose -f $(DOCKER_DEV) up --build	