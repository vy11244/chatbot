// embedScript.js
(function(w, d) {
  // Get widget configuration 
  const config = w.chatbotWidget?.[0] || {};
  const { widgetId, apiKey } = config;

  if (!widgetId || !apiKey) {
    console.error('Widget ID and API key are required');
    return;
  }

  // Create container div if not exists
  const containerId = 'chatbot-widget-container';
  let container = d.getElementById(containerId);
  if (!container) {
    container = d.createElement('div');
    container.id = containerId;
    d.body.appendChild(container);
  }

  // Initialize widget
  const widget = new ChatbotWidget({
    widgetId,
    apiKey,
    container: containerId,
    baseUrl: w.location.origin,
    config: {
      position: 'bottom-right',
      width: '350px',
      height: '500px'
    }
  });

  // Store widget instance
  w.chatbotWidget.instance = widget;
  
  // Initialize when DOM is ready
  if (d.readyState === 'complete') {
    widget.init();
  } else {
    d.addEventListener('DOMContentLoaded', () => widget.init());
  }
})(window, document);