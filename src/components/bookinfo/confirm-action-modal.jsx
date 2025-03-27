"use client"
import { motion, AnimatePresence } from "framer-motion"

const ConfirmActionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor = "emerald" }) => {
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  const getColorClasses = () => {
    switch (confirmColor) {
      case "rose":
        return "bg-rose-600 hover:bg-rose-700"
      case "amber":
        return "bg-amber-600 hover:bg-amber-700"
      case "blue":
        return "bg-blue-600 hover:bg-blue-700"
      case "emerald":
      default:
        return "bg-emerald-600 hover:bg-emerald-700"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
            variants={contentVariants}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-center mb-4 text-slate-800">{title}</h3>

              <p className="text-slate-600 text-center mb-6">{message}</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-6 py-2 text-white rounded-lg transition-colors ${getColorClasses()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmActionModal

