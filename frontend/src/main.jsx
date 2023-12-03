import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'
import Room from './pages/Room'
import Game from './pages/Game'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/room/*',
    element: <Room />,
  },
  {
    path: '/game/*',
    element: <Game />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}> </RouterProvider>,
)
