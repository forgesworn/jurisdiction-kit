#!/bin/sh
# project-inventory.sh: print the facts about a project that decide which
# law applies to it. It searches; it does not judge. Read-only.
#
# Usage: project-inventory.sh [project directory]   (default: the current one)
#
# The last section sets what the code does beside what the project's legal
# documents say, so that what they leave out can be seen.
#
# Every line of evidence is path:line, relative to the project. Tests,
# fixtures, tooling, build output and dependencies are left out, because they
# are full of placeholder hosts. Legal documents are left out of every search but the
# last, because a document being checked is not evidence of what the code does.
set -eu

# Bytes, not characters: every tool then agrees, on every system, and text in
# any encoding passes through. Lines are shortened only at a space, which is
# never part of a longer character, so nothing is cut in half.
LC_ALL=C
export LC_ALL

project=${1:-.}
if [ ! -d "$project" ]; then
  echo "Not a directory: $project" >&2
  exit 1
fi
cd -- "$project"

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT HUP INT TERM

# Tracked files where there is a repository, so ignored output never shows.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git ls-files > "$work/all"
else
  find . -type f | sed 's#^\./##' > "$work/all"
fi

skip='(^|/)(node_modules|dist|build|out|coverage|vendor|target|\.git|test|tests|__tests__|e2e|fixtures|vectors|test-results|playwright-report)/|\.(test|spec|bench)\.[a-z]+$|(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock)$'
legal='(^|/)(legal|privacy|terms|report)(/|$)|(^|/)(PRIVACY|TERMS)[^/]*$'
source='\.(ts|tsx|js|jsx|mjs|cjs|html|vue|svelte|kt|kts|swift|py|rs|go|java|rb|php)$'
config='\.(ya?ml|toml|conf|service|timer|env\.example|json)$|(^|/)(Caddyfile|Dockerfile|nginx)[^/]*$'

grep -Ev "$skip" "$work/all" | grep -Ev "$legal" > "$work/kept" || true
# Tooling and continuous integration name hosts the product never contacts.
tooling='(^|/)(scripts|tools|bench|benchmarks|examples|\.github|\.circleci|\.gitlab)/'
grep -E "$source" "$work/kept" | grep -Ev "$tooling" > "$work/source" || true
grep -E "$source|$config" "$work/kept" | grep -Ev "$tooling" > "$work/code" || true

# search <file list> <pattern> [grep flags]: matches as path:line:text.
search() {
  list=$1; pattern=$2; flags=${3:-}
  [ -s "$list" ] || return 0
  # shellcheck disable=SC2086
  tr '\n' '\0' < "$list" | xargs -0 grep -nE $flags -- "$pattern" /dev/null 2>/dev/null || true
}

# clip <n>: shorten each line to about n bytes, at a space.
clip() {
  awk -v n="$1" '{
    if (length($0) <= n) { print; next }
    line = substr($0, 1, n); sub(/ [^ ]*$/, "", line); print line " ..."
  }'
}

heading() { printf '\n## %s\n\n' "$1"; }
none() { echo "(none found)"; }

echo "# Project inventory"
echo
echo "Project: $(basename "$(pwd -P)")"
echo "Files searched: $(wc -l < "$work/code" | tr -d ' ') of $(wc -l < "$work/all" | tr -d ' ')"
echo "Left out: tests, fixtures, tooling, build output, dependencies, lock files, prose,"
echo "and, until section 13, the project's own legal documents."

