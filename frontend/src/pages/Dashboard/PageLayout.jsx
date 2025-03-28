import { Outlet, useNavigate } from "react-router-dom";
import AppLayout from "../../components/Layout/AppLayout";
import {
  IconHome,
  IconHomeFilled,
  IconPerspective,
  IconSettings,
  IconSettingsFilled,
  IconCalendarDollar,
} from "@tabler/icons-react";
import Logo from "../../components/Logo";
import { getCurrentUserApi } from "../../apis/auth";
import useNotification from "../../hooks/useNotification";
import { useEffect } from "react";
import useGlobalState from "../../context/global";
import appStrings from "../../utils/strings";



export default function DashboardPageLayout() {
  const navigate = useNavigate();
  const user = useGlobalState((state) => state.user);
  const setUser = useGlobalState((state) => state.setUser);
  const errorNotify = useNotification({ type: "error" });

  useEffect(() => {
    getCurrentUserApi({
      user: user,
      onFail: (msg) => {
        errorNotify(msg);
        navigate("/login");
      },
      onSuccess: (user) => {
        setUser(user);
      },
    });
  }, [setUser]);

  const navbarItems = [
    {
      label: "Home",
      icon: <IconHome size="1rem" />,
      activeIcon: <IconHomeFilled size="1rem" />,
      action: () => navigate("/dashboard"),
    },
    {
      label: "Subscriptions",
      icon: <IconCalendarDollar size="1rem" />,
      action: () => navigate("/dashboard/subscription"),
    },
  ];
  
  const navbarSettings = [
    {
      label: "Settings",
      icon: <IconSettings size="1rem" />,
      activeIcon: <IconSettingsFilled size="1rem" />,
      action: () => navigate("/dashboard/setting"),
    },
  ];
  
  return (
    <AppLayout navItems={navbarItems} navPostItems={navbarSettings}>
      <Outlet />
    </AppLayout>
  );
}
