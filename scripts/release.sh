#!/bin/bash
# chmod +x ./scripts/release.sh

# Output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display messages
print_success() {
    printf "${GREEN}✅ %s${NC}\n" "$1"
}

print_error() {
    printf "${RED}❌ %s${NC}\n" "$1"
}

print_info() {
    printf "${BLUE}%s${NC}\n" "$1"
}

print_warning() {
    printf "${YELLOW}⚠️  %s${NC}\n" "$1"
}

# Ask a yes/no question and keep asking until the user answers y or n.
# Reading the whole line avoids the leftover newline problem of `read -n 1`,
# which could answer the next prompt with an empty value and skip a step.
confirm() {
    local PROMPT="$1"
    local REPLY

    while true; do
        read -r -p "${PROMPT} (y/n): " REPLY
        case "$REPLY" in
            [Yy]|[Yy][Ee][Ss]) return 0 ;;
            [Nn]|[Nn][Oo]) return 1 ;;
            *) print_warning "Please answer 'y' or 'n'." ;;
        esac
    done
}

# Restore the CHANGELOG backup created during the release.
restore_changelog_backup() {
    if [ -f CHANGELOG.md.bak ]; then
        mv CHANGELOG.md.bak CHANGELOG.md
    fi
}

# Restore the files modified by the release from HEAD.
# Requires a clean working tree before releasing, so this never discards user work.
restore_release_files() {
    git checkout HEAD -- $RELEASE_FILES > /dev/null 2>&1
}

# Undo the local release commit and tag, then restore files.
# Safe to call only after RELEASE_COMMIT exists (and before pushing).
rollback_release() {
    print_warning "Cancelling release and rolling back..."

    if [ -n "$NEW_VERSION" ]; then
        git tag -d "v${NEW_VERSION}" > /dev/null 2>&1
    fi

    if [ -n "$RELEASE_COMMIT" ]; then
        git reset --mixed "${RELEASE_COMMIT}^" > /dev/null 2>&1
    fi

    restore_release_files
    rm -f CHANGELOG.md.bak

    print_success "Rollback done: commit, tag and version changes reverted."
    print_info "Back to ${CURRENT_VERSION}."
    exit 1
}

# Run a validation command and stop the release if it fails.
# Validations never modify release files, so failing here leaves the repo untouched.
run_validation() {
    local NAME="$1"
    shift
    local START_TIME END_TIME ELAPSED

    START_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')

    if "$@" > /dev/null 2>&1; then
        END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
        ELAPSED=$(echo "$END_TIME - $START_TIME" | bc)
        print_success "${NAME}: OK (${ELAPSED}s)"
        return 0
    fi

    print_error "${NAME}: FAILED"
    echo ""
    print_error "Run '$*' to see details."
    print_warning "Release stopped. No version, commit or tag was created."
    echo ""
    exit 1
}

# ============================================
# GIT VALIDATIONS
# ============================================

# Verify we are in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "You are not in a Git repository"
    exit 1
fi

# Verify there are no uncommitted changes.
# npm version refuses to run on a dirty tree and the release commit would
# otherwise include unrelated work, making rollback unsafe.
if [[ -n $(git status -s) ]]; then
    print_error "You have uncommitted changes"
    print_warning "Commit or stash them before releasing."
    exit 1
fi

RELEASE_FILES="CHANGELOG.md package.json"
[ -f package-lock.json ] && RELEASE_FILES="$RELEASE_FILES package-lock.json"

# ============================================
# CODE QUALITY VALIDATIONS
# ============================================

echo ""
print_info "Running validations..."
echo ""

run_validation "1/3 Lint" npm run lint
run_validation "2/3 Unit tests" npm test
run_validation "3/3 Build" npm run build

echo ""
print_success "🎉 All validations passed successfully"
echo ""

BUILD_DONE=true
PUBLISH_DONE=false
PUSH_DONE=false
RELEASE_COMMIT=""

# ============================================
# RELEASE PROCESS
# ============================================

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")
print_info "Current version: ${CURRENT_VERSION}"

# Split MAJOR.MINOR.PATCH
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Ask version type
echo ""
echo "What type of version do you want to release?"
echo "  1) Patch   (${MAJOR}.${MINOR}.$((PATCH + 1))) - Bug fixes"
echo "  2) Minor   (${MAJOR}.$((MINOR + 1)).0) - New features"
echo "  3) Major   ($((MAJOR + 1)).0.0) - Breaking changes"
echo ""
read -p "Select (1/2/3): " VERSION_TYPE

case $VERSION_TYPE in
    1)
        NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
        VERSION_NAME="patch"
        ;;
    2)
        NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
        VERSION_NAME="minor"
        ;;
    3)
        NEW_VERSION="$((MAJOR + 1)).0.0"
        VERSION_NAME="major"
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

print_success "New version: ${NEW_VERSION}"

