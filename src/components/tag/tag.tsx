import { Minus, Plus } from "lucide-react";

type TagProps = {
  isSelect: boolean;
  onClick?: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Tag = ({ children, isSelect = false, onClick }: TagProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-2 rounded-full text-label-medium-size flex
        items-center transition-colors gap-1
        ${isSelect ? "bg-accent-primary" : "bg-accent-primary-light"}`
      }
    >
      {isSelect ? <Plus size={17} /> : <Minus size={17} />}
      {children}
    </button>
  )
}