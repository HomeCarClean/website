const dragWheelFrame = document.querySelector('.wheel-frame');
const dragWheel = document.querySelector('.wheel-image');
const dragLayer = document.querySelector('.wheel-tap-layer');

if (dragWheelFrame && dragWheel && dragLayer) {
  const step = 30;

  let dragging = false;
  let moved = false;

  let startPointerAngle = 0;
  let startWheelAngle = 0;
  let currentAngle = 0;

  let suppressNextClick = false;

  function getPointerAngle(event) {
    const rect = dragWheelFrame.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    return Math.atan2(y, x) * 180 / Math.PI;
  }

  function getCurrentWheelAngle() {
    const transform = getComputedStyle(dragWheel).transform;

    if (!transform || transform === 'none') {
      return 0;
    }

    const matrix = new DOMMatrixReadOnly(transform);

    return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
  }

  dragLayer.addEventListener('pointerdown', (event) => {
    dragging = true;
    moved = false;

    dragLayer.setPointerCapture(event.pointerId);

    startPointerAngle = getPointerAngle(event);
    startWheelAngle = getCurrentWheelAngle();
    currentAngle = startWheelAngle;

    dragWheel.style.transition = 'none';
  });

  dragLayer.addEventListener('pointermove', (event) => {
    if (!dragging) return;

    const pointerAngle = getPointerAngle(event);

    let difference = pointerAngle - startPointerAngle;

    /*
      Fix crossing from 180° to -180°
      so the wheel doesn't suddenly jump.
    */
    if (difference > 180) difference -= 360;
    if (difference < -180) difference += 360;

    if (Math.abs(difference) > 3) {
      moved = true;
    }

    const rawAngle = startWheelAngle + difference;

    /*
      CLICK / DETENT EFFECT

      Every drag position locks to the same
      30° positions used by the tap code.
    */
    const snappedAngle =
      Math.round(rawAngle / step) * step;

    if (snappedAngle !== currentAngle) {
      currentAngle = snappedAngle;

      dragWheel.style.transform =
        `rotate(${currentAngle}deg)`;
    }
  });

  function finishDrag(event) {
    if (!dragging) return;

    dragging = false;

    if (dragLayer.hasPointerCapture(event.pointerId)) {
      dragLayer.releasePointerCapture(event.pointerId);
    }

    dragWheel.style.transition =
      'transform 0.18s ease';

    const finalAngle =
      Math.round(currentAngle / step) * step;

    currentAngle = finalAngle;

    dragWheel.style.transform =
      `rotate(${finalAngle}deg)`;

    /*
      Prevent your original tap JS from
      adding another 30° after a drag.
    */
    if (moved) {
      suppressNextClick = true;
    }
  }

  dragLayer.addEventListener('pointerup', finishDrag);
  dragLayer.addEventListener('pointercancel', finishDrag);

  /*
    Capture phase runs BEFORE the click listener
    from your original JS.

    Normal tap:
      original JS still rotates +30°

    Drag:
      blocks the accidental click afterward
  */
  dragLayer.addEventListener(
    'click',
    (event) => {
      if (!suppressNextClick) return;

      suppressNextClick = false;

      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );
}