# Make sure the tag does not exist yet
if git rev-parse "v${NEW_VERSION}" > /dev/null 2>&1; then
    print_error "Tag v${NEW_VERSION} already exists"
    exit 1
fi

# Get the last release commit and group every commit since then automatically
LAST_VERSION_COMMIT=$(git log --grep="^\[version\]" -n 1 --format="%H" 2>/dev/null)

if [ -z "$LAST_VERSION_COMMIT" ]; then
    COMMIT_RANGE="HEAD"
    AVAILABLE_COMMITS=$(git rev-list --count HEAD)
else
    COMMIT_RANGE="${LAST_VERSION_COMMIT}..HEAD"
    AVAILABLE_COMMITS=$(git rev-list --count "$COMMIT_RANGE")
fi

if [ "$AVAILABLE_COMMITS" -eq 0 ]; then
    print_error "No new commits since last version"
    exit 1
fi

COMMIT_COUNT=$AVAILABLE_COMMITS

print_info "Available commits (unversioned): ${AVAILABLE_COMMITS}"
echo ""
print_info "Commits to include in CHANGELOG:"
git log "$COMMIT_RANGE" --pretty=format:"  %h - %s (%an)"
echo ""
echo ""
if ! confirm "Are these commits correct?"; then
    print_warning "Operation cancelled"
    exit 1
fi

# Get current date
TODAY=$(date +%Y-%m-%d)

# Create CHANGELOG content
CHANGELOG_CONTENT=""

# Get commits and categorize them
ADDED=""
CHANGED=""
FIXED=""
OTHER=""

# Save commits in temporary variable
COMMITS=$(git log "$COMMIT_RANGE" --pretty=format:"%s")

# Read commits without cleaning prefixes
while IFS= read -r commit_msg; do
    # Detect commit type by keywords (without modifying the message)
    if [[ $commit_msg =~ ^\[(feature|feat|add|new)\] ]] || [[ $commit_msg =~ ^(feat|feature|add|new): ]] || [[ $commit_msg =~ [Aa]dded|[Nn]ew|[Ff]eature ]]; then
        ADDED="${ADDED}- ${commit_msg}\n"
    elif [[ $commit_msg =~ ^\[(fix|bugfix|hotfix)\] ]] || [[ $commit_msg =~ ^(fix|bugfix|hotfix): ]] || [[ $commit_msg =~ [Ff]ix|[Bb]ug|[Cc]orrect ]]; then
        FIXED="${FIXED}- ${commit_msg}\n"
    elif [[ $commit_msg =~ ^\[(chore|refactor|update|change)\] ]] || [[ $commit_msg =~ ^(chore|refactor|update|change): ]] || [[ $commit_msg =~ [Uu]pdate|[Cc]hange|[Rr]efactor|[Ii]mprove ]]; then
        CHANGED="${CHANGED}- ${commit_msg}\n"
    else
        OTHER="${OTHER}- ${commit_msg}\n"
    fi
done <<< "$COMMITS"

# Build categorized content
CHANGELOG_ENTRY="## [${NEW_VERSION}] - ${TODAY}\n\n"

if [ -n "$ADDED" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}### Added\n${ADDED}\n"
fi

if [ -n "$CHANGED" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}### Changed\n${CHANGED}\n"
fi

if [ -n "$FIXED" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}### Fixed\n${FIXED}\n"
fi

if [ -n "$OTHER" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}### Other\n${OTHER}\n"
fi

CHANGELOG_CONTENT="${CHANGELOG_ENTRY}---\n\n"

# Create CHANGELOG backup
cp CHANGELOG.md CHANGELOG.md.bak
print_info "Backup created: CHANGELOG.md.bak"

# Read current CHANGELOG
CURRENT_CHANGELOG=$(<CHANGELOG.md)

# Find first version entry and add new one before it
UPDATED_CHANGELOG=$(echo "$CURRENT_CHANGELOG" | awk -v new_version="$CHANGELOG_CONTENT" '
BEGIN { added=0 }
/^## \[[0-9]+\.[0-9]+\.[0-9]+\]/ {
    if (!added) {
        print new_version
        added=1
    }
}
{ print }
')

# If no version found, add at the end
if [[ ! "$UPDATED_CHANGELOG" =~ "## [${NEW_VERSION}]" ]]; then
    UPDATED_CHANGELOG="${CURRENT_CHANGELOG}\n${CHANGELOG_CONTENT}"
fi

# Write new CHANGELOG
printf '%b' "$UPDATED_CHANGELOG" > CHANGELOG.md

print_success "CHANGELOG.md updated"

# Show preview
echo ""
print_info "CHANGELOG preview:"
echo "─────────────────────────────────────────"
head -n 40 CHANGELOG.md
echo "─────────────────────────────────────────"
echo ""

# Confirm before bumping version and committing
if ! confirm "Do you want to publish version ${NEW_VERSION}?"; then
    print_warning "Operation cancelled. Restoring backup..."
    restore_changelog_backup
    exit 1
