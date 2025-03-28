
  export const googleClientId =
    "164749267745-pnokebu3ha37nbi853n7td3bnv8hsp8r.apps.googleusercontent.com";

  // export const baseUrl = "https://your-server-url.com";
  // export const baseUrl = "http://localhost:7860/";
  export const baseUrl = "https://hoangnt1209-upsalev1.hf.space/"

  export const apiUrls = {
    // Auth
    login: "apis/auth/login",
    getMe: "apis/auth/me",
    logout: "apis/auth/logout",
    
    //Widget
    CreateWidget: (projectId) => `apis/widgets/create/${projectId}`,
    ValidateWidget: (projectId) => `apis/widgets/validate_widget/${projectId}`,
    GetWidget: (projectId) => `apis/widgets/widget/${projectId}`,
    GetWidgetSessionId: (projectId) => `apis/widgets/session/${projectId}`,
    UpdateWidgetConfig: (projectId) => `apis/widgets/update/${projectId}`,
    GetChatHistoryWidget: (projectId) => `apis/widgets/chat_history/${projectId}`,
    ChatWithWidget : (projectId) => `apis/widgets/chat/${projectId}`,

    // Chatbot
    UploadDocument: "apis/chatbot/upload_document",
    UploadDocuments: "apis/chatbot/upload_documents",
    DeleteDocument: (documentId) => `/apis/chatbot/delete_document/${documentId}`,
    GetDocument:(document_id) => `apis/chatbot/get_document/${document_id}`,
    GetAllDocuments: "apis/chatbot/get_all_documents",
    GetAnswers: "apis/chatbot/get_answers",
    OptimizePrompt: "apis/chatbot/optimize_system_prompt",
    GetChatHistory: (projectId) => `apis/chatbot/chat_history/${projectId}`,
    PublishChatbot: 'apis/chatbot/publish',
    
    
    
    // Project
    createProject: "apis/project/create_project",
    GetProject: (projectId) => `apis/project/get_project/${projectId}`,
    GetAllProjects: "apis/project/get_all_projects",
    UpdateProject: (projectId) => `apis/project/update_project/${projectId}`,
    DeleteProject: (projectId) => `apis/project/delete/${projectId}`,

    //Payment method
    Subcribe: "apis/payment/subscribe",
    CallBack: "apis/payment/callback",
    
  }
