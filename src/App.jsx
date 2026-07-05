import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import berserkLogoUrl from './assets/berserk.jpg';
import eclipseTextureUrl from './assets/eclipse.jpg';
import swordTextureUrl from './assets/sword.jpg';
import behelitTextureUrl from './assets/Behelith.png';
import fateTextureUrl from './assets/fate.jpg'
// --- NEW IMPORTS: Add your character images here ---
import griffithTextureUrl from './assets/griffith.jpg';
import gutsTextureUrl from './assets/guts.jpg';
import godhandTextureUrl from './assets/godhand.jpg'
import handOfGodTextureUrl from './assets/handofgod.png';
import rest from './assets/rest.png'
import './index.css'
import { texture } from 'three/tsl';




const eyebrowClasses =
  'mb-3 text-1 font-bold uppercase tracking-[0.18em] text-[#ff4c3b]';

const sectionClasses =
  'pointer-events-none relative flex min-h-screen items-end justify-start px-5 py-[14vh] md:items-center md:justify-center md:px-[clamp(20px,7vw,96px)] md:py-[72px]';

function App() {
  const canvasRef = useRef(null);
  const struggleHeadingRef = useRef(null);

  const textHoveredRef = useRef(false)
  const thirdSectionHoveredRef = useRef(false)

  let mouseCoordRef = useRef({x:0.5, y:0.5});

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070303, 0.045);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.6,
      1000
    );
    camera.position.set(0, 2.4, 8);
    scene.add(camera);

    let imageParticleGeometry;
    let imagePointMaterial;
    let imageParticle;
    const restImageScale = 0.01;

    const restImage = new Image();
    const sampleCanvas = document.createElement('canvas');
    const sampleContext = sampleCanvas.getContext('2d');

    restImage.onload = () => {
      const positions = [];
      const colors = [];
      const burstPositions = [];

      sampleCanvas.width = restImage.naturalWidth;
      sampleCanvas.height = restImage.naturalHeight;
      sampleContext.drawImage(restImage, 0, 0);

      const imgData = sampleContext.getImageData(
        0,
        0,
        sampleCanvas.width,
        sampleCanvas.height
      );
      const pixels = imgData.data;
      const height = imgData.height;
      const width = imgData.width;
      const step = 4;
      const scale = restImageScale;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];

          if (a > 50) {
            positions.push((x - width / 2) * scale, -(y - height / 2) * scale, 0);
            burstPositions.push(x*Math.random()*500*scale, -y*Math.random()*500*scale,0)
            colors.push(r / 255, g / 255, b / 255);
          }

        }
      }

      imageParticleGeometry = new THREE.BufferGeometry();
      imageParticleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      imageParticleGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      );

      imagePointMaterial = new THREE.PointsMaterial({
        size: 0.2,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
        vertexColors: true,
      });

      imageParticle = new THREE.Points(imageParticleGeometry, imagePointMaterial);
      imageParticle.position.set(0, 0, -7);
      imageParticle.renderOrder = 12;
      camera.add(imageParticle);
    };
    restImage.src = rest;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070303);

    scene.add(new THREE.AmbientLight(0x4a1713, 1.2));

    const keyLight = new THREE.DirectionalLight(0xff3b2f, 3);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff1200, 12, 16);
    rimLight.position.set(0, 2.2, -2.2);
    scene.add(rimLight);

    const textureLoader = new THREE.TextureLoader();

    let textDissolve = 0;
    let sandAmount = 0;

   





    // --- ECLIPSE SETUP (Unchanged) ---
    const eclipseMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b0806,
      depthTest: false,
      depthWrite: false,
      fog: false,
      transparent: true
    });
    const eclipse = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      eclipseMaterial
    );
    eclipse.position.set(0, 0, -20);
    eclipse.renderOrder = -1;
    camera.add(eclipse);

    let eclipseAspect = 16 / 9;
    const eclipseBaseScale = new THREE.Vector2();

    function fitEclipseToViewport() {
      const distance = Math.abs(eclipse.position.z);
      const viewportHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
      const viewportWidth = viewportHeight * camera.aspect;
      const viewportAspect = viewportWidth / viewportHeight;
      const overscan = 1.12;

      if (viewportAspect > eclipseAspect) {
        eclipseBaseScale.set(
          viewportWidth * overscan,
          (viewportWidth / eclipseAspect) * overscan
        );
      } else {
        eclipseBaseScale.set(
          viewportHeight * eclipseAspect * overscan,
          viewportHeight * overscan
        );
      }
    }

    textureLoader.load(eclipseTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      eclipseAspect = texture.image.width / texture.image.height;
      eclipseMaterial.map = texture;
      eclipseMaterial.color.set(0xffffff);
      eclipseMaterial.needsUpdate = true;
      fitEclipseToViewport();
    });

    const godhandMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b0806,
      depthTest: false,
      depthWrite: false,
      fog: false,
      transparent: true,
      opacity: 0
    })

    const godhand = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      godhandMaterial
    )
    godhand.position.set(0, 0, -19.9);
    godhand.renderOrder = -1
    camera.add(godhand);
    let godhandRatio = 16 / 9;
    let godHandBaseScale = new THREE.Vector2();
    let fitgodHnadToViewPort = () => {
      const distance = Math.abs(godhand.position.z);
      const viewportHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
      const viewportWidth = viewportHeight * camera.aspect;
      const viewportAspect = viewportWidth / viewportHeight;
      const overscan = 1.12;

      if (viewportAspect > godhandRatio) {
        godHandBaseScale.set(
          viewportWidth * overscan,
          (viewportWidth / godhandRatio) * overscan
        );
      } else {
        godHandBaseScale.set(
          viewportHeight * godhandRatio * overscan,
          viewportHeight * overscan
        )
      }

    }
    textureLoader.load(godhandTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      godhandRatio = texture.image.width / texture.image.height;
      godhandMaterial.map = texture;
      godhandMaterial.color.set(0xffffff);
      godhandMaterial.needsUpdate = true;
      fitgodHnadToViewPort();
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });

    const handOfGodMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      fog: false,
      uniforms: {
        uMap: { value: null },
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uOpacity: { value: 0 },
        uSandAmount: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uRadius: { value: 0.16 }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uTime;
        uniform float uReveal;
        uniform float uOpacity;
        uniform float uSandAmount;
        uniform vec2 uMouse;
        uniform float uRadius;

        varying vec2 vUv;

        float hash(vec2 p) {
          p = fract(p * vec2(127.1, 311.7));
          p += dot(p, p + 74.7);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 centeredUv = abs(vUv - 0.5);
          vec2 halfSize = vec2(0.5, 0.5) * smoothstep(0.0, 1.0, uReveal);
          vec2 rectangle = smoothstep(halfSize, halfSize - vec2(0.018), centeredUv);
          float rectMask = rectangle.x * rectangle.y;

          float coarseNoise = noise(vUv * 46.0 + vec2(0.0, uTime * 0.8));
          float grainNoise = noise(vUv * 360.0 + vec2(uTime * 1.4, -uTime * 0.55));
          vec2 cursorDelta = vUv - uMouse;
          cursorDelta.x *= 1.78;
          float cursorDistance = length(cursorDelta);
          float cursorMask = 1.0 - smoothstep(uRadius * 0.2, uRadius, cursorDistance);
          float localSand = uSandAmount * cursorMask;
          float sandNoise = coarseNoise + grainNoise * 0.32;
          float sandMask = smoothstep(0.28, 0.82, sandNoise + localSand * 0.55) * localSand;
          float looseGrains = smoothstep(0.52, 0.98, grainNoise + localSand * 0.28);
          vec2 distortion = vec2(
            sin(vUv.y * 18.0 + uTime * 0.8),
            cos(vUv.x * 14.0 - uTime * 0.65)
          ) * 0.012 * localSand;
          vec2 sandDrift = vec2(
            (grainNoise - 0.5) * 0.035,
            -localSand * (0.018 + coarseNoise * 0.045)
          ) * sandMask;
          vec4 image = texture2D(uMap, vUv + distortion + sandDrift);

          vec3 sandColor = mix(vec3(0.68, 0.68, 0.66), vec3(1.0, 0.98, 0.92), looseGrains);
          float sandBlend = max(sandMask, localSand * 0.34);
          vec3 finalColor = mix(image.rgb, sandColor, sandBlend);
          float crumble = mix(1.0, 0.28 + looseGrains * 0.5, sandBlend);
          float alpha = image.a * rectMask * uOpacity * smoothstep(0.02, 0.18, uReveal) * crumble;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    });
    const handOfGod = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      handOfGodMaterial
    );
    handOfGod.position.set(0, 0, -19.65);
    handOfGod.renderOrder = -0.75;
    camera.add(handOfGod);

    let handOfGodAspect = 16 / 9;
    const handOfGodBaseScale = new THREE.Vector2();

    function fitHandOfGodToViewport() {
      const distance = Math.abs(handOfGod.position.z);
      const viewportHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
      const viewportWidth = viewportHeight * camera.aspect;
      const viewportAspect = viewportWidth / viewportHeight;
      const overscan = 1.04;

      if (viewportAspect > handOfGodAspect) {
        handOfGodBaseScale.set(
          viewportWidth * overscan,
          (viewportWidth / handOfGodAspect) * overscan
        );
      } else {
        handOfGodBaseScale.set(
          viewportHeight * handOfGodAspect * overscan,
          viewportHeight * overscan
        );
      }
    }

    textureLoader.load(handOfGodTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      handOfGodAspect = texture.image.width / texture.image.height;
      handOfGodMaterial.uniforms.uMap.value = texture;
      handOfGodMaterial.needsUpdate = true;
      fitHandOfGodToViewport();
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });


    const restMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b0806,
      depthTest: false,
      depthWrite: false,
      fog: false,
      transparent: true,
      opacity: 0

    })

    const restPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1,1),
      restMaterial
    )

    textureLoader.load(rest, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      restMaterial.map = texture
      restMaterial.color.set(0xffffff)
      restMaterial.needsUpdate = true;
       restPlane.scale.set(texture.image.width * restImageScale,texture.image.height * restImageScale, 1)
    })

    restPlane.position.set(0, 0, -7);
   

    restPlane.renderOrder = 11
  camera.add(restPlane)
    // --- SWORD SETUP (Unchanged) ---
    const sword = new THREE.Group();
    const swordMaterial = new THREE.MeshBasicMaterial({
      color: 0x191a1c,
      transparent: true,
      side: THREE.DoubleSide
    });
    const swordImage = new THREE.Mesh(
      new THREE.PlaneGeometry(2.25, 5.5),
      swordMaterial
    );
    sword.add(swordImage);
    sword.rotation.z = -0.18;
    sword.position.set(1.8, 0.4, -0.4);
    scene.add(sword);

    textureLoader.load(swordTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      swordMaterial.map = texture;
      swordMaterial.color.set(0xffffff);
      swordMaterial.needsUpdate = true;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });

    const fate = new THREE.Group();
    const fateMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uMap: { value: null },
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uTime;
        uniform float uReveal;
        uniform float uOpacity;

        varying vec2 vUv;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;

          for (int i = 0; i < 5; i++) {
            value += noise(p) * amplitude;
            p *= 2.08;
            amplitude *= 0.52;
          }

          return value;
        }

        void main() {
          vec4 image = texture2D(uMap, vUv);
          vec2 centeredUv = vUv - 0.5;
          float vignette = smoothstep(0.78, 0.18, length(centeredUv));

          vec2 veinUv = vUv * vec2(8.0, 13.0);
          veinUv.x += sin(vUv.y * 18.0 + uTime * 1.3) * 0.55;
          veinUv.y -= uTime * 0.55;

          float flow = fbm(veinUv + fbm(veinUv * 0.7 + uTime * 0.18));
          float branch = abs(flow - 0.48);
          float veinLine = 1.0 - smoothstep(0.018, 0.085, branch);
          float veinGlow = 1.0 - smoothstep(0.04, 0.22, branch);

          float crawl = smoothstep(1.04 - uReveal * 1.25, 0.22, vUv.y + flow * 0.32);
          float revealNoise = fbm(vUv * 4.0 + vec2(0.0, -uTime * 0.08));
          float imageReveal = smoothstep(0.78 - uReveal * 0.95, 0.92 - uReveal * 0.72, revealNoise + vUv.y * 0.28);

          float bloodMask = veinLine * crawl;
          float revealMask = max(imageReveal, bloodMask * 0.82);
          vec3 blood = vec3(0.72, 0.08, 1.0) * (bloodMask * 1.5 + veinGlow * crawl * 0.45);
          vec3 cursedImage = image.rgb * vec3(0.7, 0.48, 1.05);
          vec3 finalColor = mix(blood, cursedImage + blood * 0.55, imageReveal);
          float alpha = image.a * uOpacity * max(revealMask, bloodMask) * vignette;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    })

    const fateImage = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      fateMaterial
    )
    fate.add(fateImage);
    fate.position.set(-2.5, -1.25, 0);
    scene.add(fate);

    textureLoader.load(fateTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      fateMaterial.uniforms.uMap.value = texture;
      fateMaterial.needsUpdate = true;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    })






    // --- BEHELITH SETUP (Unchanged) ---
    const behelith = new THREE.Group();
    const behelithMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a0505,
      transparent: true,
      side: THREE.DoubleSide
    })
    const behelithImage = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 2.5),
      behelithMaterial
    )
    behelithImage.scale.x = -2
    behelith.add(behelithImage)
    behelith.position.set(-4.5, -0.5, 0.5)
    textureLoader.load(behelitTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      behelithMaterial.map = texture;
      behelithMaterial.color.set(0xffffff);
      behelithMaterial.needsUpdate = true;
    })
    scene.add(behelith)

    // ==========================================
    // NEW CONCEPT: TRUE 3D PARALLAX BACKGROUNDS
    // ==========================================

    // --- GRIFFITH (Background for Layer 2) ---
    const griffith = new THREE.Group();
    const griffithMaterial = new THREE.MeshBasicMaterial({
      color: 0x222222, // Dark gray placeholder
      transparent: true,
      opacity: 0, // STARTS INVISIBLE
      side: THREE.DoubleSide,
      depthWrite: false // Prevents transparent edges from messing up other objects
    });
    const griffithImage = new THREE.Mesh(new THREE.PlaneGeometry(3, 6), griffithMaterial);
    griffith.add(griffithImage);

    // Z = -4 pushes him deep into the scene. Camera parallax happens automatically!
    griffith.position.set(2.5, -1, -4);
    scene.add(griffith);

    textureLoader.load(griffithTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      griffithMaterial.map = texture;
      griffithMaterial.color.set(0xffffff);
      griffithMaterial.needsUpdate = true;
    });

    // --- GUTS (Background for Layer 3) ---
    const guts = new THREE.Group();
    const gutsMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a, // Dark gray placeholder
      transparent: true,
      opacity: 0, // STARTS INVISIBLE
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const gutsImage = new THREE.Mesh(new THREE.PlaneGeometry(4, 7), gutsMaterial);
    guts.add(gutsImage);

    // Z = -6 pushes him EVEN DEEPER. He will move slower than Griffith!
    guts.position.set(-5, -1.5, -10);
    scene.add(guts);

    textureLoader.load(gutsTextureUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      gutsMaterial.map = texture;
      gutsMaterial.color.set(0xffffff);
      gutsMaterial.needsUpdate = true;
    });





    // --- ASH SETUP (Unchanged) ---
    const ashCount = 700;
    const ashPositions = new Float32Array(ashCount * 3);

    for (let i = 0; i < ashCount; i += 1) {
      const index = i * 3;
      ashPositions[index] = (Math.random() - 0.5) * 16;
      ashPositions[index + 1] = Math.random() * 8 - 2;
      ashPositions[index + 2] = (Math.random() - 0.5) * 12;
    }

    const ashGeometry = new THREE.BufferGeometry();
    ashGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(ashPositions, 3)
    );

    const ashMaterial = new THREE.PointsMaterial({
      color: 0xcab8aa,
      size: 0.025,
      transparent: true,
      opacity: 0.7
    });
    const ash = new THREE.Points(ashGeometry, ashMaterial);
    scene.add(ash);

    // --- INTERACTIVITY SETUP (Unchanged) ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(2, 2);
    const timer = new THREE.Timer();
    timer.connect(document);

    let animationId;
    let swordHovered = false;
    let behelithHovered = false;
    let behelithHoverScale = 1;
    let griffithHovered = false;
    let griffithHoverScale = 1;
    let gutsHovered = false;
    let gutsHoverScale = 1
    let hoverScale = 1;
    let scrollTarget = 0;
    let scrollProgress = 0;
    let burstEnergy = 0;

    function updateScrollTarget() {
      const scrollableDistance =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget =
        scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
    }

    function handlePointerMove(event) {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    }

    function handlePointerLeave() {
      pointer.set(2, 2);
    }

    function handleClick() {
      if (!swordHovered) return;
      burstEnergy = 1.0;

      const isRed = ashMaterial.color.getHex() === 0xff2200;
      ashMaterial.color.set(isRed ? 0xcab8aa : 0xff2200);
    }

    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      fitEclipseToViewport();
      fitHandOfGodToViewport();
      rebuildTextParticles();
      updateScrollTarget();
    }

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', handleResize);

    fitEclipseToViewport();
    fitHandOfGodToViewport();
    updateScrollTarget();


    const textParticleCount = 1200;
    const textParticleDistance = 7;
    const textParticlePositions = new Float32Array(textParticleCount * 3);
    const textTargetPositions = new Float32Array(textParticleCount * 3);
    const textBurstPositions = new Float32Array(textParticleCount * 3);
    const textParticleColors = new Float32Array(textParticleCount * 3);
    const textParticleSeeds = new Float32Array(textParticleCount);

    for (let i = 0; i < textParticleCount; i += 1) {
      const index = i * 3;
      const heat = Math.random();

      textParticleSeeds[i] = Math.random();
      textParticleColors[index] = THREE.MathUtils.lerp(0.8, 1, heat);
      textParticleColors[index + 1] = THREE.MathUtils.lerp(0.04, 0.32, heat);
      textParticleColors[index + 2] = THREE.MathUtils.lerp(0.015, 0.08, heat);
    }

    const textParticleGeometry = new THREE.BufferGeometry();
    textParticleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(textParticlePositions, 3)
    );
    textParticleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(textParticleColors, 3)
    );

    const textParticleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    const textParticles = new THREE.Points(textParticleGeometry, textParticleMaterial);
    textParticles.frustumCulled = false;
    textParticles.renderOrder = 10;
    camera.add(textParticles);

    function writeFallbackTextParticleTargets() {
      for (let i = 0; i < textParticleCount; i += 1) {
        const index = i * 3;
        textTargetPositions[index] = (Math.random() - 0.5) * 5;
        textTargetPositions[index + 1] = (Math.random() - 0.5) * 1.5;
        textTargetPositions[index + 2] = -textParticleDistance;
      }
    }

    function rebuildTextParticles() {
      const heading = struggleHeadingRef.current;
      if (!heading) {
        writeFallbackTextParticleTargets();
        return;
      }

      const rect = heading.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        writeFallbackTextParticleTargets();
        return;
      }

      const computed = window.getComputedStyle(heading);
      const canvas2d = document.createElement('canvas');
      const sampleScale = 0.5;
      canvas2d.width = Math.max(1, Math.floor(rect.width * sampleScale));
      canvas2d.height = Math.max(1, Math.floor(rect.height * sampleScale));

      const context = canvas2d.getContext('2d', { willReadFrequently: true });
      context.clearRect(0, 0, canvas2d.width, canvas2d.height);
      context.fillStyle = '#ffffff';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.font = `${computed.fontWeight} ${parseFloat(computed.fontSize) * sampleScale}px ${computed.fontFamily}`;

      const words = heading.textContent.trim().split(/\s+/);
      const parsedFontSize = parseFloat(computed.fontSize);
      const fontSize = Number.isNaN(parsedFontSize) ? 64 : parsedFontSize;
      const parsedLineHeight = parseFloat(computed.lineHeight);
      const lineHeight = (Number.isNaN(parsedLineHeight) ? fontSize * 0.96 : parsedLineHeight) * sampleScale;
      const maxWidth = canvas2d.width;
      const lines = [];
      let line = '';

      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        if (context.measureText(testLine).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      });
      lines.push(line);

      lines.forEach((textLine, lineIndex) => {
        const lineWidth = context.measureText(textLine).width;
        const x =
          computed.textAlign === 'right'
            ? canvas2d.width - lineWidth
            : computed.textAlign === 'center'
              ? (canvas2d.width - lineWidth) * 0.5
              : 0;
        context.fillText(textLine, x, lineIndex * lineHeight);
      });

      const imageData = context.getImageData(0, 0, canvas2d.width, canvas2d.height).data;
      const pixels = [];
      const step = 2;

      for (let y = 0; y < canvas2d.height; y += step) {
        for (let x = 0; x < canvas2d.width; x += step) {
          if (imageData[(y * canvas2d.width + x) * 4 + 3] > 80) {
            pixels.push({ x, y });
          }
        }
      }

      const viewportHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * textParticleDistance;
      const viewportWidth = viewportHeight * camera.aspect;
      const worldPerPixel = viewportWidth / window.innerWidth;
      const originX =
        ((rect.left + rect.width * 0.5) / window.innerWidth - 0.5) * viewportWidth;
      const originY =
        -((rect.top + rect.height * 0.5) / window.innerHeight - 0.5) * viewportHeight;

      for (let i = 0; i < textParticleCount; i += 1) {
        const index = i * 3;
        const pixel = pixels.length
          ? pixels[Math.floor((i / textParticleCount) * pixels.length + textParticleSeeds[i] * pixels.length) % pixels.length]
          : { x: Math.random() * canvas2d.width, y: Math.random() * canvas2d.height };

        let targetX = originX + (pixel.x / sampleScale - rect.width * 0.5) * worldPerPixel;
        let targetY = originY - (pixel.y / sampleScale - rect.height * 0.5) * worldPerPixel;
        const sigilSeed = textParticleSeeds[i];
        const sigilBand = Math.floor(sigilSeed * 7);
        const t = (i % 173) / 172;
        const jitterX = (textParticleSeeds[(i + 23) % textParticleCount] - 0.5) * 0.22;
        const jitterY = (textParticleSeeds[(i + 47) % textParticleCount] - 0.5) * 0.22;
        let sigilX = 0;
        let sigilY = 0;

        if (sigilBand === 0) {
          sigilX = (t - 0.5) * 0.38;
          sigilY = THREE.MathUtils.lerp(-1.85, 1.95, t);
        } else if (sigilBand === 1) {
          sigilX = THREE.MathUtils.lerp(-1.45, 0.1, t);
          sigilY = THREE.MathUtils.lerp(1.45, 0.42, t);
        } else if (sigilBand === 2) {
          sigilX = THREE.MathUtils.lerp(1.45, -0.1, t);
          sigilY = THREE.MathUtils.lerp(1.45, 0.42, t);
        } else if (sigilBand === 3) {
          sigilX = THREE.MathUtils.lerp(-1.7, 1.25, t);
          sigilY = THREE.MathUtils.lerp(0.22, -0.38, t);
        } else if (sigilBand === 4) {
          sigilX = THREE.MathUtils.lerp(1.7, -1.25, t);
          sigilY = THREE.MathUtils.lerp(0.22, -0.38, t);
        } else if (sigilBand === 5) {
          sigilX = THREE.MathUtils.lerp(-1.05, -0.15, t);
          sigilY = THREE.MathUtils.lerp(-1.65, -0.45, t);
        } else {
          sigilX = THREE.MathUtils.lerp(1.05, 0.15, t);
          sigilY = THREE.MathUtils.lerp(-1.65, -0.45, t);
        }

        targetX = Number.isFinite(targetX) ? targetX : 0;
        targetY = Number.isFinite(targetY) ? targetY : 0;
        sigilX = Number.isFinite(sigilX) ? sigilX : 0;
        sigilY = Number.isFinite(sigilY) ? sigilY : 0;

        textTargetPositions[index] = targetX;
        textTargetPositions[index + 1] = targetY;
        textTargetPositions[index + 2] = -textParticleDistance;

        textBurstPositions[index] = originX + sigilX + jitterX;
        textBurstPositions[index + 1] = originY + sigilY + jitterY;
        textBurstPositions[index + 2] = -THREE.MathUtils.lerp(0.85, 2.75, textParticleSeeds[(i + 71) % textParticleCount]);

        textParticlePositions[index] = textTargetPositions[index];
        textParticlePositions[index + 1] = textTargetPositions[index + 1];
        textParticlePositions[index + 2] = textTargetPositions[index + 2];
      }

      textParticleGeometry.attributes.position.needsUpdate = true;
    }

    rebuildTextParticles();
    let normalisedRadius = 0.22;
  

    const handleMouseMove = (e) => {
      const section = document.querySelector('#eclipse');
      if (!section) return;

      const sectionrect = section.getBoundingClientRect();
      const smallerSide = Math.min(sectionrect.width, sectionrect.height);
      normalisedRadius = 60 / smallerSide;

      const isInsideThirdSection =
        e.clientX >= sectionrect.left &&
        e.clientX <= sectionrect.right &&
        e.clientY >= sectionrect.top &&
        e.clientY <= sectionrect.bottom;

      thirdSectionHoveredRef.current = isInsideThirdSection;

      if (!isInsideThirdSection) return;

      const relativeX = e.clientX - sectionrect.left;
      const relativeY = e.clientY - sectionrect.top;

      const normalizedX = relativeX/ sectionrect.width;
      const normalizedY = relativeY / sectionrect.height
      
      let finalX = normalizedX
      let finalY = 1-normalizedY

      if(finalX < 0 ){
        finalX = 0
      } else if( finalX > 1){
        finalX = 1
      }

      if(finalY < 0){
        finalY = 0
      } else if(finalY > 1){
        finalY = 1
      }

      mouseCoordRef.current = {x:finalX, y:finalY}

    }
