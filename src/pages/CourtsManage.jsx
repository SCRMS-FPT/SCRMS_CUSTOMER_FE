"use client"

import { useState } from "react"
import { courtsData } from "../data/courtsData1"
import { sportsCentersData } from "../data/sportsCentersData" // Sửa đường dẫn import
import CourtList from "../components/CourtList"
import CourtDetail from "../components/CourtDetail"
import CourtForm from "../components/CourtForm"
import { Search } from "lucide-react"
import "../styles/CourtsManage.css"

const CourtsManage = () => {
  const [courts, setCourts] = useState(courtsData)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.court_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectCourt = (courtId) => {
    const court = courts.find((court) => court.courtId === courtId)
    setSelectedCourt(court)
    setIsEditing(false)
    setIsAdding(false)
  }

  const handleEditCourt = () => {
    setIsEditing(true)
    setIsAdding(false)
  }

  const handleAddCourt = () => {
    setSelectedCourt(null)
    setIsEditing(false)
    setIsAdding(true)
  }

  const handleSaveCourt = (courtData) => {
    if (isAdding) {
      // Generate a new ID for the court
      const newCourtId = `c${courts.length + 1}`
      const newCourt = { ...courtData, courtId: newCourtId }
      setCourts([...courts, newCourt])
      setSelectedCourt(newCourt)
    } else if (isEditing && selectedCourt) {
      // Update existing court
      const updatedCourts = courts.map((court) =>
        court.courtId === selectedCourt.courtId ? { ...courtData, courtId: selectedCourt.courtId } : court,
      )
      setCourts(updatedCourts)
      setSelectedCourt({ ...courtData, courtId: selectedCourt.courtId })
    }
    setIsEditing(false)
    setIsAdding(false)
  }

  const handleDeleteCourt = (courtId) => {
    const updatedCourts = courts.filter((court) => court.courtId !== courtId)
    setCourts(updatedCourts)
    setSelectedCourt(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
  }

  return (
    <div className="courts-manage-page">
      <header className="page-header">
        <div className="container">
          <h1>Quản Lý Sân</h1>
        </div>
      </header>

      <div className="search-section">
        <div className="container">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm sân..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-court-btn" onClick={handleAddCourt}>
              Thêm Sân Mới
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="courts-manage-content">
            <div className="courts-list-container">
              <CourtList
                courts={filteredCourts}
                selectedCourtId={selectedCourt?.courtId}
                onSelectCourt={handleSelectCourt}
              />
            </div>

            <div className="court-detail-container">
              {isAdding ? (
                <CourtForm onSave={handleSaveCourt} onCancel={handleCancel} sportsCenters={sportsCentersData} />
              ) : isEditing && selectedCourt ? (
                <CourtForm
                  court={selectedCourt}
                  onSave={handleSaveCourt}
                  onCancel={handleCancel}
                  sportsCenters={sportsCentersData}
                />
              ) : selectedCourt ? (
                <CourtDetail
                  court={selectedCourt}
                  onEdit={handleEditCourt}
                  onDelete={() => handleDeleteCourt(selectedCourt.courtId)}
                  sportsCenters={sportsCentersData}
                />
              ) : (
                <div className="no-court-selected">
                  <p>Vui lòng chọn một sân từ danh sách hoặc thêm sân mới</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <div className="container">
          <p> Hệ thống Quản Lý Sân</p>
        </div>
      </footer>
    </div>
  )
}

export default CourtsManage

