<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppBorderButton from '@/components/buttons/appBorderButton.vue';
import AppCicleButton from '@/components/buttons/appCircleButton.vue';
import AppLogo from '@/components/layout/logo/appLogo.vue';

const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'cardapio', label: 'Cardápio' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'contato', label: 'Contato' },
];

const isScrolled = ref(false);
const activeId = ref(navLinks[0].id);
const headerRef = ref(null);

let observer;

function handleScroll() {
    isScrolled.value = window.scrollY > 8;
}

function goToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    const headerHeight = headerRef.value?.offsetHeight ?? 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top, behavior: 'smooth' });
}

function setupScrollSpy(attempts = 0) {
    const sections = navLinks
        .map((link) => document.getElementById(link.id))
        .filter(Boolean);

    if (sections.length < navLinks.length && attempts < 30) {
        requestAnimationFrame(() => setupScrollSpy(attempts + 1));
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visible[0]) {
                activeId.value = visible[0].target.id;
            }
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
}

onMounted(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    setupScrollSpy();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    observer?.disconnect();
});
</script>



<template>
    <header ref="headerRef" :class="{ 'is-scrolled': isScrolled }">
        <div class="header-inner">
            <a href="#home" class="header-logo" aria-label="Urban Burguer - Início" @click.prevent="goToSection('home')">
                <appLogo />
            </a>

            <nav>
                <ul>
                    <li v-for="link in navLinks" :key="link.id">
                        <a
                            :href="`#${link.id}`"
                            :class="{ 'is-active': activeId === link.id }"
                            @click.prevent="goToSection(link.id)"
                        >{{ link.label }}</a>
                    </li>
                </ul>
            </nav>

            <div class="header-actions">
                <ul class="header-icons">
                    <li>
                        <AppCicleButton aria-label="Favoritos">
                            <span class="mdi mdi-heart-outline"></span>
                        </AppCicleButton>
                    </li>
                    <li>
                        <AppCicleButton aria-label="Carrinho">
                            <span class="mdi mdi-cart-outline"></span>
                        </AppCicleButton>
                    </li>
                </ul>

                <span class="header-divider"></span>

                <AppBorderButton>
                    Login
                    <span class="mdi mdi-login-variant"></span>
                </AppBorderButton>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(8, 8, 8, 0.4);
    border-bottom: 1px solid transparent;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

header.is-scrolled {
    background: rgba(8, 8, 8, 0.72);
    border-bottom-color: var(--border-color);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding: 16px 200px;
}

.header-logo {
    display: flex;
    align-items: center;
    line-height: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Nav */
header nav ul {
    display: flex;
    list-style: none;
    gap: 36px;
}

header nav ul li a {
    position: relative;
    display: inline-block;
    text-decoration: none;
    color: var(--text-primary);
    font-size: var(--text-small);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.03em;
    text-transform: uppercase;
    transition: color 0.2s ease;
}

header nav ul li a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.25s ease;
}

header nav ul li a:hover,
header nav ul li a:focus-visible {
    color: var(--color-primary);
}

header nav ul li a:hover::after,
header nav ul li a:focus-visible::after {
    width: 100%;
}

header nav ul li a.is-active {
    color: var(--color-primary);
}

header nav ul li a.is-active::after {
    width: 100%;
}

/* Actions */
.header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-icons {
    display: flex;
    list-style: none;
    align-items: center;
    gap: 10px;
}

.header-divider {
    width: 1px;
    height: 24px;
    background-color: var(--border-color);
}

@media (max-width: 1024px) {
    .header-inner {
        padding: 14px 24px;
    }

    header nav ul {
        gap: 20px;
    }
}
</style>
