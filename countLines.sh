#!/usr/bin/env bash

find {app/{apps,libs}/*,{admin,mobile}}/src/** -type f | xargs wc -l

