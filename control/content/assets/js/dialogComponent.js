class DialogComponent {
	constructor(id) {
		this.container = document.getElementById(id);
		if (!this.container) throw "Sub Page ID not found";
		if (!this.container.classList.contains("subPage")) throw "Sub Page doesnt have class [subPage]";

		let closeButton = this.container.querySelector(".close-modal");
		if (closeButton)
			closeButton.onclick = () => this.close();
	}

	show() {
		this.container.classList.add("activeFull");
	}

	showInvalidFeedMessage(type, message) {
		let elementId = null;
		elementId = type === "rss" ? "#rssErrorMessage" : "#googleErrorMessage";
		let node = this.container.querySelector(elementId);
		node.innerHTML = message;
		node.style.display = "block";
	}

	showDialog(options, saveCallback, deleteCallback) {
		document.body.scroll(0, 0);
		let btnSave = this.container.querySelector(".spSaveButton");
		let spFooter = this.container.querySelector(".spFooter");

		if (options.hideFooter)
			spFooter.style.display = 'none';

		btnSave.onclick = () => {
			let values = getElementsValues();
			saveCallback(values);
		};

		const getElementsValues = () => {
			let nodes = this.container.querySelectorAll("input");
			let values = {};
			nodes.forEach(element => {
				if (element.type === "checkbox") {
					values[element.id] = element.checked;
				} else {
					values[element.id] = element.value
				}
			});
			return values;
		};

		const getRequiredValues = () => {
			let nodes = this.container.querySelectorAll("input");
			let values = {};
			nodes.forEach(element => {
				if (element.required) {
					values[element.id] = element.value
				}
			});
			return values;
		}

		// Toggle advanced settings based on checkbox state
		// use this to show/hide advanced settings
		const toggleAdvanced = (id, state) => {
			let nodes = document.querySelectorAll(`[advanced-modal-show='${id}']`);
			nodes.forEach(node => {
				if (state) {
					node.classList.remove("hidden");
				} else {
					node.classList.add("hidden");
				}
			});
		}

		const setElementsValues = () => {
			Object.keys(options.values).map(key => {
				let node = this.container.querySelector(`#${key}`);
				if (node) {
					if (node.type === "checkbox") {
						node.checked = options.values[key];
						toggleAdvanced(node.id, node.checked);
					} else {
						node.value = options.values[key] ? options.values[key] : '';
					}
				}
			});
			let values = getRequiredValues();
			let hasAllValues = Object.values(values).every((v) => v);
			btnSave.disabled = hasAllValues ? false : true;
		};

		this.container.addEventListener("input", (e) => {
			let values = getRequiredValues();
			let hasAllValues = Object.values(values).every((v) => v);
			let btnSave = this.container.querySelector(".spSaveButton");

			btnSave.disabled = hasAllValues ? false : true;
		});

		this.container.addEventListener("change", (e) => {
			toggleAdvanced(e.target.id, e.target.checked);
		});

		if (options.values)
			setElementsValues();

		let btnDeleteButton = this.container.querySelector(".spDeleteButton");
		btnDeleteButton.style.display = ''; //reset
		btnDeleteButton.onclick = () => {
			deleteCallback();
		};
		if (options) {
			if (options.title) {
				let h = this.container.querySelector(".spHeaderText");
				h.innerHTML = options.title;
			}
			if (options.saveText)
				btnSave.innerHTML = options.saveText;


			if (options.hideDelete)
				btnDeleteButton.style.display = 'none';

		}
		this.container.classList.add("activeDialog");
	}

	close() {
		this.container.removeEventListener("input", () => {});
		let btnSave = this.container.querySelector(".spSaveButton");
		btnSave.disabled = true;
		let nodes = this.container.querySelectorAll("input");
		nodes.forEach(node => {
			node.value = null;
		});

		let rssErrorMessage = this.container.querySelector("#rssErrorMessage")
		if(rssErrorMessage) {
			rssErrorMessage.innerHTML = "";
			rssErrorMessage.style.display = "none";
		}

		let googleErrorMessage = this.container.querySelector("#googleErrorMessage")
		if(googleErrorMessage) {
			googleErrorMessage.innerHTML = "";
			googleErrorMessage.style.display = "none";
		}

		this.container.classList.remove("activeFull");
		this.container.classList.remove("activeDialog");
	}
}