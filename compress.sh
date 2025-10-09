zip -r $(basename "$PWD")-$(date -j "+%y%m%d-%H%M").zip . -x "*/node_modules/*" "_ignore/*"
