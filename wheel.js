const wheel = document.querySelector('.wheel-frame');

if (wheel) {
  let angle = 0;
  const spokeStep = 30;

  const tapLayer = document.createElement('div');
Object.assign(tapLayer.style, {
  position: 'absolute',
  width: '100vh',
  height: '100vh',
  right: '-50vh',
  top: '50%',
  transform: 'translateY(-50%)',
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

  document.querySelector('.wheel-area').appendChild(tapLayer);

  tapLayer.addEventListener('click', () => {
    angle += spokeStep;
    wheel.style.transform = `translateY(-50%) rotate(${angle}deg)`;
  });
}
