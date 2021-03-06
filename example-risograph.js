/**
 * An advanced Canvas2D example of creating artwork for a Risograph printer.
 * This exports multiple layers: each color as a black & white mask,
 * a proof (composite of all colours), and a JSON metadata of ink colours & intensities.
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require('canvas-sketch');
const seedRandom = require('seed-random');

const settings = {
	// We can turn on viewport scaling to make the image
	// appear a bit more crisp during development. This will not
	// affect output size.
	scaleToView: true,
	// Output resolution, we use a high value for print artwork
	pixelsPerInch: 72,
	// US Letter size 8.5x11 inches
	dimensions: [8.5, 11],
	// all our dimensions and rendering units will use inches
	units: 'in',
};

const sketch = ({ width, height, render }) => {
	let currentSeed;

	// Build a list of "layers", each corresponding to a print color
	const colors = ['#ffe800', '#f15060', '#0078bf'];
	const layers = colors.map((color, i) => {
		// Create a render buffer for each color layer
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		return {
			color,
			canvas,
			context,
			alpha: 1,
			shapes: [],
		};
	});

	// Background color
	const background = 'white';

	return function(props) {
		const { canvas, context, width, height } = props;

		// Draw all layers with their true colors
		drawLayers(props);

		// Now let's create a composite for all our layers
		context.globalCompositeOperation = 'multiply';
		layers.forEach(layer => {
			// Blend in the new layer
			context.drawImage(layer.canvas, 0, 0, width, height);
		});
		// Revert to default blending
		context.globalCompositeOperation = 'source-over';
	};

	// Get a random float between [min..max] range
	function random(min, max) {
		return Math.random() * (max - min) + min;
	}

	// Return a list of random squares between [0..1] range
	function createShapes(count = 10) {
		return Array.from(new Array(count)).map(() => {
			const margin = 2;
			const x = random(margin, width - margin);
			const y = random(margin, height - margin);
			const size = random(0.05, 2);
			const radius = size / 2;

			const types = ['square', 'circle', 'arc'];
			const type = types[Math.floor(Math.random() * types.length)];
			switch (type) {
				case 'square':
					return context => context.fillRect(x - size / 2, y - size / 2, size, size);
				case 'circle':
					return context => {
						context.beginPath();
						context.arc(x, y, radius, 0, Math.PI * 2, false);
						context.fill();
					};
				case 'arc':
					const lineWidth = random(0.05, 0.5);
					const start = Math.PI * 2 * random(-1, 1);
					const length = Math.PI * 2 * random(0.25, 0.5);
					return context => {
						context.beginPath();
						context.arc(x, y, radius, start, start + length, false);
						context.lineWidth = lineWidth;
						context.stroke();
					};
			}
		});
	}

	// A function to update the generative artwork with new content
	function generate() {
		currentSeed = String(Math.floor(Math.random() * 100000));
		seedRandom(currentSeed, { global: true });

		// Print seed in console for testing
		console.log('Current random seed:', currentSeed);

		const softIndex = Math.floor(Math.random() * layers.length);
		layers.forEach((layer, i) => {
			layer.alpha = i === softIndex ? 0.75 : 1;
			layer.shapes = createShapes(Math.floor(random(5, 20)));
		});
	}

	// Draw each layer to its own canvas buffer
	function drawLayers(props) {
		const { canvasWidth, canvasHeight, width, height, scaleX, scaleY } = props;
		generate()

		// Draw each layer on top to create a final composite
		layers.forEach(layer => {
			// Make sure the layer buffer size matches the composite size
			layer.canvas.width = canvasWidth;
			layer.canvas.height = canvasHeight;

			// Scale the layer context the same as the composite context
			layer.context.save();
			layer.context.scale(scaleX, scaleY);

			// Clear the layer canvas
			layer.context.clearRect(0, 0, width, height);

			// Draw each shape with the color of this layer,
			// or when rendering split layers, draw with black
			layer.context.fillStyle = layer.color;
			layer.context.strokeStyle = layer.color;
			layer.context.globalAlpha = layer.alpha;
			layer.shapes.forEach(shape => {
				shape(layer.context);
			});

			// Restore layer context & draw it onto the final composite
			layer.context.restore();
		});
	}
};

canvasSketch(sketch, settings);
