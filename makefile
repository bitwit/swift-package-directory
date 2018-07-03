ifndef action
$(error "action" is not set, e.g. make run action=getPopularPackages)
endif

include .env
export $(shell sed 's/=.*//' .env)

MAC_TARGET_ARGS = -Xswiftc "-target" -Xswiftc "x86_64-apple-macosx10.12"

run:
	swift run $(MAC_TARGET_ARGS) --package-path actions/$(action) Action

deploy:
	./deploy.sh $(action)