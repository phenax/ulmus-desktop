
example:
	cd example && yarn start

docs-serve:
	mdbook serve ./docs

docs-build:
	mdbook build ./docs

hl-install:
	rm -rf ./highlight.js/
	git clone https://github.com/highlightjs/highlight.js.git
	cd highlight.js && yarn


hl-build:
	cd highlight.js/ \
	  && node tools/build.js -t browser -n javascript typescript elm
	cp ./highlight.js/build/highlight.js ./docs/theme/


