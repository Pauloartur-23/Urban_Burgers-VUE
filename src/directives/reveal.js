// v-reveal / v-reveal="atrasoEmMs": o elemento sobe e aparece quando entra na tela (uma vez só).
// Estilo em main.css (.reveal / .is-visible). Respeita "reduzir movimento" via CSS.
const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -10% 0px' }
      )
    : null

export const reveal = {
  mounted(el, binding) {
    if (!observer) return
    el.classList.add('reveal')
    if (binding.value) el.style.animationDelay = `${binding.value}ms`
    // terminada a entrada, devolve o elemento ao normal (para os hovers funcionarem)
    const fim = (e) => {
      if (e.target !== el) return // animação de algum filho, não a da entrada
      el.classList.remove('reveal', 'is-visible')
      el.style.animationDelay = ''
      el.removeEventListener('animationend', fim)
    }
    el.addEventListener('animationend', fim)
    observer.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
