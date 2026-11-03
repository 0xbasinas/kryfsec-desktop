#!/usr/bin/env bash
# Takes the README screenshots with sample data. Headless by default (no X server);
# set DISPLAY_NUM=:5 to render on a virtual X display instead.
set -euo pipefail
cd "$(dirname "$0")/.."
DISP="${DISPLAY_NUM:-}"
UD="$(mktemp -d)"
mkdir -p screenshots
SHOTS="01-dashboard=page:dashboard"
SHOTS+=",02-dashboard-more=page:dashboard;scroll:640"
SHOTS+=",03-roadmap=page:roadmap"
SHOTS+=",04-journal=page:journal"
SHOTS+=",05-labs-board=page:labs"
SHOTS+=",06-lab-writeup=page:labs;open:labs:0"
SHOTS+=",07-resources=close;page:resources"
SHOTS+=",08-certifications=page:certs"
SHOTS+=",09-goals=page:goals"
SHOTS+=",10-settings=page:settings"
SHOTS+=",11-command-palette=page:dashboard;palette:sql"
SHOTS+=",12-dashboard-light=close;theme:light;page:dashboard"
SHOTS+=",13-journal-light=page:journal"
SHOTS+=",14-roadmap-light=page:roadmap"
SHOTS+=",15-new-journal-entry=theme:dark;page:journal;open:journal:new"
SHOTS+=",16-note-viewer-dark=theme:dark;page:journal;open:journal:0"
SHOTS+=",17-note-editor-dark=edmode:edit;sel:UNION"
SHOTS+=",18-note-editor-slash-dark=slash"
SHOTS+=",19-note-viewer-light=undo;edmode:read;theme:light"
SHOTS+=",20-note-editor-light=edmode:edit;sel:UNION"
SHOTS+=",21-note-editor-slash-light=slash"
# 22/23 turn sync on against the live server; the test vault is deleted at the end.
SHOTS+=",22-sync-dark=undo;theme:dark;page:settings;sync:on;scroll:430"
SHOTS+=",23-sync-light=theme:light"
AFTER="sync:off"
# ONLY="16,17" takes just those shots
if [ -n "${ONLY:-}" ]; then
  KEEP=""; IFS=',' read -ra ALL <<< "$SHOTS"
  for s in "${ALL[@]}"; do for n in ${ONLY//,/ }; do [[ "$s" == "$n"-* ]] && KEEP+="${KEEP:+,}$s"; done; done
  SHOTS="$KEEP"
fi
if [ -n "$DISP" ]; then RUN=(env DISPLAY="$DISP"); EXTRA=(); else RUN=(env -u DISPLAY); EXTRA=(--ozone-platform=headless); fi
"${RUN[@]}" CJ_SCREENSHOT_DIR="$PWD/screenshots" CJ_SHOTS="$SHOTS" CJ_SHOTS_AFTER="$AFTER" \
  ./node_modules/electron/dist/electron --no-sandbox "${EXTRA[@]}" --user-data-dir="$UD" out/main/main.js
rm -rf "$UD"
