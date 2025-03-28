import { useState } from "react";
import { NavLink, Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";

/**
 * Navbar items format
 * NavItem[] = [{
 *  label: string,
 *  description?: string,
 *  icon: React.ReactNode,
 *  activeIcon?: React.ReactNode,
 *  action: () => void,
 *  disabled?: boolean,
 * }]
 */

export default function Navbar({
  items,
  activeIndex = 0,
  preItems = [],
  postItems = [],
}) {
  const [navPreIndex, setNavPreIndex] = useState(null);
  const [navIndex, setNavIndex] = useState(activeIndex);
  const [navPostIndex, setNavPostIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      {preItems.map((item, index) => (
        <NavLink
          key={index}
          label={item.label}
          description={item.description}
          leftSection={
            navPreIndex === index ? item.activeIcon || item.icon : item.icon
          }
          active={navPreIndex === index}
          onClick={() => {
            setNavPreIndex(index);
            setNavPostIndex(null);
            setNavIndex(null);
            item.action();
          }}
          disabled={item.disabled}
        />
      ))}
      <Divider />
      {items.map((item, index) => (
        <NavLink
          key={index}
          label={item.label}
          description={item.description}
          leftSection={
            navIndex === index ? item.activeIcon || item.icon : item.icon
          }
          rightSection={
            navIndex === index ? (
              <IconChevronRight size=".8rem" className="mantine-rotate-rtl" />
            ) : null
          }
          active={navIndex === index}
          onClick={() => {
            setNavIndex(index);
            setNavPostIndex(null);
            setNavPreIndex(null);
            item.action();
          }}
          disabled={item.disabled}
        />
      ))}
      {postItems.length > 0 && <Divider />}
      {postItems.map((item, index) => (
        <NavLink
          key={index}
          label={item.label}
          description={item.description}
          leftSection={
            navPostIndex === index ? item.activeIcon || item.icon : item.icon
          }
          active={navPostIndex === index}
          onClick={() => {
            setNavPostIndex(index);
            setNavPreIndex(null);
            setNavIndex(null);
            item.action();
          }}
          disabled={item.disabled}
        />
      ))}
    </>
  );
}
