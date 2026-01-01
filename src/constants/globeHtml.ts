export const GLOBE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style> body { margin: 0; padding: 0; overflow: hidden; background-color: #000; } </style>
  <script src="https://unpkg.com/three"></script>
  <script src="https://unpkg.com/globe.gl"></script>
</head>
<body>
  <div id="globeViz"></div>
  <script>
    // Debug Bridge
    const consoleLog = (type, args) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CONSOLE', logType: type, args: args }));
    };
    console.log = (...args) => consoleLog('log', args);
    console.error = (...args) => consoleLog('error', args);
    window.onerror = (message, source, lineno, colno, error) => {
      console.error(message, source, lineno, colno, error);
    };
    // Initialize Globe
    const world = Globe()
      .backgroundColor('#000000')
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .atmosphereColor('#3a228a')
      .atmosphereAltitude(0.25)
      .width(window.innerWidth)
      .height(window.innerHeight)
      (document.getElementById('globeViz'));

    // Configure Controls
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;
    world.controls().enableZoom = false;

    // Global function to update data from React Native
    window.updateGlobeData = (points) => {
       console.log("updateGlobeData called with " + (points ? points.length : 0) + " points");
       if (!points) return;
       
       // Add Heatmap Layer
       world.heatmapsData([points]);
       world.heatmapPointLat('lat');
       world.heatmapPointLng('lng');
       world.heatmapPointWeight('weight');
       world.heatmapTopAltitude(0.5);
       world.heatmapsTransitionDuration(0); // Immediate
    };

    // Handle Window Resize
    window.addEventListener('resize', () => {
      world.width(window.innerWidth);
      world.height(window.innerHeight);
    });

  </script>
</body>
</html>
`;
