import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePopper } from "react-popper";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "./ui/utils";

export interface TourStep {
  targetId: string;
  title: string;
  body: string;
  buttonText: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  isVisible: boolean;
}

export function GuidedTour({ steps, onComplete, isVisible }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: steps[currentStep]?.placement || "bottom",
    modifiers: [
      { name: "offset", options: { offset: [0, 12] } },
      { name: "preventOverflow", options: { padding: 16 } },
      { name: "arrow", options: { padding: 12 } },
    ],
  });

  const findElement = useCallback(() => {
    if (!isVisible || !steps[currentStep]) return;
    const element = document.getElementById(steps[currentStep].targetId);
    if (element) {
      setReferenceElement(element);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isVisible, steps]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isVisible) {
      findElement();
    }
  }, [currentStep, isVisible, isMounted, findElement]);

  useEffect(() => {
    if (update) update();
  }, [currentStep, update, referenceElement]);

  if (!isMounted || !isVisible || !steps[currentStep]) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="z-[10000] pointer-events-auto w-[280px] sm:w-[320px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 relative"
        >
          {/* Arrow */}
          <div 
            className="absolute w-3 h-3 bg-white rotate-45 border-t border-l border-gray-50 -top-1.5 left-1/2 -translate-x-1/2" 
            style={{ 
              top: attributes.popper?.['data-popper-placement']?.startsWith('bottom') ? '-6px' : 'auto',
              bottom: attributes.popper?.['data-popper-placement']?.startsWith('top') ? '-6px' : 'auto',
              left: attributes.popper?.['data-popper-placement']?.startsWith('right') ? '-6px' : 'auto',
              right: attributes.popper?.['data-popper-placement']?.startsWith('left') ? '-6px' : 'auto',
            }}
          />

          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#006241] bg-[#006241]/5 px-2 py-0.5 rounded-full">
              {currentStep + 1} / {steps.length}
            </span>
            <button onClick={onComplete} className="text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="text-sm font-black text-gray-900 mb-1 leading-tight">{step.title}</h4>
          <p className="text-[11px] text-gray-500 font-medium mb-4 leading-normal">{step.body}</p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentStep ? "bg-[#006241] w-4" : "bg-gray-100 w-1"
                  )} 
                />
              ))}
            </div>
            
            <div className="flex gap-1.5">
               {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="h-8 px-2 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
               )}
               <button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    onComplete?.();
                  }
                }}
                className="bg-[#006241] text-white h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#004e34] transition-all flex items-center gap-1"
              >
                {step.buttonText}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
