import { useEffect, useRef, useState } from "react";
import { fetchNaturePhotos } from "../../apis/uplash.api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// Types
type Board = {
  id: string;
  title: string;
  background: string;
};

export default function Planifcation() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1",
      title: "Summer Board",
      background: "",
    },
    {
      id: "2",
      title: "Third Board",
      background: "",
    },
    {
      id: "3",
      title: "Second Board",
      background: "",
    },
    {
      id: "4",
      title: "My Board",
      background: "",
    },
  ]);
  const [photos, setPhotos] = useState<string[]>([]);
  const createButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await fetchNaturePhotos(1, 9);
        setPhotos(data);

        // Update existing boards with photos from API
        setBoards((prevBoards) =>
          prevBoards.map((board, index) => ({
            ...board,
            background: board.background || data[index] || data[0],
          }))
        );
      } catch (error) {
        toast.error("Failed to fetch photos");
        console.log(error);
      }
    };

    fetchPhotos();
  }, []);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Set default selected background when photos are loaded
  useEffect(() => {
    if (photos.length > 0 && selectedBackground === "") {
      setSelectedBackground(photos[0]);
    }
  }, [photos, selectedBackground, setSelectedBackground]);

  const MAX_BOARDS_FREE = 5;
  const remainingBoards = MAX_BOARDS_FREE - boards.length;

  const handleCreateBoard = () => {
    if (remainingBoards <= 0) return;

    if (newBoardTitle.trim() === "") {
      setNewBoardTitle("Untitled Board");
    }

    const newBoard: Board = {
      id: Date.now().toString(),
      title: newBoardTitle.trim() || "Untitled Board",
      background: selectedBackground, // Use the actually selected background
    };

    setBoards([...boards, newBoard]);
    setCreateModalOpen(false);
    setNewBoardTitle("");
    setSelectedBackground(photos[0]); // Reset to first photo for next time
  };

  const openCreateModal = () => {
    if (remainingBoards > 0) {
      setCreateModalOpen(true);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="bg-indigo-500 text-white p-2 rounded-lg mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">Lorem Inc.</h1>
          <span className="text-sm text-gray-500">Free</span>
        </div>
      </div>

      {/* Boards Section */}
      <div className="mb-6">
        <h2 className="flex items-center text-gray-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Your boards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link
              to={`/Calender?bg=${board.background}`}
              key={board.id}
              className="bg-cover bg-center h-40 rounded-lg shadow-md overflow-hidden relative cursor-pointer"
              style={{ backgroundImage: `url(${board.background})` }}
            >
              <div className="absolute inset-0 bg- bg-opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-medium text-lg">
                  {board.title}
                </h3>
              </div>
            </Link>
          ))}

          {/* Create New Board Button */}
          <div
            className="h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer relative"
            ref={createButtonRef}
            onClick={openCreateModal}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <p className="text-gray-600 font-medium">Create new board</p>
            <p className="text-sm text-gray-500">{remainingBoards} remaining</p>

            {/* Tooltip */}
            {tooltipVisible && remainingBoards <= 1 && (
              <div className="absolute -bottom-16 left-0 bg-white p-3 rounded shadow-lg w-64 text-sm text-gray-600">
                Free Workspaces can have up to 5 open boards. For unlimited
                boards, upgrade this Workspace.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Board Modal */}
      {createModalOpen && (
        <div className="fixed inset-0  bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fade-in">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Create board</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {photos.map((bg, index) => (
                  <div
                    key={index}
                    className={`h-16 rounded bg-cover bg-center cursor-pointer ${
                      selectedBackground === bg ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundImage: `url(${bg})` }}
                    onClick={() => setSelectedBackground(bg)}
                  />
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Board title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Enter board title"
                />
              </div>

              <button
                onClick={handleCreateBoard}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
