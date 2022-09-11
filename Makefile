clean:
	rm -rf node_modules
	rm -rf dist

build: clean
	npm ci
	npm run build-ts
	#The db conf is mounted on the test container and must be world writable
	chmod 777 ./test/db/conf

test: build quick-test

quick-test:
	docker-compose up --build -d
	#TODO: There should be a better way to wait for the database to be available
	sleep 10 
	npm run test
	docker-compose down
