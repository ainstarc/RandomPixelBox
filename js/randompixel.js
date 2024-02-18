async function startGame(level) {
    const gridSize = getGridSize(level);
    const pixelContainer = document.getElementById('pixel-container');
    const minScreenSize = Math.min(window.innerWidth, window.innerHeight);
    const pixelSize = minScreenSize / gridSize;

    pixelContainer.innerHTML = ""; // Clear previous grid if any

    const colorsResponse = await fetch('json/colors.json');
    const colors = await colorsResponse.json();

    const pixelGrid = document.createElement('div');
    pixelGrid.classList.add('pixel-grid');
    pixelGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    pixelGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const colorOptions = colors[level];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.style.width = pixelSize + 'px';
            pixel.style.height = pixelSize + 'px';
            pixel.style.backgroundColor = getRandomColor(colorOptions); // Set random color based on grid size
            pixel.dataset.row = i;
            pixel.dataset.col = j;
            pixelGrid.appendChild(pixel);
        }
    }

    pixelContainer.appendChild(pixelGrid);

    // Add click event listener to the pixel box
    pixelGrid.addEventListener('click', function (event) {
        const clickedPixel = event.target;
        const clickedRow = parseInt(clickedPixel.dataset.row);
        const clickedCol = parseInt(clickedPixel.dataset.col);
        const clickedColor = clickedPixel.style.backgroundColor;
        const pixels = document.querySelectorAll('.pixel');

        let similarColorFound = false;

        let whiteNeighborCount = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const row = clickedRow + i;
                const col = clickedCol + j;
                if (
                    row >= 0 && row < gridSize &&
                    col >= 0 && col < gridSize
                ) {
                    const neighborPixel = pixels[row * gridSize + col];
                    if (neighborPixel !== clickedPixel && neighborPixel.style.backgroundColor === clickedColor) {
                        similarColorFound = true;
                        break;
                    }
                    if (neighborPixel.style.backgroundColor === 'white') {
                        whiteNeighborCount++;
                    }
                }
            }
            if (similarColorFound) break;
        }

        if (whiteNeighborCount === 7 || whiteNeighborCount === 8) {
            pixels.forEach(pixel => {
                if (pixel.style.backgroundColor === clickedColor) {
                    pixel.style.backgroundColor = 'white';
                }
            });
        } else if (!similarColorFound) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const row = clickedRow + i;
                    const col = clickedCol + j;
                    if (
                        row >= 0 && row < gridSize &&
                        col >= 0 && col < gridSize
                    ) {
                        const neighborPixel = pixels[row * gridSize + col];
                        neighborPixel.style.backgroundColor = getRandomColor(colorOptions);
                    }
                }
            }
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const row = clickedRow + i;
                    const col = clickedCol + j;
                    if (
                        row >= 0 && row < gridSize &&
                        col >= 0 && col < gridSize
                    ) {
                        const neighborPixel = pixels[row * gridSize + col];
                        neighborPixel.style.backgroundColor = 'white';
                    }
                }
            }
            pixels.forEach(pixel => {
                if (pixel.style.backgroundColor === clickedColor) {
                    pixel.style.backgroundColor = 'white';
                }
            });
        }
    });
}

function getGridSize(level) {
    switch (level) {
        case 'beginner':
            return 10;
        case 'intermediate':
            return 20;
        case 'expert':
            return 30;
        default:
            return 10; // Default to beginner level
    }
}

function getRandomColor(colorOptions) {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
}

startGame('beginner'); // You can adjust the level as needed
