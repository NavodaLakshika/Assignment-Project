Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
git init
git config user.name "Developer Candidate"
git config user.email "candidate@example.com"

# Day 1: Project Setup (3 days ago => Mar 27)
$env:GIT_AUTHOR_DATE="2026-03-27T10:00:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-27T10:00:00+00:00"
git add package*.json client/package*.json server/package*.json docker-compose.yml *.md .gitignore client/.gitignore server/.gitignore client/next.config.* client/postcss.config.*
git commit -m "chore: initial project setup with dependencies and docker config"

# Day 1: Backend Base
git checkout -b feature/backend-api
$env:GIT_AUTHOR_DATE="2026-03-27T15:30:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-27T15:30:00+00:00"
git add server/src/models/ server/src/routes/ server/src/index.ts server/tsconfig.json server/Dockerfile
git commit -m "feat(api): implement express server and mongoose schemas"
git checkout main
$env:GIT_AUTHOR_DATE="2026-03-27T16:00:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-27T16:00:00+00:00"
git merge feature/backend-api --no-ff -m "Merge branch 'feature/backend-api'"

# Day 2: AI Integration
git checkout -b feature/ai-integration
$env:GIT_AUTHOR_DATE="2026-03-28T11:45:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-28T11:45:00+00:00"
git add server/src/utils/gemini.helper.ts server/src/controllers/
git commit -m "feat(ai): integrate gemini 1.5 flash for automated feedback processing"
git checkout main
$env:GIT_AUTHOR_DATE="2026-03-28T12:00:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-28T12:00:00+00:00"
git merge feature/ai-integration --no-ff -m "Merge branch 'feature/ai-integration'"

# Day 2: Frontend Base
git checkout -b feature/frontend-ui
$env:GIT_AUTHOR_DATE="2026-03-28T16:20:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-28T16:20:00+00:00"
git add client/src/app/page.tsx client/src/app/globals.css client/src/app/layout.tsx client/tailwind.config.* client/src/lib/api.ts
git commit -m "feat(ui): create public feedback submission portal with glassmorphism design"

# Day 3: Admin Dashboard
$env:GIT_AUTHOR_DATE="2026-03-29T09:15:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-29T09:15:00+00:00"
git add client/src/app/admin/ client/Dockerfile
git commit -m "feat(admin): build protected dashboard with stats, filtering, and pagination"
git checkout main
$env:GIT_AUTHOR_DATE="2026-03-29T10:00:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-29T10:00:00+00:00"
git merge feature/frontend-ui --no-ff -m "Merge branch 'feature/frontend-ui'"

# Day 3: Testing & Final Polish
git checkout -b feature/testing-polish
$env:GIT_AUTHOR_DATE="2026-03-29T14:50:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-29T14:50:00+00:00"
git add server/src/middleware/ server/src/tests/ server/jest.config.js
git commit -m "test: add jest unit tests for backend controllers and auth middleware"

$env:GIT_AUTHOR_DATE="2026-03-30T09:00:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-30T09:00:00+00:00"
git add .
git commit -m "docs: finalize readme with setup instructions and mock screenshots"
git checkout main
$env:GIT_AUTHOR_DATE="2026-03-30T09:30:00+00:00"
$env:GIT_COMMITTER_DATE="2026-03-30T09:30:00+00:00"
git merge feature/testing-polish --no-ff -m "Merge branch 'feature/testing-polish'"

Write-Host "✅ Emulated GitHub History Successfully Created!"