heading "1. Hosts named in code and config"
echo "Every host a device or server is told to contact. host, times named, first place"
echo "(the first that is not a comment, where there is one)."
echo
search "$work/code" '(wss?|https?)://[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(stuns?|turns?):[A-Za-z0-9.-]+\.[A-Za-z]{2,}' \
  | awk '
      {
        split($0, head, ":")
        where = head[1] ":" head[2]
        text = $0; sub(/^[^:]*:[^:]*:/, "", text)
        comment = (text ~ /^[ \t]*(\/\/|\/\*|\*|#|<!--)/)
        while (match(text, /((wss?|https?):\/\/|(stuns?|turns?):)[A-Za-z0-9.-]+\.[A-Za-z][A-Za-z]+/)) {
          host = tolower(substr(text, RSTART, RLENGTH))
          text = substr(text, RSTART + RLENGTH)
          sub(/^[a-z]+:\/\//, "", host); sub(/^(stuns?|turns?):/, "", host)
          if (host ~ /(^|\.)example(\.|$)|\.test$|\.invalid$|\.local$|^localhost|w3\.org$|schema\.org$|json-schema\.org$|mozilla\.org$|github\.com$|githubusercontent\.com$|npmjs\.(com|org)$|shields\.io$/) continue
          if (!(host in first)) { first[host] = where; incomment[host] = comment; order[++n] = host }
          else if (incomment[host] && !comment) { first[host] = where; incomment[host] = 0 }
          count[host]++
        }
      }
      END { for (i = 1; i <= n; i++) printf "%s\t%d\t%s\n", order[i], count[order[i]], first[order[i]] }
    ' > "$work/hosts"
if [ -s "$work/hosts" ]; then sort "$work/hosts"; else none; fi

heading "2. Hosts built at run time"
echo "Addresses assembled from a variable. The host depends on data; read each one."
echo
search "$work/source" '(wss?|https?)://\$\{|(wss?|https?)://["'"'"'] *\+' | clip 200 | head -40 > "$work/dynamic"
if [ -s "$work/dynamic" ]; then cat "$work/dynamic"; else none; fi

heading "3. What could be deployed"
echo "Present is not deployed. These show what the operator may run."
echo
grep -E '(^|/)(deploy|infra|ops|server|docker|k8s|helm|terraform)/|(^|/)(Caddyfile|Dockerfile|docker-compose|nginx)[^/]*$|\.(service|timer)$' "$work/all" \
  | grep -Ev "$skip" | head -80 > "$work/deploy" || true
if [ -s "$work/deploy" ]; then cat "$work/deploy"; else none; fi

heading "4. Dependencies that send data somewhere, or take money"
grep -E '(^|/)package\.json$|(^|/)(requirements\.txt|pyproject\.toml|Cargo\.toml|go\.mod|build\.gradle(\.kts)?|Podfile|Gemfile)$' "$work/kept" > "$work/manifests" || true
search "$work/manifests" 'anthropic|openai|ollama|mistral|cohere|gemini|whisper|sentry|posthog|mixpanel|segment|amplitude|plausible|firebase|google-analytics|gtag|datadog|bugsnag|stripe|paypal|braintree|lnurl|bolt11|webln|l402|lightning' -i \
  | clip 200 > "$work/deps"
if [ -s "$work/deps" ]; then cat "$work/deps"; else none; fi

heading "5. Money"
echo "Files and folders named for payment. A kit that is present may not be switched on."
echo
grep -Ei '(^|/)[^/]*(l402|lightning|invoice|payment|billing|checkout|subscription|pricing|donat|stripe|paypal)[^/]*(/|$)' "$work/kept" | head -30 > "$work/money" || true
if [ -s "$work/money" ]; then cat "$work/money"; else none; fi
echo
echo "Payment addresses named in code:"
echo
search "$work/code" '[A-Za-z0-9._-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}' \
  | grep -Ei 'lightning|lnurl|lud16|donat|tips?[^a-z]|zap|payee|pay to' | clip 200 | head -10 > "$work/payees" || true
if [ -s "$work/payees" ]; then cat "$work/payees"; else none; fi

heading "6. Keys held by something the operator may run"
grep -E '(^|/)(deploy|infra|ops|server)/' "$work/all" | grep -Ev "$skip" > "$work/ops" || true
search "$work/ops" '(room|content|traffic|message|media|file)[ _-]*\*?(key|secret)' -i | clip 220 > "$work/keylines"
denies='never|cannot|can not|refus|without|nothing|n.t | not | no (room|content|traffic|message|media|file)'
grep -Ei '(does|do)\*? +hold|holds?[^a-z]|holding|keeps? (the|a|its) ' "$work/keylines" | grep -Eiv "$denies" | head -20 > "$work/holds" || true
grep -Fvx -f "$work/holds" "$work/keylines" | head -15 > "$work/keyrest" || true
echo "Says it holds one:"
echo
if [ -s "$work/holds" ]; then
  cat "$work/holds"
  echo
  echo "=> Something the operator may run holds a key to content. It can read what it"
  echo "   serves. A claim that the operator cannot read content is true only of the"
  echo "   conversations that component does not serve."
else
  none
fi
echo
echo "Says it does not, or only mentions one:"
echo
if [ -s "$work/keyrest" ]; then cat "$work/keyrest"; else none; fi

heading "7. Agents, bots and transcription"
echo "Code that hands content to a model or a transcriber. Find out where each one sends it."
echo
search "$work/source" 'messages\.create|chat\.completions|/api/chat|/api/generate|/v1/messages|/v1/chat|/transcribe|speech[- ]to[- ]text' -i \
  | clip 200 | head -20 > "$work/agents"
if [ -s "$work/agents" ]; then cat "$work/agents"; else none; fi

heading "8. Stored on the device"
for api in localStorage sessionStorage indexedDB 'document\.cookie' SharedPreferences UserDefaults; do
  found=$(search "$work/source" "$api" | wc -l | tr -d ' ')
  [ "$found" -gt 0 ] && printf '%s\t%s uses\t%s\n' "$api" "$found" "$(search "$work/source" "$api" | head -n 1 | cut -d: -f1,2)"
done > "$work/storage"
if [ -s "$work/storage" ]; then cat "$work/storage"; else none; fi

heading "9. Analytics and tracking in code"
search "$work/source" '\b(gtag|posthog|mixpanel|plausible|sentry|amplitude)\b *[.(]|google-analytics\.com|googletagmanager' -i \
  | clip 200 | head -20 > "$work/tracking"
if [ -s "$work/tracking" ]; then cat "$work/tracking"; else none; fi

heading "10. Accounts and age"
search "$work/source" 'sign ?up|create (an )?account|date of birth|birthdate|age (gate|check|verif)|minimum age|(over|under) 1[368]|years old' -i \
  | clip 200 | head -20 > "$work/age"
if [ -s "$work/age" ]; then cat "$work/age"; else none; fi

heading "11. Finding other people and their content"
echo "A way to find strangers or their content. Search inside a conversation a person is already in does not count."
echo
search "$work/source" 'trending|recommended for you|(room|user|people|member|public) directory|(discover|browse) (rooms|people|users|channels)|search (for )?(users|people|rooms)' -i \
  | clip 200 | head -20 > "$work/discovery"
if [ -s "$work/discovery" ]; then cat "$work/discovery"; else none; fi

heading "12. Dates"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "First commit:        $(git log --reverse --format='%ad %s' --date=short | head -n 1)"
  first_deploy=$(git log --reverse --format='%ad %s' --date=short -- deploy infra ops 2>/dev/null | head -n 1)
  echo "First deploy commit: ${first_deploy:-(none found)}"
  first_tag=$(git for-each-ref --sort=creatordate --format='%(creatordate:short) %(refname:short)' refs/tags | head -n 1)
  echo "First tag:           ${first_tag:-(none found)}"
else
  echo "(not a git repository)"
fi

heading "13. Legal documents already here"
echo "Listed so they can be checked. They are not evidence for anything above."
echo
grep -E "$legal" "$work/all" | grep -Ev "$skip" | grep -E '\.(md|html|txt)$' | head -40 > "$work/legal" || true
if [ -s "$work/legal" ]; then
  cat "$work/legal"
  echo
  echo "Open markers:"
  for marker in DECISION INPUT 'LEGAL REVIEW' UNVERIFIED 'OWNER TO DO'; do
    found=$(search "$work/legal" "\[$marker" -o | wc -l | tr -d ' ')
    printf '  [%s\t%s\n' "$marker]" "$found"
  done
  echo
  echo "Who the documents say runs it:"
  search "$work/legal" '\b(run by|operated by|provided by|controller)\b' -i | clip 200 | head -8
else
  none
fi

heading "14. Cross-check: what the legal documents do not say"
if [ ! -s "$work/legal" ]; then
  echo "(no legal documents to check)"
  exit 0
fi
tr '\n' '\0' < "$work/legal" | xargs -0 cat 2>/dev/null | tr 'A-Z' 'a-z' > "$work/said"

says() { grep -Eq -- "$1" "$work/said"; }
quote() { search "$work/legal" "$1" -i | clip 200 | head -n "${2:-6}"; }

echo "Hosts from section 1 that no legal document names. Each is a third party the"
echo "documents must cover, by name or by kind, unless the operator runs it:"
echo
cut -f1 "$work/hosts" 2>/dev/null | sort -u | while IFS= read -r host; do
  [ -n "$host" ] || continue
  grep -Fq -- "$host" "$work/said" || printf '  %s\t%s\n' "$host" "$(awk -F'\t' -v h="$host" '$1 == h { print $3; exit }' "$work/hosts")"
done > "$work/unnamed"
if [ -s "$work/unnamed" ]; then cat "$work/unnamed"; else echo "  (every host is named)"; fi

if [ -s "$work/dynamic" ]; then
  echo
  echo "Addresses built at run time (section 2) cannot be matched by name. For each,"
  echo "find what the documents say about that kind of request."
fi

echo
echo "Providers from section 4 that no legal document names:"
echo
for vendor in anthropic openai ollama mistral cohere gemini whisper sentry posthog mixpanel segment amplitude plausible firebase datadog bugsnag stripe paypal; do
  grep -qi -- "$vendor" "$work/deps" 2>/dev/null || continue
  says "$vendor" || echo "  $vendor"
done > "$work/vendors"
if [ -s "$work/vendors" ]; then cat "$work/vendors"; else echo "  (none)"; fi

echo
echo "Claims that content cannot be read. Test each against section 6:"
echo
# A paragraph at a time, because a claim often breaks across two lines.
while IFS= read -r file; do
  awk -v file="$file" '
    function flush(    low, from, text) {
      if (para == "") return
      low = tolower(para)
      if (match(low, /(cannot|can not|unable to) (read|see|view|decrypt|open)|(do not|does not|never) (hold|see|read)s?|no plaintext/)) {
        from = RSTART > 60 ? RSTART - 60 : 1
        while (from > 1 && substr(para, from - 1, 1) != " ") from++
        text = substr(para, from, 200)
        if (length(para) - from + 1 > 200) sub(/ [^ ]*$/, " ...", text)
        printf "%s:%d:%s\n", file, start, text
      }
      para = ""
    }
    /^[ \t]*$/ { flush(); next }
    { line = $0; sub(/^[ \t>*-]+/, "", line); if (para == "") start = NR; para = para (para == "" ? "" : " ") line }
    END { flush() }
  ' "$file"
done < "$work/legal" | head -12 > "$work/claims"
if [ -s "$work/claims" ]; then cat "$work/claims"; else echo "  (none made)"; fi

if [ -s "$work/agents" ] || grep -Eqi 'anthropic|openai|ollama|mistral|cohere|gemini|whisper' "$work/deps" 2>/dev/null; then
  echo
  echo "Agents, models and transcription (section 7). What the documents say:"
  echo
  quote 'transcri|model provider|language model|\bagents?\b|\bbots?\b' 6 > "$work/agentsaid"
  if [ -s "$work/agentsaid" ]; then cat "$work/agentsaid"; else echo "  (nothing)"; fi
fi

if [ -s "$work/storage" ]; then
  echo
  echo "What is kept on the device (section 8). What the documents say:"
  echo
  quote 'local ?storage|session ?storage|indexeddb|on (your|the|this) device|in (your|the|this) browser|cookies?' 6 > "$work/storagesaid"
  if [ -s "$work/storagesaid" ]; then cat "$work/storagesaid"; else echo "  (nothing)"; fi
fi

if [ -s "$work/money" ] || [ -s "$work/payees" ] || grep -Eqi 'stripe|paypal|braintree|lnurl|bolt11|webln|l402|lightning' "$work/deps" 2>/dev/null; then
  echo
  echo "Money (section 5). What the documents say:"
  echo
  quote 'payments?|paid|donat|subscription|\bfees?\b' 6 > "$work/moneysaid"
  if [ -s "$work/moneysaid" ]; then cat "$work/moneysaid"; else echo "  (nothing)"; fi
fi

