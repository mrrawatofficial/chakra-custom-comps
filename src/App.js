import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FormStep from "./examples/FormStep";
import FileInput from "./examples/FileInput";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/wizard" element={<FormStep />} />
				<Route path="/file-input" element={<FileInput />} />
			</Routes>
		</BrowserRouter>
	);
};
export default App;
