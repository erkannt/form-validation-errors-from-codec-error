.PHONY: all check test lint format fix build

all: fix check

check: test lint format

test: node_modules
	npx jest

lint: node_modules
	npx tsc --noEmit
	npx eslint

format: node_modules
	npx prettier --ignore-unknown --check .

fix: node_modules
	npx eslint --fix
	npx prettier --write .

build: node_modules
	npx tsc --project tsconfig.build.json

node_modules: package.json package-lock.json
	npm install
	touch node_modules