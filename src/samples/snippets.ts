import type { HighlightLang } from "../highlight/languages";

export const SNIPPETS: Record<HighlightLang, string> = {
  typescript: String.raw`type User = {
  id: string
  name: string
  roles: ('admin' | 'viewer')[]
}

export function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}`,

  tsx: String.raw`import { Button } from '@patternfly/react-core'

export function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <Button variant="primary" onClick={onSave}>
      Save
    </Button>
  )
}`,

  javascript: String.raw`export async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`)
  }
  return response.json()
}`,

  json: String.raw`{
  "name": "patternfly-playground",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build"
  }
}`,

  yaml: String.raw`apiVersion: helm.openshift.io/v1beta1
kind: HelmChartRepository
metadata:
  name: azure-sample-repo
spec:
  connectionConfig:
    url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs`,

  bash: String.raw`#!/usr/bin/env bash
set -euo pipefail

npm install
npm run dev -- --host`,
};
