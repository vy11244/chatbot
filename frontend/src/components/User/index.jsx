import { Avatar, Menu, Text, Title, Skeleton, Group, Badge } from "@mantine/core";
import { IconLogout, IconSettings, IconCalendar, IconCrown } from "@tabler/icons-react";
import useGlobalState from "../../context/global";
import appStrings from "../../utils/strings";
import { useNavigate } from "react-router-dom";
import { googleLogout  } from "@react-oauth/google";

export default function User({ onUserTap, onSettingTap, onLogoutTap }) {
  const user = useGlobalState((state) => state.user);
  const navigate = useNavigate();

  const getMessageColor = (count) => {
    if (count <= 1000) return 'red';
    if (count <= 50000) return 'orange';
    return 'green';
  };

  const handleLogout = () => {
    googleLogout(); // Gọi trực tiếp googleLogout
    console.log("User logged out from Google");

    // Điều hướng đến trang login
    navigate("/login");

    // Gọi callback nếu cần
    if (onLogoutTap) onLogoutTap();
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'PREMIUM': return 'violet';
      case 'ADVANCED': return 'blue';
      case 'BASIC': return 'teal';
      default: return 'gray';
    }
  };

  const getDaysRemaining = () => {
    if (!user?.plan_expiration) return 0;
    const expiration = new Date(user.plan_expiration);
    const today = new Date();
    const diff = expiration.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const getExpirationColor = (days) => {
    if (days <= 0) return 'red';
    if (days <= 7) return 'orange';
    return 'green';
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Menu shadow="md" width={300}>
      <Menu.Target>
        {user ? <Avatar src={user.avatar} /> : <Skeleton circle height={40} />}
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={onUserTap}>
          <Title size="sm">{user?.name}</Title>
          <Text size="xs">{user?.email}</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Group position="apart">
            <Group>
              <IconCrown size="1.2rem" />
              <Text size="sm">Current Plan</Text>
            </Group>
            <Badge
              variant="filled"
              color={getPlanColor(user?.subscription)}
            >
              {user?.subscription || 'NO SUBSCRIPTION'}
            </Badge>
          </Group>
        </Menu.Item>
        {user?.plan_expiration && (
          <Menu.Item>
            <Group position="apart">
              <Group>
                <IconCalendar size="1.2rem" />
                <Text size="sm">Plan Expires</Text>
              </Group>
              <Group spacing={5}>
                <Text size="xs">
                  {new Date(user.plan_expiration).toLocaleDateString()}
                </Text>
                <Badge
                  size="sm"
                  variant="light"
                  color={getExpirationColor(daysRemaining)}
                >
                  {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                </Badge>
              </Group>
            </Group>
          </Menu.Item>
        )}
         {user?.remaining_messages !== undefined && (
        <Menu.Item>
          <Group position="apart">
            <Group>
              <IconMessage size="1.2rem" />
              <Text size="sm">Messages Left</Text>
            </Group>
            <Badge
              size="sm"
              variant="light"
              color={getMessageColor(user.remaining_messages)}
            >
              {user.remaining_messages.toLocaleString()}
            </Badge>
          </Group>
        </Menu.Item>
      )}
        <Menu.Item
          leftSection={<IconSettings size="1rem" />}
          onClick={onSettingTap}
        >
          {appStrings.language.setting.title}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size="1rem" />}
          color="red"
          onClick={handleLogout} // Call handleLogout to trigger signOut and additional logic
        >
          {appStrings.language.auth.logout}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