fi

# Update package.json
if ! npm version "$NEW_VERSION" --no-git-tag-version > /dev/null 2>&1; then
    print_error "Failed to update package.json to ${NEW_VERSION}"
    restore_changelog_backup
    restore_release_files
    exit 1
fi
print_success "package.json updated to ${NEW_VERSION}"

# Commit with structure [version] X.X.X
if ! git add $RELEASE_FILES; then
    print_error "git add failed"
    restore_changelog_backup
    restore_release_files
    exit 1
fi

if ! git commit -m "[version] ${NEW_VERSION}"; then
    print_error "git commit failed"
    restore_changelog_backup
    restore_release_files
    exit 1
fi

RELEASE_COMMIT=$(git rev-parse HEAD)

if ! git tag -a "v${NEW_VERSION}" -m "Release ${NEW_VERSION}"; then
    print_error "git tag failed"
    rollback_release
fi

print_success "Commit and tag created"

# ============================================
# PUBLISH
# ============================================

echo ""
print_info "Publishing package..."

while true; do

    # Verify npm authentication before publishing.
    # npm answers 404 on PUT when the token is missing/expired or the
    # account has no permission over the package scope.
    if ! npm whoami > /dev/null 2>&1; then
        print_error "You are not authenticated with npm (or your token expired)."
        print_warning "A 404 on publish usually means this."
        echo ""
        if confirm "Do you want to run 'npm login' now?"; then
            npm login
            continue
        fi

        print_error "Publish skipped: no valid npm session."
        print_warning "Your release commit is SAFE."
        print_warning "Your tag is SAFE."
    else
        print_info "Publishing package..."

        if npm publish; then
            PUBLISH_DONE=true
            print_success "Package published"
            break
        fi

        print_error "Publish failed"
        echo ""
        print_warning "Your release commit is SAFE."
        print_warning "Your tag is SAFE."
        echo ""
        print_warning "If it was 401/404: run 'npm login' and make sure your account owns the scope."
    fi

    echo ""
    echo "1) Retry publish"
    echo "2) Log in and retry"
    echo "3) Continue (keep commit and tag)"
    echo "4) Rollback (undo commit, tag and files)"
    echo ""
    read -p "Select: " PUBLISH_OPTION

    case $PUBLISH_OPTION in
        1)
            ;;
        2)
            npm login
            ;;
        3)
            print_warning ""
            print_warning "Release paused."
            print_warning "Nothing has been lost."
            print_warning ""
            print_warning "Continue later with:"
            echo ""
            echo "npm publish"
            echo "git push origin master --tags"
            echo ""
            rm -f CHANGELOG.md.bak
            exit 0
            ;;
        4)
            if npm view "${PACKAGE_NAME}@${NEW_VERSION}" version > /dev/null 2>&1; then
                print_error "Version ${NEW_VERSION} is already on npm; rollback would not unpublish it."
                print_warning "Keeping the local commit and tag."
            else
                rollback_release
            fi
            ;;
        *)
            print_warning "Invalid option"
            ;;
    esac

done

# ============================================
# PUSH
# ============================================

echo ""
if confirm "Do you want to push commit and tag?"; then

while true; do

    print_info "Pushing to remote..."

    if git push origin master --tags; then
        PUSH_DONE=true
        print_success "Push completed"
        break
    fi

    print_error "Push failed"
    echo ""
    print_warning "Commit and tag are still stored locally."
    echo ""
    echo "1) Retry push"
    echo "2) Finish release (keep local commit/tag)"
    echo ""
    read -p "Select: " PUSH_OPTION

    case $PUSH_OPTION in
        1)
            ;;
        2)
            print_warning ""
            print_warning "Release paused."
            print_warning "Nothing has been lost."
            print_warning ""
            print_warning "Continue later with:"
            echo ""
            echo "git push origin master --tags"
            echo ""
            rm -f CHANGELOG.md.bak
            exit 0
            ;;
        *)
            print_warning "Invalid option"
            ;;
    esac

done

fi

# ============================================
# CLEANUP
# ============================================

rm -f CHANGELOG.md.bak

echo ""
print_success "🎉 Release ${NEW_VERSION} finished!"
echo ""

print_info "Summary:"
echo ""

echo "  Version : ${CURRENT_VERSION} → ${NEW_VERSION}"
echo "  Commits : ${COMMIT_COUNT}"
echo "  Tag     : v${NEW_VERSION}"

if $BUILD_DONE; then
    echo "  Build   : ✓"
else
    echo "  Build   : Skipped"
fi

if $PUBLISH_DONE; then
    echo "  Publish : ✓"
else
    echo "  Publish : Skipped"
fi

if $PUSH_DONE; then
    echo "  Push    : ✓"
else
    echo "  Push    : Skipped"
fi

echo ""
print_success "Release completed successfully."
echo ""
