import React from 'react'
import {
    createHashRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'
import Sections from './components/Sections'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import LayoutOrgSelected from './components/LayoutOrgSelected'
import Table from './components/Table/Table'
import TableByEndpointPage from './components/TableByEndpoint/TableByEndpointPage'
import TableInventory from './components/TableInventory'
import TableSession from './components/Session/TableSession/TableSession'
import TableSessionModalCheck from './components/Session/TableSession/TableSessionModalCheck'
import TableSessionModalCheckWorker from './components/Session/TableSession/TableSessionModalCheckWorker'
import TableSessionElementHistory from './components/Session/TableSessionElement/TableSessionElementHistory'
// import TableSessionRegister from './components/Session/Register'
import TableSessionRegisterElement from './components/Session/Register/Element'
// import TableSessionSecurity from './components/Session/Security'
import TableSessionSecurityElement from './components/Session/Security/Element'
// import TableSessionInventory from './components/Session/Inventory'
import TableSessionInventoryElement from './components/Session/Inventory/Element'
// import TableSessionRegisterInventory from './components/Session/RegisterInventory'
import TableSessionRegisterInventoryElement from './components/Session/RegisterInventory/Element'
// import TableSessionKey from './components/Session/Key'
import TableSessionKeyElement from './components/Session/Key/Element'
import TableWorkingArea from './components/TableWorkingArea'
import createLoader from './helpers/loaders/createLoader'
import createNestedLoader from './helpers/loaders/createNestedLoader'
import editLoader from './helpers/loaders/editLoader'
import editNestedLoader from './helpers/loaders/editNestedLoader'
import orgFromUrlLoader from './helpers/loaders/orgFromUrlLoader'
import sessionElementLoader from './helpers/loaders/sessionElementLoader'
import tableByEndpointLoader from './helpers/loaders/tableByEndpointLoader'
import tableLoader from './helpers/loaders/tableLoader'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import MainPageOrgSelected from './pages/MainPageOrgSelected'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import PrivateRoute from './utils/PrivateRoute'
import sessionSecurityElementLoader from './helpers/loaders/sessionSecurityElementLoader'
import orgSettingsLoader from './helpers/loaders/orgSettingsLoader'
import OrgSettings from './components/Sections/OrgSettings'

const router = createHashRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<PrivateRoute />}>
                <Route
                    path='/'
                    element={<Layout />}
                    errorElement={<ErrorBoundary />}
                >
                    <Route
                        index
                        element={<MainPage />}
                        errorElement={<ErrorBoundary />}
                    />
                </Route>
                <Route
                    path=':orgId/'
                    element={<LayoutOrgSelected />}
                    loader={orgFromUrlLoader}
                    errorElement={<ErrorBoundary />}
                >
                    <Route
                        index
                        element={<MainPageOrgSelected />}
                        errorElement={<ErrorBoundary />}
                    />

                    <Route path='device'>
                        <Route
                            index
                            element={<Table />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    <Route path='location'>
                        <Route
                            index
                            element={<Table />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />

                        <Route path=':id/edit'>
                            <Route
                                index
                                element={<Sections.Location />}
                                loader={editLoader}
                                errorElement={<ErrorBoundary />}
                            />
                            <Route
                                path='object/'
                                element={<TableByEndpointPage />}
                                loader={tableByEndpointLoader}
                                errorElement={<ErrorBoundary />}
                            />
                            <Route
                                path='object/create'
                                element={<Sections.ObjectNestedLocation />}
                                loader={createNestedLoader}
                                errorElement={<ErrorBoundary />}
                            />
                            <Route
                                path='object/:extraId/edit'
                                element={<Sections.ObjectNestedLocation />}
                                loader={editNestedLoader}
                                errorElement={<ErrorBoundary />}
                            />
                            <Route />
                        </Route>
                        <Route
                            path='create'
                            element={<Sections.Location />}
                            loader={createLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    <Route path='worker'>
                        <Route
                            index
                            element={<Table />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />

                        <Route
                            path=':id/edit'
                            element={<Sections.Worker />}
                            loader={editLoader}
                        />
                    </Route>
                    <Route path='working-area'>
                        <Route
                            index
                            element={<TableWorkingArea />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />

                        <Route path=':id/edit'>
                            <Route
                                index
                                element={<Sections.WorkingArea />}
                                loader={editLoader}
                                errorElement={<ErrorBoundary />}
                            />

                            <Route path='session/'>
                                <Route
                                    index
                                    element={<TableSession />}
                                    loader={tableByEndpointLoader}
                                    errorElement={<ErrorBoundary />}
                                />

                                <Route
                                    path=':extraId/element/'
                                    element={<TableSessionElementHistory />}
                                    loader={sessionElementLoader}
                                    errorElement={<ErrorBoundary />}
                                />

                                <Route path='register/'>
                                    <Route
                                        index
                                        element={<TableSessionModalCheck sessionType='register' />}
                                        loader={tableByEndpointLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                    <Route
                                        path=':extraId/element/'
                                        element={
                                            <TableSessionRegisterElement />
                                        }
                                        loader={sessionElementLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                </Route>

                                <Route path='security/'>
                                    <Route
                                        index
                                        element={<TableSessionModalCheckWorker sessionType='security' />}
                                        loader={tableByEndpointLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                    <Route
                                        path=':extraId/element/:workerOrgId/:workerId/'
                                        element={
                                            <TableSessionSecurityElement />
                                        }
                                        loader={sessionSecurityElementLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                </Route>

                                <Route path='register_inventory/'>
                                    <Route
                                        index
                                        element={<TableSessionModalCheckWorker sessionType='register_inventory' />}
                                        loader={tableByEndpointLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                    <Route
                                        path=':extraId/element/:workerOrgId/:workerId/'
                                        element={
                                            <TableSessionRegisterInventoryElement />
                                        }
                                        loader={sessionSecurityElementLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                </Route>

                                <Route path='inventory/'>
                                    <Route
                                        index
                                        element={<TableSessionModalCheckWorker sessionType='inventory' />}
                                        loader={tableByEndpointLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                    <Route
                                        path=':extraId/element/:workerOrgId/:workerId/'
                                        element={
                                            <TableSessionInventoryElement />
                                        }
                                        loader={sessionSecurityElementLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                </Route>

                                <Route path='key/'>
                                    <Route
                                        index
                                        element={<TableSessionModalCheckWorker sessionType='key' />}
                                        loader={tableByEndpointLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                    <Route
                                        path=':extraId/element/:workerOrgId/:workerId/'
                                        element={
                                            <TableSessionKeyElement />
                                        }
                                        loader={sessionSecurityElementLoader}
                                        errorElement={<ErrorBoundary />}
                                    />
                                </Route>
                            </Route>
                            <Route
                                path='session/:extraId/edit'
                                element={<Sections.SessionNestedWorkingArea />}
                                loader={createNestedLoader}
                                errorElement={<ErrorBoundary />}
                            />
                            <Route />
                        </Route>
                        <Route
                            path='create'
                            element={<Sections.WorkingArea />}
                            loader={createLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    <Route path='permission-group'>
                        <Route
                            index
                            element={<Table />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />

                        <Route
                            path=':id/edit'
                            element={<Sections.PermissionGroup />}
                            loader={editLoader}
                            errorElement={<ErrorBoundary />}
                        />
                        <Route
                            path='create'
                            element={<Sections.PermissionGroup />}
                            loader={createLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    {/* <Route path='permission-level'>
                        <Route index element={<Table />} loader={tableLoader} errorElement={<ErrorBoundary />} />
                    </Route> */}
                    <Route path='inventory'>
                        <Route
                            index
                            element={<TableInventory />}
                            loader={tableLoader}
                            errorElement={<ErrorBoundary />}
                        />

                        <Route path=':id/edit'>
                            <Route
                                index
                                element={<Sections.Inventory />}
                                loader={editLoader}
                                errorElement={<ErrorBoundary />}
                            />
                        </Route>
                        <Route
                            path='create'
                            element={<Sections.Inventory />}
                            loader={createLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    <Route path='org-settings'>
                        <Route
                            index
                            element={<OrgSettings />}
                            loader={orgSettingsLoader}
                            errorElement={<ErrorBoundary />}
                        />
                    </Route>
                    <Route path='*' element={<NotFoundPage />} />
                </Route>
            </Route>
            <Route
                path='/login'
                element={<LoginPage />}
                errorElement={<ErrorBoundary />}
            />
            <Route
                path='/register'
                element={<RegisterPage />}
                errorElement={<ErrorBoundary />}
            />
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='*' element={<NotFoundPage />} />
        </Route>,
    ),
)

export default router
