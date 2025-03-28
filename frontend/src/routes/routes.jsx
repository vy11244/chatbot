import DashboardPageLayout from "../pages/Dashboard/PageLayout";
import RedirectPage from "../pages/Utils/Redirect";
import HomePage from "../pages/Dashboard/Home";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import DevelopPage from "../pages/Develop/Develop";
import NotFoundPage from "../pages/Utils/NotFound";
import SettingPage from "../pages/Dashboard/Setting";
import ChatBotConfig from "../pages/ChatbotConfig/ChatBotConfig";
import DevelopLayout from "../pages/Develop/DevelopLayout";
import WidgetPage from '../pages/WidgetPage';
import SubscriptionPage from "../pages/Subscription/Subscription";
// import WidgetConfigPage from "../pages/WidgetConfig/index";
const appRoutes  = [
    {path: "/",
    element: <LandingPage/>,
    },
    {path: "/login",
    element: <LoginPage/>,
    },
    {
      path: "/404",
      element: <NotFoundPage />,
    },
    {
      path: '/widget-page/:projectId',
      element: <WidgetPage />
    },
    {
        path: "/dashboard",
        element: <DashboardPageLayout />,
        children: [
          {
            path: "/dashboard",
            element: <HomePage />,
          },

          {
            path : "/dashboard/subscription",
            element: <SubscriptionPage />,
          },

          {
            path: "/dashboard/setting",
            element: <SettingPage />,
          },

          {
            path: "/dashboard/*",
            element: <RedirectPage destination="/dashboard" />,
          },
        ],
        
    },
    {path: "/:projectId",
      element: <DevelopLayout />,
      children: [
        {
          path: "",
          element: <DevelopPage />,
        },
        {
          path: "chatbot-config",
          element: <ChatBotConfig />,
        },
      
      ]
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },

]

export default appRoutes;