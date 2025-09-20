import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({ open, toggleSidebar }) {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Products", icon: <InventoryIcon />, path: "/products" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
  ];

  return (
    <Drawer
      variant="temporary" // overlay מעל התוכן
      open={open} // מצב פתוח/סגור
      onClose={toggleSidebar} // סוגר בלחיצה מחוץ
      ModalProps={{
        keepMounted: true, // לשיפור ביצועים במובייל
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              toggleSidebar(); // סוגר אחרי בחירה
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
