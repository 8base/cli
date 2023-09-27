#!/usr/bin/env node

process.exit(require('ci-info').isCI ? 0 : 1);
