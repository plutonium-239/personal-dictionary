import './app.css'
import App from './App.svelte'

export function getThemeNames(themes: Record<string, any>) {
  const light: string[] = [];
  const dark: string[] = [];
  
  Object.entries(themes).map(([themeName, props]) => {
    if (props['color-scheme'] === 'dark') {
      dark.push(themeName);
    } else {
      light.push(themeName);
    }
  });

  return { light, dark };
}


const app = new App({
  target: document.getElementById('app')!,
})

export default app
