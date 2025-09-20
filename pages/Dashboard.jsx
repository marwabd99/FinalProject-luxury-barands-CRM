import { Box, Paper, Typography, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOrders } from "../slices/ordersSlice";
import { fetchUsers } from "../slices/usersSlice";
import { fetchProducts } from "../slices/productsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  const loading = usersLoading || productsLoading || ordersLoading;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const cards = [
    {
      label: 'סה"כ משתמשים',
      value: totalUsers,
      path: "/users",
    },
    {
      label: 'סה"כ הזמנות',
      value: totalOrders,
      path: "/orders",
    },
    {
      label: 'סה"כ מוצרים',
      value: totalProducts,
      path: "/products",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
        {cards.map((card) => (
          <Paper
            key={card.label}
            sx={{
              flex: "1 1 200px",
              p: 2,
              cursor: card.path ? "pointer" : "default",
              "&:hover": card.path
                ? { boxShadow: 6, transform: "scale(1.03)", transition: "0.3s" }
                : {},
            }}
            onClick={() => card.path && navigate(card.path)}
          >
            <Typography>{card.label}</Typography>
            <Typography variant="h5">{card.value}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
