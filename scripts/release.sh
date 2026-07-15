# chmod +x ./scripts/release.sh

#!/bin/bash

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

# ============================================
# CODE QUALITY VALIDATIONS
# ============================================

echo ""
print_info "Running code quality validations..."
echo ""

# 1. Run Lint
print_info "1/2 Running lint..."
START_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
if npm run lint > /dev/null 2>&1; then
    END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
    ELAPSED=$(echo "$END_TIME - $START_TIME" | bc)
    print_success "Lint: OK (${ELAPSED}s)"
else
    print_error "Lint: FAILED"
    echo ""
    print_error "Run 'npm run lint' to see details."
    echo ""
    exit 1
fi

# 2. Run Unit Tests
print_info "2/2 Running unit tests..."
START_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
if npm test > /dev/null 2>&1; then
    END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
    ELAPSED=$(echo "$END_TIME - $START_TIME" | bc)
    print_success "Unit tests: OK (${ELAPSED}s)"
else
    print_error "Unit tests: FAILED"
    echo ""
    print_error "Run 'npm test' to see details."
    echo ""
    exit 1
fi

echo ""
print_success "🎉 All validations passed successfully"
echo ""

# ============================================
# GIT VALIDATIONS
# ============================================

# Verify we are in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "You are not in a Git repository"
    exit 1
fi

# Verify there are no uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ============================================
# RELEASE PROCESS
# ============================================

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
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

# Count available commits until finding a [version]
AVAILABLE_COMMITS=0
FOUND_VERSION=false

COMMIT_LIST=$(git log --pretty=format:"%s")
while IFS= read -r commit_msg; do
    if [[ $commit_msg =~ ^\[version\] ]]; then
        FOUND_VERSION=true
        break
    fi
    ((AVAILABLE_COMMITS++))
done <<EOF
$COMMIT_LIST
EOF

if [ "$AVAILABLE_COMMITS" -eq 0 ]; then
    print_error "No new commits since last version"
    exit 1
fi

print_info "Available commits (unversioned): ${AVAILABLE_COMMITS}"

# Ask how many commits to include
echo ""
read -p "How many commits do you want to include in CHANGELOG? (1-${AVAILABLE_COMMITS}): " COMMIT_COUNT

# Validate number
if ! [[ "$COMMIT_COUNT" =~ ^[0-9]+$ ]] || [ "$COMMIT_COUNT" -lt 1 ] || [ "$COMMIT_COUNT" -gt "$AVAILABLE_COMMITS" ]; then
    print_error "Invalid number of commits (must be between 1 and ${AVAILABLE_COMMITS})"
    exit 1
fi

# Show commits to include
echo ""
print_info "Commits to include:"
git log -n "$COMMIT_COUNT" --pretty=format:"%h - %s (%an)" --abbrev-commit
echo ""
echo ""
read -p "Are these commits correct? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
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
COMMITS=$(git log -n "$COMMIT_COUNT" --pretty=format:"%s")

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

# Confirm before continuing
read -p "Do you want to continue with the release? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Operation cancelled. Restoring backup..."
    mv CHANGELOG.md.bak CHANGELOG.md
    exit 1
fi

# Update package.json
npm version "$NEW_VERSION" --no-git-tag-version > /dev/null 2>&1
print_success "package.json updated to ${NEW_VERSION}"

# Commit with structure [version] X.X.X
git add CHANGELOG.md package.json package-lock.json
git commit -m "[version] ${NEW_VERSION}"
git tag -a "v${NEW_VERSION}" -m "Release ${NEW_VERSION}"

print_success "Commit and tag created"

# ============================================
# BUILD
# ============================================

BUILD_DONE=false
PUBLISH_DONE=false
PUSH_DONE=false

echo ""
read -p "Do you want to prepare the build? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then

while true; do

    print_info "Building package..."

    if npm run build; then
        BUILD_DONE=true
        print_success "Build completed"
        break
    fi

    print_error "Build failed"
    echo ""
    echo "1) Retry build"
    echo "2) Continue without build"
    echo "3) Finish release (keep commit and tag)"
    echo ""
    read -p "Select: " BUILD_OPTION

    case $BUILD_OPTION in
        1)
            ;;
        2)
            break
            ;;
        3)
            print_warning "Release paused."
            print_warning "Commit and tag are safe."
            print_warning "Run 'npm run build' later."
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
# PUBLISH
# ============================================

echo ""
read -p "Do you want to publish the package? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then

while true; do

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
    echo "1) Retry publish"
    echo "2) Finish release (keep commit and tag)"
    echo ""
    read -p "Select: " PUBLISH_OPTION

    case $PUBLISH_OPTION in
        1)
            ;;
        2)
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
        *)
            print_warning "Invalid option"
            ;;
    esac

done

fi

# ============================================
# PUSH
# ============================================

echo ""
read -p "Do you want to push commit and tag? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then

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