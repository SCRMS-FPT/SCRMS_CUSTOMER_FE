"use client"

const CourtList = ({ courts, selectedCourtId, onSelectCourt }) => {
  return (
    <div className="court-list" style={{ width: '100%', padding: '20px' }}>
      <h2>Danh Sách Sân</h2>
      <div className="court-list-items" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {courts.length > 0 ? (
          courts.map((court) => (
            <div
              key={court.courtId}
              className={`court-list-item ${selectedCourtId === court.courtId ? "selected" : ""}`}
              onClick={() => onSelectCourt(court.courtId)}
              style={{ display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
            >
              <div className="court-list-item-avatar" style={{ marginRight: '20px' }}>
                <img src={court.images.avatar || "/placeholder.svg?height=150&width=150"} alt={court.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              </div>
              <div className="court-list-item-info" style={{ flex: 1 }}>
                <h3>{court.name}</h3>
                <p className="court-type">{court.court_type}</p>
                <span className={`court-status ${court.status}`}>
                  {court.status === "open" ? "Đang mở" : "Đã đóng"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-courts-message">
            <p>Không tìm thấy sân nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourtList

