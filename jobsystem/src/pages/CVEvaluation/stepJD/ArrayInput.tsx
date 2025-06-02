import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface ArrayInputProps {
  label: string
  items: string[]
  placeholder: string
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  items,
  placeholder,
  onAdd,
  onRemove,
  onChange,
}) => {
  const displayItems = items.length === 0 ? [""] : items

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-300">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="text-blue-400 hover:text-blue-300 h-6 w-6 p-0"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="space-y-1">
        {displayItems.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                if (items.length === 0 && index === 0) {
                  onChange(index, e.target.value)
                } else {
                  onChange(index, e.target.value)
                }
              }}
              placeholder={placeholder}
              className="bg-slate-700 border-slate-600 text-white h-8 text-sm"
            />
            {(items.length > 0 || displayItems.length > 1) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-400 hover:text-red-300 h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