window.addEventListener('mousemove',handleMouseMove);




    // --- THE ANIMATE LOOP ---
    function animate(time) {
      animationId = window.requestAnimationFrame(animate);
      timer.update(time);
      const delta = timer.getDelta();


      scrollProgress = THREE.MathUtils.damp(
        scrollProgress,
        scrollTarget,
        5,
        delta
      );
      burstEnergy = THREE.MathUtils.damp(burstEnergy, 0, 4, delta);

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([swordImage, behelithImage, griffithImage, gutsImage])

      swordHovered = false;
      behelithHovered = false;
      griffithHovered = false;
      gutsHovered = false;

      fate.quaternion.copy(camera.quaternion)

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        if (hitObject === swordImage) swordHovered = true;
        if (hitObject === behelithImage) behelithHovered = true;
        if (hitObject === griffithImage) griffithHovered = true;
        if (hitObject === gutsImage) gutsHovered = true;
      }
      canvas.style.cursor = (swordHovered || behelithHovered || griffithHovered || gutsHovered) ? 'pointer' : 'default';

      // --- FOREGROUND ANIMATIONS (Sword/Behelit - Unchanged) ---
      const breathingScale = 1 + Math.sin(time * 0.001) * 0.05;
      hoverScale = THREE.MathUtils.damp(
        hoverScale,
        swordHovered ? 1.15 : 1,
        8,
        delta
      );
      const finalSwordScale = breathingScale * hoverScale;

      sword.scale.set(finalSwordScale, finalSwordScale, finalSwordScale);

      const behelithBreathingScale = 1 + Math.sin(time * 0.0005) * 0.05;
      behelithHoverScale = THREE.MathUtils.damp(
        behelithHoverScale,
        behelithHovered ? 1.15 : 1,
        8,
        delta
      );
      const finalBehelithScale = behelithBreathingScale * behelithHoverScale;
      behelith.scale.set(finalBehelithScale, finalBehelithScale, finalBehelithScale);

      const griffithBreathingScale = 1 + Math.sin(time * 0.0005) * 0.05;

      griffithHoverScale = THREE.MathUtils.damp(
        griffithHoverScale,
        griffithHovered ? 1.05 : 1,
        8,
        delta
      )
      const finalGriffithScale = griffithBreathingScale * griffithHoverScale;
      griffith.scale.set(finalGriffithScale, finalGriffithScale, finalGriffithScale);

      const gutsBreathingScale = 1 + Math.sin(time * 0.0005) * 0.05;
      gutsHoverScale = THREE.MathUtils.damp(
        gutsHoverScale,
        gutsHovered ? 1.05 : 1,
        8,
        delta
      )

      const finalGutsScale = gutsBreathingScale * gutsHoverScale;
      guts.scale.set(finalGutsScale, finalGutsScale, finalGutsScale);

      // --- ECLIPSE ANIMATION (Unchanged) ---
      const eclipsePulse = 1 + Math.sin(time * 0.0003) * 0.015;
      const eclipseScrollScale = THREE.MathUtils.lerp(1, 1.22, scrollProgress);
      const eclipseScale = eclipsePulse * eclipseScrollScale;

      eclipse.scale.set(
        eclipseBaseScale.x * eclipseScale,
        eclipseBaseScale.y * eclipseScale,
        1
      );
      const godhandPulse = 1 + Math.sin(time * 0.0003) * 0.015;
      const godhandScrollScale = THREE.MathUtils.lerp(1, 1.22, scrollProgress);
      const godhandScale = godhandPulse * godhandScrollScale;


      godhand.scale.set(
        godHandBaseScale.x * godhandScale,
        godHandBaseScale.y * godhandScale

      )

      const handOfGodReveal = THREE.MathUtils.smoothstep(scrollProgress, 0.72, 1.0);
      const isThirdSectionHovered = thirdSectionHoveredRef.current;
      sandAmount = THREE.MathUtils.damp(
        sandAmount,
        isThirdSectionHovered ? 1 : 0,
        isThirdSectionHovered ? 4.8 : 3.2,
        delta
      );
      const actualSand = handOfGodReveal * sandAmount;
      let mouseX = mouseCoordRef.current.x;
      let mouseY = mouseCoordRef.current.y;
      

      const handOfGodPulse = 1 + Math.sin(time * 0.00045) * 0.012;
      handOfGod.scale.set(
        handOfGodBaseScale.x * handOfGodPulse,
        handOfGodBaseScale.y * handOfGodPulse,
        1
      );
      handOfGodMaterial.uniforms.uTime.value = time * 0.001;
      handOfGodMaterial.uniforms.uReveal.value = handOfGodReveal;
      handOfGodMaterial.uniforms.uOpacity.value = handOfGodReveal * 0.68;
      handOfGodMaterial.uniforms.uSandAmount.value = actualSand;
      handOfGodMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
      handOfGodMaterial.uniforms.uRadius.value = normalisedRadius || 0.11;

      if (imagePointMaterial) {
         imagePointMaterial.opacity = handOfGodReveal * 0.35
      }

      restMaterial.opacity = handOfGodReveal ;




      // --- CAMERA & SCROLL MOVEMENT ---
      camera.position.x = THREE.MathUtils.lerp(0, 0.8, scrollProgress);
      camera.position.y = THREE.MathUtils.lerp(2.4, 1.7, scrollProgress);
      camera.position.z = THREE.MathUtils.lerp(8, 5.8, scrollProgress);
      camera.lookAt(0, 0, 0);

      eclipse.position.x =
        THREE.MathUtils.lerp(0.35, -0.25, scrollProgress) +
        Math.sin(time * 0.0002) * 0.08;
      eclipse.position.y = Math.cos(time * 0.00015) * 0.05;

      sword.rotation.y = Math.sin(time * 0.0007) * 0.18;
      sword.rotation.z = 1.5 * burstEnergy + THREE.MathUtils.lerp(-0.18, 0.55, scrollProgress)
      behelith.position.x = THREE.MathUtils.lerp(-2.5, 1.5, scrollProgress)
      sword.position.y = Math.sin(time * 0.001) * 0.08 + 0.2;

      // ==========================================
      // NEW CONCEPT: THE SMOOTHSTEP GHOST FADE
      // ==========================================

      // GRIFFITH FADE LOGIC
      // smoothstep returns 0 to 1 as scrollProgress goes from 0.1 to 0.3
      const redBgFadeOut = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.1, 0.35);
      eclipseMaterial.opacity = redBgFadeOut;
      const godhandFadeIn = THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.35);
      godhandMaterial.opacity = godhandFadeIn;

      const godhandFadeout = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.6, 0.8);
      godhandMaterial.opacity = godhandFadeout * godhandFadeIn;


      const swordFadeout = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.35);
      swordMaterial.opacity = swordFadeout

      const behelithFadeOut = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.35);
      behelithMaterial.opacity = behelithFadeOut

      const FatefadeIn = THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.45);

      const FateFadeOut = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.5, 0.7);
      const fateVisibility = FateFadeOut * FatefadeIn;
      fateMaterial.uniforms.uTime.value = time * 0.001;
      fateMaterial.uniforms.uReveal.value = FatefadeIn;
      fateMaterial.uniforms.uOpacity.value = fateVisibility;




      // const griffithFadeIn = THREE.MathUtils.smoothstep(scrollProgress, 0.1, 0.3);
      // We invert it to fade OUT between 0.6 and 0.8
      // const griffithFadeOut = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.6, 0.8);
      // // Multiply them together! If either is 0, he is invisible.
      // // We multiply by 0.8 so he's slightly ghostly, then the 3D fog does the rest.
      // griffithMaterial.opacity = griffithFadeIn * griffithFadeOut * 0.8;

      // GUTS FADE LOGIC
      // Fades in during the final section (0.4 to 0.6) and stays visible
      // const gutsFadeIn = THREE.MathUtils.smoothstep(scrollProgress, 0.4, 0.6);
      // gutsMaterial.opacity = gutsFadeIn * 0.7;


      // --- EFFECTS ANIMATIONS (Ash/Burst - Unchanged except speed calc moved up) ---
      ash.rotation.y = time * 0.00005;
      const ashBurstScale = THREE.MathUtils.lerp(1, 2, burstEnergy);
      ash.scale.set(ashBurstScale, ashBurstScale, ashBurstScale);

      const normalFogDensity = THREE.MathUtils.lerp(0.045, 0.075, scrollProgress);
      scene.fog.density = THREE.MathUtils.lerp(normalFogDensity, 0.01, burstEnergy);

      rimLight.intensity = THREE.MathUtils.lerp(12, 30, burstEnergy);

      const positions = ashGeometry.attributes.position.array;
      const currentAshSpeed = THREE.MathUtils.lerp(0.5, 2.5, burstEnergy);

      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= currentAshSpeed * delta;
        if (positions[i] < -2) {
          positions[i] = 6;
        }
      }

      ashGeometry.attributes.position.needsUpdate = true;

      const isTextHovered = textHoveredRef.current;
      textDissolve = THREE.MathUtils.damp(
        textDissolve,
        isTextHovered ? 1 : 0,
        isTextHovered ? 4.8 : 3.2,
        delta
      );


      const textPositions = textParticleGeometry.attributes.position.array;
      for (let i = 0; i < textParticleCount; i += 1) {
        const index = i * 3;
        const wobble = Math.sin(time * 0.006 + textParticleSeeds[i] * 24) * 0.075 * textDissolve;
        const twist = Math.sin(time * 0.0016 + textParticleSeeds[i] * Math.PI * 2) * 0.2 * textDissolve;
        const nextX = THREE.MathUtils.lerp(
          textTargetPositions[index],
          textBurstPositions[index],
          textDissolve
        );
        const nextY = THREE.MathUtils.lerp(
          textTargetPositions[index + 1],
          textBurstPositions[index + 1],
          textDissolve
        );

        const particleX = nextX + nextY * twist * 0.08 + wobble;
        const particleY = nextY - nextX * twist * 0.04 + Math.cos(time * 0.004 + textParticleSeeds[i] * 18) * 0.05 * textDissolve;
        const particleZ = THREE.MathUtils.lerp(
          textTargetPositions[index + 2],
          textBurstPositions[index + 2],
          textDissolve
        );

        textPositions[index] = Number.isFinite(particleX) ? particleX : 0;
        textPositions[index + 1] = Number.isFinite(particleY) ? particleY : 0;
        textPositions[index + 2] = Number.isFinite(particleZ) ? particleZ : -textParticleDistance;
      }

      textParticleMaterial.opacity = THREE.MathUtils.smoothstep(textDissolve, 0.02, 0.2) * 0.95;
      textParticleGeometry.attributes.position.needsUpdate = true



      renderer.render(scene, camera);





    }

    animate();

    // --- CLEANUP (Updated to include new characters) ---
    return () => {
      window.cancelAnimationFrame(animationId);
      timer.dispose();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', handleResize);

      eclipse.geometry.dispose();
      eclipseMaterial.map?.dispose();
      eclipseMaterial.dispose();

      godhand.geometry.dispose();
      godhandMaterial.map?.dispose();
      godhandMaterial.dispose();

      handOfGod.geometry.dispose();
      handOfGodMaterial.uniforms.uMap.value?.dispose();
      handOfGodMaterial.dispose();

      swordImage.geometry.dispose();
      swordMaterial.map?.dispose();
      swordMaterial.dispose();

      behelithImage.geometry.dispose();
      behelithMaterial.map?.dispose();
      behelithMaterial.dispose();

      // NEW CLEANUP
      griffithImage.geometry.dispose();
      griffithMaterial.map?.dispose();
      griffithMaterial.dispose();

      gutsImage.geometry.dispose();
      gutsMaterial.map?.dispose();
      gutsMaterial.dispose();

      fateImage.geometry.dispose();
      fateMaterial.uniforms.uMap.value?.dispose();
      fateMaterial.dispose();



      ashGeometry.dispose();
      ashMaterial.dispose();

      if (imageParticle) {
        camera.remove(imageParticle);
      }
      imageParticleGeometry?.dispose();
      imagePointMaterial?.dispose();

      textParticleGeometry.dispose();
      textParticleMaterial.dispose();
      window.removeEventListener('mousemove',handleMouseMove)
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#040303] text-[#f4eee8]">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />

      <main className="relative z-10 pointer-events-none">
        <section id="home" className={sectionClasses}>
          <div className="absolute inset-0 -z-10 bg-transparent md:bg-transparent" />
          <div className="w-full max-w-155 pointer-events-none">
            <p className={eyebrowClasses}>A Story by Kentaro Miura</p>
            <h1 className="w-[min(320px,78vw)] leading-none md:w-[min(560px,88vw)]">
              <img
                src={berserkLogoUrl}
                alt="Berserk"
                className="h-auto w-full object-contain object-left drop-shadow-[0_8px_24px_rgba(0,0,0,0.75)]"
              />
            </h1>
            <p className='mt-6 max-w-130 text-1  text-white text-shadow-lg text-shadow-red-500  md:text-xl'>
              A dark fantasy journey shaped by struggle, memory, and the will to
              keep moving.
            </p>
          </div>
          <p className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-[0.16em] text-[#d9cbc2]">
            Scroll to enter
          </p>
        </section>

        <section
          id="brand"
          className={`${sectionClasses} md:justify-end md:text-right`}
        >
          <div className="absolute inset-0 -z-10 bg-transparent md:bg-transparent opacity-75" />
          <div className="w-full max-w-155 pointer-events-auto">

            <h2
              ref={struggleHeadingRef}
              className="max-w-155 text-4xl font-extrabold uppercase leading-[0.96] [text-shadow:0_8px_36px_rgba(0,0,0,0.8)] md:text-7xl lg:text-8xl text-shadow-lg text-shadow-neutral-950 transition-opacity duration-500"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('opacity-0'); 
                textHoveredRef.current = true;
                
              }}
              onMouseLeave={(e) => {
                 e.currentTarget.classList.remove('opacity-0');
                 textHoveredRef.current = false; 
              }}
            >
              Struggle against fate.
            </h2>
            <p className='mt-6 max-w-130 text-1   text-white text-shadow-lg text-shadow-neutral-800 md:text-xl'>
              In this world,  is the destiny of mankind controlled by some transcendental entity or law?
              Is it like the hand of God hovering above?At least it is true; that man has no control —even over his own will..
            </p>
          </div>
        </section>

        <section id="eclipse" className={`${sectionClasses} pointer-events-auto`}
        onMouseEnter={() => thirdSectionHoveredRef.current = true}
        onMouseLeave={() => {
          thirdSectionHoveredRef.current = false
          mouseCoordRef.current = {x:0.5, y: 0.5}
        }
          
        }
        >
          <div className="absolute inset-0 -z-10 bg-transparent md:bg-transparent" />
          <div className="w-full max-w-155 pointer-events-none">
            <p className={eyebrowClasses}>The Eclipse</p>
            <h2 className="max-w-155 text-4xl font-extrabold uppercase leading-[0.96] [text-shadow:0_8px_36px_rgba(0,0,0,0.8)] md:text-7xl lg:text-8xl">
              Even in darkness, move forward.
            </h2>
            <p className='mt-6 max-w-130 text-1  text-white text-shadow-lg text-shadow-cyan-500  md:text-xl'>
              Struggle, challenge and 
              rise to struggle again
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
