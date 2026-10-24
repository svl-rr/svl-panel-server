#!/bin/bash
cd "$(dirname "$0")"
grep 'inkscape:version' ../*/*.svg
