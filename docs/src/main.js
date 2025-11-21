const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.FromHexString("#0C0075"); // black background

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        200,
        new BABYLON.Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    // Basic hemispheric light (not used by stars, but helps if you add objects)
    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.5;

    // --- STARFIELD ---
    const starCount = 1000;
    const starfieldSize = 500;

    // Base emissive material (bright white)
    const baseMat = new BABYLON.StandardMaterial("starMat", scene);
    baseMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    baseMat.disableLighting = true;

    const stars = [];

    for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 0.8 + 0.2; // varying star sizes
        const star = BABYLON.MeshBuilder.CreateSphere("star" + i, { diameter: size }, scene);
        star.position = new BABYLON.Vector3(
            (Math.random() - 0.5) * starfieldSize,
            (Math.random() - 0.5) * starfieldSize,
            (Math.random() - 0.5) * starfieldSize
        );
        star.material = baseMat;
        stars.push(star);
    }

    // Scroll camera
    let scrollZ = 0;
    window.addEventListener("wheel", (e) => {
        scrollZ += e.deltaY * 0.2;
    });

    // Simple twinkle by adjusting visibility
    scene.registerBeforeRender(() => {
        stars.forEach(star => {
            const twinkle = 0.7 + Math.sin(performance.now() * 0.002 + star.position.x) * 0.3;
            star.visibility = twinkle; // brightness effect
        });
        camera.target.z = scrollZ;
    });

    return scene;
};

const scene = createScene();
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());


// --- Navigation (unchanged) ---
const wrapper = document.getElementById("sections-wrapper");
const sections = document.querySelectorAll(".section-content .content-wrapper");

const activateSection = (index) => {
    wrapper.style.transform = `translateX(-${index * 100}vw)`;
    sections.forEach(sec => sec.classList.remove("active"));
    sections[index].classList.add("active");
};

activateSection(0);

document.querySelectorAll("a[data-target]").forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();
        const index = parseInt(a.dataset.target);
        activateSection(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});