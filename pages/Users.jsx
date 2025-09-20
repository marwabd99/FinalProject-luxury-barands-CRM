import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleAdmin, deleteUser } from "../slices/usersSlice";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
} from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-toastify";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  // מצב עבור הפיכת אדמין
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // מצב עבור מחיקת משתמש
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // הפיכת אדמין
  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmToggle = () => {
    if (selectedUser) {
      dispatch(
        toggleAdmin({
          userId: selectedUser._id,
          isAdmin: !selectedUser.isAdmin,
        })
      );
      toast.success(
        `${selectedUser.email} הפך/ה ${
          selectedUser.isAdmin ? "למשתמש רגיל" : "לאדמין"
        }!`
      );
    }
    setConfirmOpen(false);
  };

  // מחיקת משתמש
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
      toast.success(`המשתמש ${userToDelete.email} נמחק בהצלחה!`);
    }
    setDeleteConfirmOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        רשימת משתמשים
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* <TableCell>שם</TableCell> */}
              <TableCell>אימייל</TableCell>
              <TableCell>מנהל?</TableCell>
              <TableCell align="center">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                {/* <TableCell>{user.name || "-"}</TableCell> */}
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "כן" : "לא"}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="contained"
                      color={user.isAdmin ? "secondary" : "primary"}
                      onClick={() => handleToggleClick(user)}
                    >
                      {user.isAdmin ? "הסר אדמין" : "הפוך לאדמין"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      מחק
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* דיאלוג אישור הפיכת אדמין */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmToggle}
        title="אישור פעולה"
        message={`האם את בטוחה שברצונך ${
          selectedUser?.isAdmin ? "להסיר אדמין" : "להפוך לאדמין"
        } למשתמש ${selectedUser?.email}?`}
      />

      {/* דיאלוג אישור מחיקה */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="מחיקת משתמש"
        message={`האם את בטוחה שברצונך למחוק את המשתמש ${userToDelete?.email}? פעולה זו אינה ניתנת לביטול.`}
      />
    </Box>
  );
}
