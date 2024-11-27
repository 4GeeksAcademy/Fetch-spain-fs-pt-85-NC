import React, { useEffect, useState } from "react";



//create your first component
const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [tareas, setTareas] = useState([]);
	const apiURL = "https://playground.4geeks.com/todo/todos/nachocordoba";

	// parte del GET
	const getInfoTareas = async () => {
        try {
            const response = await fetch(apiURL, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Error al obtener las tareas: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Datos obtenidos:", data);
            setTareas(data);
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        }
    };

	// parte del PUT
	const updateTareas = async (newTareas) => {
        try {
            const response = await fetch(apiURL, {
                method: "PUT",
                body: JSON.stringify(newTareas),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error al actualizar las tareas: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Datos actualizados:", data);
            setTareas(newTareas); // Actualizamos las tareas localmente tras el éxito
        } catch (error) {
            console.error("Error al actualizar las tareas:", error);
        }
    };

//Limpiador de tareas
const limpiarTareas = async () => {
	try {
		await updateTareas([]);
		setTareas([]);
		console.log("Todas las tareas han sido eliminadas.");
	} catch (error) {
		console.error("Error al limpiar las tareas:", error);
	}
};
//useEffect
	useEffect(()=>{
		getInfoTareas()
},[])

	return (
		<div className="container">
			<h1 className="text-center mt-5">Mis Tareas</h1>
			<ul className="list-group">
				<li>
					<input 
						type="text" 
						onChange={(e) => setInputValue(e.target.value)}
						value={inputValue}
						onKeyDown={(e) => {
							if (e.key === "Enter" && inputValue.trim() !== "") {
								// Usamos .concat() para añadir la nueva tarea
								setTareas(tareas.concat(inputValue));
								setInputValue("");
							}
						}}
						placeholder="Escribe aquí tu tarea"
					/>
				</li>
				{tareas.length === 0 ? (
					<li className="list-group-item text-center text-muted">No hay tareas pendientes</li>
				) : (
					tareas.map((item, index) => (
						<li key={index} className="list-group-item d-flex justify-content-between">
							<span>{item}</span>
							<i 
								className="fas fa-trash-alt eliminar"
								onClick={() => setTareas(tareas.filter((_, currentIndex) => index !== currentIndex))}
							></i>
						</li>
					))
				)}
			</ul>
			{tareas.length > 0 && (
				<div className="text-center mt-2">{tareas.length} {tareas.length === 1 ? "tarea" : "tareas"}</div>
			)}
			<button className="btn btn-danger mt-3" onClick={limpiarTareas}>
                Limpiar todas las tareas
            </button>
		</div>
	);
};



export default Home;
