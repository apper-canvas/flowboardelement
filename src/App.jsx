import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import BoardList from "@/components/pages/BoardList"
import BoardView from "@/components/pages/BoardView"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BoardList />} />
            <Route path="boards" element={<BoardList />} />
            <Route path="board/:boardId" element={<BoardView />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </BrowserRouter>
  )
}

export default App