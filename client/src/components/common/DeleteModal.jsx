import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-dark-brown/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 ring-8 ring-red-50/50">
                            <Trash2 size={32} />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-dark-brown mb-2">{title}</h2>
                        <p className="text-gray-500 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all border-2 border-gray-100 uppercase tracking-wider text-xs"
                        >
                            No, Keep it
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-red-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-dark-brown hover:bg-gray-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;
