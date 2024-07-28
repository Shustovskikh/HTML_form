/* global requestAnimationFrame */

function initializePopover() {
  const button = document.getElementById('popoverButton');
  const popover = document.getElementById('popover');
  let resizeRAF;

  const positionPopover = () => {
    const rect = button.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const popoverHeight = popover.offsetHeight;
    const popoverWidth = popover.offsetWidth;

    const top = rect.top + scrollTop - popoverHeight - 10;
    const left = rect.left + scrollLeft + (rect.width / 2) - (popoverWidth / 2);

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
  };

  button.addEventListener('click', () => {
    if (popover.classList.contains('show')) {
      popover.classList.remove('show');
      popover.style.display = 'none';
      button.classList.remove('clicked');
    } else {
      popover.style.display = 'block';
      positionPopover();
      popover.classList.add('show');
      button.classList.add('clicked');
    }
  });

  const handleResize = () => {
    if (popover.classList.contains('show')) {
      positionPopover();
    }
    resizeRAF = null;
  };

  window.addEventListener('resize', () => {
    if (!resizeRAF) {
      resizeRAF = requestAnimationFrame(handleResize);
    }
  });

  document.addEventListener('click', (event) => {
    if (!button.contains(event.target) && !popover.contains(event.target)) {
      popover.classList.remove('show');
      popover.style.display = 'none';
      button.classList.remove('clicked');
    }
  });
}

document.addEventListener('DOMContentLoaded', initializePopover);

export { initializePopover };
