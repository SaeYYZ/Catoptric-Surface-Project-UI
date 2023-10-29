export const useSticky = (el: HTMLElement) => {
  const onScroll = () => {
    const { isScrolling } = useScroll(el, { behavior: "smooth" });
    if (isScrolling) {
      el.classList.add("sticky");
    } else {
      el.classList.remove("sticky");
    }
  };

  window.addEventListener("scroll", onScroll);
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  });
  return { onScroll };
};
