export default function debounce(delay = 1000, fn: Function = () => {}) {
  let timer: number | null = null;

  return function() {
    const args = arguments;

    if (timer) {
      clearTimeout(timer);
    }
    timer = (setTimeout(function() {
      fn.apply(null, args as any);
    }, delay) as unknown) as number;
  };
}
