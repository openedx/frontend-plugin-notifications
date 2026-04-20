TURBO = TURBO_TELEMETRY_DISABLED=1 turbo --dangerously-disable-package-manager-check

.PHONY: requirements
requirements:
	npm ci

clean:
	rm -rf dist

build:
	tsc --project tsconfig.build.json
	find src -type f \( -name '*.scss' -o -path '*/assets/*' \) -exec sh -c '\
	  for f in "$$@"; do \
	    d="dist/$${f#src/}"; \
	    mkdir -p "$$(dirname "$$d")"; \
	    cp "$$f" "$$d"; \
	  done' sh {} +
	tsc-alias -p tsconfig.build.json

# turbo.site.json is the standalone turbo config for this package.  It is
# renamed to avoid conflicts with turbo v2's workspace validation, which
# rejects root task syntax (//#) and requires "extends" in package-level
# turbo.json files, such as when running in a site repository. The targets
# below copy it into place before running turbo and clean up after.
turbo.json: turbo.site.json
	cp $< $@

# NPM doesn't bin-link workspace packages during install, so it must be done manually.
bin-link:
	[ -f packages/frontend-base/package.json ] && npm rebuild --ignore-scripts @openedx/frontend-base || true

build-packages: turbo.json
	$(TURBO) run build; rm -f turbo.json
	$(MAKE) bin-link

clean-packages: turbo.json
	$(TURBO) run clean; rm -f turbo.json

dev-packages: build-packages turbo.json
	$(TURBO) run watch:build dev:site; rm -f turbo.json

dev-site: bin-link
	npm run dev

i18n.extract:
	npm run-script i18n_extract

extract_translations: | requirements i18n.extract

pull_translations: | requirements
	npm run translations:pull -- --atlas-options="$(ATLAS_OPTIONS)"

detect_changed_source_translations:
	git diff --exit-code ./src/i18n

validate-no-uncommitted-package-lock-changes:
	git diff --exit-code package-lock.json
