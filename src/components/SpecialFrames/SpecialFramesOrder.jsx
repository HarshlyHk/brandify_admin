import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecialFrames,
  updateSpecialFrameOrder,
  toggleSpecialFrameStatus,
} from "@/features/specialFramesSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CSS } from "@dnd-kit/utilities";

// SortableItem wrapper
const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      {children.props.children}
    </tr>
  );
};

const SpecialFramesOrderUpdate = () => {
  const dispatch = useDispatch();
  const { specialFrames, loading } = useSelector((state) => state.specialFrames);
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchSpecialFrames());
  }, [dispatch]);

  useEffect(() => {
    console.log("Special Frames:", specialFrames);
    if (specialFrames?.length > 0) {
      setItems(specialFrames);
    }
  }, [specialFrames]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      const updatedOrder = reorderedItems.map((item, index) => ({
        ...item,
        order: index,
      }));

      console.log("Reordered Items:", reorderedItems);

      setItems(reorderedItems);
      dispatch(updateSpecialFrameOrder(updatedOrder));
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleSpecialFrameStatus(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reorder Special Frames</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Preview</TableCell>
                  <TableCell className="text-end">Name</TableCell>
                  <TableCell className="text-end">Product URL</TableCell>
                  <TableCell className="text-end">Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((specialFrame) => (
                  <SortableItem key={specialFrame._id} id={specialFrame._id}>
                    <TableRow>
                      <TableCell>
                        <div className="w-28 h-28 rounded-md overflow-hidden">
                          <img
                            src={specialFrame.thumbnailUrl || specialFrame.imageUrl}
                            alt={specialFrame.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        {specialFrame.name}
                      </TableCell>
                      <TableCell className="text-end">
                        {specialFrame.productUrl === "#" ? "No URL" : (
                          <a
                            href={specialFrame.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Product
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center justify-end space-x-2">
                          {/* <Switch
                            checked={specialFrame.isActive}
                            onCheckedChange={() => handleToggleStatus(specialFrame._id)}
                          /> */}
                          <span className="text-sm">
                            {specialFrame.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </SortableItem>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SpecialFramesOrderUpdate;
