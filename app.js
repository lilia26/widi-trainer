const app = function() {

	// Module Pattern - PRIVATE methods/properties ////////////////////////////////
	// Module Pattern relies on Closures

/*
	const oCatalog = { // json
		arr : null,

		set items(o) { // setters (mutator methods) function

			if (this.arr == null)
				this.arr = o;
			else
				console.error("Catalog Items have already been initialized.");

		},

		get items() { // getters (accessor methods) function

			return this.arr;

		},

		get length() {

			if (this.arr == null)
				return null;
			return this.arr.length;

		}
	};
*/

	const randomIntFromInterval = function(min, max) {
	  return Math.floor(Math.random() * (max - min + 1) + min)
	}
	
	const shuffleArray = function(array) {
		// implemeneted as Fisher–Yates shuffle
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	const drawPaperClip = function(ctx, v) {
		ctx.beginPath();
		switch(v) {
			case 1:
				ctx.moveTo(100, 290);
				ctx.arc(50, 50, 50, 0, Math.PI, true);
				ctx.arc(45, 360, 45, Math.PI , Math.PI * 2, true);
				ctx.arc(50, 140, 39, 0, Math.PI, true);
				ctx.lineTo(11, 290);
				break;
			case 2:
				ctx.moveTo(368, 0); // 368 just an estimate of 290 + 78 (using C = 2*Pi*r).
				ctx.arc(50, 50, 50,  Math.PI * 1.5, Math.PI, true);
				ctx.arc(45, 360, 45, Math.PI , Math.PI * 2, true);
				ctx.arc(50, 140, 39, 0, Math.PI, true);
				ctx.lineTo(11, 290);
				break;
			case 3:
				ctx.moveTo(100, 290);
				ctx.arc(50, 50, 50, 0, Math.PI, true);
				ctx.arc(45, 360, 45, Math.PI , Math.PI * 2.5, true);
				ctx.arc(210, 365, 39, Math.PI * 2.5, Math.PI * 1.5, true);
				ctx.lineTo(39, 326);
				break;
		}
		ctx.stroke();	
	}

	const renderExampleTile = function(canvas) {
		renderTile(canvas);
		return;
/*		
		ctx = canvas.getContext("2d")
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#333";
		ctx.scale(.15, .15);

		let coords = getQuadrantCoordinates(0);
		ctx.translate(coords.x, coords.y);

		let d = 90;
		ctx.rotate(d * Math.PI / 180);

		drawPaperClip(ctx, 1);

		ctx.rotate(-d * Math.PI / 180); // reverse the rotation
		ctx.translate(-coords.x, -coords.y); // reverse the translation


		coords = getQuadrantCoordinates(1);
		ctx.translate(coords.x, coords.y);

		d = 45;
		ctx.rotate(d * Math.PI / 180);

		drawPaperClip(ctx, 2);

		ctx.rotate(-d * Math.PI / 180); // reverse the rotation
		ctx.translate(-coords.x, -coords.y); // reverse the translation

		coords = getQuadrantCoordinates(2);
		ctx.translate(coords.x, coords.y);

		d = 90;
		ctx.rotate(d * Math.PI / 180);

		drawPaperClip(ctx, 3);

		ctx.rotate(-d * Math.PI / 180); // reverse the rotation
		ctx.translate(-coords.x, -coords.y); // reverse the translation

		coords = getQuadrantCoordinates(3);
		ctx.translate(coords.x, coords.y);

		d = 90;
		ctx.rotate(d * Math.PI / 180);

		drawPaperClip(ctx, 1);

		ctx.rotate(-d * Math.PI / 180); // reverse the rotation
		ctx.translate(-coords.x, -coords.y); // reverse the translation
*/
	}

	const renderTile = function(canvas, oConfig = {}) {	// Default function parameter

		ctx = canvas.getContext("2d")
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#333";
		ctx.scale(.15, .15);
		
		for(let i = 0; i < 4; i++) {
			let x = 0;
			let y = 0;
			
			let coords = getQuadrantCoordinates(i);
			
			ctx.translate(coords.x, coords.y);

			if (oConfig[i] == undefined) {
				oConfig[i] = { r : randomIntFromInterval(0, 360), v : randomIntFromInterval(1,3) };
			}

			ctx.rotate(oConfig[i].r * Math.PI / 180);

			drawPaperClip(ctx, oConfig[i].v);

			ctx.rotate(oConfig[i].r * -1 * Math.PI / 180); // reverse the rotation
			ctx.translate(-coords.x, -coords.y); // reverse the translation
		}

		canvas.dataset.config = JSON.stringify(oConfig); // JSON Object to JSON String conversion
	}

	const getQuadrantCoordinates = function(q) {
		const coords = {};
		switch(q) {
			case 0:
				coords.x = 450;
				coords.y = 450;
				break;
			case 1:
				coords.x = 1200;
				coords.y = 450;
				break;
			case 2:
				coords.x = 450;
				coords.y = 1200;
				break;
			case 3:
				coords.x = 1200;
				coords.y = 1200;
				break;
		}
		return coords;
	}

	const hideSection = function(n, isHide) {
		if (!Number.isInteger(n) || typeof isHide != "boolean") {
			console.error("hideSection(): Invalid input parameters.");
			return;
		}
		
		const o = document.querySelector(`.section--step${n}`); // Template literals
		if (isHide)
			o.classList.add("is-hidden");
		else
			o.classList.remove("is-hidden");
	}

	const generateTileRows = function(nRows = 1, sButtonSet = "", className = "") { 	// Default function parameter
		const nColumns = 3;

		const oHTML = [];

		for(let y = 0; y < nRows; y++) {
			
			oHTML.push(`<div class="tile is-ancestor">`);
	
			for(let x = 0; x < nColumns; x++) {

				oHTML.push(`<div class="tile is-parent">`);
				oHTML.push(`<div class="tile is-child box has-text-centered">`);

				oHTML.push(`<canvas width="250" height="250" class="${className}"></canvas>`);

				switch(sButtonSet) {
					case "doit":
						oHTML.push(`<div class='block'>`);
						oHTML.push(`<button class="button is-dark is-fullwidth">Include</button>`);
						oHTML.push(`</div>`);
						break;
					case "checkit":
						oHTML.push(`<div class='block'>`);
						oHTML.push(`<button class="button is-fullwidth is-success is-hidden">Correct</button>`);
						oHTML.push(`<button class="button is-fullwidth is-danger is-hidden">Incorrect</button>`);
						oHTML.push(`</div>`);
						break;
				}
				
				oHTML.push(`</div>`);
				oHTML.push(`</div>`);
			}
	
			oHTML.push(`</div>`);
		}

		return oHTML.join('');
	}



	const generateResultTiles = function() {

		const oHTML = [];

		oHTML.push(`<p class="subtitle">Original Images described by the Writer:</p>`);

		oHTML.push(generateTileRows(1, "", "correct"));

		oHTML.push(`<p class="subtitle">Images selected by the Doer:</p>`);

		oHTML.push(generateTileRows(1, "checkit", "selected"));

		oHTML.push(`</div>`);


		return oHTML.join('');
	}

	const handleSectionButtonClick = function(e) { // Event object

		hideSection(1, true);
		hideSection(2, true);
		hideSection(3, true);
		hideSection(4, true);
		
		switch(e.currentTarget.dataset.action) { // HTMLElement.dataset
			case "view-intro":
				hideSection(1, false);
				window.scrollTo(0, 0);

				renderExampleTile(document.querySelectorAll(".section--step1 canvas")[0]);

				break;
			case "view-writeit":
				hideSection(2, false);

				document.querySelector(".section--step2 .tile-area").innerHTML = generateTileRows();

				document.querySelectorAll(".section--step2 .tile-area canvas").forEach( (oElement) => { // nested arrow functions
					renderTile(oElement);
					oElement.dataset.correct = true;
				});

				break;
			case "view-doit":

				const oConfigs = Array(27).fill(undefined); // undefined so that Default Function Parameters work
				document.querySelectorAll(".section--step2 .tile-area canvas").forEach( (oElement) => { // arrow function
					let o = JSON.parse(oElement.dataset.config);
					o.correct = true;
					oConfigs.push(o); // JSON String to JSON Object conversion
				});
				shuffleArray(oConfigs);

				hideSection(3, false);
				
				document.querySelector(".section--step3 .tile-area").innerHTML = generateTileRows(10, "doit");

				document.querySelectorAll(".section--step3 .tile-area canvas").forEach( (oElement, i) => { // arrow function
					renderTile(oElement, oConfigs[i]);
				});

				document.querySelectorAll(".section--step3 .tile-area button").forEach( (oElement) => { // nested arrow functions
					oElement.addEventListener("click", (e) => { e.currentTarget.classList.toggle("is-success"); });
				});

				break;
			case "view-checkit":

				const oCorrectConfigs = [];
				const oUserSelectedConfigs = [];

				document.querySelectorAll(".section--step3 .tile-area canvas").forEach( (oElement) => { // arrow function
					let o = JSON.parse(oElement.dataset.config);

					if (o.correct == true)
						oCorrectConfigs.push(o);

					if (oElement.parentElement.querySelector("button.is-success"))
						oUserSelectedConfigs.push(o);
				});
				

				if (oUserSelectedConfigs.length != 3) {
					hideSection(3, false);
					alert("Must select 3 items to continue.");
					return;
				}
				
				hideSection(4, false);
				window.scrollTo(0, 0);

				document.querySelector(".section--step4 .tile-area").innerHTML = generateResultTiles();

				document.querySelectorAll(".section--step4 .tile-area canvas.correct").forEach( (oElement, i) => { // arrow function
					renderTile(oElement, oCorrectConfigs[i]);
				});

				document.querySelectorAll(".section--step4 .tile-area canvas.selected").forEach( (oElement, i) => { // arrow function
					renderTile(oElement, oUserSelectedConfigs[i]);
					let o = JSON.parse(oElement.dataset.config);
					if (o.correct == true)
						oElement.parentElement.querySelector("button.is-success").classList.remove("is-hidden");
					else
						oElement.parentElement.querySelector("button.is-danger").classList.remove("is-hidden");
				});

				break;
		}

	}
	
	
	// Module Pattern - PUBLIC methods/properties //////////////////////////////

	const oInstance = {};

	oInstance.init = function() {
		try { // try...catch exception handling

			document.querySelectorAll(".section .button").forEach( (oElement) => { // arrow function
				oElement.addEventListener("click", handleSectionButtonClick);
			});

		} catch(error) {
			console.error(error);
			alert(`Fatal Error. Unable to initialize.`);
			return;
		}

		document.querySelector(".section--step4 .button").click();

/*
		fetch('catalog.json') // Fetch API using Promise
			.then((response) => response.json())
			.then((data) => {
				oCatalog.items = data.items;
				hideSection(1, false);
			});
*/
	}	

	return oInstance;
}(); // Immediately-Invoked Function Expression (IIFE)

app.init();