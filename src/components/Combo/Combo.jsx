import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCombos,
  createCombo,
  updateCombo,
  deleteCombo,
  updateToggleStarredCombo,
} from "@/features/comboSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import ComboDialog from "./ComboDialog";
import ComboTable from "./ComboTable";

const Combos = () => {
  const dispatch = useDispatch();
  const { combos, loading, taskLoading } = useSelector((state) => state.combo);

  const [newCombo, setNewCombo] = useState({
    title: "",
    description: "",
    isPrepaidOnly: true,
    isActive: true,
    productId: ["", ""],
    comboPrice: [0, 0],
  });

  // Add image state for create combo
  const [newComboImage, setNewComboImage] = useState(null);
  const [newComboImagePreview, setNewComboImagePreview] = useState(null);

  const [editCombo, setEditCombo] = useState(null);
  // Add image state for edit combo
  const [editComboImage, setEditComboImage] = useState(null);
  const [editComboImagePreview, setEditComboImagePreview] = useState(null);

  const [selectedCombo, setSelectedCombo] = useState(null);

  useEffect(() => {
    dispatch(fetchCombos());
  }, [dispatch]);

  const handleCreate = async () => {
    if (
      !newCombo.title ||
      newCombo.productId.length < 2 ||
      newCombo.comboPrice.length < 2
    ) {
      alert(
        "Title, at least two product IDs, and their respective combo prices are required"
      );
      return;
    }

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("title", newCombo.title);
    formData.append("description", newCombo.description);
    formData.append("isPrepaidOnly", newCombo.isPrepaidOnly);
    formData.append("isActive", newCombo.isActive);

    // Append arrays as JSON strings
    formData.append("productId", JSON.stringify(newCombo.productId));
    formData.append("comboPrice", JSON.stringify(newCombo.comboPrice));

    // Append image if selected
    if (newComboImage) {
      formData.append("file", newComboImage);
    }

    const res = await dispatch(createCombo(formData));
    if (res.payload) {
      handleReset();
      //
    }
  };

  const handleReset = () => {
    setNewCombo({
      title: "",
      description: "",
      isPrepaidOnly: true,
      isActive: true,
      productId: ["", ""],
      comboPrice: [0, 0],
    });
    setNewComboImage(null);
    setNewComboImagePreview(null);
  };

  const handleUpdate = () => {
    if (
      editCombo &&
      editCombo.productId.length >= 2 &&
      editCombo.comboPrice.length >= 2
    ) {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("title", editCombo.title);
      formData.append("description", editCombo.description);
      formData.append("isPrepaidOnly", editCombo.isPrepaidOnly);
      formData.append("isActive", editCombo.isActive);

      // Append arrays as JSON strings
      formData.append("productId", JSON.stringify(editCombo.productId));
      formData.append("comboPrice", JSON.stringify(editCombo.comboPrice));

      // Append image if selected
      if (editComboImage) {
        formData.append("file", editComboImage);
      }

      dispatch(updateCombo({ id: editCombo._id, comboData: formData }));
      setEditCombo(null);
      setEditComboImage(null);
      setEditComboImagePreview(null);
    } else {
      alert(
        "At least two product IDs and their respective combo prices are required"
      );
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCombo(id));
  };

  const handleToggleStarred = async (combo) => {
    await dispatch(updateToggleStarredCombo(combo._id));
  };

  const handleNewComboImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewComboImage(file);
      const reader = new FileReader();
      reader.onload = () => setNewComboImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle image selection for edit combo
  const handleEditComboImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditComboImage(file);
      const reader = new FileReader();
      reader.onload = () => setEditComboImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Combos</h2>
        <ComboDialog
          type="create"
          combo={newCombo}
          setCombo={setNewCombo}
          image={newComboImage}
          setImage={setNewComboImage}
          imagePreview={newComboImagePreview}
          setImagePreview={setNewComboImagePreview}
          onSubmit={handleCreate}
          onReset={handleReset}
          taskLoading={taskLoading}
          trigger={
            <Button className="bg-green-500 hover:bg-green-600">
              Create Combo
            </Button>
          }
        />
      </div>

      <ComboTable
        combos={combos}
        loading={loading}
        taskLoading={taskLoading}
        onEdit={(combo) => {
          setEditCombo({
            ...combo,
            productId: combo.products.map((product) => product.productId),
            comboPrice: combo.products.map((product) => product.comboPrice),
          });
          setEditComboImagePreview(combo.imageUrl || null);
        }}
        onDelete={handleDelete}
        onToggleStarred={handleToggleStarred}
        onViewDetails={setSelectedCombo}
        editCombo={editCombo}
        setEditCombo={setEditCombo}
        editComboImage={editComboImage}
        setEditComboImage={setEditComboImage}
        editComboImagePreview={editComboImagePreview}
        setEditComboImagePreview={setEditComboImagePreview}
        handleUpdate={handleUpdate}
        handleEditComboImageChange={handleEditComboImageChange}
      />

      {/* Modal for Combo Details */}
      {selectedCombo && (
        <Dialog
          open={!!selectedCombo}
          onOpenChange={() => setSelectedCombo(null)}
        >
          <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCombo.title}</DialogTitle>
              <DialogDescription>
                {selectedCombo?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-between items-center gap-10">
              {/* Display combo image in details modal */}
              {selectedCombo.imageUrl && (
                <div className="mb-4">
                  <img
                    src={selectedCombo.imageUrl}
                    alt={selectedCombo.title}
                    className="w-[300px] h-[300px] object-cover rounded"
                  />
                </div>
              )}

              <div>
                {selectedCombo.products.map((product, index) => (
                  <div key={index} className="mb-2 text-sm flex items-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-24 h-24 object-cover mb-2"
                    />
                    <div className="ml-4 flex flex-col gap-4">
                      <p>
                        <strong className="pr-2">Name:</strong> {product.name}
                      </p>
                      <p>
                        <strong className="pr-2">Combo Price:</strong> ₹
                        {product.comboPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedCombo(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Combos;
