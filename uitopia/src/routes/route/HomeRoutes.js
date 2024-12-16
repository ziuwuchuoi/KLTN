import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/Home/HomePage';
import TourPage from '../../pages/Tour/TourPage';

function HomeRoutes() {
	return (
		<>
			<div>
				<Routes>
					<Route
						path="/"
						exact={true}
						element={<HomePage />}
					/>
					<Route
						path="/tour"
						element={<TourPage />}
					/>
				</Routes>
			</div>
		</>
	);
}

export default HomeRoutes;
