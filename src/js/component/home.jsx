import React, { useEffect, useState } from "react";

// create your first component
const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [tareas, setTareas] = useState([]);
    const [error, setError] = useState(null);
    const apiURL = "https://playground.4geeks.com/todo/users/nachocordoba";
    const todosURL = "https://playground.4geeks.com/todo/todos/nachocordoba"; // URL para acceder a todas las tareas
    const deleteURL = "https://playground.4geeks.com/todo/todos/0"; // URL para eliminar todas las tareas
    const idURL = "https://playground.4geeks.com/todo/todos/13"; // URL para actualizar una tarea con id 13

    // Crear usuario
    const crearUsuario = async () => {
        try {
            const comprobarUsu = await fetch(apiURL, { method: "GET" });
            if (comprobarUsu.ok) {
                console.log("El usuario ya existe, no es necesario crear uno nuevo.");
                return;
            }

            const respuesta = await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "nachocordoba" }),
            });

            if (!respuesta.ok) {
                console.warn(`No se pudo crear el usuario: ${respuesta.statusText}`);
                setError(`No se pudo crear el usuario (${respuesta.statusText})`);
                return;
            }

            console.log("Usuario creado exitosamente.");
        } catch (error) {
            console.error("Error al crear el usuario:", error.message);
            setError("Ocurrió un error al crear el usuario.");
        }
    };

    // Obtener las tareas
    const getInfoTareas = async () => {
        try {
            const respuesta = await fetch(todosURL, { method: "GET" });
            if (!respuesta.ok) {
                console.warn(`No se pudo obtener las tareas: ${respuesta.statusText}`);
                setError(`No se pudo obtener las tareas (${respuesta.statusText})`);
                return;
            }
            const data = await respuesta.json();
            console.log("Datos obtenidos:", data);

            if (Array.isArray(data.todos)) {
                setTareas(data.todos);
            } else {
                setTareas([]);
            }
        } catch (error) {
            console.error("Error al obtener las tareas:", error.message);
            setError("Ocurrió un error al conectar con el servidor.");
        }
    };

    // Agregar tarea
    const agregarTareas = async (label) => {
        try {
            const nuevaTarea = {
                label,
                is_done: false,
                id: Date.now(), // Generamos un ID único para la tarea
            };

            // Hacemos PUT para reemplazar todas las tareas
            const respuesta = await fetch(todosURL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todos: [...tareas, nuevaTarea] }),
            });

            if (!respuesta.ok) {
                console.warn(`No se pudo agregar la tarea: ${respuesta.statusText}`);
                setError(`No se pudo agregar la tarea (${respuesta.statusText})`);
                return;
            }

            console.log("Tarea agregada exitosamente.");
            await getInfoTareas();
        } catch (error) {
            console.error("Error al agregar la tarea:", error.message);
            setError("Ocurrió un error al agregar la tarea.");
        }
    };

    // Eliminar tarea
    const eliminarTarea = async (id) => {
        try {
            const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);

            const respuesta = await fetch(todosURL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todos: nuevasTareas }),
            });

            if (!respuesta.ok) {
                console.warn(`No se pudo eliminar la tarea: ${respuesta.statusText}`);
                setError(`No se pudo eliminar la tarea (${respuesta.statusText})`);
                return;
            }

            console.log("Tarea eliminada exitosamente.");
            await getInfoTareas();
        } catch (error) {
            console.error("Error al eliminar la tarea:", error.message);
            setError("Ocurrió un error al eliminar la tarea.");
        }
    };

    // Limpiar todas las tareas
    const limpiarTareas = async () => {
        try {
            const respuesta = await fetch(deleteURL, {
                method: "DELETE", // Usamos DELETE para borrar todas las tareas
                headers: { "Content-Type": "application/json" },
            });

            if (!respuesta.ok) {
                console.warn(`No se pudieron limpiar las tareas: ${respuesta.statusText}`);
                setError(`No se pudieron limpiar las tareas (${respuesta.statusText})`);
                return;
            }

            setTareas([]); // Limpiamos las tareas localmente
            console.log("Todas las tareas han sido eliminadas.");
        } catch (error) {
            console.error("Error al limpiar las tareas:", error.message);
            setError("Ocurrió un error al limpiar las tareas.");
        }
    };

    // Actualizar tarea específica con PUT
    const actualizarTarea = async () => {
        try {
            const tareaActualizada = {
                label: "Tarea Actualizada", // Cambia el nombre de la tarea si lo deseas
                is_done: true, // Cambia el estado de la tarea si lo deseas
            };

            const respuesta = await fetch(idURL, {
                method: "PUT", // Usamos PUT para actualizar una tarea específica
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tareaActualizada),
            });

            if (!respuesta.ok) {
                console.warn(`No se pudo actualizar la tarea: ${respuesta.statusText}`);
                setError(`No se pudo actualizar la tarea (${respuesta.statusText})`);
                return;
            }

            console.log("Tarea actualizada exitosamente.");
            await getInfoTareas();
        } catch (error) {
            console.error("Error al actualizar la tarea:", error.message);
            setError("Ocurrió un error al actualizar la tarea.");
        }
    };

    useEffect(() => {
        (async () => {
            await crearUsuario();
            await getInfoTareas();
        })();
    }, []);

    return (
        <div className="container">
            <h1 className="text-center mt-5">Mis Tareas</h1>
            <ul className="list-group">
                <li className="list-group-item">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && inputValue.trim() !== "") {
                                agregarTareas(inputValue.trim());
                                setInputValue("");
                            }
                        }}
                        placeholder="Escribe aquí tu tarea"
                    />
                </li>
                {tareas.length === 0 ? (
                    <li className="list-group-item text-center text-muted">
                        No hay tareas pendientes
                    </li>
                ) : (
                    tareas.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>{item.label}</span>
                            <i
                                className="fas fa-trash-alt eliminar"
                                onClick={() => eliminarTarea(item.id)}
                            ></i>
                        </li>
                    ))
                )}
            </ul>
            {tareas.length > 0 && (
                <div className="text-center mt-2">
                    {tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}
                </div>
            )}
            <button className="btn btn-danger mt-3" onClick={limpiarTareas}>
                Limpiar todas las tareas
            </button>
            <button className="btn btn-warning mt-3" onClick={actualizarTarea}>
                Actualizar tarea específica
            </button>
            {error && <p className="text-danger text-center mt-2">{error}</p>}
        </div>
    );
};

export default Home;
