// public/widget.js
class ChatbotWidget {
  constructor(config) {
    this.config = config;
    this.backendUrl = 'https://hoangnt1209-upsalev1.hf.space/';
    this.sessionId = null;
    this.isOpen = false;
  }

  async init() {
    
    if (!this.isValidDomain(window.location.hostname)) {
      console.error('Invalid Domain: Please enter a valid domain name');
      return;
    }
    // Get or create session
    await this.initSession();
    
    // Create container div
    const container = document.createElement('div');
    container.id = 'chatbot-widget-container';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
    `;
    document.body.appendChild(container);

    // Create toggle button
    const button = document.createElement('button');
    button.innerHTML = 'Chat with us';
    button.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #228be6;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;
    button.onclick = () => this.toggleWidget();
    container.appendChild(button);

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'chatbot-iframe-container';
    iframeContainer.style.cssText = `
      display: none;
      width: 350px;
      height: 500px;
      position: fixed;
      bottom: 100px;
      right: 20px;
      z-index: 1000;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      border-radius: 10px;
      overflow: hidden;
      transition: all 0.3s ease;
    `;

    const iframe = document.createElement('iframe');
    // Update iframe source to use backend URL with params
    iframe.src = this.buildChatUrl();
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;

    iframeContainer.appendChild(iframe);
    container.appendChild(iframeContainer);
  }

  isValidDomain(domain) {
    // Add your domain validation logic here
    const validDomains = ['127.0.0.1', 'localhost']; // Add '127.0.0.1' to valid domains
    return validDomains.includes(domain);
  }

  async initSession() {
    try {
      const response = await fetch(
        `${this.backendUrl}/apis/widgets/session/${this.config.widgetId}`,
        {
          headers: {
            'api-key': this.config.apiKey
          }
        }
      );
      const data = await response.json();
      this.sessionId = data.session_id;
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  }

  buildChatUrl() {
    const url = new URL(`${this.backendUrl}/apis/widgets/widget/${this.config.widgetId}`);
    url.searchParams.append('api_key', this.config.apiKey);
    if (this.sessionId) {
      url.searchParams.append('session_id', this.sessionId);
    }
    return url.toString();
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    const container = document.getElementById('chatbot-iframe-container');
    if (container) {
      container.style.display = this.isOpen ? 'block' : 'none';
    }
  }
}

window.ChatbotWidget = ChatbotWidget;