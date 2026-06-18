export const isInSection = (id: string): boolean => {
  const el = document.getElementById(id);
  if (!el) return false;

  const rect = el.getBoundingClientRect();

  // sichtbar wenn in view port
  const inView = rect.top < window.innerHeight && rect.bottom > 0;

  return inView;
};

export const scrollToSection = (id: string, setOpen: (y: boolean) => void): void => {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  setOpen(false);
};
