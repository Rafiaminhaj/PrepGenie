import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);
  const [isGolden, setIsGolden] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const handleThemeChange = (e) => {
      if (e.detail?.theme === 'golden') setIsGolden(true);
      else setIsGolden(false);
    };

    window.addEventListener('theme-magic', handleThemeChange);
    return () => window.removeEventListener('theme-magic', handleThemeChange);
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 0.5,
            },
          },
        },
      },
      particles: {
        color: {
          value: isGolden ? ["#fbbf24", "#f59e0b", "#d97706"] : ["#6366f1", "#a855f7", "#38bdf8"],
        },
        links: {
          color: isGolden ? "#fcd34d" : "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50,
        },
        opacity: {
          value: 0.4,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [isGolden]
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
    );
  }

  return null;
};

export default ParticleBackground;
