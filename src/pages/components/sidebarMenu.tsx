import { useEffect, useState } from "react";
import { Menu, message } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/router";

type MenuItem = {
  key: string;
  label: string;
  baotri?: string; 
  disabled?: boolean;
  type?: "group" | "divider";
  children?: MenuItem[];
};

const SidebarMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
const route = useRouter();
  useEffect(() => {
    fetch("/api/adminMenu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data.menu))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const findMenuItem = (items: MenuItem[], key: string): MenuItem | undefined => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  // const handleMenuClick: MenuProps["onClick"] = (e) => {
  //   const clickedItem = findMenuItem(menuItems, e.key);
  //   if (clickedItem) {
  //     if (clickedItem.baotri === "1") {
  //       message.warning(`🔧 ${clickedItem.label} đang bảo trì!`);
  //     } else {
  //       message.success(`✅ Bạn đã chọn: ${clickedItem.label}`);
  //     }
  //   }
  // }; 
  const handleMenuClick2: MenuProps["onClick"] = (e) => {
    const clickedItem = findMenuItem(menuItems, e.key);
    if (clickedItem) {
      if (clickedItem.disabled === true) {
        message.warning(`🔧 ${clickedItem.label} đang bảo trì!`);
      } else {
        message.success(`✅ Bạn đã chọn: ${clickedItem.label}`);
      }
    }
  };

  return (
    <Menu
      onClick={handleMenuClick2}
      style={{ width: 256 }}
      theme="dark"
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={menuItems as MenuProps["items"]}
    />
  );
};

export default SidebarMenu;
