export const injectGradientAnimation = () => {
  if (typeof window !== 'undefined') {
    // Check if the style has already been injected to avoid duplication
    if (document.querySelector('#gradient-animation-style')) return;
  
    const style = document.createElement('style');
    style.id = 'gradient-animation-style'; // Add an ID for checking
    style.textContent = `
    .animate-gradient {
      animation: gradient 15s ease infinite;
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    `;
    document.head.appendChild(style);
  }
};


export const scrollTo = (x, y) => {
  window.scrollTo(x, y);
};