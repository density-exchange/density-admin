GIT_REF := $(shell git rev-parse --short=7 HEAD)
VERSION ?= $(GIT_REF)
DOCKER_FILE_ADMIN := "Dockerfile"
ADMIN_REGISTRY := 083947760274.dkr.ecr.ap-south-1.amazonaws.com/admin-frontend
ADMIN_IMAGE := $(ADMIN_REGISTRY):$(VERSION)
LATEST :=latest
LATEST_IMAGE := $(ADMIN_REGISTRY):$(LATEST)


.PHONY: dependencies
dependencies:
	npm install

.PHONY: admin-container
admin-container:
	@docker build --platform=linux/amd64 -t $(ADMIN_IMAGE) \
			--build-arg BUILD_TYPE=$(BUILD_TYPE) \
			-f $(DOCKER_FILE_ADMIN) \
			.

.PHONY: get-ecr-credentials
get-ecr-credentials:
	aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin  083947760274.dkr.ecr.ap-south-1.amazonaws.com

.PHONY: docker-push-admin
docker-push-admin:
	docker push $(ADMIN_IMAGE)
	docker tag $(ADMIN_IMAGE) $(LATEST_IMAGE)
	docker push $(LATEST_IMAGE)

docker-run-local:
	docker run -p 3000:80 $(IMAGE)

.PHONY:run-https
run-https :
	HTTPS=true SSL_CRT_FILE=./.cert/cert.pem SSL_KEY_FILE=./.cert/key.pem react-scripts start
