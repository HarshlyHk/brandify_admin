import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import ComboDialog from "./ComboDialog";

const ComboTable = ({
  combos,
  loading,
  taskLoading,
  onEdit,
  onDelete,
  onToggleStarred,
  onViewDetails,
  editCombo,
  setEditCombo,
  editComboImage,
  setEditComboImage,
  editComboImagePreview,
  setEditComboImagePreview,
  handleUpdate,
  handleEditComboImageChange,
}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Star</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {combos.map((combo) => (
          <TableRow key={combo._id}>
            <TableCell>
              {combo.imageUrl ? (
                <img
                  src={combo.thumbnailUrl || combo.imageUrl}
                  alt={combo.title}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}
            </TableCell>
            <TableCell>
              <button
                className="text-blue-500 underline cursor-pointer"
                onClick={() => onViewDetails(combo)}
              >
                {combo.title}
              </button>
            </TableCell>
            <TableCell className="max-w-60 truncate">
              {combo.description}
            </TableCell>
            <TableCell>{combo.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell className="text-center">
              <button onClick={() => onToggleStarred(combo)}>
                {combo.isStarred ? (
                  <FaStar size={20} />
                ) : (
                  <CiStar size={20} />
                )}
              </button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <ComboDialog
                  type="edit"
                  combo={editCombo}
                  setCombo={setEditCombo}
                  image={editComboImage}
                  setImage={setEditComboImage}
                  imagePreview={editComboImagePreview}
                  setImagePreview={setEditComboImagePreview}
                  onSubmit={handleUpdate}
                  taskLoading={taskLoading}
                  trigger={
                    <Button
                      onClick={() => {
                        setEditCombo({
                          ...combo,
                          productId: combo.products.map(
                            (product) => product.productId
                          ),
                          comboPrice: combo.products.map(
                            (product) => product.comboPrice
                          ),
                        });
                        setEditComboImagePreview(combo.imageUrl || null);
                      }}
                    >
                      Edit
                    </Button>
                  }
                />
                <Button
                  onClick={() => onDelete(combo._id)}
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
  );
};

export default ComboTable;
