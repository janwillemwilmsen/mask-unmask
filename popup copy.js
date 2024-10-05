document.getElementById('inject').addEventListener('click', function() {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
	  chrome.scripting.insertCSS({
		target: { tabId: tabs[0].id },
		files: ['style.css']
	  });
	});
  });
  

  document.getElementById('deactivate').addEventListener('click', function() {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
	  chrome.scripting.removeCSS({
		target: { tabId: tabs[0].id },
		files: ['style.css']
	  });
	});
  });


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
  