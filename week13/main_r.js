import * as THREE from 'three';
import { MindARThree } from 'mindar-face-three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const emotionsUA = {
    happy:     'радість',
    sad:       'сум',
    angry:     'злість',
    surprised: 'здивування',
    neutral:   'нейтральність',
    disgusted: 'відраза',
    fearful:   'страх',
};

const genderUA = {
    male:   'чоловік',
    female: 'жінка',
};

const humanConfig = {
    debug: false,
    backend: 'webgl',
    modelBasePath: '../human-main/models/',
    filter: { enabled: false },
    face: {
        enabled: true,
        detector: { rotation: false },
        mesh: { enabled: true },
        iris: { enabled: false },
        attention: { enabled: false },
        description: { enabled: true },
        emotion: { enabled: true },
        antispoof: { enabled: false },
        liveness: { enabled: false },
    },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false },
    segmentation: { enabled: false },
};

document.addEventListener('DOMContentLoaded', () => {

    const start = async () => {

        const mindarThree = new MindARThree({
            container: document.body,
            uiScanning: 'yes',
            uiLoading: 'yes',
        });

        const { scene, cssScene, camera, renderer, cssRenderer } = mindarThree;

        const emotionDiv = document.querySelector('#emotion-label');
        const obj = new CSS3DObject(emotionDiv);
        const anchor = mindarThree.addCSSAnchor(1);
        anchor.group.add(obj);

        await mindarThree.start();

        const video = document.querySelector('video');

        const human = new Human.Human(humanConfig);

        console.log('Human version:', human.version, '| tfjs version:', human.tf.version['tfjs-core']);
        console.log('Backend:', human.tf.getBackend(), '| available:', human.env.backends);

        await human.load();
        console.log('Models loaded:', human.models.loaded());

        await human.warmup();
        console.log('Human ready');

        const ageEl = document.querySelector('#age');
        const genderEl = document.querySelector('#gender');

        let frameCount = 0;
        let isDetecting = false;

        renderer.setAnimationLoop(() => {
            frameCount++;

            if (frameCount % 5 === 0 && !isDetecting) {
                isDetecting = true;
                human.detect(video)
                    .then(() => {
                        const face = human.result?.face?.[0];
                        if (face) {
                            if (face.age) {
                                ageEl.textContent = 'Вік: ' + Math.round(face.age);
                            }
                            if (face.gender && face.genderScore > 0.5) {
                                genderEl.textContent = 'Стать: ' + (genderUA[face.gender] || face.gender);
                            }
                            const emotions = face.emotion;
                            if (emotions && emotions.length > 0) {
                                const sorted = [...emotions].sort((a, b) => b.score - a.score);
                                emotionDiv.textContent = emotionsUA[sorted[0].emotion] || sorted[0].emotion;
                            }
                        }
                    })
                    .catch(err => {
                        console.warn('Human detect error:', err);
                    })
                    .finally(() => {
                        isDetecting = false;
                    });
            }

            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
        });
    };

    start();
});
