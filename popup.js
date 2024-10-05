document.getElementById('inject').addEventListener('click', function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		func: visualizeElements
	  });
	});
  });
  
  document.getElementById('deactivate').addEventListener('click', function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		func: removeVisualization
	  });
	});
  });
  
  function visualizeElements() {
	console.log("Starting to visualize elements...");
  
	// Function to gather target elements
	function getTargetElements(root = document) {
	  let targetElements = [];
  
	  // Select all web components and elements with specific attributes
	  const elements = root.querySelectorAll(`
		*[data-cs-capture],
		*[data-cs-mask],
		*[data-clarity-unmask],
		*[data-clarity-mask],
		*[is]
	  `);
  
	  // Filter visible elements and add them to the array
    // Filter visible elements and add them to the array
    elements.forEach(el => {
		// Handle the body element specifically to ensure it is included
		if (el.tagName.toLowerCase() === 'body') {
		  targetElements.push(el);  // Always include the body if it has the attributes
		} else if (el.offsetParent !== null) { // Ensure other elements are visible
		  targetElements.push(el);
		}
  
		// If the element has a shadow root, recursively search inside it
		if (el.shadowRoot) {
		  targetElements = targetElements.concat(getTargetElements(el.shadowRoot));
		}
	  });
  
	  console.log("Found target elements:", targetElements);
	  return targetElements;
	}
  
	// Function to create the visualization layer
	function createVisualizationLayer() {
	  console.log("Creating visualization layer");
	  const layer = document.createElement('div');
	  layer.id = 'visualization-layer';
	  layer.style.position = 'absolute';  // Cover the entire page
	  layer.style.top = 0;
	  layer.style.left = 0;
	  layer.style.width = '100%';  // Full width of the document
	  layer.style.height = `${document.documentElement.scrollHeight}px`;  // Full height of the document
	  layer.style.zIndex = '999999';
	  layer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';  // Black with 50% transparency
	  layer.style.pointerEvents = 'none';
	  document.body.appendChild(layer);
	  return layer;
	}
  
	// Function to draw boxes around elements
	function drawBox(layer, element, index) {
	  console.log('Drawing box for element', element);
	  const rect = element.getBoundingClientRect();
	  const box = document.createElement('div');
	  box.classList = 'visualization-box'
  
	  box.style.position = 'absolute';
	  box.style.top = `${rect.top + window.scrollY}px`;
	  box.style.left = `${rect.left + window.scrollX}px`;
	  box.style.width = `${rect.width}px`;
	  box.style.height = `${rect.height}px`;
  
	  box.style.border = '2px solid red';
	  box.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
	  box.style.color = 'white';
	  box.style.fontSize = '12px';
	  box.style.display = 'flex';
	  box.style.alignItems = 'center';
	  box.style.justifyContent = 'center';
	  box.style.pointerEvents = 'none';  // Make sure it doesn't interfere with the page
	  box.style.zIndex = '1000000';  // Ensure the box appears above the layer
  
	  // Create a label for the box
	  const label = document.createElement('span');
	  const attributes = ['data-cs-capture', 'data-cs-mask', 'data-clarity-unmask', 'data-clarity-mask'];
  
	  // If it's a web component, use the tag name as the label
	//   if (element.tagName.includes('-')) {
		// label.innerText = element.tagName.toLowerCase();
	//   } else {
		// Otherwise, check for the specified attributes and list them
		label.innerText = attributes
		  .filter(attr => element.hasAttribute(attr))
		  .map(attr => attr)
		  .join(', ');
	//   }
  
	  label.style.padding = '2px 5px';
	  label.style.backgroundColor = 'red';
	  label.style.color = 'white';
	  label.style.fontSize = '10px';
	  label.style.borderRadius = '3px';
  
	  box.appendChild(label);
	  document.body.appendChild(box);  // Append box to body directly
	}
  
	// Main process
	const targetElements = getTargetElements();
	const layer = createVisualizationLayer();
  
	targetElements.forEach((el, index) => {
	  drawBox(layer, el, index);
	});
  
	console.log("Visualization complete.");
  }
  
  function removeVisualization() {
	console.log("Removing visualization layer.");
	const layer = document.getElementById('visualization-layer');
	if (layer) {
	  layer.remove();
	}
  
	// Also remove any boxes drawn
	document.querySelectorAll('.visualization-box').forEach(box => box.remove());
  }
  




  /// web-c
  
  /// WebComponents
  // Inject JavaScript to identify web components and add their tag names to the DOM
document.getElementById('show-components').addEventListener('click', function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		function: showWebComponents
	  });
  
	  chrome.scripting.insertCSS({
		target: { tabId: tabs[0].id },
		files: ['style.css']
	  });
	});
  });
  
  // Remove the CSS and stop showing the web component names
  document.getElementById('hide-components').addEventListener('click', function() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	  chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		function: hideWebComponents
	  });
  
	  chrome.scripting.removeCSS({
		target: { tabId: tabs[0].id },
		files: ['style.css']
	  });
	});
  });
  
  // This function identifies web components and adds their tag names to the DOM
  function showWebComponents() {
	document.querySelectorAll('*').forEach(el => {
	  if (el.tagName.includes('-')) { // Identifies custom elements (web components)
		const componentName = el.tagName.toLowerCase(); // Get the component's tag name
		el.setAttribute('data-component-name', componentName); // Add the tag name as a data attribute
	  }
	});
  }
  
  // This function removes the 'data-component-name' attribute
  function hideWebComponents() {
	document.querySelectorAll('[data-component-name]').forEach(el => {
	  el.removeAttribute('data-component-name');
	});
  }
  