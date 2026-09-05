const wheel = document.querySelector('.wheel-frame');

if (wheel) {
  let angle = 0;

  // HOW FAR THE WHEEL SPINS PER TAP
  const spokeStep = 30;

  // ROTATION CENTER CALIBRATION
  // Adjust these until the center hub stays perfectly still while spinning.
  const centerX = 50;
  const centerY = 50;

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

  // Spin around the calibrated center of the actual rim.
  wheel.style.transformOrigin = `${centerX}% ${centerY}%`;

  document.querySelector('.wheel-area').appendChild(tapLayer);

  tapLayer.addEventListener('click', () => {
    angle += spokeStep;

    wheel.style.transform =
      `translateY(-50%) rotate(${angle}deg)`;
  });

  tapLayer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
}
