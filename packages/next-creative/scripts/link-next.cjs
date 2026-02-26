/* eslint-disable no-console */

const fs = require('node:fs')
const path = require('node:path')

function ensureAlias() {
  const initCwd = process.env.INIT_CWD
  if (!initCwd) return

  const nodeModules = path.join(initCwd, 'node_modules')
  const nextAliasPath = path.join(nodeModules, 'next')

  if (fs.existsSync(nextAliasPath)) return

  const scopedNext = path.join(nodeModules, '@emalorenzo', 'next')
  if (!fs.existsSync(scopedNext)) return

  try {
    fs.symlinkSync(scopedNext, nextAliasPath, 'junction')
  } catch (error) {
    console.warn('[next-creative] Could not create next alias:', error)
  }
}

ensureAlias()
