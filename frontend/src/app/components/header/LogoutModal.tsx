"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onGoHome: () => void;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  onGoHome,
}: LogoutModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-pucara-primary transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-full bg-red-100 text-red-500 mb-3">
                    <XMarkIcon className="w-6 h-6" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-pucara-black"
                  >
                    ¿Cerrar sesión?
                  </Dialog.Title>
                  <p className="text-gray-500 mt-1">
                    ¿Estás seguro de que deseas salir de tu cuenta?
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onConfirm}
                    className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-all font-medium"
                  >
                    Estoy seguro
                  </button>
                  <button
                    onClick={onGoHome}
                    className="w-full border border-pucara-primary text-pucara-primary py-3 rounded-full hover:bg-pucara-primary/10 transition-all font-medium"
                  >
                    Ir a la página principal
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-full hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};