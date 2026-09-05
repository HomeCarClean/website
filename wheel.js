const wheelFrame = document.querySelector('.wheel-frame');
const wheel = document.querySelector('.wheel-image');

if (wheelFrame && wheel) {
  let angle = 0;
  const spokeStep = 30;

  const tapLayer = document.createElement('div');

  Object.assign(tapLayer.style, {
    position: 'absolute',
    inset: '0',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    touchAction: 'manipulation',
    background: 'transparent',
    zIndex: '2'
  });

  wheel.style.transition = 'transform 0.4s ease';
  wheel.style.transformOrigin = '50% 50%';

  wheelFrame.appendChild(tapLayer);

  tapLayer.addEventListener('click', () => {
    angle += spokeStep;
    wheel.style.transform = `rotate(${angle}deg)`;
  });

  tapLayer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
}
