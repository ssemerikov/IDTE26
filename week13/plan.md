1. Взяти приклад спільного використання Three.js, MindAR (з обличчям):

	/home/cc/Desktop/SR_Im-25/week8/ 

2. З прикладу видалити всі елементи, крім точки обличчя з номером 1

3. У /home/cc/Desktop/IDTE26/human-main/ відшукати приклад визначення емоцій, віку та статі

	/home/cc/Desktop/IDTE26/human-main/demo/typescript/

4. Адаптувати приклад до JavaScript

5. До прикладу з п. 1 внести зміни:

5.1. У index.html - завантаження бібліотеки human, локальне або віддалене:

	https://github.com/vladmandic/human/wiki/Install - це є основа для початку роботи

<!DOCTYPE HTML>
<script src="https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.js"></script>
<script src="https://unpkg.dev/@vladmandic/human/dist/human.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/human/1.4.1/human.js"></script>

Included
dist/human.js: IIFE format bundle with TFJS for Browsers
dist/human.esm.js: ESM format bundle with TFJS for Browsers
dist/human.esm-nobundle.js: ESM format bundle without TFJS for Browsers, must be run through bundler to resolve dependencies
dist/human.node.js: CommonJS format for NodeJS, optimized for usage with tfjs-node
dist/human.node-gpu.js: CommonJS format for NodeJS, optimized for usage with tfjs-node-gpu

5.2. Відео з камери створюється MindAR, а human має його використовувати

5.3. Опрацювання кадрів з камери - кожен 5-тий кадр

5.4. Виведення віку та статі - у елементі <div>...</div>, українською

5.5. Відображення емоції - виведенням тексту українською у точці обличчя з номером 1 як елемент CSS 

	/home/cc/Desktop/SR_Im-25/week7/ - example
