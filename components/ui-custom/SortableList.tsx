'use client';

import React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = { id: string; label: string }

const SortableItem = ({ id, label, isDragging = false }: { id: string; label: string; isDragging?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isItemDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "transform",
    opacity: isDragging ? 0.4 : 1,  // mờ hơn khi kéo (opacity 0.4)
    boxShadow: isItemDragging || isDragging ? "0 8px 16px rgba(0,0,0,0.15)" : undefined,
    cursor: "default",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 mb-2 bg-white rounded-xl shadow border flex items-center justify-between select-none ${isItemDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      {...attributes}
      {...listeners}
    >
      <span className="text-gray-900 font-medium">{label}</span>
      <button className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600" aria-label="Drag handle">
        <GripHorizontal className="w-5 h-5" />
      </button>
    </div>
  )
}

export default function SortableList() {
  const [items, setItems] = React.useState<Item[]>([
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" },
    { id: "3", label: "Item 3" },
  ])

  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (<SortableItem key={item.id} id={item.id} label={item.label} />))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            // Thay vì preview item, tạo placeholder trống đúng kích thước item
            <div
              className="p-4 mb-2 rounded-xl border border-dashed border-gray-400 bg-transparent"
              style={{ width: "100%", height: 48 }} // chiều cao 48px tương đương p-4 + line-height khoảng 48px
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
        Submit Order
      </Button>
    </div>
  )
}
