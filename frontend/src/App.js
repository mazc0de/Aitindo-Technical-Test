import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineCheck, HiOutlineChevronDown, HiOutlineTrash } from "react-icons/hi";
import { Fragment, useEffect, useState } from "react";
import { priorities } from "./utils/priorities";
import { Header, Modal } from "./Components";
import axios from "axios";

const App = () => {
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]);
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);

    const BASE_API_URL = "http://localhost:8888";

    useEffect(() => {
        const fetchAllTodos = async () => {
            try {
                const res = await axios.get(`${BASE_API_URL}/api/v1/todo`);
                setTodos(res.data.data);
            } catch (error) {
                console.log("Error : ", error.message);
            }
        };

        fetchAllTodos();
    }, [loading]);

    const toggleModal = (id) => {
        setDeleteId(id);
        console.log(deleteId);
        setIsModalOpen(!isModalOpen);
    };

    const handleInputTodo = (e) => {
        setTodo(e.target.value);
    };

    const submitTodo = async () => {
        if (todo.length === 0) {
            setIsError(true);
            setError("Please input the task!");
            console.log("Please input the task!");
            return;
        }
        if (selectedPriority.name === "Select Priority") {
            setIsError(true);
            setError("You must select the priority!");
            console.log("You must select the priority!");
            return;
        }
        setIsError(false);

        try {
            const res = await axios.post(`${BASE_API_URL}/api/v1/todo`, { title: todo, priority: selectedPriority.name });
            console.log(res);
            setTodo("");
            setSelectedPriority(priorities[0]);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };

    const handleFinishedTodo = async (id, finished) => {
        try {
            const res = await axios.put(`${BASE_API_URL}/api/v1/todo/${id}`, { isFinished: !finished });
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            // console.log(res);
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };

    return (
        <>
            <div className="bg-blupurpGradient w-full min-h-screen py-2">
                <Header />
                <div className="flex w-[1280px] mx-auto gap-4 items-center">
                    <input type="text" placeholder="type your task..." className="w-full px-10 py-5 rounded-md text-2xl font-poppins outline-none" onChange={handleInputTodo} value={todo} />
                    <div className="relative w-72">
                        <Listbox value={selectedPriority} onChange={setSelectedPriority}>
                            <div className="relative mt-1">
                                <Listbox.Button className="inline-flex w-64 font-poppins justify-center rounded-md bg-black bg-opacity-20 px-10 py-5 text-2xl font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                    <span className="block truncate">{selectedPriority.name}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <HiOutlineChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Listbox.Options className="absolute mt-2 max-h-72 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-black bg-opacity-50 text-2xl text-white">
                                        {priorities.map((person, personIdx) => (
                                            <Listbox.Option
                                                key={personIdx}
                                                className={({ active }) => ` text-lg relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 bg-opacity-20 text-white " : " text-white"}`}
                                                value={person}
                                                disabled={person.disable}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span className={`block truncate ${selected ? "font-poppins" : "font-poppins"}`}>{person.name}</span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                                                <HiOutlineCheck className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                    <button
                        className="inline-flex w-64 font-poppins justify-center rounded-md bg-black bg-opacity-20 px-10 py-5 text-2xl font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                        onClick={submitTodo}
                    >
                        Save
                    </button>
                </div>
                <div className="w-[1280px] mx-auto">
                    {isError && (
                        <>
                            <span className="font-poppins py-5 text-red-700 text-xl">{error}</span>
                        </>
                    )}
                    {todos.map(({ id, title, priority, isFinished }) => {
                        return (
                            <div className="w-full h-20 bg-white rounded-md flex my-2 items-center" key={id}>
                                <div className="w-24 flex justify-center">
                                    <input type="checkbox" className="w-6 h-6 text-green-600 border-0 rounded-md focus:ring-0" defaultChecked={isFinished} onChange={handleFinishedTodo.bind(null, id, isFinished)} />
                                </div>
                                <div className="w-[1088px]">
                                    <span className={`${isFinished && "line-through"} text-xl font-poppins font-normal`}>{title}</span>
                                </div>

                                <div className="w-24 flex justify-center">
                                    <HiOutlineTrash className="text-3xl cursor-pointer text-red-600" onClick={toggleModal.bind(null, id)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} toggleModal={toggleModal} deleteId={deleteId} setLoading={setLoading} />
        </>
    );
};

export default App;
