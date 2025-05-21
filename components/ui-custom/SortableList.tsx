'use client'

import React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

type Item = { id: string; label: string }

const SortableItem = ({ id, label }: { id: string; label: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 mb-2 bg-white rounded-xl shadow-sm border flex items-center justify-between ${isDragging ? 'opacity-40 z-50' : ''}`}
    >
      <span className="text-gray-800">{label}</span>
      <button  {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1" aria-label="Drag handle">
        <GripHorizontal className="w-5 h-5 text-gray-500" />
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over?.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableItem key={item.id} id={item.id} label={item.label} />
          ))}
        </SortableContext>
      </DndContext>

      <Button className="mt-4 w-full">Submit Order</Button>
    </div>
  )
}
