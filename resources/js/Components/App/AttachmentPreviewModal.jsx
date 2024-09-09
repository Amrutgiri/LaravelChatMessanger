import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon,XMarkIcon,ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { isAudio, isImage, isVideo, isPdf,isPreviewable } from "@/helpers";

export default function AttachmentPreviewModal({
    attachments,
    index,
    show=false,
    onClose=()=>{}
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previewableAttachments=useMemo(()=>{
        return attachments.filter((attachment)=>isPreviewable(attachment));
    },[attachments])

    const attachment = useMemo(()=>{
        return previewableAttachments[currentIndex];
    },[attachments,currentIndex])

    // const previewableAttachments = useMemo(()=>{
    //     return attachments.filter((attachment)=>isPreviewable(attachment));
    // },[attachments])

    const close = ()=>{
        onClose();
    }

    const prev = ()=>{
        if(currentIndex===0){
            return;
        }
        setCurrentIndex(currentIndex-1);
    }

    const next = ()=>{
        if(currentIndex===previewableAttachments.length-1){
            return;
        }
        setCurrentIndex(currentIndex+1);
    }

    useEffect(()=>{
        setCurrentIndex(index);
    },[index])

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog as="div" id="modal" className="relative z-50" onClose={close}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="w-screen h-screen">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100  translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="flex flex-col w-full h-full overflow-hidden text-left align-middle transition-all transform shadow-xl bg-slate-800">
                                <button onClick={close} className="absolute z-40 flex items-center justify-center w-10 h-10 text-gray-100 transition rounded-full right-3 top-3 hover:bg-black/10">
                                    <XMarkIcon className="w-6 h-6"/>
                                </button>
                                <div className="relative h-full group">
                                    {currentIndex > 0 &&(
                                        <div onClick={prev} className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer left-4 top-1/2 bg-black/50">
                                            <ChevronLeftIcon className="w-12"/>

                                        </div>
                                    )}
                                    {currentIndex < previewableAttachments.length - 1 &&(
                                        <div onClick={next} className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer right-4 top-1/2 bg-black/50">
                                            <ChevronRightIcon className="w-12"/>
                                        </div>
                                    )}
                                    {attachment &&(
                                        <div className="flex items-center justify-center w-full h-full p-3">
                                            {isImage(attachment) && (
                                                <img src={attachment.url} className="max-w-full max-h-full" alt="" />
                                            )}
                                            {isVideo(attachment) && (
                                                <div className="flex items-center">
                                                    <video src={attachment.url} controls autoPlay>

                                                    </video>
                                                </div>
                                            )}
                                            {isAudio(attachment) &&(
                                                <div className="relative flex items-center justify-center">
                                                    <audio src={attachment.url} controls autoPlay></audio>
                                                </div>
                                            )}
                                            {isPdf(attachment) &&(
                                                    <iframe src={attachment.url} className="w-full h-full" />
                                            )}
                                            {!isPreviewable(attachment) &&(
                                                <div className="flex flex-col items-center justify-center p-32 text-gray-100">
                                                    <PaperClipIcon className="w-10 h-10 mb-3"/>
                                                    <small>{attachment.name}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}
