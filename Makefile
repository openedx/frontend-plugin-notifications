intl_imports = ./node_modules/.bin/intl-imports.js
transifex_utils = ./node_modules/.bin/transifex-utils.js
i18n = ./src/i18n
transifex_input = $(i18n)/transifex_input.json

# This directory must match .babelrc .
transifex_temp = ./temp/babel-plugin-formatjs

build:
	rm -rf ./dist
	./node_modules/.bin/fedx-scripts babel src --out-dir dist --source-maps --ignore **/*.test.jsx,**/*.test.js,**/setupTest.jsx --copy-files
	@# --copy-files will bring in everything else that wasn't processed by babel. Remove what we don't want.
	@find dist -name '*.test.js*' -delete
	cp ./package.json ./dist/package.json
	cp ./LICENSE ./dist/LICENSE
	cp ./README.rst ./dist/README.rst

precommit:
	npm run lint
	npm audit

requirements:
	npm ci

i18n.extract:
	# Pulling display strings from .jsx files into .json files...
	rm -rf $(transifex_temp)
	npm run-script i18n_extract

i18n.concat:
	# Gathering JSON messages into one file...
	$(transifex_utils) $(transifex_temp) $(transifex_input)

extract_translations: | requirements i18n.extract i18n.concat

# Despite the name, we actually need this target to detect changes in the incoming translated message files as well.
detect_changed_source_translations:
	# Checking for changed translations...
	git diff --exit-code $(i18n)

# Pulls translations using atlas.
pull_translations:
	mkdir src/i18n/messages
	cd src/i18n/messages \
	   && atlas pull $(ATLAS_OPTIONS) \
	            translations/frontend-platform/src/i18n/messages:frontend-platform \
	            translations/paragon/src/i18n/messages:paragon \
	            translations/frontend-plugin-notifications/src/i18n/messages:frontend-plugin-notifications

	$(intl_imports) frontend-platform paragon frontend-plugin-notifications

