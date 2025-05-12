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
  fetchLookBooks,
  updateLookBookOrder,
  toggleLookBookStatus,
} from "@/features/lookBookSlice";
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

const LookBookOrderUpdate = () => {
  const dispatch = useDispatch();
  const { lookBooks, loading } = useSelector((state) => state.lookBook);
  const [items, setItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchLookBooks());
  }, [dispatch]);

  useEffect(() => {
    console.log("LookBooks:", lookBooks);
    if (lookBooks?.length > 0) {
      setItems(lookBooks);
    }
  }, [lookBooks]);

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
      dispatch(updateLookBookOrder(updatedOrder)); // Ensure this matches the backend API
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleLookBookStatus(id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reorder LookBooks</h2>
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
                  <TableCell className="text-end">Product Url</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((lookBook) => (
                  <SortableItem key={lookBook._id} id={lookBook._id}>
                    <TableRow>
                      <TableCell>
                        {lookBook?.imageUrl?.endsWith(".mp4") ? (
                          <video
                            src={lookBook.imageUrl}
                            autoPlay
                            muted
                            loop
                            className="w-28 h-28 object-contain rounded-md"
                          />
                        ) : (
                          <img
                            src={lookBook.imageUrl}
                            alt={lookBook.name}
                            className="w-28 h-28 object-contain rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-end">
                        {lookBook.name}
                      </TableCell>
                      <TableCell className="text-end">
                        {lookBook.productUrl}
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

export default LookBookOrderUpdate;
