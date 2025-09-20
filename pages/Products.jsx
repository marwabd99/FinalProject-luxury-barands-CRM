import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../slices/productsSlice";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product) => {
    if (
      window.confirm(`האם את בטוחה שברצונך למחוק את המוצר ${product.name}?`)
    ) {
      dispatch(deleteProduct(product._id))
        .unwrap()
        .then(() => toast.success("מוצר נמחק בהצלחה"))
        .catch(() => toast.error("שגיאה במחיקת המוצר"));
    }
  };

  if (loading) return <Typography>טוען...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "name", headerName: "שם מוצר", width: 200 },
    { field: "price", headerName: "מחיר", width: 100 },
    { field: "stock", headerName: "מלאי", width: 100 },
    { field: "description", headerName: "תיאור", width: 250 },
    {
      field: "actions",
      headerName: "פעולות",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={() => handleEdit(params.row)}>
            עדכן
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            מחק
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        ניהול מוצרים
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
        הוסף מוצר
      </Button>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={products}
          getRowId={(row) => row._id}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={selectedProduct}
      />
    </Box>
  );
}
