import { useState,Fragment } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Popover, Transition } from '@headlessui/react'


const MessageInput = ({ conversation = null }) => {
    const [newMassage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const onSendClick = () => {
        if(messageSending){
            return;
        }
        if (newMassage.trim() === "") {
            setInputErrorMessage(
                "Please enter a message or upload attachments"
            );
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        const formData = new FormData();
        formData.append("message", newMassage);
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
        setMessageSending(true);
        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(progress);
                },
            })
            .then((response) => {
                setMessageSending(false);
                setNewMessage("");
                // conversation.messages.push(response.data.message);
            })
            .catch((error) => {
                setMessageSending(false);
                console.log(error);
            });
    };

    const onLikeClick = () => {
        if(messageSending){
            return;
        }
        const data = {
            message:"👍"
        }
         if (conversation.is_user) {
            data["receiver_id"]= conversation.id;
        } else if (conversation.is_group) {
            data["group_id"]= conversation.id;
        }
        axios
            .post(route("message.store"),data)
    }


    return (
        <div className="flex flex-wrap items-start p-3 border-t border-slate-700">
            <div className="flex-1 order-2 p-2 xs:flex-none xs-order-1">
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute top-0 bottom-0 left-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="relative p-1 text-gray-400 hover:text-gray-300">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute top-0 bottom-0 left-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>

            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs-order-2  flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMassage}
                        onSend={onSendClick}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button
                        onClick={onSendClick}
                        disabled={messageSending}
                        className="rounded-l-none btn btn-info"
                    >
                        {/* {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )} */}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
            </div>

            <div className="flex order-3 p-2 xs:order-3">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute right-0 z-10 bottom-full">
                        <EmojiPicker theme="dark" onEmojiClick={ev=> setNewMessage(newMassage+ ev.emoji)}>

                        </EmojiPicker>
                    </Popover.Panel>
                </Popover>

                <button onClick={onLikeClick} className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
