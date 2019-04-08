

IMAGE := gregsidelinger/origins
VERSION := latest

.PHONY: build push 

# Alias targets
###############
build: docker.build
push: docker.push


docker.build:
	docker build . -t ${IMAGE}:${VERSION}

docker.push:
	docker push ${IMAGE}:${VERSION}
