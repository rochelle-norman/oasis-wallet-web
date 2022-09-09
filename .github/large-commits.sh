#!/bin/bash
set -euo pipefail
# set -x

# GITHUB_BASE_REF=master

commits=$(git log --pretty=%h ${GITHUB_BASE_REF}..)
for commit in ${commits}; do
  echo "Checking: ${commit}"

  # Ignored patterns from:
  # .prettierignore
  #   package-lock.json
  #   yarn.lock
  #
  # .gitattributes
  #   src/vendors/explorer/*/** linguist-generated=true
  #   src/vendors/oasisscan/*/** linguist-generated=true
  #   src/vendors/oasisscan/dump_validators.json linguist-generated=true
  #
  # other
  #   *.snap
  diff_summary=$(
    git show --shortstat ${commit} -- \
      ':(exclude)package-lock.json' \
      ':(exclude)yarn.lock' \
      ':(exclude)src/vendors/explorer/*/**' \
      ':(exclude)src/vendors/oasisscan/*/**' \
      ':(exclude)src/vendors/oasisscan/dump_validators.json' \
      ':(exclude)*.snap' \
    | tail -n 1
  )
  echo "Diff summary: ${diff_summary}"
  # 48 files changed, 1235 insertions(+), 312 deletions(-)

  if [ -z "${diff_summary}" ] ; then
    # diff_summary can be empty if all files are ignored (e.g. 8f8a05a93eadb5416acbedfdac050a26d21d94cc)
    echo 'Good. All ignored.'
  elif echo ${diff_summary} | awk '$1>10 && $4>500 { exit 1 }' ; then
    echo 'Good.'
  else
    echo 'More than 10 files and more than 500 new lines in a single commit.'
    exit 1
  fi
done
