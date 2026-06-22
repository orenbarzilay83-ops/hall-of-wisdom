#!/bin/bash
set -euo pipefail

# רץ רק בסביבת ענן
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# תמיד חזור לענף העבודה הנכון
cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"
git checkout claude/app-cleanup-organization-mia9b2 2>/dev/null || true
echo "✅ Branch: $(git branch --show-current)"
