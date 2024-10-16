import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
// import { loadFull } from "tsparticles";
import { useCallback,useMemo } from "react";

function Particle() {
    const particlesInit = async (main) => {
        console.log(main);

        await loadSlim(main);
      };

      const particlesLoaded = (container) =>{
        console.log(container);
      };

    return <Particles id = "tsparticles" loaded = {particlesLoaded} init={particlesInit} options = {{
        "fullScreen": {
            "enable": true,
            "zIndex": -1
        },
        "particles": {
            "number": {
                "value": 20,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#fff"
            },
            "shape": {
                "type": "triangles",
                "options": {
                    "sides": 5
                }
            },
            "opacity": {
                "value": 1,
                "random": false,
                "anim": {
                    "enable": true,
                    "speed": 0.6,
                    "opacity_min": 0.2,
                    "sync": true
                }
            },
            "size": {
                "value": 2,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 20,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "rotate": {
                "value": 0,
                "random": true,
                "direction": "clockwise",
                "animation": {
                    "enable": true,
                    "speed": 5,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 600,
                "color": "#ffffff",
                "opacity": 0.7,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 3,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": ["grab"]
                },
                "onclick": {
                    "enable": true,
                    "mode": "bubble"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true,
        "background": {
            
            "image": "linear-gradient(to bottom right, red,purple)",
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
        }
    }}  />;
};

export default Particle;