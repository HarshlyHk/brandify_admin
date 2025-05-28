import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCombos,
  createCombo,
  updateCombo,
  deleteCombo,
} from "@/features/comboSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const [editCombo, setEditCombo] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null); // State for selected combo

  useEffect(() => {
    dispatch(fetchCombos());
  }, [dispatch]);

  const handleCreate = () => {
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
    dispatch(createCombo(newCombo));
  };

  const handleUpdate = () => {
    if (
      editCombo &&
      editCombo.productId.length >= 2 &&
      editCombo.comboPrice.length >= 2
    ) {
      dispatch(updateCombo({ id: editCombo._id, comboData: editCombo }));
      setEditCombo(null);
    } else {
      alert(
        "At least two product IDs and their respective combo prices are required"
      );
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCombo(id));
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Combos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              Create Combo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Combo</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              value={newCombo.title}
              onChange={(e) =>
                setNewCombo({ ...newCombo, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newCombo.description}
              onChange={(e) =>
                setNewCombo({ ...newCombo, description: e.target.value })
              }
            />

            <div className="mt-4">
              <h4 className="font-medium mb-2">Products and Prices</h4>
              {newCombo.productId.map((id, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <Input
                    placeholder={`Product ID ${index + 1}`}
                    value={id}
                    onChange={(e) => {
                      const updated = [...newCombo.productId];
                      updated[index] = e.target.value;
                      setNewCombo({ ...newCombo, productId: updated });
                    }}
                  />
                  <Input
                    placeholder={`Combo Price ${index + 1}`}
                    type="number"
                    value={newCombo.comboPrice[index] || ""}
                    onChange={(e) => {
                      const updated = [...newCombo.comboPrice];
                      updated[index] = Number(e.target.value);
                      setNewCombo({ ...newCombo, comboPrice: updated });
                    }}
                  />
                  {newCombo.productId.length > 2 && (
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => {
                        const updatedIds = [...newCombo.productId];
                        const updatedPrices = [...newCombo.comboPrice];
                        updatedIds.splice(index, 1);
                        updatedPrices.splice(index, 1);
                        setNewCombo({
                          ...newCombo,
                          productId: updatedIds,
                          comboPrice: updatedPrices,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setNewCombo({
                    ...newCombo,
                    productId: [...newCombo.productId, ""],
                    comboPrice: [...newCombo.comboPrice, 0],
                  });
                }}
              >
                + Add Product
              </Button>
            </div>

            <div className="mt-4">
              <Select
                value={newCombo.isPrepaidOnly ? "prepaid" : "all"}
                onValueChange={(value) =>
                  setNewCombo({
                    ...newCombo,
                    isPrepaidOnly: value === "prepaid",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Type</SelectLabel>
                    <SelectItem value="prepaid">Prepaid Only</SelectItem>
                    <SelectItem value="all">All Payments</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-4">
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() =>
                  setNewCombo({
                    title: "",
                    description: "",
                    isPrepaidOnly: false,
                    isActive: true,
                    productId: ["", ""],
                    comboPrice: [0, 0],
                  })
                }
              >
                Reset
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-green-500 hover:bg-green-600"
                disabled={taskLoading}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combos.map((combo) => (
              <TableRow key={combo._id}>
                <TableCell>
                  <button
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => setSelectedCombo(combo)}
                  >
                    {combo.title}
                  </button>
                </TableCell>
                <TableCell className=" max-w-60 truncate">{combo.description}</TableCell>
                <TableCell>{combo.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            setEditCombo({
                              ...combo,
                              productId: combo.products.map(
                                (product) => product.productId
                              ),
                              comboPrice: combo.products.map(
                                (product) => product.comboPrice
                              ),
                            })
                          }
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Combo</DialogTitle>
                        </DialogHeader>
                        <Input
                          placeholder="Title"
                          value={editCombo?.title || ""}
                          onChange={(e) =>
                            setEditCombo({
                              ...editCombo,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          value={editCombo?.description || ""}
                          onChange={(e) =>
                            setEditCombo({
                              ...editCombo,
                              description: e.target.value,
                            })
                          }
                        />
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            Products and Prices
                          </h4>
                          {editCombo?.productId.map((id, index) => (
                            <div
                              key={index}
                              className="flex gap-2 items-center mb-2"
                            >
                              <Input
                                placeholder={`Product ID ${index + 1}`}
                                value={id}
                                onChange={(e) => {
                                  const updatedIds = [...editCombo.productId];
                                  updatedIds[index] = e.target.value;
                                  setEditCombo({
                                    ...editCombo,
                                    productId: updatedIds,
                                  });
                                }}
                              />
                              <Input
                                placeholder={`Combo Price ${index + 1}`}
                                type="number"
                                value={editCombo.comboPrice[index] || ""}
                                onChange={(e) => {
                                  const updatedPrices = [
                                    ...editCombo.comboPrice,
                                  ];
                                  updatedPrices[index] = Number(e.target.value);
                                  setEditCombo({
                                    ...editCombo,
                                    comboPrice: updatedPrices,
                                  });
                                }}
                              />
                              {editCombo.productId.length > 2 && (
                                <Button
                                  variant="outline"
                                  className="text-red-500"
                                  onClick={() => {
                                    const updatedIds = [...editCombo.productId];
                                    const updatedPrices = [
                                      ...editCombo.comboPrice,
                                    ];
                                    updatedIds.splice(index, 1);
                                    updatedPrices.splice(index, 1);
                                    setEditCombo({
                                      ...editCombo,
                                      productId: updatedIds,
                                      comboPrice: updatedPrices,
                                    });
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              setEditCombo({
                                ...editCombo,
                                productId: [...editCombo.productId, ""],
                                comboPrice: [...editCombo.comboPrice, 0],
                              });
                            }}
                          >
                            + Add Product
                          </Button>
                        </div>

                        <div className="mt-4">
                          <Select
                            value={editCombo?.isPrepaidOnly ? "prepaid" : "all"}
                            onValueChange={(value) =>
                              setEditCombo({
                                ...editCombo,
                                isPrepaidOnly: value === "prepaid",
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Payment Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Payment Type</SelectLabel>
                                <SelectItem value="prepaid">
                                  Prepaid Only
                                </SelectItem>
                                <SelectItem value="all">
                                  All Payments
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <DialogFooter>
                          <Button
                            onClick={handleUpdate}
                            className="bg-green-500 hover:bg-green-600"
                            disabled={taskLoading}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => handleDelete(combo._id)}
                      className="bg-red-500"
                      disabled={taskLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal for Combo Details */}
      {selectedCombo && (
        <Dialog
          open={!!selectedCombo}
          onOpenChange={() => setSelectedCombo(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCombo.title}</DialogTitle>
              <DialogDescription>
                {selectedCombo?.description}
              </DialogDescription>
            </DialogHeader>
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
                      <strong className=" pr-2">Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong className=" pr-2">Combo Price:</strong> ₹
                      {product.comboPrice}
                    </p>
                  </div>
                </div>
              ))}
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
