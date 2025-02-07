const socket = io()

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: false });

const canvasConfig = {
    width: 51,
    height: 51,
    scale: 12,
    color: `rgba(0, 0, 0, 255)`,
}

canvas.width = canvasConfig.width
canvas.height = canvasConfig.height

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);

canvas.style.transform = `scale(${canvasConfig.scale})`

canvas.addEventListener("click", e => {
    const { x, y } = getPointOnCanvas(e, canvasConfig.scale);

    socket.emit('drawing', {
        x: x,
        y: y,
    })
})

socket.on("firstConnect", (data) => {
    ctx.fillStyle = canvasConfig.color;
    data.forEach(({ x, y }) => {
        ctx.fillRect(x, y, 1, 1);
    })
})

socket.on('drawing', (data) => {
    ctx.fillStyle = `rgba(0, 0, 0, 255)`;
    ctx.fillRect(data.x, data.y, 1, 1);
});

const getPointOnCanvas = (event, scale) => {
    const canvasOffset = canvas.getBoundingClientRect()

    return {
        x: Math.ceil((event.clientX - canvasOffset.left) / scale) - 1,
        y: Math.ceil((event.clientY - canvasOffset.top) / scale) - 1
    }
}