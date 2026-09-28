#!/bin/sh
# law-notes.sh: find the law notes, say which are due for review, and print
# one section at a time, so an agent reads what it needs and no more.
#
# The notes live in law/ at the root of the jurisdiction-kit repository. This
# script sits in skill/scripts/ of the same repository and finds them from
# its own location, through any symlink the skill was installed by.
#
# Environment:
#   LAW_NOTES_DIR    use this directory in place of the repository's law/
#   LAW_NOTES_TODAY  YYYY-MM-DD, in place of today's date
set -eu

remote='https://github.com/forgesworn/jurisdiction-kit/tree/main/law'

usage() {
  cat <<'EOF'
Usage: law-notes.sh <command> [note] [section]

  path                   print the directory the notes are in
  status                 every note with its verified and review-by dates
  sections <note>        the numbered headings of a note
  section <note> <n>     one section, for example: section gb/online-services 2.6
  watch <note>           the note's watch list

A note is named by its path under law/ without the extension, for example
gb/online-services.
EOF
}

here=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
notes=${LAW_NOTES_DIR:-"$here/../../law"}

need_notes() {
  if [ ! -d "$notes" ]; then
    echo "No notes at $notes. Read them at $remote" >&2
    exit 2
  fi
  notes=$(cd -P -- "$notes" && pwd -P)
}

note_file() {
  file="$notes/${1%.md}.md"
  if [ ! -f "$file" ]; then
    echo "No such note: $1. Run: law-notes.sh status" >&2
    exit 1
  fi
  printf '%s\n' "$file"
}

# Reads "| Verified | 28 September 2026 |" style rows from the header table
# and prints the date as YYYY-MM-DD. Anything after the year is ignored, so
# "28 March 2027, or sooner if ..." is 2027-03-28.
header_date() {
  awk -v want="$2" '
    BEGIN {
      split("january february march april may june july august september october november december", names, " ")
      for (i = 1; i <= 12; i++) month[names[i]] = i
    }
    /^\|/ {
      n = split($0, cell, "|")
      key = cell[2]; gsub(/^[ \t]+|[ \t]+$/, "", key)
      if (tolower(key) != tolower(want)) next
      value = cell[3]; gsub(/^[ \t]+|[ \t]+$/, "", value)
      split(value, part, /[ ,]+/)
      m = month[tolower(part[2])]
      if (part[1] + 0 < 1 || m < 1 || part[3] + 0 < 1) exit
      printf "%04d-%02d-%02d\n", part[3], m, part[1]
      exit
    }
  ' "$1"
}

print_section() {
  awk -v want="$2" '
    function level(line,    hashes) {
      hashes = line; sub(/[^#].*$/, "", hashes)
      return length(hashes)
    }
    /^#+ / {
      number = $2; sub(/\.$/, "", number)
      if (printing && level($0) <= depth) exit
      # As strings: compared as numbers, 2.10 equals 2.1.
      if (!printing && (number "") == (want "")) { printing = 1; depth = level($0) }
    }
    printing { print; found = 1 }
    END { if (!found) exit 1 }
  ' "$1"
}

command=${1:-}
case "$command" in
  path)
    need_notes
    printf '%s\n' "$notes"
    ;;

  status)
    need_notes
    today=${LAW_NOTES_TODAY:-$(date +%Y-%m-%d)}
    overdue=0
    for file in "$notes"/*/*.md; do
      [ -f "$file" ] || continue
      name=${file#"$notes"/}
      name=${name%.md}
      verified=$(header_date "$file" 'Verified')
      review=$(header_date "$file" 'Review by')
      if [ -z "$verified" ] || [ -z "$review" ]; then
        state='NO DATES: the header table needs Verified and Review by rows'
        overdue=1
      elif [ "$(printf '%s\n%s\n' "$today" "$review" | sort | head -n 1)" = "$review" ] && [ "$today" != "$review" ]; then
        state='OVERDUE: re-check before relying on it'
        overdue=1
      else
        state='ok'
      fi
      printf '%s\tverified %s\treview by %s\t%s\n' "$name" "${verified:-?}" "${review:-?}" "$state"
    done
    [ "$overdue" -eq 0 ] || exit 3
    ;;

  sections)
    need_notes
    file=$(note_file "${2:?name a note}")
    grep -E '^#{2,3} [0-9]' "$file"
    ;;

  section)
    need_notes
    file=$(note_file "${2:?name a note}")
    number=${3:?give a section number}
    print_section "$file" "${number%.}" || {
      echo "No section $number in $2. Run: law-notes.sh sections $2" >&2
      exit 1
    }
    ;;

  watch)
    need_notes
    file=$(note_file "${2:?name a note}")
    number=$(grep -E '^## [0-9]+\. Watch list' "$file" | head -n 1 | awk '{ sub(/\.$/, "", $2); print $2 }')
    if [ -z "$number" ]; then
      echo "No watch list in $2" >&2
      exit 1
    fi
    print_section "$file" "$number"
    ;;

  ''|-h|--help|help)
    usage
    ;;

  *)
    usage >&2
    exit 1
    ;;
esac
