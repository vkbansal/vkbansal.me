#! /bin/bash
COMMIT_HASH=HEAD
COMMIT=$(git show --pretty=short -s $COMMIT_HASH)

if grep -q "Author: dependabot" <<< "$COMMIT"; then
  echo "It's bot"
  exit 0
else
  echo "Not a bot"
fi

exit 1
