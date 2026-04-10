import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Observes elements with the `.reveal` class inside a container ref.
 * Adds `.revealed` when they enter the viewport (once).
 */
export function useReveal(containerRef: Ref<HTMLElement | null>, options?: { threshold?: number; rootMargin?: string }) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      }
    )

    const targets = containerRef.value.querySelectorAll('.reveal')
    targets.forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
