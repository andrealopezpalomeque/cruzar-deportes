import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Observes elements with the `.reveal` class inside a container ref.
 * Adds `.revealed` when they enter the viewport (once).
 * Uses MutationObserver to pick up dynamically added elements (e.g. async product cards).
 */
export function useReveal(containerRef: Ref<HTMLElement | null>, options?: { threshold?: number; rootMargin?: string }) {
  let intersectionObserver: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null

  function observeElement(el: Element) {
    if (!el.classList.contains('revealed')) {
      intersectionObserver?.observe(el)
    }
  }

  onMounted(() => {
    if (!containerRef.value) return

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            intersectionObserver?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    // Observe existing .reveal elements
    containerRef.value.querySelectorAll('.reveal').forEach(observeElement)

    // Watch for dynamically added .reveal elements
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal')) observeElement(node)
            node.querySelectorAll('.reveal').forEach(observeElement)
          }
        }
      }
    })

    mutationObserver.observe(containerRef.value, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
  })
}
