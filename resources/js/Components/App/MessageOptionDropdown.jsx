import { useEventBus } from "@/EventBus";
import { Menu, Transition } from "@headlessui/react";
import {
    EllipsisVerticalIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react";

export default function MessageOptionDropdown({ message }) {

    const {emit}= useEventBus();
    const onMessageDelete = () => {
        console.log("message deleted");
        axios.delete(route('message.destroy',message.id)).then((res)=>{
            console.log(res.data);
            emit('message.deleted',{message, prevMessage:res.data.message});
        }).catch((err)=>{
            console.log(err);
        })
    }
    return (
        <div className="absolute z-10 text-gray-100 -translate-y-1/2 right-full top-1/2">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 z-50 w-48 mt-2 bg-gray-800 rounded-md shadow-lg">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                       <TrashIcon className="w-4 h-4 mr-2 text-red-600"/>
                                       Delete
                                    </button>
                                )}
                            </Menu.Item>

                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
