import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const ComboDialog = ({
  type, // "create" or "edit"
  combo,
  setCombo,
  image,
  setImage,
  imagePreview,
  setImagePreview,
  onSubmit,
  onReset,
  taskLoading,
  trigger,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const isEdit = type === "edit";

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Combo" : "Create New Combo"}
          </DialogTitle>
        </DialogHeader>

        {/* Image Upload Section */}
        <div className="flex justify-between gap-6">
          <div className="w-[300px] h-[300px]">
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Combo Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {(imagePreview || (isEdit && combo?.imageUrl)) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || combo?.imageUrl}
                    alt="Preview"
                    className="w-[300px] h-[300px] object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Input
              placeholder="Title"
              value={combo?.title || ""}
              onChange={(e) => setCombo({ ...combo, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={combo?.description || ""}
              onChange={(e) =>
                setCombo({ ...combo, description: e.target.value })
              }
            />

            <div className="mt-4">
              <h4 className="font-medium mb-2">Products and Prices</h4>
              {combo?.productId?.map((id, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <Input
                    placeholder={`Product ID ${index + 1}`}
                    value={id}
                    onChange={(e) => {
                      const updated = [...combo.productId];
                      updated[index] = e.target.value;
                      setCombo({ ...combo, productId: updated });
                    }}
                  />
                  <Input
                    placeholder={`Combo Price ${index + 1}`}
                    type="number"
                    value={combo.comboPrice[index] || ""}
                    onChange={(e) => {
                      const updated = [...combo.comboPrice];
                      updated[index] = Number(e.target.value);
                      setCombo({ ...combo, comboPrice: updated });
                    }}
                  />
                  {combo.productId.length > 2 && (
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => {
                        const updatedIds = [...combo.productId];
                        const updatedPrices = [...combo.comboPrice];
                        updatedIds.splice(index, 1);
                        updatedPrices.splice(index, 1);
                        setCombo({
                          ...combo,
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
                  setCombo({
                    ...combo,
                    productId: [...combo.productId, ""],
                    comboPrice: [...combo.comboPrice, 0],
                  });
                }}
              >
                + Add Product
              </Button>
            </div>

            <div className="mt-4">
              <Select
                value={combo?.isPrepaidOnly ? "prepaid" : "all"}
                onValueChange={(value) =>
                  setCombo({
                    ...combo,
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
          </div>
        </div>

        <DialogFooter className="mt-4">
          {!isEdit && (
            <Button className="bg-red-500 hover:bg-red-600" onClick={onReset}>
              Reset
            </Button>
          )}
          <Button
            onClick={onSubmit}
            className="bg-green-500 hover:bg-green-600"
            disabled={taskLoading}
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComboDialog;
