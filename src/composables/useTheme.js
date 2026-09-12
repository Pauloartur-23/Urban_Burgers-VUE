import { ref } from 'vue'

const getStoredTheme = () => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const theme = ref(getStoredTheme());

const applyTheme = (value) => {
  document.documentElement.setAttribute('data-theme', value);
  localStorage.setItem('theme', value);
};

const setTheme = (value) => {
  theme.value = value;
  applyTheme(value);
};

const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark');
};

applyTheme(theme.value);

export const useTheme = () => {
  return { theme, setTheme, toggleTheme };
};
