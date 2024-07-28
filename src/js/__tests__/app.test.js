/* eslint-env jest */
/* global MouseEvent */

document.body.innerHTML = `
    <button id="popoverButton" class="btn btn-lg btn-danger">Click to toggle popover</button>
    <div id="popover" class="popover">
        <div class="popover-title">Popover title</div>
        <div class="popover-content">And here's some amazing content. It's very engaging. Right?</div>
        <div class="popover-arrow"></div>
    </div>
`;

const { initializePopover } = require('../app.js');

describe('Popover Functionality', () => {
  let button;
  let popover;

  beforeAll(() => {
    initializePopover();
  });

  beforeEach(() => {
    button = document.getElementById('popoverButton');
    popover = document.getElementById('popover');
    popover.style.display = 'none';
    popover.classList.remove('show');
    button.classList.remove('clicked');
  });

  test('Popover should be hidden initially', () => {
    expect(popover.style.display).toBe('none');
  });

  test('Clicking the button should show the popover', (done) => {
    button.click();
    setTimeout(() => {
      expect(popover.style.display).toBe('block');
      expect(popover.classList.contains('show')).toBe(true);
      expect(button.classList.contains('clicked')).toBe(true);
      done();
    }, 100);
  }, 20000);

  test('Clicking the button again should hide the popover', (done) => {
    button.click();
    setTimeout(() => {
      button.click();
      setTimeout(() => {
        expect(popover.style.display).toBe('none');
        expect(popover.classList.contains('show')).toBe(false);
        expect(button.classList.contains('clicked')).toBe(false);
        done();
      }, 100);
    }, 100);
  }, 20000);

  test('Clicking outside the popover should hide it', (done) => {
    button.click();
    setTimeout(() => {
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      setTimeout(() => {
        expect(popover.style.display).toBe('none');
        expect(popover.classList.contains('show')).toBe(false);
        expect(button.classList.contains('clicked')).toBe(false);
        done();
      }, 100);
    }, 100);
  }, 20000);

  test('Clicking outside the button and popover should hide it', (done) => {
    button.click();
    setTimeout(() => {
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      outsideElement.click();

      setTimeout(() => {
        expect(popover.style.display).toBe('none');
        expect(popover.classList.contains('show')).toBe(false);
        expect(button.classList.contains('clicked')).toBe(false);
        document.body.removeChild(outsideElement);
        done();
      }, 100);
    }, 100);
  }, 20000);

  test('Popover should be positioned correctly', (done) => {
    button.click();
    setTimeout(() => {
      const rect = button.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const popoverTop = rect.top + scrollTop - popover.offsetHeight - 10;
      const popoverLeft = rect.left + scrollLeft + (rect.width / 2) - (popover.offsetWidth / 2);

      expect(parseInt(popover.style.top, 10)).toBeCloseTo(popoverTop, 1);
      expect(parseInt(popover.style.left, 10)).toBeCloseTo(popoverLeft, 1);
      done();
    }, 100);
  }, 20000);

  test('Popover should update position on window resize', (done) => {
    button.click();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        const rect = button.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const popoverTop = rect.top + scrollTop - popover.offsetHeight - 10;
        const popoverLeft = rect.left + scrollLeft + (rect.width / 2) - (popover.offsetWidth / 2);

        expect(parseInt(popover.style.top, 10)).toBeCloseTo(popoverTop, 1);
        expect(parseInt(popover.style.left, 10)).toBeCloseTo(popoverLeft, 1);
        done();
      }, 100);
    }, 100);
  }, 20000);
});
