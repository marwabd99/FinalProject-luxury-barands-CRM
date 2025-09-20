import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../slices/productsSlice";
import { toast } from "react-toastify";

const ProductForm = ({ open, onClose, product }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setImage(product.image || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setIsBestSeller(product.isBestSeller || false);
    } else {
      setName("");
      setPrice("");
      setStock("");
      setImage("");
      setDescription("");
      setCategory("");
      setIsBestSeller(false);
    }
  }, [product]);

  const handleSubmit = () => {
    if (!name || !price) {
      toast.error("חובה למלא שם ומחיר");
      return;
    }

    const productData = {
      name,
      price: Number(price),
      stock: Number(stock),
      image,
      description,
      category,
      isBestSeller,
    };

    if (product) {
      dispatch(updateProduct({ id: product._id, productData }))
        .unwrap()
        .then(() => {
          toast.success("המוצר עודכן בהצלחה");
          onClose();
        })
        .catch(() => toast.error("שגיאה בעדכון מוצר"));
    } else {
      dispatch(addProduct(productData))
        .unwrap()
        .then(() => {
          toast.success("המוצר נוסף בהצלחה");
          onClose();
        })
        .catch(() => toast.error("שגיאה בהוספת מוצר"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "עדכן מוצר" : "הוסף מוצר"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="שם מוצר"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="מחיר"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="מלאי"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            fullWidth
          />
          <TextField
            label="תיאור"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <TextField
            label="קטגוריה"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          />
          <TextField
            label="כתובת תמונה"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
              />
            }
            label="מוצר מומלץ"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>בטל</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {product ? "עדכן" : "הוסף"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
