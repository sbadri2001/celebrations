import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'md'
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className={`bg-white rounded-3xl w-full ${widthClasses[maxWidth]} p-6 relative border border-slate-100 shadow-2xl font-sans z-10`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-full transition-all cursor-pointer focus:outline-none"
              id="modal-close-btn"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              {icon && (
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#a83200] flex items-center justify-center shrink-0 shadow-3xs">
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-800 leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-slate-400 font-semibold mt-0.5 leading-normal">
                     {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="mt-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
