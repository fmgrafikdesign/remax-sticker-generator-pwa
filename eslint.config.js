import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { name: 'app/files-to-lint', files: ['**/*.{ts,mts,tsx,vue}'] },
  globalIgnores(['**/.nuxt/**', '**/.output/**', '**/dist/**', '**/coverage/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  // Nuxt route and root components are named by their file
  { files: ['app/pages/**/*.vue', 'app/app.vue'], rules: { 'vue/multi-word-component-names': 'off' } }
)
