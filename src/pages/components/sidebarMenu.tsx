import { useEffect, useState, ReactNode } from "react";
import { Menu, message, Badge } from "antd";
import type { MenuProps } from "antd";

import {
  UserOutlined,
  VideoCameraOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  BellOutlined,
  SettingOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

type MenuItem = {
  key: string;
  label: string;
  icon?: string;
  baotri?: string;
  disabled?: boolean;
  type?: "group" | "divider";
  badge?: number;
  children?: MenuItem[];
};

const iconMap: Record<string, ReactNode> = {
  CustomerServiceOutlined: <CustomerServiceOutlined />,
  UserOutlined: <UserOutlined />,
  VideoCameraOutlined: <VideoCameraOutlined />,
  HomeOutlined: <HomeOutlined />,
  BellOutlined: <BellOutlined />,
  SettingOutlined: <SettingOutlined />,
  LineChartOutlined: <LineChartOutlined />,
};

const SidebarMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/adminMenu",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 123`,
        },
      }
    )
      
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const formattedMenu = convertMenuItems(data.menu);
        setMenuItems(formattedMenu);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const clickedItem = findMenuItem(menuItems, e.key);
    if (clickedItem) {
      if (clickedItem.baotri === 0) {
        message.success(`🔧 ${clickedItem.label} đang bảo trì!`);
      }
      
    }
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const findMenuItem = (items: MenuProps["items"], key: string): any => {
    for (const item of items || []) {
      if ((item as any)?.key === key) return item;
      if ((item as any)?.children) {
        const found = findMenuItem((item as any)?.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };

  const convertMenuItems = (items: MenuItem[]): MenuProps["items"] =>
    items.map((item) => {
      const menuItem: any = {
        key: item.key,
        label: (
          <span>
            <Badge
              count={item.badge}
              offset={[10, 0]}
              style={{ width: "20px", margin: "5px 0 0 20px", fontSize: "10px" }}
            >
              <span style={{ marginLeft: 5, marginRight: 10, color: "white" }}>
                {item.label}
              </span>
            </Badge>
          </span>
        ),
        icon: item.icon ? iconMap[item.icon] : undefined,
        disabled: item.disabled,
        type: item.type,
      };

      if (item.children) {
        menuItem.children = convertMenuItems(item.children);
      }

      return menuItem;
    });

  return (
    <Menu
      onClick={handleMenuClick}
      theme="dark"
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      mode="inline"
      items={menuItems}
    />
  );
};

export default SidebarMenu;
