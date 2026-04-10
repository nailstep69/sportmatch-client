import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import CreateTeam from "./pages/CreateTeam";
import MyTeams from "./pages/MyTeams";
import TeamRequests from "./pages/TeamRequests";
import MyRequests from "./pages/MyRequests";
import Matches from "./pages/Matches";
import MatchRequests from "./pages/MatchRequests";
import IncomingRequests from "./pages/IncomingRequests";
import OutgoingRequests from "./pages/OutgoingRequests";
import CurrentTeam from "./pages/CurrentTeam";
import TeamMatches from "./pages/TeamMatches";
import MatchHistory from "./pages/MatchHistory";
import MatchChat from "./pages/MatchChat";

// ADM PAGES
import AdminScheduledMatches from "./pages/AdminScheduledMatches";
import AdminReadyMatches from "./pages/AdminReadyMatches";
import AddSport from "./pages/AddSport";


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
        setLoading(false);
    }, []);

    if (loading) return <p>Загрузка...</p>;

    return (
        <Router>
            <Routes>


                <Route
                    path="/"
                    element={<Navigate to={isLoggedIn ? "/dashboard" : "/auth"} />}
                />


                <Route
                    path="/auth"
                    element={<AuthPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
                />


                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />}
                />


                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/auth" />}
                />


                <Route
                    path="/teams"
                    element={isLoggedIn ? <Teams /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/teams/create"
                    element={isLoggedIn ? <CreateTeam /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/teams/:id"
                    element={isLoggedIn ? <TeamDetails /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/my-teams"
                    element={isLoggedIn ? <MyTeams /> : <Navigate to="/auth" />}
                />


                <Route
                    path="/team-requests/:teamId"
                    element={isLoggedIn ? <TeamRequests /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/my-requests"
                    element={isLoggedIn ? <MyRequests /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/matches"
                    element={isLoggedIn ? <Matches /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/current-team"
                    element={isLoggedIn ? <CurrentTeam /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/match-history"
                    element={ isLoggedIn ? <MatchHistory /> : <Navigate to="/auth" />} />

                <Route
                    path="/team/:teamId/matches"
                    element={isLoggedIn ? <TeamMatches /> : <Navigate to="/auth" />}
                />

                {/* Чат матча */}
                <Route
                    path="/match-chat/:matchId"
                    element={isLoggedIn ? <MatchChat /> : <Navigate to="/auth" />}
                />


                <Route
                    path="/match-requests"
                    element={isLoggedIn ? <MatchRequests /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/match-requests/incoming/:teamId"
                    element={isLoggedIn ? <IncomingRequests /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/match-requests/outgoing/:teamId"
                    element={isLoggedIn ? <OutgoingRequests /> : <Navigate to="/auth" />}
                />


                //adm

                <Route
                    path="/admin/scheduled"
                    element={isLoggedIn ? <AdminScheduledMatches /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/admin/ready"
                    element={isLoggedIn ? <AdminReadyMatches /> : <Navigate to="/auth" />}
                />

                <Route
                    path="/add-sport"
                    element={isLoggedIn ? <AddSport/> : <Navigate to="/auth" />}
                />

            </Routes>
        </Router>
    );
}