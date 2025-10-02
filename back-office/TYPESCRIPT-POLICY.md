# TypeScript Policy for Back-Office

## Overview
The back-office project **does not use TypeScript** in pages, components, and layouts. Only plain JavaScript is allowed in these directories.

## Rationale
- Simpler development workflow
- Faster build times
- Easier maintenance for non-TypeScript developers
- Reduced complexity in Vue components

## What is Allowed

### ✅ Plain JavaScript in Vue Files
```vue
<script setup>
const myVar = ref('hello')
const myFunction = (param) => {
  return param * 2
}
</script>
```

### ✅ JavaScript Composables
All composables should use `.js` extension:
- `composables/useToast.js`
- `composables/useCloudinary.js`
- `composables/useSharedProducts.js`

## What is NOT Allowed

### ❌ TypeScript in Vue Files
```vue
<!-- DON'T DO THIS -->
<script setup lang="ts">
const myVar = ref<string>('hello')
const myFunction = (param: number): number => {
  return param * 2
}
</script>
```

### ❌ Type Annotations
```javascript
// DON'T DO THIS
const myFunction = (param: string): void => {}
const myVar: Record<string, string> = {}
```

### ❌ Interfaces and Type Declarations
```javascript
// DON'T DO THIS
interface MyInterface {
  name: string
  age: number
}

type MyType = string | number
```

## Enforcement

### Automatic Checks
1. **Pre-build Hook**: TypeScript check runs automatically before every build
   ```bash
   npm run build  # Will fail if TypeScript is detected
   ```

2. **Manual Check**: You can run the check manually anytime
   ```bash
   npm run check:no-ts
   ```

3. **ESLint**: ESLint is configured to warn about TypeScript usage in Vue files

### Check Script
The script `scripts/check-no-typescript.sh` scans for:
- `lang="ts"` in `<script>` blocks
- Type annotations (`:string`, `:number`, etc.)
- Interface/type declarations

## Exceptions

TypeScript IS allowed in:
- `server/` directory (API routes can use TypeScript)
- `types/` directory (for shared type definitions)
- `utils/` directory (utility functions can use TypeScript)
- `stores/` directory (Pinia stores can use TypeScript)

## Migration

If you find TypeScript in pages/components/layouts, remove it:

1. Change `<script setup lang="ts">` to `<script setup>`
2. Remove all type annotations (`: string`, `: number`, etc.)
3. Remove `interface` and `type` declarations
4. Convert `Record<string, string>` to plain objects
5. Remove import type statements

## Questions?

If you need type safety, consider:
1. Using JSDoc comments for type hints
2. Using TypeScript in server/utils/stores (where allowed)
3. Relying on Vue's runtime validation with props validators
