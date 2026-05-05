# lab01 — Варіант 5 (атом літію)

Файли:
- vr.html — VR сцена (A-Frame)
- arjs.html — Marker-based AR (AR.js). Використовує pattern-Ernest_Rutherford_Arms.svg.patt у цій папці.
- mindar.html — MindAR image-target сцена (використовує targets.mind у цій папці)

Як запустити локально:
1. В репозиторії запустіть локальний сервер (в корені):
   ```bash
   python3 -m http.server 8080
   ```
2. Відкрийте у браузері:
   - VR: http://127.0.0.1:8080/lab01/var5/vr.html
   - AR.js: http://127.0.0.1:8080/lab01/var5/arjs.html (потребує вебкамери)
   - MindAR: http://127.0.0.1:8080/lab01/var5/mindar.html (потребує вебкамери)

Примітки:
- MindAR використовує CDN-версію A-Frame/MindAR для простоти.
- Переконайтесь, що дозволили доступ до камери для AR-сцен.
