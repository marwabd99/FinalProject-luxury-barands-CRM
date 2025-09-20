import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, togglePaid, toggleShipped } from "../slices/ordersSlice";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  Modal,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-toastify";

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Typography color="error">שגיאה: {error}</Typography>;

  const handleAction = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedOrder) return;

    if (actionType === "paid") {
      dispatch(
        togglePaid({
          orderId: selectedOrder._id,
          isPaid: !selectedOrder.isPaid,
        })
      )
        .unwrap()
        .then(() => toast.success("סטטוס תשלום עודכן"))
        .catch(() => toast.error("שגיאה בעדכון סטטוס תשלום"));
    } else if (actionType === "shipped") {
      dispatch(
        toggleShipped({
          orderId: selectedOrder._id,
          isShipped: !selectedOrder.isShipped,
        })
      )
        .unwrap()
        .then(() => toast.success("סטטוס משלוח עודכן"))
        .catch(() => toast.error("שגיאה בעדכון סטטוס משלוח"));
    }

    setConfirmOpen(false);
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const columns = [
    // { field: "_id", headerName: "ID", width: 220 },
    // {
    //   field: "buyerEmail",
    //   headerName: "משתמש",
    //   width: 150,
    //   valueGetter: (params) => params?.row?.buyer?.email || "לא קיים",
    // },
    // {
    //   field: "createdAt",
    //   headerName: "תאריך",
    //   width: 150,
    //   valueGetter: (params) =>
    //     params?.row?.createdAt
    //       ? new Date(params.row.createdAt).toLocaleDateString()
    //       : "",
    // },
    { field: "totalPrice", headerName: "סכום", width: 100 },
    {
      field: "isPaid",
      headerName: "שולם?",
      width: 100,
      renderCell: (params) => (params?.value ? "כן" : "לא"),
    },
    {
      field: "isShipped",
      headerName: "נשלח?",
      width: 100,
      renderCell: (params) => (params?.value ? "כן" : "לא"),
    },
    {
      field: "actions",
      headerName: "פעולות",
      width: 350,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={() => openDetails(params.row)}>
            פרטים
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAction(params.row, "paid")}
          >
            {params.row?.isPaid ? "בטל תשלום" : "סמן כשולם"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleAction(params.row, "shipped")}
          >
            {params.row?.isShipped ? "בטל משלוח" : "סמן כנשלח"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        ניהול הזמנות
      </Typography>

      <div style={{ height: 500, width: "80%" }}>
        <DataGrid
          rows={orders || []} // תמיד מערך
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={actionType === "paid" ? "עדכון תשלום" : "עדכון משלוח"}
        message={`האם את בטוחה שברצונך לשנות סטטוס ההזמנה של ${
          selectedOrder?.buyer?.email || "משתמש"
        }?`}
      />

      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 3,
            width: 600,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            פרטי הזמנה
          </Typography>
          {selectedOrder && (
            <List>
              <ListItem>ID: {selectedOrder._id}</ListItem>
              {/* <ListItem>
                משתמש: {selectedOrder.buyer?.email || "לא קיים"}
              </ListItem>
              <ListItem>
                תאריך:{" "}
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleDateString()
                  : ""}
              </ListItem> */}
              <ListItem>סכום: {selectedOrder.totalPrice}</ListItem>
              <ListItem>שולם: {selectedOrder.isPaid ? "כן" : "לא"}</ListItem>
              <ListItem>נשלח: {selectedOrder.isShipped ? "כן" : "לא"}</ListItem>
              <ListItem>
                מוצרים:{" "}
                {selectedOrder.products
                  ?.map((p) => p.product?.name || "לא קיים")
                  .join(", ")}
              </ListItem>
            </List>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}
//תאריך ו שם משתמש כרגע לא רוצה להציג לכן שמתי בהערה 